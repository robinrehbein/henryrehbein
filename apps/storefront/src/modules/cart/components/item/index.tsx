"use client"

import { deleteLineItem } from "@lib/data/cart"
import { notifyCartUpdated } from "@lib/util/cart-events"
import { convertToLocale } from "@lib/util/money"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Image from "next/image"
import { useRouter } from "next/navigation"
import { useState } from "react"

type ItemProps = {
  item: HttpTypes.StoreCartLineItem
  currencyCode: string
  unavailable?: boolean
  type?: "full" | "preview"
}

const Item = ({ item, currencyCode, unavailable = false, type = "full" }: ItemProps) => {
  const router = useRouter()
  const [removing, setRemoving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const remove = async () => {
    setError(null)
    setRemoving(true)
    try {
      await deleteLineItem(item.id)
      notifyCartUpdated()
      router.refresh()
    } catch {
      setError("Entfernen hat nicht geklappt. Bitte versuche es erneut.")
      setRemoving(false)
    }
  }

  const number = item.variant?.sku

  return (
    <div className="grid grid-cols-[88px_1fr_auto] small:grid-cols-[120px_1fr_auto] gap-4 p-4" data-testid="product-row">
      <LocalizedClientLink
        href={`/products/${item.product_handle}`}
        className="relative block aspect-[4/5] bg-papier border border-ink"
      >
        {item.thumbnail && (
          <Image
            src={item.thumbnail}
            alt={item.product_title ?? ""}
            fill
            sizes="120px"
            className={`object-cover ${unavailable ? "grayscale opacity-60" : ""}`}
          />
        )}
      </LocalizedClientLink>
      <div className="flex flex-col gap-1 min-w-0">
        {number && <span className="label text-ink-soft">Nr. {number}</span>}
        <LocalizedClientLink
          href={`/products/${item.product_handle}`}
          className="font-semibold text-lg leading-tight hover:underline underline-offset-4"
          data-testid="product-title"
        >
          {item.product_title}
        </LocalizedClientLink>
        <span className="text-sm text-ink-soft">Einzelstück · Menge 1</span>
        {unavailable && (
          <span className="label text-[#b42318] mt-1">Inzwischen verkauft</span>
        )}
        {type === "full" && (
          <button
            type="button"
            onClick={remove}
            disabled={removing}
            className="self-start mt-auto pt-2 text-sm underline underline-offset-4 hover:text-blau disabled:opacity-50"
            data-testid="product-delete-button"
          >
            {removing ? "Wird entfernt …" : "Entfernen"}
          </button>
        )}
        {error && (
          <p role="alert" className="text-sm text-[#b42318]">
            {error}
          </p>
        )}
      </div>
      <span className={`font-semibold text-lg ${unavailable ? "line-through text-ink-soft" : ""}`}>
        {convertToLocale({ amount: item.total ?? 0, currency_code: currencyCode })}
      </span>
    </div>
  )
}

export default Item
