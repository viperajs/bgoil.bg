"use client"

import { useState, useEffect } from "react"
import { X } from "lucide-react"

// Deterministic petal positions — 14 petals across the viewport
const PETALS = [
  { left:  4, delay: 0.0, dur: 7.5, size: 13, type: 0, colorIdx: 0 },
  { left: 11, delay: 1.3, dur: 6.0, size: 10, type: 1, colorIdx: 1 },
  { left: 18, delay: 0.5, dur: 8.2, size: 15, type: 2, colorIdx: 2 },
  { left: 26, delay: 2.1, dur: 6.8, size: 11, type: 0, colorIdx: 3 },
  { left: 34, delay: 0.9, dur: 7.2, size: 13, type: 1, colorIdx: 0 },
  { left: 42, delay: 1.6, dur: 8.5, size: 10, type: 2, colorIdx: 4 },
  { left: 50, delay: 0.3, dur: 6.2, size: 14, type: 0, colorIdx: 1 },
  { left: 58, delay: 2.4, dur: 7.8, size: 10, type: 1, colorIdx: 5 },
  { left: 65, delay: 1.1, dur: 6.5, size: 12, type: 2, colorIdx: 2 },
  { left: 72, delay: 1.9, dur: 8.0, size: 15, type: 0, colorIdx: 3 },
  { left: 79, delay: 0.7, dur: 7.0, size: 10, type: 1, colorIdx: 0 },
  { left: 86, delay: 2.3, dur: 6.3, size: 12, type: 2, colorIdx: 4 },
  { left: 92, delay: 1.5, dur: 7.5, size: 14, type: 0, colorIdx: 5 },
  { left: 97, delay: 0.4, dur: 8.8, size: 11, type: 1, colorIdx: 1 },
]

const PETAL_COLORS = [
  "#fda4af", // rose-300
  "#f9a8d4", // pink-300
  "#d8b4fe", // purple-300
  "#86efac", // green-300
  "#c4b5fd", // violet-300
  "#fbcfe8", // pink-200
]

type PetalType = 0 | 1 | 2

function Petal({ size, type, color }: { size: number; type: PetalType; color: string }) {
  const styles: React.CSSProperties = {
    width: type === 0 ? size * 0.45 : type === 1 ? size : size * 0.65,
    height: size,
    background: color,
    opacity: 0.65,
  }
  if (type === 0) {
    // Willow leaf — elongated oval
    styles.borderRadius = "50%"
  } else if (type === 1) {
    // Cherry blossom petal
    styles.borderRadius = "50% 0 50% 0"
  } else {
    // Round teardrop
    styles.borderRadius = "50% 50% 0 50%"
  }
  return <div style={styles} />
}

// Willow branch with hanging leaves and small flowers
function WillowBranch() {
  const hangPoints = [28, 48, 68, 88, 108, 128]
  const flowerPoints = [38, 78, 118]
  const flowerColors = ["#fda4af", "#d8b4fe", "#f9a8d4"]

  return (
    <svg width="170" height="64" viewBox="0 0 170 64" fill="none" aria-hidden="true">
      {/* Main branch */}
      <path
        d="M12,34 Q55,14 158,30"
        stroke="#6ee7b7"
        strokeWidth="2"
        strokeLinecap="round"
      />
      {/* Hanging willow strands */}
      {hangPoints.map((x, i) => {
        const y = 18 + (i % 3) * 5
        return (
          <g key={i}>
            <path
              d={`M${x},${y} Q${x - 4},${y + 16} ${x - 6},${y + 24}`}
              stroke="#86efac"
              strokeWidth="1.5"
              strokeLinecap="round"
              opacity="0.75"
            />
            <ellipse
              cx={x - 6}
              cy={y + 24}
              rx="3"
              ry="4.5"
              fill="#86efac"
              opacity="0.55"
              transform={`rotate(-12, ${x - 6}, ${y + 24})`}
            />
          </g>
        )
      })}
      {/* Small flowers on branch */}
      {flowerPoints.map((x, i) => {
        const y = 16 + i * 3
        const c = flowerColors[i]
        const angles = [0, 60, 120, 180, 240, 300]
        return (
          <g key={i}>
            {angles.map((a, j) => {
              const rad = (a * Math.PI) / 180
              const px = x + 5 * Math.cos(rad)
              const py = y + 5 * Math.sin(rad)
              return (
                <ellipse
                  key={j}
                  cx={px}
                  cy={py}
                  rx="3.5"
                  ry="1.8"
                  fill={c}
                  opacity="0.8"
                  transform={`rotate(${a}, ${px}, ${py})`}
                />
              )
            })}
            {/* Flower center */}
            <circle cx={x} cy={y} r="2.5" fill="#fde68a" opacity="0.9" />
          </g>
        )
      })}
    </svg>
  )
}

export default function TsvetnitsaDecoration() {
  const [dismissed, setDismissed] = useState(true)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const now = new Date()
    const start = new Date(2026, 3, 5)  // April 5 — show from today
    const end = new Date(2026, 3, 7)    // April 7
    if (now >= start && now < end) {
      const isDismissed = sessionStorage.getItem("tsvetnitsa-2026")
      if (!isDismissed) {
        setDismissed(false)
        // Small delay for entrance animation
        setTimeout(() => setVisible(true), 80)
      }
    }
  }, [])

  const handleDismiss = () => {
    setVisible(false)
    setTimeout(() => {
      sessionStorage.setItem("tsvetnitsa-2026", "1")
      setDismissed(true)
    }, 350)
  }

  if (dismissed) return null

  return (
    <>
      <style>{`
        @keyframes tsv-fall {
          0%   { transform: translateY(-50px) rotate(0deg);   opacity: 0; }
          6%   { opacity: 1; }
          88%  { opacity: 0.6; }
          100% { transform: translateY(105vh) rotate(540deg); opacity: 0; }
        }
        @keyframes tsv-sway {
          0%,100% { transform: translateX(0px); }
          35%     { transform: translateX(14px); }
          70%     { transform: translateX(-10px); }
        }
        @keyframes tsv-modal-in {
          0%   { transform: scale(0.82) translateY(20px); opacity: 0; }
          100% { transform: scale(1)    translateY(0px);  opacity: 1; }
        }
        @keyframes tsv-modal-out {
          0%   { transform: scale(1)    translateY(0px);  opacity: 1; }
          100% { transform: scale(0.88) translateY(12px); opacity: 0; }
        }
        @keyframes tsv-float {
          0%,100% { transform: translateY(0px); }
          50%     { transform: translateY(-7px); }
        }
        @keyframes tsv-shimmer {
          0%   { background-position: 0%   center; }
          100% { background-position: 200% center; }
        }
        @keyframes tsv-fade-in {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes tsv-fade-out {
          from { opacity: 1; }
          to   { opacity: 0; }
        }
        .tsv-modal {
          animation: tsv-modal-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
        }
        .tsv-modal-closing {
          animation: tsv-modal-out 0.32s cubic-bezier(0.4, 0, 0.6, 1) forwards;
        }
        .tsv-backdrop {
          animation: tsv-fade-in 0.35s ease forwards;
        }
        .tsv-backdrop-closing {
          animation: tsv-fade-out 0.35s ease forwards;
        }
        .tsv-float {
          animation: tsv-float 3.2s ease-in-out infinite;
        }
        .tsv-shimmer-text {
          background: linear-gradient(
            90deg,
            #fda4af 0%,
            #d8b4fe 33%,
            #86efac 66%,
            #fda4af 100%
          );
          background-size: 200% auto;
          -webkit-background-clip: text;
          background-clip: text;
          -webkit-text-fill-color: transparent;
          animation: tsv-shimmer 5s linear infinite;
        }
      `}</style>

      {/* ── Full-screen backdrop ── */}
      <div
        className={visible ? "tsv-backdrop" : "tsv-backdrop-closing"}
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 110,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "rgba(0,0,0,0.78)",
          backdropFilter: "blur(6px)",
          WebkitBackdropFilter: "blur(6px)",
          cursor: "pointer",
        }}
        onClick={handleDismiss}
      >
        {/* ── Falling petals ── */}
        {PETALS.map((p, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              top: 0,
              left: `${p.left}%`,
              pointerEvents: "none",
              animation: `tsv-fall ${p.dur}s ease-in ${p.delay}s infinite`,
            }}
          >
            <div
              style={{
                animation: `tsv-sway ${p.dur * 0.65}s ease-in-out ${p.delay * 0.5}s infinite`,
              }}
            >
              <Petal
                type={p.type as PetalType}
                size={p.size}
                color={PETAL_COLORS[p.colorIdx]}
              />
            </div>
          </div>
        ))}

        {/* ── Modal card ── */}
        <div
          className={visible ? "tsv-modal" : "tsv-modal-closing"}
          style={{
            position: "relative",
            margin: "0 16px",
            width: "100%",
            maxWidth: 440,
            borderRadius: 28,
            overflow: "hidden",
            background: "rgba(11, 11, 16, 0.97)",
            border: "1px solid rgba(255,255,255,0.07)",
            backdropFilter: "blur(40px)",
            WebkitBackdropFilter: "blur(40px)",
            boxShadow:
              "0 48px 120px rgba(0,0,0,0.85), 0 0 0 1px rgba(253,164,175,0.06), 0 0 80px rgba(253,164,175,0.06)",
            cursor: "default",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Top multicolor accent line */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 2,
              background:
                "linear-gradient(90deg, transparent 0%, #fda4af 25%, #d8b4fe 50%, #86efac 75%, transparent 100%)",
            }}
          />

          {/* Soft inner glow — top */}
          <div
            style={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              height: 180,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 50% -10%, rgba(253,164,175,0.07) 0%, transparent 70%)",
            }}
          />
          {/* Soft inner glow — bottom */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 120,
              pointerEvents: "none",
              background:
                "radial-gradient(ellipse at 50% 120%, rgba(134,239,172,0.05) 0%, transparent 70%)",
            }}
          />

          {/* Close button */}
          <button
            onClick={handleDismiss}
            aria-label="Затвори"
            style={{
              position: "absolute",
              top: 14,
              right: 14,
              width: 32,
              height: 32,
              borderRadius: "50%",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "rgba(255,255,255,0.04)",
              border: "1px solid rgba(255,255,255,0.07)",
              color: "rgba(255,255,255,0.35)",
              cursor: "pointer",
              transition: "all 0.2s",
              zIndex: 10,
            }}
            onMouseEnter={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(253,164,175,0.1)"
              ;(e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.7)"
            }}
            onMouseLeave={(e) => {
              ;(e.currentTarget as HTMLButtonElement).style.background =
                "rgba(255,255,255,0.04)"
              ;(e.currentTarget as HTMLButtonElement).style.color =
                "rgba(255,255,255,0.35)"
            }}
          >
            <X size={14} />
          </button>

          {/* ── Content ── */}
          <div
            style={{
              padding: "36px 36px 32px",
              textAlign: "center",
              position: "relative",
              zIndex: 5,
            }}
          >
            {/* Animated willow branch */}
            <div className="tsv-float" style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
              <WillowBranch />
            </div>

            {/* Date pill */}
            <div
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 6,
                padding: "4px 14px",
                borderRadius: 999,
                background: "rgba(253,164,175,0.05)",
                border: "1px solid rgba(253,164,175,0.14)",
                marginBottom: 16,
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  color: "rgba(253,164,175,0.65)",
                }}
              >
                ✦&nbsp;&nbsp;5 Април 2026&nbsp;&nbsp;✦
              </span>
            </div>

            {/* Main heading */}
            <h2
              className="tsv-shimmer-text"
              style={{
                fontFamily: "var(--font-display)",
                fontSize: "clamp(2rem, 8vw, 2.75rem)",
                fontWeight: 900,
                letterSpacing: "0.05em",
                lineHeight: 1.1,
                marginBottom: 14,
              }}
            >
              ЧЕСТИТА<br />ЦВЕТНИЦА
            </h2>

            {/* Subtitle */}
            <p
              style={{
                fontFamily: "var(--font-sans)",
                fontSize: 14,
                fontWeight: 400,
                lineHeight: 1.7,
                letterSpacing: "0.01em",
                textTransform: "none",
                color: "rgba(255,255,255,0.42)",
                marginBottom: 28,
                maxWidth: 280,
                marginLeft: "auto",
                marginRight: "auto",
              }}
            >
              Пожелаваме ви здраве, радост<br />и пролетно настроение!
            </p>

            {/* Divider with brand name */}
            <div
              style={{
                display: "flex",
                alignItems: "center",
                gap: 12,
                marginBottom: 22,
              }}
            >
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
              <span
                style={{
                  fontSize: 9,
                  fontWeight: 700,
                  letterSpacing: "0.22em",
                  textTransform: "uppercase",
                  fontFamily: "var(--font-mono)",
                  color: "rgba(255,255,255,0.18)",
                }}
              >
                БГ ОЙЛ ВРАЦА
              </span>
              <div style={{ flex: 1, height: 1, background: "rgba(255,255,255,0.05)" }} />
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              style={{
                width: "100%",
                padding: "12px 0",
                borderRadius: 16,
                fontFamily: "var(--font-display)",
                fontSize: 12,
                fontWeight: 700,
                letterSpacing: "0.12em",
                textTransform: "uppercase",
                color: "rgba(255,255,255,0.55)",
                background:
                  "linear-gradient(135deg, rgba(253,164,175,0.1) 0%, rgba(216,180,254,0.1) 100%)",
                border: "1px solid rgba(253,164,175,0.18)",
                cursor: "pointer",
                transition: "all 0.25s",
              }}
              onMouseEnter={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.8)"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(253,164,175,0.35)"
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, rgba(253,164,175,0.16) 0%, rgba(216,180,254,0.16) 100%)"
              }}
              onMouseLeave={(e) => {
                ;(e.currentTarget as HTMLButtonElement).style.color =
                  "rgba(255,255,255,0.55)"
                ;(e.currentTarget as HTMLButtonElement).style.borderColor =
                  "rgba(253,164,175,0.18)"
                ;(e.currentTarget as HTMLButtonElement).style.background =
                  "linear-gradient(135deg, rgba(253,164,175,0.1) 0%, rgba(216,180,254,0.1) 100%)"
              }}
            >
              Затвори
            </button>
          </div>

          {/* Bottom accent line */}
          <div
            style={{
              position: "absolute",
              bottom: 0,
              left: 0,
              right: 0,
              height: 1,
              background:
                "linear-gradient(90deg, transparent, rgba(134,239,172,0.18), transparent)",
            }}
          />
        </div>
      </div>
    </>
  )
}
