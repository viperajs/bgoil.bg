export const revalidate = 60

import Link from "next/link"
import { Button } from "@/components/ui/button"
import FuelCard from "./FuelCard"
import { ArrowRight, Fuel, Sparkles } from "lucide-react"
import * as motion from "motion/react-client"

import { getEffectiveFuels } from "@/lib/fuelStore"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"

export default async function FeaturedFuels() {
  const allFuels = await getEffectiveFuels()
  const featuredFuels = allFuels.slice(0, 3)
  const discountMessage = await getActiveDiscountBannerMessage()

  return (
    <section className="relative py-32 overflow-hidden">
      {/* Background layers */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[600px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(239,68,68,0.06), transparent 70%)", filter: "blur(120px)" }}
        />
        <div
          className="absolute top-0 right-0 w-[400px] h-[400px] rounded-full"
          style={{ background: "radial-gradient(ellipse, rgba(249,115,22,0.04), transparent 70%)", filter: "blur(100px)" }}
        />
        {/* Subtle dot matrix */}
        <div
          className="absolute inset-0 opacity-[0.012]"
          style={{
            backgroundImage: "radial-gradient(circle, rgba(255,255,255,0.8) 1px, transparent 1px)",
            backgroundSize: "40px 40px",
          }}
        />
        {/* Top + bottom edge lines */}
        <div
          className="absolute top-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.2), rgba(249,115,22,0.15), transparent)" }}
        />
        <div
          className="absolute bottom-0 left-0 right-0 h-px"
          style={{ background: "linear-gradient(90deg, transparent, rgba(239,68,68,0.1), transparent)" }}
        />
      </div>

      <div className="container relative mx-auto px-4 z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: 40, filter: "blur(8px)" }}
          whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
          className="text-center mb-20"
        >
          <div
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full mb-8 backdrop-blur-xl"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.1)" }}
          >
            <Fuel className="w-3.5 h-3.5 text-primary" />
            <span className="text-[11px] font-bold uppercase tracking-[0.2em] text-white/65">Актуални цени</span>
          </div>

          <h2 className="text-3xl sm:text-4xl md:text-6xl font-black text-white mb-6 tracking-tight">
            <span className="text-gradient-primary">Горива</span> & Цени
          </h2>
          <p className="text-base md:text-lg text-white/50 max-w-xl mx-auto leading-relaxed">
            Най-високо качество горива на конкурентни цени.
          </p>

          {/* Decorative line */}
          <div className="flex items-center justify-center gap-4 mt-8">
            <div className="h-px w-16 bg-gradient-to-r from-transparent to-red-500/30" />
            <div className="w-1.5 h-1.5 rounded-full bg-red-500/40" />
            <div className="h-px w-16 bg-gradient-to-l from-transparent to-red-500/30" />
          </div>
        </motion.div>

        {/* Fuel cards grid */}
        <div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-16"
          style={{ perspective: "1000px" }}
        >
          {featuredFuels.map((fuel, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50, rotateX: 15, scale: 0.94 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0, scale: 1 }}
              viewport={{ once: true, margin: "-40px" }}
              transition={{
                duration: 0.7,
                delay: index * 0.13,
                ease: [0.16, 1, 0.3, 1],
              }}
              style={{ transformStyle: "preserve-3d" }}
            >
              <FuelCard fuel={fuel} />
            </motion.div>
          ))}
        </div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="text-center"
        >
          <Button
            asChild
            size="lg"
            className="rounded-full font-bold px-10 py-7 text-lg hover:scale-105 transition-all duration-300 neon-glow shimmer-btn cursor-pointer"
            style={{ background: "linear-gradient(135deg, #ef4444 0%, #dc2626 100%)", color: "#fff", border: "none" }}
          >
            <Link href="/products" className="flex items-center space-x-3">
              <span>Виж всички цени</span>
              <ArrowRight className="w-5 h-5 ml-2" />
            </Link>
          </Button>
        </motion.div>

        {/* Messages */}
        <div className="mt-12 max-w-2xl mx-auto space-y-4 flex flex-col items-center">
          {discountMessage && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="p-4 rounded-2xl border border-green-500/15 bg-green-500/[0.04] backdrop-blur-sm text-center w-full"
              style={{ boxShadow: "0 0 30px rgba(34,197,94,0.06)" }}
            >
              <p className="text-green-400 font-medium flex items-center justify-center gap-2 text-sm">
                <Sparkles className="w-4 h-4" /> {discountMessage}
              </p>
            </motion.div>
          )}

          <div className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500/[0.06] border border-amber-500/18 backdrop-blur-sm">
            <span className="text-amber-400 text-sm font-semibold">*</span>
            <p className="text-sm text-amber-300/75 font-medium">
              Цените са ориентировъчни и подлежат на промяна
            </p>
          </div>
        </div>
      </div>
    </section>
  )
}
