import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'
import dayjs from 'dayjs'

export const dynamic = 'force-dynamic'
export const revalidate = 60

/**
 * Проверка за достъп до RSS (secret key или Basic Auth)
 */
function requireRssAccess(request: Request): boolean {
  const { searchParams } = new URL(request.url)
  const secret = process.env.RSS_SECRET
  const keyOk = secret && searchParams.get('key') === secret
  
  const authHeader = request.headers.get('authorization') || ''
  const [type, blob] = authHeader.split(' ')
  const creds = blob ? Buffer.from(blob, 'base64').toString('utf8') : ''
  const [u, p] = creds.split(':')
  const basicOk = type === 'Basic' && 
    u === process.env.ADMIN_USER && 
    p === process.env.ADMIN_PASS
  
  return keyOk || basicOk
}

/**
 * GET /api/news-feed/rss
 * 
 * Генерира валиден RSS feed с <item> елементи.
 * Защитен с secret key или Basic Auth.
 */
export async function GET(request: Request) {
  try {
    // Проверка за достъп
    if (!requireRssAccess(request)) {
      // Връщаме 404 вместо 401 за да "скрием" ресурса
      return new NextResponse('Not found', { status: 404 })
    }
    
    const db = getDb()
    
    const items = db.prepare(`
      SELECT title, url, source, published_at, summary_bg
      FROM articles
      WHERE status = 'PUBLISHED' AND topic = 'fuels'
      ORDER BY published_at DESC
      LIMIT 30
    `).all() as Array<{
      title: string
      url: string
      source: string
      published_at: string
      summary_bg: string
    }>
    
    const BASE_URL = process.env.BASE_URL || process.env.NEXT_PUBLIC_BASE_URL || 'https://bgoil.bg'
    const now = new Date().toUTCString()
    
    // Форматиране на дата за RSS (RFC 822)
    function toRssDate(iso: string): string {
      const d = dayjs(iso || new Date().toISOString())
      return d.toDate().toUTCString()
    }
    
    // Ескейпиране на XML
    const esc = (s: string) =>
      s?.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;') || ''
    
    const header = `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:content="http://purl.org/rss/1.0/modules/content/">
  <channel>
    <title>Новини за горива — BG OIL ВРАЦА</title>
    <link>${BASE_URL}/news-feed</link>
    <description>Актуални новини за горива, бензин, дизел, LPG и суров петрол. Резюмета на български.</description>
    <language>bg</language>
    <lastBuildDate>${now}</lastBuildDate>
    <pubDate>${now}</pubDate>
    <ttl>60</ttl>
`
    
    const body = items.map(it => {
      const pub = toRssDate(it.published_at)
      // Използваме summary_bg, ако няма - използваме заглавието като fallback
      const description = it.summary_bg?.trim() || it.title || 'Статия за горива и енергийни пазари.'
      return `    <item>
      <title>${esc(it.title)}</title>
      <link>${esc(it.url)}</link>
      <guid>${esc(it.url)}</guid>
      <pubDate>${pub}</pubDate>
      <description>${esc(description)}</description>
      <source>${esc(it.source)}</source>
    </item>`
    }).join('\n')
    
    const footer = `
  ${items.length ? '' : '    <!-- Няма публикувани статии. Използвайте /api/news-feed/refresh за ръчно обновяване. -->'}
  </channel>
</rss>`
    
    return new NextResponse(header + body + footer, {
      headers: {
        'Content-Type': 'application/rss+xml; charset=UTF-8',
        'X-Robots-Tag': 'noindex, nofollow',
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('GET /api/news-feed/rss failed:', error)
    return new NextResponse('Not found', { status: 404 })
  }
}
