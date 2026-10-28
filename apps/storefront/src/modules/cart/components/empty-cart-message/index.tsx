import LocalizedClientLink from "@modules/common/components/localized-client-link"

const EmptyCartMessage = () => {
  return (
    <div className="border border-ink bg-papier p-8 small:p-12 max-w-2xl" data-testid="empty-cart-message">
      <p className="text-lg mb-6">Dein Warenkorb ist leer.</p>
      <LocalizedClientLink href="/store" className="btn-primary">
        Verfügbare Taschen ansehen
      </LocalizedClientLink>
    </div>
  )
}

export default EmptyCartMessage
