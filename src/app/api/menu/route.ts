// app/api/menu/route.ts
import { NextResponse } from "next/server"

export async function GET() {
    const SHARE_LINK = process.env.NEXT_PUBLIC_MENU?.trim()

    if (!SHARE_LINK) {
        return NextResponse.json({ error: "Не настроена переменная NEXT_PUBLIC_MENU" }, { status: 500 })
    }

    try {
        let allItems: any[] = []
        let offset = 0
        const limit = 500

        while (true) {
            const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(
                SHARE_LINK
            )}&limit=${limit}&offset=${offset}&fields=_embedded.items.path,_embedded.items.type,_embedded.items.name,_embedded.total`

            const resp = await fetch(listUrl, { next: { revalidate: 3600 } })
            if (!resp.ok) {
                const text = await resp.text()
                return NextResponse.json(
                    { error: "Ошибка Яндекс.Диска", details: `Статус ${resp.status}`, raw: text },
                    { status: 502 }
                )
            }

            const json = await resp.json()
            const items = json._embedded?.items ?? []
            allItems.push(...items)

            const total = json._embedded?.total ?? 0
            if (offset + items.length >= total || items.length === 0) break

            offset += items.length
        }

        // Фильтруем только картинки
        const imageItems = allItems.filter(
            (it: any) => it.type === "file" && /\.(jpe?g|png|webp|avif|heic)$/i.test(it.name)
        )

        // Получаем вечные preview-ссылки параллельно
        const previewPromises = imageItems.map(async (item: any) => {
            const path = encodeURIComponent(item.path)
            const url = `https://cloud-api.yandex.net/v1/disk/public/resources/preview?public_key=${encodeURIComponent(
                SHARE_LINK
            )}&path=${path}&size=XXXL`

            try {
                const r = await fetch(url, { next: { revalidate: 86400 } })
                if (!r.ok) return null
                const j = await r.json()
                return j.href ?? null
            } catch {
                return null
            }
        })

        const hrefs = (await Promise.all(previewPromises)).filter(Boolean) as string[]

        // Сортируем по имени файла, чтобы порядок всегда был одинаковый
        const sortedHrefs = hrefs.sort((a, b) => a.localeCompare(b))

        return NextResponse.json(sortedHrefs, {
            headers: {
                "Cache-Control": "public, s-maxage=86400, stale-while-revalidate=172800",
            },
        })
    } catch (err) {
        console.error("Menu API fatal error:", err)
        return NextResponse.json(
            { error: "Внутренняя ошибка сервера", details: err instanceof Error ? err.message : String(err) },
            { status: 500 }
        )
    }
}

// Если используешь App Router и хочешь отключить полный статический рендер
export const dynamic = "force-dynamic"
export const revalidate = 3600
