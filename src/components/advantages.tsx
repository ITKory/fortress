"use client"

import { useState } from "react"
import HandDrawnArrow from "./hand-drawn-arrow"
import Image from "next/image";
import {useIsMobile} from "@/src/hooks/use-mobile";

export default function Advantages() {
    const [hoveredCard, setHoveredCard] = useState<number | null>(null)
    const isMobile = useIsMobile();

    const advantages = [
        {
            title: "Удобное расположение",
            description: "Наши рестораны находятся в центре города с удобной транспортной доступностью и парковкой",
            icon: (
                <Image alt='1' src='/advantages/2.svg' width={70} height={20} />
            ),
            gradient: "from-amber-100 to-amber-50",
            accentColor: "text-amber-600",
            pattern: "dots",
            line_rotation: -45,
            position: "-top-8 -right-8"
        },
        {
            title: "Премиальные продукты",
            description: "Работаем только с проверенными поставщиками, используем фермерские продукты и свежие продукты",
            icon: (
                <Image alt='1' src='/advantages/1.svg' width={80} height={20} />
            ),
            gradient: "from-yellow-100 to-yellow-50",
            accentColor: "text-yellow-600",
            pattern: "circles",
            line_rotation: -90,
            position: "-top-8 left-1/2 -translate-x-1/2"
        },
        {
            title: "Более 200 блюд",
            description: "Разнообразное меню на любой вкус: от классики до авторских блюд от шеф-повара",
            icon: (
                <Image alt='burger' src='/advantages/3.svg' width={60} height={20} />
                    ),
            gradient: "from-orange-100 to-orange-50",
            accentColor: "text-orange-600",
            pattern: "waves",
            line_rotation: -145,
            position: "-top-8 -left-8"
        },
    ]

    return (
        <section className="py-12 md:py-24 px-4 relative overflow-hidden">
            <div className="absolute inset-0 opacity-30 pointer-events-none">
                <div className="absolute top-20 left-10 w-32 h-32 rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl" />
                <div className="absolute bottom-20 right-10 w-40 h-40 rounded-full bg-gradient-to-br from-primary/20 to-transparent blur-3xl" />
            </div>

            <div className="max-w-6xl mx-auto relative">
                <h2 className="font-serif text-4xl md:text-6xl font-light text-center mb-16 text-balance">Наши преимущества</h2>

                 <div className="grid grid-cols-1 md:grid-cols-3 gap-y-8 gap-x-6 md:gap-6">
                    {advantages.map((advantage, index) => (
                           <div
                            key={index}
                            className={`relative group transform ${index === 1 ? "md:translate-y-8" : ""}`}
                            onMouseEnter={() => setHoveredCard(index)}
                            onMouseLeave={() => setHoveredCard(null)}
                        >
                            <div
                                className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${advantage.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl`}
                            />

                            <div className="relative bg-card/80 backdrop-blur-sm border-2 border-border rounded-3xl p-8 transition-all duration-500 hover:shadow-2xl hover:scale-105 hover:border-accent/50 h-full overflow-hidden">
                                <div className="absolute top-0 right-0 w-32 h-32 opacity-10 transition-transform duration-700 group-hover:scale-150 group-hover:rotate-12">
                                    {advantage.pattern === "dots" && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="20" cy="20" r="3" fill="currentColor" />
                                            <circle cx="50" cy="20" r="3" fill="currentColor" />
                                            <circle cx="80" cy="20" r="3" fill="currentColor" />
                                            <circle cx="20" cy="50" r="3" fill="currentColor" />
                                            <circle cx="50" cy="50" r="3" fill="currentColor" />
                                            <circle cx="80" cy="50" r="3" fill="currentColor" />
                                        </svg>
                                    )}
                                    {advantage.pattern === "circles" && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <circle cx="50" cy="50" r="15" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <circle cx="50" cy="50" r="25" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <circle cx="50" cy="50" r="35" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    )}
                                    {advantage.pattern === "waves" && (
                                        <svg viewBox="0 0 100 100" className="w-full h-full">
                                            <path d="M0 30 Q25 20 50 30 T100 30" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M0 50 Q25 40 50 50 T100 50" stroke="currentColor" strokeWidth="2" fill="none" />
                                            <path d="M0 70 Q25 60 50 70 T100 70" stroke="currentColor" strokeWidth="2" fill="none" />
                                        </svg>
                                    )}
                                </div>

                                <div
                                    className={`relative inline-flex items-center justify-center mb-6 ${advantage.accentColor} transition-transform duration-500 group-hover:scale-110 group-hover:rotate-6`}
                                >
                                    <div
                                        className={`absolute inset-0 bg-gradient-to-br ${advantage.gradient} rounded-2xl blur-lg opacity-50`}
                                    />
                                    <div className="relative p-4">{advantage.icon}</div>
                                </div>

                                <h3 className="font-serif text-2xl mb-4 text-foreground transition-colors duration-300 group-hover:text-accent">
                                    {advantage.title}
                                </h3>
                                <p className="text-muted-foreground leading-relaxed">{advantage.description}</p>

                                <div className="absolute bottom-4 right-4 w-12 h-12 opacity-0 group-hover:opacity-100 transition-all duration-500 group-hover:scale-110">
                                    <svg viewBox="0 0 50 50" className={`w-full h-full ${advantage.accentColor}`}>
                                        <path
                                            d="M40 10 L40 40 L10 40"
                                            stroke="currentColor"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeLinecap="round"
                                        />
                                    </svg>
                                </div>
                            </div>

                            {hoveredCard === index && !isMobile && (
                                <div className={`absolute ${advantage.position} pointer-events-none`}>
                                    <HandDrawnArrow rotation={advantage.line_rotation} />
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    )
}
