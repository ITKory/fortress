"use client"

import type React from "react"
import { useRef, useMemo, useState, useEffect } from "react"
import { motion, useScroll, useTransform } from "motion/react"
import {cn} from "@/src/lib/utils";
type Props = {
    images: string[]
    className?: string
}

const LazyImage: React.FC<{
    src: string
    alt: string
    className?: string
    aspectRatio?: "portrait" | "landscape" | "square"
}> = ({ src, alt, className, aspectRatio = "square" }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [error, setError] = useState(false)

    const heightClass = {
        portrait: "h-[500px]",
        landscape: "h-[300px]",
        square: "h-[400px]",
    }[aspectRatio]

    return (
        <div className={cn("relative w-full overflow-hidden", heightClass, className)}>
            {!error ? (
                <>
                    {!isLoaded && <div className="absolute inset-0 bg-muted animate-pulse" />}
                    <img
                        src={src || "/placeholder.svg"}
                        alt={alt}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className={cn("object-contain transition-opacity duration-300 ", isLoaded ? "opacity-100" : "opacity-0")}
                        onLoad={() => setIsLoaded(true)}
                        onError={() => setError(true)}
                        loading="lazy"
                    />
                </>
            ) : (
                <div className="absolute inset-0 bg-muted flex items-center justify-center text-muted-foreground text-sm">
                    Не удалось загрузить
                </div>
            )}
        </div>
    )
}

const useImageAspectRatio = (src: string): "portrait" | "landscape" | "square" => {
    const [aspectRatio, setAspectRatio] = useState<"portrait" | "landscape" | "square">("square")

    useEffect(() => {
        const img = new window.Image()
        img.src = src
        img.onload = () => {
            const ratio = img.width / img.height
            if (ratio < 0.85) {
                setAspectRatio("portrait")
            } else if (ratio > 1.3) {
                setAspectRatio("landscape")
            } else {
                setAspectRatio("square")
            }
        }
    }, [src])

    return aspectRatio
}

const SmartImage: React.FC<{ src: string; alt: string; index: number }> = ({ src, alt }) => {
    const aspectRatio = useImageAspectRatio(src)
    return <LazyImage src={src} alt={alt} aspectRatio={aspectRatio} />
}

export const ParallaxScroll: React.FC<Props> = ({ images, className }) => {
    const gridRef = useRef<HTMLDivElement | null>(null)

    const { scrollYProgress } = useScroll({
        container: gridRef,
        offset: ["start start", "end start"],
    })

    const translateFirst = useTransform(scrollYProgress, [0, 1], [0, -150])
    const translateSecond = useTransform(scrollYProgress, [0, 1], [0, 150])
    const translateThird = useTransform(scrollYProgress, [0, 1], [0, -150])

    const [firstPart, secondPart, thirdPart] = useMemo(() => {
        const third = Math.ceil(images.length / 3) || 0
        const firstPart = images.slice(0, third)
        const secondPart = images.slice(third, 2 * third)
        const thirdPart = images.slice(2 * third)
        return [firstPart, secondPart, thirdPart]
    }, [images])

    const makeAlt = (src: string, idx: number) => {
        try {
            const u = new URL(src)
            const name = u.pathname.split("/").pop() ?? `image-${idx}`
            return decodeURIComponent(name)
        } catch {
            return `image-${idx}`
        }
    }

    return (
        <div
            ref={gridRef}
            className={cn("h-[40rem] items-start overflow-y-auto w-full", className)}
            role="region"
            aria-label="Галерея меню"
        >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 items-start max-w-7xl mx-auto gap-6 py-20 px-4 md:px-10">
                <div className="grid gap-6">
                    {firstPart.map((el, idx) => (
                        <motion.div style={{ y: translateFirst }} key={"grid-1-" + idx}>
                            <SmartImage src={el} alt={makeAlt(el, idx)} index={idx} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-6">
                    {secondPart.map((el, idx) => (
                        <motion.div style={{ y: translateSecond }} key={"grid-2-" + idx}>
                            <SmartImage src={el} alt={makeAlt(el, idx + firstPart.length)} index={idx + firstPart.length} />
                        </motion.div>
                    ))}
                </div>

                <div className="grid gap-6">
                    {thirdPart.map((el, idx) => (
                        <motion.div style={{ y: translateThird }} key={"grid-3-" + idx}>
                            <SmartImage
                                src={el}
                                alt={makeAlt(el, idx + firstPart.length + secondPart.length)}
                                index={idx + firstPart.length + secondPart.length}
                            />
                        </motion.div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default ParallaxScroll
