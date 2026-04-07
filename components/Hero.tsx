"use client"

import Link from "next/link"

import { companyInfo } from "@/lib/config"
import { Fuel, Phone, ChevronRight, Sparkles, Zap, Shield, Award } from "lucide-react"
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

/* ═══════════════════════════════ component ═════════════════════════════════ */

export default function Hero() {

  const statsRef   = useRef<HTMLDivElement>(null)
  const [statsVisible,   setStatsVisible]   = useState(false)
  const [barsVisible,    setBarsVisible]    = useState(false)
  const [discountBanner, setDiscountBanner] = useState<{ active: boolean; message: string | null }>({ active: false, message: null })
  const [mouseX,         setMouseX]         = useState(0)
  const [lettersReady,   setLettersReady]   = useState(false)


  const qualityCount = useCountUp(100, 1400, statsVisible)
  const yearsCount   = useCountUp(21,  1000, statsVisible)
  const { displayed: sloganText, done: sloganDone } = useTypewriter(companyInfo.slogan, 52, 800)

  useEffect(() => {
    const t = setTimeout(() => setLettersReady(true), 200)
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
          setTimeout(() => setBarsVisible(true), 400)
        }
      },
      { threshold: 0.1 }
    )
    if (statsRef.current) observer.observe(statsRef.current)
    return () => observer.disconnect()
  }, [])

  /* ── mouse handler: parallax grid + magnetic CTAs ── */
  const handleMouseMove = useCallback((e: MouseEvent) => {
    const nx = (e.clientX / window.innerWidth - 0.5) * 2
    setMouseX(nx)

  }, [])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true })
    return () => window.removeEventListener('mousemove', handleMouseMove)
  }, [handleMouseMove])

  /* ── 3D card tilt ── */
  const handleTilt = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget, r = el.getBoundingClientRect()
    const rx = ((e.clientY - r.top  - r.height / 2) / (r.height / 2)) * -10
    const ry = ((e.clientX - r.left - r.width  / 2) / (r.width  / 2)) *  10
    el.style.transform   = `perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`
    el.style.borderColor = 'rgba(239,68,68,0.35)'
    el.style.boxShadow   = '0 24px 60px rgba(0,0,0,0.6), 0 0 40px rgba(239,68,68,0.1)'
  }, [])

  const handleTiltReset = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    const el = e.currentTarget
    el.style.transform   = 'perspective(700px) rotateX(0) rotateY(0) translateY(0)'
    el.style.borderColor = 'rgba(255,255,255,0.06)'
    el.style.boxShadow   = 'none'
  }, [])

  /* ── data ── */
  const letters = ["B", "G", "\u00A0", "O", "I", "L"]
  const stats = [
    { val: "24/7",             label: "Работно Време", sub: "Никога не затваряме", Icon: Zap,    bar: 100,                       color: '#ef4444' },
    { val: `${qualityCount}%`, label: "Качество",      sub: "Европейски стандарт", Icon: Shield, bar: qualityCount,              color: '#F59E0B' },
    { val: `${yearsCount}+`,   label: "Години Опит",   sub: "Доверие от клиенти",  Icon: Award,  bar: Math.min(100, yearsCount * 4.76), color: '#f97316' },
  ]

  /* ═══════════════════════ render ═══════════════════════════════ */
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden pt-20">

      {/* ══ Background video ══ */}
      <video
        className="absolute inset-0 w-full h-full object-cover pointer-events-none"
        src="/Gas_Station_Scene_A_white_sedan_drives_past_a_gas_station_at_night_uTdWARsS.mp4"
        autoPlay
        muted
        loop
        playsInline
        style={{ zIndex: 0, opacity: 0.35 }}
      />

      {/* ══ Video overlay ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 1, background: 'linear-gradient(to bottom, rgba(10,10,11,0.7) 0%, rgba(10,10,11,0.45) 50%, rgba(10,10,11,0.75) 100%)' }}
      />

      {/* ══ Single clean background glow ══ */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 2 }}>
        <div
          className="absolute"
          style={{
            top:        '-10%',
            left:       '50%',
            transform:  `translateX(calc(-50% + ${mouseX * 30}px))`,
            transition: 'transform 1.2s cubic-bezier(0.25,0.46,0.45,0.94)',
            width:      '900px',
            height:     '700px',
            background: 'radial-gradient(ellipse 60% 55% at 50% 40%, rgba(220,38,38,0.14), rgba(239,68,68,0.06) 55%, transparent 80%)',
            filter:     'blur(60px)',
          }}
        />
      </div>

      {/* ══ 3D Perspective Floor Grid (THE signature visual) ══ */}
      <div
        className="absolute bottom-0 left-0 right-0 pointer-events-none overflow-hidden"
        style={{ height: '58vh', zIndex: 3 }}
      >
        {/* The 3D plane */}
        <div
          style={{
            position:        'absolute',
            bottom:          0,
            left:            '-30%',
            right:           '-30%',
            height:          '100%',
            transform:       'perspective(380px) rotateX(70deg)',
            transformOrigin: '50% 100%',
          }}
        >
          {/* Horizontal lines (receding) */}
          <div
            style={{
              position:           'absolute',
              inset:              0,
              backgroundImage:    'linear-gradient(rgba(239,68,68,0.2) 1px, transparent 1px)',
              backgroundSize:     `100% 55px`,
              backgroundPosition: `0 ${mouseX * 8}px`,
            }}
          />
          {/* Vertical lines (converging to vanishing point) */}
          <div
            style={{
              position:        'absolute',
              inset:           0,
              backgroundImage: 'linear-gradient(90deg, rgba(239,68,68,0.12) 1px, transparent 1px)',
              backgroundSize:  '7% 100%',
            }}
          />
          {/* Horizon fade: makes top of grid disappear */}
          <div
            style={{
              position:   'absolute',
              inset:      0,
              background: 'linear-gradient(to bottom, #0A0A0B 0%, rgba(10,10,11,0.85) 25%, rgba(10,10,11,0.3) 55%, transparent 80%)',
            }}
          />
        </div>

        {/* Horizon energy glow — emitted from the vanishing point */}
        <div
          style={{
            position:   'absolute',
            top:        '8%',
            left:       '50%',
            transform:  `translateX(calc(-50% + ${mouseX * 20}px))`,
            transition: 'transform 0.9s ease-out',
            width:      '75%',
            height:     '50%',
            background: 'radial-gradient(ellipse 65% 35% at 50% 15%, rgba(239,68,68,0.28), rgba(249,115,22,0.1) 50%, transparent 80%)',
            filter:     'blur(28px)',
          }}
        />

        {/* Bottom fade — clean ground merge */}
        <div
          style={{
            position:   'absolute',
            bottom:     0,
            left:       0,
            right:      0,
            height:     '35%',
            background: 'linear-gradient(to top, #0A0A0B 55%, transparent)',
          }}
        />
      </div>


{/* ══ Vignette corners ══ */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{ zIndex: 4, background: 'radial-gradient(ellipse 110% 100% at 50% 40%, transparent 35%, rgba(10,10,11,0.65) 100%)' }}
      />

      {/* ════════════════ CONTENT ════════════════ */}
      <div className="relative z-10 container mx-auto px-4 text-center text-white flex-1 flex items-center">
        <div className="max-w-5xl mx-auto w-full">

          {/* ── Status badge ── */}
          <div
            className="animate-fade-in-down mb-8"
            style={{ animationDelay: '0.1s' }}
          >
            <div
              className="inline-flex items-center gap-2.5 px-5 py-2 rounded-full"
              style={{
                background:    'rgba(255,255,255,0.03)',
                border:        '1px solid rgba(255,255,255,0.08)',
                backdropFilter:'blur(20px)',
              }}
            >
              <span className="relative flex h-1.5 w-1.5">
                <span className="animate-ping absolute inset-0 rounded-full bg-green-400 opacity-75" />
                <span className="relative rounded-full h-1.5 w-1.5 bg-green-500" />
              </span>
              <span
                className="text-[10px] font-bold uppercase tracking-[0.28em] text-white/45"
                style={{ fontFamily: 'var(--font-mono)' }}
              >
                Отворено 24/7 · Враца, България
              </span>
            </div>
          </div>

          {/* ── Massive title: BG OIL ── */}
          <div className="relative inline-block mb-5">

            {/* Bloom behind title */}
            <div
              className="absolute pointer-events-none"
              style={{
                inset:      '-35% -20%',
                zIndex:     -1,
                filter:     'blur(90px)',
                background: 'radial-gradient(ellipse at 50% 60%, rgba(220,38,38,0.35), transparent 70%)',
                animation:  'halo-pulse 4s ease-in-out infinite',
              }}
            />

            <h1
              className="font-black leading-[0.88] select-none relative"
              style={{
                fontSize:      'clamp(3rem, 14vw, 13rem)',
                letterSpacing: '0.06em',
                fontFamily:    'var(--font-display)',
                whiteSpace:    'nowrap',
              }}
              aria-label="BG OIL"
            >
              {letters.map((letter, i) => (
                <span
                  key={i}
                  className="inline-block"
                  style={{
                    opacity:    lettersReady ? 1 : 0,
                    transform:  lettersReady ? 'translateY(0)' : 'translateY(0.4em)',
                    filter:     lettersReady
                      ? 'drop-shadow(-2px 0 rgba(220,38,38,0.5)) drop-shadow(2px 0 rgba(0,180,255,0.18)) drop-shadow(0 0 55px rgba(239,68,68,0.45))'
                      : 'blur(20px)',
                    transition: [
                      `opacity   0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                      `transform 0.9s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                      `filter    0.75s cubic-bezier(0.16,1,0.3,1) ${i * 0.09}s`,
                    ].join(', '),
                    /* Chrome metallic gradient */
                    background:           'linear-gradient(180deg, #ffffff 0%, #f5f5f5 40%, #e8d5b0 70%, #d4a96a 100%)',
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

          {/* Thin separator */}
          <div className="flex items-center justify-center gap-3 mb-5">
            <div className="flex-1 max-w-[140px] h-px bg-gradient-to-r from-transparent to-red-500/40" />
            <div
              className="w-1 h-1 rounded-full"
              style={{ background: '#ef4444', boxShadow: '0 0 8px rgba(239,68,68,1), 0 0 20px rgba(239,68,68,0.4)' }}
            />
            <div className="flex-1 max-w-[140px] h-px bg-gradient-to-l from-transparent to-red-500/40" />
          </div>

          {/* ── Typewriter slogan ── */}
          <div
            className="flex items-center justify-center min-h-[2rem] mb-4 animate-fade-in-up"
            style={{ animationDelay: '0.6s' }}
          >
            <span
              className="text-lg md:text-2xl font-semibold tracking-wide"
              style={{
                fontFamily:           'var(--font-display)',
                background:           'linear-gradient(90deg, rgba(255,255,255,0.85), rgba(255,255,255,0.4))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor:  'transparent',
                backgroundClip:       'text',
                letterSpacing:        '0.04em',
              }}
            >
              {sloganText}
            </span>
            {!sloganDone && (
              <span
                className="inline-block w-[2px] h-5 ml-0.5 rounded-sm align-middle"
                style={{ background: '#ef4444', animation: 'blink 0.75s step-end infinite' }}
              />
            )}
          </div>

          {/* Description */}
          <p
            className="text-sm md:text-base text-white/28 max-w-lg mx-auto leading-relaxed mb-9 animate-fade-in-up"
            style={{ animationDelay: '1.4s', fontFamily: 'var(--font-sans)' }}
          >
            {companyInfo.description}
          </p>

          {/* ── CTA Buttons ── */}
          <div
            className="flex flex-col sm:flex-row gap-3 justify-center items-center mb-12 animate-fade-in-up"
            style={{ animationDelay: '1.6s' }}
          >
            {/* Primary */}
            <div className="relative group w-full sm:w-auto">
              <button
                className="relative w-full sm:w-auto rounded-xl font-bold px-10 py-4 text-sm uppercase tracking-[0.12em] overflow-hidden cursor-pointer z-10 group"
                style={{
                  background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 50%, #b91c1c 100%)',
                  color:      '#fff',
                  border:     'none',
                  boxShadow:  '0 0 30px rgba(239,68,68,0.4), 0 8px 32px rgba(239,68,68,0.25)',
                  fontFamily: 'var(--font-display)',
                }}
              >
                {/* Inner shimmer on hover */}
                <span className="absolute inset-0 bg-gradient-to-r from-transparent via-white/15 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-700 pointer-events-none" />
                <Link href="/products" className="flex items-center gap-2.5 justify-center relative z-10">
                  <Fuel className="w-4 h-4" />
                  Цени на горива
                </Link>
              </button>
            </div>

            {/* Secondary */}
            <div className="w-full sm:w-auto">
              <button
                className="w-full sm:w-auto rounded-xl font-bold px-10 py-4 text-sm uppercase tracking-[0.12em] cursor-pointer group"
                style={{
                  background:    'rgba(255,255,255,0.03)',
                  border:        '1px solid rgba(255,255,255,0.1)',
                  color:         'rgba(255,255,255,0.75)',
                  backdropFilter:'blur(12px)',
                  transition:    'all 0.25s ease',
                  fontFamily:    'var(--font-display)',
                }}
                onMouseEnter={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(239,68,68,0.35)'
                  el.style.color       = '#fff'
                  el.style.background  = 'rgba(239,68,68,0.06)'
                }}
                onMouseLeave={e => {
                  const el = e.currentTarget
                  el.style.borderColor = 'rgba(255,255,255,0.1)'
                  el.style.color       = 'rgba(255,255,255,0.75)'
                  el.style.background  = 'rgba(255,255,255,0.03)'
                }}
              >
                <Link href="/contact" className="flex items-center gap-2.5 justify-center">
                  <Phone className="w-4 h-4" />
                  Контакти
                  <ChevronRight className="w-3.5 h-3.5 opacity-50 group-hover:translate-x-0.5 transition-transform duration-200" />
                </Link>
              </button>
            </div>
          </div>

          {/* Discount banner */}
          {discountBanner.active && discountBanner.message && (
            <div className="mb-8 animate-fade-in-up" style={{ animationDelay: '0.4s' }}>
              <div
                className="inline-block px-5 py-2.5 rounded-xl"
                style={{ background: 'rgba(34,197,94,0.06)', border: '1px solid rgba(34,197,94,0.14)', backdropFilter: 'blur(12px)' }}
              >
                <p className="text-green-400 font-medium flex items-center gap-2 text-sm">
                  <Sparkles className="w-3.5 h-3.5" /> {discountBanner.message}
                </p>
              </div>
            </div>
          )}

          {/* ── Stats: premium pump-display style ── */}
          <div ref={statsRef} className="grid grid-cols-3 gap-3 md:gap-4 max-w-2xl mx-auto">
            {stats.map((stat, i) => {
              const Icon = stat.Icon
              return (
                <div
                  key={i}
                  style={{
                    opacity:    statsVisible ? 1 : 0,
                    transform:  statsVisible ? 'translateY(0)' : 'translateY(28px)',
                    transition: `opacity 0.7s ease ${0.1 + i * 0.13}s, transform 0.7s cubic-bezier(0.16,1,0.3,1) ${0.1 + i * 0.13}s`,
                  }}
                >
                  <div
                    className="relative p-5 md:p-6 rounded-xl overflow-hidden cursor-default"
                    style={{
                      background:     'rgba(255,255,255,0.022)',
                      border:         '1px solid rgba(255,255,255,0.06)',
                      backdropFilter: 'blur(20px)',
                      transformStyle: 'preserve-3d',
                      transition:     'transform 0.18s ease-out, border-color 0.25s, box-shadow 0.25s',
                      willChange:     'transform',
                      /* Inner top glow matching stat color */
                      boxShadow:      `inset 0 1px 0 ${stat.color}22`,
                    }}
                    onMouseMove={handleTilt}
                    onMouseLeave={handleTiltReset}
                  >
                    {/* Top color bar */}
                    <div
                      className="absolute top-0 inset-x-0 h-[1px]"
                      style={{ background: `linear-gradient(90deg, transparent 0%, ${stat.color}70 50%, transparent 100%)` }}
                    />

                    <div className="relative z-10">
                      <Icon className="w-3.5 h-3.5 mb-3" style={{ color: stat.color, opacity: 0.55 }} />
                      <div
                        className="text-2xl md:text-3xl font-black text-white mb-0.5 tabular-nums"
                        style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
                      >
                        {stat.val}
                      </div>
                      <div
                        className="text-[9px] md:text-[10px] font-bold uppercase tracking-[0.18em] mb-2.5"
                        style={{ color: 'rgba(255,255,255,0.3)' }}
                      >
                        {stat.label}
                      </div>
                      {/* Energy bar */}
                      <div className="w-full h-[2px] rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
                        <div
                          className="h-full rounded-full"
                          style={{
                            width:      barsVisible ? `${stat.bar}%` : '0%',
                            background: stat.color,
                            boxShadow:  `0 0 8px ${stat.color}80`,
                            transition: `width ${1 + i * 0.2}s cubic-bezier(0.34,1.56,0.64,1) ${0.3 + i * 0.1}s`,
                          }}
                        />
                      </div>
                      <div
                        className="hidden md:block text-[9px] mt-2"
                        style={{ color: 'rgba(255,255,255,0.18)', fontFamily: 'var(--font-sans)' }}
                      >
                        {stat.sub}
                      </div>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>

          {/* ── Scroll indicator ── */}
          <div
            className="flex flex-col items-center gap-2 mt-10 animate-fade-in-up"
            style={{ animationDelay: '2.2s' }}
          >
            <span
              className="text-[8px] font-bold uppercase tracking-[0.45em]"
              style={{ color: 'rgba(255,255,255,0.1)', fontFamily: 'var(--font-mono)' }}
            >
              scroll
            </span>
            <div className="w-px h-10 overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.05)' }}>
              <div
                className="w-full h-full"
                style={{
                  background: 'linear-gradient(to bottom, #ef4444, #f97316)',
                  animation:  'scroll-drop 1.8s ease-in-out infinite',
                }}
              />
            </div>
          </div>

        </div>
      </div>

      {/* Bottom fade */}
      <div
        className="absolute bottom-0 inset-x-0 h-32 pointer-events-none z-10"
        style={{ background: 'linear-gradient(to top, #0A0A0B 30%, transparent)' }}
      />

      {/* ── Keyframes ── */}
      <style>{`
        @keyframes halo-pulse {
          0%,100%{ opacity:.65; transform:scale(1)   }
          50%    { opacity:1;   transform:scale(1.08) }
        }
        @keyframes blink {
          0%,100%{ opacity:1 }
          50%    { opacity:0 }
        }
        @keyframes spin {
          from { transform:rotate(0deg) }
          to   { transform:rotate(360deg) }
        }
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
