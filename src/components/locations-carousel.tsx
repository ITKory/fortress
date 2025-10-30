"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import HandDrawnArrow from "./hand-drawn-arrow"
import {useIsMobile} from "@/src/hooks/use-mobile";

/**
 * Обновлённая структура данных: addressLines — массив строк,
 * hours — строка/метка для приятного отображения.
 */
type LocationItem = {
  name: string
  addressLines: string[]
  image: string
  hours: string
}

const locations: LocationItem[] = [
  {
    name: "Москва-Сити",
    addressLines: [
      "Пресненская набережная, д. 10",
      "Метро: Деловой центр (Москва-Сити)",
    ],
    image: "/locations/1.png",
    hours: "Пн–Сб: 10:00–22:00 • Вс: 12:00–18:00",
  },
  {
    name: "Набережная",
    addressLines: [
      "ул. Вильгельма Пика, д. 11",
      "Метро: Ботанический сад",
    ],
    image: "/locations/2.png",
    hours: "Ежедневно: 10:00–22:00",
  },
  {
    name: "Парковый (Центр)",
    addressLines: [
      "Б. Овчинниковский пер., д. 16",
      "Метро: Новокузнецкая",
    ],
    image: "/locations/3.png",
    hours: "Ежедневно: 10:00–22:00",
  },
  {
    name: "Парковый (Красногорск)",
    addressLines: [
      "м-9 Балтия, 26-й км., д. 7А, ФУДМОЛЛ BAZAAR",
      "МО, г.о. Красногорск",
    ],
    image: "/locations/4.jpg",
    hours: "Ежедневно: 10:00–22:00",
  },
  {
    name: "Никольская",
    addressLines: [
      "ул. Никольская, д. 25",
      "Центр города",
    ],
    image: "/locations/5.jpg",
    hours: "Круглосуточно",
  },
  {
    name: "Б. Дмитровка",
    addressLines: [
      "ул. Большая Дмитровка, д. 7/5, стр. 1",
      "Центр — рядом с театральным кварталом",
    ],
    image: "/locations/6.jpg",
    hours: "Круглосуточно",
  },
]
/* --- компонент Image с fallback для next/image --- */
function ImageWithFallback({
                             src,
                             alt,
                             width,
                             height,
                             className,
                             fill = false,
                             sizes,
                           }: {
  src: string
  alt: string
  width?: number
  height?: number
  className?: string
  fill?: boolean
  sizes?: string
}) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => setImgSrc(src), [src])

  return (
      // Для cover/contain используем fill + object-cover, для миниатюр — width/height
      <Image
          src={imgSrc}
          alt={alt}
          {...(fill ? { fill: true } : { width: width ?? 96, height: height ?? 96 })}
          sizes={sizes}
          className={className}
          onError={() => setImgSrc("/placeholder.svg")}
          loading="lazy"
          quality={80}
          priority={false}
      />
  )
}

/* --- мобильная карусель (переписанная как дискретная карусель с свайпами) --- */
function MobileLocationsList({ items }: { items: LocationItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const handleTouchStart = useCallback((e: TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchMove = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return
    const currentX = e.touches[0].clientX
    const currentY = e.touches[0].clientY
    const deltaX = touchStart.current.x - currentX
    const deltaY = touchStart.current.y - currentY
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
      e.preventDefault()
    }
  }, [])

  const handleTouchEnd = useCallback((e: TouchEvent) => {
    if (!touchStart.current) return
    const endX = e.changedTouches[0].clientX
    const endY = e.changedTouches[0].clientY
    const deltaX = touchStart.current.x - endX
    const deltaY = touchStart.current.y - endY
    if (Math.abs(deltaX) > Math.abs(deltaY) && Math.abs(deltaX) > 50) {
      if (deltaX > 0) {
        nextSlide()
      } else {
        prevSlide()
      }
    }
    touchStart.current = null
  }, [nextSlide, prevSlide])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return

    el.addEventListener("touchstart", handleTouchStart, { passive: true })
    el.addEventListener("touchmove", handleTouchMove, { passive: false })
    el.addEventListener("touchend", handleTouchEnd, { passive: true })

    return () => {
      el.removeEventListener("touchstart", handleTouchStart)
      el.removeEventListener("touchmove", handleTouchMove)
      el.removeEventListener("touchend", handleTouchEnd)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
      <div className="relative px-4 mt-4 md:hidden pb-8">
        <div
            ref={carouselRef}
            className="overflow-hidden rounded-3xl touch-pan-y" // touch-pan-y позволяет вертикальный скролл
        >
          <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((location, index) => (
                <div key={index} className="min-w-full flex-shrink-0">
                  <div className="relative w-full h-[540px] bg-muted/5 overflow-hidden rounded-3xl">
                    <ImageWithFallback
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover select-none"
                        sizes="100vw"
                    />

                    <div className="absolute bottom-6 left-6 right-6">
                      <div className="max-w-3xl bg-card/75 border border-border rounded-2xl p-6 backdrop-blur-sm">
                        <h3 className="font-serif text-3xl mb-2 text-foreground">{location.name}</h3>
                        <address className="not-italic text-lg mb-1 text-foreground/95 whitespace-pre-line">
                          {location.addressLines.join("\n")}
                        </address>
                        <div className="mt-2">
                      <span className="inline-block text-base px-3 py-1 rounded-full bg-background/5 border border-border">
                        {location.hours}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Pagination dots */}
        <div className="flex justify-center gap-2 mt-4">
          {items.map((_, i) => (
              <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  aria-label={`Перейти к слайду ${i + 1}`}
                  className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`}
                  type="button"
              />
          ))}
        </div>
      </div>
  )
}

/* --- десктопная карусель --- */
function DesktopCarousel({ items }: { items: LocationItem[] }) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null)

  const nextSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % items.length)
  }, [items.length])

  const prevSlide = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + items.length) % items.length)
  }, [items.length])

  const onKeyDown = (e: React.KeyboardEvent<HTMLDivElement>) => {
    if (e.key === "ArrowLeft") prevSlide()
    if (e.key === "ArrowRight") nextSlide()
  }

  return (
      <div className="relative">
        <div
            className="overflow-hidden rounded-3xl focus:outline-none"
            tabIndex={0}
            onKeyDown={onKeyDown}
            aria-roledescription="carousel"
            aria-label="Наши локации"
        >
          <div
              className="flex transition-transform duration-500 ease-out"
              style={{ transform: `translateX(-${currentIndex * 100}%)` }}
          >
            {items.map((location, index) => (
                <div key={index} className="min-w-full">
                  {/** фиксированный контейнер — все слайды одного размера */}
                  <div className="relative w-full h-[540px] md:h-[600px] bg-muted/5 flex items-center justify-center overflow-hidden rounded-3xl">
                    {/* Image: используем fill + object-cover чтобы все картинки были одинакового размера и аккуратно кадрировались */}
                    <ImageWithFallback
                        src={location.image}
                        alt={location.name}
                        fill
                        className="object-cover select-none"
                        sizes="(max-width: 768px) 100vw, 1200px"
                    />

                    {/* Текстовая подложка */}
                    <div className="absolute bottom-6 left-6 right-6 md:bottom-10 md:left-12 md:right-12">
                      <div className="max-w-3xl bg-card/75 border border-border rounded-2xl p-6 md:p-8 backdrop-blur-sm">
                        <h3 className="font-serif text-3xl md:text-5xl mb-2 text-foreground">{location.name}</h3>

                        <address className="not-italic text-lg md:text-xl mb-1 text-foreground/95 whitespace-pre-line">
                          {location.addressLines.join("\n")}
                        </address>

                        <div className="mt-2">
                      <span className="inline-block text-base md:text-lg px-3 py-1 rounded-full bg-background/5 border border-border">
                        {location.hours}
                      </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Controls */}
        <div className="flex justify-center gap-4 mt-6 items-center">
          <div className="relative">
            <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                onMouseEnter={() => setHoveredButton("prev")}
                onMouseLeave={() => setHoveredButton(null)}
                aria-label="Previous location"
                className="rounded-full w-12 h-12 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                disabled={items.length <= 1}
            >
              <ChevronLeft className="h-6 w-6" />
            </Button>
            {hoveredButton === "prev" && (
                <div className="absolute top-10 -translate-x-1/2 pointer-events-none">
                  <HandDrawnArrow rotation={-60} />
                </div>
            )}
          </div>

          <div className="flex items-center gap-2">
            {items.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentIndex(index)}
                    aria-label={`Перейти к слайду ${index + 1}`}
                    className={`h-2 rounded-full transition-all duration-300 ${
                        index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"
                    }`}
                />
            ))}
          </div>

          <div className="relative">
            <Button
                variant="outline"
                size="icon"
                onClick={nextSlide}
                onMouseEnter={() => setHoveredButton("next")}
                onMouseLeave={() => setHoveredButton(null)}
                aria-label="Next location"
                className="rounded-full w-12 h-12 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300"
                disabled={items.length <= 1}
            >
              <ChevronRight className="h-6 w-6" />
            </Button>
            {hoveredButton === "next" && (
                <div className="absolute -top-8 translate-x-1/8 pointer-events-none">
                  <HandDrawnArrow rotation={120} />
                </div>
            )}
          </div>
        </div>
      </div>
  )
}

/* --- экспортируем основной компонент --- */
export default function LocationsCarousel() {
  const isMobile = useIsMobile();

  return (
      <section id="locations" className="py-12 md:py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-8 md:mb-16 text-balance">
            Наши локации
          </h2>

          {isMobile ? <MobileLocationsList items={locations} /> : <DesktopCarousel items={locations} />}
        </div>
      </section>
  )
}
