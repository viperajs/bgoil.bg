import Link from "next/link"
import { ArrowRight, Info, Sparkles } from "lucide-react"
import type { Fuel } from "@/lib/types"
import FuelCard from "./FuelCard"

interface FeaturedFuelsProps {
  fuels: Fuel[]
  discountMessage: string | null
}

export default function FeaturedFuels({ fuels, discountMessage }: FeaturedFuelsProps) {
  return (
    <section className="s-section" id="fuels">
      <div className="s-wrap">
        <div className="s-head s-head--row" data-rv>
          <div className="s-head" style={{ marginBottom: 0 }}>
            <span className="s-eyebrow">Актуални цени</span>
            <h2 className="s-h2">
              Горива и <em>цени</em>
            </h2>
            <p className="s-lead">
              Най-високо качество горива на конкурентни цени. С карта BG OIL Club плащате по-малко на всеки литър.
            </p>
          </div>
          <Link href="/products" className="s-btn s-btn--ink">
            Виж всички цени
            <ArrowRight className="s-arrow" aria-hidden="true" />
          </Link>
        </div>

        <div className="s-fuels">
          {fuels.map((fuel, i) => (
            <div key={fuel.name} data-rv style={{ ["--rv" as string]: `${i * 80}ms` }}>
              <FuelCard fuel={fuel} />
            </div>
          ))}
        </div>

        <div className="s-after">
          <p className="s-note">
            <Info aria-hidden="true" />
            Цените са ориентировъчни и подлежат на промяна.
          </p>
          {discountMessage && (
            <p className="s-promo-line">
              <Sparkles aria-hidden="true" />
              {discountMessage}
            </p>
          )}
        </div>
      </div>
    </section>
  )
}
