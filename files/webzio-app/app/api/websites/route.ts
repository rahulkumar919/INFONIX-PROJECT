import { NextResponse } from 'next/server'
import mongoose from 'mongoose'
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

    const body = await req.json()
    const { siteName, slug: requestedSlug, templateId, content } = body

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

    // Generate unique slug from requested slug or site name
    let slug = requestedSlug ? slugify(requestedSlug, { lower: true, strict: true }) : slugify(siteName, { lower: true, strict: true })

    // Check if slug already exists
    const slugExists = await Website.findOne({ slug })
    if (slugExists) {
      return NextResponse.json({
        success: false,
        message: 'This domain name is already taken. Please choose a different domain name.',
        slugTaken: true
      }, { status: 400 })
    }

    // Validate templateId - should be a valid ObjectId
    if (!templateId) {
      return NextResponse.json({
        success: false,
        message: 'Template is required'
      }, { status: 400 })
    }

    // Convert templateId to ObjectId explicitly
    let templateObjectId
    try {
      templateObjectId = new mongoose.Types.ObjectId(templateId)
    } catch (err) {
      return NextResponse.json({
        success: false,
        message: 'Invalid template ID'
      }, { status: 400 })
    }

    const website = await Website.create({
      userId: decoded.id,
      siteName,
      slug,
      templateId: templateObjectId, // Explicitly converted ObjectId
      isActive: true,
      content: {
        heroTitle: content?.heroTitle || `Welcome to ${siteName}`,
        heroSubtitle: content?.heroSubtitle || 'Start shopping our amazing collection now.',
        aboutTitle: content?.aboutTitle || 'Our Story',
        aboutText: content?.aboutText || 'This is where our journey began, with a passion for quality products.',
        contactPhone: content?.contactPhone || '+91 999 999 9999',
        contactEmail: content?.contactEmail || 'hello@store.com',
        whatsappNumber: content?.whatsappNumber || '919999999999',
        footerDesc: content?.footerDesc || `Created with Webzio.`,
        primaryColor: content?.primaryColor || '#6366f1',
        ...content
      }
    })

    // Send email notification (don't wait for it to complete)
    if (user?.email && user?.name) {
      sendStoreCreationEmail(user.email, siteName, slug, user.name).catch(err => {
        console.error('Failed to send store creation email:', err)
      })
    }

    return NextResponse.json({
      success: true,
      website,
      message: 'Store created successfully! Check your email for details.'
    })
  } catch (error: any) {
    console.error('Store creation error:', error)

    // Handle duplicate key error (slug already exists)
    if (error.code === 11000 && error.keyPattern?.slug) {
      return NextResponse.json({
        success: false,
        message: 'This domain name is already taken. Please choose a different domain name.',
        slugTaken: true
      }, { status: 400 })
    }

    // Handle validation errors
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((e: any) => e.message)
      return NextResponse.json({
        success: false,
        message: messages.join(', ') || 'Validation failed',
        errors: messages
      }, { status: 400 })
    }

    return NextResponse.json({
      success: false,
      message: error.message || 'Failed to create store'
    }, { status: 400 })
  }
}
