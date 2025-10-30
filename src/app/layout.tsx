import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import "./globals.css"
import { Suspense } from "react"

// (опционально) можно импортировать картинку как StaticImageData
// import ogImage from "../public/images/og-image.jpg";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600", "700"],
  variable: "--font-cormorant",
})

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
})

export const metadata: Metadata = {
  title: "Сеть Ресторанов | Башня",
  description: "Откройте для себя мир изысканной кухни в наших халяль ресторанах.",

   icons: {
    icon: "/logo.svg",
    shortcut: "/logo.svg",
    apple: "/logo.svg",
  },

  // Open Graph / Social
  openGraph: {
    title: "Сеть Ресторанов | Башня",
    description: "Откройте для себя мир изысканной кухни в наших халяль ресторанах.",
    url: "https://stekloplast-engineering.ru",
    siteName: "Башня",
    locale: "ru_RU",
    type: "website",
    images: [
      {
        url: "/fortress.svg",
        width: 1200,
        height: 630,
        alt: "Башня — изысканная кухня",
      },
    ],
  },
}

export default function RootLayout({
                                     children,
                                   }: {
  children: React.ReactNode
}) {
  return (
      <html
          lang="ru"
          className={`${cormorant.variable} ${inter.variable} ${GeistSans.variable} ${GeistMono.variable} antialiased`}
      >
      <body className="font-sans scroll-smooth">
      <Suspense fallback={<div>Loading...</div>}>
        <ClientLayout>{children}</ClientLayout>
      </Suspense>
      <Analytics />
      </body>
      </html>
  )
}
