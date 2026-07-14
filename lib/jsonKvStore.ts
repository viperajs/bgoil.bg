// lib/jsonKvStore.ts — общ слой за съхранение: локален JSON файл в .data/
// (основен в dev) + опционален Upstash Redis (продукция). Използва се от
// roomsStore, bookingStore и hotelStore.
import 'server-only'
import { Redis } from '@upstash/redis'
import fs from 'fs/promises'
import path from 'path'

let redisClient: Redis | null | undefined
let redisAuthFailed = false

function getRedis(): Redis | null {
  if (redisClient !== undefined) return redisClient
  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN
  redisClient = url && token ? new Redis({ url, token }) : null
  return redisClient
}

function isRedisAuthError(e: unknown): boolean {
  const msg = e instanceof Error ? e.message : ''
  return msg.includes('WRONGPASS') || msg.includes('invalid or missing auth token') || msg.includes('unauthorized')
}

export interface JsonKvStore<T> {
  /** Локален файл → Redis → null. Хвърля при преходна Redis грешка,
   *  за да не се приеме „празно“ състояние и да се загубят данни. */
  read(): Promise<T | null>
  /** Записва в локалния файл и (ако е наличен) в Redis. */
  write(value: T): Promise<void>
  /** Сериализира read-modify-write мутации в рамките на процеса. */
  withLock<R>(fn: () => Promise<R>): Promise<R>
}

export function createJsonKvStore<T>(opts: { key: string; filename: string; label: string }): JsonKvStore<T> {
  const file = path.join(process.cwd(), '.data', opts.filename)
  let lock: Promise<unknown> = Promise.resolve()

  async function readLocal(): Promise<T | null> {
    try {
      const data = await fs.readFile(file, 'utf-8')
      return JSON.parse(data) as T
    } catch {
      return null
    }
  }

  async function writeLocal(value: T): Promise<void> {
    try {
      await fs.mkdir(path.dirname(file), { recursive: true })
      await fs.writeFile(file, JSON.stringify(value, null, 2), 'utf-8')
    } catch (e) {
      console.error(`${opts.label}: failed to write local file:`, e)
    }
  }

  async function read(): Promise<T | null> {
    const local = await readLocal()
    if (local !== null) return local

    const redis = getRedis()
    if (!redis || redisAuthFailed) return null

    try {
      const val = (await redis.get(opts.key)) as unknown
      const parsed = typeof val === 'string' ? JSON.parse(val) : val
      if (parsed == null) return null
      await writeLocal(parsed as T)
      return parsed as T
    } catch (e) {
      if (isRedisAuthError(e)) {
        redisAuthFailed = true
        console.warn(`${opts.label}: Redis authentication failed. Using local file storage.`)
        return null
      }
      // Преходна грешка (мрежа/таймаут): не връщаме null, защото следващ
      // запис би презаписал реалните данни с празно/дефолтно състояние.
      throw e
    }
  }

  async function write(value: T): Promise<void> {
    await writeLocal(value)

    const redis = getRedis()
    if (!redis || redisAuthFailed) return
    try {
      await redis.set(opts.key, value as any)
    } catch (e) {
      if (isRedisAuthError(e)) {
        redisAuthFailed = true
        console.warn(`${opts.label}: Redis authentication failed. Saved to local file only.`)
      } else {
        console.error(`${opts.label}: redis.set failed, saved to local file:`, e)
      }
    }
  }

  function withLock<R>(fn: () => Promise<R>): Promise<R> {
    const run = lock.then(fn, fn)
    lock = run.catch(() => {})
    return run
  }

  return { read, write, withLock }
}
