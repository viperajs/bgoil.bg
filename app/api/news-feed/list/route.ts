import { NextResponse } from 'next/server'
import { getDb } from '@/lib/db'

export const dynamic = 'force-dynamic'
export const revalidate = 60

/**
 * GET /api/news-feed/list
 * 
 * Връща JSON списък със статии за UI-то.
 * Поддържа филтри: limit, q (търсене), from, to (дати).
 */
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url)
    
    const limit = Math.min(Number(searchParams.get('limit') || 10), 10)
    const q = String(searchParams.get('q') || '').trim()
    const from = String(searchParams.get('from') || '')
    const to = String(searchParams.get('to') || '')
    const topic = String(searchParams.get('topic') || 'fuels').trim() // По подразбиране само горива
    
    const db = getDb()
    
    let sql = `
      SELECT 
        id, url, title, source, published_at, summary_bg as summary, topics,
        key_facts, entities, topic, lead_image, author, reading_time
      FROM articles
      WHERE status = 'PUBLISHED'
    `
    const params: any[] = []
    
    // Филтър по topic (по подразбиране 'fuels')
    if (topic) {
      sql += ` AND topic = ?`
      params.push(topic)
    }
    
    if (q) {
      sql += ` AND (LOWER(title) LIKE ? OR LOWER(summary_bg) LIKE ?)`
      params.push(`%${q.toLowerCase()}%`, `%${q.toLowerCase()}%`)
    }
    
    if (from) {
      sql += ` AND published_at >= ?`
      params.push(from)
    }
    
    if (to) {
      sql += ` AND published_at <= ?`
      params.push(to)
    }
    
    sql += ` ORDER BY published_at DESC LIMIT ?`
    params.push(limit)
    
    const rows = db.prepare(sql).all(...params) as Array<{
      id: string
      url: string
      title: string
      source: string
      published_at: string
      summary: string
      topics: string
      key_facts: string | null
      entities: string | null
      topic: string | null
      lead_image: string | null
      author: string | null
      reading_time: number | null
    }>
    
    // Парсиране на JSON полетата
    const formattedRows = rows.map(row => ({
      id: row.id,
      url: row.url,
      title: row.title,
      source: row.source,
      published_at: row.published_at,
      summary: row.summary,
      topics: row.topics ? row.topics.split(',').filter(Boolean) : [],
      key_facts: row.key_facts ? JSON.parse(row.key_facts) : [],
      entities: row.entities ? JSON.parse(row.entities) : [],
      topic: row.topic,
      lead_image: row.lead_image,
      author: row.author,
      reading_time: row.reading_time
    }))
    
    return NextResponse.json(formattedRows, {
      headers: {
        'Cache-Control': 'public, s-maxage=60, stale-while-revalidate=120',
      },
    })
  } catch (error) {
    console.error('GET /api/news-feed/list failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch news' },
      { status: 500 }
    )
  }
}

