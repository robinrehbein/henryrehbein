import { HttpTypes } from "@medusajs/types"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

function getCheckoutStep(cart: HttpTypes.StoreCart) {
  if (!cart?.shipping_address?.address_1 || !cart.email) {
    return "address"
  } else if (cart?.shipping_methods?.length === 0) {
    return "delivery"
  } else {
    return "payment"
  }
}

const Summary = ({ cart, blocked }: { cart: HttpTypes.StoreCart; blocked: boolean }) => {
  return (
    <aside className="border border-ink bg-papier p-6 flex flex-col gap-6 small:sticky small:top-36">
      <h2 className="display text-3xl">Übersicht</h2>
      <CartTotals totals={cart} />
      {blocked ? (
        <span className="btn-primary w-full opacity-60 cursor-not-allowed" aria-disabled="true">
          Zur Kasse
        </span>
      ) : (
        <LocalizedClientLink
          href={"/checkout?step=" + getCheckoutStep(cart)}
          className="btn-primary w-full"
          data-testid="checkout-button"
        >
          Zur Kasse
        </LocalizedClientLink>
      )}
      <p className="text-sm text-ink-soft">
        Demo-Checkout mit Testzahlung und Testversand. Es wird nichts berechnet und nichts
        verschickt.
      </p>
    </aside>
  )
}

export default Summary
