import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"

/**
 * Hands the storefront container its publishable key when it starts, so a
 * fresh deployment needs no copy-paste from the Admin. A publishable key is
 * public by design: it only scopes the store API to a sales channel.
 */
export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const query = req.scope.resolve(ContainerRegistrationKeys.QUERY)
  const { data: keys } = await query.graph({
    entity: "api_key",
    fields: ["token"],
    filters: { type: "publishable", title: "Segelstueck Storefront", revoked_at: null },
  })
  if (!keys.length) {
    throw new MedusaError(MedusaError.Types.NOT_FOUND, "Storefront key not created yet")
  }
  res.json({ token: keys[0].token })
}
