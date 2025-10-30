"use client"

import React, { useEffect, useRef, useState, useCallback } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function CustomCursor() {
    const isCoarse = typeof window !== "undefined" && window.matchMedia && window.matchMedia("(pointer: coarse)").matches
    if (isCoarse) return null

    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

     const springConfig = { damping: 25, stiffness: 300 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    const [tooltip, setTooltip] = useState<string>("")
    const [isInside, setIsInside] = useState(false) // cursor inside viewport
    const hideTimeoutRef = useRef<number | null>(null)

    useEffect(() => {
        document.body.classList.add("has-custom-cursor")
        return () => {
            document.body.classList.remove("has-custom-cursor")
            if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current)
        }
    }, [])

    const onMove = useCallback((e: MouseEvent) => {
        if (typeof e.clientX !== "number" || typeof e.clientY !== "number") return

        cursorX.set(e.clientX)
        cursorY.set(e.clientY)

        setIsInside(true)
        if (hideTimeoutRef.current) {
            window.clearTimeout(hideTimeoutRef.current)
            hideTimeoutRef.current = null
        }

        const target = e.target as HTMLElement | null
        const title =
            target?.getAttribute?.("data-tooltip") ??
            target?.closest?.("[data-tooltip]")?.getAttribute?.("data-tooltip") ??
            ""
        setTooltip(title || "")
    }, [cursorX, cursorY])

    const onLeave = useCallback(() => {
        // плавно скрываем курсор (scale -> 0.3, opacity -> 0)
        // но даём небольшой запас времени прежде чем окончательно считать спрятанным
        // чтобы избежать дерганья при быстрых событиях
        if (hideTimeoutRef.current) window.clearTimeout(hideTimeoutRef.current)
        // ставим таймаут — после него isInside=false (анимация выполнится через animate props)
        hideTimeoutRef.current = window.setTimeout(() => {
            setIsInside(false)
            hideTimeoutRef.current = null
        }, 40) // небольшая задержка, можно уменьшить/увеличить
    }, [])

    useEffect(() => {
        // mouseleave срабатывает когда уходит за границы окна
        window.addEventListener("mousemove", onMove)
        window.addEventListener("mouseleave", onLeave)
        // дополнительный перехват: mouseout когда relatedTarget === null (уход)
        const onOut = (e: MouseEvent) => {
            const rel = (e as any).relatedTarget
            if (!rel) onLeave()
        }
        window.addEventListener("mouseout", onOut)

        // скрываем курсор при потере фокуса/видимости страницы
        const onBlurOrHidden = () => onLeave()
        window.addEventListener("blur", onBlurOrHidden)
        document.addEventListener("visibilitychange", () => {
            if (document.visibilityState !== "visible") onLeave()
        })

        return () => {
            window.removeEventListener("mousemove", onMove)
            window.removeEventListener("mouseleave", onLeave)
            window.removeEventListener("mouseout", onOut)
            window.removeEventListener("blur", onBlurOrHidden)
        }
    }, [onMove, onLeave])

    // Render always so we can animate hide/show smoothly.
    // translate offsets center the cursor graphic (half of size).
    return (
        <>
            {/* глобальный стиль: включается классом на body */}
            <style jsx global>{`
        /* скрываем системный курсор при наличии класса; исключаем вводимые элементы */
        .has-custom-cursor * {
          cursor: none !important;
        }
        /* но оставим видимый курсор в интерактивных полях при фокусе */

      `}</style>

            {/* Курсор (svg) */}
            <motion.div
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                // анимация появления/скрытия: scale + opacity
                animate={{
                    opacity: isInside ? 1 : 0,
                    scale: isInside ? 1 : 0.28,
                }}
                transition={{ opacity: { duration: 0.18 }, scale: { duration: 0.25, ease: [0.22, 1, 0.36, 1] } }}
            >
                <div style={{ translate: "-14px -14px" }}>
                    <svg width="28" height="28" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
                        <path
                            d="M4 4L14.76 26.63L17.44 16.76L27.31 14.08L4 4Z"
                            fill="white"
                            stroke="rgba(0,0,0,0.8)"
                            strokeWidth="1.2"
                            strokeLinejoin="round"
                        />
                    </svg>
                </div>
            </motion.div>

            {/* Tooltip (идёт рядом с курсором) */}
            {tooltip && (
                <motion.div
                    className="fixed top-0 left-0 px-3 py-2 bg-card/95 backdrop-blur-sm border border-border rounded-lg text-xs text-foreground pointer-events-none z-[9999] whitespace-nowrap shadow-lg"
                    style={{
                        x: cursorXSpring,
                        y: cursorYSpring,
                    }}
                    initial={{ opacity: 0, scale: 0.85 }}
                    animate={{ opacity: isInside ? 1 : 0, scale: isInside ? 1 : 0.85 }}
                    transition={{ opacity: { duration: 0.12 }, scale: { duration: 0.15 } }}
                >
                    <div style={{ transform: "translate(22px, -50%)" }}>{tooltip}</div>
                </motion.div>
            )}

        </>
    )
}
