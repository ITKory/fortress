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
  phone?: string
  pointType: pointType
  cardPosition?: "left" | "right"
}

const locations: LocationItem[] = [
  {
    name: "Башня на Набережной",
    addressLines: ["", "Пресненская набережная, д. 10", "Метро: Деловой центр (Москва-Сити)"],
    image: "/locations/1.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Пн–Сб: 10:00–22:00 • Вс: 12:00–18:00",
    pointType: pointType.rest,
    cardPosition: "left"
  },
  {
    name: "ТЦ BOTANICA",
    addressLines: ["", "ул. Вильгельма Пика, д. 11", "Метро: Ботанический сад"],
    image: "/locations/2.jpg",
    phone: "+7 (905) 977-57-00",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
    cardPosition: "right"
  },
  {
    name: "ТЦ Аркадия",
    addressLines: ["Франшиза", "", "Б. Овчинниковский пер., д. 16", "Метро: Новокузнецкая"],
    phone: "+7 (903) 538-31-91",
    image: "/locations/12.jpeg",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
    cardPosition: "left"
  },
  {
    name: "ЮГ",
    addressLines: ["Национальный центр РОССИЯ", "", "ул. Краснопресненская набережная, д. 14", "Метро: Деловой центр"],
    image: "/locations/11.jpeg",
    hours: "вт-вс: 10:00–22:00, пн: выходной",
    pointType: pointType.rest,
    cardPosition: "left"
  },
  {
    name: "Фудмолл BAZAAR",
    addressLines: ["", "м-9 Балтия, 26-й км., д. 7А", "МО, г. Красногорск"],
    phone: "+7 (936) 277-57-00",
    image: "/locations/3.png",
    hours: "Ежедневно: 10:00–22:00",
    pointType: pointType.rest,
    cardPosition: "right"
  },
  {
    name: "ШАУРМА",
    phone: "+7 (905) 977-57-00",
    addressLines: ["", "ул. Никольская, д. 25", "Метро: Лубянка", "ТЦ НАУТИЛУС"],
    image: "/locations/6.jpg",
    hours: "Круглосуточно",
    pointType: pointType.shava,
    cardPosition: "left"
  },
  {
    name: "ШАУРМА И ЧУРРОС",
    phone: "+7 (905) 977-57-00",
    addressLines: ["", "ул. Большая Дмитровка, д. 7/5, стр. 1", "Центр — рядом с театральным кварталом"],
    image: "/locations/10.png",
    hours: "Круглосуточно",
    pointType: pointType.shava,
    cardPosition: "right"
  },
]

function sanitizePhoneForTel(phone?: string) {
  if (!phone) return ""
  return phone.replaceAll(/[^+\d]/g, "")
}

function LocationIcon({ type }: Readonly<{ type: pointType }>) {
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

function ImageWithFallback({ src, alt, width, height, className, fill = false, sizes }: Readonly<{
  src: string;
  alt: string;
  width?: number;
  height?: number;
  className?: string;
  fill?: boolean;
  sizes?: string
}>) {
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
          quality={85}
          priority={false}
      />
  )
}

function MobileLocationsList({ items }: Readonly<{ items: LocationItem[] }>) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const carouselRef = useRef<HTMLDivElement | null>(null)
  const touchStart = useRef<{ x: number; y: number } | null>(null)

  const nextSlide = useCallback(() => setCurrentIndex((prev) => (prev + 1) % items.length), [items.length])
  const prevSlide = useCallback(() => setCurrentIndex((prev) => (prev - 1 + items.length) % items.length), [items.length])

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    touchStart.current = { x: e.touches[0].clientX, y: e.touches[0].clientY }
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const deltaX = touchStart.current.x - e.touches[0].clientX
    const deltaY = touchStart.current.y - e.touches[0].clientY
    if (Math.abs(deltaX) > Math.abs(deltaY)) e.preventDefault()
  }, [])

  const handleTouchEnd = useCallback((e: React.TouchEvent) => {
    if (!touchStart.current) return
    const deltaX = touchStart.current.x - e.changedTouches[0].clientX
    if (Math.abs(deltaX) > 50) {
      deltaX > 0 ? nextSlide() : prevSlide()
    }
    touchStart.current = null
  }, [nextSlide, prevSlide])

  useEffect(() => {
    const el = carouselRef.current
    if (!el) return
    el.addEventListener("touchstart", handleTouchStart as any, { passive: true })
    el.addEventListener("touchmove", handleTouchMove as any, { passive: false })
    el.addEventListener("touchend", handleTouchEnd as any, { passive: true })
    return () => {
      el?.removeEventListener("touchstart", handleTouchStart as any)
      el?.removeEventListener("touchmove", handleTouchMove as any)
      el?.removeEventListener("touchend", handleTouchEnd as any)
    }
  }, [handleTouchStart, handleTouchMove, handleTouchEnd])

  return (
      <div className="relative w-screen overflow-hidden md:hidden">
        <div ref={carouselRef} className="flex transition-transform duration-500 ease-out" style={{ transform: `translateX(-${currentIndex * 100}vw)` }}>
          {items.map((location, index) => (
              <div key={index} className="min-w-[100vw] flex-shrink-0">
                <div className="relative w-screen h-[52vh] bg-muted/5 overflow-hidden">
                  <ImageWithFallback src={location.image || "/placeholder.svg"} alt={location.name} fill className="object-cover select-none" sizes="100vw" />

                  <div className="absolute bottom-4 left-4 right-4">
                    <div className="max-w-3xl bg-card/60 border border-border rounded-3xl p-4 backdrop-blur-lg shadow-xl">
                      <div className="flex items-start gap-3">
                        <div className="flex-shrink-0 p-2.5 rounded-xl bg-primary/10 border border-primary/20">
                          <LocationIcon type={location.pointType} />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-serif text-xl text-foreground">{location.name}</h3>
                          <address className="not-italic text-xs text-foreground/80 whitespace-pre-line mt-0.5 leading-tight">
                            {location.addressLines.join("\n")}
                          </address>
                          <div className="mt-3 flex flex-wrap items-center gap-2.5">
                            {location.phone && (
                                <a href={`tel:${sanitizePhoneForTel(location.phone)}`} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary text-primary-foreground text-sm font-medium shadow-sm hover:shadow-md transition-shadow">
                                  <Phone className="h-3.5 w-3.5" />
                                  <span>{location.phone}</span>
                                </a>
                            )}
                            <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-muted/60 border border-muted-foreground/20 text-foreground text-xs font-medium">
                          <Clock className="h-3.5 w-3.5" />
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

        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-2 z-10">
          {items.map((_, i) => (
              <button key={i} onClick={() => setCurrentIndex(i)} className={`h-2 rounded-full transition-all duration-300 ${i === currentIndex ? "w-8 bg-primary" : "w-2 bg-border/60"}`} aria-label={`Слайд ${i + 1}`} />
          ))}
        </div>
      </div>
  )
}

function DesktopCarousel({ items }: Readonly<{ items: LocationItem[] }>) {
  const slidesToShow = 2
  const maxIndex = Math.max(0, items.length - slidesToShow)
  const [currentIndex, setCurrentIndex] = useState(0)
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null)

  const nextSlide = useCallback(() => setCurrentIndex(prev => prev >= maxIndex ? 0 : prev + 1), [maxIndex])
  const prevSlide = useCallback(() => setCurrentIndex(prev => prev <= 0 ? maxIndex : prev - 1), [maxIndex])

  return (
      <div className="relative">
        <div className="overflow-hidden">
          <div
              className="flex transition-transform duration-700 ease-out gap-8 px-8 lg:px-16"
              style={{ transform: `translateX(-${currentIndex * (100 / slidesToShow)}%)` }}
          >
            {items.map((location, index) => {
              const isVisible = index >= currentIndex && index < currentIndex + slidesToShow

              return (
                  <div
                      key={index}
                      className="w-full md:w-1/2 flex-shrink-0"
                      style={{ opacity: isVisible ? 1 : 0.3, transition: "opacity 0.5s" }}
                  >
                    <div className="relative h-[76vh] lg:h-[84vh] rounded-3xl overflow-hidden shadow-2xl border border-border/50">
                      <ImageWithFallback
                          src={location.image}
                          alt={location.name}
                          fill
                          className="object-cover"
                          sizes="(max-width: 768px) 100vw, 50vw"
                      />

                      <div className="absolute bottom-6 left-6 right-6">
                        <div className="bg-card/70 backdrop-blur-lg border border-border rounded-3xl p-5 shadow-xl">
                          <div className="flex items-start gap-4">
                            <div className="flex-shrink-0 p-3 rounded-xl bg-primary/10 border border-primary/20">
                              <LocationIcon type={location.pointType} />
                            </div>
                            <div className="flex-1">
                              <h3 className="font-serif text-2xl md:text-3xl text-foreground font-medium">
                                {location.name}
                              </h3>
                              <address className="not-italic text-sm md:text-base text-foreground/80 whitespace-pre-line mt-1 leading-tight">
                                {location.addressLines.join("\n")}
                              </address>
                              <div className="mt-4 flex flex-wrap items-center gap-3">
                                {location.phone && (
                                    <a
                                        href={`tel:${sanitizePhoneForTel(location.phone)}`}
                                        className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-primary text-primary-foreground font-medium shadow-md hover:shadow-lg transition-shadow"
                                    >
                                      <Phone className="h-4 w-4" />
                                      <span className="text-sm">{location.phone}</span>
                                    </a>
                                )}
                                <span className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-muted/70 border border-muted-foreground/20 text-foreground text-sm font-medium">
                              <Clock className="h-4 w-4" />
                              <span>{location.hours}</span>
                            </span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
              )
            })}
          </div>
        </div>

        <div className="mt-12 flex justify-center items-center gap-8">
          <div className="relative">
            <Button
                variant="outline"
                size="icon"
                onClick={prevSlide}
                onMouseEnter={() => setHoveredButton("prev")}
                onMouseLeave={() => setHoveredButton(null)}
                className="rounded-full w-14 h-14 border-2 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronLeft className="h-7 w-7" />
            </Button>
            {hoveredButton === "prev" && (
                <div className="absolute top-16 left-1 -translate-x-1/2">
                  <HandDrawnArrow rotation={-60} />
                </div>
            )}
          </div>

          <div className="flex gap-3">
            {Array.from({ length: maxIndex + 1 }, (_, i) => (
                <button
                    key={i}
                    onClick={() => setCurrentIndex(i)}
                    className={`h-2.5 rounded-full transition-all duration-300 ${i === currentIndex ? "w-12 bg-primary" : "w-3 bg-border/60 hover:bg-primary/60"}`}
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
                className="rounded-full w-14 h-14 border-2 border-primary hover:bg-primary hover:text-primary-foreground"
            >
              <ChevronRight className="h-7 w-7" />
            </Button>
            {hoveredButton === "next" && (
                <div className="absolute top-16 left-16 -translate-x-1/2">
                  <HandDrawnArrow rotation={-120} />
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
      <section id="locations" className="py-12 md:py-20">
        <div className="max-w-7xl mx-auto px-4 text-center mb-12">
          <h2 className="font-serif text-4xl md:text-6xl font-light text-balance">
            Наши локации
          </h2>
        </div>

        {isMobile ? <MobileLocationsList items={locations} /> : <DesktopCarousel items={locations} />}
      </section>
  )
}
