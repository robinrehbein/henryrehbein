import { Metadata } from "next"

import { listBags } from "@lib/data/bags"
import { isBagSold } from "@lib/util/bag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BackendError from "@modules/segel/components/backend-error"
import BagGrid from "@modules/segel/components/bag-grid"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Shop",
  description: "Alle verfügbaren Taschen aus Segelstoff. Jede Tasche ist ein Einzelstück.",
}

const filters = [
  { key: "verfuegbar", label: "Verfügbar" },
  { key: "alle", label: "Alle" },
] as const

export default async function StorePage(props: {
  params: Promise<{ countryCode: string }>
  searchParams: Promise<{ filter?: string }>
}) {
  const { countryCode } = await props.params
  const { filter } = await props.searchParams
  const active = filter === "alle" ? "alle" : "verfuegbar"
  const result = await listBags(countryCode)

  const bags = result.ok
    ? active === "alle"
      ? result.bags
      : result.bags.filter((b) => !isBagSold(b))
    : []

  return (
    <div className="content-container py-10 small:py-16">
      <div className="flex flex-col small:flex-row small:items-end justify-between gap-6 border-b border-ink pb-4 mb-6">
        <div>
          <p className="label text-ink-soft mb-2">Shop</p>
          <h1 className="display text-5xl small:text-7xl">Taschen</h1>
        </div>
        <nav aria-label="Filter" className="flex border border-ink self-start small:self-auto">
          {filters.map((f, i) => (
            <LocalizedClientLink
              key={f.key}
              href={f.key === "verfuegbar" ? "/store" : "/store?filter=alle"}
              aria-current={active === f.key ? "page" : undefined}
              className={`label px-4 h-10 flex items-center ${i ? "border-l border-ink" : ""} ${
                active === f.key ? "bg-ink text-white" : "hover:bg-papier"
              }`}
            >
              {f.label}
            </LocalizedClientLink>
          ))}
          <LocalizedClientLink
            href="/archiv"
            className="label px-4 h-10 flex items-center border-l border-ink hover:bg-papier"
          >
            Archiv
          </LocalizedClientLink>
        </nav>
      </div>

      {!result.ok ? (
        <BackendError reason={result.reason} />
      ) : bags.length ? (
        <>
          <p className="label text-ink-soft mb-4" aria-live="polite">
            {bags.length === 1 ? "1 Tasche" : `${bags.length} Taschen`}
          </p>
          <BagGrid bags={bags} />
        </>
      ) : (
        <div className="border border-ink bg-papier p-8">
          <p className="text-lg">Gerade ist keine Tasche verfügbar.</p>
          <p className="text-ink-soft mt-2">
            Verkaufte Stücke findest du im{" "}
            <LocalizedClientLink href="/archiv" className="underline underline-offset-4">
              Archiv
            </LocalizedClientLink>
            .
          </p>
        </div>
      )}
    </div>
  )
}
