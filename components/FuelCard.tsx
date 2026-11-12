import { CreditCard, Droplets, Flame, Fuel as FuelIcon, Leaf } from "lucide-react"
import type { Fuel } from "@/lib/types"
import { eur, fuelKind, fuelLabel, fuelPriceEUR, nozzleColor } from "@/lib/fuelPrice"

const icons = { petrol: FuelIcon, diesel: Droplets, lpg: Flame, adblue: Leaf }

export default function FuelCard({ fuel }: { fuel: Fuel }) {
  const kind = fuelKind(fuel.name)
  const Icon = icons[kind]
  const p = fuelPriceEUR(fuel)

  return (
    <article className="s-fuel" style={{ ["--nozzle" as string]: nozzleColor[kind] }}>
      <div className="s-fuel__top">
        <h3 className="s-fuel__name">{fuelLabel(fuel.name)}</h3>
        <span className="s-fuel__icon" aria-hidden="true">
          <Icon />
        </span>
      </div>

      <div className="s-fuel__price">
        <b>{eur(p.price)}</b>
        <span>€</span>
      </div>
      <p className="s-fuel__unit">редовна цена на литър</p>

      <div className="s-fuel__club">
        <span className="s-fuel__club-label">
          <CreditCard aria-hidden="true" />
          BG OIL Club
        </span>
        <b>{eur(p.member)} €</b>
        {p.saving > 0 && (
          <span className="s-fuel__save">
            −{eur(p.saving)} € <span>на литър</span>
          </span>
        )}
      </div>
    </article>
  )
}
