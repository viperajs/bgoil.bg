import type { Fuel } from "@/lib/types"
import { CreditCard, TrendingDown, Droplets, Flame, Zap } from "lucide-react"

interface FuelCardProps {
  fuel: Fuel
}

const BGN_PER_EUR = 1.95583

export default function FuelCard({ fuel }: FuelCardProps) {
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
  const isGas = nameLower.includes("gas") || nameLower.includes("lpg") || nameLower.includes("газ") || nameLower.includes("пропан") || nameLower.includes("пб")
  const isAdBlue = nameLower.includes("adblue")

  const Icon = isGas ? Flame : isDiesel ? Droplets : isAdBlue ? Zap : Zap

  return (
    <div className="group relative h-full rounded-lg border border-border bg-card hover-lift">
      <div className="relative z-10 p-6 flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center gap-3 mb-8">
          <div className="w-11 h-11 rounded-md border border-border bg-secondary flex items-center justify-center text-brand-500">
            <Icon className="w-5 h-5" strokeWidth={1.5} />
          </div>
          <div>
            <h3 className="text-h4 text-foreground leading-tight">
              {fuel.name.replace("Diesel", "Дизел").replace("Gasoline", "Бензин")}
            </h3>
            <div className="text-caption uppercase text-muted-foreground/60 font-mono mt-0.5">
              BG OIL
            </div>
          </div>
        </div>

        {/* Pricing — CLUB price is the visual focus */}
        <div className="mt-auto space-y-3">
          {/* Regular price — de-emphasized reference point */}
          <div className="flex items-end justify-between pb-3 border-b border-border">
            <span className="text-caption text-muted-foreground">Редовна цена</span>
            <div className="text-right">
              <span className="text-lg font-semibold font-mono tabular-nums text-muted-foreground">
                €{fx2(priceEUR)}
              </span>
              <div className="text-[10px] text-muted-foreground/60 uppercase tracking-wider font-mono">
                на литър
              </div>
            </div>
          </div>

          {/* CLUB price — primary focus, brand-filled */}
          <div className="relative rounded-md p-4 border border-brand-500/30 bg-brand-500/[0.08]">
            <div className="flex items-center justify-between gap-3">
              <div>
                <div className="flex items-center gap-1.5 text-caption uppercase text-brand-500 font-semibold mb-1.5">
                  <CreditCard className="w-3 h-3" />
                  BG OIL CLUB
                </div>
                <div className="text-3xl font-bold font-mono tabular-nums text-foreground tracking-tight">
                  €{fx2(memberPriceEUR)}
                </div>
              </div>

              <div className="flex flex-col items-end gap-0.5 rounded-md bg-emerald-500/10 px-2.5 py-1.5 border border-emerald-500/20">
                <span className="text-emerald-400 font-bold text-sm flex items-center gap-1">
                  <TrendingDown className="w-3 h-3" />
                  -{fx2(savingsEUR)}
                </span>
                <span className="text-[9px] text-emerald-400/70 uppercase tracking-wider font-mono">
                  спестяване/л
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
