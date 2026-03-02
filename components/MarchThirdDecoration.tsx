"use client"

import { useState } from "react"

export default function MarchThirdDecoration() {
  const [dismissed, setDismissed] = useState(false)

  if (dismissed) return null

  return (
    <div
      className="fixed bottom-6 right-6 z-50 cursor-pointer group"
      onClick={() => setDismissed(true)}
    >
      <div className="relative px-7 py-5 rounded-2xl border border-white/10 bg-[#0c0c14]/95 backdrop-blur-xl shadow-[0_8px_40px_rgba(0,0,0,0.6)] hover:border-white/15 transition-all duration-300">
        {/* Триколор линия отгоре */}
        <div className="absolute top-0 left-4 right-4 flex h-[3px] rounded-full overflow-hidden">
          <div className="flex-1 bg-white/70" />
          <div className="flex-1 bg-green-500/80" />
          <div className="flex-1 bg-red-500/80" />
        </div>

        {/* Glow ефект */}
        <div className="absolute -inset-1 rounded-2xl bg-gradient-to-r from-green-500/10 via-transparent to-red-500/10 blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 -z-10" />

        <p className="text-lg sm:text-xl font-bold text-white/90 group-hover:text-white transition-colors whitespace-nowrap">
          🇧🇬 Честит Трети Март!
        </p>
      </div>
    </div>
  )
}
