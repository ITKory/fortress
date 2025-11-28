// app/api/menu/route.ts
import { NextResponse } from "next/server";

const FOLDER_ID = process.env.GOOGLE_DRIVE_FOLDER_ID || "1iDEO-RWT5EwsIe2nCXUB3RYLls5VoSd9";
const API_KEY = process.env.GOOGLE_DRIVE_API_KEY;


export const revalidate = 7200;

export async function GET() {
    try {
        const res = await fetch(
            `https://www.googleapis.com/drive/v3/files?q='${FOLDER_ID}'+in+parents&fields=files(id,name,mimeType)&key=${API_KEY}`
        );

        if (!res.ok) {
            const errorText = await res.text();
            console.error("Google API error:", res.status, errorText);
            return NextResponse.json({ error: `API error: ${res.status}` }, { status: res.status });
        }

        const data = await res.json();

        if (!data.files || data.files.length === 0) {
            return NextResponse.json([]);
        }

        const images = data.files
            .filter((f: any) => /\.(jpe?g|png|webp|avif)$/i.test(f.name) && f.mimeType?.startsWith("image/"))
            .slice(0, 10)  // Лимит 10
            .map((f: any) => `https://drive.google.com/thumbnail?id=${f.id}&sz=w1920`)  // ← Изменено!
            .sort();

        console.log(`Получено ${images.length} thumbnail-URL из Google Drive`);
        return NextResponse.json(images);
    } catch (err) {
        console.error("Menu error:", err);
        return NextResponse.json([], { status: 500 });
    }
}
