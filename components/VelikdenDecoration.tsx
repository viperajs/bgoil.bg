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
  { body: "#b91c1c", band: "#fbbf24", dot: "#fde68a" },
  { body: "#1d4ed8", band: "#93c5fd", dot: "#dbeafe" },
  { body: "#6d28d9", band: "#c4b5fd", dot: "#ede9fe" },
  { body: "#15803d", band: "#86efac", dot: "#dcfce7" },
]
const PETAL_COLORS = ["#fda4af", "#f9a8d4", "#fde68a", "#86efac", "#c4b5fd", "#fbcfe8"]

function EasterEgg({ size, ci }: { size: number; ci: number }) {
  const p = EGG_PALETTES[ci % EGG_PALETTES.length]
  return (
    <svg width={size * 0.72} height={size} viewBox="0 0 18 24" fill="none" aria-hidden="true">
      <ellipse cx="9" cy="12" rx="8" ry="11" fill={p.body} opacity="0.88" />
      <path d="M1.5 12 Q9 10 16.5 12" stroke={p.band} strokeWidth="3" strokeLinecap="round" opacity="0.9" />
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
    <div style={{
      width: size * 0.55,
      height: size,
      background: PETAL_COLORS[ci % PETAL_COLORS.length],
      borderRadius: "50% 50% 0 50%",
      opacity: 0.55,
    }} />
  )
}

function Sparkle({ size }: { size: number }) {
  return (
    <div style={{
      width: size,
      height: size,
      borderRadius: "50%",
      background: "#fbbf24",
      opacity: 0.8,
      boxShadow: `0 0 ${size * 2}px #fbbf24, 0 0 ${size * 4}px rgba(251,191,36,0.4)`,
    }} />
  )
}

/* ─── Orthodox cross SVG — sized entirely via CSS ─── */
function OrthodoxCross() {
  return (
    <svg className="vk-cross-svg" viewBox="0 0 72 90" fill="none" aria-hidden="true">
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
      <rect x="31" y="6"  width="10" height="78" rx="4" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      <rect x="16" y="14" width="40" height="8"  rx="3" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      <rect x="6"  y="34" width="60" height="10" rx="4" fill="url(#vk-gold)" filter="url(#vk-glow)" />
      <rect x="18" y="64" width="36" height="7"  rx="3"
        fill="url(#vk-gold)" filter="url(#vk-glow)"
        transform="rotate(-18 36 67.5)"
      />
    </svg>
  )
}

/* ─── Three decorated Easter eggs for card interior ─── */
function CardEggs() {
  const eggs = [
    { body: "#b91c1c", band: "#fbbf24", dots: "#fde68a", angle: -8 },
    { body: "#6d28d9", band: "#fbbf24", dots: "#fde68a", angle:  0 },
    { body: "#15803d", band: "#fbbf24", dots: "#fde68a", angle:  8 },
  ]
  return (
    <div className="vk-card-eggs">
      {eggs.map((e, i) => (
        <svg
          key={i}
          className="vk-card-egg-svg"
          viewBox="0 0 44 56"
          fill="none"
          aria-hidden="true"
          style={{ transform: `rotate(${e.angle}deg)` }}
        >
          <ellipse cx="22" cy="53" rx="12" ry="3" fill="rgba(0,0,0,0.3)" />
          <ellipse cx="22" cy="26" rx="18" ry="24" fill={e.body} />
          <ellipse cx="16" cy="14" rx="6"  ry="9"  fill="rgba(255,255,255,0.12)" />
          <path d="M4.5 26 Q22 22 39.5 26" stroke={e.band} strokeWidth="5" strokeLinecap="round" opacity="0.9" />
          <circle cx="12" cy="15" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="32" cy="15" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="12" cy="37" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="32" cy="37" r="2.5" fill={e.dots} opacity="0.8" />
          <circle cx="22" cy="10" r="2"   fill={e.dots} opacity="0.6" />
          <ellipse cx="22" cy="26" rx="18" ry="24" fill="none" stroke={e.band} strokeWidth="0.8" opacity="0.3" />
        </svg>
      ))}
    </div>
  )
}

const CORNER_CLASSES = ["vk-corner-tl", "vk-corner-tr", "vk-corner-bl", "vk-corner-br"]

/* ═══════════════════════ Main Component ═══════════════════════ */
export default function VelikdenDecoration() {
  const [dismissed, setDismissed] = useState(true)
  const [visible, setVisible]     = useState(false)

  useEffect(() => {
    const now   = new Date()
    const start = new Date(2026, 3, 12)
    const end   = new Date(2026, 3, 13)
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
        /* ════════════════════════════════════════════════════════
           DESIGN TOKENS — all values live here, nowhere else
           ════════════════════════════════════════════════════════ */
        :root {
          /* ── Gold palette ── */
          --vk-gold-deep:    #d97706;
          --vk-gold-mid:     #fbbf24;
          --vk-gold-light:   #fde68a;
          --vk-card-bg:      rgba(10, 8, 6, 0.97);
          --vk-gold-a06:     rgba(251,191,36,0.06);
          --vk-gold-a08:     rgba(217,119,6,0.08);
          --vk-gold-a12:     rgba(251,191,36,0.12);
          --vk-gold-a14:     rgba(251,191,36,0.14);
          --vk-gold-a16:     rgba(251,191,36,0.16);
          --vk-gold-a18:     rgba(251,191,36,0.18);
          --vk-gold-a40:     rgba(251,191,36,0.4);
          --vk-gold-a60:     rgba(251,191,36,0.6);
          --vk-gold-a65:     rgba(251,191,36,0.65);

          /* ── Typography — every font-size uses clamp() ── */
          --vk-fs-brand:     clamp(0.5rem,    1vw,   0.5625rem);
          --vk-fs-label:     clamp(0.5625rem, 1.4vw, 0.625rem);
          --vk-fs-btn:       clamp(0.625rem,  1.8vw, 0.75rem);
          --vk-fs-body:      clamp(0.8125rem, 2.2vw, 0.875rem);
          --vk-fs-sub:       clamp(1rem,      3vw,   1.35rem);
          --vk-fs-heading:   clamp(1.9rem,    6vw,   2.9rem);

          /* ── Letter spacing ── */
          --vk-ls-wide:      0.22em;
          --vk-ls-heading:   0.06em;
          --vk-ls-sub:       0.08em;
          --vk-ls-btn:       0.14em;
          --vk-ls-body:      0.01em;

          /* ── Spacing — every value uses clamp() ── */
          --vk-backdrop-pad: clamp(0.75rem,  3vw,  1rem);
          --vk-pad-t:        clamp(1.75rem,  5vw,  2.75rem);
          --vk-pad-x:        clamp(1.25rem,  5vw,  2.5rem);
          --vk-pad-b:        clamp(1.25rem,  4vw,  2.25rem);
          --vk-pill-py:      clamp(0.25rem,  1vw,  0.3125rem);
          --vk-pill-px:      clamp(0.625rem, 2vw,  1rem);
          --vk-btn-py:       clamp(0.625rem, 2vw,  0.8125rem);
          --vk-gap-sm:       clamp(0.375rem, 1.2vw,0.5rem);
          --vk-gap-md:       clamp(0.5rem,   1.8vw,0.75rem);
          --vk-gap-lg:       clamp(0.625rem, 2vw,  1rem);
          --vk-mb-xs:        clamp(0.5rem,   1.8vw,0.625rem);
          --vk-mb-sm:        clamp(0.75rem,  2.5vw,1.125rem);
          --vk-mb-md:        clamp(1rem,     3vw,  1.25rem);
          --vk-mb-lg:        clamp(1.25rem,  4vw,  1.75rem);
          --vk-corner-off:   clamp(0.875rem, 2.5vw,1.25rem);

          /* ── Sizing ── */
          --vk-card-max-w:   clamp(18rem,   90vw,  33.75rem);
          --vk-card-radius:  clamp(1.25rem,  4vw,  2rem);
          --vk-btn-radius:   clamp(0.75rem,  2vw,  1rem);
          --vk-close-size:   clamp(1.75rem,  5vw,  2.125rem);
          --vk-pulse-d:      clamp(5.5rem,  15vw,  6.875rem);
          --vk-pulse-top:    clamp(1.5rem,   4vw,  2rem);
          --vk-cross-w:      clamp(3.5rem,  10vw,  4.5rem);
          --vk-cross-h:      clamp(4.375rem,12vw,  5.625rem);
          --vk-egg-w:        clamp(2.5rem,   7vw,  2.75rem);
          --vk-sep-dot:      clamp(0.3rem,  0.8vw, 0.375rem);
          --vk-body-max-w:   clamp(16rem,   80vw,  20rem);
          --vk-sparkle-dot:  clamp(0.25rem, 0.8vw, 0.3125rem);
          --vk-glow-top-h:   clamp(8rem,   25vw,  13.75rem);
          --vk-glow-btm-h:   clamp(5rem,   15vw,   8.75rem);
        }

        /* ════════════════════════════════════════════════════════
           KEYFRAMES
           ════════════════════════════════════════════════════════ */
        @keyframes vk-fall {
          0%   { transform: translateY(-60px) rotate(0deg);   opacity: 0;   }
          7%   { opacity: 1; }
          86%  { opacity: 0.75; }
          100% { transform: translateY(106vh) rotate(580deg); opacity: 0;   }
        }
        @keyframes vk-sway {
          0%,100% { transform: translateX(0px);   }
          30%     { transform: translateX(18px);  }
          70%     { transform: translateX(-13px); }
        }
        @keyframes vk-backdrop-in  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes vk-backdrop-out { from { opacity: 1 } to { opacity: 0 } }
        @keyframes vk-card-in {
          0%   { transform: scale(0.78) translateY(28px); opacity: 0; }
          100% { transform: scale(1)    translateY(0px);  opacity: 1; }
        }
        @keyframes vk-card-out {
          0%   { transform: scale(1)    translateY(0px);  opacity: 1; }
          100% { transform: scale(0.86) translateY(14px); opacity: 0; }
        }
        @keyframes vk-float {
          0%,100% { transform: translateY(0px)  rotate(0deg); }
          50%     { transform: translateY(-9px) rotate(2deg); }
        }
        @keyframes vk-cross-glow {
          0%,100% { filter: drop-shadow(0 0 8px  rgba(251,191,36,0.5)); }
          50%     { filter: drop-shadow(0 0 20px rgba(251,191,36,0.9)); }
        }
        @keyframes vk-gold-shimmer {
          0%   { background-position: 0%   center; }
          100% { background-position: 300% center; }
        }
        /* translateX(-50%) is baked into the keyframe so the animation
           doesn't override the centering transform */
        @keyframes vk-pulse-ring {
          0%   { transform: translateX(-50%) scale(0.95); opacity: 0.6; }
          50%  { transform: translateX(-50%) scale(1.05); opacity: 1;   }
          100% { transform: translateX(-50%) scale(0.95); opacity: 0.6; }
        }
        @keyframes vk-sparkle-drift {
          0%,100% { transform: translateY(0)    scale(1);   opacity: 0.8; }
          50%     { transform: translateY(-4px) scale(1.3); opacity: 1;   }
        }

        /* ════════════════════════════════════════════════════════
           ANIMATION HELPERS
           ════════════════════════════════════════════════════════ */
        .vk-backdrop-in  { animation: vk-backdrop-in  0.4s ease forwards; }
        .vk-backdrop-out { animation: vk-backdrop-out 0.4s ease forwards; }
        .vk-card-in  { animation: vk-card-in  0.55s cubic-bezier(0.34,1.56,0.64,1) forwards; }
        .vk-card-out { animation: vk-card-out 0.35s cubic-bezier(0.4,0,0.6,1) forwards; }
        .vk-float    { animation: vk-float     3.5s ease-in-out infinite; }
        .vk-cross    { animation: vk-cross-glow 2.8s ease-in-out infinite; }
        .vk-pulse    { animation: vk-pulse-ring 2.5s ease-in-out infinite; }
        .vk-sparkle  { animation: vk-sparkle-drift 2s  ease-in-out infinite; }

        /* ── Shimmer text ── */
        .vk-gold-shimmer,
        .vk-response-shimmer {
          background-size: 300% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
        }
        .vk-gold-shimmer {
          background-image: linear-gradient(90deg,
            var(--vk-gold-deep), var(--vk-gold-mid), var(--vk-gold-light),
            var(--vk-gold-mid), var(--vk-gold-deep));
          animation: vk-gold-shimmer 5s linear infinite;
        }
        .vk-response-shimmer {
          background-image: linear-gradient(90deg,
            var(--vk-gold-light), var(--vk-gold-mid), var(--vk-gold-deep),
            var(--vk-gold-mid), var(--vk-gold-light));
          animation: vk-gold-shimmer 6s linear infinite reverse;
        }

        /* ════════════════════════════════════════════════════════
           LAYOUT
           ════════════════════════════════════════════════════════ */
        .vk-backdrop {
          position: fixed;
          inset: 0;
          z-index: 120;
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(0,0,0,0.82);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          cursor: pointer;
          padding: var(--vk-backdrop-pad);
        }

        .vk-card {
          position: relative;
          width: 100%;
          max-width: var(--vk-card-max-w);
          border-radius: var(--vk-card-radius);
          overflow: hidden;
          background: var(--vk-card-bg);
          border: 1px solid var(--vk-gold-a12);
          backdrop-filter: blur(40px);
          -webkit-backdrop-filter: blur(40px);
          box-shadow:
            0 60px 140px rgba(0,0,0,0.9),
            0 0 0 1px rgba(251,191,36,0.07),
            0 0 120px rgba(251,191,36,0.07);
          cursor: default;
        }

        /* ── Decorative accents ── */
        .vk-accent-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: linear-gradient(90deg,
            transparent 0%,
            var(--vk-gold-deep) 20%,
            var(--vk-gold-mid) 50%,
            var(--vk-gold-light) 65%,
            var(--vk-gold-mid) 80%,
            transparent 100%);
        }
        .vk-accent-btm {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: 1px;
          background: linear-gradient(90deg,
            transparent,
            rgba(251,191,36,0.25),
            transparent);
        }
        .vk-glow-top {
          position: absolute;
          top: 0; left: 0; right: 0;
          height: var(--vk-glow-top-h);
          pointer-events: none;
          background: radial-gradient(ellipse at 50% -15%,
            rgba(251,191,36,0.08) 0%, transparent 70%);
        }
        .vk-glow-btm {
          position: absolute;
          bottom: 0; left: 0; right: 0;
          height: var(--vk-glow-btm-h);
          pointer-events: none;
          background: radial-gradient(ellipse at 50% 120%,
            rgba(185,28,28,0.07) 0%, transparent 70%);
        }

        /* ── Corner sparkles ── */
        .vk-corner-sparkle {
          position: absolute;
          width: var(--vk-sparkle-dot);
          height: var(--vk-sparkle-dot);
          border-radius: 50%;
          background: var(--vk-gold-mid);
          box-shadow: 0 0 8px var(--vk-gold-mid), 0 0 20px rgba(251,191,36,0.5);
          pointer-events: none;
        }
        .vk-corner-tl { top:    var(--vk-corner-off); left:  var(--vk-corner-off); }
        .vk-corner-tr { top:    var(--vk-corner-off); right: var(--vk-corner-off); }
        .vk-corner-bl { bottom: var(--vk-corner-off); left:  var(--vk-corner-off); }
        .vk-corner-br { bottom: var(--vk-corner-off); right: var(--vk-corner-off); }

        /* ── Close button ── */
        .vk-close-btn {
          position: absolute;
          top: var(--vk-gap-lg);
          right: var(--vk-gap-lg);
          z-index: 20;
          width: var(--vk-close-size);
          height: var(--vk-close-size);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--vk-gold-a06);
          border: 1px solid var(--vk-gold-a14);
          color: var(--vk-gold-a40);
          cursor: pointer;
          transition: background 0.2s, color 0.2s;
        }
        .vk-close-btn:hover {
          background: var(--vk-gold-a14);
          color: rgba(251,191,36,0.9);
        }

        /* ── Content area ── */
        .vk-content {
          padding: var(--vk-pad-t) var(--vk-pad-x) var(--vk-pad-b);
          text-align: center;
          position: relative;
          z-index: 5;
        }

        /* ── Cross ── */
        .vk-cross-wrap {
          display: flex;
          justify-content: center;
          margin-bottom: var(--vk-mb-md);
        }
        .vk-cross-svg {
          width: var(--vk-cross-w);
          height: var(--vk-cross-h);
        }

        /* ── Pulse ring ── */
        .vk-pulse-ring {
          position: absolute;
          top: var(--vk-pulse-top);
          left: 50%;
          /* translateX(-50%) is also in the keyframe so they stay in sync */
          width: var(--vk-pulse-d);
          height: var(--vk-pulse-d);
          border-radius: 50%;
          border: 1px solid var(--vk-gold-a12);
          pointer-events: none;
        }

        /* ── Date pill ── */
        .vk-date-pill {
          display: inline-flex;
          align-items: center;
          gap: var(--vk-gap-sm);
          padding: var(--vk-pill-py) var(--vk-pill-px);
          border-radius: 999px;
          margin-bottom: var(--vk-mb-sm);
          background: var(--vk-gold-a06);
          border: 1px solid var(--vk-gold-a16);
        }
        .vk-date-label {
          font-size: var(--vk-fs-label);
          font-weight: 700;
          letter-spacing: var(--vk-ls-wide);
          text-transform: uppercase;
          font-family: var(--font-mono);
          color: var(--vk-gold-a60);
        }

        /* ── Headings ── */
        .vk-heading {
          font-family: var(--font-display);
          font-size: var(--vk-fs-heading);
          font-weight: 900;
          letter-spacing: var(--vk-ls-heading);
          line-height: 1.1;
          margin-bottom: var(--vk-mb-xs);
        }
        .vk-response {
          font-family: var(--font-display);
          font-size: var(--vk-fs-sub);
          font-weight: 700;
          letter-spacing: var(--vk-ls-sub);
          margin-bottom: var(--vk-mb-lg);
        }

        /* ── Separator ── */
        .vk-separator {
          display: flex;
          align-items: center;
          gap: var(--vk-gap-md);
          margin-bottom: var(--vk-mb-lg);
        }
        .vk-sep-line       { flex: 1; height: 1px; }
        .vk-sep-line-l     { background: linear-gradient(90deg, transparent, rgba(251,191,36,0.2)); }
        .vk-sep-line-r     { background: linear-gradient(90deg, rgba(251,191,36,0.2), transparent); }
        .vk-sep-dot {
          width: var(--vk-sep-dot);
          height: var(--vk-sep-dot);
          border-radius: 50%;
          background: var(--vk-gold-mid);
          box-shadow: 0 0 10px var(--vk-gold-mid);
        }

        /* ── Card eggs ── */
        .vk-card-eggs {
          display: flex;
          justify-content: center;
          align-items: flex-end;
          gap: var(--vk-gap-lg);
          margin-bottom: var(--vk-mb-lg);
        }
        .vk-card-egg-svg {
          /* 44:56 ≈ 0.786 — preserve aspect ratio via height */
          width: var(--vk-egg-w);
          height: calc(var(--vk-egg-w) * 1.272);
          filter: drop-shadow(0 4px 12px rgba(0,0,0,0.5));
        }

        /* ── Body text ── */
        .vk-body-text {
          font-family: var(--font-sans);
          font-size: var(--vk-fs-body);
          font-weight: 400;
          line-height: 1.75;
          letter-spacing: var(--vk-ls-body);
          color: rgba(255,255,255,0.4);
          margin-bottom: var(--vk-mb-lg);
          max-width: var(--vk-body-max-w);
          margin-left: auto;
          margin-right: auto;
        }
        .vk-brand-accent {
          color: var(--vk-gold-a65);
          font-weight: 600;
        }

        /* ── Brand divider ── */
        .vk-brand-divider {
          display: flex;
          align-items: center;
          gap: var(--vk-gap-lg);
          margin-bottom: var(--vk-mb-md);
        }
        .vk-brand-line { flex: 1; height: 1px; background: rgba(255,255,255,0.04); }
        .vk-brand-label {
          font-size: var(--vk-fs-brand);
          font-weight: 700;
          letter-spacing: var(--vk-ls-wide);
          text-transform: uppercase;
          font-family: var(--font-mono);
          color: rgba(255,255,255,0.15);
        }

        /* ── Dismiss button ── */
        .vk-dismiss-btn {
          width: 100%;
          padding: var(--vk-btn-py) 0;
          border-radius: var(--vk-btn-radius);
          font-family: var(--font-display);
          font-size: var(--vk-fs-btn);
          font-weight: 700;
          letter-spacing: var(--vk-ls-btn);
          text-transform: uppercase;
          color: var(--vk-gold-a60);
          background: linear-gradient(135deg, var(--vk-gold-a06), var(--vk-gold-a08));
          border: 1px solid var(--vk-gold-a18);
          cursor: pointer;
          transition: color 0.25s, border-color 0.25s, background 0.25s;
        }
        .vk-dismiss-btn:hover {
          color: rgba(251,191,36,0.95);
          border-color: var(--vk-gold-a40);
          background: linear-gradient(135deg, var(--vk-gold-a14), rgba(217,119,6,0.14));
        }
      `}</style>

      {/* ── Backdrop ── */}
      <div
        className={`vk-backdrop ${visible ? "vk-backdrop-in" : "vk-backdrop-out"}`}
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
          className={`vk-card ${visible ? "vk-card-in" : "vk-card-out"}`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="vk-accent-top" />
          <div className="vk-glow-top" />
          <div className="vk-glow-btm" />

          {/* Corner sparkles */}
          {CORNER_CLASSES.map((cls, i) => (
            <div
              key={i}
              className={`vk-sparkle vk-corner-sparkle ${cls}`}
              style={{ animationDelay: `${i * 0.6}s` }}
            />
          ))}

          {/* Close button */}
          <button className="vk-close-btn" onClick={dismiss} aria-label="Затвори">
            <X size={14} />
          </button>

          {/* ── Content ── */}
          <div className="vk-content">

            {/* Orthodox Cross */}
            <div className="vk-float vk-cross-wrap">
              <div className="vk-cross">
                <OrthodoxCross />
              </div>
            </div>

            {/* Pulse ring */}
            <div className="vk-pulse vk-pulse-ring" />

            {/* Date pill */}
            <div className="vk-date-pill">
              <span className="vk-date-label">✦&nbsp;&nbsp;12 Април 2026&nbsp;&nbsp;✦</span>
            </div>

            {/* Main heading */}
            <h2 className="vk-heading vk-gold-shimmer">ХРИСТОС ВОСКРЕСЕ!</h2>

            {/* Orthodox response */}
            <p className="vk-response vk-response-shimmer">ВОИСТИНУ ВОСКРЕСЕ!</p>

            {/* Separator */}
            <div className="vk-separator">
              <div className="vk-sep-line vk-sep-line-l" />
              <div className="vk-sep-dot" />
              <div className="vk-sep-line vk-sep-line-r" />
            </div>

            {/* Decorated Easter eggs */}
            <CardEggs />

            {/* Greeting text */}
            <p className="vk-body-text">
              Светли Великденски празници от целия екип на&nbsp;
              <span className="vk-brand-accent">BG OIL Враца</span>!
              Нека светлината на Великден озари вашите домове с мир и радост.
            </p>

            {/* Brand divider */}
            <div className="vk-brand-divider">
              <div className="vk-brand-line" />
              <span className="vk-brand-label">БГ ОЙЛ ВРАЦА</span>
              <div className="vk-brand-line" />
            </div>

            {/* Dismiss button */}
            <button className="vk-dismiss-btn" onClick={dismiss}>
              Затвори
            </button>
          </div>

          <div className="vk-accent-btm" />
        </div>
      </div>
    </>
  )
}
