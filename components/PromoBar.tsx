'use client'

import { useEffect, useState } from 'react'
import { Button } from '@/components/ui/button'
import { X } from 'lucide-react'
import Link from 'next/link'

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

export default function PromoBar() {
  const [promo, setPromo] = useState<PromoConfig | null>(null)
  const [active, setActive] = useState(false)
  const [dismissed, setDismissed] = useState(false)

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

  if (!active || !promo || dismissed) return null

  const isPromo = promo.kind === 'promo'
  const bgGradient = isPromo 
    ? 'bg-gradient-to-r from-primary/20 via-primary/15 to-primary/20' 
    : 'bg-gradient-to-r from-blue-500/20 via-blue-500/15 to-blue-500/20'
  const borderColor = isPromo ? 'border-primary/30' : 'border-blue-500/30'
  const textColor = isPromo ? 'text-primary' : 'text-blue-600'

  return (
    <div className={`relative w-full ${bgGradient} border-b-2 ${borderColor} py-3 px-4 z-40`}>
      <div className="container mx-auto flex items-center justify-between gap-4">
        <div className="flex-1 flex items-center gap-4">
          {promo.title && (
            <h3 className={`font-bold text-sm md:text-base ${textColor} hidden sm:block`}>
              {promo.title}:
            </h3>
          )}
          <p className="text-sm md:text-base font-medium text-foreground flex-1">
            {promo.message}
          </p>
        </div>
        <div className="flex items-center gap-2">
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
          <button
            onClick={() => setDismissed(true)}
            className="p-1 hover:bg-black/10 rounded transition-colors"
            aria-label="Затвори"
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  )
}













