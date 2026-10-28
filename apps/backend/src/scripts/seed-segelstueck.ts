/**
 * Creates the single example bag for the local demo shop.
 *
 *   npx medusa exec ./src/scripts/seed-segelstueck.ts
 *
 * Idempotent: if a product with the handle already exists, nothing is changed.
 * In particular a sold bag is never restocked by running this again.
 */
import { readFileSync } from "fs"
import path from "path"
import type { ExecArgs, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows"

export const SEGELSTUECK_HANDLE = "segelstueck-001"
export const SEGELSTUECK_SKU = "SS-001"

/** Demo price in EUR. Not a confirmed price; change it in the Admin. */
const DEMO_PRICE_EUR = 89

const DESCRIPTION = [
  "Beispielprodukt für die lokale Demo. Bild, Preis und Text sind Platzhalter und werden im Admin durch echte Angaben ersetzt.",
  "Handgemachte Tasche aus Segelstoff. Jede Tasche ist ein Einzelstück und genau einmal erhältlich.",
].join("\n\n")

export type SeedResult = { productId: string; variantId: string; created: boolean }

export async function seedSegelstueck(container: MedusaContainer): Promise<SeedResult> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: existing } = await query.graph({
    entity: "product",
    fields: ["id", "variants.id"],
    filters: { handle: SEGELSTUECK_HANDLE },
  })
  if (existing.length) {
    logger.info(`Segelstueck: ${SEGELSTUECK_HANDLE} exists, leaving it unchanged.`)
    return {
      productId: existing[0].id,
      variantId: existing[0].variants[0].id,
      created: false,
    }
  }

  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  // Only sales channels that can actually ship from a stock location may sell
  // the bag; otherwise carts fail with "not associated with any stock location".
  const { data: stockLocations } = await query.graph({
    entity: "stock_location",
    fields: ["id", "sales_channels.id"],
  })
  const salesChannels = stockLocations.flatMap((l) => l.sales_channels ?? [])
  if (!salesChannels.length || !shippingProfiles.length || !stockLocations.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Segelstueck: store baseline missing. Run `npx medusa db:migrate` first."
    )
  }

  const image = readFileSync(path.join(__dirname, "assets", "platzhalter.png"))
  const { result: files } = await uploadFilesWorkflow(container).run({
    input: {
      files: [
        {
          filename: "segelstueck-001-platzhalter.png",
          mimeType: "image/png",
          content: image.toString("base64"),
          access: "public",
        },
      ],
    },
  })

  const {
    result: [product],
  } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: "Segeltasche 001",
          subtitle: "Beispiel",
          handle: SEGELSTUECK_HANDLE,
          description: DESCRIPTION,
          material: "Segelstoff",
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfiles[0].id,
          thumbnail: files[0].url,
          images: [{ url: files[0].url }],
          sales_channels: salesChannels.map((sc) => ({ id: sc.id })),
          metadata: { unikat_nr: SEGELSTUECK_SKU, beispiel: true },
          options: [{ title: "Ausführung", values: ["Unikat"] }],
          variants: [
            {
              title: "Unikat",
              sku: SEGELSTUECK_SKU,
              manage_inventory: true,
              allow_backorder: false,
              options: { "Ausführung": "Unikat" },
              prices: [{ amount: DEMO_PRICE_EUR, currency_code: "eur" }],
            },
          ],
        },
      ],
    },
  })

  const { data: variants } = await query.graph({
    entity: "variant",
    fields: ["id", "inventory_items.inventory_item_id"],
    filters: { product_id: product.id },
  })
  const variant = variants[0]

  await createInventoryLevelsWorkflow(container).run({
    input: {
      inventory_levels: [
        {
          inventory_item_id: variant.inventory_items[0].inventory_item_id,
          location_id: stockLocations[0].id,
          stocked_quantity: 1,
        },
      ],
    },
  })

  logger.info(`Segelstueck: created ${SEGELSTUECK_HANDLE} (${SEGELSTUECK_SKU}) with stock 1.`)
  return { productId: product.id, variantId: variant.id, created: true }
}

export default async function seedSegelstueckScript({ container }: ExecArgs) {
  await seedSegelstueck(container)
}
