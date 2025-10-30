"use client"

import React, {JSX, useEffect, useRef} from "react"
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
                {/* decorative image: preserved with next/image for best practices */}
                <Image
                    src="/halal.png"
                    alt="Сертификация: халяль"
                    fill
                    className="object-contain"
                    priority={false}
                />
            </div>

            <div className="absolute w-[70%] h-full hidden md:block -mx-70 bottom-0 right-0 opacity-90 pointer-events-none">
                <Image
                    src="/fortress.svg"
                    alt="иллюстрация башни"
                    width={100}
                    height={100}
                    className="w-full h-full object-contain "
                    priority={false}
                />
            </div>

            <div className="max-w-6xl mx-auto relative z-10">
                <div className="grid md:grid-cols-3 gap-12 items-center">
                    <div className="md:col-span-2 space-y-6 animate-fade-in-up">
                        <h2 className="font-serif text-4xl md:text-5xl font-light leading-tight text-balance">
                            О нас — <span className="text-primary font-medium">Вайнахская кухня в «Башня»</span>
                        </h2>

                        <div className="text-muted-foreground space-y-4 text-base md:text-lg leading-relaxed">
                            <p className="animate-fade-in delay-100">
                                <Highlighter action="highlight" color="#FFF4E6"><span className="text-primary font-medium">Вайнахская кухня</span></Highlighter> (чечено‑ингушская) — одна из древнейших и при этом лаконичных кулинарных традиций. Блюда отличаются питательностью и высокой калорийностью, а готовятся быстро из доступных продуктов. <span className="text-primary font-medium">Все наши блюда сертифицированы как халяль</span>.
                            </p>

                            <p className="animate-fade-in delay-200">
                                В центре меню — национальные блюда. Например, <Highlighter action="underline" color="#FFB74D">чапильг</Highlighter> — тонкие лепешки из пшеничной муки с разнообразными начинками: творогом, тыквой, картофелем, мясом, зеленью и сыром. <Highlighter action="underline" color="#FFB74D">Жигжиг‑Галнаш</Highlighter> ( "жижиг" — мясо; "галнаш" — галушки) — отварное мясо на косточке с галушками из пшеничной или кукурузной муки.
                            </p>

                            <p className="animate-fade-in delay-300">
                                Мы также предлагаем <Highlighter action="highlight" color="#FFF4E6"> <span className="text-primary font-medium">кебабы, шашлыки и стейки</span></Highlighter>, бургеры, разнообразные салаты и другие популярные позиции — многие блюда готовятся на мангале.
                            </p>

                            <p className="animate-fade-in delay-400">
                                Ресторан получил своё название — «Башня». Оно отсылает к чеченским оборонительным башням, которые возводились вокруг сёл со всех четырёх сторон в целях защиты. Мы начали работу в формате ресторана в 2021 году и успешно трудились в центре Москвы (м. Лубянка, ул. Никольская, 8/1). Позднее из‑за реконструкции здания руководство решило развивать формат фудкортов и выстраивать сеть <span className="text-primary font-medium">«Башня. Вайнахская кухня»</span>.
                            </p>
                        </div>
                        <div className="absolute sm:hidden top-3 -right-9 w-32 h-32 md:right-0 md:w-52 md:h-52 opacity-70 pointer-events-none ">
                            {/* decorative image: preserved with next/image for best practices */}
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
