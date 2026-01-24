// lib/productsStore.ts
import 'server-only'
import { Redis } from '@upstash/redis'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  cardPrice: number // Цена с карта BG OIL
  stock: number
  category: string
  image: string
}

const PRODUCTS_KEY = 'products:v1'

// Default products - ще се използват само ако няма данни в Redis
const defaultProducts: Product[] = [
  {
    id: 1,
    name: 'Cooltech Антифриз G11 -30°C 5л',
    description: 'Висококачествен син антифриз G11 за защита до -30°C. Готов за употреба.',
    price: 9.15,
    cardPrice: 8.24,
    stock: 20,
    category: 'Антифриз',
    image: '/products/antifreeze-sheron-g11-5l.png',
  },
  {
    id: 2,
    name: 'Cooltech Антифриз Концентрат -60°C 1л',
    description: 'Висококачествен син антифриз концентрат за защита до -60°C. Компактен размер за доливане и разреждане.',
    price: 1.99,
    cardPrice: 1.79,
    stock: 50,
    category: 'Антифриз',
    image: '/products/antifreeze-sevan-1l.png',
  },
  {
    id: 3,
    name: 'Cooltech Antifreeze Long Life S12+ 5л',
    description: 'Премиум червен антифриз S12+ с алуминиева защита и дълготраен живот. Подходящ за VW/Audi, Ford, Volvo, Mercedes, Opel.',
    price: 10.69,
    cardPrice: 9.62,
    stock: 20,
    category: 'Антифриз',
    image: '/products/antifreeze-north-s12-5l.png',
  },
  {
    id: 4,
    name: 'Cooltech Longlife G12 -60°C 1кг',
    description: 'Премиум червен антифриз G12 с дълготрайна защита до -60°C. Високоефективна охлаждаща течност.',
    price: 3.02,
    cardPrice: 2.72,
    stock: 50,
    category: 'Антифриз',
    image: '/products/antifreeze-winterworld-g12-1kg.png',
  },
]

// ---- Redis клиент ----
let redisAuthFailed = false
let redisClient: Redis | null = null

function getRedis(): Redis | null {
  if (redisClient) return redisClient

  const url = process.env.UPSTASH_REDIS_KV_REST_API_URL
  const token = process.env.UPSTASH_REDIS_KV_REST_API_TOKEN

  console.log('productsStore: checking Redis config - URL:', url ? 'set' : 'missing', 'TOKEN:', token ? 'set' : 'missing')

  if (!url || !token) return null

  redisClient = new Redis({ url, token })
  console.log('productsStore: Redis client created successfully')
  return redisClient
}

// ---- безопасно четене от Redis ----
async function safeGetProducts(): Promise<Product[] | null> {
  const redis = getRedis()
  if (!redis || redisAuthFailed) {
    console.log('productsStore: Redis not available, using defaults')
    return null
  }

  try {
    const val = await redis.get(PRODUCTS_KEY) as unknown
    if (val == null) return null

    if (typeof val === 'string') {
      try {
        return JSON.parse(val) as Product[]
      } catch (e) {
        console.error('productsStore: parse failed (string)', e)
        return null
      }
    }
    if (Array.isArray(val)) {
      return val as Product[]
    }
    return null
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('productsStore: Redis authentication failed.')
        redisAuthFailed = true
      }
    } else {
      console.error('productsStore: redis.get failed:', error.message)
    }
    return null
  }
}

// ---- безопасен запис в Redis ----
async function safeSetProducts(products: Product[]): Promise<boolean> {
  const redis = getRedis()
  if (!redis || redisAuthFailed) {
    console.log('productsStore: Redis not available, cannot save')
    return false
  }

  try {
    await redis.set(PRODUCTS_KEY, products as any)
    console.log('productsStore: saved to Redis')
    return true
  } catch (e) {
    const error = e as Error
    const isAuthError = error.message.includes('WRONGPASS') ||
                       error.message.includes('invalid or missing auth token') ||
                       error.message.includes('unauthorized')

    if (isAuthError) {
      if (!redisAuthFailed) {
        console.warn('productsStore: Redis authentication failed.')
        redisAuthFailed = true
      }
    } else {
      console.error('productsStore: redis.set failed:', error.message)
    }
    return false
  }
}

// Get all products
export async function getProducts(): Promise<Product[]> {
  const products = await safeGetProducts()
  if (products !== null && products.length > 0) {
    return products
  }
  // Ако няма данни в Redis, записваме default-ите и ги връщаме
  await safeSetProducts(defaultProducts)
  return defaultProducts
}

// Save all products
export async function saveProducts(products: Product[]): Promise<void> {
  await safeSetProducts(products)
}

// Get a single product by ID
export async function getProductById(id: number): Promise<Product | null> {
  const products = await getProducts()
  return products.find((p) => p.id === id) || null
}

// Update a product
export async function updateProduct(id: number, updates: Partial<Product>): Promise<Product | null> {
  const products = await getProducts()
  const index = products.findIndex((p) => p.id === id)

  if (index === -1) {
    return null
  }

  products[index] = { ...products[index], ...updates, id } // Keep the same ID
  const saved = await safeSetProducts(products)
  if (!saved) {
    throw new Error('Failed to save to Redis')
  }
  return products[index]
}

// Add a new product
export async function addProduct(product: Omit<Product, 'id'>): Promise<Product> {
  const products = await getProducts()
  const newId = products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1
  const newProduct = { ...product, id: newId }
  products.push(newProduct)
  const saved = await safeSetProducts(products)
  if (!saved) {
    throw new Error('Failed to save to Redis')
  }
  return newProduct
}

// Delete a product
export async function deleteProduct(id: number): Promise<boolean> {
  const products = await getProducts()
  const filtered = products.filter((p) => p.id !== id)

  if (filtered.length === products.length) {
    return false // Product not found
  }

  const saved = await safeSetProducts(filtered)
  if (!saved) {
    throw new Error('Failed to save to Redis')
  }
  return true
}
