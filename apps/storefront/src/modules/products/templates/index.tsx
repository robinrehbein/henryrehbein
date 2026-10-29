import { HttpTypes } from "@medusajs/types"
import {
  bagCare,
  bagDimensions,
  bagImages,
  bagNumber,
  bagPrice,
  isBagSold,
  isExampleBag,
  hasAiViews,
} from "@lib/util/bag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BagActions from "@modules/products/components/bag-actions"
import BagGallery from "@modules/products/components/bag-gallery"

const MISSING = "Angabe folgt"

export default function ProductTemplate({ product }: { product: HttpTypes.StoreProduct }) {
  const sold = isBagSold(product)
  const number = bagNumber(product)
  const price = bagPrice(product)
  const variant = product.variants?.[0]

  const details = [
    { label: "Unikatnummer", value: number ?? MISSING },
    { label: "Abmessungen", value: bagDimensions(product) ?? MISSING },
    { label: "Material", value: product.material || MISSING },
    { label: "Pflege", value: bagCare(product) ?? MISSING },
  ]

  return (
    <div className="content-container !px-0 small:!px-8 py-0 small:py-10" data-testid="product-container">
      <nav aria-label="Brotkrumen" className="label text-ink-soft px-4 small:px-0 py-4 small:pt-0">
        <LocalizedClientLink href="/store" className="hover:underline underline-offset-4">
          Shop
        </LocalizedClientLink>
        <span aria-hidden> / </span>
        <span>{number ? `Nr. ${number}` : product.title}</span>
      </nav>

      <div className="grid grid-cols-1 small:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] border-y small:border border-ink">
        <BagGallery
          images={bagImages(product)}
          title={product.title ?? "Tasche"}
          sold={sold}
          aiViews={hasAiViews(product)}
        />

        <div className="flex flex-col border-t small:border-t-0 small:border-l border-ink">
          <div className="p-6 small:p-8 border-b border-ink">
            <div className="flex flex-wrap gap-2 mb-6">
              {sold ? (
                <span className="label bg-ink text-white px-2 py-1">Verkauft</span>
              ) : (
                <span className="label bg-blau text-white px-2 py-1">Verfügbar · 1 Stück</span>
              )}
              {isExampleBag(product) && (
                <span className="label border border-ink px-2 py-1">Beispiel · Demo-Daten</span>
              )}
            </div>
            <p className="label text-ink-soft mb-2">{number ? `Nr. ${number}` : "Ohne Nummer"}</p>
            <h1 className="display text-4xl small:text-5xl mb-4" data-testid="product-title">
              {product.title}
            </h1>
            <p
              className={`text-3xl font-semibold ${sold ? "line-through text-ink-soft" : ""}`}
              data-testid="product-price"
            >
              {price ?? "Preis folgt"}
            </p>
            <p className="text-sm text-ink-soft mt-1">
              {isExampleBag(product) ? "Demo-Preis · " : ""}Testversand kostenlos
            </p>
          </div>

          <div className="p-6 small:p-8 border-b border-ink">
            {sold || !variant ? (
              <div role="status" className="flex flex-col gap-4">
                <p className="font-semibold">Diese Tasche ist verkauft und nicht mehr bestellbar.</p>
                <LocalizedClientLink href="/store" className="btn-secondary">
                  Verfügbare Taschen ansehen
                </LocalizedClientLink>
              </div>
            ) : (
              <BagActions variantId={variant.id} />
            )}
          </div>

          <dl className="grid grid-cols-[auto_1fr]">
            {details.map((d, i) => (
              <div key={d.label} className={`contents`}>
                <dt
                  className={`label text-ink-soft px-6 small:px-8 py-4 ${i ? "border-t border-ink" : ""}`}
                >
                  {d.label}
                </dt>
                <dd
                  className={`px-6 small:px-8 py-4 ${i ? "border-t border-ink" : ""} ${
                    d.value === MISSING ? "text-ink-soft italic" : ""
                  }`}
                >
                  {d.value}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* Full width below the grid, so a long text does not stretch the photo column. */}
      {product.description && (
        <div className="p-6 small:p-8 border-b small:border-x border-ink">
          <h2 className="label text-ink-soft mb-3">Beschreibung</h2>
          <p className="leading-7 whitespace-pre-line max-w-2xl" data-testid="product-description">
            {product.description}
          </p>
        </div>
      )}
    </div>
  )
}
