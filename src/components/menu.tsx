"use client";

import { type JSX, useEffect, useState } from "react";
import { Button } from "@/src/components/ui/button";
import { ParallaxScroll } from "@/src/components/parallax-scroll";
import {
    Drawer,
    DrawerTrigger,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,  // ← Добавь этот импорт, если ещё нет
} from "@/src/components/ui/drawer";
import { useLockBodyScroll } from "@/src/hooks/use-lock-body-scroll";

export default function Menu(): JSX.Element {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isOpen, setIsOpen] = useState(false);
    useLockBodyScroll(isOpen);

    useEffect(() => {
        if (!isOpen) return;

        const controller = new AbortController();
        setLoading(true);
        setError(null);

        fetch("/api/menu", { signal: controller.signal })
            .then(r => {
                if (!r.ok) throw new Error(`HTTP ${r.status}: ${r.statusText}`);
                return r.json();
            })
            .then((urls: string[]) => {
                if (!Array.isArray(urls) || urls.length === 0) {
                    setImageUrls([]);
                    return;
                }
                console.log("Получено изображений:", urls.length, "первые:", urls.slice(0, 2));
                setImageUrls(urls);
            })
            .catch((err) => {
                if (err instanceof Error && err.name === "AbortError") return;
                console.error("API error:", err);
                setError("Не удалось загрузить меню — проверь sharing в Google Drive (каждый файл 'Anyone with the link')");
            })
            .finally(() => {
                if (!controller.signal.aborted) {
                    setLoading(false);
                }
            });

        return () => controller.abort();
    }, [isOpen]);

    const prefetch = () => fetch("/api/menu", { cache: "force-cache" }).catch(() => {});

    return (
        <section id="menu" className="py-12 md:py-24 px-4 bg-gradient-to-t from-card/90 to-card/10">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 text-balance">
                    Изысканное меню
                </h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
                    Наши повара создают кулинарные шедевры, сочетая традиционные рецепты с современными техниками
                </p>

                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            size="lg"
                            variant="outline"
                            onMouseEnter={prefetch}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300"
                        >
                            Посмотреть меню
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent className="h-[90dvh] max-h-screen">
                        <DrawerTitle className="sr-only">Меню ресторана</DrawerTitle>
                        <DrawerDescription className="sr-only">Галерея блюд</DrawerDescription>

                        <div
                            className="h-full overflow-hidden pt-16 pb-8 px-4"
                            data-vaul-no-drag=""
                        >
                            {loading && (
                                <div className="flex flex-col items-center justify-center h-full gap-4">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
                                    <p className="text-muted-foreground">Загружаем свежее меню...</p>
                                </div>
                            )}

                            {error && (
                                <div className="flex flex-col items-center justify-center h-full text-destructive">
                                    <p className="text-lg font-medium">Ошибка загрузки</p>
                                    <p className="text-sm mt-2">{error}</p>
                                </div>
                            )}

                            {!loading && !error && imageUrls.length === 0 && (
                                <div className="flex items-center justify-center h-full text-muted-foreground">
                                    Меню пустое — добавь публичные jpg в Google Drive папку
                                </div>
                            )}

                            {!loading && !error && imageUrls.length > 0 && (
                                <ParallaxScroll
                                    images={imageUrls}
                                />
                            )}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </section>
    );
}
