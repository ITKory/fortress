// app/api/menu/route.ts
import { NextResponse } from "next/server";
import { unstable_cache } from "next/cache";

const PUBLIC_KEY = process.env.NEXT_PUBLIC_MENU?.trim();

if (!PUBLIC_KEY) throw new Error("NEXT_PUBLIC_MENU не задан");

const getImagePaths = unstable_cache(
    async (): Promise<string[]> => {
        const res = await fetch(
            `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${PUBLIC_KEY}&limit=500&fields=_embedded.items.path,_embedded.items.name,_embedded.items.type`,
            {
                headers: { "User-Agent": "RestaurantMenu/1.0" },
                next: { revalidate: 7200 },
            }
        );

        if (!res.ok) throw new Error(`Yandex API error: ${res.status}`);

        const data = await res.json();
        const items = data._embedded?.items ?? [];

        return items
            .filter((item: any) =>
                item.type === "file" && /\.(jpe?g|png|webp|avif)$/i.test(item.name)
            )
            .map((item: any) => item.path)
            .sort();
    },
    ["menu-paths-v2"],
    { revalidate: 7200, tags: ["menu"] }
);

export const runtime = "edge";

export async function GET() {
    try {
        const paths = await getImagePaths();
        return NextResponse.json(paths, {
            headers: { "Cache-Control": "public, s-maxage=7200, stale-while-revalidate=86400" },
        });
    } catch (err) {
        console.error(err);
        try {
            const cached = await getImagePaths();
            return NextResponse.json(cached, { status: 503 });
        } catch {
            return NextResponse.json([], { status: 503 });
        }
    }
}
