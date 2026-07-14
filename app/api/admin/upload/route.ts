import { NextRequest, NextResponse } from 'next/server'
import { put } from '@vercel/blob'
import { requireAdmin } from '@/lib/auth'

export async function POST(req: NextRequest) {
  if (!await requireAdmin(req)) {
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
    const rawExt = (file.name.split('.').pop() || 'png').toLowerCase()
    const ext = /^[a-z0-9]{1,5}$/.test(rawExt) ? rawExt : 'png'
    const timestamp = Date.now()
    const randomStr = Math.random().toString(36).substring(2, 8)
    const folderParam = (formData.get('folder') as string | null) || 'products'
    const folder = /^[a-z0-9-]{1,30}$/.test(folderParam) ? folderParam : 'products'
    const basename = `${folder}-${timestamp}-${randomStr}.${ext}`

    // Prefer Vercel Blob when configured; fall back to local filesystem in dev
    if (process.env.BLOB_READ_WRITE_TOKEN) {
      const blob = await put(`${folder}/${basename}`, file, { access: 'public' })
      console.log('Upload successful (blob):', blob.url)
      return NextResponse.json({ ok: true, url: blob.url })
    }

    const { default: fs } = await import('fs/promises')
    const { default: path } = await import('path')
    const uploadDir = path.join(process.cwd(), 'public', 'uploads', folder)
    await fs.mkdir(uploadDir, { recursive: true })
    const buffer = Buffer.from(await file.arrayBuffer())
    await fs.writeFile(path.join(uploadDir, basename), buffer)
    const url = `/uploads/${folder}/${basename}`
    console.log('Upload successful (local):', url)
    return NextResponse.json({ ok: true, url })
  } catch (error) {
    console.error('Upload failed:', error)
    return NextResponse.json(
      { ok: false, error: 'Upload failed: ' + (error instanceof Error ? error.message : 'Unknown error') },
      { status: 500 }
    )
  }
}
