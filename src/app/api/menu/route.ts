// pages/api/menu.ts или app/api/menu/route.ts
import { NextResponse } from "next/server"

export async function GET() {
    const SHARE_LINK = process.env.NEXT_PUBLIC_MENU?.trim()

    if (!SHARE_LINK) {
        return NextResponse.json({ error: "Нет ссылки на меню" }, { status: 500 })
    }

    try {
        // 1. Получаем все файлы из публичной папки
        const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(
            SHARE_LINK
        )}&limit=1000&fields=_embedded.items.path,_embedded.items.type`

        const listResp = await fetch(listUrl, { next: { revalidate: 3600 } })
        if (!listResp.ok) throw new Error(`Yandex list error ${listResp.status}`)

        const listJson = await listResp.json()
        const items = listJson._embedded?.items ?? []

        const imageItems = items.filter(
            (it: any) => it.type === "file" && /\.(jpe?g|png|webp|avif)$/i.test(it.name)
        )

        // 2. Для каждого изображения получаем ПРЯМУЮ вечную ссылку через preview
        const promises = imageItems.map(async (item: any) => {
            const path = encodeURIComponent(item.path)
            const previewUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/preview?public_key=${encodeURIComponent(
                SHARE_LINK
            )}&path=${path}&size=XXXL`

            const r = await fetch(previewUrl, { next: { revalidate: 86400 } })
            if (!r.ok) return null
            const j = await r.json()
            return j.href || null
        })

        const hrefs = (await Promise.all(promises)).filter(Boolean) as string[]

        return NextResponse.json(hrefs, {
            headers: {
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
            },
        })
    } catch (err) {
        console.error("Menu API error:", err)
        return NextResponse.json({ error: "Не удалось загрузить меню" }, { status: 500 })
    }
}
