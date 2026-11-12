import type { Metadata } from "next"
import Link from "next/link"
import { ArrowRight, Check, Info } from "lucide-react"
import FuelCard from "@/components/FuelCard"
import PageHero from "@/components/site/PageHero"
import { getEffectiveFuels } from "@/lib/fuelStore"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Горива и цени",
  description: "Актуални цени на горива в BG OIL.",
}

const benefits = [
  "Отстъпки при всяко зареждане",
  "Специални промоции за членове",
  "Бонус точки за лоялност",
  "Бързо обслужване с приоритет",
]

export default async function ProductsPage() {
  const fuels = await getEffectiveFuels()

  return (
    <>
      <PageHero
        eyebrow="Ценова листа"
        title={<>Горива и <em>цени</em></>}
        lead="Винаги актуални цени за най-качествените горива във Враца."
      />

      <section className="s-section">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">В евро, на литър</span>
            <h2 className="s-h2">Актуални цени на горива</h2>
            <p className="s-lead">Цени с и без BG OIL Club карта.</p>
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
              Цените подлежат на промяна. Попитайте на касата за актуални стойности.
            </p>
          </div>
        </div>
      </section>

      <section className="s-section s-section--tight" style={{ paddingTop: 0 }}>
        <div className="s-wrap">
          <div className="s-club s-on-red" data-rv>
            <div>
              <span className="s-eyebrow">BG OIL Club</span>
              <h2>Спестете с всяко зареждане</h2>
              <p className="s-lead">
                Присъединете се към нашата лоялна програма и се възползвайте от ексклузивни отстъпки и предимства.
              </p>
              <ul className="s-checks">
                {benefits.map((b) => (
                  <li key={b}>
                    <Check aria-hidden="true" />
                    {b}
                  </li>
                ))}
              </ul>
              <Link href="/contact" className="s-btn s-btn--white">
                Заявете карта на място
                <ArrowRight className="s-arrow" aria-hidden="true" />
              </Link>
            </div>

            <div className="s-clubcard" aria-hidden="true">
              <img src="/bg-oil-logo.webp" alt="" width={99} height={34} />
              <span className="s-clubcard__tag">CLUB</span>
              <span className="s-clubcard__band" />
              <span className="s-clubcard__num">8823 •••• •••• 9281</span>
            </div>
          </div>
        </div>
      </section>
    </>
  )
}
