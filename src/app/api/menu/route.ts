import { NextResponse } from "next/server"

const CACHE_TTL = 1000 * 60 * 60 // 1 час
let cache: { t: number; v: string[] } = { t: 0, v: [] }

const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i

export async function GET() {
    const SHARE_LINK = process.env.NEXT_PUBLIC_MENU || ""

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
        const limit = 1000;
        let offset = 0;
        let allItems: any[] = [];
        let rootPath = '';
        let total = 0;

        let listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(trimmed)}&limit=${limit}&offset=${offset}&fields=_embedded.items.name,_embedded.items.path,_embedded.items.type,_embedded.items.file`;

        console.time(`Fetch list at offset ${offset}`); // Лог для debug времени
        let listResp = await fetch(listUrl, {
            next: { revalidate: 3600 },
        });
        console.timeEnd(`Fetch list at offset ${offset}`);

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

        let listJson = await listResp.json();
        let items = listJson._embedded?.items ?? [];
        allItems.push(...items);

        rootPath = listJson.path;
        total = listJson._embedded?.total ?? 0;

        offset += items.length;

         while (offset < total) {
            listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(trimmed)}&limit=${limit}&offset=${offset}&fields=_embedded.items.name,_embedded.items.path,_embedded.items.type,_embedded.items.file`;

            console.time(`Fetch list at offset ${offset}`);
            listResp = await fetch(listUrl, {
                next: { revalidate: 3600 },
            });
            console.timeEnd(`Fetch list at offset ${offset}`);

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

            listJson = await listResp.json();
            items = listJson._embedded?.items ?? [];
            allItems.push(...items);

            offset += items.length;
        }

        const imageItems = allItems.filter((it: any) => it.type === "file" && IMAGE_EXT_RE.test(it.name ?? it.path));

        const hrefs: string[] = [];
        const downloadPromises: Promise<string | null>[] = [];

        console.time('Fetch all downloads'); // Лог общего времени на downloads

        imageItems.forEach((it: any) => {
            if (it.file) {
                hrefs.push(it.file);
                return;
            }

            let relativePath = it.path.replace(rootPath, '');
            if (!relativePath.startsWith('/')) {
                relativePath = '/' + relativePath;
            }

            const downloadUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(trimmed)}&path=${encodeURIComponent(relativePath)}`;

            downloadPromises.push(
                fetch(downloadUrl)
                    .then(dlResp => {
                        if (!dlResp.ok) return null;
                        return dlResp.json();
                    })
                    .then(dlJson => typeof dlJson?.href === "string" ? dlJson.href : null)
                    .catch(() => null)
            );
        });

        const results = await Promise.all(downloadPromises);
        results.forEach((r) => r && hrefs.push(r));

        console.timeEnd('Fetch all downloads');

        cache = { t: Date.now(), v: hrefs };

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
