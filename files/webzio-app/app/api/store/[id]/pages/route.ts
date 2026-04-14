import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../lib/db'
import Page from '../../../../../models/Page'
import { requireAuth } from '../../../../../lib/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    await dbConnect()
    const pages = await Page.find({ websiteId: params.id }).sort({ order: 1, createdAt: -1 })
    return NextResponse.json({ success: true, pages })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}

export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { error, user } = requireAuth(req)
    if (error) return error

    await dbConnect()
    const body = await req.json()

    const existing = await Page.findOne({ websiteId: params.id, slug: body.slug })
    if (existing) {
      return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 })
    }

    const page = await Page.create({
      websiteId: params.id,
      title: body.title,
      slug: body.slug,
      content: body.content || '',
      metaTitle: body.metaTitle || '',
      metaDescription: body.metaDescription || '',
      isPublished: body.isPublished !== undefined ? body.isPublished : true,
      order: body.order || 0
    })

    return NextResponse.json({ success: true, page })
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 })
  }
}
