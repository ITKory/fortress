"use client"

import React, {JSX, useState} from "react"
import Link from "next/link"
import Image from "next/image";
import { useIsMobile } from "@/src/hooks/use-mobile";

export default function Footer(): JSX.Element {
  const isMobile = useIsMobile();
  const [isExpanded, setIsExpanded] = useState(false);

  const locations = [
    {
      name: "Москва‑Сити",
      address: "Пресненская набережная, д. 10",
      phone: "+7 (905) 977‑57‑00",
    },
    {
      name: "Никольская",
      address: "ул. Никольская, д. 8/1 ст1",
      phone: "+7 (905) 977‑57‑00",
    },
    {
      name: "Овчинниковский пер.",
      address: "Б. Овчинниковский пер., д. 16",
      phone: "+7 (903) 538‑31‑91",
    },
    {
      name: "Ботанический сад",
      address: "ул. Вильгельма Пика, д. 11",
      phone: "+7 (905) 977-57-00",
    },
    {
      name: "Фудмолл BAZAAR",
      address: "м-9 Балтия, 26-й км., д. 7А, ФУДМОЛЛ BAZAAR",
      phone: "+7 (936) 277-57-00",
    },
    {
      name: "Дмитровка",
      address: "ул. Большая Дмитровка, д. 7/5, стр. 1",
      phone: "+7 (905) 977‑57‑00",
    },
  ];

  const visibleLocations = isMobile && !isExpanded ? locations.slice(0, 2) : locations;

  return (
      <footer className="py-12 px-4 bg-card/60 backdrop-blur-sm border-t border-border text-foreground">
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About / Logo */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 flex items-center justify-center">
                <Image
                    src="/fortress.svg"
                    alt="Логотип ресторана «Башня»"
                    width={48}
                    height={48}
                    className="w-auto h-auto"
                    priority={false}
                />
              </div>
              <div>
                <div className="font-serif text-xl">Башня</div>
                <div className="text-sm text-muted-foreground">Вайнахская кухня · Халяль</div>
              </div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed">
              Вкусные авторские блюда вайнахской кухни — быстро, с любовью и по халяль-стандартам.
            </p>

            <div className="flex items-center gap-3 pt-2">
              <Link href="#menu" className="inline-block text-sm bg-primary px-3 py-2 rounded-lg text-primary-foreground shadow-sm hover:bg-primary/90">Меню</Link>
              <Link href="#about" className="inline-block text-sm text-muted-foreground hover:text-foreground">О нас</Link>
            </div>
          </div>

          {isMobile ? (
              <div>
                <h4 className="font-semibold mb-3">Наши локации</h4>
                <ul className="text-sm text-muted-foreground space-y-3">
                  {visibleLocations.map((loc, index) => (
                      <li key={index}>
                        <div className="font-medium text-foreground">{loc.name}</div>
                        <div className="text-xs">{loc.address}</div>
                        <a href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`} className="text-sm text-primary hover:underline">{loc.phone}</a>
                      </li>
                  ))}
                </ul>
                {locations.length > 2 && (
                    <button
                        onClick={() => setIsExpanded(!isExpanded)}
                        className="mt-4 text-sm text-primary hover:underline"
                    >
                      {isExpanded ? "Скрыть" : "Показать все"}
                    </button>
                )}
              </div>
          ) : (
              <>
                <div>
                  <h4 className="font-semibold mb-3">Наши локации</h4>
                  <ul className="text-sm text-muted-foreground space-y-3">
                    {locations.slice(0, 3).map((loc, index) => (
                        <li key={index}>
                          <div className="font-medium text-foreground">{loc.name}</div>
                          <div className="text-xs">{loc.address}</div>
                          <a href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`} className="text-sm text-primary hover:underline">{loc.phone}</a>
                        </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <ul className="text-sm text-muted-foreground space-y-3 mt-8">
                    {locations.slice(3).map((loc, index) => (
                        <li key={index + 3}>
                          <div className="font-medium text-foreground">{loc.name}</div>
                          <div className="text-xs">{loc.address}</div>
                          <a href={`tel:${loc.phone.replace(/[^+\d]/g, '')}`} className="text-sm text-primary hover:underline">{loc.phone}</a>
                        </li>
                    ))}
                  </ul>
                </div>
              </>
          )}

          {/* Social */}
          <div>
            <h4 className="font-semibold mb-3">Мы в соцсетях</h4>

            <div className="flex items-center gap-3 mb-2">
              <a href="https://www.instagram.com/bashnya_rest" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground">
                <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><rect x="3" y="3" width="18" height="18" rx="5" stroke="currentColor" strokeWidth="1.4"/><circle cx="12" cy="12" r="3" stroke="currentColor" strokeWidth="1.4"/></svg>
                Instagram
              </a>
            </div>
          </div>
        </div>

        <div className="max-w-6xl mx-auto mt-8 border-t border-border pt-6 text-sm text-muted-foreground flex flex-col md:flex-row justify-between items-center gap-4">
          <div>© 2025 «Башня». Все права защищены.</div>
        </div>
      </footer>
  )
}
