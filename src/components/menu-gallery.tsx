"use client";

import { useState } from "react";
import { Masonry } from "antd";
import { ImageOff } from "lucide-react";
import { cn } from "@/src/lib/utils";

function MenuImage({ src, index }: Readonly<{ src: string; index: number }>) {
    const [status, setStatus] = useState<"loading" | "loaded" | "error">("loading");

    return (
        <div className="relative overflow-hidden rounded-2xl bg-secondary/60 ring-1 ring-border/50 sm:rounded-3xl">
            {status === "error" ? (
                <div className="flex aspect-[3/2] flex-col items-center justify-center gap-3 px-4 text-center text-muted-foreground" role="img" aria-label={`Фото блюда ${index + 1} недоступно`}>
                    <ImageOff className="size-7" aria-hidden="true" />
                    <p className="text-sm">Не удалось загрузить фото</p>
                </div>
            ) : (
                <>
                    {status === "loading" && (
                        <div className="absolute inset-0 bg-secondary motion-safe:animate-pulse" aria-hidden="true" />
                    )}
                    <img
                        src={src}
                        alt={`Блюдо из меню ресторана «Башня» — фото ${index + 1}`}
                        loading={index < 3 ? "eager" : "lazy"}
                        decoding="async"
                        className={cn(
                            "block h-auto w-full motion-safe:transition-opacity motion-safe:duration-300",
                            status === "loaded" ? "opacity-100" : "aspect-[3/2] opacity-0",
                        )}
                        onLoad={() => setStatus("loaded")}
                        onError={() => setStatus("error")}
                    />
                </>
            )}
        </div>
    );
}

export default function MenuGallery({ images }: Readonly<{ images: string[] }>) {
    return (
        <Masonry
            columns={{ xs: 1, md: 2, xl: 3 }}
            gutter={{ xs: 12, md: 16, xl: 20 }}
            fresh
            items={images.map((src, index) => ({ key: src, data: { src, index } }))}
            itemRender={({ data }) => <MenuImage src={data.src} index={data.index} />}
        />
    );
}
