import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/db'
import Blog from '../../../../models/Blog'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// GET all blogs (admin)
export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        try {
            jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
        }

        const { searchParams } = new URL(req.url)
        const category = searchParams.get('category')
        const published = searchParams.get('published')

        let query: any = {}
        if (category) query.category = category
        if (published) query.isPublished = published === 'true'

        const blogs = await Blog.find(query).sort({ createdAt: -1 })

        return NextResponse.json({ success: true, blogs })
    } catch (error: any) {
        console.error('Get blogs error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

// POST create new blog
export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        try {
            jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
        }

        const body = await req.json()
        const { title, slug, excerpt, content, featuredImage, category, tags, metaTitle, metaDescription, metaKeywords, ogImage, isPublished } = body

        if (!title || !slug || !excerpt || !content || !category) {
            return NextResponse.json({ success: false, message: 'Required fields missing' }, { status: 400 })
        }

        // Check if slug already exists
        const existingBlog = await Blog.findOne({ slug })
        if (existingBlog) {
            return NextResponse.json({ success: false, message: 'Slug already exists' }, { status: 400 })
        }

        const blog = await Blog.create({
            title,
            slug,
            excerpt,
            content,
            featuredImage: featuredImage || '',
            category,
            tags: tags || [],
            metaTitle: metaTitle || title,
            metaDescription: metaDescription || excerpt,
            metaKeywords: metaKeywords || [],
            ogImage: ogImage || featuredImage || '',
            canonicalUrl: `/blog/${slug}`,
            isPublished: isPublished || false,
        })

        return NextResponse.json({ success: true, blog, message: 'Blog created successfully' })
    } catch (error: any) {
        console.error('Create blog error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
