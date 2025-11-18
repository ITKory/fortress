// app/api/menu/route.ts
import { NextResponse } from "next/server"

export async function GET() {
    const SHARE_LINK = process.env.NEXT_PUBLIC_MENU?.trim()
    console.log('load menu')

    if (!SHARE_LINK) {
        return NextResponse.json({ error: "Не настроена переменная NEXT_PUBLIC_MENU" }, { status: 500 })
    }

    try {
        let allItems: any[] = []
        let offset = 0
        const limit = 500

        // 1. Получаем список всех файлов (кэшируем на 1 час)
        while (true) {
            const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${SHARE_LINK}&limit=${limit}&offset=${offset}&fields=_embedded.items.path,_embedded.items.type,_embedded.items.name`

            const resp = await fetch(listUrl, { next: { revalidate: 3600 } })
            if (!resp.ok) {
                const text = await resp.text()
                return NextResponse.json(
                    { error: "Ошибка Яндекс.Диска (список)", details: `Статус ${resp.status}`, raw: text },
                    { status: 502 }
                )
            }

            const json = await resp.json()
            const items = json._embedded?.items ?? []
            allItems.push(...items)

            if (items.length < limit) break
            offset += items.length
        }

        // 2. Только изображения
        const imageItems = allItems.filter(
            (it: any) => it.type === "file" && /\.(jpe?g|png|webp|avif|heic)$/i.test(it.name)
        )

        // 3. Параллельно получаем прямые ссылки на скачивание (они же для просмотра)
        const downloadPromises = imageItems.map(async (item: any) => {
            const pathEncoded = encodeURIComponent(item.path)
            const url = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${SHARE_LINK}&path=${pathEncoded}`

            try {
                const r = await fetch(url, { next: { revalidate: 3600 } }) // тоже кэшируем
                if (!r.ok) return null
                const j = await r.json()
                return j.href ?? null // это и есть прямая ссылка на файл
            } catch {
                return null
            }
        })

        let directLinks = await Promise.all(downloadPromises)
        directLinks = directLinks.filter(Boolean) as string[]

        const sortedLinks = directLinks.toSorted((a, b) => a.localeCompare(b))

        return NextResponse.json(sortedLinks, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
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

export const dynamic = "force-dynamic"
export const revalidate = 3600
