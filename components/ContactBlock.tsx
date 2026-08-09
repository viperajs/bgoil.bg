"use client"

import { contacts } from "@/lib/config"
import { Card, CardContent } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Navigation, Copy, Check, Info } from "lucide-react"
import { useState } from "react"

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
    <div className="space-y-8 h-full flex flex-col">
      {/* Google Maps Embed - Full Height */}
      <div className="flex-1 min-h-[400px] w-full rounded-md overflow-hidden border border-border p-2 relative group">
        <div className="w-full h-full rounded-md overflow-hidden relative">
          <iframe
            title="BG OIL – Враца на картата"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.6139271941474!2d23.55826272337812!3d43.22007707884682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ab18f88feff55d%3A0xd70eca3fe0c2fbfe!2z0JHQkyDQntCZ0Js!5e0!3m2!1sbg!2sbg!4v1757458602843!5m2!1sbg!2sbg"
            className="w-full h-full filter invert-[.9] hue-rotate-180 grayscale-[.5] contrast-[1.2] opacity-80 group-hover:opacity-100 group-hover:filter-none transition-all duration-700"
            style={{ border: 0 }}
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            allowFullScreen
          />
        </div>

        {/* Floating Action Bar */}
        <div className="absolute bottom-6 left-6 right-6 flex flex-col md:flex-row gap-4">
          <div className="flex-1 bg-card/90 backdrop-blur-md rounded-md p-4 border border-border flex items-center justify-between min-h-[64px]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-brand-500/15 flex items-center justify-center text-brand-500 flex-shrink-0">
                <MapPin className="w-5 h-5" />
              </div>
              <div className="text-left">
                <p className="text-foreground font-bold text-sm truncate max-w-[200px]">{contacts.address}</p>
                <button onClick={copyAddress} className="text-xs text-brand-500 hover:text-foreground transition-colors flex items-center gap-1">
                  {copied ? <><Check className="w-3 h-3" /> Копирано</> : <><Copy className="w-3 h-3" /> Копирай адрес</>}
                </button>
              </div>
            </div>
          </div>

          <Button asChild size="lg">
            <a href={contacts.mapsLink} target="_blank" rel="noopener noreferrer">
              <Navigation className="w-5 h-5" />
              <span className="hidden md:inline">Навигация</span>
            </a>
          </Button>
        </div>
      </div>
    </div>
  )
}