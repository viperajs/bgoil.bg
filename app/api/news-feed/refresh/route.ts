import { NextResponse } from 'next/server'
import RSSParser from 'rss-parser'
import { JSDOM } from 'jsdom'
import { Readability } from '@mozilla/readability'
import * as cheerio from 'cheerio'
import OpenAI from 'openai'
import { fetch } from 'undici'
import pLimit from 'p-limit'
import { getDb, hashId } from '@/lib/db'
import { isFuelRelevant, STRONG_FUEL } from '@/lib/newsFeedRelevance'
import { localSummaryFrom, extractKeyFacts } from '@/lib/newsFeedLocalSummary'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

const SOURCES = (process.env.NEWS_FEED_SOURCES || '')
  .split(',')
  .map(s => s.trim())
  .filter(Boolean)

// RSS парсер с по-добър User-Agent за избегване на 401 грешки
const parser = new RSSParser({ 
  timeout: 15000,
  customFields: {
    item: ['content:encoded', 'media:content']
  },
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  }
})

// NO_AI режим - без OpenAI заявки
const NO_AI = (process.env.NO_AI || '').toLowerCase() === 'true'

// Rate limiting за AI заявки - максимум 2 едновременно
const limit = pLimit(2)

// OpenAI клиент - с trim и проверка за празен ключ (не инициализираме ако NO_AI=true)
const apiKey = NO_AI ? '' : (process.env.OPENAI_API_KEY || '').trim()
const openai = (!NO_AI && apiKey) ? new OpenAI({ apiKey }) : null

// AI проверка дали статията е релевантна за горива
async function isFuelRelevantAI(title: string, text: string): Promise<boolean> {
  if (NO_AI || !openai || !apiKey) {
    // Ако NO_AI режим или няма AI ключ, използваме само keyword филтъра
    return true
  }

  const prompt = `Провери дали следната статия е релевантна ЗА ГОРИВА (бензин, дизел, LPG, петрол, акцизи, бензиностанции, цени на горива).

Статията ТРЯБВА да говори за:
- Бензин, дизел, LPG, пропан-бутан
- Суров петрол, нефт, рафинерии
- Цени на горива, акцизи, котировки
- Бензиностанции, горивни компании (Лукойл и др.)
- Доставки, складове, резерви на горива

Статията НЕ ТРЯБВА да е за:
- Вода, ВиК, канализация
- Електроенергия, ток, соларни панели, вятърни турбини
- Политика, избори, заплати
- Здравеопазване, инфлация (освен ако не е специфично за горива)
- Екология/климат (освен ако не е за горива)

Заглавие: ${title}
Текст: ${text.slice(0, 2000)}

Отговори САМО с "ДА" или "НЕ" (без допълнителен текст).`

  try {
    const resp = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      temperature: 0.1,
      max_tokens: 10,
      messages: [{ role: 'user', content: prompt }]
    })
    
    const answer = (resp.choices[0]?.message?.content || '').trim().toUpperCase()
    return answer.includes('ДА') || answer === 'YES'
  } catch (e: any) {
    console.error('AI relevance check failed:', e?.message || String(e))
    // При грешка приемаме статията (fallback към keyword филтъра)
    return true
  }
}

// Извличане на текст с Readability, lead image и author от статия
async function fetchArticleBody(url: string): Promise<{
  text: string
  leadImage?: string
  author?: string
}> {
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), 15000)
    
    const res = await fetch(url, {
      headers: { 'User-Agent': 'FuelNewsBot/1.0' },
      signal: controller.signal
    })
    
    clearTimeout(timeoutId)
    const html = await res.text()
    
    // Използваме Readability за по-добра екстракция
    // Игнорираме CSS parsing грешки от JSDOM
    const originalConsoleError = console.error
    console.error = (...args: any[]) => {
      const msg = args[0]?.toString() || ''
      if (!msg.includes('Could not parse CSS stylesheet') && !msg.includes('CSS')) {
        originalConsoleError(...args)
      }
    }
    
    const dom = new JSDOM(html, { 
      url,
      pretendToBeVisual: true,
      resources: 'usable'
    })
    const reader = new Readability(dom.window.document)
    const article = reader.parse()
    
    // Възстановяване на console.error
    console.error = originalConsoleError
    
    let text = ''
    if (article?.textContent) {
      text = article.textContent.replace(/\s+/g, ' ').trim().slice(0, 15000)
    }
    
    // Fallback към cheerio ако Readability не работи
    if (!text) {
      const $ = cheerio.load(html)
      const articleEl = $('article').length ? $('article') : $('body')
      const paragraphs = articleEl.find('p').map((_, p) => $(p).text().trim()).get().join(' ')
      text = paragraphs.replace(/\s+/g, ' ').trim().slice(0, 15000)
    }
    
    // Извличане на lead image (og:image или първа голяма снимка)
    const $ = cheerio.load(html)
    let leadImage: string | undefined
    const ogImage = $('meta[property="og:image"]').attr('content')
    if (ogImage) {
      leadImage = ogImage
    } else {
      const firstImage = $('article img, .content img, main img').first().attr('src')
      if (firstImage && !firstImage.startsWith('data:')) {
        leadImage = firstImage
      }
    }
    
    // Извличане на author
    let author: string | undefined
    const metaAuthor = $('meta[name="author"]').attr('content')
    if (metaAuthor) {
      author = metaAuthor
    } else {
      const relAuthor = $('[rel="author"]').first().text().trim()
      if (relAuthor) {
        author = relAuthor
      } else {
        const classAuthor = $('.author, [class*="author"]').first().text().trim()
        if (classAuthor) {
          author = classAuthor
        }
      }
    }
    
    return { text, leadImage, author }
  } catch (e) {
    console.error(`Failed to fetch article body from ${url}:`, e)
    return { text: '' }
  }
}

// Структурирано резюме на български (JSON)
interface StructuredSummary {
  summary: string
  key_facts: string[]
  entities: string[]
  topic: string
  context: string
}

async function summarizeBGtoJSON(text: string): Promise<StructuredSummary | null> {
  if (NO_AI || !openai || !apiKey) {
    // В NO_AI режим не правим AI заявки
    return null
  }
  
  const prompt = `
Резюмирай на български като JSON със следните полета:
{
  "summary": "3-4 изречения, неутрални, с числа и дати",
  "key_facts": ["кратки точки с числа/проценти/дати"],
  "entities": ["компании/институции/гео"],
  "topic": "една от: Цени | Регулации | Индустрия | Екология | Качество | Оферти | Безопасност",
  "context": "1 изречение контекст (само ако е нужен), иначе празно"
}

Текст:
---
${text.slice(0, 9000)}
`
  
  let attempt = 0
  const maxAttempts = 4
  
  while (attempt < maxAttempts) {
    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [{ role: 'user', content: prompt }]
      })
      
      const raw = resp.choices[0]?.message?.content?.trim() || ''
      try {
        // Позволи и Markdown code fence
        const json = raw.replace(/^```json|```$/g, '').trim()
        return JSON.parse(json)
      } catch {
        // Fallback: само summary текст
        return {
          summary: raw,
          key_facts: [],
          entities: [],
          topic: 'Индустрия',
          context: ''
        }
      }
    } catch (e: any) {
      const msg = e?.message || String(e)
      
      // Retry при 429 (rate limit) с exponential backoff
      if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
        const waitMs = 1000 * Math.pow(2, attempt) // 1s, 2s, 4s, 8s
        console.warn(`OpenAI rate limit (429), retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, waitMs))
        attempt++
        continue
      }
      
      // Други грешки - не retry
      console.error('OpenAI API error:', msg)
      return null
    }
  }
  
  return null
}

// Стара функция за обратна съвместимост (fallback) с retry логика
async function summarizeBG(text: string): Promise<string> {
  if (NO_AI || !openai || !apiKey) {
    // В NO_AI режим не правим AI заявки
    return ''
  }
  
  let attempt = 0
  const maxAttempts = 4
  
  while (attempt < maxAttempts) {
    try {
      const resp = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        temperature: 0.2,
        messages: [{
          role: 'user',
          content: `Резюмирай на български в 3–4 изречения:\n\n${text.slice(0, 9000)}`
        }]
      })
      
      return (resp.choices[0]?.message?.content || '').trim()
    } catch (e: any) {
      const msg = e?.message || String(e)
      
      // Retry при 429 (rate limit) с exponential backoff
      if (msg.includes('429') || msg.includes('quota') || msg.includes('rate limit')) {
        const waitMs = 1000 * Math.pow(2, attempt) // 1s, 2s, 4s, 8s
        console.warn(`OpenAI rate limit (429), retrying in ${waitMs}ms (attempt ${attempt + 1}/${maxAttempts})`)
        await new Promise(resolve => setTimeout(resolve, waitMs))
        attempt++
        continue
      }
      
      // Други грешки - не retry
      console.error('OpenAI summarize error:', msg)
      return ''
    }
  }
  
  return ''
}

// Изчисляване на време за четене (приблизително)
function calculateReadingTime(text: string): number {
  const wordsPerMinute = 200
  const wordCount = text.split(/\s+/).length
  return Math.max(1, Math.ceil(wordCount / wordsPerMinute))
}

// Upsert статия в базата
function upsertArticle(a: {
  id: string
  url: string
  title: string
  source: string
  published_at: string
  lang: string
  summary_bg: string
  topics: string
  status?: string
  key_facts?: string
  entities?: string
  topic?: string
  lead_image?: string
  author?: string
  reading_time?: number
}) {
  const db = getDb()
  const stmt = db.prepare(`
    INSERT INTO articles (
      id, url, title, source, published_at, lang, summary_bg, topics, status,
      key_facts, entities, topic, lead_image, author, reading_time
    )
    VALUES (
      @id, @url, @title, @source, @published_at, @lang, @summary_bg, @topics, @status,
      @key_facts, @entities, @topic, @lead_image, @author, @reading_time
    )
    ON CONFLICT(url) DO UPDATE SET
      title = excluded.title,
      source = excluded.source,
      published_at = excluded.published_at,
      lang = excluded.lang,
      summary_bg = COALESCE(NULLIF(excluded.summary_bg, ''), articles.summary_bg),
      topics = excluded.topics,
      status = excluded.status,
      key_facts = COALESCE(excluded.key_facts, articles.key_facts),
      entities = COALESCE(excluded.entities, articles.entities),
      topic = COALESCE(excluded.topic, articles.topic, 'fuels'),
      lead_image = COALESCE(excluded.lead_image, articles.lead_image),
      author = COALESCE(excluded.author, articles.author),
      reading_time = COALESCE(excluded.reading_time, articles.reading_time)
  `)
  stmt.run({ 
    ...a, 
    status: a.status || 'PUBLISHED',
    key_facts: a.key_facts || null,
    entities: a.entities || null,
    topic: a.topic || null,
    lead_image: a.lead_image || null,
    author: a.author || null,
    reading_time: a.reading_time || null
  })
}

/**
 * GET /api/news-feed/refresh
 * 
 * Ръчно стартиране на пайплайн за събиране и резюмиране на новини.
 * Синхронно изпълнение: извлича → филтрира → резюмира → публикува.
 * В NO_AI режим използва локално резюме вместо AI.
 */
export async function GET() {
  const started = Date.now()
  
  if (!SOURCES.length) {
    return NextResponse.json(
      { ok: false, error: 'NEWS_FEED_SOURCES е празен' },
      { status: 400 }
    )
  }
  
  const report = {
    scanned: 0,
    relevant: 0,
    aiFiltered: 0, // Брой статии отхвърлени от AI
    inserted: 0,
    summarized: 0,
    errors: 0,
    sources: SOURCES.length,
    fails: [] as string[]
  }
  
  try {
    for (const feedUrl of SOURCES) {
      let feed
      try {
        feed = await parser.parseURL(feedUrl)
      } catch (e: any) {
        const errorMsg = `${feedUrl} :: ${e?.message || String(e)}`
        console.error(`Failed to parse RSS feed ${feedUrl}:`, e)
        report.errors++
        report.fails.push(errorMsg)
        continue
      }
      
      for (const e of feed.items || []) {
        report.scanned++
        
        const title = (e.title || '').trim()
        const link = (e.link || '').trim()
        const desc = (e.contentSnippet || e.content || e.summary || '').trim()
        
        if (!title || !link) continue
        
        // Първа проверка: keyword филтър (бързо)
        if (!isFuelRelevant(title, desc, link)) continue
        
        report.relevant++
        
        const id = hashId(link)
        const published = e.isoDate || e.pubDate || new Date().toISOString()
        const source = (feed.title || new URL(link).hostname).trim()
        
        // Проверка дали статията вече съществува
        const db = getDb()
        const exists = db.prepare('SELECT summary_bg, key_facts, entities, topic FROM articles WHERE url = ?').get(link) as any
        let summary = exists?.summary_bg || ''
        let keyFacts = exists?.key_facts || null
        let entities = exists?.entities || null
        // Topic винаги е 'fuels' за приетите статии
        const topic = 'fuels'
        let leadImage: string | undefined
        let author: string | undefined
        let readingTime: number | undefined
        
        // Ако няма резюме, опитваме се да го генерираме
        if (!summary) {
          const articleData = await fetchArticleBody(link)
          leadImage = articleData.leadImage
          author = articleData.author
          
          if (articleData.text) {
            readingTime = calculateReadingTime(articleData.text)
            
            // 🔹 ВТОРА ПРОВЕРКА: AI филтриране (само ако не е NO_AI режим)
            if (!NO_AI) {
              const aiRelevant = await limit(() => isFuelRelevantAI(title, articleData.text))
              if (!aiRelevant) {
                console.log(`AI filtered out: ${title}`)
                report.aiFiltered++
                continue // Пропускаме статията ако AI каже че не е релевантна
              }
            }
            
            // Генериране на резюме
            if (!NO_AI && apiKey) {
              // Ако има AI ключ и не е NO_AI режим, опитваме се с AI
              const structured = await limit(() => summarizeBGtoJSON(articleData.text))
              if (structured && structured.summary) {
                summary = structured.summary
                keyFacts = JSON.stringify(structured.key_facts)
                entities = JSON.stringify(structured.entities)
                report.summarized++
              } else {
                // Fallback към просто AI резюме
                const simpleSummary = await limit(() => summarizeBG(articleData.text))
                if (simpleSummary) {
                  summary = simpleSummary
                  report.summarized++
                }
              }
            }
            
            // Локално резюме (fallback или ако NO_AI режим)
            if (!summary) {
              const baseText = articleData.text.slice(0, 2000) || desc
              summary = localSummaryFrom(baseText, desc)
              
              // Извличане на ключови факти локално
              const facts = extractKeyFacts(articleData.text || desc)
              if (facts.length > 0) {
                keyFacts = JSON.stringify(facts)
              }
            }
          } else {
            // Ако няма текст от статията, използваме локално резюме от RSS описание
            if (!summary && desc) {
              summary = localSummaryFrom(desc, '')
            }
          }
          
          // Финален fallback: ако все още няма резюме
          if (!summary && desc) {
            summary = desc.trim().slice(0, 600)
          }
        }
        
        upsertArticle({
          id,
          url: link,
          title,
          source,
          published_at: new Date(published).toISOString(),
          lang: 'bg',
          summary_bg: summary || '',
          topics: STRONG_FUEL.join(','),
          key_facts: keyFacts,
          entities: entities,
          topic: topic,
          lead_image: leadImage,
          author: author,
          reading_time: readingTime
        })
        
        report.inserted++
      }
    }
  } catch (err: any) {
    const errorMsg = `Refresh failed: ${err?.message || String(err)}`
    console.error('Refresh failed:', err)
    report.errors++
    report.fails.push(errorMsg)
  }
  
  const tookMs = Date.now() - started
  
  return NextResponse.json({
    ok: true,
    ...report,
    took_ms: tookMs
  }, {
    headers: {
      'Cache-Control': 'no-store, no-cache, must-revalidate',
    },
  })
}

/**
 * POST /api/news-feed/refresh
 * 
 * Същото като GET, но позволява опционална автентикация.
 */
export async function POST(request: Request) {
  // Опционална автентикация
  const authHeader = request.headers.get('authorization')
  const expectedToken = process.env.NEWS_FEED_INGEST_TOKEN
  
  if (expectedToken && authHeader !== `Bearer ${expectedToken}`) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401 }
    )
  }
  
  return GET()
}
