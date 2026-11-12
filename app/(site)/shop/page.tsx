import type { Metadata } from "next"
import { Clock, CreditCard, MapPin, Package } from "lucide-react"
import PageHero from "@/components/site/PageHero"
import ShopCatalog from "@/components/site/ShopCatalog"
import { contacts } from "@/lib/config"

export const metadata: Metadata = {
  title: "Магазин",
  description: "Авто продукти и консумативи в магазина на BG OIL във Враца. Налично 24/7, с отстъпка за BG OIL Club.",
}

const features = [
  { icon: Package, title: "Качествени продукти", description: "Само оригинални и проверени авто продукти" },
  { icon: Clock, title: "24/7 наличност", description: "Винаги на разположение на нашата станция" },
  { icon: CreditCard, title: "Удобно плащане", description: "Кеш, карта и карти за гориво" },
  { icon: MapPin, title: "Лесна локация", description: "Директно на бензиностанцията във Враца" },
]

export default function ShopPage() {
  return (
    <>
      <PageHero
        eyebrow="Магазин"
        title={<>Premium <em>авто части</em></>}
        lead="Всичко необходимо за вашия автомобил. Налично 24/7."
      >
        <div className="s-phero__card">
          <span className="i"><CreditCard aria-hidden="true" /></span>
          <span>
            <b>
              −10% отстъпка с карта <em>BG OIL Club</em>
            </b>
            <small>Важи за всички продукти в магазина при представяне на карта.</small>
          </span>
        </div>
      </PageHero>

      <section className="s-section">
        <div className="s-wrap">
          <ShopCatalog />
        </div>
      </section>

      <section className="s-section s-section--mist">
        <div className="s-wrap">
          <div className="s-grid-4">
            {features.map((f, i) => (
              <div key={f.title} className="s-card s-feature" data-rv style={{ ["--rv" as string]: `${i * 70}ms` }}>
                <span className="s-icon"><f.icon aria-hidden="true" /></span>
                <h3>{f.title}</h3>
                <p>{f.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-section">
        <div className="s-wrap">
          <div className="s-how s-on-ink" data-rv>
            <div>
              <span className="s-eyebrow">Купуване</span>
              <h2 className="s-h2">Как да закупите?</h2>
              <p className="s-lead">
                Всички продукти са налични на място. Заповядайте на нашата станция, където нашият екип ще ви
                консултира.
              </p>
            </div>
            <ul className="s-how__list">
              <li>
                <span className="s-icon"><MapPin aria-hidden="true" /></span>
                {contacts.address}
              </li>
              <li>
                <span className="s-icon"><Clock aria-hidden="true" /></span>
                Отворено 24/7
              </li>
            </ul>
          </div>
        </div>
      </section>
    </>
  )
}
