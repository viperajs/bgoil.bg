"use client"

import { useState } from "react"
import { Check, Copy, MapPin, Navigation } from "lucide-react"
import { contacts } from "@/lib/config"

export default function ContactBlock() {
  const [copied, setCopied] = useState(false)

  const copyAddress = async () => {
    try {
      await navigator.clipboard.writeText(contacts.address)
      setCopied(true)
      setTimeout(() => setCopied(false), 2000)
    } catch (err) {
      console.error("Failed to copy address:", err)
    }
  }

  return (
    <div className="s-map">
      <iframe
        title="BG OIL – Враца на картата"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.6139271941474!2d23.55826272337812!3d43.22007707884682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ab18f88feff55d%3A0xd70eca3fe0c2fbfe!2z0JHQkyDQntCZ0Js!5e0!3m2!1sbg!2sbg!4v1757458602843!5m2!1sbg!2sbg"
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        allowFullScreen
      />

      <div className="s-map__bar">
        <div className="s-map__addr">
          <span className="s-icon"><MapPin aria-hidden="true" /></span>
          <div>
            <b>{contacts.address}</b>
            <button type="button" onClick={copyAddress} className="s-map__copy" aria-live="polite">
              {copied ? (
                <><Check aria-hidden="true" /> Копирано</>
              ) : (
                <><Copy aria-hidden="true" /> Копирай адреса</>
              )}
            </button>
          </div>
        </div>

        <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer" className="s-btn s-btn--red">
          <Navigation aria-hidden="true" />
          Навигация
        </a>
      </div>
    </div>
  )
}
