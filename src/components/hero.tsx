"use client"

import { Button } from "@/src/components/ui/button"
import { useState, useEffect } from "react"
import HandDrawnArrow from "./hand-drawn-arrow"
import Link from "next/link";

export default function Hero() {
    const [isHovered, setIsHovered] = useState(false)
    const [scrollY, setScrollY] = useState(0)

    useEffect(() => {
        const handleScroll = () => {
            setScrollY(window.scrollY)
        }
        window.addEventListener("scroll", handleScroll)
        return () => window.removeEventListener("scroll", handleScroll)
    }, [])

    return (
        <section className="relative min-h-screen flex items-center justify-center px-4 py-20 overflow-hidden">
            <div
                className="max-w-6xl mx-auto text-center relative z-10"
                style={{
                    transform: `translateY(${scrollY * 0.15}px)`,
                }}
            >
                <h1 className="font-serif text-6xl md:text-8xl lg:text-9xl font-light text-foreground mb-6 text-balance">
                    Вкус, который
                    <br />
                    <span className="italic text-accent">вдохновляет</span>
                </h1>
                <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto mb-12 text-pretty leading-relaxed">
                    Откройте для себя уникальную атмосферу наших ресторанов, где каждое блюдо — произведение искусства
                </p>

                <div className="relative inline-block">
                    <Button
                        size="lg"
                        className="bg-primary hover:bg-primary/90 text-primary-foreground px-8 py-6 text-lg rounded-xl transition-all duration-300"
                        onMouseEnter={() => setIsHovered(true)}
                        onMouseLeave={() => setIsHovered(false)}
                    >
                        <Link href="#menu">Наши блюда</Link>
                    </Button>

                    {isHovered && (
                        // контейнер под кнопкой
                        <div
                            className="absolute left-1/2 top-full mt-8 -translate-x-1/2 pointer-events-none"
                            aria-hidden="true"
                        >
                            <div className="flex items-end justify-center -space-x-10 pointer-events-none" aria-hidden="true">
                                <div className="relative z-10 transform translate-y-3 scale-95">
                                    <HandDrawnArrow rotation={-90} />
                                </div>

                                <div className="relative z-20 transform scale-125">
                                    <HandDrawnArrow rotation={-90} />
                                </div>

                                <div className="relative z-0 transform translate-y-3">
                                    <HandDrawnArrow rotation={-90} />
                                </div>
                            </div>

                        </div>
                    )}
                </div>
            </div>
        </section>
    )
}
