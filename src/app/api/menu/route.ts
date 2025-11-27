// app/api/menu/route.ts
import { NextResponse } from "next/server"

const SHARE_LINK = process.env.NEXT_PUBLIC_MENU?.trim()
const CACHE_KEY = "menu_original_quality"

export const revalidate = 7200 // 2 часа

declare global {
    var menu_original_quality: string[] | undefined
}

export async function GET() {
    if (!SHARE_LINK) {
        return NextResponse.json({ error: "Нет ссылки" }, { status: 500 })
    }

    if (globalThis[CACHE_KEY]) {
        return NextResponse.json(globalThis[CACHE_KEY])
    }

    try {
         const res = await fetch(
            `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${SHARE_LINK}&limit=500&fields=_embedded.items.path,_embedded.items.name,_embedded.items.type`,
            {
                headers: { "User-Agent": "BashnyaMenu/1.0" },
            }
        )

        if (!res.ok) throw new Error("Yandex list failed")

        const json = await res.json()
        const items = json._embedded?.items ?? []

        const imagePaths = items
            .filter((item: any) =>
                item.type === "file" && /\.(jpe?g|png|webp|avif)$/i.test(item.name)
            )
            .map((item: any) => item.path)

         const directLinks = imagePaths.map((path: string) => {
            const encoded = encodeURIComponent(path)
            return `https://getfile.dokpub.com/yandex/get/${SHARE_LINK}${encoded}`
        })

        const sorted = directLinks.sort((a: string, b: any) => a.localeCompare(b))

         globalThis[CACHE_KEY] = sorted

        return NextResponse.json(sorted, {
            headers: {
                "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=86400",
            },
        })
    } catch (err) {
        console.error("Menu error:", err)
        return NextResponse.json(globalThis[CACHE_KEY] || [])
    }
}
