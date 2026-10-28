import { HttpTypes } from "@medusajs/types"
import { convertToLocale } from "./money"

/** The single purchasable variant of a bag (each bag is one unique item). */
export const bagVariant = (bag: HttpTypes.StoreProduct) => bag.variants?.[0]

/** A bag is sold when its tracked stock reaches zero and backorders are off. */
export const isBagSold = (bag: HttpTypes.StoreProduct) => {
  const variant = bagVariant(bag)
  if (!variant) {
    return true
  }
  if (!variant.manage_inventory || variant.allow_backorder) {
    return false
  }
  return (variant.inventory_quantity ?? 0) <= 0
}

/** Unique number shown on labels: metadata.unikat_nr, else the variant SKU. */
export const bagNumber = (bag: HttpTypes.StoreProduct) => {
  const fromMetadata = bag.metadata?.unikat_nr
  if (typeof fromMetadata === "string" && fromMetadata.trim()) {
    return fromMetadata.trim()
  }
  return bagVariant(bag)?.sku ?? null
}

export const isExampleBag = (bag: HttpTypes.StoreProduct) =>
  bag.metadata?.beispiel === true || bag.metadata?.beispiel === "true"

export const bagPrice = (bag: HttpTypes.StoreProduct) => {
  const price = bagVariant(bag)?.calculated_price
  if (!price || price.calculated_amount == null || !price.currency_code) {
    return null
  }
  return convertToLocale({
    amount: price.calculated_amount,
    currency_code: price.currency_code,
  })
}

/** Dimensions in cm if all three are maintained in the Admin, else null. */
export const bagDimensions = (bag: HttpTypes.StoreProduct) => {
  const { width, height, length } = bag
  if (!width || !height || !length) {
    return null
  }
  return `${width} × ${height} × ${length} cm (B × H × T)`
}

/** Care instructions from metadata.pflege, if maintained. */
export const bagCare = (bag: HttpTypes.StoreProduct) => {
  const care = bag.metadata?.pflege
  return typeof care === "string" && care.trim() ? care.trim() : null
}

export const bagImages = (bag: HttpTypes.StoreProduct) => {
  const urls = (bag.images ?? []).map((i) => i.url).filter(Boolean) as string[]
  if (!urls.length && bag.thumbnail) {
    urls.push(bag.thumbnail)
  }
  return urls
}

/** Line items whose unique bag is no longer available. */
export const unavailableItems = (cart: HttpTypes.StoreCart | null | undefined) =>
  (cart?.items ?? []).filter((item) => {
    const v = item.variant
    if (!v) {
      return true
    }
    if (!v.manage_inventory || v.allow_backorder) {
      return false
    }
    return (v.inventory_quantity ?? 0) < item.quantity
  })

/** Turns Medusa's English stock errors into a clear German message. */
export const describeCheckoutError = (message: string) =>
  /inventory|stock|not associated|quantity/i.test(message)
    ? "Eine Tasche in deinem Warenkorb wurde inzwischen verkauft. Bitte entferne sie aus dem Warenkorb. Es wurde keine Bestellung angelegt."
    : `Die Bestellung konnte nicht abgeschlossen werden. Es wurde keine Bestellung angelegt. (${message})`
