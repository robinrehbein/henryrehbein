import { MedusaContainer } from "@medusajs/framework"
import {
  ContainerRegistrationKeys,
  ModuleRegistrationName,
  Modules,
} from "@medusajs/framework/utils"
import {
  createApiKeysWorkflow,
  createRegionsWorkflow,
  createSalesChannelsWorkflow,
  createShippingOptionsWorkflow,
  createShippingProfilesWorkflow,
  createStockLocationsWorkflow,
  createStoresWorkflow,
  createTaxRegionsWorkflow,
  linkSalesChannelsToApiKeyWorkflow,
  linkSalesChannelsToStockLocationWorkflow,
} from "@medusajs/medusa/core-flows"

/**
 * Baseline for the Segelstueck demo shop. Runs once on `medusa db:migrate`.
 *
 * Creates store, sales channel, publishable key, the region "Deutschland"
 * (EUR, system/test payment), one stock location and a free test shipping
 * option. It deliberately creates no products: the single example bag is
 * created by `src/scripts/seed-segelstueck.ts`.
 */
export default async function initial_data_seed({
  container,
}: {
  container: MedusaContainer
}) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)
  const link = container.resolve(ContainerRegistrationKeys.LINK)
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const fulfillmentModuleService = container.resolve(
    ModuleRegistrationName.FULFILLMENT
  )

  logger.info("Seeding Segelstueck store baseline...")

  const {
    result: [salesChannel],
  } = await createSalesChannelsWorkflow(container).run({
    input: {
      salesChannelsData: [
        { name: "Segelstueck Shop", description: "Online-Shop (lokale Demo)" },
      ],
    },
  })

  const {
    result: [publishableApiKey],
  } = await createApiKeysWorkflow(container).run({
    input: {
      api_keys: [
        { title: "Segelstueck Storefront", type: "publishable", created_by: "" },
      ],
    },
  })

  await linkSalesChannelsToApiKeyWorkflow(container).run({
    input: { id: publishableApiKey.id, add: [salesChannel.id] },
  })

  await createStoresWorkflow(container).run({
    input: {
      stores: [
        {
          name: "Segelstück",
          supported_currencies: [{ currency_code: "eur", is_default: true }],
          default_sales_channel_id: salesChannel.id,
        },
      ],
    },
  })

  const {
    result: [region],
  } = await createRegionsWorkflow(container).run({
    input: {
      regions: [
        {
          name: "Deutschland",
          currency_code: "eur",
          countries: ["de"],
          payment_providers: ["pp_system_default"],
        },
      ],
    },
  })

  await createTaxRegionsWorkflow(container).run({
    input: [{ country_code: "de", provider_id: "tp_system" }],
  })

  const {
    result: [stockLocation],
  } = await createStockLocationsWorkflow(container).run({
    input: {
      locations: [
        {
          name: "Werkstatt",
          address: { city: "", country_code: "DE", address_1: "" },
        },
      ],
    },
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_provider_id: "manual_manual" },
  })

  // Normally created by a core migration script; created here if missing
  // (for example in integration tests, which skip migration scripts).
  const { data: shippingProfiles } = await query.graph({
    entity: "shipping_profile",
    fields: ["id"],
  })
  if (!shippingProfiles.length) {
    const { result } = await createShippingProfilesWorkflow(container).run({
      input: { data: [{ name: "Default Shipping Profile", type: "default" }] },
    })
    shippingProfiles.push(...result)
  }

  const fulfillmentSet = await fulfillmentModuleService.createFulfillmentSets({
    name: "Werkstatt Versand",
    type: "shipping",
    service_zones: [
      {
        name: "Deutschland",
        geo_zones: [{ country_code: "de", type: "country" }],
      },
    ],
  })

  await link.create({
    [Modules.STOCK_LOCATION]: { stock_location_id: stockLocation.id },
    [Modules.FULFILLMENT]: { fulfillment_set_id: fulfillmentSet.id },
  })

  await createShippingOptionsWorkflow(container).run({
    input: [
      {
        name: "Testversand (Demo, kein echter Versand)",
        price_type: "flat",
        provider_id: "manual_manual",
        service_zone_id: fulfillmentSet.service_zones[0].id,
        shipping_profile_id: shippingProfiles[0].id,
        type: {
          label: "Testversand",
          description: "Demo: Es wird nichts verschickt.",
          code: "test",
        },
        prices: [
          { currency_code: "eur", amount: 0 },
          { region_id: region.id, amount: 0 },
        ],
        rules: [
          { attribute: "enabled_in_store", value: "true", operator: "eq" },
          { attribute: "is_return", value: "false", operator: "eq" },
        ],
      },
    ],
  })

  await linkSalesChannelsToStockLocationWorkflow(container).run({
    input: { id: stockLocation.id, add: [salesChannel.id] },
  })

  logger.info("Finished seeding Segelstueck store baseline.")
}
