import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Template from '../../../models/Template'

// GET all active templates (public endpoint)
export async function GET(req: NextRequest) {
    await dbConnect()

    const { searchParams } = new URL(req.url)
    const type = searchParams.get('type') || ''
    const category = searchParams.get('category') || ''
    const limit = searchParams.get('limit')

    const query: any = { isActive: true } // Only show active templates
    if (type) query.templateType = type
    if (category) query.category = category

    let templatesQuery = Template.find(query).sort({ createdAt: -1 })

    if (limit) {
        templatesQuery = templatesQuery.limit(parseInt(limit))
    }

    const templates = await templatesQuery
    return NextResponse.json({ success: true, templates })
}