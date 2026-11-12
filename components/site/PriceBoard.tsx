import Link from "next/link"
import { ArrowRight } from "lucide-react"
import type { Fuel } from "@/lib/types"
import { eur, fuelKind, fuelLabel, fuelPriceEUR, nozzleColor } from "@/lib/fuelPrice"

/** Табло с актуалните цени в евро — като ценовия пилон пред бензиностанцията. */
export default function PriceBoard({ fuels, className = "" }: { fuels: Fuel[]; className?: string }) {
  return (
    <div className={className}>
      <div className="s-board__panel s-on-ink">
        <div className="s-board__head">
          <span>
            <span className="s-live" aria-hidden="true" />
            Цени днес
          </span>
          <small>€ / литър</small>
        </div>

        <div className="s-board__rows">
          {fuels.map((fuel) => {
            const p = fuelPriceEUR(fuel)
            const color = nozzleColor[fuelKind(fuel.name)]
            return (
              <div className="s-board__row" key={fuel.name}>
                <span className="s-board__name">
                  <i style={{ ["--nozzle" as string]: color === "#131316" ? "#8d8d96" : color }} aria-hidden="true" />
                  {fuelLabel(fuel.name)}
                </span>
                <span className="s-board__price">
                  <b>{eur(p.price)}</b>
                  {p.saving > 0 && <small>с карта {eur(p.member)}</small>}
                </span>
              </div>
            )
          })}
        </div>

        <Link href="/products" className="s-board__foot">
          <span>
            Всички цени<span className="s-board__more"> и отстъпки</span>
          </span>
          <ArrowRight aria-hidden="true" />
        </Link>
      </div>
    </div>
  )
}
