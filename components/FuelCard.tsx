import type { Fuel } from "@/lib/types"
import { CreditCard, TrendingDown, Droplets, Flame, Zap } from "lucide-react"

interface FuelCardProps {
  fuel: Fuel
}

const BGN_PER_EUR = 1.95583

export default function FuelCard({ fuel }: FuelCardProps) {
  const priceBGN = fuel.price
  const fallbackMember = typeof fuel.memberPrice === 'number' ? fuel.memberPrice : priceBGN
  const discountBGN =
    typeof fuel.discount === 'number'
      ? fuel.discount
      : Math.max(0, priceBGN - fallbackMember)
  const memberPriceBGN = Math.max(0, priceBGN - discountBGN)

  const priceEUR = priceBGN / BGN_PER_EUR
  const memberPriceEUR = memberPriceBGN / BGN_PER_EUR
  const savingsEUR = discountBGN / BGN_PER_EUR

  const fx2 = (n: number) => n.toFixed(2)

  const nameLower = fuel.name.toLowerCase()
  const isDiesel = nameLower.includes('diesel') || nameLower.includes('дизел')
  const isGas = nameLower.includes('gas') || nameLower.includes('lpg') || nameLower.includes('газ') || nameLower.includes('гпб')
  const isAdBlue = nameLower.includes('adblue')

  const Icon = isGas ? Flame : isDiesel ? Droplets : isAdBlue ? Zap : Zap
  const accentColor = isGas ? 'blue' : isDiesel ? 'amber' : 'orange'

  const colorMap = {
    blue: {
      text: '#60A5FA',
      border: 'rgba(96,165,250,0.2)',
      bg: 'rgba(96,165,250,0.07)',
      glow: 'rgba(59,130,246,0.12)',
    },
    amber: {
      text: '#ef4444',
      border: 'rgba(239,68,68,0.2)',
      bg: 'rgba(239,68,68,0.07)',
      glow: 'rgba(239,68,68,0.12)',
    },
    orange: {
      text: '#f97316',
      border: 'rgba(249,115,22,0.2)',
      bg: 'rgba(249,115,22,0.07)',
      glow: 'rgba(249,115,22,0.12)',
    },
  }
  const colors = colorMap[accentColor]

  return (
    <div className="group relative h-full">
      {/* Card background */}
      <div
        className="absolute inset-0 rounded-2xl transition-all duration-500"
        style={{
          background: 'rgba(255,255,255,0.025)',
          border: '1px solid rgba(255,255,255,0.07)',
        }}
      />
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500"
        style={{ border: `1px solid ${colors.border}` }}
      />

      {/* Hover glow */}
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
              className="w-11 h-11 rounded-xl flex items-center justify-center transition-all duration-500 group-hover:scale-110"
              style={{ background: colors.bg, border: `1px solid ${colors.border}` }}
            >
              <Icon style={{ width: '20px', height: '20px', color: colors.text }} strokeWidth={1.5} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight tracking-wider">
                {fuel.name.replace('Diesel', 'Дизел').replace('Gasoline', 'Бензин')}
              </h3>
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-auto space-y-4">
          {/* Regular Price */}
          <div className="flex items-end justify-between pb-4" style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
            <span className="text-xs font-medium text-white/45">Редовна цена</span>
            <span
              className="text-2xl font-black text-white/85"
              style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.02em' }}
            >
              €{fx2(priceEUR)}
            </span>
          </div>

          {/* Member Price */}
          <div
            className="relative overflow-hidden rounded-xl p-4 transition-colors duration-500"
            style={{
              background: `linear-gradient(135deg, rgba(239,68,68,0.1), rgba(249,115,22,0.04))`,
              border: `1px solid rgba(239,68,68,0.12)`,
            }}
          >
            <div className="absolute -right-4 -top-4 w-20 h-20 rounded-full blur-2xl pointer-events-none"
              style={{ background: 'rgba(239,68,68,0.12)' }} />

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-[10px] font-bold uppercase tracking-[0.15em] mb-1.5"
                  style={{ color: '#ef4444' }}>
                  <CreditCard className="w-3 h-3" />
                  BG OIL CLUB
                </div>
                <div
                  className="text-3xl font-black text-white"
                  style={{ fontFamily: 'var(--font-mono)', letterSpacing: '-0.03em' }}
                >
                  €{fx2(memberPriceEUR)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-green-400 font-bold text-sm flex items-center gap-1 justify-end">
                  <TrendingDown className="w-3 h-3" />
                  -{fx2(savingsEUR)}
                </span>
                <span className="text-[10px] text-white/35 uppercase tracking-wider" style={{ fontFamily: 'var(--font-mono)' }}>
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
