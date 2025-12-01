"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"

type FooterLocation = {
  name: string
  address: string
  phone?: string
  placeholder?: string
}

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false)

  const locations: FooterLocation[] = [
    { name: "Башня на Набережной", address: "Пресненская набережная, д. 10", phone: "+7 (905) 977‑57‑00" },
    { name: "ТЦ BOTANICA", address: "ул. Вильгельма Пика, д. 11", phone: "+7 (905) 977‑57‑00" },
    { name: "ТЦ Аркадия", address: "Б. Овчинниковский пер., д. 16", phone: "+7 (903) 538‑31‑91", placeholder: "Франшиза" },
    { name: "Фудмолл BAZAAR", address: "м-9 Балтия, 26‑й км., д. 7А, МО, г. Красногорск", phone: "+7 (936) 277-57‑00" },
    { name: "ШАУРМА", address: "ул. Никольская, д. 25", phone: "+7 (905) 977‑57‑00" },
    { name: "ШАУРМА И ЧУРРОС", address: "ул. Большая Дмитровка, д. 7/5, стр. 1", phone: "+7 (905) 977‑57‑00" },
    { name: "ЮГ", address: "ул. Краснопресненская набережная, д. 14", placeholder: "Национальный центр РОССИЯ" },
  ]

  const renderLocation = (loc: FooterLocation, index: number) => (
      <div key={index} className="bg-card/55 backdrop-blur-xs border border-border/60 rounded-3xl p-6 shadow-2xl">
        <div className="font-serif text-xl font-medium text-foreground">
          {loc.name}
        </div>

        {loc.placeholder && (
            <div className="text-sm font-medium text-primary/90 mt-1">
              {loc.placeholder}
            </div>
        )}

        <div className="text-sm text-foreground/80 mt-2 leading-relaxed">
          {loc.address}
        </div>

        {loc.phone && (
            <a
                href={`tel:${loc.phone.replaceAll(/[^+\d]/g, "")}`}
                className="text-primary hover:underline font-medium text-sm mt-3 inline-block"
            >
              {loc.phone}
            </a>
        )}
      </div>
  )

  return (
      <footer className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10">
          <Image
              src="/footer.jpeg"
              alt=""
              fill
              quality={100}
              className="object-cover"
              priority={false}
          />
          <div className="absolute inset-0 bg-black/20" />
        </div>

        <div className="relative py-16 px-4 text-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="bg-card/55 backdrop-blur-xs border border-border/60 rounded-3xl p-7 shadow-2xl">
              <div className="flex items-start gap-5">
                <div className="flex-shrink-0 w-20 h-20 md:w-24 md:h-24 flex items-center justify-center">
                  <Image
                      src="/logo-black-fortress.svg"
                      alt="Башня"
                      width={96}
                      height={96}
                      className="w-64 h-64 md:w-80 md:h-80 object-contain mt-12"
                      priority
                  />
                </div>

                <div className="flex-1">
                  <div className="font-serif text-3xl md:text-4xl font-bold text-foreground leading-tight">
                    Башня
                  </div>
                  <div className="text-base font-medium text-foreground/90 mt-1">
                    Вайнахская кухня · Халяль
                  </div>
                </div>
              </div>

              <p className="text-sm leading-relaxed text-foreground/90 max-w-xs mt-6">
                Вкусные авторские блюда вайнахской кухни — быстро, с любовью и по халяль-стандартам.
              </p>

              <div className="flex flex-wrap items-center gap-4 mt-7">
                <Link
                    href="#menu"
                    className="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground rounded-xl font-medium shadow-lg transition"
                >
                  Меню
                </Link>
                <Link href="#about" className="text-foreground/90 hover:text-foreground font-medium transition">
                  О нас
                </Link>
              </div>

              <div className="mt-9 pt-7 border-t border-border/30">
                <h4 className="font-serif text-lg font-bold text-foreground mb-4">Мы в соцсетях</h4>
                <a
                    href="https://www.instagram.com/bashnya_rest"
                    target="_blank"
                    rel="noreferrer"
                    className="inline-flex items-center gap-3 text-foreground hover:text-primary transition font-medium text-lg"
                >
                  <svg className="w-9 h-9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="5" />
                    <circle cx="12" cy="12" r="4" />
                    <circle cx="17" cy="7" r="1.5" />
                  </svg>
                  Instagram
                </a>
              </div>
            </div>

            <div className="md:col-span-2 space-y-7">
              <div className="bg-card/55 backdrop-blur-xs border border-border/60 rounded-3xl p-6 shadow-2xl">
                <h2 className="font-serif text-2xl md:text-3xl font-bold text-foreground text-center md:text-left">
                  Наши локации
                </h2>
              </div>

              <div className="grid gap-5 md:grid-cols-2 md:gap-x-8">
                {(isExpanded ? locations : locations.slice(0, 2)).map((loc, i) => (
                    <div key={`mobile-${i}`} className="md:hidden">
                      {renderLocation(loc, i)}
                    </div>
                ))}

                {locations.map((loc, i) => (
                    <div key={`desktop-${i}`} className="hidden md:block">
                      {renderLocation(loc, i)}
                    </div>
                ))}
              </div>

              <div className="md:hidden text-center mt-8">
                <button
                    onClick={() => setIsExpanded(v => !v)}
                    className="px-8 py-4 bg-card/55 backdrop-blur-xs border border-border/60 rounded-3xl shadow-2xl text-primary font-medium hover:bg-card/65 transition"
                >
                  {isExpanded ? "Скрыть" : "Показать все локации"}
                </button>
              </div>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-16 pt-8 text-center">
            <div className="inline-block bg-card/55 backdrop-blur-xs border border-border/60 rounded-full px-10 py-5 shadow-2xl">
            <span className="text-sm font-medium text-foreground">
              © 2025 «Башня». Все права защищены.
            </span>
            </div>
          </div>
        </div>
      </footer>
  )
}
