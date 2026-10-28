import { MedusaContainer } from "@medusajs/framework"
import { ContainerRegistrationKeys } from "@medusajs/framework/utils"
import { updateRegionsWorkflow } from "@medusajs/medusa/core-flows"

/**
 * The Medusa starter wrote default return and shipping promises (30-day
 * returns, 2-3 day transit) into region metadata. The storefront publishes
 * those as structured data. The Segelstueck demo has no confirmed policies,
 * so the keys are removed; the storefront then omits policy data entirely.
 * Other metadata on the region is kept.
 */
export const POLICY_KEYS = [
  "return_window_days",
  "free_returns",
  "shipping_rate",
  "handling_days_min",
  "handling_days_max",
  "transit_days_min",
  "transit_days_max",
]

export default async function removeInventedRegionPolicies({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)

  const { data: regions } = await query.graph({
    entity: "region",
    fields: ["id", "name", "metadata"],
  })

  for (const region of regions) {
    const metadata = (region.metadata ?? {}) as Record<string, unknown>
    if (!POLICY_KEYS.some((key) => key in metadata)) {
      continue
    }
    // Medusa removes a metadata key when it is set to an empty string.
    const cleared = Object.fromEntries(POLICY_KEYS.map((key) => [key, ""]))
    await updateRegionsWorkflow(container).run({
      input: { selector: { id: region.id }, update: { metadata: cleared } },
    })
    logger.info(`Removed unconfirmed store policies from region "${region.name}"`)
  }
}
