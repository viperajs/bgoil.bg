"use client"

import Link from "next/link"

import { companyInfo } from "@/lib/config"
import { Button } from "@/components/ui/button"
import { Fuel, Phone, ChevronRight, Sparkles, Zap, Shield, Award } from "lucide-react"
import { useEffect, useState, useRef } from "react"

/* ─────────────────────────────── hooks ────────────────────────────────── */

/**
 * Renders `target` immediately (correct value with JS disabled / before
 * hydration) and only replays a 0→target count-up once, the first time
 * `active` becomes true. Never gets stuck at 0.
 */
function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(target)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (!active || hasAnimated.current) return
    hasAnimated.current = true
    setCount(0)
    let value = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      value += step
      if (value >= target) {
        setCount(target)
        clearInterval(timer)
      } else {
        setCount(value)
      }
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])

  return count
}

function useTypewriter(text: string, speed = 55, delay = 0) {
  const [displayed, setDisplayed] = useState(text)
  const [done, setDone] = useState(true)
  const hasAnimated = useRef(false)

  useEffect(() => {
    if (hasAnimated.current) return
    hasAnimated.current = true
    setDisplayed("")
    setDone(false)
    const startTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) {
          setDisplayed(text.slice(0, ++i))
        } else {
          setDone(true)
          clearInterval(interval)
        }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [text, speed, delay])

  return { displayed, done }
}

/* ═══════════════════════════════ component ═════════════════════════════════ */

export default function Hero() {
  const statsRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const [statsVisible, setStatsVisible] = useState(false)
  const [barsVisible, setBarsVisible] = useState(false)
  const [discountBanner, setDiscountBanner] = useState<{ active: boolean; message: string | null }>({ active: false, message: null })
  const [lettersReady, setLettersReady] = useState(false)

  const qualityCount = useCountUp(100, 1400, statsVisible)
  const yearsCount = useCountUp(21, 1000, statsVisible)
  const { displayed: sloganText, done: sloganDone } = useTypewriter(companyInfo.slogan, 52, 800)

  useEffect(() => {
    const t = setTimeout(() => setLettersReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    fetch('/api/promo/discount-banner')
      .then(r => r.json())
      .then(d => setDiscountBanner(d))
      .catch(() => {})
  }, [])

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setStatsVisible(true)
          setTimeout(() => setBarsVisible(true), 300)
        }
      },
      { threshold: 0.1 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  /* Defer the video fetch off the critical path — the poster paints instantly,
     the clip attaches only after mount, so LCP never waits on video data. */
  useEffect(() => {
    const el = videoRef.current
    if (!el) return
    el.src = "/Gas_Station_Scene_A_white_sedan_drives_past_a_gas_station_at_night_uTdWARsS.mp4"
    el.load()
    el.play().catch(() => {})
  }, [])

  /* ── data ── */
  const letters = ["B", "G", " ", "O", "I", "L"]
  const stats = [
    { val: "24/7", label: "Работно време", sub: "Никога не затваряме", Icon: Zap },
    { val: `${qualityCount}%`, label: "Качество", sub: "Европейски стандарт", Icon: Shield, bar: qualityCount },
    { val: `${yearsCount}+`, label: "Години опит", sub: "Доверие от клиенти", Icon: Award, bar: Math.min(100, yearsCount * 4.76) },
  ]

  /* ═══════════════════════ render ═══════════════════════════════ */
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

      {/* ══ Background video (poster paints immediately; clip loads after mount) ══ */}
      <video
        ref={videoRef}
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        poster="/background.png"
        preload="none"
        autoPlay
        muted
        loop
        playsInline
        style={{ zIndex: 0, opacity: 0.3 }}
      />

      {/* ══ Contrast overlay — ensures text passes AA over any video frame ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 1,
          background:
            'linear-gradient(to bottom, color-mix(in srgb, var(--background) 78%, transparent) 0%, color-mix(in srgb, var(--background) 58%, transparent) 45%, color-mix(in srgb, var(--background) 85%, transparent) 100%)',
        }}
      />

      {/* ══ Vignette ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          zIndex: 2,
          background: 'radial-gradient(ellipse 110% 100% at 50% 40%, transparent 40%, var(--background) 100%)',
        }}
      />

      {/* ════════════════ CONTENT ════════════════ */}
      <div className="relative z-10 container mx-auto px-4 text-center text-foreground flex-1 flex items-center">
        <div className="max-w-5xl mx-auto w-full">

          {/* ── Status badge ── */}
          <div className="animate-fade-in-down mb-8" style={{ animationDelay: '0.1s' }}>
            <div className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full border border-border bg-card/60 backdrop-blur-xl">
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-emerald-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-emerald-500" />
              </span>
              <span className="text-caption uppercase text-muted-foreground font-mono">
                Отворено 24/7 · Враца, България
              </span>
            </div>
          </div>

          {/* ── Massive title: BG OIL ── */}
          <h1
            className="text-display text-foreground mb-5 select-none"
            style={{ whiteSpace: 'nowrap' }}
            aria-label="BG OIL"
          >
            {letters.map((letter, i) => (
              <span
                key={i}
                className={lettersReady ? 'hero-word hero-word-visible' : 'hero-word'}
                style={{ animationDelay: `${i * 0.07}s` }}
              >
                {letter}
              </span>
            ))}
          </h1>

          {/* Thin separator */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="flex-1 max-w-[140px] h-px bg-gradient-to-r from-transparent to-brand-500/40" />
            <div className="w-1.5 h-1.5 rounded-full bg-brand-500" />
            <div className="flex-1 max-w-[140px] h-px bg-gradient-to-l from-transparent to-brand-500/40" />
          </div>

          {/* ── Typewriter slogan ── */}
          <div className="flex items-center justify-center min-h-[2rem] mb-4">
            <span className="text-h4 text-foreground/85">
              {sloganText}
            </span>
            {!sloganDone && (
              <span className="inline-block w-[2px] h-5 ml-0.5 rounded-sm align-middle bg-brand-500 animate-pulse" />
            )}
          </div>

          {/* Description */}
          <p className="text-body text-muted-foreground max-w-lg mx-auto mb-9 animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
            {companyInfo.description}
          </p>

          {/* ── CTA Buttons ── */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
            <Button asChild size="lg" className="w-full sm:w-auto">
              <Link href="/products">
                <Fuel className="w-4 h-4" />
                Цени на горива
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="w-full sm:w-auto">
              <Link href="/contact" className="group">
                <Phone className="w-4 h-4" />
                Контакти
                <ChevronRight className="w-3.5 h-3.5 opacity-60 group-hover:translate-x-0.5 transition-transform duration-200" />
              </Link>
            </Button>
          </div>

          {/* Discount banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-block px-5 py-2.5 rounded-lg border border-emerald-500/20 bg-emerald-500/10">
                <p className="text-emerald-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-3.5 h-3.5" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* ── Stats ── */}
          <div ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.Icon
              return (
                <div
                  key={i}
                  className="animate-fade-in-up"
                  style={{ animationDelay: `${0.1 + i * 0.1}s` }}
                >
                  <div className="relative p-5 md:p-6 rounded-lg border border-border bg-card/70 backdrop-blur-md hover-lift">
                    <Icon className="w-3.5 h-3.5 mb-3 text-brand-500" />
                    <div className="text-h3 font-mono tabular-nums text-foreground mb-0.5">
                      {stat.val}
                    </div>
                    <div className="text-caption uppercase text-muted-foreground mb-2.5">
                      {stat.label}
                    </div>
                    {stat.bar !== undefined && (
                      <div className="w-full h-[2px] rounded-full bg-muted overflow-hidden">
                        <div
                          className="h-full rounded-full bg-brand-500 transition-[width] duration-1000 ease-out"
                          style={{ width: barsVisible ? `${stat.bar}%` : '0%' }}
                        />
                      </div>
                    )}
                    <div className="hidden md:block text-caption text-muted-foreground/70 mt-2">
                      {stat.sub}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Scroll indicator ── */}
          <div className="flex flex-col items-center gap-2 mt-10 animate-fade-in-up" style={{ animationDelay: '0.6s' }}>
            <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-muted-foreground/50 font-mono">
              scroll
            </span>
            <div className="w-px h-10 overflow-hidden rounded-full bg-border">
              <div className="w-full h-full bg-brand-500" style={{ animation: 'scroll-drop 1.8s ease-in-out infinite' }} />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade into next section */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, var(--background) 30%, transparent)' }}
      />

      <style>{`
        @keyframes scroll-drop {
          0%   { transform:translateY(-100%); opacity:0 }
          20%  { opacity:1 }
          80%  { opacity:1 }
          100% { transform:translateY(200%);  opacity:0 }
        }
      `}</style>
    </section>
  )
}
