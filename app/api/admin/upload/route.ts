import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'

/**
 * Check for admin authentication
 */
function requireAdminAuth(request: Request): boolean {
  const cookieHeader = request.headers.get('cookie') || ''
  const cookies = cookieHeader.split(';').map(c => c.trim())
  const adminSessionCookie = cookies.find(c => c.startsWith('admin_session='))
  if (adminSessionCookie && adminSessionCookie.includes('authenticated')) {
    return true
  }

  const authHeader = request.headers.get('authorization') || ''
  if (!authHeader) return false

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

export async function POST(req: NextRequest) {
  if (!requireAdminAuth(req)) {
    return NextResponse.json(
      { ok: false, error: 'Unauthorized' },
      { status: 401, headers: { 'WWW-Authenticate': 'Basic realm="Admin Area"' } }
    )
  }

  try {
    const formData = await req.formData()
    const file = formData.get('file') as File | null

    if (!file) {
      return NextResponse.json(
        { ok: false, error: 'No file provided' },
        { status: 400 }
      )
    }

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif', 'image/bmp', 'image/x-ms-bmp', 'image/x-bmp']
    console.log('Upload - file type:', file.type, 'file name:', file.name)
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { ok: false, error: `Invalid file type: ${file.type}. Allowed: JPG, PNG, WebP, GIF, BMP` },
        { status: 400 }
      )
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024
    if (file.size > maxSize) {
      return NextResponse.json(
        { ok: false, error: 'File too large. Max 5MB allowed' },
        { status: 400 }
      )
    }

    // Generate unique filename
    const ext = file.name.split('.').pop() || 'png'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const filename = `products/product-${timestamp}-${randomStr}.${ext}`

    // Upload to Vercel Blob
    const blob = await put(filename, file, {
      access: 'public',
    })

    console.log('Upload successful:', blob.url)

    return NextResponse.json({ ok: true, url: blob.url })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
