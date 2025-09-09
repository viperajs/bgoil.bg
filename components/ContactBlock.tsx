"use client"

import { contacts } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Navigation, Copy } from "lucide-react"
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
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Контактна информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
                <div className="flex-1">
                  <p className="text-sm font-medium text-card-foreground">Адрес:</p>
                  <p className="text-sm text-muted-foreground">{contacts.address}</p>
                  <Button variant="ghost" size="sm" onClick={copyAddress} className="mt-1 h-auto p-1 text-xs">
                    <Copy className="w-3 h-3 mr-1" />
                    {copied ? "Копирано!" : "Копирай адрес"}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Основен телефон:</p>
                  <a href={`tel:${contacts.phoneMain}`} className="text-sm text-primary hover:underline">
                    {contacts.phoneMain}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Хотел резервации:</p>
                  <a href={`tel:${contacts.hotelPhone}`} className="text-sm text-primary hover:underline">
                    {contacts.hotelPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-primary flex-shrink-0" />
                <div>
                  <p className="text-sm font-medium text-card-foreground">Имейл:</p>
                  <a href={`mailto:${contacts.email}`} className="text-sm text-primary hover:underline">
                    {contacts.email}
                  </a>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-3">
              <Button asChild>
                <a
                  href={contacts.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Навигирай с Google Maps</span>
                </a>
              </Button>

              <Button variant="outline" asChild>
                <a href={`tel:${contacts.phoneMain}`} className="flex items-center justify-center space-x-2">
                  <Phone className="w-4 h-4" />
                  <span>Обади се сега</span>
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Maps Embed */}
      <Card>
        <CardHeader>
          <CardTitle>Местоположение</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="aspect-video w-full rounded-md overflow-hidden">
<iframe
  title="BG OIL – Враца на картата"
  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.6139271941474!2d23.55826272337812!3d43.22007707884682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ab18f88feff55d%3A0xd70eca3fe0c2fbfe!2z0JHQkyDQntCZ0Js!5e0!3m2!1sbg!2sbg!4v1757458602843!5m2!1sbg!2sbg"
  width={600}
  height={450}
  style={{ border: 0 }}
  loading="lazy"
  referrerPolicy="no-referrer-when-downgrade"
  allowFullScreen
/>


          </div>
        </CardContent>
      </Card>
    </div>
  )
}
