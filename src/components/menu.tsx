"use client"

import { type JSX, useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { ParallaxScroll } from "@/src/components/parallax-scroll"
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/src/components/ui/drawer"

const CACHE_KEY = "yandex_menu_images_v2"
const CACHE_TTL_MS = 1000 * 60 * 60 * 12 // 12 часов

function readCache(): string[] | null {
  try {
    const raw = typeof window !== "undefined" ? localStorage.getItem(CACHE_KEY) : null
    if (!raw) return null
    const parsed = JSON.parse(raw)
    if (Date.now() - parsed.t > CACHE_TTL_MS) {
      localStorage.removeItem(CACHE_KEY)
      return null
    }
    return Array.isArray(parsed.v) ? parsed.v : null
  } catch {
    return null
  }
}

function writeCache(hrefs: string[]) {
  try {
    if (typeof window !== "undefined") {
      localStorage.setItem(CACHE_KEY, JSON.stringify({ t: Date.now(), v: hrefs }))
    }
  } catch {}
}

export default function Menu(): JSX.Element {
  const [images, setImages] = useState<string[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)
  const [isOpen, setIsOpen] = useState<boolean>(false)

  useEffect(() => {
    if (!isOpen) return

    const cached = readCache()
    if (cached && cached.length > 0) {
      setImages(cached)
      return
    }

    const controller = new AbortController()
    setLoading(true)
    setError(null)

    fetch("/api/menu", { signal: controller.signal })
        .then(async (resp) => {
          if (!resp.ok) throw new Error(`API error ${resp.status}`)
          const data = await resp.json()
          if (!Array.isArray(data)) throw new Error("Invalid API response")
          setImages(data)
          writeCache(data)
        })
        .catch((err) => {
          if (err.name !== "AbortError") {
            console.error(err)
            setError("Не удалось загрузить изображения")
          }
        })
        .finally(() => {
          setLoading(false)
        })

    return () => controller.abort()
  }, [isOpen])

  const handleMouseEnter = () => {
    const cached = readCache()
    if (cached && cached.length > 0) return

    fetch("/api/menu/", { method: "HEAD" }).catch(() => {})
  }

  return (
      <section id="menu" className="py-12 md:py-24 px-4 bg-gradient-to-t from-card/90 to-card/10">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 text-balance">Изысканное меню</h2>
          <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
            Наши шеф-повара создают кулинарные шедевры, сочетая традиционные рецепты с современными техниками
          </p>
          <div className="relative inline-block">
            <Drawer open={isOpen} onOpenChange={setIsOpen}>
              <DrawerTrigger asChild>
                <Button
                    size="lg"
                    variant="outline"
                    className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300 bg-transparent"
                    onMouseEnter={handleMouseEnter}
                >
                  Посмотреть меню
                </Button>
              </DrawerTrigger>

              <DrawerContent>
                <DrawerTitle className="sr-only">Меню ресторана</DrawerTitle>
                <DrawerDescription className="sr-only">Галерея блюд нашего меню</DrawerDescription>
                <div className="w-full">
                  <div className="h-[620px]">
                    {loading && (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
                            <p className="text-muted-foreground">Загрузка меню...</p>
                          </div>
                        </div>
                    )}
                    {error && (
                        <div className="flex items-center justify-center h-full">
                          <div className="text-center text-destructive">
                            <p className="text-lg font-medium mb-2">Ошибка загрузки</p>
                            <p className="text-sm">{error}</p>
                          </div>
                        </div>
                    )}
                    {!loading && !error && images.length === 0 && (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-muted-foreground">Изображения не найдены</p>
                        </div>
                    )}
                    {!loading && !error && images.length > 0 && <ParallaxScroll images={images} />}
                  </div>
                </div>
              </DrawerContent>
            </Drawer>
          </div>
        </div>
      </section>
  )
}
