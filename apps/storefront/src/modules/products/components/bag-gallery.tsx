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
      <div className="aspect-[4/5] bg-papier flex items-center justify-center label text-ink-soft">
        Kein Bild hinterlegt
      </div>
    )
  }

  return (
    <div className="flex flex-col">
      <div className="relative aspect-[4/5] bg-papier">
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
        <ul className="grid grid-cols-4 small:grid-cols-6 gap-px bg-ink border-t border-ink" aria-label="Ansichten">
          {images.map((url, i) => (
            <li key={url} className="bg-segel">
              <button
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Ansicht ${i + 1} zeigen`}
                aria-pressed={i === active}
                className={`relative block w-full aspect-square ${
                  i === active ? "outline outline-3 outline-blau -outline-offset-[3px]" : "opacity-80 hover:opacity-100"
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
