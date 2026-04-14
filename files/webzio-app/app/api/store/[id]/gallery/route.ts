import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Gallery from '../../../../../models/Gallery'
import { requireAuth } from '../../../../../lib/middleware'

const MAX_IMAGES = 5

// GET - Get all gallery images for a store
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAuth(req)
  if (error) return error

  await dbConnect()
  const images = await Gallery.find({ websiteId: params.id }).sort({ order: 1, createdAt: -1 })
  return NextResponse.json({ success: true, images })
}

// POST - Add new image to gallery
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  const { error } = requireAuth(req)
  if (error) return error

  await dbConnect()

  // Check if max limit reached
  const count = await Gallery.countDocuments({ websiteId: params.id })
  if (count >= MAX_IMAGES) {
    return NextResponse.json({
      success: false,
      message: `Maximum ${MAX_IMAGES} images allowed`
    }, { status: 400 })
  }

  const { imageUrl, title, description } = await req.json()

  if (!imageUrl) {
    return NextResponse.json({ success: false, message: 'Image URL is required' }, { status: 400 })
  }

  const image = await Gallery.create({
    websiteId: params.id,
    imageUrl,
    title: title || '',
    description: description || '',
    order: count
  })

  return NextResponse.json({ success: true, image }, { status: 201 })
}
