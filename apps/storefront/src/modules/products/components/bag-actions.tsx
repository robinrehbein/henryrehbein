"use client"

import { addToCart, retrieveCart } from "@lib/data/cart"
import { notifyCartUpdated } from "@lib/util/cart-events"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useParams, useRouter } from "next/navigation"
import { useEffect, useState } from "react"

type State = "checking" | "idle" | "adding" | "in-cart" | "unavailable"

/**
 * Add-to-cart for a unique bag. Quantity is always 1, and a bag that is
 * already in the cart cannot be added again.
 */
export default function BagActions({ variantId }: { variantId: string }) {
  const { countryCode } = useParams() as { countryCode: string }
  const router = useRouter()
  const [state, setState] = useState<State>("checking")
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    retrieveCart(undefined, "id,items.id,items.variant_id")
      .then((cart) => {
        const inCart = cart?.items?.some((i) => i.variant_id === variantId)
        setState(inCart ? "in-cart" : "idle")
      })
      .catch(() => setState("idle"))
  }, [variantId])

  const add = async () => {
    setError(null)
    setState("adding")
    try {
      await addToCart({ variantId, quantity: 1, countryCode })
      notifyCartUpdated()
      setState("in-cart")
    } catch {
      setState("unavailable")
      setError(
        "Diese Tasche konnte nicht in den Warenkorb gelegt werden. Vermutlich wurde sie gerade verkauft."
      )
      router.refresh()
    }
  }

  if (state === "in-cart") {
    return (
      <div className="flex flex-col gap-3" role="status">
        <p className="font-semibold">Die Tasche liegt in deinem Warenkorb.</p>
        <LocalizedClientLink href="/cart" className="btn-primary" data-testid="go-to-cart">
          Zum Warenkorb
        </LocalizedClientLink>
        <p className="text-sm text-ink-soft">
          Der Warenkorb reserviert die Tasche nicht. Erst mit Abschluss der Bestellung ist sie
          verkauft.
        </p>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        type="button"
        onClick={add}
        disabled={state !== "idle"}
        className="btn-primary w-full"
        data-testid="add-product-button"
      >
        {state === "adding"
          ? "Wird hinzugefügt …"
          : state === "checking"
          ? "Einen Moment …"
          : state === "unavailable"
          ? "Nicht verfügbar"
          : "In den Warenkorb"}
      </button>
      {error ? (
        <p role="alert" className="text-sm text-[#b42318]">
          {error}
        </p>
      ) : (
        <p className="text-sm text-ink-soft">Einzelstück · genau 1 Exemplar</p>
      )}
    </div>
  )
}
