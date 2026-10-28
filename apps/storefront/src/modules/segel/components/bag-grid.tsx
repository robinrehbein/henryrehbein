import { HttpTypes } from "@medusajs/types"
import BagCard from "./bag-card"

/**
 * Strict product grid with visible hairlines. Lines are drawn by cell borders
 * (not a dark gap background), so incomplete rows stay sail white.
 */
export default function BagGrid({ bags }: { bags: HttpTypes.StoreProduct[] }) {
  return (
    <ul className="grid grid-cols-1 xsmall:grid-cols-2 small:grid-cols-3 border-l border-t border-ink">
      {bags.map((bag, index) => (
        <li key={bag.id} className="border-r border-b border-ink">
          <BagCard bag={bag} priority={index < 3} />
        </li>
      ))}
    </ul>
  )
}
