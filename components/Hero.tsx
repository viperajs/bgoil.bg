"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Sparkles, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"

// Динамично зареждане на LightPillar (THREE.js ~600KB) само когато е видим
const LightPillar = dynamic(() => import("./LightPillar"), {
  ssr: false,
  loading: () => null
})

export default function Hero() {
  const [yearsCount, setYearsCount] = useState(0)
  const [qualityCount, setQualityCount] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [showLightPillar, setShowLightPillar] = useState(false)
  const [discountBanner, setDiscountBanner] = useState<{ active: boolean; message: string | null }>({ active: false, message: null })

  // Lazy load LightPillar след кратко забавяне за по-бързо първоначално зареждане
  useEffect(() => {
    // Check if we are on mobile
    if (window.innerWidth < 768) return

    const timer = setTimeout(() => {
      setShowLightPillar(true)
    }, 100) // Зареждаме Three.js 100ms след първоначалното рендериране
    return () => clearTimeout(timer)
  }, [])

  // Fetch discount banner
  useEffect(() => {
    fetch('/api/promo/discount-banner')
      .then(res => res.json())
      .then(data => setDiscountBanner(data))
      .catch(() => setDiscountBanner({ active: false, message: null }))
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting && !hasAnimated) {
            setHasAnimated(true)

            // Animate years count (21)
            let yearsCounter = 0
            const yearsInterval = setInterval(() => {
              yearsCounter += 1
              setYearsCount(yearsCounter)
              if (yearsCounter >= 21) clearInterval(yearsInterval)
            }, 50)

            // Animate quality count (100)
            let qualityCounter = 0
            const qualityInterval = setInterval(() => {
              qualityCounter += 2
              setQualityCount(qualityCounter)
              if (qualityCounter >= 100) {
                setQualityCount(100)
                clearInterval(qualityInterval)
              }
            }, 20)
          }
        })
      },
      { threshold: 0.1 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0a0a0f]">
      {/* Animated Background - PRESERVED AS REQUESTED */}
      <div className="absolute inset-0 z-0">
        <div style={{ width: '100%', height: '100%', position: 'absolute' }}>
          {showLightPillar && (
            <LightPillar
              topColor="#ef4444"
              bottomColor="#000000"
              intensity={0.8}
              rotationSpeed={0.2}
              glowAmount={0.008}
              pillarWidth={2.5}
              pillarHeight={0.3}
              noiseIntensity={0.3}
              mixBlendMode="screen"
            />
          )}
        </div>
        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/80 via-[#0a0a0f]/50 to-[#0a0a0f]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/5 border border-white/10 backdrop-blur-md rounded-full mb-6">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-white/70">24/7 Отворено</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-6xl md:text-8xl lg:text-9xl font-black text-white tracking-tighter leading-none drop-shadow-2xl">
              BG OIL
            </h1>

            <p className="text-2xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/80 to-white/50">
              {companyInfo.slogan}
            </p>

            <p className="text-lg text-white/50 max-w-2xl mx-auto leading-relaxed">
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center pt-8">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary/90 hover:scale-105 transition-all duration-300 font-bold px-10 py-7 text-lg shadow-[0_0_40px_-5px_var(--primary)]"
            >
              <Link href="/products" className="flex items-center gap-3">
                <span>Горива</span>
                <Fuel className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-white/5 border border-white/10 text-white hover:bg-white/10 backdrop-blur-md font-bold px-10 py-7 text-lg hover:border-white/20 transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center gap-3">
                <span>Контакти</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Discount Banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="mt-8 animate-fade-in-up delay-300">
              <div className="inline-block px-6 py-3 bg-green-500/10 border border-green-500/20 rounded-xl backdrop-blur-md">
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-2 md:grid-cols-3 gap-6 mt-24 max-w-4xl mx-auto"
          >
            {[
              { val: "24/7", label: "Работно време" },
              { val: `${qualityCount}%`, label: "Качество" },
              { val: `${yearsCount}+`, label: "Години опит" }
            ].map((stat, i) => (
              <div key={i} className="glass-card p-6 flex flex-col items-center justify-center">
                <span className="text-3xl md:text-5xl font-black text-white mb-1">{stat.val}</span>
                <span className="text-xs font-bold uppercase tracking-widest text-white/30">{stat.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}