import { Metadata } from "next"
import PolicyPlaceholder from "@modules/segel/components/policy-placeholder"

export const metadata: Metadata = { title: "Rückgabe" }

export default function Page() {
  return <PolicyPlaceholder title="Rückgabe" />
}
