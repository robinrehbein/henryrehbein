/**
 * Creates the demo catalogue of bags, each a unique piece with stock 1.
 *
 *   npx medusa exec ./src/scripts/seed-segelstueck.ts
 *
 * Idempotent per bag: if a product with the handle or SKU already exists (or
 * existed and was deleted), that bag is left unchanged. In particular a sold
 * bag is never restocked by running this again.
 */
import { readdirSync, readFileSync } from "fs"
import path from "path"
import type { ExecArgs, MedusaContainer } from "@medusajs/framework/types"
import {
  ContainerRegistrationKeys,
  MedusaError,
  Modules,
  ProductStatus,
} from "@medusajs/framework/utils"
import {
  createInventoryLevelsWorkflow,
  createProductsWorkflow,
  uploadFilesWorkflow,
} from "@medusajs/medusa/core-flows"

export const SEGELSTUECK_HANDLE = "segelstueck-001"
export const SEGELSTUECK_SKU = "SS-001"

type BagSpec = {
  nr: string
  /** Motif on the flap, as a short German name. */
  motiv: string
  /** Light bags have a natural strap and a phone pocket; dark ones navy and none. */
  ausfuehrung: "hell" | "dunkel"
  /** True when the extra views are AI-generated from the real front photo. */
  kiAnsichten: boolean
}

const BAG_SPECS: BagSpec[] = [
  { nr: "001", motiv: "Blaues L", ausfuehrung: "hell", kiAnsichten: false },
  { nr: "002", motiv: "Rote Schräge", ausfuehrung: "dunkel", kiAnsichten: true },
  { nr: "003", motiv: "Rotes Fünfeck", ausfuehrung: "dunkel", kiAnsichten: true },
  { nr: "004", motiv: "Blaues E", ausfuehrung: "dunkel", kiAnsichten: true },
  { nr: "005", motiv: "Rotes Dreieck", ausfuehrung: "hell", kiAnsichten: true },
  { nr: "006", motiv: "Rote Neun", ausfuehrung: "dunkel", kiAnsichten: true },
]

export const SEGELSTUECK_BAGS = BAG_SPECS.map((spec) => ({
  ...spec,
  handle: `segelstueck-${spec.nr}`,
  sku: `SS-${spec.nr}`,
  title: `Segeltasche ${spec.nr}`,
  imageDir: `segeltasche-${spec.nr}`,
}))
type Bag = (typeof SEGELSTUECK_BAGS)[number]

/** Demo price in EUR. Not a confirmed price; change it in the Admin. */
const DEMO_PRICE_EUR = 89

const DESCRIPTION = [
  "Gedacht als Everyday Bag für die Uni, das Büro oder kurze Ausflüge in die Stadt – immer dann, wenn man etwas mehr Stauraum braucht.",
  "Der Brustgurt ist verstellbar, so lässt sich die Höhe anpassen. Ein Bauchgurt sorgt dafür, dass die Tasche auf dem Fahrrad immer auf dem Rücken bleibt.",
  [
    "– Maße 30 × 25 × 11 cm",
    "– Verstellbare Gurte",
    "– Extrafach für Ladekabel, Stifte etc.",
    "– Extrafach z. B. für ein iPad",
  ].join("\n"),
  "Handgemacht aus Segelstoff. Jede Tasche ist ein Einzelstück und genau einmal erhältlich.",
].join("\n\n")

/** Uploads the bag's photos from assets/, sorted by file name; the first is the thumbnail. */
export async function uploadBagImages(container: MedusaContainer, bag: Bag) {
  const imageDir = path.join(__dirname, "assets", bag.imageDir)
  const imageFiles = readdirSync(imageDir).filter((f) => f.endsWith(".jpg")).sort()
  const { result: files } = await uploadFilesWorkflow(container).run({
    input: {
      files: imageFiles.map((f) => ({
        filename: `${bag.handle}-${f}`,
        mimeType: "image/jpeg",
        content: readFileSync(path.join(imageDir, f)).toString("base64"),
        access: "public" as const,
      })),
    },
  })
  return files
}

export type SeedResult ={ productId: string; variantId: string; created: boolean }

/** Seeds every bag of the catalogue; returns the result for Segeltasche 001. */
export async function seedSegelstueck(container: MedusaContainer): Promise<SeedResult> {
  const results: SeedResult[] = []
  for (const bag of SEGELSTUECK_BAGS) {
    results.push(await seedBag(container, bag))
  }
  return results[0]
}

async function seedBag(container: MedusaContainer, bag: Bag): Promise<SeedResult> {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  // Deleted products count too: once the example bag was removed in the Admin,
  // re-running the setup must not bring it back as a buyable bag.
  const productService = container.resolve(Modules.PRODUCT)
  const existing = await productService.listProducts(
    { handle: bag.handle },
    { relations: ["variants"], withDeleted: true }
  )
  const existingVariants = await productService.listProductVariants(
    { sku: bag.sku },
    { withDeleted: true }
  )
  if (existing.length || existingVariants.length) {
    const product = existing[0]
    logger.info(
      `Segelstueck: ${bag.handle} exists or was deleted before, leaving it unchanged.`
    )
    return {
      productId: product?.id ?? existingVariants[0].product_id!,
      variantId: product?.variants?.[0]?.id ?? existingVariants[0].id,
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
  const salesChannels = stockLocations
    .flatMap((l) => l.sales_channels ?? [])
    .filter((sc): sc is NonNullable<typeof sc> => !!sc)
  if (!salesChannels.length || !shippingProfiles.length || !stockLocations.length) {
    throw new MedusaError(
      MedusaError.Types.NOT_FOUND,
      "Segelstueck: store baseline missing. Run `npx medusa db:migrate` first."
    )
  }

  const files = await uploadBagImages(container, bag)

  const {
    result: [product],
  } = await createProductsWorkflow(container).run({
    input: {
      products: [
        {
          title: bag.title,
          subtitle: "Beispiel",
          handle: bag.handle,
          description: DESCRIPTION,
          material: "Segelstoff",
          // Breite × Höhe × Tiefe in cm, as measured on the bag.
          width: 30,
          height: 25,
          length: 11,
          status: ProductStatus.PUBLISHED,
          shipping_profile_id: shippingProfiles[0].id,
          thumbnail: files[0].url,
          images: files.map((f) => ({ url: f.url })),
          sales_channels: salesChannels.map((sc) => ({ id: sc.id })),
          metadata: {
            unikat_nr: bag.sku,
            beispiel: true,
            motiv: bag.motiv,
            ausfuehrung: bag.ausfuehrung,
            ...(bag.kiAnsichten ? { ki_ansichten: true } : {}),
          },
          options: [{ title: "Ausführung", values: ["Unikat"] }],
          variants: [
            {
              title: "Unikat",
              sku: bag.sku,
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
          inventory_item_id: variant.inventory_items![0]!.inventory_item_id,
          location_id: stockLocations[0].id,
          stocked_quantity: 1,
        },
      ],
    },
  })

  logger.info(`Segelstueck: created ${bag.handle} (${bag.sku}) with stock 1.`)
  return { productId: product.id, variantId: variant.id, created: true }
}

export default async function seedSegelstueckScript({ container }: ExecArgs) {
  await seedSegelstueck(container)
}
