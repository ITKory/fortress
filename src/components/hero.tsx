"use client"

import { Button } from "@/src/components/ui/button"
import React, { useState, useEffect } from "react"
import HandDrawnArrow from "./hand-drawn-arrow"
import Link from "next/link"
import Image from "next/image"

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

     const logoTranslate = `translateY(${scrollY * 0.2}px)`

    return (
        <section className="relative min-h-[120vh] flex items-start md:items-center justify-center px-4 pt-28 pb-24 overflow-visible  bg-gradient-to-b from-card/90 to-card/10">
            <div className="absolute inset-0 flex justify-center items-start md:items-center pointer-events-none">
                <div className="w-[60%] h-[40%] md:w-[45%] md:h-[40%] rounded-full bg-[radial-gradient(circle_at_center,rgba(255,214,150,0.08)_0%,transparent_70%)]" />
            </div>

            <div
                className="max-w-6xl w-full mx-auto text-center relative z-10"
                style={{ transform: logoTranslate }}
            >
                 <div className="mx-auto">
                    <Image
                        src="/logo.svg"
                        alt="Логотип ресторана «Башня»"
                        width={1600}
                        height={1600}
                        className="mx-auto w-72 sm:w-96 md:w-[28rem] lg:w-[32rem] h-auto animate-float"
                        priority={false}
                    />
                </div>


                <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 px-4 md:px-0">
                    {[
                        { title: 'Мангал & Кебабы', desc: 'Большой выбор мяса, приготовленного на мангале.' },
                        { title: 'Национальные лепёшки', desc: 'Чапильг с разными начинками — от классики до авторских.' },
                        { title: 'Сертифицировано халяль', desc: 'Все блюда соответствуют требованиям халяль.' },
                    ].map((item, i) => (
                        <div
                            key={item.title}
                            className={`bg-card/60 backdrop-blur-sm rounded-2xl border-1 p-6 text-left transform transition-transform duration-400 hover:-translate-y-2 animate-reveal`}
                            style={{ animationDelay: `${200 + i * 120}ms` }}
                        >
                            <div className="flex items-center gap-3">
                                <div>
                                    <h4 className="font-medium">{item.title}</h4>
                                    <p className="text-sm text-muted-foreground mt-1">{item.desc}</p>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="mt-8">
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
                            <div
                                className="absolute left-1/2 top-full mt-8 -translate-x-1/2 pointer-events-none"
                                aria-hidden="true"
                            >
                                <div className="flex items-end justify-center -space-x-10 pointer-events-none" aria-hidden="true">
                                    <div className="relative z-10 transform translate-y-3 scale-95 animate-bob">
                                        <HandDrawnArrow rotation={-90} />
                                    </div>

                                    <div className="relative z-20 transform scale-125 animate-bob" style={{ animationDelay: '60ms' }}>
                                        <HandDrawnArrow rotation={-90} />
                                    </div>

                                    <div className="relative z-0 transform translate-y-3 animate-bob" style={{ animationDelay: '120ms' }}>
                                        <HandDrawnArrow rotation={-90} />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                <div className="h-24 md:h-40" />
            </div>

             <style jsx>{`
                @keyframes float {
                    0% { transform: translateY(0px); }
                    50% { transform: translateY(-6px); }
                    100% { transform: translateY(0px); }
                }
                

                @keyframes reveal {
                    0% { opacity: 0; transform: translateY(8px); }
                    100% { opacity: 1; transform: translateY(0); }
                }

                @keyframes bob {
                    0% { transform: translateY(0); }
                    50% { transform: translateY(-4px) rotate(-2deg); }
                    100% { transform: translateY(0); }
                }
            `}</style>
        </section>
    )
}
