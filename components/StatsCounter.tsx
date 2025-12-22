'use client'

import { useState, useEffect, useRef } from 'react'

interface StatItem {
  value: number
  suffix: string
  label: string
  isStatic?: boolean // For "24/7" which doesn't need counting
  staticText?: string // For static items like "24/7"
}

interface StatsCounterProps {
  items: StatItem[]
}

export default function StatsCounter({ items }: StatsCounterProps) {
  const [counts, setCounts] = useState<Record<number, number>>({})
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showStatic, setShowStatic] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (hasAnimated) return // Already animated, don't run again

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)
            
            // Show static items with fade-in
            setShowStatic(true)
            
            // Initialize counts
            const initialCounts: Record<number, number> = {}
            items.forEach((_, index) => {
              if (!items[index].isStatic) {
                initialCounts[index] = 0
              }
            })
            setCounts(initialCounts)

            // Animate each counter
            items.forEach((item, index) => {
              if (item.isStatic) {
                // For static items, fade-in is handled by showStatic state
                return
              }

              const duration = 2000 // 2 seconds
              const startTime = Date.now()

              const animate = () => {
                const elapsed = Date.now() - startTime
                const progress = Math.min(elapsed / duration, 1)
                
                // Easing function for smooth animation (ease-out)
                const easeOut = 1 - Math.pow(1 - progress, 3)
                const currentValue = Math.floor(item.value * easeOut)

                setCounts((prev) => ({
                  ...prev,
                  [index]: currentValue,
                }))

                if (progress < 1) {
                  requestAnimationFrame(animate)
                } else {
                  // Ensure final value is set
                  setCounts((prev) => ({
                    ...prev,
                    [index]: item.value,
                  }))
                }
              }

              requestAnimationFrame(animate)
            })
          }
        })
      },
      {
        threshold: 0.3, // Trigger when 30% of the element is visible
        rootMargin: '0px',
      }
    )

    if (containerRef.current) {
      observer.observe(containerRef.current)
    }

    return () => {
      if (containerRef.current) {
        observer.unobserve(containerRef.current)
      }
    }
  }, [hasAnimated, items])

  return (
    <div
      ref={containerRef}
      className="grid grid-cols-3 gap-6 max-[768px]:gap-4 max-[427px]:grid-cols-1 mt-20 max-w-3xl w-full mx-auto animate-fade-in-up"
      style={{ animationDelay: "0.4s" }}
    >
      {items.map((item, index) => (
        <div
          key={index}
          className="rounded-2xl p-6 border border-white/10 bg-white/5 backdrop-blur-lg hover-lift shadow-xl shadow-black/40"
        >
          <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">
            {item.isStatic ? (
              <span 
                className={showStatic ? 'opacity-100 transition-opacity duration-800' : 'opacity-0'}
                style={{ transition: 'opacity 0.8s ease-in' }}
              >
                {item.staticText || `${item.value}${item.suffix}`}
              </span>
            ) : (
              <span>
                {counts[index] !== undefined ? counts[index] : 0}{item.suffix}
              </span>
            )}
          </div>
          <div className="text-sm font-semibold text-white/90">{item.label}</div>
        </div>
      ))}
    </div>
  )
}

