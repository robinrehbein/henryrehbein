"use client"

import Image from "next/image"
import { useState } from "react"

export default function BagGallery({
  images,
  title,
  sold,
}: {
  images: string[]
  title: string
  sold: boolean
}) {
  const [active, setActive] = useState(0)

  if (!images.length) {
    return (
      <div className="aspect-[4/3] bg-papier flex items-center justify-center label text-ink-soft">
        Kein Bild hinterlegt
      </div>
    )
  }

  return (
    <div className="flex flex-col h-full">
      {/* Desktop: the photo grows to fill the row, the strip sits on the bottom border. */}
      <div className="relative aspect-[4/3] small:aspect-auto small:flex-1 small:min-h-[420px] bg-papier">
        <Image
          src={images[active]}
          alt={`${title}, Ansicht ${active + 1} von ${images.length}`}
          fill
          priority
          sizes="(max-width: 1024px) 100vw, 60vw"
          className={`object-cover ${sold ? "grayscale" : ""}`}
        />
      </div>
      {images.length > 1 && (
        <ul className="flex overflow-x-auto overscroll-x-contain snap-x border-y small:border-b-0 border-ink [scrollbar-width:thin] [scrollbar-color:theme(colors.ink)_transparent]" aria-label="Ansichten">
          {images.map((url, i) => (
            <li key={url} className="shrink-0 w-24 small:w-32 snap-start bg-segel border-r border-ink">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ansicht ${i + 1} zeigen`}
                aria-pressed={i === active}
                className={`relative block w-full aspect-square focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-6px] focus-visible:outline-ink ${
                  i === active
                    ? "after:absolute after:inset-0 after:border-[3px] after:border-blau"
                    : "opacity-80 hover:opacity-100"
                }`}
              >
                <Image src={url} alt="" fill sizes="120px" className="object-cover" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
