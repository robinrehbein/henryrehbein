import { HttpTypes } from "@medusajs/types"
import ItemsPreviewTemplate from "@modules/cart/templates/preview"
import CartTotals from "@modules/common/components/cart-totals"

const CheckoutSummary = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  return (
    <aside className="border border-ink bg-papier p-6 flex flex-col gap-6 small:sticky small:top-6">
      <h2 className="display text-3xl">Deine Bestellung</h2>
      <ItemsPreviewTemplate cart={cart} />
      <CartTotals totals={cart} />
    </aside>
  )
}

export default CheckoutSummary
