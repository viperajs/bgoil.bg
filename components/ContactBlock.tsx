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
    <div className="space-y-8">
      <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 hover-lift">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient-primary">Контактна информация</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-5">
              <div className="flex items-start space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-6 h-6 text-primary" />
                </div>
                <div className="flex-1">
                  <p className="text-sm font-bold text-card-foreground mb-1">Адрес:</p>
                  <p className="text-sm text-muted-foreground mb-2">{contacts.address}</p>
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    onClick={copyAddress} 
                    className="h-auto p-2 text-xs hover:bg-primary/10"
                  >
                    {copied ? (
                      <>
                        <Check className="w-3 h-3 mr-1 text-green-600" />
                        Копирано!
                      </>
                    ) : (
                      <>
                        <Copy className="w-3 h-3 mr-1" />
                        Копирай адрес
                      </>
                    )}
                  </Button>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground mb-1">Информация на бензиностанция:</p>
                  <a href={`tel:${contacts.phoneMain}`} className="text-lg font-bold text-primary hover:underline transition-colors">
                    {contacts.phoneMain}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <Phone className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground mb-1">Хотел резервации:</p>
                  <a href={`tel:${contacts.hotelPhone}`} className="text-lg font-bold text-primary hover:underline transition-colors">
                    {contacts.hotelPhone}
                  </a>
                </div>
              </div>

              <div className="flex items-center space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <Mail className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground mb-1">Имейл:</p>
                  <a href={`mailto:${contacts.email}`} className="text-lg font-bold text-primary hover:underline transition-colors">
                    {contacts.email}
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors duration-300">
                <div className="w-12 h-12 rounded-lg bg-gradient-primary/10 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="w-6 h-6 text-primary" />
                </div>
                <div>
                  <p className="text-sm font-bold text-card-foreground mb-1">EasyPay услуги:</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    На място разполагаме с EasyPay 24/7 каса за плащане на сметки и услуги.
                  </p>
                </div>
              </div>
            </div>

            <div className="flex flex-col space-y-4">
              <Button 
                asChild
                className="bg-gradient-primary text-white border-0 hover-lift shadow-lg h-14 text-base"
              >
                <a
                  href={contacts.mapsLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center space-x-3"
                >
                  <Navigation className="w-5 h-5" />
                  <span>Навигирай с Google Maps</span>
                </a>
              </Button>

              <Button 
                variant="outline" 
                asChild
                className="border-2 hover:border-primary hover-lift h-14 text-base"
              >
                
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Google Maps Embed */}
      <Card className="border-2 border-border hover:border-primary/50 transition-all duration-300 overflow-hidden">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-gradient-primary">Местоположение</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <div className="aspect-video w-full rounded-b-2xl overflow-hidden shadow-inner">
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
        </CardContent>
      </Card>
    </div>
  )
}