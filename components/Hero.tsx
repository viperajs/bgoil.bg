import Link from "next/link"
import { ArrowRight, Navigation, Sparkles } from "lucide-react"
import type { Fuel } from "@/lib/types"
import { companyInfo, contacts } from "@/lib/config"
import PriceBoard from "@/components/site/PriceBoard"

const stats = [
  { value: "24/7", label: "Никога не затваряме" },
  { value: "21+", label: "Години опит" },
  { value: "100%", label: "Европейско качество" },
]

interface HeroProps {
  fuels: Fuel[]
  discountMessage: string | null
}

export default function Hero({ fuels, discountMessage }: HeroProps) {
  return (
    <section className="s-hero">
      <div className="s-hero__copy">
        <span className="s-open">
          <span className="s-live" aria-hidden="true" />
          Отворено сега · Враца
        </span>

        <h1 className="s-h1">
          <span className="sr-only">{companyInfo.name} Враца — </span>
          Качеството <em>над всичко</em>
        </h1>

        <p className="s-lead">{companyInfo.description}</p>

        <div className="s-hero__actions">
          <Link href="/products" className="s-btn s-btn--red">
            Цени на горивата
            <ArrowRight className="s-arrow" aria-hidden="true" />
          </Link>
          <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--line">
            <Navigation aria-hidden="true" />
            Навигация
          </a>
        </div>

        {discountMessage && (
          <p className="s-hero__promo">
            <Sparkles aria-hidden="true" />
            {discountMessage}
          </p>
        )}

        <dl className="s-stats">
          {stats.map((s) => (
            <div key={s.label}>
              <dt>{s.value}</dt>
              <dd>{s.label}</dd>
            </div>
          ))}
        </dl>
      </div>

      <div className="s-hero__stage s-on-red">
        <div className="s-hero__sign">
          <span className="s-plate">0–24</span>
        </div>

        <div className="s-hero__media">
          <div className="s-hero__video">
            <video
              src="/hero.mp4"
              poster="/hero-poster.jpg"
              autoPlay
              muted
              loop
              playsInline
              preload="metadata"
              aria-label="Бензиностанция BG OIL във Враца"
            />
          </div>
          <PriceBoard fuels={fuels} className="s-board" />
        </div>
      </div>
    </section>
  )
}
