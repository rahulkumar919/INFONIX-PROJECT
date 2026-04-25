import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Website from '../../../models/Website'
import { verifyToken } from '../../../lib/auth'
import slugify from 'slugify'
import { sendStoreCreationEmail } from '../../../lib/email'

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

    // Check user plan — free users can only have 1 store
    const user = await (await import('../../../models/User')).default.findById(decoded.id)
    const existingCount = await Website.countDocuments({ userId: decoded.id })
    const plan = user?.plan || 'free'
    const limits: Record<string, number> = { free: 1, pro: 5, business: Infinity }
    const limit = limits[plan] ?? 1

    if (existingCount >= limit) {
      return NextResponse.json({
        success: false,
        message: plan === 'free'
          ? 'Free plan allows only 1 store. Upgrade to Pro for 5 stores or Business for unlimited.'
          : `Your ${plan} plan allows ${limit} stores. Upgrade to Business for unlimited stores.`,
        needsUpgrade: true,
        currentPlan: plan,
        limit,
        current: existingCount,
      }, { status: 403 })
    }

    // Generate unique slug
    let slug = slugify(siteName, { lower: true, strict: true })
    let slugExists = await Website.findOne({ slug })
    let counter = 1

    // If slug exists, append number
    while (slugExists) {
      slug = `${slugify(siteName, { lower: true, strict: true })}-${counter}`
      slugExists = await Website.findOne({ slug })
      counter++
    }

    const website = await Website.create({
      userId: decoded.id,
      siteName,
      slug,
      templateId: templateId || 1,
      isActive: true,
      content: {
        heroTitle: `Welcome to ${siteName}`,
        heroSubtitle: 'Start shopping our amazing collection now.',
        aboutTitle: 'Our Story',
        aboutText: 'This is where our journey began, with a passion for quality products.',
        contactPhone: '+91 999 999 9999',
        contactEmail: 'hello@store.com',
        whatsappNumber: '919999999999',
        footerDesc: `Created with Webrazeo.`
      }
    })

    // Send email notification (don't wait for it to complete)
    if (user?.email && user?.name) {
      sendStoreCreationEmail(user.email, siteName, slug, user.name).catch(err => {
        console.error('Failed to send store creation email:', err)
      })
    }

    return NextResponse.json({ success: true, website, message: 'Store created successfully! Check your email for details.' })
  } catch (error: any) {
    console.error('Store creation error:', error)
    return NextResponse.json({ success: false, message: error.message || 'Failed to create store' }, { status: 400 })
  }
}
