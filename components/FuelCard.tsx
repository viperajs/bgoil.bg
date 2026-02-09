import type { Fuel } from "@/lib/types"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingDown, Sparkles, Droplets, Flame, Zap } from "lucide-react"

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

  // Determine Icon & Color
  const isDiesel = fuel.name.toLowerCase().includes('diesel') || fuel.name.toLowerCase().includes('дизел')
  const isGas = fuel.name.toLowerCase().includes('gas') || fuel.name.toLowerCase().includes('lpg') || fuel.name.toLowerCase().includes('газ')
  const isPremium = fuel.name.toLowerCase().includes('plus') || fuel.name.toLowerCase().includes('max')

  const Icon = isGas ? Flame : isDiesel ? Droplets : Zap
  const colorClass = isGas ? 'text-blue-400' : isDiesel ? 'text-yellow-400' : 'text-primary'
  const gradientClass = isGas ? 'from-blue-500/20 to-blue-600/5' : isDiesel ? 'from-yellow-500/20 to-yellow-600/5' : 'from-primary/20 to-primary/5'

  return (
    <div className="group relative h-full">
      {/* Background Blur & Border */}
      <div className="absolute inset-0 bg-white/5 backdrop-blur-xl rounded-[2rem] border border-white/10 group-hover:border-primary/50 transition-all duration-500"></div>

      {/* Dynamic Glow */}
      <div className={`absolute inset-0 bg-gradient-to-br ${gradientClass} opacity-0 group-hover:opacity-100 rounded-[2rem] transition-opacity duration-700 blur-xl`}></div>

      {/* Content */}
      <div className="relative z-10 p-6 flex flex-col h-full">

        {/* Header */}
        <div className="flex items-start justify-between mb-8">
          <div className="flex items-center gap-4">
            <div className={`w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center border border-white/5 group-hover:scale-110 transition-transform duration-500 ${colorClass}`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-black text-white leading-tight uppercase tracking-wide">
                {fuel.name.replace('Diesel', 'Дизел').replace('Gasoline', 'Бензин')}
              </h3>
              {isPremium && (
                <Badge variant="outline" className="mt-1 border-primary/50 text-primary text-[10px] uppercase tracking-wider bg-primary/10">Premium Class</Badge>
              )}
            </div>
          </div>
        </div>

        {/* Pricing Block */}
        <div className="mt-auto space-y-6">

          {/* Main Price */}
          <div className="flex items-end justify-between pb-6 border-b border-white/5">
            <span className="text-sm font-medium text-white/40 mb-1">Редовна цена</span>
            <div className="text-right">
              <span className="block text-3xl font-black text-white tracking-tight">
                €{fx2(priceEUR)}
              </span>
            </div>
          </div>

          {/* Member Price (Highlighted) */}
          <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-primary/20 to-primary/5 p-4 border border-primary/20 group-hover:border-primary/40 transition-colors">
            <div className="absolute -right-4 -top-4 w-20 h-20 bg-primary/20 rounded-full blur-2xl"></div>

            <div className="relative z-10 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-1.5 text-primary text-xs font-bold uppercase tracking-wider mb-0.5">
                  <CreditCard className="w-3.5 h-3.5" />
                  BG OIL CLUB
                </div>
                <div className="text-4xl font-black text-white tabular-nums tracking-tighter">
                  €{fx2(memberPriceEUR)}
                </div>
              </div>

              <div className="text-right">
                <div className="inline-flex flex-col items-end">
                  <span className="text-green-400 font-bold text-sm flex items-center gap-1">
                    <TrendingDown className="w-3 h-3" />
                    -{fx2(savingsEUR)}
                  </span>
                  <span className="text-[10px] text-white/30 uppercase">Спестяване / л</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  )
}