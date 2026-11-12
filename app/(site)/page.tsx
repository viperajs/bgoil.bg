import type { Metadata } from "next"
import { ArrowUpRight, Clock, MapPin, Phone } from "lucide-react"
import Hero from "@/components/Hero"
import ServicesSection from "@/components/ServicesSection"
import FeaturedFuels from "@/components/FeaturedFuels"
import MoneyTransferSection from "@/components/MoneyTransferSection"
import Drop from "@/components/site/Drop"
import { companyInfo, contacts } from "@/lib/config"
import { getEffectiveFuels } from "@/lib/fuelStore"
import { getActiveDiscountBannerMessage } from "@/lib/discountBannerStore"

// Цените се обновяват от админ панела — опресняваме страницата най-много на минута.
export const revalidate = 60

export const metadata: Metadata = {
  title: "Начало",
  description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива (бензин, дизел, AdBlue), комфортни стаи за настаняване и пълен спектър от услуги. Работим 24/7 за вашето удобство.`,
  keywords: [
    "BG OIL ВРАЦА",
    "BG OIL Враца",
    "бензиностанция Враца",
    "горива Враца",
    "хотел Враца",
    "автосервиз Враца",
    "автомивка Враца",
    "бензин Враца",
    "дизел Враца",
    "AdBlue Враца",
    "24/7 бензиностанция Враца",
    "качествени горива Враца",
  ],
  openGraph: {
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца. Качествени горива, комфортни стаи и пълен спектър от услуги.`,
    url: "https://bgoil.bg",
    type: "website",
    images: [
      {
        url: "https://bgoil.bg/background.png",
        width: 1200,
        height: 630,
        alt: `${companyInfo.name} - Бензиностанция, хотел и автосервиз във Враца`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: `${companyInfo.name} - ${companyInfo.slogan}`,
    description: `${companyInfo.name} - модерна бензиностанция с 24/7 магазин, хотел, автосервиз и автомивка във Враца.`,
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: {
    canonical: "https://bgoil.bg",
  },
}

const tickerItems = [
  "Бензин А95", "Дизел", "AdBlue", "Магазин 24/7", "Хотел", "EasyPay 24/7", "Western Union",
  "MoneyGram", "Ria", "Безплатен паркинг", "Автосервиз", "Автомивка", "Качество №1",
]

export default async function HomePage() {
  const [fuels, discountMessage] = await Promise.all([getEffectiveFuels(), getActiveDiscountBannerMessage()])
  const telHref = `tel:${contacts.phoneMain.replace(/\s+/g, "")}`

  return (
    <>
      <Hero fuels={fuels} discountMessage={discountMessage} />

      {/* Движеща се лента с услугите */}
      <div className="s-ticker" aria-hidden="true">
        <div className="s-ticker__track">
          {[...tickerItems, ...tickerItems].map((item, i) => (
            <span className="s-ticker__item" key={i}>
              {item}
              <Drop />
            </span>
          ))}
        </div>
      </div>

      <FeaturedFuels fuels={fuels} discountMessage={discountMessage} />
      <ServicesSection />
      <MoneyTransferSection />

      {/* Къде сме */}
      <section className="s-find s-on-red" id="location">
        <span className="s-stripes" aria-hidden="true" style={{ marginTop: 22, opacity: 0.9 }} />
        <div className="s-wrap s-find__grid">
          <div data-rv>
            <span className="s-eyebrow">Намерете ни</span>
            <h2>Ние сме тук за вас</h2>
            <p className="s-lead">Намираме се в центъра на Враца. Работим денонощно — никога не затваряме.</p>

            <div className="s-find__list">
              <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
                <span className="i"><MapPin aria-hidden="true" /></span>
                <span>
                  <small>Адрес</small>
                  <b>{contacts.address}</b>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <a href={telHref}>
                <span className="i"><Phone aria-hidden="true" /></span>
                <span>
                  <small>Телефон</small>
                  <b>{contacts.phoneMain}</b>
                </span>
                <ArrowUpRight aria-hidden="true" />
              </a>
              <div>
                <span className="i"><Clock aria-hidden="true" /></span>
                <span>
                  <small>Работно време</small>
                  <b>24/7 — никога не затваряме</b>
                </span>
              </div>
            </div>

            <div className="s-find__actions">
              <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--white">
                <MapPin aria-hidden="true" />
                Отвори в Google Maps
              </a>
              <a href={telHref} className="s-btn s-btn--ghost-white">
                <Phone aria-hidden="true" />
                Обади се
              </a>
            </div>
          </div>

          <div className="s-find__photo" data-rv style={{ ["--rv" as string]: "120ms" }}>
            <img
              src="/fuel-station-reference.png"
              alt="Козирката на бензиностанция BG OIL във Враца"
              loading="lazy"
              width={1900}
              height={1900}
            />
          </div>
        </div>
      </section>
    </>
  )
}
