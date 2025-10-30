"use client";

import React, { useRef, useMemo, useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "motion/react";
import { cn } from "@/src/lib/utils";

type LazyImageProps = {
    src: string;
    alt?: string;
    width?: number;
    height?: number;
    sizes?: string;
    className?: string;
    placeholderSrc?: string;
    priority?: boolean;
};

// Простой LazyImage: показывает <Image> только когда элемент видим (IntersectionObserver)
const LazyImage: React.FC<LazyImageProps> = ({ src, alt, width, height, sizes, className, priority }) => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const el = ref.current;
        if (!el) return;
        const io = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setInView(true);
                        io.disconnect();
                    }
                });
            },
            {
                root: null,
                rootMargin: "400px", // большой rootMargin — подгружаем заранее при близком скролле
                threshold: 0.01,
            }
        );
        io.observe(el);
        return () => io.disconnect();
    }, [ref]);

    return (
        <div ref={ref} className={className}>
            {inView ? (
                <Image
                    src={src}
                    alt={alt ?? ""}
                    width={width}
                    height={height}
                    sizes={sizes}
                    loading={priority ? "eager" : "lazy"}
                    decoding="async"
                    className="h-full w-full object-cover object-left-top"
                />
            ) : (
                // простой placeholder (пустой блок) — можно заменить на skeleton/blur
                <div className="h-full w-full bg-gray-100 animate-pulse" />
            )}
        </div>
    );
};



type Props = {
    images: string[];
    className?: string;
};

/**
 * ImageWithFallback
 * Обёртка для next/image: переключает src на локальный fallback при ошибке загрузки.
 * - Требует, чтобы /public/images/fallback.png существовал
 * - Использует loading="lazy" и decoding="async"
 */
const ImageWithFallback: React.FC<
    React.ComponentProps<typeof Image> & { fallbackSrc?: string }
> = ({ src, alt, fallbackSrc = "/images/fallback.png", ...rest }) => {
    const [currentSrc, setCurrentSrc] = useState<string | typeof src>(String(src));

    // если src изменился извне — обновим
    useEffect(() => {
        setCurrentSrc(String(src));
    }, [src]);

    return (
        <LazyImage
            src={currentSrc}
            alt={alt ?? ""}
            // lazy by default (unless priority=true)
            loading={rest["priority"] ? "eager" : "lazy"}
            decoding="async"
            onError={() => {
                // переключаемся на локальный плейсхолдер
                setCurrentSrc(fallbackSrc);
            }}
            {...(rest as any)}
        />
    );
};

export const ParallaxScroll: React.FC<Props> = ({ images, className }) => {
    // реф для скроллируемого контейнера
    const gridRef = useRef<HTMLDivElement | null>(null);

    const { scrollYProgress } = useScroll({
        container: gridRef,
        offset: ["start start", "end start"],
    });

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -200]);
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 200]);
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -200]);

    // мемоизируем разбиение на 3 части, чтобы не пересчитывать каждый рендер
    const [firstPart, secondPart, thirdPart] = useMemo(() => {
        const third = Math.ceil(images.length / 3) || 0;
        const firstPart = images.slice(0, third);
        const secondPart = images.slice(third, 2 * third);
        const thirdPart = images.slice(2 * third);
        return [firstPart, secondPart, thirdPart];
    }, [images]);

    const makeAlt = (src: string, idx: number) => {
        try {
            const u = new URL(src);
            const name = u.pathname.split("/").pop() ?? `image-${idx}`;
            // простая декодировка имени файла
            return decodeURIComponent(name);
        } catch {
            return `image-${idx}`;
        }
    };

    return (
        <div
            ref={gridRef}
            className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
            role="region"
            aria-label="Галерея меню"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-10xl mx-auto gap-10 py-40 px-10">
                <div className="grid gap-10">
                    {firstPart.map((el, idx) => (
                        <motion.div style={{ y: translateFirst }} key={"grid-1-" + idx}>
                            <div className="relative h-80 w-full rounded-lg overflow-hidden">
                                {/* Используем ImageWithFallback.
                    - width/height оставил чтобы next/image мог оптимизировать.
                    - sizes важен для правильного srcset.
                */}
                                <ImageWithFallback
                                    src={el}
                                    alt={makeAlt(el, idx)}
                                    width={800}
                                    height={600}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="h-full w-full object-cover object-left-top"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-10">
                    {secondPart.map((el, idx) => (
                        <motion.div style={{ y: translateSecond }} key={"grid-2-" + idx}>
                            <div className="relative h-[90px] md:h-96 w-full rounded-lg overflow-hidden">
                                <ImageWithFallback
                                    src={el}
                                    alt={makeAlt(el, idx + firstPart.length)}
                                    width={800}
                                    height={600}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="h-full w-full object-cover object-left-top"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-10">
                    {thirdPart.map((el, idx) => (
                        <motion.div style={{ y: translateThird }} key={"grid-3-" + idx}>
                            <div className="relative h-80 w-full rounded-lg overflow-hidden">
                                <ImageWithFallback
                                    src={el}
                                    alt={makeAlt(el, idx + firstPart.length + secondPart.length)}
                                    width={700}
                                    height={500}
                                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                                    className="h-full w-full object-cover object-left-top"
                                />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ParallaxScroll;
