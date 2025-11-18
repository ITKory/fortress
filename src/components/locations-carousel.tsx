"use client"

import React, { useEffect, useState, useCallback, useRef } from "react"
import Image from "next/image"
import { Button } from "@/src/components/ui/button"
import { ChevronLeft, ChevronRight, Phone, Clock } from 'lucide-react'
import HandDrawnArrow from "./hand-drawn-arrow"
import { useIsMobile } from "@/src/hooks/use-mobile"

enum pointType {
  shava = 0,
  rest = 1,
}

type LocationItem = {
  name: string
  addressLines: string[]
  image: string
  hours: string
  phone: string
  pointType: pointType
}

const locations: LocationItem[] = [
  {
    name: "Москва-Сити",
    addressLines: [
      "Пресненская набережная, д. 10",
      "Метро: Деловой центр (Москва-Сити)",
    ],
    image: "/locations/1.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Пн–Сб: 10:00–22:00 • Вс: 12:00–18:00",
    pointType: pointType.rest,
  },
  {
    name: "Ботанический сад",
    addressLines: [
      "ул. Вильгельма Пика, д. 11",
      "Метро: Ботанический сад",
    ],
    image: "/locations/2.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
  },
  {
    name: "Овчинниковский переулок",
    addressLines: [
      "Б. Овчинниковский пер., д. 16",
      "Метро: Новокузнецкая",
    ],
    phone: "+7 (903) 538-31-91",
    image: "/locations/8.jpg",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
  },
  {
    name: "Фудмолл BAZAAR",
    addressLines: [
      "м-9 Балтия, 26-й км., д. 7А, ФУДМОЛЛ BAZAAR",
      "МО, г.о. Красногорск",
    ],
    phone: "+7 (936) 277-57-00",
    image: "/locations/3.png",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
  },
  {
    name: "Никольская",
    phone: "+7 (905) 977-57-00",
    addressLines: [
      "ул. Никольская, д. 25",
      "Центр города",
    ],
    image: "/locations/6.jpg",
    hours: "Круглосуточно",
    pointType: pointType.shava,
  },
  {
    name: "Дмитровка",
    phone: "+7 (905) 977-57-00",
    addressLines: [
      "ул. Большая Дмитровка, д. 7/5, стр. 1",
      "Центр — рядом с театральным кварталом",
    ],
    image: "/locations/7.jpg",
    hours: "Круглосуточно",
    pointType: pointType.shava,
  },
]

function sanitizePhoneForTel(phone?: string) {
  if (!phone) return ""
  // keep + and digits
  return phone.replace(/[^+\d]/g, "")
}

function LocationIcon({ type }: { type: pointType }) {
  // simple inline SVGs — lightweight and customizable
  if (type === pointType.shava) {
    return (
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
          <path d="M12 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7c0 3 2 5 5 5s5-2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="11" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </svg>
    )
  }

  return (
      <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden>
        <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M9 8h6v4H9z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      </svg>
  )
}

/* ImageWithFallback как в исходнике */
function ImageWithFallback({ src, alt, width, height, className, fill = false, sizes }: { src: string; alt: string; width?: number; height?: number; className?: string; fill?: boolean; sizes?: string }) {
  const [imgSrc, setImgSrc] = useState(src)

  useEffect(() => setImgSrc(src), [src])

  return (
      <Image
          src={imgSrc || "/placeholder.svg"}
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

/* --- мобильная версия с full-viewport слайдами --- */
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
      <div className="relative w-screen overflow-hidden md:hidden">
        <div ref={carouselRef} className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
          {items.map((location, index) => (
              <div key={index} className="min-w-[100vw] flex-shrink-0">
                <div className="relative w-screen h-[60vh] sm:h-[64vh] bg-muted/5 overflow-hidden">
                  <ImageWithFallback
                      src={location.image || "/placeholder.svg"}
                      alt={location.name}
                      fill
                      className="object-cover select-none"
                      sizes="100vw"
                  />

                  <div className="absolute bottom-6 left-4 right-4">
                    <div className="max-w-3xl bg-gradient-to-br from-black/40 to-black/20 border border-border rounded-2xl p-4 backdrop-blur-md text-white">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2 rounded-lg bg-white/10">
                          <LocationIcon type={location.pointType} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl text-white">{location.name}</h3>
                          <address className="not-italic text-sm text-white/90 whitespace-pre-line">{location.addressLines.join("\n")}</address>
                          <div className="mt-2 flex flex-wrap items-center gap-2">
                            <a href={`tel:${sanitizePhoneForTel(location.phone)}`} className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 border border-white/20 text-white text-sm">
                              <Phone className="h-4 w-4" />
                              <span>{location.phone}</span>
                            </a>
                            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-white/20 border border-white/30 text-white text-sm font-medium">
                          <Clock className="h-4 w-4 flex-shrink-0" />
                          <span>{location.hours}</span>
                        </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
          ))}
        </div>

        <div className="absolute left-4 top-1/2 -translate-y-1/2">
          <button onClick={() => setCurrentIndex((i) => (i - 1 + items.length) % items.length)} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <ChevronLeft className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="absolute right-4 top-1/2 -translate-y-1/2">
          <button onClick={() => setCurrentIndex((i) => (i + 1) % items.length)} className="w-12 h-12 rounded-full bg-white/10 border border-white/20 flex items-center justify-center">
            <ChevronRight className="h-5 w-5 text-white" />
          </button>
        </div>

        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
          {items.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} aria-label={`Перейти к слайду ${i + 1}`} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-primary" : "w-2 bg-white/40"}`} />
          ))}
        </div>
      </div>
  )
}

/* --- десктопная версия: full-viewport slides, более выразительный overlay --- */
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
      <div className="relative w-screen -mx-4 md:mx-0">
        <div className="overflow-hidden focus:outline-none" tabIndex={0} onKeyDown={onKeyDown} aria-roledescription="carousel" aria-label="Наши локации">
          <div className="flex transition-transform duration-600 ease-out" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
            {items.map((location, index) => (
                <div key={index} className="min-w-[100vw]">
                  <div className="relative w-screen h-[80vh] md:h-[90vh] bg-muted/5 overflow-hidden">
                    <ImageWithFallback src={location.image || "/placeholder.svg"} alt={location.name} fill className="object-cover select-none" sizes="(max-width: 768px) 100vw, 1600px" />

                    {/* Overlay card (left) */}
                    <div className="absolute left-12 top-1/2 max-w-lg">
                      <div className="bg-card/80 border border-border rounded-3xl p-6 md:p-8 backdrop-blur-md shadow-lg text-foreground">
                        <div className="flex items-start gap-4">
                          <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
                            <LocationIcon type={location.pointType} />
                          </div>
                          <div>
                            <h3 className="font-serif text-2xl md:text-4xl mb-1">{location.name}</h3>
                            <address className="not-italic text-sm md:text-base whitespace-pre-line text-foreground/90">{location.addressLines.join("\n")}</address>

                            <div className="mt-4 flex flex-wrap items-center gap-3">
                              <a href={`tel:${sanitizePhoneForTel(location.phone)}`} className="inline-flex items-center gap-2 px-3 py-2 rounded-lg bg-primary text-primary-foreground font-medium shadow-sm">
                                <Phone className="h-4 w-4" />
                                <span>{location.phone}</span>
                              </a>

                              <span className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-muted/60 border border-muted-foreground/20 text-foreground font-medium hover:bg-muted/80 transition-colors">
                            <Clock className="h-4 w-4 flex-shrink-0" />
                            <span className="text-sm md:text-base">{location.hours}</span>
                          </span>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* subtle gradient on right for depth */}
                    <div className="absolute inset-y-0 right-0 w-1/4 pointer-events-none bg-gradient-to-l from-black/40 to-transparent" />
                  </div>
                </div>
            ))}
          </div>
        </div>

        {/* Controls centered below the carousel */}
        <div className="absolute left-1/2 -translate-x-1/2 bottom-8 flex items-center gap-4">
          <div className="relative">
            <Button variant="outline" size="icon" onClick={prevSlide} onMouseEnter={() => setHoveredButton("prev")} onMouseLeave={() => setHoveredButton(null)} aria-label="Previous location" className="rounded-full w-12 h-12 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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
                <button key={index} onClick={() => setCurrentIndex(index)} aria-label={`Перейти к слайду ${index + 1}`} className={`h-2 rounded-full transition-all duration-300 ${index === currentIndex ? "w-8 bg-primary" : "w-2 bg-border hover:bg-primary/50"}`} />
            ))}
          </div>

          <div className="relative">
            <Button variant="outline" size="icon" onClick={nextSlide} onMouseEnter={() => setHoveredButton("next")} onMouseLeave={() => setHoveredButton(null)} aria-label="Next location" className="rounded-full w-12 h-12 border-2 border-primary hover:bg-primary hover:text-primary-foreground transition-all duration-300">
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

export default function LocationsCarousel() {
  const isMobile = useIsMobile()

  return (
      <section id="locations" className="py-12 md:py-20 px-0">
        <div className="max-w-6xl mx-auto px-4">
          <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-8 md:mb-10 text-balance">Наши локации</h2>
        </div>

        {/* Carousel itself stretches full-viewport width */}
        {isMobile ? <MobileLocationsList items={locations} /> : <DesktopCarousel items={locations} />}
      </section>
  )
}
