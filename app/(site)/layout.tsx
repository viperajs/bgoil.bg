import type React from "react"
import { Unbounded, Onest } from "next/font/google"
import Header from "@/components/Header"
import Footer from "@/components/Footer"
import RevealObserver from "@/components/site/RevealObserver"

import "./site.css"

// И двата шрифта имат пълна кирилица.
const display = Unbounded({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-site-display",
})

const text = Onest({
  subsets: ["latin", "cyrillic"],
  display: "swap",
  variable: "--font-site-text",
})

export default function SiteLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className={`site-root ${display.variable} ${text.variable}`}>
      <noscript>
        <style>{`[data-rv]{opacity:1!important;transform:none!important}`}</style>
      </noscript>
      <Header />
      <main id="content">{children}</main>
      <Footer />
      <RevealObserver />
    </div>
  )
}
