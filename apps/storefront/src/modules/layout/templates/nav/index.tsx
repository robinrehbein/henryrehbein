import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartLink from "@modules/segel/components/cart-link"
import DemoBanner from "@modules/segel/components/demo-banner"

const links = [
  { href: "/store", label: "Shop" },
  { href: "/archiv", label: "Archiv" },
  { href: "/#herstellung", label: "Herstellung" },
]

export default function Nav() {
  return (
    <div className="sticky top-0 inset-x-0 z-50">
      <DemoBanner />
      <header className="bg-segel border-b border-ink">
        <nav
          aria-label="Hauptnavigation"
          className="content-container !px-0 small:!px-8 flex items-stretch justify-between h-14 small:h-16 font-semibold uppercase tracking-[0.06em] text-[13px] small:text-[14px]"
        >
          <LocalizedClientLink
            href="/"
            className="flex items-center px-4 small:px-0 small:pr-8 text-[18px] small:text-[22px] font-extrabold tracking-[-0.01em] normal-case"
            data-testid="nav-store-link"
          >
            Segelstück
          </LocalizedClientLink>
          <div className="flex items-stretch">
            <ul className="hidden xsmall:flex items-stretch">
              {links.map((link) => (
                <li key={link.href} className="flex">
                  <LocalizedClientLink
                    href={link.href}
                    className="flex items-center px-4 border-l border-ink hover:bg-ink hover:text-white"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
            <CartLink />
          </div>
        </nav>
        <ul className="xsmall:hidden grid grid-cols-3 border-t border-ink font-semibold uppercase tracking-[0.06em] text-[13px]">
          {links.map((link, i) => (
            <li key={link.href} className={i ? "border-l border-ink" : ""}>
              <LocalizedClientLink
                href={link.href}
                className="flex items-center justify-center h-11 hover:bg-ink hover:text-white"
              >
                {link.label}
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </header>
    </div>
  )
}
