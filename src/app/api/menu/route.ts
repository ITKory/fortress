// app/api/menu/route.ts
import { NextResponse, type NextRequest } from "next/server";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID;
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;
const PAGE_SIZE = 10;

type DrivePage = {
    files?: { id: string }[];
    nextPageToken?: string;
};

export async function GET(request: NextRequest) {
    if (!FOLDER_ID || !API_KEY) {
        return NextResponse.json({ error: "Menu storage is not configured" }, { status: 500 });
    }

    try {
        const images: string[] = [];
        let pageToken = request.nextUrl.searchParams.get("pageToken");
        const visitedTokens = new Set<string>();

        do {
            if (pageToken) {
                if (visitedTokens.has(pageToken)) throw new Error("Repeated menu page token");
                visitedTokens.add(pageToken);
            }

            const params = new URLSearchParams({
                q: `'${FOLDER_ID}' in parents and trashed = false and mimeType contains 'image/'`,
                fields: "nextPageToken,files(id)",
                orderBy: "name_natural",
                pageSize: String(PAGE_SIZE - images.length),
                key: API_KEY,
            });
            if (pageToken) params.set("pageToken", pageToken);

            const response = await fetch(`https://www.googleapis.com/drive/v3/files?${params}`, {
                cache: "no-store",
                signal: request.signal,
            });

            if (!response.ok) {
                console.error("Google Drive menu request failed:", response.status);
                return NextResponse.json({ error: "Unable to load menu images" }, { status: 502 });
            }

            const data: DrivePage = await response.json();
            images.push(...(data.files ?? []).map(file => `https://drive.google.com/thumbnail?id=${encodeURIComponent(file.id)}&sz=w1920`));
            pageToken = data.nextPageToken || null;
        } while (pageToken && images.length < PAGE_SIZE);

        return NextResponse.json({ images, nextPageToken: pageToken });
    } catch {
        console.error("Menu images request failed");
        return NextResponse.json({ error: "Unable to load menu images" }, { status: 500 });
    }
}
