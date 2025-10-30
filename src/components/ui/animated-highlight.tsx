"use client"

import type React from "react"

import { motion } from "motion/react"
import { useInView } from "motion/react"
import { useRef } from "react"

interface AnimatedHighlightProps {
  children: React.ReactNode
  className?: string
}

export function AnimatedHighlight({ children, className = "" }: AnimatedHighlightProps) {
  const ref = useRef(null)
  const isInView = useInView(ref, { once: false, amount: 0.5 })

  return (
    <motion.div
      ref={ref}
      className={`relative inline-block ${className}`}
      initial={{ opacity: 1 }}
      animate={isInView ? { opacity: 1 } : { opacity: 1 }}
    >
      {children}
      <motion.div
        className="absolute -inset-2 border-2 border-primary rounded-lg pointer-events-none"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={
          isInView
            ? {
                opacity: [0, 1, 1, 0],
                scale: [0.95, 1.02, 1.02, 1.05],
              }
            : { opacity: 0, scale: 0.95 }
        }
        transition={{
          duration: 2,
          repeat: Number.POSITIVE_INFINITY,
          repeatDelay: 1,
        }}
      />
    </motion.div>
  )
}
