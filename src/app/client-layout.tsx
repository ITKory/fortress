"use client"

import type React from "react"

import { Suspense } from "react"
import { CustomCursor } from "@/src/components/custom-cursor";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode
}) {
    return (
        <>
            <CustomCursor/>
            <Suspense fallback={null}>{children}</Suspense>
        </>
    )
}
