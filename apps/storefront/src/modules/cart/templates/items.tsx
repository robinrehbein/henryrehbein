import { HttpTypes } from "@medusajs/types"
import Item from "@modules/cart/components/item"

type ItemsTemplateProps = {
  cart: HttpTypes.StoreCart
  unavailableIds?: string[]
}

const ItemsTemplate = ({ cart, unavailableIds = [] }: ItemsTemplateProps) => {
  const items = [...(cart.items ?? [])].sort((a, b) =>
    (a.created_at ?? "") > (b.created_at ?? "") ? -1 : 1
  )

  return (
    <ul className="flex flex-col gap-px bg-ink border border-ink" aria-label="Artikel im Warenkorb">
      {items.map((item) => (
        <li key={item.id} className="bg-segel">
          <Item
            item={item}
            currencyCode={cart.currency_code}
            unavailable={unavailableIds.includes(item.id)}
          />
        </li>
      ))}
    </ul>
  )
}

export default ItemsTemplate
