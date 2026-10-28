/**
 * Shown when Medusa cannot be reached. No product data is invented here.
 */
export default function BackendError({ reason }: { reason: "backend" | "region" }) {
  return (
    <div role="alert" className="border border-ink bg-papier p-6 small:p-10 max-w-2xl">
      <p className="label text-ink-soft mb-3">Störung</p>
      <h2 className="display text-3xl small:text-4xl mb-4">
        Der Shop kann gerade keine Daten laden.
      </h2>
      <p className="text-base leading-7 text-ink-soft">
        {reason === "backend"
          ? "Der Shop erreicht das Medusa-Backend nicht. Bitte prüfe, ob das Backend unter http://localhost:9000 läuft, und lade die Seite danach neu."
          : "Für dieses Land ist keine Region eingerichtet. Bitte die Region in der Medusa-Verwaltung prüfen."}
      </p>
    </div>
  )
}
