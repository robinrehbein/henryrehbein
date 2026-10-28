import { HttpTypes } from "@medusajs/types"
import { unavailableItems } from "@lib/util/bag"
import EmptyCartMessage from "../components/empty-cart-message"
import ItemsTemplate from "./items"
import Summary from "./summary"

const CartTemplate = ({ cart }: { cart: HttpTypes.StoreCart | null }) => {
  const blocked = unavailableItems(cart)

  return (
    <div className="content-container py-10 small:py-16" data-testid="cart-container">
      <div className="border-b border-ink pb-4 mb-6">
        <p className="label text-ink-soft mb-2">Warenkorb</p>
        <h1 className="display text-5xl small:text-7xl">Dein Warenkorb</h1>
      </div>
      {cart?.items?.length ? (
        <div className="grid grid-cols-1 small:grid-cols-[1fr_400px] gap-8 small:gap-12 items-start">
          <div className="flex flex-col gap-4">
            {blocked.length > 0 && (
              <div role="alert" className="border-2 border-[#b42318] bg-papier p-4">
                <p className="font-semibold">
                  {blocked.length === 1
                    ? "Eine Tasche in deinem Warenkorb ist inzwischen verkauft."
                    : "Mehrere Taschen in deinem Warenkorb sind inzwischen verkauft."}
                </p>
                <p className="text-ink-soft mt-1">
                  Bitte entferne sie, bevor du zur Kasse gehst. Ein Warenkorb reserviert keine
                  Tasche.
                </p>
              </div>
            )}
            <ItemsTemplate cart={cart} unavailableIds={blocked.map((i) => i.id)} />
          </div>
          <Summary cart={cart} blocked={blocked.length > 0} />
        </div>
      ) : (
        <EmptyCartMessage />
      )}
    </div>
  )
}

export default CartTemplate
