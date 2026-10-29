import { getBaseURL } from "@lib/util/env"
import { Metadata } from "next"
import { Archivo, IBM_Plex_Mono } from "next/font/google"
import "styles/globals.css"

const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "800"],
  variable: "--font-archivo",
  display: "swap",
})

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
})

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  title: {
    default: "Segelstück – Taschen aus Segelstoff",
    template: "%s | Segelstück",
  },
  description:
    "Handgemachte Taschen aus Segelstoff. Jede Tasche ist ein Einzelstück. Demo-Shop.",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html
      lang="de"
      data-mode="light"
      className={`${archivo.variable} ${plexMono.variable}`}
    >
      <head>
        <link rel="ucp" href="/.well-known/ucp" />
      </head>
      <body>
        <main className="relative">{props.children}</main>
      </body>
    </html>
  )
}
