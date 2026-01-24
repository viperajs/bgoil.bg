import { NextResponse } from 'next/server'
import { getProducts, updateProduct, addProduct, deleteProduct } from '@/lib/productsStore'

/**
 * Check for admin authentication
 */
function requireAdminAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  console.log('Auth check - cookies:', cookieHeader)
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const adminSessionCookie = cookies.find(c => c.startsWith('admin_session='))
  console.log('Auth check - admin_session cookie:', adminSessionCookie)
  if (adminSessionCookie && adminSessionCookie.includes('authenticated')) {
    console.log('Auth check - authenticated via cookie')
    return true
  }

  const authHeader = request.headers.get('authorization') || ''
  if (!authHeader) {
    console.log('Auth check - no auth header, returning false')
    return false
  }

  const [type, blob] = authHeader.split(' ')
  if (type !== 'Basic' || !blob) return false

  try {
    const creds = Buffer.from(blob, 'base64').toString('utf8')
    const [u, p] = creds.split(':')
    const basicOk = u === process.env.ADMIN_USER && p === process.env.ADMIN_PASS
    return basicOk
  } catch {
    return false
  }
}

// GET - Get all products
export async function GET() {
  try {
    const products = await getProducts()
    return NextResponse.json({ ok: true, products })
  } catch (error) {
    console.error('GET /api/admin/products failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Failed to fetch products' },
      { status: 500 }
    )
  }
}

// POST - Add a new product
export async function POST(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    console.log('POST /api/admin/products - received body:', JSON.stringify(body))
    const { name, description, price, cardPrice, stock, category, image } = body

    // Check which fields are missing
    const missingFields = []
    if (!name) missingFields.push('name')
    if (!description) missingFields.push('description')
    if (price === undefined) missingFields.push('price')
    if (stock === undefined) missingFields.push('stock')
    if (!category) missingFields.push('category')
    if (!image) missingFields.push('image')

    if (missingFields.length > 0) {
      console.log('POST /api/admin/products - missing fields:', missingFields)
      return NextResponse.json(
        { ok: false, error: `Missing required fields: ${missingFields.join(', ')}` },
        { status: 400 }
      )
    }

    const newProduct = await addProduct({
      name,
      description,
      price,
      cardPrice: cardPrice ?? price, // Default to regular price if not provided
      stock,
      category,
      image
    })
    return NextResponse.json({ ok: true, product: newProduct })
  } catch (error) {
    console.error('POST /api/admin/products failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}

// PUT - Update a product
export async function PUT(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const body = await req.json()
    const { id, ...updates } = body

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const updatedProduct = await updateProduct(id, updates)

    if (!updatedProduct) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, product: updatedProduct })
  } catch (error) {
    console.error('PUT /api/admin/products failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}

// DELETE - Delete a product
export async function DELETE(req: Request) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const { searchParams } = new URL(req.url)
    const id = searchParams.get('id')

    if (!id) {
      return NextResponse.json(
        { ok: false, error: 'Product ID is required' },
        { status: 400 }
      )
    }

    const deleted = await deleteProduct(parseInt(id))

    if (!deleted) {
      return NextResponse.json(
        { ok: false, error: 'Product not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({ ok: true, message: 'Product deleted successfully' })
  } catch (error) {
    console.error('DELETE /api/admin/products failed:', error)
    const errorMessage = error instanceof Error ? error.message : 'Bad request'
    return NextResponse.json(
      { ok: false, error: errorMessage },
      { status: 400 }
    )
  }
}
