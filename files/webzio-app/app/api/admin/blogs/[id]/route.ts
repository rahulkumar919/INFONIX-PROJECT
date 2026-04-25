import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../../lib/db'
import Blog from '../../../../../models/Blog'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// GET single blog
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
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

        const blog = await Blog.findById(params.id)
        if (!blog) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, blog })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

// PATCH update blog
export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
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
        const blog = await Blog.findByIdAndUpdate(params.id, body, { new: true })

        if (!blog) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, blog, message: 'Blog updated successfully' })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

// DELETE blog
export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
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

        const blog = await Blog.findByIdAndDelete(params.id)
        if (!blog) {
            return NextResponse.json({ success: false, message: 'Blog not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Blog deleted successfully' })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
