"use client"

import Link from "next/link"
import dynamic from "next/dynamic"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Phone, ArrowRight, Sparkles } from "lucide-react"
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
      { threshold: 0.3 }
    )

    if (statsRef.current) {
      observer.observe(statsRef.current)
    }

    return () => observer.disconnect()
  }, [hasAnimated])
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20 bg-[#0a0a0f]">
      {/* Animated Background */}
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
        {/* Gradient Overlay - добавя тъмен overlay за по-добра четимост */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#0a0a0f]/60 via-[#111827]/40 to-transparent"></div>
        {/* Soft fade into body background */}
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-b from-transparent via-[#0a0a0f]/80 to-[#0a0a0f]"></div>
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/20 rounded-full mb-6 animate-fade-in-down shadow-lg">
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse" />
            <span className="text-sm font-semibold text-white">24/7 Обслужване</span>
          </div>

          <div className="space-y-6">
            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-balance leading-tight">
              <span className="block text-white drop-shadow-[0_4px_12px_rgba(0,0,0,0.8)] mb-3">
                BG OIL
              </span>
            </h1>
            
            <p className="text-2xl md:text-3xl lg:text-4xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.6)] mb-4">
              {companyInfo.slogan}
            </p>
            
            <p className="text-lg md:text-xl lg:text-2xl text-white/95 max-w-3xl mx-auto leading-relaxed drop-shadow-[0_2px_6px_rgba(0,0,0,0.5)] px-4">
              {companyInfo.description}
            </p>
          </div>

          {/* Quick Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-10 animate-fade-in-up" style={{ animationDelay: "0.2s" }}>
            <Button 
              size="lg" 
              asChild 
              className="w-full sm:w-auto bg-gradient-primary hover:opacity-90 text-white border-0 text-lg px-8 py-7 hover-lift shadow-2xl hover:shadow-primary/50 transition-all duration-300 group font-bold"
            >
              <Link href="/products" className="flex items-center space-x-3">
                <Fuel className="w-6 h-6 group-hover:rotate-12 transition-transform duration-300" />
                <span>Горива</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>

            

            <Button
              size="lg"
              variant="outline"
              asChild
              className="w-full sm:w-auto bg-white text-primary hover:bg-white/95 hover:text-primary-dark text-lg px-8 py-7 hover-lift shadow-xl transition-all duration-300 group font-bold"
            >
              <Link href="/contact" className="flex items-center space-x-3">
                <Phone className="w-6 h-6 group-hover:scale-110 transition-transform duration-300" />
                <span>Контакти</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" />
              </Link>
            </Button>
          </div>

          {/* Discount Banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="mt-8 animate-fade-in-up" style={{ animationDelay: "0.3s" }}>
              <div className="inline-flex items-center space-x-3 px-6 py-4 bg-gradient-to-r from-green-500/20 via-green-400/20 to-green-500/20 rounded-2xl backdrop-blur-md shadow-2xl shadow-green-500/20 hover-lift transition-all duration-300">
                <Sparkles className="w-5 h-5 text-green-300 animate-pulse" />
                <span className="text-lg md:text-xl font-bold text-white drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  {discountBanner.message}
                </span>
                <Sparkles className="w-5 h-5 text-green-300 animate-pulse" style={{ animationDelay: "0.5s" }} />
              </div>
            </div>
          )}

          {/* Stats - по-видими */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-6 max-[768px]:gap-4 max-[427px]:grid-cols-1 mt-20 max-w-3xl w-full mx-auto animate-fade-in-up"
            style={{ animationDelay: "0.4s" }}
          >
            <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg hover-lift shadow-xl shadow-black/40">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg">24/7</div>
              <div className="text-sm font-semibold text-white/90">Работно време</div>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg hover-lift shadow-xl shadow-black/40 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg transition-all duration-300">
                <span className="inline-block animate-pulse-scale">{qualityCount}</span>%
              </div>
              <div className="text-sm font-semibold text-white/90">Качество</div>
            </div>
            <div className="rounded-2xl p-6 bg-white/5 backdrop-blur-lg hover-lift shadow-xl shadow-black/40 transform transition-all duration-500 hover:scale-105">
              <div className="text-4xl md:text-5xl font-black text-white mb-2 drop-shadow-lg transition-all duration-300">
                <span className="inline-block animate-pulse-scale">{yearsCount}</span>+
              </div>
              <div className="text-sm font-semibold text-white/90">Години опит</div>
            </div>
          </div>
        </div>
      </div>

      
    </section>
  )
}