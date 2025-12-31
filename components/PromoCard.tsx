'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import Link from 'next/link'
import { Sparkles } from 'lucide-react'

interface PromoConfig {
  enabled: boolean
  kind: 'promo' | 'news'
  title?: string
  message: string
  ctaText?: string
  ctaUrl?: string
  startAt?: string | null
  endAt?: string | null
}

export default function PromoCard() {
  const [promo, setPromo] = useState<PromoConfig | null>(null)
  const [active, setActive] = useState(false)

  useEffect(() => {
    fetchPromo()
    // Refresh every 60 seconds
    const interval = setInterval(fetchPromo, 60000)
    return () => clearInterval(interval)
  }, [])

  async function fetchPromo() {
    try {
      const res = await fetch('/api/promo', { cache: 'no-store' })
      if (!res.ok) return
      const data = await res.json()
      if (data.active && data.config) {
        setPromo(data.config)
        setActive(true)
      } else {
        setActive(false)
      }
    } catch (error) {
      console.error('Failed to fetch promo:', error)
    }
  }

  if (!active || !promo) return null

  const isPromo = promo.kind === 'promo'
  const borderColor = isPromo ? 'border-primary/50' : 'border-blue-500/50'
  const bgColor = isPromo ? 'bg-primary/5' : 'bg-blue-500/5'
  const textColor = isPromo ? 'text-primary' : 'text-blue-600'

  return (
    <Card className={`border-2 ${borderColor} ${bgColor} hover-lift transition-all duration-300`}>
      <CardContent className="p-6">
        <div className="flex items-start gap-3">
          <div className={`p-2 rounded-lg ${isPromo ? 'bg-primary/10' : 'bg-blue-500/10'}`}>
            <Sparkles className={`w-5 h-5 ${textColor}`} />
          </div>
          <div className="flex-1">
            {promo.title && (
              <h3 className={`font-bold text-lg mb-2 ${textColor}`}>
                {promo.title}
              </h3>
            )}
            <p className="text-sm md:text-base text-foreground mb-4">
              {promo.message}
            </p>
            {promo.ctaText && promo.ctaUrl && (
              <Button
                size="sm"
                variant="outline"
                asChild
                className={`${textColor} border-current hover:bg-current hover:text-white`}
              >
                <Link href={promo.ctaUrl}>
                  {promo.ctaText}
                </Link>
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}














