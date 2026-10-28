import LocalizedClientLink from "@modules/common/components/localized-client-link"
import DemoBanner from "@modules/segel/components/demo-banner"

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="w-full relative small:min-h-screen bg-segel">
      <DemoBanner />
      <div className="h-14 small:h-16 border-b border-ink">
        <nav className="flex h-full items-stretch content-container !px-0 small:!px-8 justify-between font-semibold uppercase tracking-[0.06em] text-[13px]">
          <LocalizedClientLink
            href="/cart"
            className="flex items-center px-4 small:px-0 small:pr-6 hover:underline underline-offset-4"
            data-testid="back-to-cart-link"
          >
            ← Zurück zum Warenkorb
          </LocalizedClientLink>
          <LocalizedClientLink
            href="/"
            className="flex items-center px-4 small:px-0 text-[18px] small:text-[22px] font-extrabold tracking-[-0.01em] normal-case"
            data-testid="store-link"
          >
            Segelstück
          </LocalizedClientLink>
        </nav>
      </div>
      <div className="relative" data-testid="checkout-container">
        {children}
      </div>
    </div>
  )
}
