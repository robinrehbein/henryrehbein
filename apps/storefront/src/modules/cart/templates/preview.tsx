import { HttpTypes } from "@medusajs/types"
import { unavailableItems } from "@lib/util/bag"
import Item from "@modules/cart/components/item"

const ItemsPreviewTemplate = ({ cart }: { cart: HttpTypes.StoreCart }) => {
  const blocked = unavailableItems(cart).map((i) => i.id)
  return (
    <ul className="flex flex-col gap-px bg-ink border border-ink" data-testid="items-table">
      {(cart.items ?? []).map((item) => (
        <li key={item.id} className="bg-segel">
          <Item
            item={item}
            type="preview"
            currencyCode={cart.currency_code}
            unavailable={blocked.includes(item.id)}
          />
        </li>
      ))}
    </ul>
  )
}

export default ItemsPreviewTemplate
