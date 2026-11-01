"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Tooltip } from 'react-tooltip'

import LocationCard from "@/src/components/location-card"
import { Button } from "@/src/components/ui/button"
import { locations } from "@/src/lib/locations"
import { cn } from "@/src/lib/utils"

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false)

  return (
      <footer className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
              src="/footer.jpeg"
              alt=""
              fill
              sizes="100vw"
              quality={60}
              className="object-cover"
              priority={false}
          />
          <div className="absolute inset-0 bg-black/20"/>
        </div>

        <div className="section-shell section-space relative">
          <div className="grid grid-cols-1 items-start gap-8 lg:grid-cols-3">
            <div className="glass-panel p-5 sm:p-6">
              <div className="flex items-center gap-4">
                <div className="flex size-16 shrink-0 items-center justify-center sm:size-20">
                  <Image
                      src="/logo-black-fortress.svg"
                      alt="Башня"
                      width={96}
                      height={96}
                      sizes="(max-width: 640px) 64px, 80px"
                      className="size-full object-contain"
                      priority={false}
                  />
                </div>

                <div className="min-w-0 flex-1">
                  <div className="font-serif text-3xl font-bold leading-tight text-foreground md:text-4xl">
                    Башня
                  </div>
                  <div className="mt-1 text-base font-medium text-foreground/90">
                    Вайнахская кухня · Халяль
                  </div>
                </div>
              </div>

              <p className="mt-6 max-w-prose text-sm leading-relaxed text-foreground/90">
                Вкусные авторские блюда вайнахской кухни — быстро, с любовью и по халяль-стандартам.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-7">
                <Button asChild className="text-base"><Link href="#menu">Меню</Link></Button>
                <Button asChild variant="ghost" className="text-base text-foreground/90 hover:text-foreground"><Link href="#about">О нас</Link></Button>
              </div>

              <div className="mt-8 border-t border-border pt-6">
                <h2 className="mb-3 font-serif text-lg font-bold text-foreground">Мы в соцсетях</h2>
                <a
                    href="https://www.instagram.com/bashnya_rest"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-11 items-center gap-3 rounded-lg text-lg font-medium text-foreground transition-colors hover:text-primary"
                >
                  <svg aria-hidden="true" className="size-6" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5"/>
                    <circle cx="12" cy="12" r="4"/>
                    <circle cx="17" cy="7" r="1.5"/>
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            <div className="space-y-5 lg:col-span-2">
              <div className="glass-panel p-5 sm:p-6">
                <h2 className="font-serif text-2xl font-bold text-foreground text-center md:text-3xl md:text-left">
                  Наши локации
                </h2>
              </div>

              <div id="footer-locations" className="grid gap-5 md:grid-cols-2">
                {locations.map((location, index) => (
                    <div key={location.id} className={cn(index > 1 && !isExpanded && "hidden md:block")}>
                      <LocationCard location={location} compact />
                    </div>
                ))}
              </div>

              <div className="md:hidden text-center mt-8">
                <button
                    type="button"
                    onClick={() => setIsExpanded(v => !v)}
                    aria-expanded={isExpanded}
                    aria-controls="footer-locations"
                    className="glass-panel min-h-12 px-6 py-3 font-medium text-primary transition-colors hover:bg-card"
                >
                  {isExpanded ? "Скрыть" : "Показать все локации"}
                </button>
              </div>
            </div>
          </div>

          <div className="mt-12 text-center">
            <div className="glass-panel inline-block px-5 py-3 sm:px-8">
              <span className="text-sm font-medium text-foreground">
                © 2025 «Башня». Все права защищены.{" "}

                <button
                    type="button"
                    data-tooltip-id="legal-tooltip"
                    className="inline-flex min-h-11 items-center rounded-md px-1 underline decoration-dashed underline-offset-2 transition-colors hover:text-primary"
                >
                  Юридическая информация
                </button>
              </span>

              <Tooltip
                  id="legal-tooltip"
                  place="top"
                  clickable={true}
                  openEvents={{ mouseenter: true, focus: true, click: true }}
                  closeEvents={{ mouseleave: true, blur: true }}
                  globalCloseEvents={{ escape: true, clickOutsideAnchor: true }}
                  className="!bg-black/90 !text-white !text-xs !rounded-xl !px-5 !py-4 !shadow-xl !backdrop-blur-sm !border !border-white/10 arrow"
                  style={{ maxWidth: "280px" }}
                  render={() => (
                      <div className="text-left leading-relaxed">
                        <p className="font-semibold">ИП Хакимов Аслан Асламбекович</p>
                        <p>ИНН 201500772387</p>
                        <p>ОГРНИП 318502900040727</p>
                        <p className="mt-3">123112, г. Москва,</p>
                        <p>Пресненская набережная, д. 10</p>
                      </div>
                  )}
              />
            </div>
          </div>
        </div>
      </footer>
  )
}
