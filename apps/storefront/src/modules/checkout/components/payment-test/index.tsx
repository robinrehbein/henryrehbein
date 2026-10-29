import { clx } from "@modules/common/components/ui"

const PaymentTest = ({ className }: { className?: string }) => {
  return (
    <span className={clx("label inline-block bg-blau text-papier px-2 py-1", className)}>
      Nur zu Testzwecken
    </span>
  )
}

export default PaymentTest
