// app/api/kv-test/route.ts
import { NextResponse } from 'next/server'
import { Redis } from '@upstash/redis'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const url   = process.env.UPSTASH_REDIS_KV_REST_API_URL
const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN

export async function GET() {
  try {
    if (!url || !token) {
      return NextResponse.json({ ok: false, reason: 'missing env', hasUrl: !!url, hasToken: !!token }, { status: 500 })
    }
    const redis = new Redis({ url, token })
    await redis.set('kv-test-key', 'ok')
    const v = await redis.get<string>('kv-test-key')
    return NextResponse.json({ ok: true, value: v })
  } catch (e: any) {
    return NextResponse.json({ ok: false, error: e?.message ?? String(e) }, { status: 500 })
  }
}
