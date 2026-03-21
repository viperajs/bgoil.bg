"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Phone, ChevronRight, Sparkles } from "lucide-react"
import { useEffect, useState, useRef } from "react"

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(start)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [discountBanner, setDiscountBanner] = useState<{ active: boolean; message: string | null }>({ active: false, message: null })

  const qualityCount = useCountUp(100, 1200, statsVisible)
  const yearsCount = useCountUp(21, 900, statsVisible)

  useEffect(() => {
    fetch('/api/promo/discount-banner')
      .then(res => res.json())
      .then(data => setDiscountBanner(data))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setStatsVisible(true) },
      { threshold: 0.1 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* Ambient gradient blobs */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-1/4 left-1/4 w-[700px] h-[700px] rounded-full blur-[180px]"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.08), transparent 70%)', animation: 'aurora-drift-slow 14s ease-in-out infinite' }}
        />
        <div
          className="absolute bottom-1/4 right-1/3 w-[500px] h-[500px] rounded-full blur-[160px]"
          style={{ background: 'radial-gradient(ellipse, rgba(249,115,22,0.06), transparent 70%)', animation: 'aurora-drift-slow 18s ease-in-out infinite reverse' }}
        />
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[400px] rounded-full blur-[150px]"
          style={{ background: 'radial-gradient(ellipse, rgba(239,68,68,0.04), transparent 70%)' }}
        />
      </div>

      {/* Grid pattern */}
      <div
        className="absolute inset-0 z-0 opacity-[0.025] pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.15) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.15) 1px, transparent 1px)',
          backgroundSize: '80px 80px'
        }}
      />

      {/* Diagonal accent lines */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-32 top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-red-500/10 to-transparent rotate-[15deg] origin-top" />
        <div className="absolute right-32 top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-red-500/5 to-transparent rotate-[15deg] origin-top" />
        <div className="absolute -left-16 top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-orange-500/8 to-transparent rotate-[-12deg] origin-top" />
      </div>

      {/* Radial vignette */}
      <div className="absolute inset-0 z-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#0A0A0B_75%)] pointer-events-none" />

      {/* Floating amber particles */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(8)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: i % 3 === 0 ? '6px' : '3px',
              height: i % 3 === 0 ? '6px' : '3px',
              background: i % 2 === 0 ? 'rgba(239,68,68,0.25)' : 'rgba(249,115,22,0.2)',
              left: `${10 + i * 11}%`,
              top: `${15 + (i % 4) * 20}%`,
              animation: `float ${5 + i * 0.7}s ease-in-out infinite`,
              animationDelay: `${i * 0.4}s`
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-10 animate-fade-in-up">

          {/* Live badge */}
          <div className="inline-flex items-center space-x-2.5 px-5 py-2.5 bg-white/[0.03] border border-white/[0.08] backdrop-blur-xl rounded-full">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-green-500" />
            </span>
            <span className="text-xs font-bold uppercase tracking-[0.2em] text-white/50" style={{ fontFamily: 'var(--font-mono)' }}>
              24/7 Отворено
            </span>
          </div>

          {/* Main heading */}
          <div className="space-y-6">
            <h1
              className="font-black text-white leading-[0.9] tracking-widest"
              style={{
                fontSize: 'clamp(4rem, 12vw, 9rem)',
                textShadow: '0 0 60px rgba(239,68,68,0.15)',
              }}
            >
              BG OIL
            </h1>

            <p
              className="text-xl md:text-3xl font-semibold bg-clip-text text-transparent"
              style={{ background: 'linear-gradient(90deg, #FAFAFA, rgba(250,250,250,0.5))', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}
            >
              {companyInfo.slogan}
            </p>

            <p className="text-base md:text-lg text-white/35 max-w-2xl mx-auto leading-relaxed" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, textTransform: 'none', letterSpacing: '0.01em' }}>
              {companyInfo.description}
            </p>
          </div>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center pt-4">
            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full font-bold px-10 py-7 text-base neon-glow shimmer-btn cursor-pointer"
              style={{ background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)', color: '#fff', border: 'none' }}
            >
              <Link href="/products" className="flex items-center gap-3">
                <Fuel className="w-5 h-5" />
                <span>Цени на горива</span>
              </Link>
            </Button>

            <Button
              size="lg"
              asChild
              className="w-full sm:w-auto rounded-full bg-white/[0.03] border border-white/[0.1] text-white hover:bg-white/[0.07] backdrop-blur-xl font-bold px-10 py-7 text-base hover:border-red-500/30 transition-all duration-300 cursor-pointer"
            >
              <Link href="/contact" className="flex items-center gap-3">
                <Phone className="w-5 h-5" />
                <span>Контакти</span>
                <ChevronRight className="w-4 h-4 opacity-50" />
              </Link>
            </Button>
          </div>

          {/* Discount Banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
              <div className="inline-block px-6 py-3 bg-green-500/[0.06] border border-green-500/15 rounded-2xl backdrop-blur-xl">
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* Stats */}
          <div ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-6 mt-16 max-w-3xl mx-auto">
            {[
              { val: "24/7", label: "Работно Време", sub: "Никога не затваряме" },
              { val: `${qualityCount}%`, label: "Качество", sub: "Европейски стандарт" },
              { val: `${yearsCount}+`, label: "Години Опит", sub: "Доверие от клиенти" }
            ].map((stat, i) => (
              <div
                key={i}
                className="group relative p-5 md:p-7 rounded-2xl transition-all duration-500 cursor-default"
                style={{
                  background: 'rgba(255,255,255,0.02)',
                  border: '1px solid rgba(255,255,255,0.06)',
                  backdropFilter: 'blur(12px)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(239,68,68,0.25)'
                  el.style.background = 'rgba(239,68,68,0.04)'
                  el.style.transform = 'translateY(-4px)'
                  el.style.boxShadow = '0 20px 40px rgba(0,0,0,0.3), 0 0 30px rgba(239,68,68,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255,255,255,0.06)'
                  el.style.background = 'rgba(255,255,255,0.02)'
                  el.style.transform = 'translateY(0)'
                  el.style.boxShadow = 'none'
                }}
              >
                <span
                  className="block text-2xl md:text-5xl font-black text-white mb-1"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
                >
                  {stat.val}
                </span>
                <span className="block text-[10px] md:text-xs font-bold uppercase tracking-[0.15em] text-white/30 mb-1">
                  {stat.label}
                </span>
                <span className="hidden md:block text-[10px] text-white/20 normal-case" style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, textTransform: 'none', letterSpacing: '0.01em' }}>
                  {stat.sub}
                </span>
                {/* Amber corner glow */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
                  style={{ background: 'radial-gradient(circle at top right, rgba(239,68,68,0.15), transparent 70%)' }}
                />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Bottom fade */}
      <div className="absolute bottom-0 left-0 right-0 h-40 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0A0A0B, transparent)' }}
      />

      {/* Floating animation keyframes */}
      <style>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-18px); }
        }
      `}</style>
    </section>
  )
}
