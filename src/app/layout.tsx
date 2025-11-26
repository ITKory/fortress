import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import "./globals.css"
import { Suspense } from "react"

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
    metadataBase: new URL("https://bashnyarest.com"),

    title: "Сеть Ресторанов | Башня",
    description: "Откройте для себя мир изысканной кухни в наших халяль ресторанах.",

    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/logo.svg",
    },

    openGraph: {
        title: "Сеть Ресторанов | Башня",
        description: "Откройте для себя мир изысканной кухни в наших халяль ресторанах.",
        url: "https://bashnyarest.com/",
        siteName: "Башня",
        locale: "ru_RU",
        type: "website",
        images: [
            {
                url: "/logo.svg",
                width: 1200,
                height: 630,
                alt: "Башня — вайнахская кухня",
            },
        ],
    },

    twitter: {
        card: "summary_large_image",
        title: "Сеть Ресторанов | Башня",
        description: "Откройте для себя мир изысканной кухни в наших халяль ресторанах.",
        images: ["/logo.svg"],
    },
}

export default function RootLayout({
                                     children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
  return (
      <html
          lang="ru"
          className={`${cormorant.variable} ${inter.variable} ${GeistSans.variable} ${GeistMono.variable} antialiasing`}
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
