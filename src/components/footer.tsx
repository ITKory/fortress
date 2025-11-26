"use client"

import React, { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { Highlighter } from "@/src/components/ui/highlighter"

export default function Footer() {
  const [isExpanded, setIsExpanded] = useState(false)

  const locations = [
    { name: "Москва‑Сити", address: "Пресненская набережная, д. 10", phone: "+7 (905) 977‑57‑00" },
    { name: "ТЦ BOTANICA", address: "ул. Вильгельма Пика, д. 11", phone: "+7 (905) 977‑57‑00" },
    { name: "БЦ Аркадия", address: "Б. Овчинниковский пер., д. 16", phone: "+7 (903) 538‑31‑91" },
    { name: "Фудмолл BAZAAR", address: "м-9 Балтия, 26-й км., д. 7А, МО, г. Красногорск", phone: "+7 (936) 277-57‑00" },
    { name: "ШАУРМА", address: "ул. Никольская, д. 25", phone: "+7 (905) 977‑57‑00" },
    { name: "ШАУРМА И ЧУРРОС", address: "ул. Большая Дмитровка, д. 7/5, стр. 1", phone: "+7 (905) 977‑57‑00" },
  ]

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
          <div className="absolute inset-0 bg-black/65" />
        </div>

        <div className="relative py-16 px-4 text-white">
          <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-10">

            <Highlighter action="highlight" color="#FFF4E6">
              <div className="p-6 space-y-5">
                <div className="flex items-center gap-4">
                  <div className="w-14 h-14 bg-black/10 rounded-xl flex items-center justify-center">
                    <Image src="/fortress.svg" alt="Башня" width={56} height={56} className="w-auto h-auto" />
                  </div>
                  <div>
                    <div className="font-serif text-2xl font-bold text-foreground">Башня</div>
                    <div className="text-sm font-medium text-foreground/90">Вайнахская кухня · Халяль</div>
                  </div>
                </div>

                <p className="text-sm leading-relaxed text-foreground/90 max-w-xs">
                  Вкусные авторские блюда вайнахской кухни — быстро, с любовью и по халяль-стандартам.
                </p>

                <div className="flex flex-wrap items-center gap-3">
                  <Link href="#menu" className="px-5 py-2.5 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg font-medium shadow-lg transition">
                    Меню
                  </Link>
                  <Link href="#about" className="text-foreground/90 hover:text-foreground font-medium transition">
                    О нас
                  </Link>
                </div>
              </div>
            </Highlighter>

            <div className="space-y-6 md:col-span-2">
              <Highlighter action="highlight" color="#FFF4E6">
                <h4 className="px-6 pt-4 pb-2 text-xl md:text-2xl font-bold text-foreground">Наши локации</h4>
              </Highlighter>

              <div className="grid gap-5 md:grid-cols-2 md:gap-x-8">
                {(isExpanded ? locations : locations.slice(0, 2)).map((loc, i) => (
                    <div key={i} className="md:hidden">
                      <Highlighter action="highlight" color="#FFF4E6">
                        <div className="p-5">
                          <div className="font-bold text-lg text-foreground">{loc.name}</div>
                          <div className="text-sm text-foreground/80 mt-1">{loc.address}</div>
                          <a href={`tel:${loc.phone.replace(/[^+\d]/g, "")}`} className="text-primary hover:underline font-medium text-sm mt-2 inline-block">
                            {loc.phone}
                          </a>
                        </div>
                      </Highlighter>
                    </div>
                ))}

                {locations.map((loc, i) => (
                    <div key={i} className="hidden md:block">
                      <Highlighter action="highlight" color="#FFF4E6">
                        <div className="p-5">
                          <div className="font-bold text-lg text-foreground">{loc.name}</div>
                          <div className="text-sm text-foreground/80 mt-1">{loc.address}</div>
                          <a href={`tel:${loc.phone.replace(/[^+\d]/g, "")}`} className="text-primary hover:underline font-medium text-sm mt-2 inline-block">
                            {loc.phone}
                          </a>
                        </div>
                      </Highlighter>
                    </div>
                ))}
              </div>

              <div className="md:hidden text-center mt-6">
                <Highlighter action="highlight" color="#FFF4E6">
                  <button onClick={() => setIsExpanded(v => !v)} className="px-6 py-2 text-primary font-medium hover:underline text-sm">
                    {isExpanded ? "Скрыть" : "Показать все"}
                  </button>
                </Highlighter>
              </div>
            </div>

            <div className="md:text-right">
              <Highlighter action="highlight" color="#FFF4E6">
                <div className="p-6">
                  <h4 className="text-xl font-bold text-foreground mb-4">Мы в соцсетях</h4>
                  <a href="https://www.instagram.com/bashnya_rest" target="_blank" rel="noreferrer" className="inline-flex items-center gap-3 text-foreground hover:text-primary transition font-medium">
                    <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="3" width="18" height="18" rx="5" />
                      <circle cx="12" cy="12" r="4" />
                    </svg>
                    Instagram
                  </a>
                </div>
              </Highlighter>
            </div>
          </div>

          <div className="max-w-6xl mx-auto mt-16 pt-8 text-center">
            <Highlighter action="highlight" color="#FFF4E6">
              <div className="px-8 py-4 rounded-full inline-block">
              <span className="text-sm font-medium text-foreground">
                © 2025 «Башня». Все права защищены.
              </span>
              </div>
            </Highlighter>
          </div>
        </div>
      </footer>
  )
}
