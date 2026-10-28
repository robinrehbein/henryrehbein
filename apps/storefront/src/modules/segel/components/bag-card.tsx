import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { bagNumber, bagPrice, isBagSold, isExampleBag } from "@lib/util/bag"

export default function BagCard({
  bag,
  priority = false,
}: {
  bag: HttpTypes.StoreProduct
  priority?: boolean
}) {
  const sold = isBagSold(bag)
  const number = bagNumber(bag)
  const price = bagPrice(bag)

  return (
    <LocalizedClientLink
      href={`/products/${bag.handle}`}
      className="group flex flex-col h-full bg-segel focus-visible:outline-offset-[-3px]"
      data-testid="bag-card"
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-papier border-b border-ink">
        {bag.thumbnail ? (
          <Image
            src={bag.thumbnail}
            alt={bag.title ?? ""}
            fill
            priority={priority}
            sizes="(max-width: 512px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover transition-transform duration-300 group-hover:scale-[1.02] ${
              sold ? "grayscale opacity-70" : ""
            }`}
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center label text-ink-soft">
            Kein Bild hinterlegt
          </div>
        )}
        <div className="absolute top-3 left-3 flex gap-2">
          {sold ? (
            <span className="label bg-ink text-white px-2 py-1">Verkauft</span>
          ) : (
            <span className="label bg-blau text-white px-2 py-1">Verfügbar</span>
          )}
          {isExampleBag(bag) && (
            <span className="label bg-papier text-ink border border-ink px-2 py-1">
              Beispiel
            </span>
          )}
        </div>
      </div>
      <div className="grid grid-cols-[1fr_auto] gap-x-4 gap-y-1 p-4">
        <span className="label text-ink-soft">{number ? `Nr. ${number}` : "Ohne Nr."}</span>
        <span className="label text-ink-soft text-right">
          {sold ? "Nicht mehr erhältlich" : "1 Stück"}
        </span>
        <h3 className="font-semibold text-lg leading-tight group-hover:underline underline-offset-4">
          {bag.title}
        </h3>
        <span className={`font-semibold text-lg text-right ${sold ? "line-through text-ink-soft" : ""}`}>
          {price ?? "–"}
        </span>
      </div>
    </LocalizedClientLink>
  )
}
