import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Website from '../../../models/Website'
import { verifyToken } from '../../../lib/auth'
import slugify from 'slugify'

export async function GET(req: Request) {
  try {
    await dbConnect()
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const websites = await Website.find({ userId: decoded.id }).sort({ createdAt: -1 })
    return NextResponse.json({ success: true, websites })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  try {
    await dbConnect()
    const token = req.headers.get('Authorization')?.split(' ')[1]
    if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
    const decoded = verifyToken(token)
    if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

    const { siteName, templateId } = await req.json()
    if (!siteName) return NextResponse.json({ success: false, message: 'Store name is required' }, { status: 400 })

    const slug = slugify(siteName, { lower: true, strict: true })
    const website = await Website.create({
      userId: decoded.id,
      siteName,
      slug,
      templateId,
      content: {
        heroTitle: `Welcome to ${siteName}`,
        heroSubtitle: 'Start shopping our amazing collection now.',
        aboutTitle: 'Our Story',
        aboutText: 'This is where our journey began, with a passion for quality products.',
        contactPhone: '+91 999 999 9999',
        contactEmail: 'hello@store.com',
        whatsappNumber: '919999999999',
        footerDesc: `Created with StoreBuilder.`
      }
    })

    return NextResponse.json({ success: true, website })
  } catch (error: any) {
    return NextResponse.json({ success: false, message: 'Store name or slug already exists' }, { status: 400 })
  }
}
