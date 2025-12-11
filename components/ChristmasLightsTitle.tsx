"use client"

import React from "react"

/**
 * ChristmasLightsTitle Component
 * 
 * A reusable component that wraps a title with a subtle glow effect around the letters.
 * The lights form a halo around the text edges, creating an elegant, premium look.
 * 
 * @param children - The title text/content to wrap
 * @param enabled - Enable/disable Christmas lights glow (default: true)
 * @param glowIntensity - Controls glow intensity: 'subtle' | 'medium' | 'strong' (default: 'medium')
 * @param animationSpeed - Animation speed: 'slow' | 'normal' | 'fast' (default: 'normal')
 * 
 * Usage:
 * <ChristmasLightsTitle enabled={true} glowIntensity="medium">
 *   BG OIL
 * </ChristmasLightsTitle>
 * 
 * Configuration:
 * - To disable: Set enabled={false}
 * - To adjust glow: Change glowIntensity prop ('subtle' | 'medium' | 'strong')
 * - To adjust animation: Change animationSpeed prop ('slow' | 'normal' | 'fast')
 */
interface ChristmasLightsTitleProps {
  children: React.ReactNode
  enabled?: boolean
  glowIntensity?: "subtle" | "medium" | "strong"
  animationSpeed?: "slow" | "normal" | "fast"
}

// Christmas light colors: warm white, soft yellow, red, soft orange
// Reduced opacity for subtlety
const LIGHT_COLORS = [
  { glow: "rgba(254, 240, 138, 0.4)", // soft yellow
    pulse: "rgba(254, 240, 138, 0.6)" },
  { glow: "rgba(255, 255, 255, 0.5)", // warm white
    pulse: "rgba(255, 255, 255, 0.7)" },
  { glow: "rgba(248, 113, 113, 0.35)", // red
    pulse: "rgba(248, 113, 113, 0.55)" },
  { glow: "rgba(253, 186, 116, 0.4)", // soft orange
    pulse: "rgba(253, 186, 116, 0.6)" },
]

export default function ChristmasLightsTitle({
  children,
  enabled = true,
  glowIntensity = "medium",
  animationSpeed = "normal",
}: ChristmasLightsTitleProps) {
  if (!enabled) {
    return <>{children}</>
  }

  // Map glow intensity to shadow configurations
  const glowConfigs = {
    subtle: {
      // Multiple text-shadows for subtle halo effect
      shadows: [
        `0 0 10px ${LIGHT_COLORS[1].glow}`,
        `0 0 20px ${LIGHT_COLORS[0].glow}`,
        `0 0 30px ${LIGHT_COLORS[2].glow}`,
        `0 0 40px ${LIGHT_COLORS[3].glow}`,
      ],
      particleSize: "2px",
      particleOpacity: 0.5,
    },
    medium: {
      shadows: [
        `0 0 15px ${LIGHT_COLORS[1].glow}`,
        `0 0 30px ${LIGHT_COLORS[0].glow}`,
        `0 0 45px ${LIGHT_COLORS[2].glow}`,
        `0 0 60px ${LIGHT_COLORS[3].glow}`,
        `0 0 80px ${LIGHT_COLORS[1].glow}`,
      ],
      particleSize: "3px",
      particleOpacity: 0.6,
    },
    strong: {
      shadows: [
        `0 0 20px ${LIGHT_COLORS[1].glow}`,
        `0 0 40px ${LIGHT_COLORS[0].glow}`,
        `0 0 60px ${LIGHT_COLORS[2].glow}`,
        `0 0 80px ${LIGHT_COLORS[3].glow}`,
        `0 0 100px ${LIGHT_COLORS[1].glow}`,
        `0 0 120px ${LIGHT_COLORS[0].glow}`,
      ],
      particleSize: "4px",
      particleOpacity: 0.7,
    },
  }

  // Map animation speed to duration
  const animationDurations = {
    slow: "duration-[4s]",
    normal: "duration-[3s]",
    fast: "duration-[2s]",
  }

  const config = glowConfigs[glowIntensity]

  // Generate strategic particle positions around text outline
  // These represent key points where lights should appear (corners, edges)
  // Using percentage and calc for responsive positioning
  const particlePositions = [
    // Top outline - spread across width
    { x: "5%", y: "-0.15em", color: 0, delay: 0 },
    { x: "20%", y: "-0.12em", color: 1, delay: 0.3 },
    { x: "35%", y: "-0.15em", color: 2, delay: 0.6 },
    { x: "50%", y: "-0.12em", color: 3, delay: 0.9 },
    { x: "65%", y: "-0.15em", color: 0, delay: 1.2 },
    { x: "80%", y: "-0.12em", color: 1, delay: 1.5 },
    { x: "95%", y: "-0.15em", color: 2, delay: 1.8 },
    
    // Bottom outline
    { x: "10%", y: "calc(100% + 0.1em)", color: 1, delay: 0.4 },
    { x: "30%", y: "calc(100% + 0.12em)", color: 2, delay: 0.7 },
    { x: "50%", y: "calc(100% + 0.1em)", color: 3, delay: 1.0 },
    { x: "70%", y: "calc(100% + 0.12em)", color: 0, delay: 1.3 },
    { x: "90%", y: "calc(100% + 0.1em)", color: 1, delay: 1.6 },
    
    // Left side - vertical spacing
    { x: "-0.1em", y: "15%", color: 2, delay: 0.2 },
    { x: "-0.12em", y: "40%", color: 3, delay: 0.5 },
    { x: "-0.1em", y: "65%", color: 0, delay: 0.8 },
    { x: "-0.12em", y: "90%", color: 1, delay: 1.1 },
    
    // Right side - vertical spacing
    { x: "calc(100% + 0.1em)", y: "20%", color: 1, delay: 0.4 },
    { x: "calc(100% + 0.12em)", y: "45%", color: 2, delay: 0.7 },
    { x: "calc(100% + 0.1em)", y: "70%", color: 3, delay: 1.0 },
    { x: "calc(100% + 0.12em)", y: "95%", color: 0, delay: 1.3 },
  ]

  return (
    <span className="relative inline-block">
      {/* Text with multi-layered glow shadow */}
      <span
        className="relative z-10 inline-block"
        style={{
          textShadow: config.shadows.join(", "),
          filter: "drop-shadow(0 0 2px rgba(255, 255, 255, 0.3))",
        }}
      >
        {children}
      </span>

      {/* Subtle particles positioned around text outline */}
      <span className="absolute inset-0 pointer-events-none" aria-hidden="true">
        {particlePositions.map((particle, index) => {
          const color = LIGHT_COLORS[particle.color]
          
          return (
            <span
              key={index}
              className={`absolute ${animationDurations[animationSpeed]} animate-pulse`}
              style={{
                left: particle.x,
                top: particle.y,
                width: config.particleSize,
                height: config.particleSize,
                borderRadius: "50%",
                backgroundColor: color.glow,
                opacity: config.particleOpacity,
                boxShadow: `0 0 ${config.particleSize === "2px" ? "4px" : config.particleSize === "3px" ? "6px" : "8px"} ${color.pulse}`,
                transform: "translate(-50%, -50%)",
                animationDelay: `${particle.delay}s`,
              }}
            />
          )
        })}
      </span>

      {/* Additional soft halo layer - subtle ambient glow around text */}
      <span
        className="absolute inset-0 pointer-events-none -z-10"
        aria-hidden="true"
        style={{
          filter: `blur(${glowIntensity === "subtle" ? "15px" : glowIntensity === "medium" ? "25px" : "35px"})`,
          opacity: glowIntensity === "subtle" ? 0.2 : glowIntensity === "medium" ? 0.25 : 0.3,
          background: `radial-gradient(ellipse 80% 60% at center, ${LIGHT_COLORS[0].glow} 0%, ${LIGHT_COLORS[1].glow} 25%, transparent 65%)`,
          transform: "scale(1.15)",
        }}
      />
    </span>
  )
}
