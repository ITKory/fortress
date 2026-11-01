"use client"

import { useCallback, useEffect, useState, type KeyboardEvent } from "react"
import useEmblaCarousel from "embla-carousel-react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/src/components/ui/button"
import LocationCard from "@/src/components/location-card"
import HandDrawnArrow from "@/src/components/hand-drawn-arrow"
import { locations } from "@/src/lib/locations"
import { cn } from "@/src/lib/utils"

export default function LocationsCarousel() {
  const [viewportRef, carousel] = useEmblaCarousel({
    align: "start",
    loop: true,
    duration: 28,
    breakpoints: {
      "(prefers-reduced-motion: reduce)": { duration: 0 },
    },
  })
  const [selectedIndex, setSelectedIndex] = useState(0)
  const [hoveredButton, setHoveredButton] = useState<"prev" | "next" | null>(null)
  const [snapCount, setSnapCount] = useState(locations.length)

  const syncCarousel = useCallback(() => {
    if (!carousel) return
    setSelectedIndex(carousel.selectedScrollSnap())
    setSnapCount(carousel.scrollSnapList().length)
  }, [carousel])

  useEffect(() => {
    if (!carousel) return
    syncCarousel()
    carousel.on("select", syncCarousel).on("reInit", syncCarousel)
    return () => {
      carousel.off("select", syncCarousel).off("reInit", syncCarousel)
    }
  }, [carousel, syncCarousel])

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (!carousel || event.target !== event.currentTarget) return
    switch (event.key) {
      case "ArrowLeft":
        event.preventDefault()
        carousel.scrollPrev()
        break
      case "ArrowRight":
        event.preventDefault()
        carousel.scrollNext()
        break
      case "Home":
        event.preventDefault()
        carousel.scrollTo(0)
        break
      case "End":
        event.preventDefault()
        carousel.scrollTo(snapCount - 1)
        break
    }
  }

  return (
    <section id="locations" aria-labelledby="locations-title" className="section-space">
      <div className="section-shell mb-10 text-center md:mb-12">
        <h2 id="locations-title" className="reveal-on-scroll font-serif text-4xl font-light text-balance md:text-6xl">
          Наши локации
        </h2>
      </div>

      <p id="locations-instructions" className="sr-only">Листайте свайпом или стрелками влево и вправо. Home — первая локация, End — последняя.</p>
      <div className="px-3 sm:px-4 md:px-8 lg:px-16">
        <div
            id="locations-slides"
            ref={viewportRef}
            role="region"
            aria-roledescription="карусель"
            aria-label="Адреса ресторанов"
            aria-describedby="locations-instructions"
            tabIndex={0}
            onKeyDown={handleKeyDown}
            className="overflow-hidden outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-4"
        >
          <div className="-ml-8 flex touch-pan-y touch-pinch-zoom">
            {locations.map((location, index) => (
              <div
                  key={location.id}
                  className="flex min-w-0 flex-[0_0_100%] pl-8 md:basis-1/2"
                  role="group"
                  aria-roledescription="слайд"
                  aria-label={`${index + 1} из ${locations.length}: ${location.name}`}
              >
                <LocationCard location={location} />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-center gap-2 px-4 md:mt-12 md:gap-8">
        <div className="relative">
          <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => carousel?.scrollPrev()}
              onMouseEnter={() => setHoveredButton("prev")}
              onMouseLeave={() => setHoveredButton(null)}
              onFocus={() => setHoveredButton("prev")}
              onBlur={() => setHoveredButton(null)}
              disabled={!carousel}
              className="size-11 rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground md:size-14"
              aria-label="Предыдущая локация"
              aria-controls="locations-slides"
          >
            <ChevronLeft className="size-5 md:size-7" aria-hidden="true" />
          </Button>
          {hoveredButton === "prev" && (
            <div className="pointer-events-none absolute left-1 top-16 hidden -translate-x-1/2 md:block" aria-hidden="true">
              <HandDrawnArrow rotation={-60} />
            </div>
          )}
        </div>

        <div className="flex items-center md:gap-3" role="group" aria-label="Выбор локации">
          {Array.from({ length: snapCount }, (_, index) => (
            <button
                key={locations[index].id}
                type="button"
                className="group/dot flex min-h-11 min-w-6 items-center justify-center rounded-full outline-none focus-visible:ring-2 focus-visible:ring-primary"
                onClick={() => carousel?.scrollTo(index)}
                aria-label={`Показать: ${locations[index].name}`}
                aria-current={index === selectedIndex ? "true" : undefined}
                aria-controls="locations-slides"
            >
              <span className={cn(
                "h-2 rounded-full transition-all duration-300 motion-reduce:transition-none md:h-2.5",
                index === selectedIndex ? "w-8 bg-primary md:w-12" : "w-2 bg-border/60 group-hover/dot:bg-primary/60 md:w-3",
              )} />
            </button>
          ))}
        </div>

        <div className="relative">
          <Button
              type="button"
              variant="outline"
              size="icon"
              onClick={() => carousel?.scrollNext()}
              onMouseEnter={() => setHoveredButton("next")}
              onMouseLeave={() => setHoveredButton(null)}
              onFocus={() => setHoveredButton("next")}
              onBlur={() => setHoveredButton(null)}
              disabled={!carousel}
              className="size-11 rounded-full border-2 border-primary hover:bg-primary hover:text-primary-foreground md:size-14"
              aria-label="Следующая локация"
              aria-controls="locations-slides"
          >
            <ChevronRight className="size-5 md:size-7" aria-hidden="true" />
          </Button>
          {hoveredButton === "next" && (
            <div className="pointer-events-none absolute left-16 top-16 hidden -translate-x-1/2 md:block" aria-hidden="true">
              <HandDrawnArrow rotation={-120} />
            </div>
          )}
        </div>
      </div>

    </section>
  )
}
