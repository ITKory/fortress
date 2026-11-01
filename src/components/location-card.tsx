"use client"

import { useState } from "react"
import Image from "next/image"
import { Clock, Phone, Utensils } from "lucide-react"
import LocationMapDialog from "@/src/components/location-map-dialog"
import type { Location } from "@/src/lib/locations"

function LocationIcon({ format }: Readonly<{ format: Location["format"] }>) {
  return (
    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      {format === "Стритфуд" ? (
        <>
          <path d="M12 2v2" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M7 7c0 3 2 5 5 5s5-2 5-5" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <rect x="3" y="11" width="18" height="9" rx="2" stroke="currentColor" strokeWidth="1.6" />
        </>
      ) : (
        <>
          <path d="M3 12h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M5 12v6a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2v-6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          <path d="M9 8h6v4H9z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
        </>
      )}
    </svg>
  )
}

export default function LocationCard({ location, compact = false }: Readonly<{ location: Location; compact?: boolean }>) {
  const [imageFailed, setImageFailed] = useState(false)
  const phoneHref = location.phone ? `tel:${location.phone.replaceAll(/[^+\d]/g, "")}` : undefined

  if (compact) {
    return (
      <article className="glass-panel h-full p-5 text-foreground sm:p-6">
        <h3 className="font-serif text-2xl font-medium leading-tight">{location.name}</h3>
        {location.franchise && <p className="mt-1 text-sm font-medium text-primary/90">Франшиза</p>}
        {location.metro && <p className="mt-2 text-sm leading-relaxed text-foreground/80">Метро: {location.metro}</p>}
        <address className="mt-1 text-sm not-italic leading-relaxed text-foreground/80">{location.address}</address>
        {location.hours && (
          <p className="mt-2 flex items-start gap-2 text-sm leading-relaxed text-foreground/80">
            <Clock className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            <span>{location.hours}</span>
          </p>
        )}
        <div className="mt-3 flex flex-wrap items-center gap-3">
          {location.phone && (
            <a href={phoneHref} className="inline-flex min-h-11 items-center text-sm font-medium text-primary underline-offset-4 hover:underline">
              {location.phone}
            </a>
          )}
          <LocationMapDialog location={location} />
        </div>
      </article>
    )
  }

  return (
    <article className="location-card relative flex w-full min-w-0 flex-col overflow-hidden rounded-3xl border border-border/50 bg-card/50 shadow-lg shadow-foreground/5 md:grid md:min-h-[76vh] md:items-end md:shadow-2xl lg:min-h-[84vh]">
      <div className="relative h-[clamp(15rem,65vw,24rem)] shrink-0 md:absolute md:inset-0 md:h-auto">
        {imageFailed ? (
          <div className="absolute inset-0 flex items-center justify-center bg-muted text-primary/60">
            <Utensils className="size-12" aria-hidden="true" />
          </div>
        ) : (
          <Image
              src={location.image}
              alt={location.name}
              fill
              sizes="(max-width: 767px) calc(100vw - 24px), 50vw"
              className="location-photo select-none object-cover"
              quality={85}
              draggable={false}
              onError={() => setImageFailed(true)}
          />
        )}
      </div>

      <div className="glass-panel relative -mt-5 flex-1 border-x-0 border-b-0 p-4 text-foreground md:m-6 md:flex-none md:border md:p-5">
        <div className="grid grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 md:gap-x-4">
          <div className="rounded-xl border border-primary/20 bg-primary/10 p-2.5 md:row-span-3 md:p-3">
            <LocationIcon format={location.format} />
          </div>
          <div className="min-w-0 self-center">
            <h3 className="font-serif text-xl font-medium leading-tight text-balance md:text-3xl">{location.name}</h3>
            {location.franchise && <p className="mt-1 text-xs font-medium text-primary">Франшиза</p>}
          </div>
          <address className="col-span-2 mt-3 text-sm not-italic leading-relaxed text-foreground/80 md:col-span-1 md:col-start-2 md:mt-2 md:text-base">
            {location.address}
            {location.metro && <span className="mt-1 block">Метро: {location.metro}</span>}
            {location.note && <span className="mt-1 block">{location.note}</span>}
          </address>

          <div className="col-span-2 mt-4 border-t border-primary/15 pt-3 md:col-span-1 md:col-start-2 md:pt-4">
            {location.hours && (
              <p className="mb-3 flex items-start gap-2 text-xs font-medium text-foreground/80 md:text-sm">
                <Clock className="mt-0.5 size-3.5 shrink-0 md:size-4" aria-hidden="true" />
                <span>{location.hours}</span>
              </p>
            )}
            <div className="flex flex-wrap items-center gap-2.5 md:gap-3">
              {location.phone && (
                <a
                    href={phoneHref}
                    className="inline-flex min-h-11 items-center gap-1.5 rounded-lg bg-primary px-3 py-2 text-sm font-medium text-primary-foreground shadow-sm transition-shadow hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary md:gap-2 md:rounded-xl md:px-4 md:py-2.5"
                >
                  <Phone className="size-3.5 shrink-0 md:size-4" aria-hidden="true" />
                  <span className="whitespace-nowrap">{location.phone}</span>
                </a>
              )}
              <LocationMapDialog location={location} />
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}
