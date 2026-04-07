"use client"

import { useRef, useCallback, useEffect, useState } from "react"

interface Tilt3DCardProps {
  children: React.ReactNode
  className?: string
  intensity?: number
  glowColor?: string
}

export default function Tilt3DCard({
  children,
  className = "",
  intensity = 10,
  glowColor = "rgba(239,68,68,0.12)",
}: Tilt3DCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const [isTouchDevice, setIsTouchDevice] = useState(false)

  useEffect(() => {
    setIsTouchDevice(window.matchMedia("(hover: none)").matches)
  }, [])

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchDevice) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(900px) rotateX(${-y * intensity}deg) rotateY(${x * intensity}deg) scale3d(1.025, 1.025, 1.025)`
    el.style.boxShadow = `
      ${x * 20}px ${y * 20}px 40px rgba(0,0,0,0.4),
      0 0 40px ${glowColor},
      inset 0 1px 0 rgba(255,255,255,0.07)
    `
  }, [intensity, glowColor, isTouchDevice])

  const handleMouseLeave = useCallback(() => {
    if (isTouchDevice) return
    const el = cardRef.current
    if (!el) return
    el.style.transform = "perspective(900px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    el.style.boxShadow = ""
  }, [isTouchDevice])

  return (
    <div
      ref={cardRef}
      className={className}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.18s ease-out, box-shadow 0.4s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {children}
    </div>
  )
}
