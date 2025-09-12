// app/(site)/components/FuelCards.tsx  (Server Component)
import type { Fuel } from '@/lib/types'
import { BGN_PER_EUR, DISCOUNT_BGN } from '@/lib/config'

const fx2 = (n: number) => n.toFixed(2)

async function fetchFuels(): Promise<Fuel[]> {
  const base = process.env.NEXT_PUBLIC_BASE_URL ?? ''
  const res = await fetch(`${base}/api/fuel`, { cache: 'no-store' })
  if (!res.ok) throw new Error('Failed to load fuels')
  return res.json()
}

export default async function FuelCards() {
  const fuels = await fetchFuels()
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
      {fuels.map(f => {
        const priceEUR = f.price / BGN_PER_EUR
        const memberEUR = f.memberPrice / BGN_PER_EUR
        return (
          <div key={f.name} className="rounded-xl border bg-accent/10 p-5">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold">{f.name}</h3>
              <span className="text-xs rounded-full bg-secondary px-3 py-1 text-secondary-foreground">лв/л • €/л</span>
            </div>
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">Стандартна цена:</span>
                <div className="text-right font-bold">
                  {fx2(f.price)} лв / {fx2(priceEUR)} €
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-muted-foreground">С карта BG OIL:</span>
                <div className="text-right">
                  <div className="text-lg font-bold text-primary">
                    {fx2(f.memberPrice)} лв / {fx2(memberEUR)} €
                  </div>
                  <div className="text-xs text-primary font-medium">
                    спестяване {fx2(DISCOUNT_BGN)} лв/л / {fx2(DISCOUNT_BGN / BGN_PER_EUR)} €/л
                  </div>
                </div>
              </div>
            </div>
          </div>
        )
      })}
    </div>
  )
}
