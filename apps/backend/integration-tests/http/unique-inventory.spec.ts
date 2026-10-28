import { medusaIntegrationTestRunner } from "@medusajs/test-utils"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import type { MedusaContainer } from "@medusajs/framework/types"
import initialDataSeed from "../../src/migration-scripts/initial-data-seed"
import {
  SEGELSTUECK_HANDLE,
  SEGELSTUECK_SKU,
  seedSegelstueck,
} from "../../src/scripts/seed-segelstueck"

jest.setTimeout(300 * 1000)

const address = {
  first_name: "Test",
  last_name: "Kunde",
  address_1: "Teststrasse 1",
  city: "Berlin",
  postal_code: "10115",
  country_code: "de",
}

medusaIntegrationTestRunner({
  testSuite: ({ api, getContainer }) => {
    let headers: Record<string, string>
    let regionId: string

    const container = (): MedusaContainer => getContainer()

    beforeAll(async () => {
      await initialDataSeed({ container: container() })
    })

    beforeEach(async () => {
      const query = container().resolve(ContainerRegistrationKeys.QUERY)
      const { data: keys } = await query.graph({
        entity: "api_key",
        fields: ["token"],
        filters: { type: "publishable", title: "Segelstueck Storefront" },
      })
      const { data: regions } = await query.graph({
        entity: "region",
        fields: ["id"],
      })
      headers = { "x-publishable-api-key": keys[0].token }
      regionId = regions[0].id
    })

    const stockOf = async (variantId: string) => {
      const query = container().resolve(ContainerRegistrationKeys.QUERY)
      const { data } = await query.graph({
        entity: "variant",
        fields: [
          "inventory_items.inventory.location_levels.stocked_quantity",
          "inventory_items.inventory.location_levels.reserved_quantity",
        ],
        filters: { id: variantId },
      })
      const levels = data[0].inventory_items[0].inventory.location_levels
      return {
        stocked: levels.reduce((s, l) => s + Number(l.stocked_quantity), 0),
        reserved: levels.reduce((s, l) => s + Number(l.reserved_quantity), 0),
      }
    }

    const prepareCart = async (variantId: string, email = "test@example.com") => {
      const { data: c } = await api
        .post(
          "/store/carts",
          { region_id: regionId, items: [{ variant_id: variantId, quantity: 1 }] },
          { headers }
        )
        .catch((e) => {
          throw new Error(`create cart failed: ${JSON.stringify(e.response?.data)}`)
        })
      const cartId = c.cart.id
      await api.post(
        `/store/carts/${cartId}`,
        {
          email,
          shipping_address: address,
          billing_address: address,
        },
        { headers }
      )
      const { data: so } = await api.get(
        `/store/shipping-options?cart_id=${cartId}`,
        { headers }
      )
      await api.post(
        `/store/carts/${cartId}/shipping-methods`,
        { option_id: so.shipping_options[0].id },
        { headers }
      )
      const { data: pc } = await api.post(
        "/store/payment-collections",
        { cart_id: cartId },
        { headers }
      )
      await api.post(
        `/store/payment-collections/${pc.payment_collection.id}/payment-sessions`,
        { provider_id: "pp_system_default" },
        { headers }
      )
      return cartId
    }

    const complete = async (cartId: string) => {
      const res = await api
        .post(`/store/carts/${cartId}/complete`, {}, { headers })
        .catch((e) => e.response)
      return { status: res.status, type: res.data?.type, data: res.data }
    }

    it("seeding twice yields exactly one example bag with stock 1", async () => {
      await seedSegelstueck(container())
      await seedSegelstueck(container())

      const productService = container().resolve(Modules.PRODUCT)
      const products = await productService.listProducts(
        { handle: SEGELSTUECK_HANDLE },
        { relations: ["variants"] }
      )
      expect(products).toHaveLength(1)
      expect(products[0].variants).toHaveLength(1)
      expect(products[0].variants[0].sku).toEqual(SEGELSTUECK_SKU)
      expect(products[0].variants[0].manage_inventory).toBe(true)
      expect(products[0].variants[0].allow_backorder).toBe(false)
      expect(await stockOf(products[0].variants[0].id)).toEqual({
        stocked: 1,
        reserved: 0,
      })
    })

    it("example bag is listed in the store API as available", async () => {
      await seedSegelstueck(container())
      const { data } = await api.get(
        `/store/products?handle=${SEGELSTUECK_HANDLE}&region_id=${regionId}&fields=*variants.calculated_price,+variants.inventory_quantity`,
        { headers }
      )
      expect(data.products).toHaveLength(1)
      expect(data.products[0].variants[0].inventory_quantity).toEqual(1)
      expect(data.products[0].variants[0].calculated_price.currency_code).toEqual("eur")
    })

    it("two parallel checkouts of the same bag produce at most one order", async () => {
      const { variantId } = await seedSegelstueck(container())
      // Carts are prepared one after another; only completion runs in parallel.
      const a = await prepareCart(variantId, "kaeufer-a@example.com")
      const b = await prepareCart(variantId, "kaeufer-b@example.com")

      const results = await Promise.all([complete(a), complete(b)])
      const orders = results.filter((r) => r.type === "order")
      expect(orders).toHaveLength(1)

      const stock = await stockOf(variantId)
      expect(stock.reserved).toBeLessThanOrEqual(stock.stocked)
      expect(stock.stocked - stock.reserved).toEqual(0)
    })

    it("a stale cart cannot complete after the bag was sold", async () => {
      const { variantId } = await seedSegelstueck(container())
      const first = await prepareCart(variantId)
      const stale = await prepareCart(variantId)

      expect((await complete(first)).type).toEqual("order")
      const second = await complete(stale)
      expect(second.type).not.toEqual("order")
    })

    it("a sold bag cannot be added to a new cart", async () => {
      const { variantId } = await seedSegelstueck(container())
      expect((await complete(await prepareCart(variantId))).type).toEqual("order")

      const res = await api
        .post(
          "/store/carts",
          { region_id: regionId, items: [{ variant_id: variantId, quantity: 1 }] },
          { headers }
        )
        .catch((e) => e.response)
      expect(res.status).toBeGreaterThanOrEqual(400)
    })

    it("re-running the seed after a sale does not restock the bag", async () => {
      const { variantId } = await seedSegelstueck(container())
      expect((await complete(await prepareCart(variantId))).type).toEqual("order")

      const again = await seedSegelstueck(container())
      expect(again.variantId).toEqual(variantId)
      const stock = await stockOf(variantId)
      expect(stock.stocked - stock.reserved).toEqual(0)
    })
  },
})
