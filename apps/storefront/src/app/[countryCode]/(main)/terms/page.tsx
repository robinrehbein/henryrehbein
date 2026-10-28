import { Metadata } from "next"
import PolicyPlaceholder from "@modules/segel/components/policy-placeholder"

export const metadata: Metadata = { title: "AGB" }

export default function Page() {
  return <PolicyPlaceholder title="AGB" />
}
