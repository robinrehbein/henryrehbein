export default function SectionHeading({
  eyebrow,
  title,
  children,
}: {
  eyebrow?: string
  title: string
  children?: React.ReactNode
}) {
  return (
    <div className="flex flex-col small:flex-row small:items-end justify-between gap-4 border-b border-ink pb-4 mb-6">
      <div>
        {eyebrow && <p className="label text-ink-soft mb-2">{eyebrow}</p>}
        <h2 className="display text-4xl small:text-5xl">{title}</h2>
      </div>
      {children}
    </div>
  )
}
