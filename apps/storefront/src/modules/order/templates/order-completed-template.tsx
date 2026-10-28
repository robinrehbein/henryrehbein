import { HttpTypes } from "@medusajs/types"
import CartTotals from "@modules/common/components/cart-totals"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Items from "@modules/order/components/items"
import OrderDetails from "@modules/order/components/order-details"
import PaymentDetails from "@modules/order/components/payment-details"
import ShippingDetails from "@modules/order/components/shipping-details"

export default async function OrderCompletedTemplate({ order }: { order: HttpTypes.StoreOrder }) {
  return (
    <div className="content-container py-10 small:py-16 max-w-4xl" data-testid="order-complete-container">
      <div className="border-b border-ink pb-6 mb-8">
        <span className="label bg-blau text-white px-2 py-1 inline-block mb-4">
          Testbestellung · Demo
        </span>
        <h1 className="display text-5xl small:text-7xl mb-4">Danke! Bestellung eingegangen.</h1>
        <p className="text-ink-soft leading-7 max-w-2xl">
          Dies war eine Testbestellung. Es wurde keine Zahlung ausgeführt, es wird nichts
          verschickt und es wurde keine E-Mail versendet. Die Tasche ist im Shop jetzt als
          verkauft markiert.
        </p>
      </div>
      <div className="flex flex-col gap-8">
        <OrderDetails order={order} />
        <section className="flex flex-col gap-4">
          <h2 className="display text-3xl">Übersicht</h2>
          <Items order={order} />
          <CartTotals totals={order} />
        </section>
        <ShippingDetails order={order} />
        <PaymentDetails order={order} />
        <div className="flex flex-col xsmall:flex-row gap-3">
          <LocalizedClientLink href="/store" className="btn-primary">
            Weiter stöbern
          </LocalizedClientLink>
          <LocalizedClientLink href="/archiv" className="btn-secondary">
            Zum Archiv
          </LocalizedClientLink>
        </div>
      </div>
    </div>
  )
}
