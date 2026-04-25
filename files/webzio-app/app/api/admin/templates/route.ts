import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Template from '../../../../models/Template'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all templates
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { searchParams } = new URL(req.url)
  const type = searchParams.get('type') || ''
  const category = searchParams.get('category') || ''

  const query: any = {}
  if (type) query.templateType = type
  if (category) query.category = category

  const templates = await Template.find(query).sort({ createdAt: -1 })
  return NextResponse.json({ success: true, templates })
}

// POST create template
export async function POST(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const body = await req.json()
  const { name, category, icon, desc, color, accentColor, tags, popular, isActive, previewImage, templateType, htmlCode, config, creationMode } = body

  // For HTML templates, only require category and htmlCode
  if (creationMode === 'html') {
    if (!category || !htmlCode) {
      return NextResponse.json({ success: false, message: 'Category and HTML code are required for HTML templates' }, { status: 400 })
    }
  } else {
    // For visual templates, require name and category
    if (!name || !category) {
      return NextResponse.json({ success: false, message: 'Name and category are required' }, { status: 400 })
    }
  }

  const template = await Template.create({
    name: name || `${category} Template`,
    category,
    icon: icon || (htmlCode ? '💻' : '🌐'),
    desc: desc || (htmlCode ? `Custom ${category} template` : ''),
    color: color || 'linear-gradient(135deg,#4F46E5,#7C3AED)',
    accentColor: accentColor || '#4F46E5',
    tags: Array.isArray(tags) ? tags : (typeof tags === 'string' ? tags.split(',').map(t => t.trim()).filter(Boolean) : []),
    popular: popular || false,
    isActive: isActive !== undefined ? isActive : true,
    previewImage: previewImage || '',
    templateType: templateType || 'general',
    htmlCode: htmlCode || '',
    config: config || {},
  })

  return NextResponse.json({ success: true, template }, { status: 201 })
}
