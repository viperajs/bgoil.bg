import type { CSSProperties } from "react"
import Image from "next/image"
import { Clock, Globe2, Receipt, ShieldCheck, Zap } from "lucide-react"

function MoneyGramLogo() {
  return (
    <svg viewBox="0 0 240 120" style={{ width: "78%", height: "auto" }} role="img" aria-label="MoneyGram">
      <circle cx="120" cy="38" r="26" fill="#E0322B" />
      <path
        d="M131 25 L140 25 L140 34 M140 25 L128 37 A11 11 0 1 1 124 29"
        fill="none"
        stroke="#fff"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <text x="120" y="92" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontWeight="700" fontSize="30" fill="#2B2B2B" letterSpacing="-0.5">
        MoneyGram
      </text>
      <text x="120" y="111" textAnchor="middle" fontFamily="Arial, Helvetica, sans-serif" fontStyle="italic" fontSize="13" fill="#7a7a7a">
        money transfer
      </text>
    </svg>
  )
}

function EasyPayLogo() {
  const word: CSSProperties = {
    fontFamily: "Arial, Helvetica, sans-serif",
    fontWeight: 900,
    fontSize: "clamp(26px, 3.4vw, 38px)",
    lineHeight: 1,
    letterSpacing: "-0.02em",
    color: "#fff",
  }
  return (
    <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column" }} role="img" aria-label="EasyPay">
      <div style={{ flex: 1, display: "flex", alignItems: "flex-end", justifyContent: "center", paddingBottom: 4, background: "#E4202A" }}>
        <span style={word}>Easy</span>
      </div>
      <div style={{ flex: 1, display: "flex", alignItems: "flex-start", justifyContent: "center", paddingTop: 4, background: "#27348B" }}>
        <span style={word}>Pay</span>
      </div>
    </div>
  )
}

const partners = [
  {
    name: "Western Union",
    description: "Международни парични преводи — изпращане и получаване.",
    bg: "#D9BF0E",
    logo: (
      <Image
        src="/partners/western-union.png"
        alt="Western Union"
        fill
        sizes="(max-width: 900px) 50vw, 320px"
        style={{ objectFit: "cover" }}
      />
    ),
  },
  {
    name: "MoneyGram",
    description: "Бързи преводи до и от близки по целия свят.",
    bg: "#FFFFFF",
    logo: <MoneyGramLogo />,
  },
  {
    name: "Ria",
    description: "Изгодни преводи с изплащане в брой.",
    bg: "#FF6600",
    logo: (
      <Image
        src="/partners/ria.png"
        alt="Ria Money Transfer"
        fill
        sizes="(max-width: 900px) 50vw, 320px"
        style={{ objectFit: "contain", padding: 14 }}
      />
    ),
  },
  {
    name: "EasyPay",
    description: "Плащане на сметки, данъци и кредити — денонощно.",
    bg: "#27348B",
    logo: <EasyPayLogo />,
  },
]

const features = [
  { icon: Globe2, label: "Преводи по целия свят" },
  { icon: Zap, label: "Бързо обслужване" },
  { icon: ShieldCheck, label: "Сигурни плащания" },
  { icon: Receipt, label: "Сметки и такси" },
  { icon: Clock, label: "Отворено 24/7" },
]

export default function MoneyTransferSection() {
  return (
    <section className="s-section" id="money">
      <div className="s-wrap s-money">
        <div data-rv>
          <span className="s-eyebrow">Парични преводи</span>
          <h2 className="s-h2" style={{ marginTop: 16 }}>
            Изпращайте пари <em>от нас</em>
          </h2>
          <p className="s-lead" style={{ marginTop: 16 }}>
            В бензиностанцията ще намерите каса с водещите услуги за парични преводи и плащане на сметки — докато
            зареждате.
          </p>
          <ul className="s-chips">
            {features.map((f) => (
              <li key={f.label} className="s-chip">
                <f.icon aria-hidden="true" />
                {f.label}
              </li>
            ))}
          </ul>
        </div>

        <div className="s-partners">
          {partners.map((p, i) => (
            <article key={p.name} className="s-partner" data-rv style={{ ["--rv" as string]: `${i * 70}ms` }}>
              <div className="s-partner__logo" style={{ background: p.bg }}>
                {p.logo}
              </div>
              <div className="s-partner__body">
                <h3>{p.name}</h3>
                <p>{p.description}</p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
