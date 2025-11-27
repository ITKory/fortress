"use client"

import React, { JSX, useEffect, useRef } from "react"
import Image from "next/image"
import { Highlighter } from "@/src/components/ui/highlighter"

export default function About(): JSX.Element {
    const statsRef = useRef<HTMLDivElement | null>(null)

    useEffect(() => {
        const el = statsRef.current
        if (!el) return

        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        obs.disconnect()
                    }
                })
            },
            { threshold: 0.35 }
        )

        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <section
            id="about"
            className="py-12 md:py-24 px-4 border-t border-border bg-gradient-to-b from-card/90 to-card/10 relative overflow-hidden"
        >
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[60%] h-[60%] bg-[radial-gradient(circle_at_center,rgba(255,214,150,0.12)_0%,transparent_70%)] pointer-events-none" />

            <div className="absolute top-2 right-4 w-32 h-32 hidden md:block md:w-52 md:h-52 opacity-70 pointer-events-none ">
                <Image
                    src="/halal.png"
                    alt="Сертификация: халяль"
                    fill
                    className="object-contain"
                    priority={false}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                 <div className="w-full grid gap-12 items-center">
                    <div className="space-y-6 animate-fade-in-up w-full">
                        <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-balance">
                            О нас
                        </h2>

                        <div className="text-muted-foreground space-y-4 text-base md:text-lg leading-relaxed">
                            <p className="animate-fade-in delay-100">
                                <Highlighter action="highlight" color="#FFF4E6"><span className="text-primary font-medium">Вайнахская кухня</span></Highlighter> (чечено‑ингушская) — одна из древнейших и при этом лаконичных кулинарных традиций. Блюда отличаются питательностью и высокой калорийностью, а готовятся быстро из доступных продуктов. <Highlighter action="highlight" color="#FFF4E6"><span className="text-primary font-medium">Все наши блюда сертифицированы как халяль</span></Highlighter>.
                            </p>

                            <p className="animate-fade-in delay-200">
                                В центре меню — национальные блюда. Например, <Highlighter action="underline" color="#FFB74D">чапильг</Highlighter> — тонкие лепешки из пшеничной муки с разнообразными начинками: творогом, тыквой, картофелем, мясом, зеленью и сыром. <Highlighter action="underline" color="#FFB74D">Жигжиг‑Галнаш</Highlighter> ( "жижиг" — мясо; "галнаш" — галушки) — отварное мясо (говядина, курица, баранина, сушеная говядина, сушеная колбаса, бараш) с галушками из пшеничной или кукурузной муки.
                            </p>

                            <p className="animate-fade-in delay-300">
                                Также в нашем меню представлены: <Highlighter action="highlight" color="#FFF4E6"> <span className="text-primary font-medium">кебабы, шашлыки, стейки, бургеры на мангале</span></Highlighter>, разнообразные салаты и многое другое.
                            </p>

                            <p className="animate-fade-in delay-400">
                                Ресторан получил своё название — «Башня». Оно отсылает к чеченским оборонительным башням, которые возводились вокруг сёл со всех сторон света в целях защиты. Мы успешно работаем с 2021  г. Работу начали в формате ресторана в центре Москвы (м. Лубянка, ул. Никольская 8/1). Позднее из-за реконструкции здания руководство приняло решение развиваться в формате фуд-кортов и выстраивать сеть <Highlighter action="highlight" color="#FFF4E6">«Башня. Вайнахская кухня».</Highlighter>
                            </p>

                            <p className="animate-fade-in delay-500">
                                Основное направление деятельности — общественное питание Халяль. <Highlighter action="underline" color="#FFB74D">Без алкогольной</Highlighter> и <Highlighter action="underline" color="#FFB74D">без табачной</Highlighter> продукции.
                            </p>
                        </div>

                         <div className="absolute sm:hidden -top-10 -right-9 w-32 h-32 md:right-0 md:w-52 md:h-52 opacity-70 pointer-events-none ">
                            <Image
                                src="/halal.png"
                                alt="Сертификация: халяль"
                                fill
                                className="object-contain"
                                priority={false}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    )
}
