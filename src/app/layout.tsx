import type React from "react"
import type { Metadata } from "next"
import { GeistSans } from "geist/font/sans"
import { GeistMono } from "geist/font/mono"
import { Analytics } from "@vercel/analytics/next"
import { Cormorant_Garamond, Inter } from "next/font/google"
import ClientLayout from "./client-layout"
import "./globals.css"
import { Suspense } from "react"
import Script from "next/script"

const cormorant = Cormorant_Garamond({
    subsets: ["latin", "cyrillic"],
    weight: ["300", "400", "500", "600", "700"],
    variable: "--font-cormorant",
})

const inter = Inter({
    subsets: ["latin", "cyrillic"],
    variable: "--font-inter",
})

export const metadata: Metadata = {
    metadataBase: new URL("https://bashnyarest.com"),

    title: {
        default: "Сеть Ресторанов | Башня",
        template: "%s | Башня",
    },
    description:
        "Сеть халяль-ресторанов Башня в Москве. Авторская вайнахская (чеченская и ингушская) кухня, хинкал, шашлыки, долма, манты. Только халяль продукты, уютная атмосфера и быстрая доставка.",

    keywords:
        "Башня, халяль ресторан Москва, вайнахская кухня, чеченская кухня, ингушская кухня, хинкал Москва, шашлыки халяль, долма, манты, халяль кафе, ресторан халяль",

    icons: {
        icon: "/logo.svg",
        shortcut: "/logo.svg",
        apple: "/apple-touch-icon.png",
    },
    openGraph: {
        title: "Башня — Вайнахская кухня • Халяль рестораны в Москве",
        description:
            "Авторская вайнахская кухня в халяль-ресторанах Башня. Хинкал, шашлыки, долма, манты — всё по традиционным рецептам и только из халяльных продуктов.",
        url: "https://bashnyarest.com",
        siteName: "Башня",
        locale: "ru_RU",
        type: "website",
        images: [
            {
                url: "https://bashnyarest.com/logo.svg",
                width: 1200,
                height: 630,
                alt: "Рестораны Башня — вайнахская халяль кухня в Москве",
            },
        ],
    },
}

export default function RootLayout({
                                       children,
                                   }: Readonly<{
    children: React.ReactNode
}>) {
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "Restaurant",
        name: "Башня",
        image: "https://bashnyarest.com/logo.svg",
        "@id": "https://bashnyarest.com/#organization",
        url: "https://bashnyarest.com",
        telephone: "+7 (905) 977-57-00",
        priceRange: "₽₽",
        description: metadata.description,
        address: {
            "@type": "PostalAddress",
            streetAddress: "Пресненская набережная, д. 10",
            addressLocality: "Москва",
            postalCode: "123112",
            addressCountry: "RU",
        },
        geo: {
            "@type": "GeoCoordinates",
            latitude: 55.7485,
            longitude: 37.5392,
        },
        openingHoursSpecification: [
            {
                "@type": "OpeningHoursSpecification",
                dayOfWeek: [
                    "Monday",
                    "Tuesday",
                    "Wednesday",
                    "Thursday",
                    "Friday",
                    "Saturday",
                    "Sunday",
                ],
                opens: "11:00",
                closes: "23:00",
            },
        ],
        servesCuisine: ["Вайнахская кухня", "Чеченская кухня", "Ингушская кухня", "Халяль"],
        hasMenu: "https://bashnyarest.com/menu",
        acceptsReservations: "Yes",
        sameAs: [
            "https://www.instagram.com/bashnya_rest",
        ],
        aggregateRating: {
            "@type": "AggregateRating",
            ratingValue: "4.8",
            reviewCount: "342",
        },
    }

    return (
        <html
            lang="ru"
            className={`${cormorant.variable} ${inter.variable} ${GeistSans.variable} ${GeistMono.variable} antialiased`}
        >
        <head>
            <Script
                id="jsonld-restaurant"
                type="application/ld+json"
                strategy="afterInteractive"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            {/* Favicon */}
            <link rel="icon" href="/logo.svg" />
            <link rel="apple-touch-icon" sizes="180x180" href="/logo.svg" />
            <title>Сеть Ресторанов | Башня</title>
        </head>

        <body className="font-sans scroll-smooth">
        <Suspense fallback={null}>
            <ClientLayout>{children}</ClientLayout>
        </Suspense>
        <Analytics />
        </body>
        </html>
    )
}
