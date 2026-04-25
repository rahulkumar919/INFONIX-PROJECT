import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Blog from '../../../models/Blog'

// GET published blogs (public)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const limit = parseInt(searchParams.get('limit') || '10')
        const skip = parseInt(searchParams.get('skip') || '0')

        let query: any = { isPublished: true }
        if (category) query.category = category

        const blogs = await Blog.find(query)
            .sort({ createdAt: -1 })
            .limit(limit)
            .skip(skip)
            .select('-content') // Exclude full content for list view

        const total = await Blog.countDocuments(query)

        return NextResponse.json({ success: true, blogs, total })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
