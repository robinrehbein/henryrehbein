import { retrieveCartWithStock } from "@lib/data/bags"
import CartTemplate from "@modules/cart/templates"
import BackendError from "@modules/segel/components/backend-error"
import { Metadata } from "next"

export const dynamic = "force-dynamic"

export const metadata: Metadata = {
  title: "Warenkorb",
}

export default async function Cart() {
  const cart = await retrieveCartWithStock()
  if (cart === "backend") {
    return (
      <div className="content-container py-16">
        <BackendError reason="backend" />
      </div>
    )
  }
  return <CartTemplate cart={cart} />
}
