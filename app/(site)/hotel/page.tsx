import type { Metadata } from "next"
import {
  ArrowUpRight, BedDouble, Car, LogIn, LogOut, Info, Mail, MapPin, MoonStar, Phone, Ruler, Snowflake, Users,
} from "lucide-react"
import PageHero from "@/components/site/PageHero"
import { companyInfo, contacts } from "@/lib/config"
import { getAvailableRooms } from "@/lib/roomsStore"
import { getHotelInfo } from "@/lib/hotelStore"

export const revalidate = 60

export const metadata: Metadata = {
  title: "Хотел",
  description: "Комфортни стаи за настаняване в BG OIL - единични, двойни, тройни стаи и апартаменти.",
  keywords: ["хотел Враца", "настаняване Враца", "стаи Враца", "BG OIL хотел"],
  openGraph: {
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация и черни аут блокиращи завеси.",
    url: "https://bgoil.bg/hotel",
    type: "website",
    images: [{ url: "https://bgoil.bg/background.png", width: 1200, height: 630, alt: "BG OIL ВРАЦА - Хотел" }],
  },
  twitter: {
    card: "summary_large_image",
    title: `Хотел - ${companyInfo.name}`,
    description: "Комфортни стаи за настаняване с климатизация.",
    images: ["https://bgoil.bg/background.png"],
  },
  alternates: { canonical: "https://bgoil.bg/hotel" },
}

const amenitiesGeneral = [
  { icon: Snowflake, title: "Климатизация", description: "Пълна климатизация във всички стаи" },
  { icon: MoonStar, title: "Черни аут завеси", description: "Блокиращи светлина за спокоен сън" },
  { icon: Car, title: "Безплатен паркинг", description: "Охраняван паркинг за гостите на хотела" },
]

const bookingSteps = ["Изберете тип стая", "Свържете се с нас", "Потвърждение", "Настаняване"]

export default async function HotelPage() {
  const [rooms, info] = await Promise.all([getAvailableRooms(), getHotelInfo()])
  const telHref = `tel:${contacts.hotelReservation.replace(/\s+/g, "")}`

  const contactRows = [
    { icon: Phone, href: telHref, value: contacts.hotelReservation, go: "Обади се", external: false },
    { icon: Mail, href: `mailto:${contacts.email}?subject=Резервация на стая`, value: contacts.email, go: "Изпрати", external: false },
    { icon: MapPin, href: contacts.mapsLink, value: contacts.address, go: "Карта", external: true },
  ]

  return (
    <>
      <PageHero
        eyebrow="Настаняване"
        title={<>Хотел <em>BG OIL</em></>}
        lead="Комфортни стаи с климатизация и черни аут блокиращи завеси. Идеално за професионални шофьори и семейства."
      >
        <div className="s-phero__actions">
          <a href={telHref} className="s-btn s-btn--white">
            <Phone aria-hidden="true" />
            Резервация: {contacts.hotelReservation}
          </a>
        </div>
      </PageHero>

      {/* Стаи */}
      <section className="s-section">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">Цени на нощувка</span>
            <h2 className="s-h2">Видове стаи</h2>
            <p className="s-lead">Изберете стая според вашите нужди.</p>
          </div>

          <div className="s-rooms">
            {rooms.map((room, i) => (
              <article key={room.id} className="s-room" data-rv style={{ ["--rv" as string]: `${(i % 4) * 70}ms` }}>
                <div className="s-room__photo">
                  {room.images?.[0] ? (
                    <img src={room.images[0]} alt={room.name} loading="lazy" />
                  ) : (
                    <BedDouble aria-hidden="true" />
                  )}
                  {room.type && <span className="s-tag s-tag--white">{room.type}</span>}
                </div>

                <div className="s-room__body">
                  <h3>{room.name}</h3>
                  <div className="s-room__meta">
                    <span>
                      <Users aria-hidden="true" />
                      {room.capacity} {room.capacity === 1 ? "гост" : "гости"}
                    </span>
                    {room.size && (
                      <span>
                        <Ruler aria-hidden="true" />
                        {room.size}
                      </span>
                    )}
                    {room.bedType && (
                      <span>
                        <BedDouble aria-hidden="true" />
                        {room.bedType}
                      </span>
                    )}
                  </div>

                  {room.description && <p className="s-room__desc">{room.description}</p>}

                  {(room.amenities?.length ?? 0) > 0 && (
                    <div className="s-room__amen">
                      {room.amenities.slice(0, 4).map((a) => (
                        <span key={a}>{a}</span>
                      ))}
                      {room.amenities.length > 4 && <span>+{room.amenities.length - 4}</span>}
                    </div>
                  )}

                  <div className="s-room__foot">
                    <div>
                      <b>{room.price.toFixed(0)} €</b>
                      <small>на нощувка</small>
                    </div>
                    <a href={telHref} aria-label={`Обади се за ${room.name}`} className="s-btn s-btn--red s-btn--sm">
                      <Phone aria-hidden="true" />
                      Обади се
                    </a>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* Часове и удобства */}
      <section className="s-section s-section--mist">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">Часове</span>
            <h2 className="s-h2">Информация за настаняване</h2>
          </div>

          <div className="s-times" data-rv>
            <div className="s-time">
              <span className="s-icon s-icon--round s-icon--solid"><LogIn aria-hidden="true" /></span>
              <div>
                <small>Настаняване</small>
                <b>от {info.checkIn}</b>
              </div>
            </div>
            <div className="s-time">
              <span className="s-icon s-icon--round"><LogOut aria-hidden="true" /></span>
              <div>
                <small>Напускане</small>
                <b>до {info.checkOut}</b>
              </div>
            </div>
          </div>

          <div className="s-head" style={{ marginTop: "clamp(48px, 6vw, 80px)" }} data-rv>
            <span className="s-eyebrow">Във всяка стая</span>
            <h2 className="s-h2">Удобства</h2>
          </div>

          <div className="s-grid-3">
            {amenitiesGeneral.map((a, i) => (
              <div key={a.title} className="s-card s-feature" data-rv style={{ ["--rv" as string]: `${i * 70}ms` }}>
                <span className="s-icon"><a.icon aria-hidden="true" /></span>
                <h3>{a.title}</h3>
                <p>{a.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Резервация */}
      <section className="s-section">
        <div className="s-wrap">
          <div className="s-head" data-rv>
            <span className="s-eyebrow">Резервация</span>
            <h2 className="s-h2">Как да резервирате стая?</h2>
          </div>

          <div className="s-reserve">
            <div data-rv>
              <h3>Свържете се с нас</h3>
              <div className="s-contact-rows">
                {contactRows.map((row) => (
                  <a
                    key={row.value}
                    href={row.href}
                    className="s-contact-row"
                    {...(row.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  >
                    <span className="s-icon"><row.icon aria-hidden="true" /></span>
                    <b>{row.value}</b>
                    <span className="go">
                      {row.go}
                      <ArrowUpRight aria-hidden="true" />
                    </span>
                  </a>
                ))}
              </div>
            </div>

            <div data-rv style={{ ["--rv" as string]: "100ms" }}>
              <h3>Информация за резервация</h3>
              <ol className="s-steps">
                {bookingSteps.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
              <p className="s-info" style={{ marginTop: 18 }}>
                <Info aria-hidden="true" />
                <span>
                  <strong>Резервации 24/7</strong> · Предварителна резервация препоръчителна · Плащане на място
                </span>
              </p>
            </div>
          </div>

          <p className="s-info" style={{ marginTop: "clamp(32px, 4vw, 48px)" }} data-rv>
            <Info aria-hidden="true" />
            <span>
              Цените са ориентировъчни и подлежат на промяна. За резервация и потвърждение на актуалните стойности,
              моля, обърнете се към персонала на място или по телефон <strong>{contacts.phoneMain}</strong>.
            </span>
          </p>
        </div>
      </section>
    </>
  )
}
