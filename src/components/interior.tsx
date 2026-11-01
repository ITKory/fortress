import Image from "next/image"

const details = [
    {
        image: "/interier/1.png",
        alt: "Национальные костюмы и деревянный стол с напитками в интерьере «Башни»",
    },
    {
        image: "/interier/2.png",
        alt: "Яркие напитки с фруктами на деревянном столе",
    },
]

export default function Interior() {
    return (
        <section id="interior" aria-labelledby="interior-title" className="section-space relative border-y border-border/60 bg-card/70">
            <div className="pointer-events-none absolute inset-0 overflow-hidden" aria-hidden="true">
                <div className="absolute -right-24 top-24 size-80 rounded-full bg-primary/5 blur-3xl" />
            </div>
            <div className="section-shell relative">
                <div className="reveal-on-scroll mb-8 flex flex-col gap-5 md:mb-12 lg:flex-row lg:items-end lg:justify-between lg:gap-12">
                    <h2 id="interior-title" className="font-serif text-4xl font-light text-balance md:text-6xl">
                        Атмосфера «Башни»
                    </h2>
                    <p className="max-w-sm text-sm leading-relaxed text-muted-foreground md:text-base">
                        Тёплый свет, национальные детали и знакомые вкусы. Немного нашей атмосферы — в фотографиях.
                    </p>
                </div>

                <div className="grid items-end gap-6 lg:grid-cols-[1.6fr_1fr] lg:gap-8">
                    <figure className="reveal-on-scroll min-w-0">
                        <div className="interior-scene relative aspect-[4/3] overflow-hidden rounded-3xl border border-border/70 bg-muted shadow-lg shadow-foreground/5">
                            <div className="interior-parallax absolute -inset-5">
                                <Image
                                    src="/interier/3.png"
                                    alt="Стойка «Башни» с меню, деревянные столы и зелёные кресла в зале"
                                    fill
                                    sizes="(min-width: 1024px) 700px, 100vw"
                                    quality={75}
                                    className="object-cover"
                                />
                            </div>
                            <div className="pointer-events-none absolute inset-3 rounded-2xl border border-background/30" aria-hidden="true" />
                        </div>
                    </figure>

                    <div className="grid grid-cols-2 items-start gap-4 lg:gap-5">
                        {details.map((detail, index) => (
                            <figure key={detail.image} className={`reveal-on-scroll min-w-0 ${index === 1 ? "pt-8 lg:pt-12" : ""}`}>
                                <div className="ambient-card relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/70 bg-muted shadow-lg shadow-foreground/5">
                                    <div className="absolute left-1/2 top-1/2 h-[75%] w-[133.333333%] -translate-x-1/2 -translate-y-1/2 rotate-90">
                                        <Image
                                            src={detail.image}
                                            alt={detail.alt}
                                            fill
                                            sizes="(min-width: 1024px) 300px, 65vw"
                                            quality={75}
                                            className="object-cover"
                                        />
                                    </div>
                                </div>
                            </figure>
                        ))}
                    </div>
                </div>
            </div>
        </section>
    )
}
