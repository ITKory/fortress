import { NextResponse } from "next/server"

const CACHE_TTL = 1000 * 60 * 60 // 1 час
let cache: { t: number; v: string[] } = { t: 0, v: [] }

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i

export async function GET() {
    if (Date.now() - cache.t < CACHE_TTL && cache.v.length) return NextResponse.json(cache.v);

    const SHARE_LINK = process.env.NEXT_PUBLIC_MENU;

    if (!SHARE_LINK || SHARE_LINK.trim().length === 0) {
        return NextResponse.json(
            {
                error: "Не настроена переменная окружения",
                message: "Добавьте MENU_PUBLIC_KEY или NEXT_PUBLIC_MENU в разделе Vars",
                hint: "Укажите публичную ссылку на папку Яндекс.Диска (например: https://disk.yandex.ru/d/xxxxx)",
            },
            { status: 500 },
        )
    }

    const trimmed = SHARE_LINK.trim()

    try {
        const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(trimmed)}&limit=200&fields=_embedded.items.name,_embedded.items.path,_embedded.items.type,_embedded.items.file`

        const listResp = await fetch(listUrl, {
            next: { revalidate: 3600 },
        })

        if (!listResp.ok) {
            const errorText = await listResp.text()
            return NextResponse.json(
                {
                    error: "Ошибка Яндекс.Диска",
                    message: `Не удалось получить список файлов (статус ${listResp.status})`,
                    hint: "Проверьте, что ссылка правильная и папка доступна публично",
                    details: errorText,
                },
                { status: 502 },
            )
        }

        const listJson = await listResp.json()
        const items = listJson._embedded?.items ?? []

        const imageItems = items.filter((it: any) => it.type === "file" && IMAGE_EXT_RE.test(it.name ?? it.path))

        const hrefs: string[] = []

        const batchSize = 10
        for (let i = 0; i < imageItems.length; i += batchSize) {
            const batch = imageItems.slice(i, i + batchSize)
            const promises = batch.map(async (it: any) => {
                if (it.file) return it.file;


                const pathForApi = it.path ?? it.name
                const downloadUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(trimmed)}&path=${encodeURIComponent(pathForApi ?? "")}`

                try {
                    const dlResp = await fetch(downloadUrl)
                    if (!dlResp.ok) return null
                    const dlJson = await dlResp.json()
                    return typeof dlJson.href === "string" ? dlJson.href : null
                } catch {
                    return null
                }
            })

            const results = await Promise.all(promises)
            results.forEach((r) => r && hrefs.push(r))
        }

        cache = { t: Date.now(), v: hrefs }

        return NextResponse.json(hrefs, {
            headers: {
                "Cache-Control": "public, s-maxage=3600, stale-while-revalidate=7200",
            },
        })
    } catch (err) {
        return NextResponse.json(
            {
                error: "Ошибка сервера",
                message: "Произошла непредвиденная ошибка при загрузке изображений",
                details: err instanceof Error ? err.message : String(err),
            },
            { status: 500 },
        )
    }
}
