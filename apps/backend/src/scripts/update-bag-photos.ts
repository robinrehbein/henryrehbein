/**
 * Replaces the photos of already seeded example bags with the current files
 * in src/scripts/assets/. The seed itself never touches existing bags.
 *
 *   npx medusa exec ./src/scripts/update-bag-photos.ts
 *
 * Only bags that still exist and are marked as examples (metadata.beispiel)
 * are updated; stock, price and description stay as they are.
 */
import type { ExecArgs } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"
import { updateProductsWorkflow } from "@medusajs/medusa/core-flows"
import { SEGELSTUECK_BAGS, uploadBagImages } from "./seed-segelstueck"

export default async function updateBagPhotos({ container }: ExecArgs) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const productService = container.resolve(Modules.PRODUCT)

  for (const bag of SEGELSTUECK_BAGS) {
    const [product] = await productService.listProducts({ handle: bag.handle })
    if (!product) {
      logger.info(`Segelstueck: ${bag.handle} not found, skipping.`)
      continue
    }
    if (product.metadata?.beispiel !== true) {
      logger.info(`Segelstueck: ${bag.handle} is no example bag, leaving its photos.`)
      continue
    }

    const files = await uploadBagImages(container, bag)
    await updateProductsWorkflow(container).run({
      input: {
        products: [
          {
            id: product.id,
            thumbnail: files[0].url,
            images: files.map((f) => ({ url: f.url })),
          },
        ],
      },
    })
    logger.info(`Segelstueck: updated photos of ${bag.handle}.`)
  }
}
