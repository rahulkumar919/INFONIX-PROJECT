import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Blog from '../../../../models/Blog'

// GET single blog by slug (public)
export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()

        const blog = await Blog.findOne({ slug: params.slug, isPublished: true })
        if (!blog) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 })
        }

        // Increment views
        blog.views += 1
        await blog.save()

        return NextResponse.json({ success: true, blog })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
