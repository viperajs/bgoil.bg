import type { Metadata } from "next"
import { Award, Check, Clock, CreditCard, Heart, Shield, Users, Wrench, Zap } from "lucide-react"
import PageHero from "@/components/site/PageHero"
import Drop from "@/components/site/Drop"
import { companyInfo } from "@/lib/config"

export const metadata: Metadata = {
  title: "За нас",
  description: `Научете повече за ${companyInfo.name}.`,
}

const mission = [
  "В свят на компромиси, ние избираме качеството. Нашата цел не е просто да напълним резервоара ви, а да осигурим спокойствие на пътя. От създаването си, BG OIL се гради върху честност, иновации и уважение към всеки клиент.",
  "Вярваме, че всяко зареждане е възможност да покажем какво означава истинско обслужване — бързо, коректно и с внимание към детайла. Затова инвестираме в хора, технологии и среда, която прави разликата.",
]

const stats = [
  { value: "24/7", label: "Обслужване" },
  { value: "100%", label: "Качество" },
  { value: "5+", label: "Услуги" },
  { value: "Враца", label: "Локация" },
]

const highlights = [
  "Горива на европейско качество",
  "Хотел, автосервиз и автомивка",
  "EasyPay каса 24/7",
  "BG OIL CLUB карта с отстъпки",
]

const values = [
  { icon: Award, title: "Качество", description: "Предлагаме само най-качествени горива и услуги на европейски стандарт" },
  { icon: Users, title: "Клиентоориентираност", description: "Нашите клиенти са в центъра на всичко, което правим" },
  { icon: Clock, title: "Надеждност", description: "24/7 обслужване и винаги готови да помогнем" },
  { icon: Shield, title: "Сигурност", description: "Най-високи стандарти за безопасност и качество" },
  { icon: Heart, title: "Грижа", description: "Грижим се за нашите клиенти, общността и околната среда" },
  { icon: Zap, title: "Иновации", description: "Постоянно инвестираме в нови технологии и подобрения" },
]

const additionalServices = [
  {
    title: "Автосервиз и автокозметика",
    description:
      "Работим с доверени майстори, а аз лично следя сервизът да остава практичен, честен и винаги с налични части за спешни ремонти.",
    icon: Wrench,
    list: [
      "Авточасти и сервиз с бърза диагностика и монтаж на оригинални и алтернативни компоненти",
      "Автобои и консумативи за локални ремонти или цялостно възстановяване на автомобила",
      "Гуми и машинно изправяне на джанти с модерна баланс машина и гаранция за праволинейност",
      "Камера за боядисване под наем за професионалисти, които искат контрол върху резултата",
      "Автомивка на самообслужване за финалното полиране преди път",
    ],
  },
  {
    title: "EasyPay каса",
    description:
      "На разположение е EasyPay каса за бързо и удобно плащане на различни сметки и услуги без излишно губене на време.",
    icon: CreditCard,
    list: [
      "Плащане на сметки за ток, вода, телефон и интернет",
      "Плащане на данъци и такси",
      "Попълване на мобилни кредити",
      "Плащане на застраховки",
      "Достъпно 24/7 за вашето удобство",
    ],
  },
]

export default function AboutPage() {
  return (
    <>
      <PageHero
        eyebrow="Нашата история"
        title={<>Повече от <em>бензиностанция</em></>}
        lead="История за качество, доверие и стремеж към съвършенство в сърцето на Враца."
      />

      {/* Мисия */}
      <section className="s-section">
        <div className="s-wrap s-mission">
          <div data-rv>
            <span className="s-eyebrow">Мисия</span>
            <h2 className="s-h2" style={{ marginTop: 16 }}>
              Мисията на <em>BG OIL</em>
            </h2>

            <div className="s-mission__text">
              {mission.map((text) => (
                <p key={text.slice(0, 24)}>{text}</p>
              ))}
            </div>

            <dl className="s-facts">
              {stats.map((s) => (
                <div key={s.label}>
                  <dt>{s.value}</dt>
                  <dd>{s.label}</dd>
                </div>
              ))}
            </dl>

            <ul className="s-checks">
              {highlights.map((item) => (
                <li key={item}>
                  <Check aria-hidden="true" />
                  {item}
                </li>
              ))}
            </ul>
          </div>

          <div className="s-mission__photo" data-rv style={{ ["--rv" as string]: "120ms" }}>
            <img src="/fuel-station-reference.png" alt="Козирката на бензиностанция BG OIL" loading="lazy" />
            <figure className="s-quote" style={{ margin: 0 }}>
              <Drop />
              <p>Качеството е нашата визитна картичка.</p>
              <small>BG OIL</small>
            </figure>
          </div>
        </div>
      </section>

      {/* Ценности */}
      <section className="s-section s-section--mist">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">Принципи</span>
            <h2 className="s-h2">Нашите ценности</h2>
            <p className="s-lead">Принципите, които ни водят напред.</p>
          </div>

          <div className="s-grid-3">
            {values.map((val, i) => (
              <div
                key={val.title}
                className="s-card s-card--lift s-feature"
                data-rv
                style={{ ["--rv" as string]: `${(i % 3) * 70}ms` }}
              >
                <span className="s-icon"><val.icon aria-hidden="true" /></span>
                <h3>{val.title}</h3>
                <p>{val.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Допълнителни услуги */}
      <section className="s-section">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">На ваше разположение</span>
            <h2 className="s-h2">Допълнителни услуги</h2>
            <p className="s-lead">
              На място ще намерите пълноценен автосервиз и EasyPay каса, за да продължите пътя си с обслужен автомобил
              и без излишно губене на време.
            </p>
          </div>

          <div className="s-grid-2">
            {additionalServices.map((service, i) => (
              <article key={service.title} className="s-card s-extra" data-rv style={{ ["--rv" as string]: `${i * 100}ms` }}>
                <span className="s-icon s-icon--solid"><service.icon aria-hidden="true" /></span>
                <h3>{service.title}</h3>
                <p>{service.description}</p>
                <ul>
                  {service.list.map((item) => (
                    <li key={item}>{item}</li>
                  ))}
                </ul>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  )
}
