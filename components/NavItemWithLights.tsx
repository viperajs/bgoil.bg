"use client"

import React from "react"
import Link from "next/link"

/**
 * NavItemWithLights Component
 * 
 * A navigation item component with optional Christmas lights decoration.
 * 
 * @param children - The nav item content (usually text)
 * @param href - Navigation link URL
 * @param isActive - Whether this nav item is currently active
 * @param enabled - Enable/disable Christmas lights (default: true)
 * @param lightPosition - Position of lights: 'top' | 'corner' (default: 'top')
 * @param animationSpeed - Animation speed: 'slow' | 'normal' | 'fast' (default: 'slow')
 * 
 * Usage:
 * <NavItemWithLights href="/" isActive={true} enabled={true} lightPosition="top">
 *   Начало
 * </NavItemWithLights>
 */
interface NavItemWithLightsProps {
  children: React.ReactNode
  href: string
  isActive?: boolean
  enabled?: boolean
  lightPosition?: "top" | "corner"
  animationSpeed?: "slow" | "normal" | "fast"
  className?: string
  onClick?: () => void
}

// Christmas light colors: warm white, soft yellow, red, soft orange
const LIGHT_COLORS = [
  { bg: "bg-yellow-200", glow: "rgba(254, 240, 138, 0.7)" },
  { bg: "bg-white", glow: "rgba(255, 255, 255, 0.8)" },
  { bg: "bg-red-400", glow: "rgba(248, 113, 113, 0.7)" },
  { bg: "bg-orange-300", glow: "rgba(253, 186, 116, 0.7)" },
]

const LIGHT_COUNT = 4 // Smaller number of lights for nav items

export default function NavItemWithLights({
  children,
  href,
  isActive = false,
  enabled = true,
  lightPosition = "top",
  animationSpeed = "slow",
  className = "",
  onClick,
}: NavItemWithLightsProps) {
  // Map animation speed to duration
  const animationDurations = {
    slow: "duration-[4s]",
    normal: "duration-[2.5s]",
    fast: "duration-[1.5s]",
  }

  // Generate lights with staggered delays
  const lights = Array.from({ length: LIGHT_COUNT }, (_, i) => {
    const colorIndex = i % LIGHT_COLORS.length
    const color = LIGHT_COLORS[colorIndex]
    const delay = (i * 0.2) % 2
    
    return {
      id: i,
      color,
      delay,
    }
  })

  return (
    <Link
      href={href}
      onClick={onClick}
      className={`relative inline-flex flex-col items-center gap-2 ${className}`}
    >
      {/* Top lights decoration */}
      {enabled && lightPosition === "top" && (
        <div 
          className="absolute -top-2 sm:-top-3 left-1/2 -translate-x-1/2 flex items-center justify-center gap-1 sm:gap-1.5 pointer-events-none"
          aria-hidden="true"
        >
          {/* Subtle connecting wire */}
          <div className="absolute top-1/2 left-0 right-0 h-[1px] bg-gradient-to-r from-transparent via-white/30 to-transparent" />
          
          {/* Small lights */}
          {lights.map((light) => (
            <div
              key={light.id}
              className={`relative ${light.color.bg} w-1.5 h-1.5 rounded-full opacity-70 blur-[1px] ${animationDurations[animationSpeed]} animate-pulse`}
              style={{
                animationDelay: `${light.delay}s`,
                boxShadow: `0 0 4px ${light.color.glow}, 0 0 8px ${light.color.glow}`,
              }}
            />
          ))}
        </div>
      )}

      {/* Corner light decoration */}
      {enabled && lightPosition === "corner" && (
        <>
          {/* Top-right corner */}
          <div 
            className="absolute -top-1 -right-1 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className={`relative ${LIGHT_COLORS[1].bg} w-2 h-2 rounded-full opacity-80 blur-[1px] ${animationDurations[animationSpeed]} animate-pulse`}
              style={{
                animationDelay: "0s",
                boxShadow: `0 0 6px ${LIGHT_COLORS[1].glow}, 0 0 12px ${LIGHT_COLORS[1].glow}`,
              }}
            />
          </div>
          
          {/* Top-left corner */}
          <div 
            className="absolute -top-1 -left-1 pointer-events-none"
            aria-hidden="true"
          >
            <div
              className={`relative ${LIGHT_COLORS[2].bg} w-2 h-2 rounded-full opacity-80 blur-[1px] ${animationDurations[animationSpeed]} animate-pulse`}
              style={{
                animationDelay: "1s",
                boxShadow: `0 0 6px ${LIGHT_COLORS[2].glow}, 0 0 12px ${LIGHT_COLORS[2].glow}`,
              }}
            />
          </div>
        </>
      )}

      {/* Nav item content */}
      <span className="relative z-10">
        {children}
      </span>
      
      {/* Active indicator */}
      {isActive && (
        <span className="block w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_12px_rgba(255,59,59,0.8)]"></span>
      )}
    </Link>
  )
}

