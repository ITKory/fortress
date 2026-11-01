"use client"

import { Button } from "@/src/components/ui/button"
import React, { useState } from "react"
import HandDrawnArrow from "./hand-drawn-arrow"
import Link from "next/link"
import Image from "next/image"
import { BadgeCheck, Flame, MapPin, UtensilsCrossed } from "lucide-react"
import { useMenu } from "@/src/components/menu-provider"

export default function Hero() {
    const [isHovered, setIsHovered] = useState(false)
    const { isOpen, openMenu } = useMenu()

    return (
        <section aria-labelledby="hero-title" className="relative flex min-h-svh items-center justify-center overflow-visible bg-gradient-to-b from-card/90 to-card/10 pt-28 pb-28 sm:pt-32">
            <h1 id="hero-title" className="sr-only">Рестораны «Башня» — вайнахская кухня в Москве</h1>
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute left-1/2 top-16 size-[min(85vw,42rem)] -translate-x-1/2 rounded-full bg-primary/10 blur-3xl" />
                <div className="absolute inset-x-8 bottom-12 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent sm:inset-x-16" />
            </div>

            <div
                className="section-shell relative z-10 text-center"
            >
                <div className="hero-reveal mb-6 flex items-center justify-center gap-3 text-sm text-muted-foreground"/>

                <div className="hero-reveal relative isolate mx-auto w-fit max-w-full" style={{ animationDelay: "80ms" }}>
                    <div className="pointer-events-none absolute -inset-x-3 inset-y-0 -z-10 rounded-t-full rounded-b-3xl border border-primary/15 bg-gradient-to-b from-background/40 to-transparent sm:-inset-x-6" aria-hidden="true" />
                    <div className="pointer-events-none absolute inset-x-0 inset-y-3 -z-10 rounded-t-full rounded-b-2xl border border-primary/10 sm:-inset-x-3" aria-hidden="true" />
                    <Image
                        src="/logo-black.svg"
                        alt="Логотип ресторана «Башня»"
                        width={1600}
                        height={1600}
                        sizes="(max-width: 640px) 256px, (max-width: 768px) 320px, (max-width: 1024px) 384px, 448px"
                        quality={70}
                        className="mx-auto h-auto w-64 max-w-full sm:w-80 md:w-96 lg:w-[28rem]"
                        priority
                    />
                </div>


                <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3 lg:gap-6">
                    {[
                        { title: 'Национальные блюда', desc: 'Жижиг-галнаш. Чапильг с разными начинками — от классики до авторских.', icon: UtensilsCrossed },
                        { title: 'Мангал', desc: 'Большой выбор мяса, приготовленного на мангале.', icon: Flame },
                        { title: 'Сертифицировано халяль', desc: 'Все блюда соответствуют требованиям халяль.', icon: BadgeCheck },
                    ].map(({ title, desc, icon: Icon }, index) => (
                        <div
                            key={title}
                            className="hero-reveal glass-panel ambient-card group p-5 text-left transition-[transform,border-color,box-shadow] duration-300 hover:border-primary/30 hover:shadow-lg motion-safe:hover:-translate-y-1 sm:p-6"
                            style={{ animationDelay: `${180 + index * 100}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <span className="flex size-10 shrink-0 items-center justify-center rounded-xl border border-primary/15 bg-primary/5 text-primary transition-colors duration-300 group-hover:bg-primary/10" aria-hidden="true">
                                    <Icon className="size-5" strokeWidth={1.5} />
                                </span>
                                <h2 className="font-medium">{title}</h2>
                            </div>
                            <p className="mt-3 text-sm text-muted-foreground">{desc}</p>
                        </div>
                    ))}
                </div>

                <div className="hero-reveal relative mt-8 flex flex-wrap items-center justify-center gap-3 sm:gap-4" style={{ animationDelay: "480ms" }}>
                    <div className="inline-block">
                        <Button
                            type="button"
                            aria-haspopup="dialog"
                            aria-expanded={isOpen}
                            onClick={event => openMenu(event.currentTarget)}
                            size="lg"
                            className="ambient-card bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300"
                            onMouseEnter={() => setIsHovered(true)}
                            onMouseLeave={() => setIsHovered(false)}
                            onFocus={() => setIsHovered(true)}
                            onBlur={() => setIsHovered(false)}
                        >
                            Наши блюда
                        </Button>

                        {isHovered && (
                            <div
                                className="absolute left-1/2 top-full mt-8 -translate-x-1/2 pointer-events-none"
                                aria-hidden="true"
                            >
                                <div className="flex items-end justify-center -space-x-10 pointer-events-none" aria-hidden="true">
                                    <div className="hero-arrow-bob relative z-10 transform translate-y-3 scale-95">
                                        <HandDrawnArrow rotation={-90} />
                                    </div>

                                    <div className="hero-arrow-bob relative z-20 transform scale-125" style={{ animationDelay: '60ms' }}>
                                        <HandDrawnArrow rotation={-90} />
                                    </div>

                                    <div className="hero-arrow-bob relative z-0 transform translate-y-3" style={{ animationDelay: '120ms' }}>
                                        <HandDrawnArrow rotation={-90} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <Button asChild size="lg" variant="outline" className="rounded-xl px-6 py-6">
                        <Link href="#locations">
                            <MapPin className="size-4" aria-hidden="true" />
                            Найти ресторан
                        </Link>
                    </Button>
                </div>

            </div>

             <style jsx>{`
                @keyframes hero-reveal {
                    0% { opacity: 0; transform: translateY(8px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes hero-bob {
                    0%, 100% { transform: translateY(0); }
                    50% { transform: translateY(-4px); }
                }

                @media (prefers-reduced-motion: no-preference) {
                    .hero-reveal {
                        animation: hero-reveal 600ms cubic-bezier(0.22, 1, 0.36, 1) backwards;
                    }
                    .hero-arrow-bob {
                        animation: hero-bob 2.6s ease-in-out infinite;
                    }
                }
            `}</style>
        </section>
    )
}
