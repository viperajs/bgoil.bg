import type { Fuel } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
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
  const isGas = nameLower.includes('gas') || nameLower.includes('lpg') || nameLower.includes('газ')
  const isPremium = nameLower.includes('plus') || nameLower.includes('max')

  const Icon = isGas ? Flame : isDiesel ? Droplets : Zap
  const accentColor = isGas ? 'blue' : isDiesel ? 'amber' : 'red'

  const colorMap = {
    blue: { text: 'text-blue-400', border: 'border-blue-500/20', bg: 'bg-blue-500/[0.08]', glow: 'rgba(59,130,246,0.15)' },
    amber: { text: 'text-amber-400', border: 'border-amber-500/20', bg: 'bg-amber-500/[0.08]', glow: 'rgba(245,158,11,0.15)' },
    red: { text: 'text-red-400', border: 'border-red-500/20', bg: 'bg-red-500/[0.08]', glow: 'rgba(239,68,68,0.15)' },
  }
  const colors = colorMap[accentColor]

  return (
    <div className="group relative h-full">
      {/* Card background */}
      <div className="absolute inset-0 rounded-2xl bg-white/[0.02] border border-white/[0.05] group-hover:border-white/[0.12] transition-all duration-500 backdrop-blur-sm"></div>

      {/* Hover glow */}
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-700 blur-2xl -z-10"
        style={{ background: `radial-gradient(ellipse at center, ${colors.glow}, transparent 70%)` }}
      ></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-3">
            <div className={`w-11 h-11 rounded-xl ${colors.bg} border ${colors.border} flex items-center justify-center group-hover:scale-110 transition-transform duration-500`}>
              <Icon className={`w-5 h-5 ${colors.text}`} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white leading-tight uppercase tracking-wide">
                {fuel.name.replace('Diesel', 'Дизел').replace('Gasoline', 'Бензин')}
              </h3>
              {isPremium && (
                <Badge variant="outline" className="mt-1 border-primary/30 text-primary text-[10px] uppercase tracking-wider bg-primary/[0.06]">
                  Premium
                </Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing */}
        <div className="mt-auto space-y-5">
          {/* Regular Price */}
          <div className="flex items-end justify-between pb-5 border-b border-white/[0.04]">
            <span className="text-xs font-medium text-white/30">Редовна цена</span>
            <span className="text-2xl font-black text-white/70 tracking-tight">
              €{fx2(priceEUR)}
            </span>
          </div>

          {/* Member Price */}
          <div className="relative overflow-hidden rounded-xl bg-gradient-to-r from-primary/[0.12] to-primary/[0.04] p-4 border border-primary/[0.12] group-hover:border-primary/25 transition-colors">
            <div className="absolute -right-6 -top-6 w-24 h-24 bg-primary/10 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-primary text-[10px] font-bold uppercase tracking-[0.15em] mb-1">
                  <CreditCard className="w-3 h-3" />
                  BG OIL CLUB
                </div>
                <div className="text-3xl font-black text-white tabular-nums tracking-tighter">
                  €{fx2(memberPriceEUR)}
                </div>
              </div>

              <div className="text-right">
                <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -{fx2(savingsEUR)}
                </span>
                <span className="text-[10px] text-white/20 uppercase tracking-wider">Спестяване / л</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
