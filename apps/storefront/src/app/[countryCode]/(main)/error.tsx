"use client"

export default function Error({ reset }: { error: Error; reset: () => void }) {
  return (
    <div className="content-container py-16 small:py-24">
      <div role="alert" className="border border-ink bg-papier p-8 max-w-2xl">
        <p className="label text-ink-soft mb-3">Störung</p>
        <h1 className="display text-4xl mb-4">Etwas ist schiefgelaufen.</h1>
        <p className="text-ink-soft leading-7 mb-6">
          Die Seite konnte nicht geladen werden. Läuft das Medusa-Backend unter
          http://localhost:9000? Danach bitte erneut versuchen.
        </p>
        <button type="button" onClick={reset} className="btn-primary">
          Erneut versuchen
        </button>
      </div>
    </div>
  )
}
