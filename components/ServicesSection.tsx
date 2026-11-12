import Link from "next/link"
import {
  ArrowUpRight, BedDouble, Camera, Car, CreditCard, Disc, Fuel, ParkingSquare, ShoppingBag, Wrench,
} from "lucide-react"

const services = [
  {
    icon: Fuel,
    name: "Бензиностанция",
    description: "Висококачествени горива — Бензин А95, Дизел, ГПБ и AdBlue на конкурентни цени.",
    link: "/products",
    go: "Виж цените",
  },
  {
    icon: ShoppingBag,
    name: "Магазин 24/7",
    description: "Непрекъснато работещ магазин с всичко необходимо за пътуването и автомобила ви.",
    link: "/shop",
    go: "Към магазина",
  },
  {
    icon: CreditCard,
    name: "EasyPay 24/7",
    description: "Плащайте сметки, данъци и мобилни кредити денонощно без опашки.",
    link: "/about",
    go: "Научи повече",
  },
  {
    icon: BedDouble,
    name: "Хотел",
    description: "Комфортни стаи с климатизация и черни аут завеси. Единични, двойни, тройни и апартаменти.",
    link: "/hotel",
    go: "Виж стаите",
  },
  {
    icon: Wrench,
    name: "Автосервиз",
    description: "Пълен сервиз с бърза диагностика, оригинални части и честни цени.",
    link: "/about",
    go: "Научи повече",
  },
  {
    icon: Car,
    name: "Автомивка",
    description: "Самообслужваща се автомивка за финалното полиране преди път.",
    link: "/about",
    go: "Научи повече",
  },
  {
    icon: Disc,
    name: "Гуми и джанти",
    description: "Монтаж, баланс и изправяне на джанти с модерна техника.",
    link: "/about",
    go: "Научи повече",
  },
  {
    icon: Camera,
    name: "Камера за боядисване",
    description: "Под наем за професионалисти, търсещи перфектен контрол над резултата.",
    link: "/about",
    go: "Научи повече",
  },
  {
    icon: ParkingSquare,
    name: "Безплатен паркинг",
    description: "Охраняван и безплатен паркинг за всички клиенти на комплекса.",
    link: "/contact",
    go: "Как да ни намерите",
  },
]

export default function ServicesSection() {
  return (
    <section className="s-section s-section--mist" id="services">
      <div className="s-wrap">
        <div className="s-head" data-rv>
          <span className="s-eyebrow">Всичко на едно място</span>
          <h2 className="s-h2">
            Повече от <em>бензиностанция</em>
          </h2>
          <p className="s-lead">
            Зареждате, пазарувате, плащате сметки, обслужвате колата и нощувате — без да напускате комплекса.
          </p>
        </div>

        <div className="s-services">
          {services.map((service, i) => (
            <Link
              key={service.name}
              href={service.link}
              className={`s-service${i === 0 ? " s-service--lead" : ""}`}
              data-rv
              style={{ ["--rv" as string]: `${(i % 3) * 70}ms` }}
            >
              <span className="s-service__icon" aria-hidden="true">
                <service.icon />
              </span>
              <h3>{service.name}</h3>
              <p>{service.description}</p>
              <span className="s-service__go">
                {service.go}
                <ArrowUpRight aria-hidden="true" />
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
