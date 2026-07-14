import { NextResponse } from 'next/server'
import { saveProducts, Product } from '@/lib/productsStore'
import { requireAdmin } from '@/lib/auth'

// Продуктите от локалния файл
const productsToSeed: Product[] = [
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

// POST - Seed products to Redis
export async function POST(req: Request) {
  if (!await requireAdmin(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    await saveProducts(productsToSeed)
    return NextResponse.json({
      ok: true,
      message: `Successfully seeded ${productsToSeed.length} products to Redis`,
      products: productsToSeed
    })
  } catch (error) {
    console.error('POST /api/admin/products/seed failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Seed failed'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 500 }
    )
  }
}
