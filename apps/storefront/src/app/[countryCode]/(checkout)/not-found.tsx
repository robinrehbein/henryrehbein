import { Metadata } from "next"
import NotFoundContent from "@modules/segel/components/not-found-content"

export const metadata: Metadata = { title: "Seite nicht gefunden" }

export default function NotFound() {
  return <NotFoundContent />
}
