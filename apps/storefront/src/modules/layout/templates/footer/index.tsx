import LocalizedClientLink from "@modules/common/components/localized-client-link"

export default function Footer() {
  return (
    <footer className="border-t border-ink mt-16 small:mt-24">
      <div className="content-container grid grid-cols-1 small:grid-cols-[2fr_1fr_1fr] gap-px bg-ink border-x border-ink !px-0">
        <div className="bg-segel p-6 small:p-8">
          <p className="text-[28px] font-extrabold tracking-[-0.01em] mb-3">Segelstück</p>
          <p className="text-ink-soft max-w-md leading-7">
            Handgemachte Taschen aus Segelstoff. Jede Tasche ist ein Einzelstück.
          </p>
        </div>
        <nav aria-label="Shop" className="bg-segel p-6 small:p-8">
          <p className="label text-ink-soft mb-4">Shop</p>
          <ul className="flex flex-col gap-2 font-semibold">
            <li>
              <LocalizedClientLink href="/store" className="hover:underline underline-offset-4">
                Verfügbare Taschen
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/archiv" className="hover:underline underline-offset-4">
                Archiv verkaufter Stücke
              </LocalizedClientLink>
            </li>
            <li>
              <LocalizedClientLink href="/cart" className="hover:underline underline-offset-4">
                Warenkorb
              </LocalizedClientLink>
            </li>
          </ul>
        </nav>
        <div className="bg-segel p-6 small:p-8">
          <p className="label text-ink-soft mb-4">Hinweis</p>
          <p className="text-ink-soft leading-7">
            Dies ist eine lokale Demo. Bestellungen sind Testbestellungen ohne Zahlung
            und ohne Versand. Rechtliche Angaben folgen vor einem echten Verkauf.
          </p>
        </div>
      </div>
      <div className="border-t border-ink">
        <p className="content-container label text-ink-soft py-4">
          © {new Date().getFullYear()} Segelstück (Arbeitstitel)
        </p>
      </div>
    </footer>
  )
}
