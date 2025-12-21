import type { Fuel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { CreditCard, TrendingDown, Sparkles } from "lucide-react"

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
  const savingsBGN = discountBGN

  const priceEUR = priceBGN / BGN_PER_EUR
  const memberPriceEUR = memberPriceBGN / BGN_PER_EUR
  const savingsEUR = savingsBGN / BGN_PER_EUR

  const fx2 = (n: number) => n.toFixed(2)

  return (
    <Card className="group relative overflow-hidden border-2 border-border hover:border-primary/50 transition-all duration-500 hover-lift bg-gradient-card shadow-lg hover:shadow-2xl">
      {/* Gradient Background */}
      <div className="absolute inset-0 bg-gradient-primary opacity-0 group-hover:opacity-5 transition-opacity duration-500"></div>
      
      {/* Top Accent Bar */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-primary opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
      
      {/* Badge */}
      <div className="absolute top-4 right-4 z-10">
        <Badge 
          variant="secondary" 
          className="bg-gradient-secondary text-white border-0 shadow-lg group-hover:scale-110 transition-transform duration-300"
        >
          <Sparkles className="w-3 h-3 mr-1" />
          Популярно
        </Badge>
      </div>

      <CardHeader className="pb-4 pt-8 relative z-10">
        <CardTitle className="flex items-center justify-between">
          <span className="text-xl font-bold text-foreground group-hover:text-primary transition-colors duration-300">
            {fuel.name}
          </span>
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6 relative z-10">
        {/* Standard Price */}
        <div className="space-y-2 p-4 rounded-xl bg-muted/50 border border-border group-hover:border-primary/30 transition-colors duration-300">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-muted-foreground">Стандартна цена:</span>
            <span className="text-right">
              <span className="text-2xl font-black text-foreground">
                {fx2(priceBGN)} лв
              </span>
              <span className="text-sm text-muted-foreground ml-2">/ {fx2(priceEUR)} €</span>
            </span>
          </div>
        </div>

        {/* Member Price - Highlighted */}
        <div className="relative p-5 rounded-xl bg-gradient-primary/10 border-2 border-primary/20 group-hover:border-primary/40 transition-all duration-300">
          <div className="flex items-center space-x-2 mb-3">
            <CreditCard className="w-5 h-5 text-primary" />
            <span className="text-sm font-bold text-primary">С карта BG OIL:</span>
          </div>
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <TrendingDown className="w-5 h-5 text-green-600" />
              <span className="text-xs font-medium text-green-600">Спестяване</span>
            </div>
            <div className="text-right">
              <span className="text-3xl font-black text-primary">
                {fx2(memberPriceBGN)} лв
              </span>
              <span className="text-sm text-primary/70 ml-2">/ {fx2(memberPriceEUR)} €</span>
              <div className="text-xs font-bold text-green-600 mt-1">
                -{fx2(savingsBGN)} лв/л
              </div>
            </div>
          </div>
        </div>

        {/* CTA Banner */}
        <div className="p-4 rounded-xl border border-primary/40 bg-gradient-to-r from-primary/15 via-secondary/15 to-primary/15 shadow-lg group-hover:shadow-primary/40 transition-all duration-300">
          <p className="text-sm font-semibold text-center flex items-center justify-center space-x-2 text-foreground">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span>Получете карта BG OIL и спестете!</span>
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
          </p>
        </div>

        {/* Store Discount Info */}
        <div className="p-3 rounded-lg border border-green-500/30 bg-green-500/10">
          <p className="text-xs font-medium text-center text-green-700 dark:text-green-400">
            💳 С карта BG OIL имате 10 % отстъпка при закупуване стоки от магазина на бензиностанцията
          </p>
        </div>
      </CardContent>

      {/* Shine Effect */}
      <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-1000 shine opacity-20"></div>
    </Card>
  )
}