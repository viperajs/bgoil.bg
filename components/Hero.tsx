"use client"

import Link from "next/link"
import { Button } from "@/components/ui/button"
import { companyInfo } from "@/lib/config"
import { Fuel, Phone, ChevronRight, Sparkles } from "lucide-react"
import { useEffect, useState, useRef, useCallback } from "react"

/* ─────────────────────────────── hooks ────────────────────────────────── */

function useCountUp(target: number, duration: number, active: boolean) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!active) return
    let start = 0
    const step = Math.ceil(target / (duration / 16))
    const timer = setInterval(() => {
      start += step
      if (start >= target) { setCount(target); clearInterval(timer) }
      else setCount(start)
    }, 16)
    return () => clearInterval(timer)
  }, [active, target, duration])
  return count
}

function useTypewriter(text: string, speed = 55, delay = 0) {
  const [displayed, setDisplayed] = useState("")
  const [done, setDone] = useState(false)
  useEffect(() => {
    const startTimer = setTimeout(() => {
      let i = 0
      const interval = setInterval(() => {
        if (i < text.length) { setDisplayed(text.slice(0, ++i)) }
        else { setDone(true); clearInterval(interval) }
      }, speed)
      return () => clearInterval(interval)
    }, delay)
    return () => clearTimeout(startTimer)
  }, [text, speed, delay])
  return { displayed, done }
}

/* ─────────────────────── particle grid constants ───────────────────────── */

const P_ROWS    = 14                      // 14 × 14 = 196 particles
const P_TOTAL   = P_ROWS * P_ROWS
const P_SPACING = 3.8                     // rem between grid points

/* ═══════════════════════════════ component ═════════════════════════════════ */

export default function Hero() {

  /* ── ui state ── */
  const statsRef    = useRef<HTMLDivElement>(null)
  const [statsVisible,    setStatsVisible]    = useState(false)
  const [discountBanner,  setDiscountBanner]  = useState<{ active: boolean; message: string | null }>({ active: false, message: null })
  const [mousePos,        setMousePos]        = useState({ x: 0, y: 0 })
  const [lettersReady,    setLettersReady]    = useState(false)
  const [shimmerActive,   setShimmerActive]   = useState(false)

  /* ── particle system refs (all DOM-side, zero extra re-renders) ── */
  const particleContainerRef  = useRef<HTMLDivElement>(null)
  const particlesRef          = useRef<HTMLDivElement[]>([])
  const particlePosRef        = useRef<Array<{ x: number; y: number }>>([])   // current lerped positions
  const particleCursorRef     = useRef({ x: 0, y: 0 })                        // target from mouse
  const isAutoModeRef         = useRef(true)
  const lastMouseMoveRef      = useRef(Date.now())
  const rafRef                = useRef<number>()

  /* ── count-up / typewriter ── */
  const qualityCount = useCountUp(100, 1200, statsVisible)
  const yearsCount   = useCountUp(21,  900,  statsVisible)
  const { displayed: sloganText, done: sloganDone } = useTypewriter(companyInfo.slogan, 55, 900)

  /* ────────────────── letter reveal + shimmer ─────────────────── */
  useEffect(() => {
    const t = setTimeout(() => setLettersReady(true), 150)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (!lettersReady) return
    const t = setTimeout(() => setShimmerActive(true), 1300)
    return () => clearTimeout(t)
  }, [lettersReady])

  /* ──────────────────── discount banner ──────────────────────── */
  useEffect(() => {
    fetch('/api/promo/discount-banner')
      .then(r => r.json())
      .then(d => setDiscountBanner(d))
      .catch(() => {})
  }, [])

  /* ───────────────────── stats intersection ───────────────────── */
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([e]) => { if (e.isIntersecting) setStatsVisible(true) },
      { threshold: 0.1 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  /* ──────────────────── particle initialization ───────────────── */
  useEffect(() => {
    const container = particleContainerRef.current
    if (!container) return
    container.innerHTML = ''
    particlesRef.current = []
    particlePosRef.current = []

    const cx = Math.floor(P_ROWS / 2)
    const cy = Math.floor(P_ROWS / 2)

    for (let i = 0; i < P_TOTAL; i++) {
      const row = Math.floor(i / P_ROWS)
      const col = i % P_ROWS
      const dist = Math.sqrt(Math.pow(row - cx, 2) + Math.pow(col - cy, 2))

      const scale   = Math.max(0.08, 1.15 - dist * 0.12)
      const opacity = Math.max(0.04, 0.75 - dist * 0.1)
      const light   = Math.max(18, 68 - dist * 6)
      const hue     = [4, 14, 24, 8][i % 4]        // red-orange palette
      const glow    = Math.max(0.5, 5.5 - dist * 0.4)

      const el = document.createElement('div')
      el.style.cssText = `
        position:absolute;
        width:0.42rem;height:0.42rem;
        border-radius:50%;
        left:${col * P_SPACING}rem;
        top:${row * P_SPACING}rem;
        transform:scale(${scale});
        opacity:${opacity};
        background:hsl(${hue},88%,${light}%);
        box-shadow:0 0 ${glow * 0.22}rem 0 hsl(${hue},88%,52%);
        mix-blend-mode:screen;
        will-change:transform;
      `
      container.appendChild(el)
      particlesRef.current.push(el)
      particlePosRef.current.push({ x: 0, y: 0 })
    }
  }, [])

  /* ─────────────────── particle rAF animation loop ────────────── */
  useEffect(() => {
    const startTime = Date.now()
    const cx = Math.floor(P_ROWS / 2)
    const cy = Math.floor(P_ROWS / 2)

    const loop = () => {
      const t = (Date.now() - startTime) * 0.001
      const idleDelta = Date.now() - lastMouseMoveRef.current

      // After 4 s of inactivity → auto-orbit mode
      if (idleDelta > 4000) isAutoModeRef.current = true

      let targetX: number, targetY: number
      if (isAutoModeRef.current) {
        targetX = Math.sin(t * 0.28) * 165 + Math.sin(t * 0.16) * 75
        targetY = Math.cos(t * 0.19) * 120 + Math.cos(t * 0.22) * 55
      } else {
        // Gentle drift after mouse stops
        const drift = idleDelta > 500 ? Math.min((idleDelta - 500) / 1200, 1) * 0.18 : 0
        targetX = particleCursorRef.current.x + Math.sin(t * 1.4) * 14 * drift
        targetY = particleCursorRef.current.y + Math.cos(t * 1.1) * 11 * drift
      }

      // Lerp each particle toward its damped target
      particlesRef.current.forEach((el, i) => {
        const row = Math.floor(i / P_ROWS)
        const col = i % P_ROWS
        const dist = Math.sqrt(Math.pow(row - cx, 2) + Math.pow(col - cy, 2))

        const origScale = Math.max(0.08, 1.15 - dist * 0.12)
        const dampen    = Math.max(0.28, 1 - dist * 0.08)
        const lerpK     = 0.055 + (1 - dampen) * 0.02   // outer particles lag more

        const px = particlePosRef.current[i]
        const nx = px.x + (targetX * dampen - px.x) * lerpK
        const ny = px.y + (targetY * dampen - px.y) * lerpK
        particlePosRef.current[i] = { x: nx, y: ny }

        el.style.transform = `translate(${nx}px,${ny}px) scale(${origScale})`
      })

      rafRef.current = requestAnimationFrame(loop)
    }

    rafRef.current = requestAnimationFrame(loop)
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current) }
  }, [])

  /* ──────────────────── unified mouse handler ─────────────────── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    // Existing parallax
    setMousePos({
      x: (e.clientX / window.innerWidth  - 0.5) * 2,
      y: (e.clientY / window.innerHeight - 0.5) * 2,
    })
    // Particle cursor (pixel offset from center)
    particleCursorRef.current = {
      x: (e.clientX - window.innerWidth  / 2) * 0.62,
      y: (e.clientY - window.innerHeight / 2) * 0.62,
    }
    isAutoModeRef.current  = false
    lastMouseMoveRef.current = Date.now()
  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  /* ─────────────────── 3-D tilt for stat cards ────────────────── */
  const handleCardTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const rx   = ((e.clientY - rect.top  - rect.height / 2) / (rect.height / 2)) * -9
    const ry   = ((e.clientX - rect.left - rect.width  / 2) / (rect.width  / 2)) *  9
    el.style.transform   = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px) scale(1.03)`
    el.style.borderColor = 'rgba(239,68,68,0.32)'
    el.style.background  = 'rgba(239,68,68,0.05)'
    el.style.boxShadow   = '0 24px 56px rgba(0,0,0,0.5), 0 0 40px rgba(239,68,68,0.1), inset 0 1px 0 rgba(255,255,255,0.06)'
  }, [])

  const handleCardReset = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform   = 'perspective(700px) rotateX(0deg) rotateY(0deg) translateY(0) scale(1)'
    el.style.borderColor = 'rgba(255,255,255,0.06)'
    el.style.background  = 'rgba(255,255,255,0.02)'
    el.style.boxShadow   = 'none'
  }, [])

  /* ─────────────────────── data ───────────────────────────────── */
  const letters = ["B", "G", "\u00A0", "O", "I", "L"]
  const stats   = [
    { val: "24/7",              label: "Работно Време", sub: "Никога не затваряме" },
    { val: `${qualityCount}%`,  label: "Качество",      sub: "Европейски стандарт" },
    { val: `${yearsCount}+`,    label: "Години Опит",   sub: "Доверие от клиенти"  },
  ]

  /* ═══════════════════════════════ render ════════════════════════════════ */
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-20">

      {/* ── 21st.dev–style interactive particle grid (background) ── */}
      <div className="absolute inset-0 z-0 flex items-center justify-center pointer-events-none overflow-hidden">
        <div
          ref={particleContainerRef}
          className="relative"
          style={{
            width:  `${P_ROWS * P_SPACING}rem`,
            height: `${P_ROWS * P_SPACING}rem`,
            opacity: 0.82,
          }}
        />
      </div>

      {/* ── Rotating rings with spark dots ── */}
      <div className="absolute inset-0 z-0 pointer-events-none flex items-center justify-center">
        {[
          { size: 870, dur: '22s', border: 'rgba(239,68,68,0.055)', spark: 'rgba(239,68,68,0.75)', sz: 7, rev: false },
          { size: 580, dur: '14s', border: 'rgba(249,115,22,0.06)',  spark: 'rgba(249,115,22,0.65)', sz: 5, rev: true  },
          { size: 310, dur:  '8s', border: 'rgba(239,68,68,0.08)',   spark: 'rgba(239,68,68,0.9)',   sz: 4, rev: false },
        ].map((ring, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  ring.size,
              height: ring.size,
              border: `1px solid ${ring.border}`,
              animation: `hero-ring-spin ${ring.dur} linear infinite ${ring.rev ? 'reverse' : ''}`,
            }}
          >
            <div style={{
              position: 'absolute',
              top:  -ring.sz / 2,
              left: '50%',
              transform: 'translateX(-50%)',
              width:  ring.sz,
              height: ring.sz,
              borderRadius: '50%',
              background: ring.spark,
              boxShadow: `0 0 ${ring.sz * 2}px ${ring.spark}, 0 0 ${ring.sz * 4}px ${ring.spark}`,
            }} />
          </div>
        ))}
      </div>

      {/* ── Parallax aurora blobs ── */}
      <div className="absolute inset-0 z-0 pointer-events-none">
        <div
          className="absolute top-[15%] left-[10%] w-[900px] h-[900px] rounded-full blur-[220px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(239,68,68,0.16), transparent 65%)',
            transform:  `translate(${mousePos.x * 25}px, ${mousePos.y * 25}px)`,
            transition: 'transform 0.9s cubic-bezier(0.25,0.46,0.45,0.94)',
            animation:  'aurora-drift-slow 16s ease-in-out infinite',
          }}
        />
        <div
          className="absolute bottom-[15%] right-[15%] w-[650px] h-[650px] rounded-full blur-[180px]"
          style={{
            background: 'radial-gradient(ellipse, rgba(249,115,22,0.12), transparent 65%)',
            transform:  `translate(${mousePos.x * -18}px, ${mousePos.y * -18}px)`,
            transition: 'transform 1.1s cubic-bezier(0.25,0.46,0.45,0.94)',
            animation:  'aurora-drift-slow 20s ease-in-out infinite reverse',
          }}
        />
        {/* Central pulsing halo */}
        <div
          className="absolute top-[38%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[750px] h-[380px] rounded-full blur-[90px] pointer-events-none"
          style={{
            background: 'radial-gradient(ellipse, rgba(239,68,68,0.13), rgba(220,38,38,0.05), transparent 70%)',
            animation:  'hero-halo-pulse 3.8s ease-in-out infinite',
          }}
        />
      </div>

      {/* ── Grid overlay (parallax) ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.038) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.038) 1px, transparent 1px)',
          backgroundSize:  '80px 80px',
          transform:  `translate(${mousePos.x * 4}px, ${mousePos.y * 4}px)`,
          transition: 'transform 0.4s ease-out',
          maskImage:        'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
          WebkitMaskImage:  'radial-gradient(ellipse 80% 80% at 50% 50%, black 0%, transparent 100%)',
        }}
      />

      {/* ── Diagonal accent lines ── */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden">
        <div className="absolute -right-24 top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-red-500/12 to-transparent rotate-[15deg] origin-top" />
        <div className="absolute right-48  top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-red-500/6  to-transparent rotate-[15deg] origin-top" />
        <div className="absolute -left-12  top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-orange-500/10 to-transparent rotate-[-12deg] origin-top" />
        <div className="absolute left-48   top-0 w-px h-[200%] bg-gradient-to-b from-transparent via-orange-500/5  to-transparent rotate-[-8deg]  origin-top" />
      </div>

      {/* ── Slow horizontal scan line ── */}
      <div
        className="absolute left-0 right-0 h-px pointer-events-none"
        style={{
          zIndex: 5,
          top: 0,
          background: 'linear-gradient(90deg, transparent 5%, rgba(239,68,68,0.1) 30%, rgba(239,68,68,0.26) 50%, rgba(239,68,68,0.1) 70%, transparent 95%)',
          animation: 'hero-scan-line 9s ease-in-out infinite',
        }}
      />

      {/* ── Radial vignette ── */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{ background: 'radial-gradient(ellipse 100% 100% at 50% 50%, transparent 15%, #0A0A0B 82%)' }}
      />

      {/* ── Floating ambient particles ── */}
      <div className="absolute inset-0 z-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width:  i % 5 === 0 ? '8px' : i % 3 === 0 ? '5px' : '3px',
              height: i % 5 === 0 ? '8px' : i % 3 === 0 ? '5px' : '3px',
              background: i % 3 === 0
                ? `rgba(239,68,68,${0.25 + (i % 3) * 0.1})`
                : i % 2 === 0
                ? `rgba(249,115,22,${0.18 + (i % 4) * 0.07})`
                : `rgba(248,113,113,${0.12 + (i % 5) * 0.05})`,
              left:            `${5 + i * 4.8}%`,
              top:             `${8 + (i % 7) * 12}%`,
              animation:       `hero-particle-${['a','b','c'][i % 3]} ${5 + i * 0.58}s ease-in-out infinite`,
              animationDelay:  `${i * 0.27}s`,
              boxShadow: i % 5 === 0
                ? '0 0 12px 4px rgba(239,68,68,0.65), 0 0 28px 8px rgba(239,68,68,0.25)'
                : i % 3 === 0
                ? '0 0 7px 2px rgba(239,68,68,0.42)'
                : 'none',
            }}
          />
        ))}
      </div>

      {/* ══════════════════════ CONTENT ══════════════════════════════ */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white">
        <div className="max-w-5xl mx-auto space-y-8">

          {/* Status badge */}
          <div className="animate-fade-in-down" style={{ animationDelay: '0.05s' }}>
            <div
              className="inline-flex items-center gap-3 px-5 py-2.5 rounded-full"
              style={{
                background:    'rgba(255,255,255,0.03)',
                border:        '1px solid rgba(255,255,255,0.08)',
                backdropFilter:'blur(20px)',
                boxShadow:     '0 0 32px rgba(239,68,68,0.07), inset 0 1px 0 rgba(255,255,255,0.05)',
              }}
            >
              <span className="relative flex h-2 w-2 flex-shrink-0">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full h-2 w-2 bg-green-500" />
              </span>
              <span className="text-[11px] font-bold uppercase tracking-[0.22em] text-white/50" style={{ fontFamily: 'var(--font-mono)' }}>
                24/7 Отворено
              </span>
              <span className="w-px h-3 bg-white/10 hidden sm:block" />
              <span className="text-[11px] text-white/25 hidden sm:block" style={{ fontFamily: 'var(--font-mono)' }}>
                Враца, България
              </span>
            </div>
          </div>

          {/* ── BG OIL: letter reveal + bloom halo + shimmer ── */}
          <div className="space-y-5">
            <div className="relative inline-block">

              {/* Bloom glow behind title */}
              <div
                className="absolute pointer-events-none"
                style={{
                  inset:      '-30% -20%',
                  zIndex:     -1,
                  filter:     'blur(65px)',
                  background: 'radial-gradient(ellipse 80% 55% at 50% 55%, rgba(239,68,68,0.32), rgba(220,38,38,0.1) 55%, transparent 75%)',
                  animation:  'hero-halo-pulse 3.5s ease-in-out infinite',
                }}
              />

              {/* Shimmer sweep (clips to h1 width) */}
              <div className="relative overflow-hidden">
                {shimmerActive && (
                  <div
                    className="absolute inset-0 pointer-events-none"
                    style={{
                      zIndex:     2,
                      background: 'linear-gradient(108deg, transparent 20%, rgba(255,255,255,0.11) 48%, rgba(255,255,255,0.06) 52%, transparent 80%)',
                      animation:  'hero-title-shimmer 4s ease-in-out infinite',
                    }}
                  />
                )}

                <h1
                  className="font-black leading-none select-none relative"
                  style={{ fontSize: 'clamp(5rem, 14vw, 11rem)', letterSpacing: '0.04em' }}
                  aria-label="BG OIL"
                >
                  {letters.map((letter, i) => (
                    <span
                      key={i}
                      className="inline-block"
                      style={{
                        opacity:   lettersReady ? 1 : 0,
                        transform: lettersReady ? 'translateY(0) scale(1)' : 'translateY(0.45em) scale(0.88)',
                        filter:    lettersReady
                          ? 'drop-shadow(0 0 40px rgba(239,68,68,0.42)) drop-shadow(0 2px 8px rgba(0,0,0,0.7))'
                          : 'blur(14px)',
                        transition: [
                          `opacity   0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                          `transform 0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                          `filter    0.65s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                        ].join(', '),
                        background:           'linear-gradient(165deg, #ffffff 0%, rgba(255,252,250,1) 45%, rgba(255,210,195,0.88) 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor:  'transparent',
                        backgroundClip:       'text',
                      }}
                    >
                      {letter}
                    </span>
                  ))}
                </h1>
              </div>
            </div>

            {/* Typewriter slogan */}
            <div className="text-xl md:text-3xl font-semibold flex items-center justify-center min-h-[2.5rem]">
              <span
                style={{
                  background:           'linear-gradient(90deg, rgba(250,250,250,0.9) 0%, rgba(250,250,250,0.45) 100%)',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor:  'transparent',
                  backgroundClip:       'text',
                  fontFamily:           'var(--font-display)',
                }}
              >
                {sloganText}
              </span>
              {!sloganDone && (
                <span
                  className="inline-block w-[2px] h-7 ml-0.5 rounded-sm"
                  style={{
                    background:     'rgba(239,68,68,0.85)',
                    animation:      'hero-blink-cursor 0.75s step-end infinite',
                    verticalAlign:  'middle',
                  }}
                />
              )}
            </div>

            <p
              className="text-base md:text-lg text-white/35 max-w-2xl mx-auto leading-relaxed animate-fade-in-up"
              style={{
                animationDelay: '1.5s',
                fontFamily:     'var(--font-sans)',
                fontWeight:     400,
                textTransform:  'none',
                letterSpacing:  '0.01em',
              }}
            >
              {companyInfo.description}
            </p>
          </div>

          {/* ── CTAs ── */}
          <div
            className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fade-in-up"
            style={{ animationDelay: '1.7s' }}
          >
            {/* Primary — spinning conic ring on hover */}
            <div className="relative group w-full sm:w-auto">
              <div
                className="absolute -inset-[3px] rounded-full pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{
                  background: 'conic-gradient(from 0deg, rgba(239,68,68,0.9) 0%, rgba(249,115,22,0.65) 25%, transparent 50%, transparent 78%, rgba(239,68,68,0.9) 100%)',
                  animation:  'hero-ring-spin 2.2s linear infinite',
                  filter:     'blur(4px)',
                }}
              />
              <Button
                size="lg"
                asChild
                className="w-full sm:w-auto rounded-full font-bold px-10 py-7 text-base shimmer-btn cursor-pointer relative z-10 group"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                  color:      '#fff',
                  border:     'none',
                  boxShadow:  '0 0 22px rgba(239,68,68,0.38), 0 8px 32px rgba(239,68,68,0.22)',
                }}
              >
                <Link href="/products" className="flex items-center gap-3">
                  <Fuel className="w-5 h-5 transition-transform duration-300 group-hover:rotate-12 group-hover:scale-110" />
                  <span>Цени на горива</span>
                </Link>
              </Button>
            </div>

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
            <div className="animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div className="inline-block px-6 py-3 bg-green-500/[0.06] border border-green-500/15 rounded-2xl backdrop-blur-xl">
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-4 h-4" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* ── Stats — 3-D magnetic tilt ── */}
          <div ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-5 mt-10 max-w-3xl mx-auto">
            {stats.map((stat, i) => (
              <div
                key={i}
                style={{
                  opacity:    statsVisible ? 1 : 0,
                  transform:  statsVisible ? 'translateY(0)' : 'translateY(28px)',
                  transition: `opacity 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.13}s, transform 0.65s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.13}s`,
                }}
              >
                <div
                  className="group relative p-5 md:p-6 rounded-2xl cursor-default overflow-hidden"
                  style={{
                    background:      'rgba(255,255,255,0.02)',
                    border:          '1px solid rgba(255,255,255,0.06)',
                    backdropFilter:  'blur(12px)',
                    transformStyle:  'preserve-3d',
                    transition:      'transform 0.18s ease-out, border-color 0.25s, background 0.25s, box-shadow 0.25s',
                    willChange:      'transform',
                  }}
                  onMouseMove={handleCardTilt}
                  onMouseLeave={handleCardReset}
                >
                  {/* Accent line */}
                  <div
                    className="absolute top-0 left-1/2 -translate-x-1/2 w-14 h-px opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'linear-gradient(90deg, transparent, rgba(239,68,68,0.75), transparent)' }}
                  />
                  {/* Corner glow */}
                  <div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
                    style={{ background: 'radial-gradient(ellipse at 50% 0%, rgba(239,68,68,0.11), transparent 65%)' }}
                  />
                  {/* Tiny indicator dot */}
                  <div
                    className="absolute top-2.5 right-2.5 w-1.5 h-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none"
                    style={{ background: 'rgba(239,68,68,0.8)', boxShadow: '0 0 6px rgba(239,68,68,0.9)' }}
                  />

                  <div className="relative z-10">
                    <span
                      className="block text-2xl md:text-4xl font-black text-white mb-1"
                      style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
                    >
                      {stat.val}
                    </span>
                    <span className="block text-[9px] md:text-[11px] font-bold uppercase tracking-[0.15em] text-white/30 mb-1">
                      {stat.label}
                    </span>
                    <span
                      className="hidden md:block text-[10px] text-white/20 normal-case"
                      style={{ fontFamily: 'var(--font-sans)', fontWeight: 400, textTransform: 'none' }}
                    >
                      {stat.sub}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Scroll indicator */}
          <div className="flex flex-col items-center gap-2 pt-3 animate-fade-in-up" style={{ animationDelay: '2.3s' }}>
            <span className="text-[9px] font-bold uppercase tracking-[0.35em] text-white/15" style={{ fontFamily: 'var(--font-mono)' }}>
              scroll
            </span>
            <div className="w-px h-10 relative overflow-hidden rounded-full">
              <div
                className="absolute inset-x-0 top-0 h-full bg-gradient-to-b from-red-500/60 to-transparent"
                style={{ animation: 'hero-scroll-indicator 1.65s ease-in-out infinite' }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 left-0 right-0 h-44 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0A0A0B 20%, transparent)' }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes hero-particle-a {
          0%,100%{ transform:translateY(0) translateX(0);    opacity:.5 }
          40%    { transform:translateY(-22px) translateX(8px);  opacity:1  }
          70%    { transform:translateY(-14px) translateX(-6px); opacity:.7 }
        }
        @keyframes hero-particle-b {
          0%,100%{ transform:translateY(0) translateX(0);     opacity:.4 }
          30%    { transform:translateY(-18px) translateX(-10px);opacity:.9 }
          65%    { transform:translateY(-26px) translateX(6px);  opacity:.6 }
        }
        @keyframes hero-particle-c {
          0%,100%{ transform:translateY(0) translateX(0);     opacity:.3 }
          50%    { transform:translateY(-12px) translateX(12px);opacity:.8 }
        }
        @keyframes hero-blink-cursor {
          0%,100%{ opacity:1 }
          50%    { opacity:0 }
        }
        @keyframes hero-scroll-indicator {
          0%  { transform:translateY(-100%); opacity:0 }
          20% { opacity:1 }
          80% { opacity:1 }
          100%{ transform:translateY(200%);  opacity:0 }
        }
        @keyframes hero-ring-spin {
          from{ transform:rotate(0deg) }
          to  { transform:rotate(360deg) }
        }
        @keyframes hero-halo-pulse {
          0%,100%{ opacity:.65; transform:scale(1)    }
          50%    { opacity:1;   transform:scale(1.08) }
        }
        @keyframes hero-title-shimmer {
          0%       { transform:translateX(-110%) }
          35%,100% { transform:translateX(210%)  }
        }
        @keyframes hero-scan-line {
          0%  { transform:translateY(18vh); opacity:0    }
          6%  { opacity:.9 }
          88% { opacity:.35}
          100%{ transform:translateY(82vh); opacity:0    }
        }
      `}</style>
    </section>
  )
}
