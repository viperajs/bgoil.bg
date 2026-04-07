"use client"

import type { Fuel } from "@/lib/types"
import { CreditCard, TrendingDown, Droplets, Flame, Zap } from "lucide-react"
import { useRef, useCallback, useEffect } from "react"

interface FuelCardProps {
  fuel: Fuel
}

const BGN_PER_EUR = 1.95583

export default function FuelCard({ fuel }: FuelCardProps) {
  const cardRef = useRef<HTMLDivElement>(null)
  const isTouchRef = useRef(false)
  useEffect(() => {
    isTouchRef.current = window.matchMedia("(hover: none)").matches
  }, [])

  const priceBGN = fuel.price
  const fallbackMember = typeof fuel.memberPrice === "number" ? fuel.memberPrice : priceBGN
  const discountBGN =
    typeof fuel.discount === "number" ? fuel.discount : Math.max(0, priceBGN - fallbackMember)
  const memberPriceBGN = Math.max(0, priceBGN - discountBGN)

  const priceEUR = priceBGN / BGN_PER_EUR
  const memberPriceEUR = memberPriceBGN / BGN_PER_EUR
  const savingsEUR = discountBGN / BGN_PER_EUR

  const fx2 = (n: number) => n.toFixed(2)

  const nameLower = fuel.name.toLowerCase()
  const isDiesel = nameLower.includes("diesel") || nameLower.includes("дизел")
  const isGas = nameLower.includes("gas") || nameLower.includes("lpg") || nameLower.includes("газ") || nameLower.includes("гпб")
  const isAdBlue = nameLower.includes("adblue")

  const Icon = isGas ? Flame : isDiesel ? Droplets : isAdBlue ? Zap : Zap
  const accentColor = isGas ? "blue" : isDiesel ? "amber" : "orange"

  const colorMap = {
    blue: {
      text: "#60A5FA",
      border: "rgba(96,165,250,0.25)",
      bg: "rgba(96,165,250,0.08)",
      glow: "rgba(59,130,246,0.18)",
      glowStrong: "rgba(59,130,246,0.3)",
    },
    amber: {
      text: "#ef4444",
      border: "rgba(239,68,68,0.25)",
      bg: "rgba(239,68,68,0.08)",
      glow: "rgba(239,68,68,0.18)",
      glowStrong: "rgba(239,68,68,0.3)",
    },
    orange: {
      text: "#f97316",
      border: "rgba(249,115,22,0.25)",
      bg: "rgba(249,115,22,0.08)",
      glow: "rgba(249,115,22,0.18)",
      glowStrong: "rgba(249,115,22,0.3)",
    },
  }
  const colors = colorMap[accentColor]

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isTouchRef.current) return
    const el = cardRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const x = (e.clientX - rect.left) / rect.width - 0.5
    const y = (e.clientY - rect.top) / rect.height - 0.5
    el.style.transform = `perspective(800px) rotateX(${-y * 8}deg) rotateY(${x * 8}deg) scale3d(1.02,1.02,1.02)`
    el.style.boxShadow = `
      ${x * 15}px ${y * 15}px 35px rgba(0,0,0,0.5),
      0 0 40px ${colors.glow},
      inset 0 1px 0 rgba(255,255,255,0.07)
    `
  }, [colors.glow])

  const handleMouseLeave = useCallback(() => {
    if (isTouchRef.current) return
    const el = cardRef.current
    if (!el) return
    el.style.transform = "perspective(800px) rotateX(0deg) rotateY(0deg) scale3d(1,1,1)"
    el.style.boxShadow = ""
  }, [])

  return (
    <div
      ref={cardRef}
      className="group relative h-full"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{
        transition: "transform 0.18s ease-out, box-shadow 0.4s ease",
        transformStyle: "preserve-3d",
        willChange: "transform",
      }}
    >
      {/* Card shell */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: "linear-gradient(145deg, rgba(20,20,22,0.9), rgba(10,10,11,0.95))",
          border: "1px solid rgba(255,255,255,0.07)",
        }}
      />

      {/* Hover border glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-400"
        style={{ border: `1px solid ${colors.border}` }}
      />

      {/* Top accent line */}
      <div
        className="absolute top-0 left-6 right-6 h-px rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: `linear-gradient(90deg, transparent, ${colors.text}60, transparent)` }}
      />

      {/* Background ambient glow */}
      <div
        className="absolute top-0 left-0 right-0 h-1/2 rounded-t-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"
        style={{ background: `radial-gradient(ellipse at 50% 0%, ${colors.bg}, transparent 70%)` }}
      />

      {/* Depth blur glow behind card */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${colors.glow}, transparent 70%)` }}
      />

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div
              className="w-12 h-12 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110 relative"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              {/* Icon inner glow */}
              <div
                className="absolute inset-0 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: `radial-gradient(circle, ${colors.bg}, transparent)` }}
              />
              <Icon
                style={{ width: "20px", height: "20px", color: colors.text, position: "relative", zIndex: 1 }}
                strokeWidth={1.5}
              />
            </div>
            <div>
              <h3
                className="text-lg font-bold text-white leading-tight tracking-wider group-hover:text-white transition-colors"
              >
                {fuel.name.replace("Diesel", "Дизел").replace("Gasoline", "Бензин")}
              </h3>
              <div
                className="text-[10px] font-bold uppercase tracking-[0.15em] mt-0.5 transition-opacity duration-300 opacity-0 group-hover:opacity-60"
                style={{ color: colors.text, fontFamily: "var(--font-mono)" }}
              >
                BG OIL
              </div>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-auto space-y-4">
          {/* Regular Price */}
          <div
            className="flex items-end justify-between pb-4"
            style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
          >
            <span className="text-xs font-medium text-white/40">Редовна цена</span>
            <div className="text-right">
              <span
                className="text-2xl font-black text-white/80"
                style={{ fontFamily: "var(--font-mono)", letterSpacing: "-0.02em" }}
              >
                €{fx2(priceEUR)}
              </span>
              <div className="text-[10px] text-white/25 uppercase tracking-wider mt-0.5" style={{ fontFamily: "var(--font-mono)" }}>
                на литър
              </div>
            </div>
          </div>

          {/* Member Price */}
          <div
            className="relative overflow-hidden rounded-xl p-4 transition-all duration-500"
            style={{
              background: `linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.04))`,
              border: `1px solid rgba(239,68,68,0.14)`,
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.25)"
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.14), rgba(249,115,22,0.06))"
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.borderColor = "rgba(239,68,68,0.14)"
              e.currentTarget.style.background = "linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.04))"
            }}
          >
            {/* Red blur blob */}
            <div
              className="absolute -right-3 -top-3 w-20 h-20 rounded-full blur-2xl pointer-events-none opacity-60"
              style={{ background: "rgba(239,68,68,0.12)" }}
            />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div
                  className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: "#ef4444" }}
                >
                  <CreditCard className="w-3 h-3" />
                  BG OIL CLUB
                </div>
                <div
                  className="text-3xl font-black text-white"
                  style={{ fontFamily: "var(--font-mono)", letterSpacing: "-0.03em" }}
                >
                  €{fx2(memberPriceEUR)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-green-400 font-bold text-sm flex items-center gap-1 justify-end">
                  <TrendingDown className="w-3 h-3" />
                  -{fx2(savingsEUR)}
                </span>
                <span
                  className="text-[10px] text-white/35 uppercase tracking-wider"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  Спестяване / л
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
