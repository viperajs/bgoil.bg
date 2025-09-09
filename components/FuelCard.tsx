import type { Fuel } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

interface FuelCardProps {
  fuel: Fuel
}

export default function FuelCard({ fuel }: FuelCardProps) {
  const savings = fuel.price - fuel.memberPrice

  return (
    <Card className="relative overflow-hidden">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center justify-between">
          <span className="text-lg font-semibold">{fuel.name}</span>
          <Badge variant="secondary" className="text-xs">
            {fuel.unit}
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">Стандартна цена:</span>
            <span className="text-lg font-bold text-foreground">
              {fuel.price.toFixed(2)} {fuel.unit}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm text-muted-foreground">С карта BG OIL:</span>
            <div className="text-right">
              <span className="text-lg font-bold text-primary">
                {fuel.memberPrice.toFixed(2)} {fuel.unit}
              </span>
              {savings > 0 && (
                <div className="text-xs text-primary font-medium">спестяване {savings.toFixed(2)} лв/л</div>
              )}
            </div>
          </div>
        </div>

        {savings > 0 && (
          <div className="bg-accent/10 border border-accent/20 rounded-md p-2">
            <p className="text-xs text-accent-foreground font-medium text-center">Получете карта BG OIL и спестете!</p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
