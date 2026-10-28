import Link from "next/link"

export default function NotFoundContent({ href = "/" }: { href?: string }) {
  return (
    <div className="content-container py-16 small:py-24">
      <p className="label text-ink-soft mb-2">Fehler 404</p>
      <h1 className="display text-5xl small:text-7xl mb-4">Seite nicht gefunden</h1>
      <p className="text-ink-soft mb-8 max-w-xl leading-7">
        Diese Seite gibt es nicht. Vielleicht wurde die Tasche aus dem Shop entfernt.
      </p>
      <Link href={href} className="btn-primary">
        Zur Startseite
      </Link>
    </div>
  )
}
