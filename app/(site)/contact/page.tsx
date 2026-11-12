import type { Metadata } from "next"
import { Mail, Navigation, Phone } from "lucide-react"
import ContactBlock from "@/components/ContactBlock"
import PageHero from "@/components/site/PageHero"
import { companyInfo, contacts } from "@/lib/config"

export const metadata: Metadata = {
  title: "Контакти",
  description: `Свържете се с ${companyInfo.name}.`,
}

const workingHours = [
  { service: "Бензиностанция", hours: "24/7", always: true },
  { service: "Магазин", hours: "24/7", always: true },
  { service: "EasyPay каса", hours: "24/7", always: true },
  { service: "Хотел рецепция", hours: "24/7", always: true },
  { service: "Автосервиз", hours: "Пон-Пет: 08:00-18:00", always: false },
  { service: "Автомивка", hours: "24/7", always: true },
]

const tel = (n: string) => `tel:${n.replace(/\s+/g, "")}`

export default function ContactPage() {
  return (
    <>
      <PageHero
        eyebrow="Локация"
        title={<>Свържете се <em>с нас</em></>}
        lead="Винаги на разположение. 24 часа. 7 дни в седмицата."
      />

      <section className="s-section">
        <div className="s-wrap">
          <div className="s-grid-3">
            <div className="s-card s-card--lift s-method" data-rv>
              <span className="s-icon s-icon--solid"><Phone aria-hidden="true" /></span>
              <h3>Обадете се</h3>
              <a href={tel(contacts.phoneMain)}>{contacts.phoneMain}</a>
              <a href={tel(contacts.phoneOwner2)}>{contacts.phoneOwner2}</a>
              <small>Основна линия</small>
            </div>

            <div className="s-card s-card--lift s-method" data-rv style={{ ["--rv" as string]: "70ms" }}>
              <span className="s-icon s-icon--solid"><Mail aria-hidden="true" /></span>
              <h3>Пишете ни</h3>
              <a href={`mailto:${contacts.email}`}>{contacts.email}</a>
              <small>До 24 часа отговор</small>
            </div>

            <div className="s-card s-card--lift s-method" data-rv style={{ ["--rv" as string]: "140ms" }}>
              <span className="s-icon s-icon--solid"><Navigation aria-hidden="true" /></span>
              <h3>Посетете ни</h3>
              <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
                {contacts.address}
              </a>
              <small>Навигация</small>
            </div>
          </div>
        </div>
      </section>

      <section className="s-section s-section--mist">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">Кога работим</span>
            <h2 className="s-h2">Работно време</h2>
          </div>

          <div className="s-hours" data-rv>
            {workingHours.map((item) => (
              <div key={item.service} className="s-hour">
                <span>{item.service}</span>
                <span className={item.always ? "is-open" : "is-part"}>
                  {item.always && <span className="s-live" aria-hidden="true" />}
                  {item.hours}
                </span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="s-section">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">BG OIL — Враца</span>
            <h2 className="s-h2">Как да ни намерите</h2>
          </div>
          <div data-rv>
            <ContactBlock />
          </div>
        </div>
      </section>
    </>
  )
}
