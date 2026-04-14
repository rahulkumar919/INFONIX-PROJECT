import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'
import { requireAuth } from '../../../../lib/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const website = await Website.findOne({ _id: params.id, userId: user.id })
  if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, website })
}

// Full update of store content, branding, SEO, pages, gallery
export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const website = await Website.findOneAndUpdate(
    { _id: params.id, userId: user.id },
    { $set: body },
    { new: true }
  )
  if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, website })
}

// PATCH partial update (branding, seo, settings, etc)
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const website = await Website.findOneAndUpdate(
    { _id: params.id, userId: user.id },
    { $set: body },
    { new: true }
  )
  if (!website) return NextResponse.json({ success: false, message: 'Store not found' }, { status: 404 })

  return NextResponse.json({ success: true, website })
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  const { error, user } = requireAuth(req)
  if (error) return error
  await dbConnect()

  await Website.findOneAndDelete({ _id: params.id, userId: user.id })
  return NextResponse.json({ success: true, message: 'Store deleted' })
}
