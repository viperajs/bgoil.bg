"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Sparkles, ChevronRight } from "lucide-react"
import { useEffect, useState, useRef } from "react"

export default function Hero() {
  const [yearsCount, setYearsCount] = useState(0)
  const [qualityCount, setQualityCount] = useState(0)
  const statsRef = useRef<HTMLDivElement>(null)
  const [hasAnimated, setHasAnimated] = useState(false)
  const [discountBanner, setDiscountBanner] = useState<{ active: boolean; message: string | null }>({ active: false, message: null })

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
            let yearsCounter = 0
            const yearsInterval = setInterval(() => {
              yearsCounter += 1
              setYearsCount(yearsCounter)
              if (yearsCounter >= 21) clearInterval(yearsInterval)
            }, 50)

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
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">
      {/* Animated Aurora Background */}
      <div className="absolute inset-0 z-0">
        {/* Main gradient orbs */}
        <div className="absolute top-1/4 left-1/4 w-[600px] h-[600px] bg-red-600/10 rounded-full blur-[150px] animate-[aurora-drift_12s_ease-in-out_infinite_alternate]"></div>
        <div className="absolute bottom-1/4 right-1/4 w-[500px] h-[500px] bg-orange-600/8 rounded-full blur-[130px] animate-[aurora-drift_15s_ease-in-out_infinite_alternate-reverse]"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] bg-red-500/5 rounded-full blur-[120px] animate-[aurora-drift_10s_ease-in-out_infinite_alternate]"></div>

        {/* Grid overlay */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
            backgroundSize: '80px 80px'
          }}
        ></div>

        {/* Radial vignette */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#050508_70%)]"></div>
      </div>

      {/* Floating particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 rounded-full bg-red-400/20"
            style={{
              left: `${15 + i * 15}%`,
              top: `${20 + (i % 3) * 25}%`,
              animation: `float ${5 + i * 0.8}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">
          {/* Badge */}
          <div className="inline-flex items-center space-x-2 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500"></span>
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50">24/7 Отворено</span>
          </div>

          <div className="space-y-8">
            <h1 className="text-7xl md:text-8xl lg:text-[10rem] font-black text-white tracking-[-0.04em] leading-[0.85] text-glow-strong">
              BG OIL
            </h1>

            <p className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent bg-gradient-to-r from-white via-white/90 to-white/40">
              {companyInfo.slogan}
            </p>

            <p className="text-base md:text-lg text-white/35 max-w-2xl mx-auto leading-relaxed">
              {companyInfo.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center items-center pt-6">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-primary text-white hover:bg-primary-light transition-all duration-300 font-bold px-10 py-7 text-lg neon-glow"
            >
              <Link href="/products" className="flex items-center gap-3">
                <span>Горива</span>
                <Fuel className="w-5 h-5" />
              </Link>
            </Button>

            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-white/[0.03] border border-white/[0.08] text-white hover:bg-white/[0.06] backdrop-blur-xl font-bold px-10 py-7 text-lg hover:border-white/15 transition-all duration-300"
            >
              <Link href="/contact" className="flex items-center gap-3">
                <span>Контакти</span>
                <ChevronRight className="w-5 h-5" />
              </Link>
            </Button>
          </div>

          {/* Discount Banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="mt-6 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="inline-block px-6 py-3 bg-green-500/[0.06] border border-green-500/15 rounded-2xl backdrop-blur-xl">
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div
            ref={statsRef}
            className="grid grid-cols-3 gap-4 md:gap-8 mt-20 max-w-3xl mx-auto"
          >
            {[
              { val: "24/7", label: "Работно Време" },
              { val: `${qualityCount}%`, label: "Качество" },
              { val: `${yearsCount}+`, label: "Години Опит" }
            ].map((stat, i) => (
              <div
                key={i}
                className="relative group p-5 md:p-8 rounded-2xl bg-white/[0.02] border border-white/[0.05] backdrop-blur-sm hover:border-primary/20 transition-all duration-500"
              >
                <span className="block text-2xl md:text-5xl font-black text-white mb-1 tracking-tight">{stat.val}</span>
                <span className="text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/25">{stat.label}</span>
                {/* Subtle glow on hover */}
                <div className="absolute inset-0 rounded-2xl bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10 blur-xl"></div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#050508] to-transparent z-10"></div>
    </section>
  )
}
