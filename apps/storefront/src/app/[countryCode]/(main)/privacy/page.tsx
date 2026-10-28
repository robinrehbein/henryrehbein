import { Metadata } from "next"
import PolicyPlaceholder from "@modules/segel/components/policy-placeholder"

export const metadata: Metadata = { title: "Datenschutz" }

export default function Page() {
  return <PolicyPlaceholder title="Datenschutz" />
}
