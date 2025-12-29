"use client"

import { contacts } from "@/lib/config"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Phone, Mail, MapPin, Navigation, Copy, Check, CreditCard } from "lucide-react"
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
      {/* Google Maps Embed - Compact */}
      <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <CardHeader className="pb-3">
          <CardTitle className="flex items-center gap-2 text-lg">
            <MapPin className="w-5 h-5 text-primary" />
            <span>Местоположение</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video w-full rounded-lg overflow-hidden shadow-inner">
            <iframe
              title="BG OIL – Враца на картата"
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3457.6139271941474!2d23.55826272337812!3d43.22007707884682!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x40ab18f88feff55d%3A0xd70eca3fe0c2fbfe!2z0JHQkyDQntCZ0Js!5e0!3m2!1sbg!2sbg!4v1757458602843!5m2!1sbg!2sbg"
              className="w-full h-full"
              style={{ border: 0 }}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              allowFullScreen
            />
          </div>
          <div className="p-4 space-y-3">
            <div className="flex items-start gap-3">
              <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-semibold text-card-foreground mb-1">Адрес:</p>
                <p className="text-sm text-muted-foreground mb-2">{contacts.address}</p>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={copyAddress} 
                  className="h-7 px-2 text-xs hover:bg-primary/10"
                >
                  {copied ? (
                    <>
                      <Check className="w-3 h-3 mr-1.5 text-green-600" />
                      Копирано!
                    </>
                  ) : (
                    <>
                      <Copy className="w-3 h-3 mr-1.5" />
                      Копирай адрес
                    </>
                  )}
                </Button>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              <Button 
                asChild
                className="bg-gradient-primary text-white border-0 hover-lift shadow-lg h-11 text-sm"
              >
                <a
                  href={contacts.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2"
                >
                  <Navigation className="w-4 h-4" />
                  <span>Google Maps</span>
                </a>
              </Button>

              <Button 
                variant="outline" 
                asChild
                className="border-2 hover:border-primary hover-lift h-11 text-sm"
              >
                <a
                  href={`tel:${contacts.phoneMain}`}
                  className="flex items-center justify-center gap-2 text-card-foreground"
                >
                  <Phone className="w-4 h-4 text-primary" />
                  <span>Обади се</span>
                </a>
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Additional Info - Compact */}
      <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-bold text-gradient-primary">Допълнителна информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-start gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <CreditCard className="w-4 h-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-semibold text-card-foreground mb-1">EasyPay услуги</p>
              <p className="text-xs text-muted-foreground leading-relaxed">
                На място разполагаме с EasyPay 24/7 каса за плащане на сметки и услуги.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1">
              <p className="text-xs font-semibold text-card-foreground mb-1">Автосервиз</p>
              <a href={`tel:${contacts.servicePhone}`} className="text-sm font-bold text-primary hover:underline transition-colors">
                {contacts.servicePhone}
              </a>
            </div>
          </div>

          <div className="flex items-center gap-3 p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors">
            <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
              <Mail className="w-4 h-4 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-card-foreground mb-1">Автосервиз имейл</p>
              <a href={`mailto:${contacts.serviceEmail}`} className="text-xs font-medium text-primary hover:underline transition-colors break-all">
                {contacts.serviceEmail}
              </a>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}