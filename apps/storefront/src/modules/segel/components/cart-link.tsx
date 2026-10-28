"use client"

import { retrieveCart } from "@lib/data/cart"
import { CART_UPDATED_EVENT } from "@lib/util/cart-events"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import { useEffect, useState } from "react"

/** Cart link with item count, refreshed whenever the cart changes. */
export default function CartLink() {
  const [count, setCount] = useState<number | null>(null)

  useEffect(() => {
    const load = () =>
      retrieveCart(undefined, "id,items.id,items.quantity")
        .then((cart) =>
          setCount(cart?.items?.reduce((n, i) => n + i.quantity, 0) ?? 0)
        )
        .catch(() => setCount(0))
    load()
    window.addEventListener(CART_UPDATED_EVENT, load)
    return () => window.removeEventListener(CART_UPDATED_EVENT, load)
  }, [])

  return (
    <LocalizedClientLink
      href="/cart"
      className="flex items-center gap-2 h-full px-3 small:px-4 border-l border-ink hover:bg-ink hover:text-white"
      data-testid="nav-cart-link"
    >
      <span>Warenkorb</span>
      <span
        className="label inline-flex min-w-6 h-6 px-1 items-center justify-center bg-ink text-white"
        aria-label={`${count ?? 0} Artikel`}
      >
        {count ?? 0}
      </span>
    </LocalizedClientLink>
  )
}
