import LocalizedClientLink from "@modules/common/components/localized-client-link"

/**
 * Legal and policy pages are intentionally not written for the local demo.
 * Real texts are a separate step before any live sale (see README).
 */
export default function PolicyPlaceholder({ title }: { title: string }) {
  return (
    <div className="content-container py-10 small:py-16">
      <div className="border-b border-ink pb-4 mb-6">
        <p className="label text-ink-soft mb-2">Information</p>
        <h1 className="display text-5xl small:text-7xl">{title}</h1>
      </div>
      <div className="border border-ink bg-papier p-8 max-w-2xl">
        <p className="text-lg mb-2">Dieser Text folgt vor einem echten Verkauf.</p>
        <p className="text-ink-soft leading-7 mb-6">
          Dieser Shop ist eine Demo. Bestellungen sind Testbestellungen ohne Zahlung und
          ohne Versand, deshalb gibt es hier noch keine verbindlichen Angaben.
        </p>
        <LocalizedClientLink href="/store" className="btn-secondary">
          Zum Shop
        </LocalizedClientLink>
      </div>
    </div>
  )
}
