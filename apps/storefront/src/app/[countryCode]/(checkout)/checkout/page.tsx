import { retrieveCartWithStock } from "@lib/data/bags"
import { retrieveCustomer } from "@lib/data/customer"
import { unavailableItems } from "@lib/util/bag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import PaymentWrapper from "@modules/checkout/components/payment-wrapper"
import CheckoutForm from "@modules/checkout/templates/checkout-form"
import CheckoutSummary from "@modules/checkout/templates/checkout-summary"
import BackendError from "@modules/segel/components/backend-error"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Kasse",
}

export default async function Checkout() {
  const cart = await retrieveCartWithStock()

  if (cart === "backend") {
    return (
      <div className="content-container py-16">
        <BackendError reason="backend" />
      </div>
    )
  }

  if (!cart?.items?.length) {
    return (
      <div className="content-container py-16">
        <div className="border border-ink bg-papier p-8 max-w-2xl">
          <p className="text-lg mb-6">Dein Warenkorb ist leer.</p>
          <LocalizedClientLink href="/store" className="btn-primary">
            Verfügbare Taschen ansehen
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  if (unavailableItems(cart).length) {
    return (
      <div className="content-container py-16">
        <div role="alert" className="border-2 border-[#b42318] bg-papier p-8 max-w-2xl">
          <p className="display text-3xl mb-3">Eine Tasche ist inzwischen verkauft.</p>
          <p className="text-ink-soft mb-6">
            Bitte entferne sie aus dem Warenkorb. Danach kannst du die Bestellung fortsetzen.
          </p>
          <LocalizedClientLink href="/cart" className="btn-primary">
            Zum Warenkorb
          </LocalizedClientLink>
        </div>
      </div>
    )
  }

  const customer = await retrieveCustomer().catch(() => null)

  return (
    <div className="content-container py-10 small:py-12">
      <div role="note" className="border border-ink bg-papier p-4 mb-8 flex flex-col small:flex-row small:items-center gap-2 small:gap-4">
        <span className="label bg-blau text-white px-2 py-1 self-start">Demo</span>
        <p className="text-sm leading-6">
          Dies ist ein Demo-Checkout. Du brauchst keine echten Daten. Es wird keine Zahlung
          ausgeführt und nichts verschickt.
        </p>
      </div>
      <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-10 small:gap-16 items-start">
        <PaymentWrapper cart={cart}>
          <CheckoutForm cart={cart} customer={customer} />
        </PaymentWrapper>
        <CheckoutSummary cart={cart} />
      </div>
    </div>
  )
}
