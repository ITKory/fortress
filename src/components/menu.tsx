"use client"

import { type JSX, useEffect, useState } from "react"
import { Button } from "@/src/components/ui/button"
import { ParallaxScroll } from "@/src/components/parallax-scroll"
import { Drawer, DrawerTrigger, DrawerContent, DrawerTitle, DrawerDescription } from "@/src/components/ui/drawer"

// Больше не нужен SHARE_LINK на клиенте!

export default function Menu(): JSX.Element {
    const [images, setImages] = useState<string[]>([])
    const [loading, setLoading] = useState<boolean>(false)
    const [error, setError] = useState<string | null>(null)
    const [isOpen, setIsOpen] = useState<boolean>(false)

    useEffect(() => {
        if (!isOpen) return

        setLoading(true)
        setError(null)

        fetch("/api/menu")
            .then(async (resp) => {
                if (!resp.ok) throw new Error(`API error ${resp.status}`)
                const data: string[] = await resp.json()
                if (!Array.isArray(data)) throw new Error("Invalid API response")
                setImages(data)
            })
            .catch((err) => {
                console.error(err)
                setError("Не удалось загрузить меню")
            })
            .finally(() => setLoading(false))
    }, [isOpen])

    const handleMouseEnter = () => {
        fetch("/api/menu").catch(() => {})
    }

    return (
        <section id="menu" className="py-12 md:py-24 px-4 bg-gradient-to-t from-card/90 to-card/10">
            <div className="max-w-4xl mx-auto text-center">
                <h2 className="font-serif text-4xl md:text-6xl font-light mb-6 text-balance">Изысканное меню</h2>
                <p className="text-lg md:text-xl text-muted-foreground mb-12 text-pretty leading-relaxed max-w-2xl mx-auto">
                    Наши шеф-повара создают кулинарные шедевры, сочетая традиционные рецепты с современными техниками
                </p>

                <Drawer open={isOpen} onOpenChange={setIsOpen}>
                    <DrawerTrigger asChild>
                        <Button
                            size="lg"
                            variant="outline"
                            onMouseEnter={handleMouseEnter}
                            className="border-2 border-primary text-primary hover:bg-primary hover:text-primary-foreground px-8 py-6 text-lg rounded-full transition-all duration-300"
                        >
                            Посмотреть меню
                        </Button>
                    </DrawerTrigger>

                    <DrawerContent>
                        <DrawerTitle className="sr-only">Меню ресторана</DrawerTitle>
                        <DrawerDescription className="sr-only">Галерея блюд</DrawerDescription>
                        <div className="h-[620px] overflow-hidden">
                            {loading && (
                                <div className="flex flex-col items-center justify-center h-full">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mb-4" />
                                    <p className="text-muted-foreground">Загрузка меню...</p>
                                </div>
                            )}
                            {error && (
                                <div className="flex flex-col items-center justify-center h-full text-destructive">
                                    <p className="text-lg font-medium mb-2">Ошибка загрузки</p>
                                    <p className="text-sm">{error}</p>
                                </div>
                            )}
                            {!loading && !error && images.length === 0 && (
                                <div className="flex items-center justify-center h-full">
                                    <p className="text-muted-foreground">Изображения не найдены</p>
                                </div>
                            )}
                            {!loading && !error && images.length > 0 && <ParallaxScroll images={images} />}
                        </div>
                    </DrawerContent>
                </Drawer>
            </div>
        </section>
    )
}
