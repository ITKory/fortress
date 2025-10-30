"use client"

import React, { Suspense, useEffect, useMemo, useRef, useState } from "react"
import { Canvas, useThree } from "@react-three/fiber"
import {
    Float,
    Environment,
    ContactShadows,
    Html,
    useProgress,
    useGLTF,
} from "@react-three/drei"

/* -------------------- Loader UI -------------------- */
function Loader() {
    const { progress } = useProgress()
    return (
        <Html center>
            <div style={{
                padding: 12,
                background: "rgba(255,255,255,0.92)",
                color: "#222",
                borderRadius: 8,
                fontSize: 13,
                minWidth: 140,
                textAlign: "center",
                boxShadow: "0 6px 18px rgba(0,0,0,0.08)",
            }}>
                Загрузка 3D… {Math.round(progress)}%
            </div>
        </Html>
    )
}

/* -------------------- Utility: preload all models -------------------- */
/* список моделей — вынес для удобства и preload */
const MODEL_URLS = [
    "/models/model-1.glb",
    "/models/model-3.glb",
    "/models/model-6.glb",
    "/models/model-4.glb",
    "/models/model-10.glb",
    "/models/model-7.glb",
]

/* Вызовите useGLTF.preload для каждого URL заранее (можно выполнить в root приложения) */
MODEL_URLS.forEach((u) => {
    // безопасный вызов — if server-side, useGLTF may not exist; but this runs on client
    try {
        // @ts-ignore
        useGLTF.preload?.(u)
    } catch {
        // noop
    }
})

/* -------------------- FloatingModel (оптимизирован) -------------------- */
type ModelProps = {
    url: string
    position?: [number, number, number]
    scale?: number
    rotation?: [number, number, number]
    topDown?: boolean
}

/**
 * FloatingModel: memoized, clones scene via useMemo, disables expensive shadow flags where not needed,
 * and disables float on small screens.
 */
/**
 * Исправленный FloatingModel:
 * - вычисления transform выполняются один раз (useMemo)
 * - нет дублирования topDownPosition/Rotation в разных местах
 * - поддержка prefers-reduced-motion для отключения Float на мобайле/режиме уменьшенного движения
 */
const FloatingModel: React.FC<ModelProps> = React.memo(function FloatingModel({
                                                                                  url,
                                                                                  position = [0, 0, 0],
                                                                                  scale = 1,
                                                                                  rotation = [0, 0, 0],
                                                                                  topDown = true,
                                                                              }) {
    const gltf = useGLTF(url, true)

    // Клонируем сцену один раз
    const scene = useMemo(() => {
        const cloned = gltf.scene.clone(true)
        cloned.traverse((obj: any) => {
            if (obj.isMesh) {
                obj.castShadow = false
                obj.receiveShadow = false
            }
        })
        return cloned
    }, [gltf])

    // вычисляем итоговую позицию и ротацию только один раз
    const transform = useMemo(() => {
        const rot: number[] = topDown
            ? [-Math.PI / 2, rotation[1] ?? 0, rotation[2] ?? 0]
            : rotation

        const pos: number[] = topDown
            ? [position[0], position[1] + 0.06, position[2]]
            : position

        return { position: pos, rotation: rot }
    }, [topDown, position, rotation])

    // reduced motion / small screens -> без Float
    const [prefersReducedMotion, setPrefersReducedMotion] = useState(false)
    useEffect(() => {
        const mq = window.matchMedia("(prefers-reduced-motion: reduce), (max-width: 640px)")
        const handler = () => setPrefersReducedMotion(mq.matches)
        handler()
        try { mq.addEventListener?.("change", handler) } catch { mq.addListener?.(handler as any) }
        return () => {
            try { mq.removeEventListener?.("change", handler) } catch { mq.removeListener?.(handler as any) }
        }
    }, [])

    if (prefersReducedMotion) {
        return <primitive object={scene} position={transform.position} scale={scale} rotation={transform.rotation} />
    }

    return (
        <Float speed={0.9} rotationIntensity={0.3} floatIntensity={0.45}>
            <primitive object={scene} position={transform.position} scale={scale} rotation={transform.rotation} />
        </Float>
    )
})
FloatingModel.displayName = "FloatingModel"

/* -------------------- Camera initializer -------------------- */
function TopDownCamera() {
    const { camera } = useThree()
    React.useEffect(() => {
        camera.position.set(0, 6.0, 2.2)
        camera.lookAt(0, 0, 0)
        camera.updateProjectionMatrix()
    }, [camera])
    return null
}

/* -------------------- Wrapper: mount Canvas only when visible -------------------- */
export default function Scene3D() {
    const ref = useRef<HTMLDivElement | null>(null)
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        const el = ref.current
        if (!el) return
        const obs = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setMounted(true)
                        obs.disconnect()
                    }
                })
            },
            { threshold: 0.1 }
        )
        obs.observe(el)
        return () => obs.disconnect()
    }, [])

    return (
        <div ref={ref} className="fixed inset-0 -z-10 pointer-events-none" style={{ opacity: 0.55 }}>
            {mounted ? (
                <Canvas
                    // Ограниченный DPR: большой выигрыш на HiDPI
                    dpr={[1, 1.5]}
                    // отключаем antialias (дорого) — можно включить, если нужно качество
                    gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
                    // preserveDrawingBuffer: false — default, хорошо
                    camera={{ position: [0, 6, 2.2], fov: 38 }}
                >
                    <Suspense fallback={<Loader />}>
                        {/* Лёгкое ambient + один directional; избегаем множества точечных светов */}
                        <ambientLight intensity={0.6} />
                        <directionalLight position={[6, 8, 6]} intensity={0.8} />
                        {/* По возможности замените динамические pointLight на environment (baked) */}

                        {/* Модель (пример) — порядок и параметры сохранены, но модели не будут генерировать тени */}
                        <FloatingModel url="/models/model-1.glb" position={[0, 2, 0]} scale={0.45} rotation={[-1, 2, 0.4]} topDown={false} />
                        <FloatingModel url="/models/model-10.glb" position={[2.45, 0.06, -0.4]} rotation={[-0.9, 2.3, 3.0]} scale={9.65}  />
                        <FloatingModel url="/models/model-3.glb" position={[-2.7, 1.38, 0.1]} scale={3.95} rotation={[-1, 2.5, 0.6]} topDown={false} />
                        <FloatingModel url="/models/model-6.glb" position={[-1.05, -0.05, 1.6]} rotation={[-1, 2.5, 0.6]} scale={2.9} topDown={true} />
                        <FloatingModel url="/models/model-7.glb" position={[-2.95, 0.05, 0.9]} scale={2.9} rotation={[-1, 2.5, 0.4]} topDown={false} />
                        <FloatingModel url="/models/model-4.glb" position={[0.95, 0.05, 0.9]} scale={0.8} rotation={[1, 1.4, 0.7]} topDown={true} />

                        {/* ContactShadows — уменьшил width/height/blur для производительности */}
                        <ContactShadows position={[0, -0.6, 0]} opacity={0.45} width={6} height={6} blur={2.0} far={1.2} />

                        {/* Environment — preset HDRI (baked lighting is better) */}
                        <Environment preset="sunset" background={false} />

                        <TopDownCamera />
                    </Suspense>
                </Canvas>
            ) : (
                // placeholder: не рендерим Canvas, пока не в зоне видимости
                <div style={{ width: "100%", height: "100%" }} />
            )}
        </div>
    )
}
