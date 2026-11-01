"use client"

import React, { useEffect, useState } from "react"
import { motion, useMotionValue, useSpring } from "motion/react"

export function CustomCursor() {
    const cursorX = useMotionValue(-100)
    const cursorY = useMotionValue(-100)

    const springConfig = { damping: 25, stiffness: 300 }
    const cursorXSpring = useSpring(cursorX, springConfig)
    const cursorYSpring = useSpring(cursorY, springConfig)

    const [enabled, setEnabled] = useState(false)
    const [tooltip, setTooltip] = useState("")
    const [isInside, setIsInside] = useState(false)
    useEffect(() => {
        const media = window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)")
        const syncPreference = () => {
            setEnabled(media.matches)
            setIsInside(false)
            setTooltip("")
        }
        syncPreference()
        media.addEventListener("change", syncPreference)
        return () => media.removeEventListener("change", syncPreference)
    }, [])

    useEffect(() => {
        document.body.classList.toggle("has-custom-cursor", enabled && isInside)
        return () => document.body.classList.remove("has-custom-cursor")
    }, [enabled, isInside])

    useEffect(() => {
        if (!enabled) return

        const onLeave = () => {
            setIsInside(false)
            setTooltip("")
        }
        const onMove = (event: PointerEvent) => {
            if (event.pointerType !== "mouse") {
                onLeave()
                return
            }

            cursorX.set(event.clientX)
            cursorY.set(event.clientY)
            const target = event.target instanceof Element ? event.target : null
            if (target?.closest("input, textarea, select, [contenteditable]:not([contenteditable='false'])")) {
                onLeave()
                return
            }

            setIsInside(true)
            setTooltip(target?.closest("[data-tooltip]")?.getAttribute("data-tooltip") ?? "")
        }
        const onOut = (event: PointerEvent) => {
            if (!event.relatedTarget) onLeave()
        }
        const onVisibilityChange = () => {
            if (document.visibilityState !== "visible") onLeave()
        }

        window.addEventListener("pointermove", onMove)
        window.addEventListener("pointerout", onOut)
        window.addEventListener("blur", onLeave)
        document.addEventListener("visibilitychange", onVisibilityChange)

        return () => {
            window.removeEventListener("pointermove", onMove)
            window.removeEventListener("pointerout", onOut)
            window.removeEventListener("blur", onLeave)
            document.removeEventListener("visibilitychange", onVisibilityChange)
        }
    }, [enabled, cursorX, cursorY])

    if (!enabled) return null

    return (
        <>
            <style jsx global>{`
        .has-custom-cursor,
        .has-custom-cursor * {
          cursor: none !important;
        }
      `}</style>

            <motion.div
                aria-hidden="true"
                className="fixed top-0 left-0 pointer-events-none z-[9999]"
                style={{
                    x: cursorXSpring,
                    y: cursorYSpring,
                }}
                initial={false}
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

            {tooltip && (
                <motion.div
                    aria-hidden="true"
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
