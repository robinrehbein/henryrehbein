import { Metadata } from "next"
import { notFound } from "next/navigation"

import { getBag } from "@lib/data/bags"
import { bagNumber } from "@lib/util/bag"
import { buildProductStructuredData, toJsonLd } from "@lib/util/product-structured-data"
import { getSiteOrigin } from "@lib/util/site"
import BackendError from "@modules/segel/components/backend-error"
import ProductTemplate from "@modules/products/templates"

type Props = {
  params: Promise<{ countryCode: string; handle: string }>
}

export const dynamic = "force-dynamic"

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { countryCode, handle } = await props.params
  const result = await getBag(countryCode, handle)
  if (!result.ok || !result.bag) {
    return { title: "Tasche" }
  }
  const bag = result.bag
  const number = bagNumber(bag)
  return {
    title: number ? `${bag.title} (Nr. ${number})` : bag.title,
    description: bag.description?.split("\n")[0] || bag.title,
    openGraph: { images: bag.thumbnail ? [bag.thumbnail] : [] },
  }
}

export default async function ProductPage(props: Props) {
  const { countryCode, handle } = await props.params
  const result = await getBag(countryCode, handle)

  if (!result.ok) {
    return (
      <div className="content-container py-16">
        <BackendError reason={result.reason} />
      </div>
    )
  }
  if (!result.bag) {
    notFound()
  }

  const origin = await getSiteOrigin()
  const structuredData = buildProductStructuredData({
    product: result.bag,
    region: result.region,
    countryCode,
    productUrl: `${origin}/${countryCode}/products/${result.bag.handle}`,
  })

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: toJsonLd(structuredData) }}
      />
      <ProductTemplate product={result.bag} />
    </>
  )
}
