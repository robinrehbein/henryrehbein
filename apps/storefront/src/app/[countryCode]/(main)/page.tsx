import { Metadata } from "next"
import Image from "next/image"

import { listBags } from "@lib/data/bags"
import { bagNumber, isBagSold } from "@lib/util/bag"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import BackendError from "@modules/segel/components/backend-error"
import BagGrid from "@modules/segel/components/bag-grid"
import SectionHeading from "@modules/segel/components/section-heading"

export const dynamic = "force-dynamic"

const HERO_BAG_HANDLE = "segelstueck-001"

export const metadata: Metadata = {
  title: { absolute: "Segelstück – Taschen aus Segelstoff" },
  description: "Handgemachte Taschen aus Segelstoff. Jede Tasche ist ein Einzelstück.",
}

const facts = [
  {
    nr: "01",
    title: "Segelstoff",
    text: "Jede Tasche ist aus Segelstoff genäht. Angaben zu Herkunft und Zustand des Stoffs stehen bei der jeweiligen Tasche, sobald sie bekannt sind.",
  },
  {
    nr: "02",
    title: "Handarbeit",
    text: "Jede Tasche wird einzeln von Hand gefertigt. Zuschnitt und Nähte entstehen für genau dieses Stück.",
  },
  {
    nr: "03",
    title: "Einzelstück",
    text: "Jede Tasche gibt es genau einmal. Ist sie verkauft, bleibt sie im Archiv sichtbar, kann aber nicht noch einmal bestellt werden.",
  },
]

export default async function Home(props: { params: Promise<{ countryCode: string }> }) {
  const { countryCode } = await props.params
  const result = await listBags(countryCode)

  const available = result.ok ? result.bags.filter((b) => !isBagSold(b)) : []
  // The hero photo (public/hero.jpg) shows this bag; link it while it exists.
  const heroBag = result.ok ? result.bags.find((b) => b.handle === HERO_BAG_HANDLE) : undefined

  return (
    <>
      <section className="border-b border-ink">
        <div className="content-container !px-0 grid grid-cols-1 small:grid-cols-2 small:border-x border-ink">
          <div className="relative aspect-[4/5] small:aspect-auto small:min-h-[640px] bg-papier border-b small:border-b-0 small:border-r border-ink">
            <Image
              src="/hero.jpg"
              alt="Segeltasche aus weißem Segelstoff mit blauem Motiv und beigem Gurt"
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              // The bag sits slightly left of centre in the photo.
              className="object-cover object-[42%_50%]"
            />
            {heroBag && (
              <LocalizedClientLink
                href={`/products/${heroBag.handle}`}
                className="absolute bottom-4 left-4 label bg-segel border border-ink px-2 py-1 hover:bg-ink hover:text-segel"
              >
                {bagNumber(heroBag) ? `Nr. ${bagNumber(heroBag)}` : heroBag.title}
              </LocalizedClientLink>
            )}
          </div>
          <div className="flex flex-col justify-between gap-10 p-6 small:p-12">
            <p className="label text-ink-soft">Handgemacht · Segelstoff · Unikate</p>
            <div>
              <h1 className="display text-[48px] xsmall:text-[64px] medium:text-[84px] mb-6">
                Taschen aus Segel&shy;stoff.
                <span className="block text-blau">Jede ein Einzel&shy;stück.</span>
              </h1>
              <p className="text-lg leading-8 text-ink-soft max-w-lg">
                Jede Tasche wird von Hand aus Segelstoff gefertigt und ist genau einmal
                erhältlich. Ist sie weg, ist sie weg.
              </p>
            </div>
            <div className="flex flex-col xsmall:flex-row gap-3">
              <LocalizedClientLink href="/store" className="btn-primary">
                Verfügbare Taschen ansehen
              </LocalizedClientLink>
              <LocalizedClientLink href="/archiv" className="btn-secondary">
                Archiv
              </LocalizedClientLink>
            </div>
          </div>
        </div>
      </section>

      <section className="content-container py-16 small:py-24" aria-labelledby="verfuegbar">
        <SectionHeading eyebrow="Jetzt erhältlich" title="Verfügbare Taschen">
          {result.ok && (
            <p className="label text-ink-soft" id="verfuegbar">
              {available.length === 1
                ? "1 Einzelstück"
                : `${available.length} Einzelstücke`}
            </p>
          )}
        </SectionHeading>
        {!result.ok ? (
          <BackendError reason={result.reason} />
        ) : available.length ? (
          <BagGrid bags={available.slice(0, 6)} />
        ) : (
          <div className="border border-ink bg-papier p-8">
            <p className="text-lg">Gerade ist keine Tasche verfügbar.</p>
            <p className="text-ink-soft mt-2">
              Neue Stücke erscheinen hier, sobald sie fertig sind. Bereits verkaufte Taschen
              findest du im{" "}
              <LocalizedClientLink href="/archiv" className="underline underline-offset-4">
                Archiv
              </LocalizedClientLink>
              .
            </p>
          </div>
        )}
      </section>

      <section id="herstellung" className="border-y border-ink bg-papier scroll-mt-32">
        <div className="content-container py-16 small:py-24">
          <SectionHeading eyebrow="Material und Herstellung" title="Wie eine Tasche entsteht" />
          <ol className="grid grid-cols-1 small:grid-cols-3 gap-px bg-ink border border-ink">
            {facts.map((fact) => (
              <li key={fact.nr} className="bg-papier p-6 small:p-8 flex flex-col gap-4">
                <span className="label text-blau">{fact.nr}</span>
                <h3 className="display text-3xl">{fact.title}</h3>
                <p className="leading-7 text-ink-soft">{fact.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>
    </>
  )
}
