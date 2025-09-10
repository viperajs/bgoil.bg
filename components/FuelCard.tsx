import type { Fuel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FuelCardProps {
  fuel: Fuel
}

const BGN_PER_EUR = 1.95583
const DISCOUNT_BGN = 0.10

export default function FuelCard({ fuel }: FuelCardProps) {
  const priceBGN = fuel.price
  const memberPriceBGN = Math.max(0, priceBGN - DISCOUNT_BGN) // безопасно при ниски цени
  const savingsBGN = DISCOUNT_BGN

  const priceEUR = priceBGN / BGN_PER_EUR
  const memberPriceEUR = memberPriceBGN / BGN_PER_EUR
  const savingsEUR = savingsBGN / BGN_PER_EUR

  const fx2 = (n: number) => n.toFixed(2)

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{fuel.name}</span>
          <Badge variant="secondary" className="text-xs">
            лв/л • €/л
          </Badge>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="space-y-2">
          {/* Стандартна цена */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Стандартна цена:</span>
            <span className="text-right text-lg font-bold text-foreground">
              {fx2(priceBGN)} лв / {fx2(priceEUR)} €
            </span>
          </div>

          {/* С карта BG OIL */}
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">С карта BG OIL:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {fx2(memberPriceBGN)} лв / {fx2(memberPriceEUR)} €
              </span>

              {/* Спестяване: фиксирани 0.10 лв / еквивалента в евро */}
              <div className="text-xs text-primary font-medium">
                спестяване {fx2(savingsBGN)} лв/л / {fx2(savingsEUR)} €/л
              </div>
            </div>
          </div>
        </div>

        <div className="bg-accent/10 border border-accent/20 rounded-md p-2">
          <p className="text-xs text-black font-medium text-center">
            Получете карта BG OIL и спестете!
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
