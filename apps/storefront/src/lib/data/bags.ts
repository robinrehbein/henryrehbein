"use server"

import { sdk } from "@lib/config"
import { HttpTypes } from "@medusajs/types"
import { getAuthHeaders } from "./cookies"
import { getRegion } from "./regions"

/**
 * Bag queries for the Segelstueck shop.
 *
 * Every bag is a unique item, so availability must never come from a stale
 * cache: these requests always go to Medusa (`no-store`). The shop holds only
 * a handful of products, so this costs nothing noticeable.
 */

const BAG_FIELDS = [
  "id",
  "title",
  "subtitle",
  "handle",
  "description",
  "thumbnail",
  "material",
  "width",
  "height",
  "length",
  "weight",
  "created_at",
  "+metadata",
  "*images",
  "*variants.calculated_price",
  "+variants.inventory_quantity",
  "+variants.manage_inventory",
  "+variants.allow_backorder",
  "variants.sku",
  "variants.id",
  "variants.title",
].join(",")

export type BagListResult =
  | { ok: true; bags: HttpTypes.StoreProduct[]; region: HttpTypes.StoreRegion }
  | { ok: false; reason: "backend" | "region" }

export async function listBags(countryCode: string): Promise<BagListResult> {
  try {
    const region = await getRegion(countryCode)
    if (!region) {
      return { ok: false, reason: "region" }
    }

    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>("/store/products", {
      method: "GET",
      query: {
        limit: 100,
        region_id: region.id,
        fields: BAG_FIELDS,
        order: "-created_at",
      },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })

    return { ok: true, bags: products, region }
  } catch (error) {
    console.error("Segelstueck: could not load bags from Medusa", error)
    return { ok: false, reason: "backend" }
  }
}

export type BagResult =
  | { ok: true; bag: HttpTypes.StoreProduct | null; region: HttpTypes.StoreRegion }
  | { ok: false; reason: "backend" | "region" }

export async function getBag(countryCode: string, handle: string): Promise<BagResult> {
  try {
    const region = await getRegion(countryCode)
    if (!region) {
      return { ok: false, reason: "region" }
    }

    const { products } = await sdk.client.fetch<{
      products: HttpTypes.StoreProduct[]
    }>("/store/products", {
      method: "GET",
      query: { handle, region_id: region.id, fields: BAG_FIELDS, limit: 1 },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    })

    return { ok: true, bag: products[0] ?? null, region }
  } catch (error) {
    console.error("Segelstueck: could not load bag from Medusa", error)
    return { ok: false, reason: "backend" }
  }
}

/**
 * Cart with live stock for every line item. Used by cart and checkout so a
 * bag that was sold to someone else in the meantime is flagged immediately.
 */
export async function retrieveCartWithStock(): Promise<HttpTypes.StoreCart | null | "backend"> {
  const { getCartId } = await import("./cookies")
  const id = await getCartId()
  if (!id) {
    return null
  }
  try {
    const { cart } = await sdk.client.fetch<HttpTypes.StoreCartResponse>(
      `/store/carts/${id}`,
      {
        method: "GET",
        query: {
          fields:
            "*items, *region, *items.product, *items.variant, +items.variant.inventory_quantity, +items.variant.manage_inventory, +items.variant.allow_backorder, *items.thumbnail, *items.metadata, +items.total, *promotions, +shipping_methods.name",
        },
        headers: { ...(await getAuthHeaders()) },
        cache: "no-store",
      }
    )
    return await attachLiveStock(cart)
  } catch (error) {
    // A missing cart (404) simply means "no cart"; anything else is an outage.
    const status = (error as { status?: number })?.status
    return status === 404 ? null : "backend"
  }
}

/**
 * The cart endpoint does not compute `inventory_quantity`, so the live stock
 * of each line item's variant is read from the product endpoint.
 */
async function attachLiveStock(cart: HttpTypes.StoreCart): Promise<HttpTypes.StoreCart> {
  const productIds = Array.from(
    new Set((cart.items ?? []).map((i) => i.product_id).filter(Boolean) as string[])
  )
  if (!productIds.length) {
    return cart
  }
  const { products } = await sdk.client.fetch<{ products: HttpTypes.StoreProduct[] }>(
    "/store/products",
    {
      method: "GET",
      query: {
        id: productIds,
        region_id: cart.region_id,
        fields: "id,variants.id,+variants.inventory_quantity,+variants.manage_inventory,+variants.allow_backorder",
        limit: productIds.length,
      },
      headers: { ...(await getAuthHeaders()) },
      cache: "no-store",
    }
  )
  const stock = new Map(
    products.flatMap((p) => (p.variants ?? []).map((v) => [v.id, v] as const))
  )
  for (const item of cart.items ?? []) {
    const live = item.variant_id ? stock.get(item.variant_id) : undefined
    if (item.variant) {
      // A variant missing from the product list (deleted, unpublished) counts as unavailable.
      item.variant.inventory_quantity = live ? live.inventory_quantity : 0
      if (live) {
        item.variant.manage_inventory = live.manage_inventory
        item.variant.allow_backorder = live.allow_backorder
      } else {
        item.variant.manage_inventory = true
        item.variant.allow_backorder = false
      }
    }
  }
  return cart
}
