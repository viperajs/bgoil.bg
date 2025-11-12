import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const maxDuration = 300 // 5 минути за cron job

/**
 * GET /api/news-feed/cron
 * 
 * Cron endpoint за автоматично обновяване на новините на всеки 24 часа.
 * Трябва да се извиква от Vercel Cron Jobs или външен cron service.
 * 
 * За Vercel Cron Jobs, добави в vercel.json:
 * {
 *   "crons": [{
 *     "path": "/api/news-feed/cron",
 *     "schedule": "0 0 * * *"
 *   }]
 * }
 * 
 * Или използвай външен cron service като cron-job.org или EasyCron:
 * https://your-domain.com/api/news-feed/cron?key=YOUR_CRON_SECRET
 */
export async function GET(request: Request) {
  // Проверка за автентикация (опционално - може да се използва secret key)
  const authHeader = request.headers.get('authorization')
  const cronSecret = process.env.CRON_SECRET
  const url = new URL(request.url)
  const keyParam = url.searchParams.get('key')
  
  // Ако има CRON_SECRET, изискваме автентикация
  if (cronSecret) {
    const isValid = 
      (authHeader === `Bearer ${cronSecret}`) ||
      (keyParam === cronSecret)
    
    if (!isValid) {
      return NextResponse.json(
        { ok: false, error: 'Unauthorized' },
        { status: 401 }
      )
    }
  }
  
  try {
    console.log('[CRON] Starting automatic news feed refresh...')
    const started = Date.now()
    
    // Извикваме refresh endpoint вътрешно
    const baseUrl = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'
    const refreshUrl = `${baseUrl}/api/news-feed/refresh`
    
    const response = await fetch(refreshUrl, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      cache: 'no-store',
    })
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}))
      throw new Error(errorData.error || `HTTP ${response.status}: Failed to refresh`)
    }
    
    const result = await response.json()
    const tookMs = Date.now() - started
    
    console.log('[CRON] Refresh completed:', {
      scanned: result.scanned,
      relevant: result.relevant,
      inserted: result.inserted,
      summarized: result.summarized,
      errors: result.errors,
      took_ms: tookMs
    })
    
    return NextResponse.json({
      ...result,
      triggered_by: 'cron',
      cron_timestamp: new Date().toISOString()
    })
  } catch (error: any) {
    console.error('[CRON] Refresh failed:', error)
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || 'Cron job failed',
        triggered_by: 'cron',
        cron_timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}

