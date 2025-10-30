"use client";

import React, { JSX, useEffect, useState, useRef } from "react";
import { Button } from "@/src/components/ui/button";
import { ParallaxScroll } from "@/src/components/parallax-scroll";
import {Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription} from "@/src/components/ui/drawer";
import { ResponsiveContainer } from "recharts";

const SHARE_LINK = process.env.NEXT_PUBLIC_MENU || "";

// --- Типы ответа Yandex.Disk (упрощённо) ---
type YandexListItem = {
  name: string;
  type: "file" | "dir";
  path?: string;
  media_type?: string;
};
type YandexListResponse = {
  _embedded?: { items?: YandexListItem[] };
};

// --- Проверка расширений изображений ---
const IMAGE_EXT_RE = /\.(jpe?g|png|webp|gif|avif|bmp|svg)$/i;

const isImageFilename = (filename?: string | null) => {
  if (!filename) return false;
  return IMAGE_EXT_RE.test(filename);
};

// --- Кеширование в sessionStorage с TTL ---
const CACHE_KEY = "yandex_public_images_cache_v1";
const CACHE_TTL_MS = 1000 * 60 * 60 * 12; // 12 часов

function readCache(): string[] | null {
  try {
    const raw = sessionStorage.getItem(CACHE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (Date.now() - parsed.t > CACHE_TTL_MS) {
      sessionStorage.removeItem(CACHE_KEY);
      return null;
    }
    return Array.isArray(parsed.v) ? parsed.v : null;
  } catch {
    return null;
  }
}
function writeCache(hrefs: string[]) {
  try {
    sessionStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: hrefs }));
  } catch {}
}

export default function Menu(): JSX.Element {
  const prefetchTimerRef = useRef<number | null>(null);

  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const abortRef = useRef<AbortController | null>(null);

  async function fetchImagesFromYandexSignal(signal?: AbortSignal) {
    setLoading(true);
    setError(null);
    try {
      const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(
          SHARE_LINK
      )}&limit=100`;

      const listResp = await fetch(listUrl, { signal });
      if (!listResp.ok) console.log(`List request failed: ${listResp.status}`);

      const listJson = (await listResp.json()) as YandexListResponse;
      const items = listJson._embedded?.items ?? [];
      const imageItems = items.filter((it) => it.type === "file" && isImageFilename(it.name ?? it.path));
      if (imageItems.length === 0) {
        setImages([]);
        setLoading(false);
        return [];
      }

      const batchSize = 6;
      const hrefs: string[] = [];
      for (let i = 0; i < imageItems.length; i += batchSize) {
        const batch = imageItems.slice(i, i + batchSize);
        const batchPromises = batch.map(async (it) => {
          const pathForApi = it.path ?? it.name;
          const downloadUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(
              SHARE_LINK
          )}&path=${encodeURIComponent(pathForApi ?? "")}`;

          try {
            const dlResp = await fetch(downloadUrl, { signal });
            if (!dlResp.ok) return null;
            const dlJson = await dlResp.json();
            return typeof dlJson.href === "string" ? dlJson.href : null;
          } catch (e) {
            if ((e as any)?.name === "AbortError") throw e;
            return null;
          }
        });

        const settled = await Promise.allSettled(batchPromises);
        settled.forEach((r) => {
          if (r.status === "fulfilled" && r.value) hrefs.push(r.value);
        });

        if (signal?.aborted) console.log("Aborted", "AbortError");
      }

      // Возвращаем hrefs, но НЕ сразу пушим в state если это префетч (нижe мы решаем)
      return hrefs;
    } catch (err: any) {
      if (err?.name === "AbortError") return null;
      console.error(err);
      setError(err?.message ?? "Unknown error");
      return null;
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    // когда Drawer открыли — загружаем (если в кеше нет)
    if (!isOpen) return;

    // если есть кеш — используем его (мгновенно)
    const cached = readCache();
    if (cached && cached.length > 0) {
      setImages(cached);
      setLoading(false);
      setError(null);
      return;
    }

    const controller = new AbortController();
    abortRef.current = controller;
    const signal = controller.signal;

    async function fetchImagesFromYandex() {
      setLoading(true);
      setError(null);

      try {
        const listUrl = `https://cloud-api.yandex.net/v1/disk/public/resources?public_key=${encodeURIComponent(
            SHARE_LINK
        )}&limit=100`;

        const listResp = await fetch(listUrl, { signal });
        const listJson = (await listResp.json()) as YandexListResponse;
        const items = listJson._embedded?.items ?? [];

        const imageItems = items.filter(
            (it) => it.type === "file" && isImageFilename(it.name ?? it.path)
        );

        if (imageItems.length === 0) {
          setImages([]);
          setLoading(false);
          return;
        }

        // Получаем download href по батчам — чтобы не открывать слишком много одновременных соединений.
        const batchSize = 6;
        const hrefs: string[] = [];

        for (let i = 0; i < imageItems.length; i += batchSize) {
          const batch = imageItems.slice(i, i + batchSize);
          const batchPromises = batch.map(async (it) => {
            const pathForApi = it.path ?? it.name;
            const downloadUrl = `https://cloud-api.yandex.net/v1/disk/public/resources/download?public_key=${encodeURIComponent(
                SHARE_LINK
            )}&path=${encodeURIComponent(pathForApi ?? "")}`;

            try {
              const dlResp = await fetch(downloadUrl, { signal });
              if (!dlResp.ok) {
                console.warn(`download request failed for ${it.name}: ${dlResp.status}`);
                return null;
              }
              const dlJson = await dlResp.json();
              return typeof dlJson.href === "string" ? dlJson.href : null;
            } catch (e) {
              if ((e as any)?.name === "AbortError") {
                // прерывание — пробросим вверх
                throw e;
              }
              console.warn("Failed to get download href for", it.name, e);
              return null;
            }
          });

          // ждём завершения батча (частичные ошибки обработаем дальше)
          const settled = await Promise.allSettled(batchPromises);
          settled.forEach((r) => {
            if (r.status === "fulfilled" && r.value) hrefs.push(r.value);
          });

          // если сигнал отменён — выйдем
          if (signal.aborted) console.log("Aborted", "AbortError");

        }

        // Сохраняем в state и кеш
        setImages(hrefs);
        writeCache(hrefs);
        setLoading(false);
      } catch (err: any) {
        if (err?.name === "AbortError") {
          // отмена — игнорируем
          return;
        }
        console.error(err);
        setError(err?.message ?? "Unknown error");
        setLoading(false);
      }
    }

    fetchImagesFromYandex();

    return () => {
      controller.abort();
      abortRef.current = null;
    };
  }, [isOpen]);

  // Отменяем активные запросы при закрытии Drawer (чтобы не гонять лишние запросы)
  useEffect(() => {
    if (!isOpen) return;
    const controller = new AbortController();
    abortRef.current = controller;

    (async () => {
      // берем из кеша если есть
      const cached = readCache();
      if (cached && cached.length > 0) {
        setImages(cached);
        setLoading(false);
        setError(null);
        return;
      }

      const hrefs = await fetchImagesFromYandexSignal(controller.signal);
      if (hrefs && Array.isArray(hrefs)) {
        setImages(hrefs);
        writeCache(hrefs);
      }
    })();

    return () => {
      controller.abort();
      abortRef.current = null;
    };
  }, [isOpen]);

  const prefetchImages = () => {
    // если в кеше есть — ничего не делаем
    const cached = readCache();
    if (cached && cached.length > 0) return;

    // если уже есть активный контроллер — не запускаем новый
    if (abortRef.current) return;

    // debounce: запуск через 200ms чтобы избежать лишних запросов при коротком наведении
    if (prefetchTimerRef.current) window.clearTimeout(prefetchTimerRef.current);
    prefetchTimerRef.current = window.setTimeout(() => {
      const controller = new AbortController();
      abortRef.current = controller;
      fetchImagesFromYandexSignal(controller.signal).then((hrefs) => {
        if (hrefs && hrefs.length > 0) {
          // сохраняем в cache, но не обязательно показываем до открытия
          writeCache(hrefs);
        }
        // не записываем в state — это префетч
        abortRef.current = null;
      });
    }, 180);
  };

  return (
      <section id="menu" className="py-12 md:py-24 px-4 bg-gradient-to-t from-card/90 to-card/10 ">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 text-balance">Изысканное меню</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
            Наши шеф-повара создают кулинарные шедевры, сочетая традиционные рецепты с современными
            техниками
          </p>
          <div className="relative inline-block">
            {/* Управляем открытием Drawer чтобы триггерить загрузку */}
            <Drawer
                open={isOpen} onOpenChange={(v: boolean) => setIsOpen(v)}>
              <DrawerTrigger asChild>
                <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 bg-transparent"
                    onMouseEnter={() => { prefetchImages(); }}
                 >
                  Посмотреть меню
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerTitle/>
                <DrawerDescription/>
                <div className="left-0 right-0 w-full ">
                  <div className=" h-[620px]">
                    <ResponsiveContainer width="100%" height="100%">
                      <div className="flex items-center justify-center ">
                        <div className="flex-1 text-center">
                          <div>
                            {loading && <div>Загрузка изображений...</div>}
                            {error && <div className="text-destructive">Ошибка: {error}.</div>}
                            {!loading && !error && images.length === 0 && (
                                <div>В папке нет изображений или они недоступны.</div>
                            )}
                            {!loading && !error && images.length > 0 && (
                                <ParallaxScroll images={images} />
                            )}
                          </div>
                        </div>
                      </div>
                    </ResponsiveContainer>
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </section>
  );
}
