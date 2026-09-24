"use client"

import Image from "next/image"
import * as motion from "motion/react-client"
import { ArrowLeftRight, Globe2, Zap, ShieldCheck, Clock, Receipt } from "lucide-react"
import Tilt3DCard from "./Tilt3DCard"

function MoneyGramLogo() {
  return (
    <svg viewBox="0 0 240 120" className="w-[82%] h-auto" role="img" aria-label="MoneyGram">
      <circle cx="120" cy="38" r="26" fill="#E0322B" />
      <path
        d="M131 25 L140 25 L140 34 M140 25 L128 37 A11 11 0 1 1 124 29"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="120" y="92" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="30" fill="#2B2B2B" letterSpacing="-0.5">
        MoneyGram
      </text>
      <text x="120" y="111" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontStyle="italic" fontSize="13" fill="#7a7a7a">
        money transfer
      </text>
    </svg>
  )
}

function EasyPayLogo() {
  return (
    <div className="absolute inset-0 flex flex-col">
      <div className="flex-1 flex items-end justify-center pb-1" style={{ background: "#E4202A" }}>
        <span className="text-white font-black text-3xl sm:text-4xl leading-none tracking-tight" style={{ fontFamily: "Arial, Helvetica, sans-serif", textTransform: "none" }}>
          Easy
        </span>
      </div>
      <div className="flex-1 flex items-start justify-center pt-1" style={{ background: "#27348B" }}>
        <span className="text-white font-black text-3xl sm:text-4xl leading-none tracking-tight" style={{ fontFamily: "Arial, Helvetica, sans-serif", textTransform: "none" }}>
          Pay
        </span>
      </div>
    </div>
  )
}

const partners = [
  {
    name: "Western Union",
    description: "Международни парични преводи — изпращане и получаване.",
    bg: "#FFDD00",
    glow: "rgba(255,221,0,0.18)",
    accent: "#FFDD00",
    logo: <Image src="/partners/western-union.png" alt="Western Union" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-cover scale-[1.06]" />,
  },
  {
    name: "MoneyGram",
    description: "Бързи преводи до и от близки по целия свят.",
    bg: "#FFFFFF",
    glow: "rgba(224,50,43,0.18)",
    accent: "#E0322B",
    logo: <MoneyGramLogo />,
  },
  {
    name: "Ria",
    description: "Изгодни преводи с изплащане в брой.",
    bg: "#FF6600",
    glow: "rgba(255,102,0,0.2)",
    accent: "#FF6600",
    logo: <Image src="/partners/ria.png" alt="Ria Money Transfer" fill sizes="(max-width: 768px) 50vw, 25vw" className="object-contain p-3" />,
  },
  {
    name: "EasyPay",
    description: "Плащане на сметки, данъци и кредити — денонощно.",
    bg: "#27348B",
    glow: "rgba(39,52,139,0.28)",
    accent: "#6b7cff",
    logo: <EasyPayLogo />,
  },
]

const perks = [
  { icon: Globe2, label: "Преводи по целия свят" },
  { icon: Zap, label: "Бързо обслужване" },
  { icon: ShieldCheck, label: "Сигурни плащания" },
  { icon: Receipt, label: "Сметки и такси" },
  { icon: Clock, label: "Отворено 24/7" },
]

export default function MoneyTransferSection() {
  return (
    <section className="relative py-28 overflow-hidden">
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-0 left-0 right-0 h-px section-divider" />
        <div
          className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[900px] h-[420px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.06), transparent 70%)", filter: "blur(90px)" }}
        />
        <div
          className="absolute -bottom-24 right-0 w-[420px] h-[320px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(255,221,0,0.04), transparent 70%)", filter: "blur(80px)" }}
        />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-14"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
            style={{ background: "rgba(239,68,68,0.06)", border: "1px solid rgba(239,68,68,0.18)" }}
          >
            <ArrowLeftRight className="w-3.5 h-3.5" style={{ color: "#ef4444" }} />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/60">Парични преводи</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-5">
            Изпращайте пари <span className="text-gradient-primary">от нас</span>
          </h2>
          <p
            className="text-base md:text-lg text-white/45 max-w-2xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "none", letterSpacing: "0.01em" }}
          >
            В бензиностанцията ще намерите каса с водещите услуги за парични преводи и плащане на сметки — докато зареждате.
          </p>
        </motion.div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 max-w-6xl mx-auto" style={{ perspective: "1200px" }}>
          {partners.map((p, i) => (
            <motion.div
              key={p.name}
              initial={{ opacity: 0, y: 50, rotateX: 12, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-30px" }}
              transition={{ duration: 0.65, delay: i * 0.08, ease: [0.16, 1, 0.3, 1] }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <Tilt3DCard className="h-full" intensity={9} glowColor={p.glow}>
                <div
                  className="group relative flex flex-col h-full rounded-3xl overflow-hidden"
                  style={{ background: "rgba(255,255,255,0.02)", border: "1px solid rgba(255,255,255,0.07)" }}
                >
                  {/* Logo plate */}
                  <div
                    className="relative flex items-center justify-center overflow-hidden"
                    style={{ background: p.bg, aspectRatio: "16 / 10" }}
                  >
                    {p.logo}
                    {/* Glossy sweep on hover */}
                    <div
                      className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out pointer-events-none"
                      style={{ background: "linear-gradient(110deg, transparent 30%, rgba(255,255,255,0.35) 50%, transparent 70%)" }}
                    />
                  </div>

                  <div className="relative flex-1 p-4 sm:p-5">
                    <div
                      className="absolute top-0 left-6 right-6 h-px opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                      style={{ background: `linear-gradient(90deg, transparent, ${p.accent}, transparent)` }}
                    />
                    <h3 className="font-bold text-white text-sm sm:text-base mb-1.5">{p.name}</h3>
                    <p
                      className="text-white/45 group-hover:text-white/65 transition-colors duration-300 text-xs sm:text-[0.8125rem] leading-relaxed"
                      style={{ fontFamily: "var(--font-sans)", fontWeight: 400, textTransform: "none", letterSpacing: "0.01em" }}
                    >
                      {p.description}
                    </p>
                  </div>
                </div>
              </Tilt3DCard>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mt-12 max-w-4xl mx-auto"
        >
          {perks.map(({ icon: Icon, label }) => (
            <div
              key={label}
              className="inline-flex items-center gap-2 rounded-full px-4 py-2 backdrop-blur-xl transition-colors duration-300 hover:bg-white/[0.05]"
              style={{ background: "rgba(255,255,255,0.025)", border: "1px solid rgba(255,255,255,0.08)" }}
            >
              <Icon className="w-4 h-4 text-red-400" strokeWidth={1.75} />
              <span
                className="text-xs sm:text-sm text-white/60"
                style={{ fontFamily: "var(--font-sans)", textTransform: "none", letterSpacing: "0.01em" }}
              >
                {label}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  )
}
