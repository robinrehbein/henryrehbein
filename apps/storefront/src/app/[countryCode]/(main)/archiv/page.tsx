import { Metadata } from "next"

import { listBags } from "@lib/data/bags"
import { isBagSold } from "@lib/util/bag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BackendError from "@modules/segel/components/backend-error"
import BagGrid from "@modules/segel/components/bag-grid"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Archiv",
  description: "Bereits verkaufte Einzelstücke. Sie bleiben sichtbar, sind aber nicht mehr bestellbar.",
}

export default async function ArchivePage(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const result = await listBags(countryCode)
  const sold = result.ok ? result.bags.filter(isBagSold) : []

  return (
    <div className="content-container py-10 small:py-16">
      <div className="border-b border-ink pb-4 mb-6">
        <p className="label text-ink-soft mb-2">Archiv</p>
        <h1 className="display text-5xl small:text-7xl mb-4">Verkaufte Stücke</h1>
        <p className="text-ink-soft max-w-2xl leading-7">
          Jede Tasche gibt es nur einmal. Verkaufte Taschen bleiben hier sichtbar, können
          aber nicht mehr bestellt werden.
        </p>
      </div>

      {!result.ok ? (
        <BackendError reason={result.reason} />
      ) : sold.length ? (
        <BagGrid bags={sold} />
      ) : (
        <div className="border border-ink bg-papier p-8">
          <p className="text-lg">Noch ist keine Tasche verkauft.</p>
          <p className="text-ink-soft mt-2">
            Alle bisherigen Stücke sind noch{" "}
            <LocalizedClientLink href="/store" className="underline underline-offset-4">
              im Shop erhältlich
            </LocalizedClientLink>
            .
          </p>
        </div>
      )}
    </div>
  )
}
