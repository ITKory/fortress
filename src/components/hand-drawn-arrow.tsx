"use client"

interface HandDrawnArrowProps {
  rotation?: number
  className?: string
}

export function HandDrawnArrow({ rotation = 0, className = "" }: HandDrawnArrowProps) {
  return (
    <svg
      width="80"
      height="40"
      viewBox="0 0 80 40"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      style={{ transform: `rotate(${rotation}deg)` }}
      className={`pointer-events-none ${className}`}
    >
      <path
        d="M 8 20 Q 25 18, 45 20 T 68 20"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        fill="none"
        className="arrow-line text-accent"
      />
      <path
        d="M 62 15 L 70 20 L 62 25"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
        className="arrow-head text-accent"
      />
    </svg>
  )
}

export default HandDrawnArrow
