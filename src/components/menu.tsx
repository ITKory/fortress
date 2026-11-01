"use client";

import { type JSX, useCallback, useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { RefreshCw, UtensilsCrossed, X } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import {
    Drawer,
    DrawerContent,
    DrawerTitle,
    DrawerDescription,
    DrawerClose,
} from "@/src/components/ui/drawer";
import { useLockBodyScroll } from "@/src/hooks/use-lock-body-scroll";
import { useMenu } from "@/src/components/menu-provider";

function MenuLoading() {
    return (
        <div role="status">
            <p className="sr-only">Загружаем меню…</p>
            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 md:gap-4 xl:grid-cols-3 xl:gap-5" aria-hidden="true">
                {Array.from({ length: 10 }, (_, index) => (
                    <div key={index} className="aspect-[3/2] rounded-2xl bg-secondary motion-safe:animate-pulse sm:rounded-3xl" />
                ))}
            </div>
        </div>
    );
}

const MenuGallery = dynamic(() => import("@/src/components/menu-gallery"), {
    loading: () => <MenuLoading />,
});

export default function Menu(): JSX.Element {
    const [imageUrls, setImageUrls] = useState<string[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const { isOpen, setIsOpen, openMenu, restoreFocus } = useMenu();
    const [nextPageToken, setNextPageToken] = useState<string | null>(null);
    const requestRef = useRef<AbortController | null>(null);
    const scrollRef = useRef<HTMLDivElement>(null);
    const sentinelRef = useRef<HTMLDivElement>(null);
    useLockBodyScroll(isOpen);

    const loadPage = useCallback(async (pageToken: string | null) => {
        if (requestRef.current) return;
        const controller = new AbortController();
        requestRef.current = controller;
        setLoading(true);
        setError(null);

        try {
            const query = pageToken ? `?${new URLSearchParams({ pageToken })}` : "";
            const response = await fetch(`/api/menu${query}`, {
                signal: controller.signal,
                cache: "no-store",
            });
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            const data = await response.json();
            if (!Array.isArray(data.images) || !data.images.every((url: unknown) => typeof url === "string") ||
                (data.nextPageToken !== null && typeof data.nextPageToken !== "string")) {
                throw new Error("Invalid menu response");
            }
            if (controller.signal.aborted) return;
            setImageUrls(previous => [...new Set<string>([...(pageToken ? previous : []), ...data.images])]);
            setNextPageToken(data.nextPageToken);
        } catch {
            if (controller.signal.aborted) return;
            setError(pageToken ? "Не удалось загрузить следующие фото. Попробуйте ещё раз." : "Не удалось загрузить меню. Попробуйте ещё раз.");
        } finally {
            if (requestRef.current === controller) {
                requestRef.current = null;
                setLoading(false);
            }
        }
    }, []);

    useEffect(() => {
        if (!isOpen) return;
        setImageUrls([]);
        setNextPageToken(null);
        void loadPage(null);
        return () => {
            requestRef.current?.abort();
            requestRef.current = null;
        };
    }, [isOpen, loadPage]);

    useEffect(() => {
        if (!isOpen || loading || error || !nextPageToken || !scrollRef.current || !sentinelRef.current) return;
        const observer = new IntersectionObserver(([entry]) => {
            if (entry.isIntersecting) void loadPage(nextPageToken);
        }, { root: scrollRef.current, rootMargin: "0px 0px 200px 0px" });
        observer.observe(sentinelRef.current);
        return () => observer.disconnect();
    }, [isOpen, loading, error, nextPageToken, loadPage]);

    return (
        <section id="menu" aria-labelledby="menu-title" className="section-space bg-gradient-to-t from-card/90 to-card/10">
            <div className="section-shell text-center">
                <h2 id="menu-title" className="reveal-on-scroll mb-5 font-serif text-4xl font-light text-balance md:text-6xl">
                    Изысканное меню
                </h2>
                <p className="mx-auto mb-8 max-w-2xl text-lg leading-relaxed text-pretty text-muted-foreground md:mb-10 md:text-xl">
                    Наши повара создают кулинарные шедевры, сочетая традиционные рецепты с современными техниками
                </p>

                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                    <Button
                        type="button"
                        aria-haspopup="dialog"
                        aria-expanded={isOpen}
                        onClick={event => openMenu(event.currentTarget)}
                        size="lg"
                        variant="outline"
                        className="ambient-card border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300"
                    >
                        Посмотреть меню
                    </Button>

                    <DrawerContent
                        onCloseAutoFocus={event => {
                            event.preventDefault();
                            restoreFocus();
                        }}
                        className="h-[94dvh] overflow-hidden data-[vaul-drawer-direction=bottom]:mt-0 data-[vaul-drawer-direction=bottom]:max-h-[94dvh] data-[vaul-drawer-direction=bottom]:rounded-t-3xl [&>div:first-child]:mt-3 [&>div:first-child]:h-1 [&>div:first-child]:w-10"
                    >
                        <div className="mx-auto flex w-full max-w-[1600px] shrink-0 items-center justify-between gap-4 px-4 pb-4 pt-4 md:px-6 md:pb-5 xl:px-8">
                            <div className="min-w-0 text-left">
                                <div className="mb-2 flex items-center gap-3">
                                    <span className="text-[10px] font-medium uppercase tracking-[0.24em] text-primary">Башня</span>
                                    {imageUrls.length > 0 && (
                                        <span className="text-xs text-muted-foreground">{nextPageToken ? "Загружено: " : ""}{imageUrls.length} фото</span>
                                    )}
                                </div>
                                <DrawerTitle className="font-serif text-2xl font-medium leading-tight md:text-3xl">Меню ресторана</DrawerTitle>
                                <DrawerDescription className="mt-1 text-xs md:text-sm">Блюда, которые хочется попробовать</DrawerDescription>
                            </div>
                            <DrawerClose asChild>
                                <Button type="button" size="icon" variant="outline" className="size-11 rounded-full bg-background hover:bg-secondary hover:text-foreground" aria-label="Закрыть меню">
                                    <X className="size-5" aria-hidden="true" />
                                </Button>
                            </DrawerClose>
                        </div>

                        <div
                            ref={scrollRef}
                            className="min-h-0 flex-1 overflow-y-auto overscroll-y-contain border-t border-border/60 bg-card/40"
                            data-vaul-no-drag=""
                            role="region"
                            aria-label="Галерея меню"
                            aria-busy={loading}
                            tabIndex={0}
                        >
                            <div className="mx-auto min-h-full w-full max-w-[1600px] px-3 pt-3 pb-[max(1rem,env(safe-area-inset-bottom))] md:px-6 md:pt-5 xl:px-8">
                                {imageUrls.length > 0 && <MenuGallery images={imageUrls} />}

                                {loading && imageUrls.length === 0 && <MenuLoading />}

                                {!loading && error && (
                                    <div className="flex flex-col items-center justify-center gap-4 px-4 py-10 text-center" role="alert">
                                        <UtensilsCrossed className="size-8 text-primary" aria-hidden="true" />
                                        <p className="text-sm text-muted-foreground">{error}</p>
                                        <Button type="button" variant="outline" className="h-11 rounded-full px-5" onClick={() => void loadPage(nextPageToken)}>
                                            <RefreshCw className="size-4" aria-hidden="true" />
                                            Попробовать снова
                                        </Button>
                                    </div>
                                )}

                                {!loading && !error && !nextPageToken && imageUrls.length === 0 && (
                                    <div className="flex min-h-[40dvh] flex-col items-center justify-center gap-3 px-4 text-center" role="status">
                                        <UtensilsCrossed className="size-8 text-primary" aria-hidden="true" />
                                        <p className="font-serif text-2xl">Скоро здесь будет меню</p>
                                        <p className="text-sm text-muted-foreground">Пока уточнить блюда можно у команды ресторана.</p>
                                    </div>
                                )}

                                {nextPageToken && !error && (
                                    <div ref={sentinelRef} className="flex justify-center py-6">
                                        <Button variant="outline" className="rounded-full px-5" disabled={loading} onClick={() => void loadPage(nextPageToken)}>
                                            {loading && <RefreshCw className="size-4 motion-safe:animate-spin" aria-hidden="true" />}
                                            {loading ? "Загружаем фото…" : "Загрузить ещё 10 фото"}
                                        </Button>
                                    </div>
                                )}
                                <p className="sr-only" role="status">{loading ? "Загружаем фотографии меню" : imageUrls.length > 0 ? `Загружено фотографий: ${imageUrls.length}${nextPageToken ? "" : ". Все фотографии загружены"}` : ""}</p>
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </section>
    );
}
