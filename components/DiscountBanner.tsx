'use client'

import { useEffect, useState } from 'react'

interface DiscountBannerProps {
  className?: string
  fallback?: string
  wrapperClassName?: string
  renderWrapper?: boolean
}

// Stored messages may still carry emoji from older defaults — the site uses icons only
const stripEmoji = (text: string) =>
  text.replace(/[\p{Extended_Pictographic}\u{1F1E6}-\u{1F1FF}\u{FE0F}\u{200D}]/gu, '').replace(/\s{2,}/g, ' ').trim()

export default function DiscountBanner({ className, fallback, wrapperClassName, renderWrapper = false }: DiscountBannerProps) {
  const [message, setMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    fetch('/api/promo/discount-banner')
      .then(res => res.json())
      .then(data => {
        if (data.active && data.message) {
          setMessage(stripEmoji(data.message))
        } else {
          // Don't show fallback if banner is disabled
          setMessage(null)
        }
      })
      .catch(err => {
        console.error('Failed to fetch discount banner:', err)
        // Only show fallback on error, not when disabled
        setMessage(fallback || null)
      })
      .finally(() => {
        setIsLoading(false)
      })
  }, [fallback])

  // Don't render anything if loading or no message
  if (isLoading || !message) return null

  const content = <span className={className}>{message}</span>
  
  // If wrapper is requested, wrap the content
  if (renderWrapper && wrapperClassName) {
    return <div className={wrapperClassName}>{content}</div>
  }

  return content
}

