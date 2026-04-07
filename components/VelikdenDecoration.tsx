"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

/* ─── Falling elements: Easter eggs + petals + gold sparkles ─── */
const ELEMENTS = [
  { left:  3, delay: 0.0, dur: 8.2, size: 22, type: 0, ci: 0 },
  { left:  8, delay: 1.4, dur: 6.0, size:  7, type: 2, ci: 0 },
  { left: 13, delay: 0.6, dur: 7.8, size: 13, type: 1, ci: 1 },
  { left: 18, delay: 2.2, dur: 9.2, size: 26, type: 0, ci: 1 },
  { left: 23, delay: 0.9, dur: 5.8, size:  7, type: 2, ci: 0 },
  { left: 28, delay: 1.7, dur: 7.5, size: 15, type: 1, ci: 2 },
  { left: 33, delay: 0.3, dur: 8.8, size: 20, type: 0, ci: 2 },
  { left: 38, delay: 2.5, dur: 6.5, size:  7, type: 2, ci: 0 },
  { left: 43, delay: 1.1, dur: 8.0, size: 13, type: 1, ci: 3 },
  { left: 48, delay: 0.5, dur: 9.8, size: 28, type: 0, ci: 3 },
  { left: 53, delay: 1.9, dur: 6.8, size:  7, type: 2, ci: 0 },
  { left: 58, delay: 0.8, dur: 7.8, size: 15, type: 1, ci: 0 },
  { left: 63, delay: 2.3, dur: 8.5, size: 22, type: 0, ci: 0 },
  { left: 68, delay: 1.3, dur: 6.2, size:  7, type: 2, ci: 0 },
  { left: 73, delay: 0.4, dur: 9.0, size: 13, type: 1, ci: 1 },
  { left: 78, delay: 2.0, dur: 8.0, size: 24, type: 0, ci: 2 },
  { left: 83, delay: 1.6, dur: 7.0, size:  7, type: 2, ci: 0 },
  { left: 88, delay: 0.7, dur: 7.5, size: 15, type: 1, ci: 3 },
  { left: 93, delay: 2.4, dur: 9.0, size: 20, type: 0, ci: 1 },
  { left: 11, delay: 3.1, dur: 7.5, size: 18, type: 0, ci: 3 },
  { left: 35, delay: 3.3, dur: 8.2, size: 12, type: 1, ci: 2 },
  { left: 57, delay: 3.6, dur: 6.8, size: 26, type: 0, ci: 0 },
  { left: 76, delay: 3.0, dur: 9.2, size:  7, type: 2, ci: 0 },
  { left: 21, delay: 3.8, dur: 7.2, size: 13, type: 1, ci: 0 },
  { left: 66, delay: 3.5, dur: 8.6, size: 22, type: 0, ci: 2 },
]

const EGG_PALETTES = [
  { body: "#b91c1c", band: "#fbbf24", dot: "#fde68a" }, // red / gold
  { body: "#1d4ed8", band: "#93c5fd", dot: "#dbeafe" }, // blue / sky
  { body: "#6d28d9", band: "#c4b5fd", dot: "#ede9fe" }, // purple / violet
  { body: "#15803d", band: "#86efac", dot: "#dcfce7" }, // green / mint
]
const PETAL_COLORS = ["#fda4af", "#f9a8d4", "#fde68a", "#86efac", "#c4b5fd", "#fbcfe8"]

function EasterEgg({ size, ci }: { size: number; ci: number }) {
  const p = EGG_PALETTES[ci % EGG_PALETTES.length]
  const w = size * 0.72
  const h = size
  return (
    <svg width={w} height={h} viewBox="0 0 18 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="12" rx="8" ry="11" fill={p.body} opacity="0.88" />
      {/* horizontal band */}
      <path d="M1.5 12 Q9 10 16.5 12" stroke={p.band} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
      {/* dots */}
      <circle cx="5"  cy="8"  r="1.2" fill={p.dot} opacity="0.75" />
      <circle cx="13" cy="8"  r="1.2" fill={p.dot} opacity="0.75" />
      <circle cx="5"  cy="16" r="1.2" fill={p.dot} opacity="0.75" />
      <circle cx="13" cy="16" r="1.2" fill={p.dot} opacity="0.75" />
      <circle cx="9"  cy="5"  r="1"   fill={p.dot} opacity="0.5"  />
    </svg>
  )
}

function Petal({ size, ci }: { size: number; ci: number }) {
  return (
    <div
      style={{
        width: size * 0.55,
        height: size,
        background: PETAL_COLORS[ci % PETAL_COLORS.length],
        borderRadius: "50% 50% 0 50%",
        opacity: 0.55,
      }}
    />
  )
}

function Sparkle({ size }: { size: number }) {
  return (
    <div
      style={{
        width: size,
        height: size,
        borderRadius: "50%",
        background: "#fbbf24",
        opacity: 0.8,
        boxShadow: `0 0 ${size * 2}px #fbbf24, 0 0 ${size * 4}px rgba(251,191,36,0.4)`,
      }}
    />
  )
}

/* ─── Orthodox cross SVG ─── */
function OrthodoxCross() {
  return (
    <svg width="72" height="90" viewBox="0 0 72 90" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id="vk-gold" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor="#fde68a" />
          <stop offset="40%"  stopColor="#fbbf24" />
          <stop offset="100%" stopColor="#d97706" />
        </linearGradient>
        <filter id="vk-glow">
          <feGaussianBlur stdDeviation="2.5" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
      {/* Vertical beam */}
      <rect x="31" y="6" width="10" height="78" rx="4" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      {/* Top crossbeam (INRI plaque) */}
      <rect x="16" y="14" width="40" height="8" rx="3" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      {/* Main crossbeam */}
      <rect x="6"  y="34" width="60" height="10" rx="4" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      {/* Lower angled beam (Orthodox style) */}
      <rect
        x="18" y="64" width="36" height="7" rx="3"
        fill="url(#vk-gold)" filter="url(#vk-glow)"
        transform="rotate(-18 36 67.5)"
      />
    </svg>
  )
}

/* ─── Three decorated Easter eggs for card interior ─── */
function CardEggs() {
  const eggs = [
    { body: "#b91c1c", band: "#fbbf24", dots: "#fde68a", angle: -8  },
    { body: "#6d28d9", band: "#fbbf24", dots: "#fde68a", angle:  0  },
    { body: "#15803d", band: "#fbbf24", dots: "#fde68a", angle:  8  },
  ]
  return (
    <div style={{ display: "flex", justifyContent: "center", gap: 18, alignItems: "flex-end" }}>
      {eggs.map((e, i) => (
        <svg
          key={i}
          width="44" height="56"
          viewBox="0 0 44 56"
          fill="none"
          aria-hidden="true"
          style={{ transform: `rotate(${e.angle}deg)`, filter: "drop-shadow(0 4px 12px rgba(0,0,0,0.5))" }}
        >
          {/* Shadow */}
          <ellipse cx="22" cy="53" rx="12" ry="3" fill="rgba(0,0,0,0.3)" />
          {/* Body */}
          <ellipse cx="22" cy="26" rx="18" ry="24" fill={e.body} />
          {/* Gloss */}
          <ellipse cx="16" cy="14" rx="6" ry="9" fill="rgba(255,255,255,0.12)" />
          {/* Band */}
          <path d="M4.5 26 Q22 22 39.5 26" stroke={e.band} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          {/* Top dots */}
          <circle cx="12" cy="15" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="32" cy="15" r="2.5" fill={e.dots} opacity="0.8" />
          {/* Bottom dots */}
          <circle cx="12" cy="37" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="32" cy="37" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="22" cy="10" r="2"   fill={e.dots} opacity="0.6" />
          {/* Border */}
          <ellipse cx="22" cy="26" rx="18" ry="24" fill="none" stroke={e.band} strokeWidth="0.8" opacity="0.3" />
        </svg>
      ))}
    </div>
  )
}

/* ═══════════════════════ Main Component ═══════════════════════ */
export default function VelikdenDecoration() {
  const [dismissed, setDismissed] = useState(true)
  const [visible, setVisible]     = useState(false)

  useEffect(() => {
    const now   = new Date()
    const start = new Date(2026, 3, 11)  // April 11 — show from today
    const end   = new Date(2026, 3, 13) // April 13 — hide after this
    if (now >= start && now < end) {
      if (!sessionStorage.getItem("velikden-2026")) {
        setDismissed(false)
        setTimeout(() => setVisible(true), 100)
      }
    }
  }, [])

  const dismiss = () => {
    setVisible(false)
    setTimeout(() => {
      sessionStorage.setItem("velikden-2026", "1")
      setDismissed(true)
    }, 380)
  }

  if (dismissed) return null

  return (
    <>
      <style>{`
        @keyframes vk-fall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0;   }
          7%   { opacity: 1; }
          86%  { opacity: 0.75; }
          100% { transform: translateY(106vh) rotate(580deg); opacity: 0;   }
        }
        @keyframes vk-sway {
          0%,100% { transform: translateX(0px); }
          30%     { transform: translateX(18px); }
          70%     { transform: translateX(-13px); }
        }
        @keyframes vk-backdrop-in  { from { opacity:0 } to { opacity:1 } }
        @keyframes vk-backdrop-out { from { opacity:1 } to { opacity:0 } }
        @keyframes vk-card-in {
          0%   { transform: scale(0.78) translateY(28px); opacity: 0; }
          100% { transform: scale(1)    translateY(0px);  opacity: 1; }
        }
        @keyframes vk-card-out {
          0%   { transform: scale(1)    translateY(0px);  opacity: 1; }
          100% { transform: scale(0.86) translateY(14px); opacity: 0; }
        }
        @keyframes vk-float {
          0%,100% { transform: translateY(0px)  rotate(0deg);  }
          50%     { transform: translateY(-9px) rotate(2deg);  }
        }
        @keyframes vk-cross-glow {
          0%,100% { filter: drop-shadow(0 0 8px rgba(251,191,36,0.5));  }
          50%     { filter: drop-shadow(0 0 20px rgba(251,191,36,0.9)); }
        }
        @keyframes vk-gold-shimmer {
          0%   { background-position: 0%   center; }
          100% { background-position: 300% center; }
        }
        @keyframes vk-pulse-ring {
          0%   { transform: scale(0.95); opacity: 0.6; }
          50%  { transform: scale(1.05); opacity: 1;   }
          100% { transform: scale(0.95); opacity: 0.6; }
        }
        @keyframes vk-sparkle-drift {
          0%,100% { transform: translateY(0) scale(1);   opacity:0.8; }
          50%     { transform: translateY(-4px) scale(1.3); opacity:1;   }
        }
        .vk-backdrop-in  { animation: vk-backdrop-in  0.4s ease forwards; }
        .vk-backdrop-out { animation: vk-backdrop-out 0.4s ease forwards; }
        .vk-card-in  { animation: vk-card-in  0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .vk-card-out { animation: vk-card-out 0.35s cubic-bezier(0.4,0,0.6,1) forwards; }
        .vk-float    { animation: vk-float 3.5s ease-in-out infinite; }
        .vk-cross    { animation: vk-cross-glow 2.8s ease-in-out infinite; }
        .vk-gold-shimmer {
          background: linear-gradient(90deg, #d97706, #fbbf24, #fde68a, #fbbf24, #d97706);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: vk-gold-shimmer 5s linear infinite;
        }
        .vk-response-shimmer {
          background: linear-gradient(90deg, #fde68a, #fbbf24, #d97706, #fbbf24, #fde68a);
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: vk-gold-shimmer 6s linear infinite reverse;
        }
        .vk-pulse { animation: vk-pulse-ring 2.5s ease-in-out infinite; }
        .vk-sparkle { animation: vk-sparkle-drift 2s ease-in-out infinite; }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className={visible ? "vk-backdrop-in" : "vk-backdrop-out"}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 120,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.82)",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          cursor: "pointer",
          padding: "16px",
        }}
        onClick={dismiss}
      >
        {/* ── Falling elements ── */}
        {ELEMENTS.map((el, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${el.left}%`,
              pointerEvents: "none",
              animation: `vk-fall ${el.dur}s ease-in ${el.delay}s infinite`,
            }}
          >
            <div style={{ animation: `vk-sway ${el.dur * 0.6}s ease-in-out ${el.delay * 0.4}s infinite` }}>
              {el.type === 0 && <EasterEgg size={el.size} ci={el.ci} />}
              {el.type === 1 && <Petal     size={el.size} ci={el.ci} />}
              {el.type === 2 && <Sparkle   size={el.size} />}
            </div>
          </div>
        ))}

        {/* ── Modal card ── */}
        <div
          className={visible ? "vk-card-in" : "vk-card-out"}
          style={{
            position: "relative",
            width: "100%",
            maxWidth: 540,
            borderRadius: 32,
            overflow: "hidden",
            background: "rgba(10, 8, 6, 0.97)",
            border: "1px solid rgba(251,191,36,0.12)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow: [
              "0 60px 140px rgba(0,0,0,0.9)",
              "0 0 0 1px rgba(251,191,36,0.07)",
              "0 0 120px rgba(251,191,36,0.07)",
            ].join(", "),
            cursor: "default",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Gold top accent */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 2,
            background: "linear-gradient(90deg, transparent 0%, #d97706 20%, #fbbf24 50%, #fde68a 65%, #fbbf24 80%, transparent 100%)",
          }} />

          {/* Inner top glow */}
          <div style={{
            position: "absolute", top: 0, left: 0, right: 0, height: 220, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% -15%, rgba(251,191,36,0.08) 0%, transparent 70%)",
          }} />

          {/* Bottom glow */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 140, pointerEvents: "none",
            background: "radial-gradient(ellipse at 50% 120%, rgba(185,28,28,0.07) 0%, transparent 70%)",
          }} />

          {/* Corner sparkles */}
          {[
            { top: 20, left: 20 },
            { top: 20, right: 20 },
            { bottom: 20, left: 20 },
            { bottom: 20, right: 20 },
          ].map((pos, i) => (
            <div
              key={i}
              className="vk-sparkle"
              style={{
                position: "absolute",
                ...pos,
                width: 5,
                height: 5,
                borderRadius: "50%",
                background: "#fbbf24",
                boxShadow: "0 0 8px #fbbf24, 0 0 20px rgba(251,191,36,0.5)",
                animationDelay: `${i * 0.6}s`,
                pointerEvents: "none",
              }}
            />
          ))}

          {/* Close button */}
          <button
            onClick={dismiss}
            aria-label="Затвори"
            style={{
              position: "absolute", top: 16, right: 16, zIndex: 20,
              width: 34, height: 34, borderRadius: "50%",
              display: "flex", alignItems: "center", justifyContent: "center",
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.14)",
              color: "rgba(251,191,36,0.4)",
              cursor: "pointer",
              transition: "all 0.2s",
            }}
            onMouseEnter={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = "rgba(251,191,36,0.15)"
              el.style.color = "rgba(251,191,36,0.9)"
            }}
            onMouseLeave={(e) => {
              const el = e.currentTarget as HTMLButtonElement
              el.style.background = "rgba(251,191,36,0.06)"
              el.style.color = "rgba(251,191,36,0.4)"
            }}
          >
            <X size={14} />
          </button>

          {/* ── Content ── */}
          <div style={{ padding: "44px 40px 36px", textAlign: "center", position: "relative", zIndex: 5 }}>

            {/* Orthodox Cross */}
            <div className="vk-float" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <div className="vk-cross">
                <OrthodoxCross />
              </div>
            </div>

            {/* Pulse ring around cross area */}
            <div className="vk-pulse" style={{
              position: "absolute", top: 32, left: "50%", transform: "translateX(-50%)",
              width: 110, height: 110, borderRadius: "50%",
              border: "1px solid rgba(251,191,36,0.12)",
              pointerEvents: "none",
            }} />

            {/* Date pill */}
            <div style={{
              display: "inline-flex", alignItems: "center", gap: 8,
              padding: "5px 16px", borderRadius: 999, marginBottom: 18,
              background: "rgba(251,191,36,0.06)",
              border: "1px solid rgba(251,191,36,0.16)",
            }}>
              <span style={{
                fontSize: 10, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", fontFamily: "var(--font-mono)",
                color: "rgba(251,191,36,0.6)",
              }}>
                ✦&nbsp;&nbsp;19 Април 2026&nbsp;&nbsp;✦
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="vk-gold-shimmer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1.9rem, 6vw, 2.9rem)",
                fontWeight: 900,
                letterSpacing: "0.06em",
                lineHeight: 1.1,
                marginBottom: 10,
              }}
            >
              ХРИСТОС ВОСКРЕСЕ!
            </h2>

            {/* Orthodox response */}
            <p
              className="vk-response-shimmer"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(1rem, 3vw, 1.35rem)",
                fontWeight: 700,
                letterSpacing: "0.08em",
                marginBottom: 28,
              }}
            >
              ВОИСТИНУ ВОСКРЕСЕ!
            </p>

            {/* Separator */}
            <div style={{
              display: "flex", alignItems: "center", gap: 10, marginBottom: 28,
            }}>
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.2))" }} />
              <div style={{ width: 6, height: 6, borderRadius: "50%", background: "#fbbf24", boxShadow: "0 0 10px #fbbf24" }} />
              <div style={{ flex: 1, height: 1, background: "linear-gradient(90deg, rgba(251,191,36,0.2), transparent)" }} />
            </div>

            {/* Decorated Easter eggs */}
            <div style={{ marginBottom: 28 }}>
              <CardEggs />
            </div>

            {/* Greeting text */}
            <p style={{
              fontFamily: "var(--font-sans)",
              fontSize: 14, fontWeight: 400, lineHeight: 1.75,
              letterSpacing: "0.01em", textTransform: "none",
              color: "rgba(255,255,255,0.4)",
              marginBottom: 28,
              maxWidth: 320,
              marginLeft: "auto", marginRight: "auto",
            }}>
              Светли Великденски празници от целия екип на&nbsp;
              <span style={{ color: "rgba(251,191,36,0.65)", fontWeight: 600 }}>BG OIL Враца</span>!
              Нека светлината на Великден озари вашите домове с мир и радост.
            </p>

            {/* Brand divider */}
            <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 22 }}>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
              <span style={{
                fontSize: 9, fontWeight: 700, letterSpacing: "0.22em",
                textTransform: "uppercase", fontFamily: "var(--font-mono)",
                color: "rgba(255,255,255,0.15)",
              }}>
                БГ ОЙЛ ВРАЦА
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.04)" }} />
            </div>

            {/* Dismiss button */}
            <button
              onClick={dismiss}
              style={{
                width: "100%", padding: "13px 0",
                borderRadius: 16,
                fontFamily: "var(--font-display)",
                fontSize: 12, fontWeight: 700,
                letterSpacing: "0.14em", textTransform: "uppercase",
                color: "rgba(251,191,36,0.6)",
                background: "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(217,119,6,0.08))",
                border: "1px solid rgba(251,191,36,0.18)",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = "rgba(251,191,36,0.95)"
                el.style.borderColor = "rgba(251,191,36,0.4)"
                el.style.background = "linear-gradient(135deg, rgba(251,191,36,0.14), rgba(217,119,6,0.14))"
              }}
              onMouseLeave={(e) => {
                const el = e.currentTarget as HTMLButtonElement
                el.style.color = "rgba(251,191,36,0.6)"
                el.style.borderColor = "rgba(251,191,36,0.18)"
                el.style.background = "linear-gradient(135deg, rgba(251,191,36,0.08), rgba(217,119,6,0.08))"
              }}
            >
              Затвори
            </button>
          </div>

          {/* Bottom gold accent */}
          <div style={{
            position: "absolute", bottom: 0, left: 0, right: 0, height: 1,
            background: "linear-gradient(90deg, transparent, rgba(251,191,36,0.25), transparent)",
          }} />
        </div>
      </div>
    </>
  )
}
