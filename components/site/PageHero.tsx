import type { ReactNode } from "react"
import Drop from "./Drop"

interface PageHeroProps {
  eyebrow: string
  title: ReactNode
  lead?: string
  children?: ReactNode
}

/** Червена заглавна част за вътрешните страници. */
export default function PageHero({ eyebrow, title, lead, children }: PageHeroProps) {
  return (
    <section className="s-phero s-on-red">
      <Drop hollow className="s-phero__drop" />
      <div className="s-wrap s-phero__in">
        <span className="s-eyebrow">{eyebrow}</span>
        <h1>{title}</h1>
        {lead && <p className="s-lead">{lead}</p>}
        {children}
      </div>
      <span className="s-stripes s-phero__stripes" aria-hidden="true" />
    </section>
  )
}
