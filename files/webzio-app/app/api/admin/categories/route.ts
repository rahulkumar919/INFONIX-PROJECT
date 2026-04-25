import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Template from '../../../../models/Template'
import { requireSuperAdmin } from '../../../../lib/middleware'

// GET all categories
export async function GET(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  // Get unique categories from templates
  const templates = await Template.find({}, 'category')
  const categories = Array.from(new Set(templates.map(t => t.category).filter(Boolean)))

  return NextResponse.json({ success: true, categories })
}

// POST create new category (by creating a template with that category)
export async function POST(req: NextRequest) {
  const { error } = requireSuperAdmin(req)
  if (error) return error
  await dbConnect()

  const { name } = await req.json()
  if (!name) {
    return NextResponse.json({ success: false, message: 'Category name is required' }, { status: 400 })
  }

  // Check if category already exists
  const existingTemplate = await Template.findOne({ category: name })
  if (existingTemplate) {
    return NextResponse.json({ success: false, message: 'Category already exists' }, { status: 400 })
  }

  return NextResponse.json({ success: true, message: 'Category will be created when first template is added' })
}