import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../../../lib/db'
import Page from '../../../../../../models/Page'
import { requireAuth } from '../../../../../../lib/middleware'

export async function GET(req: NextRequest, { params }: { params: { id: string, pageId: string } }) {
    try {
        await dbConnect()
        const page = await Page.findOne({ _id: params.pageId, websiteId: params.id })
        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
        }
        return NextResponse.json({ success: true, page })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string, pageId: string } }) {
    try {
        const { error, user } = requireAuth(req)
        if (error) return error

        await dbConnect()
        const body = await req.json()

        if (body.slug) {
            const existing = await Page.findOne({
                websiteId: params.id,
                slug: body.slug,
                _id: { $ne: params.pageId }
            })
            if (existing) {
                return NextResponse.json({ success: false, error: 'Slug already exists' }, { status: 400 })
            }
        }

        const page = await Page.findOneAndUpdate(
            { _id: params.pageId, websiteId: params.id },
            { $set: body },
            { new: true }
        )

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, page })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string, pageId: string } }) {
    try {
        const { error, user } = requireAuth(req)
        if (error) return error

        await dbConnect()
        const page = await Page.findOneAndDelete({ _id: params.pageId, websiteId: params.id })

        if (!page) {
            return NextResponse.json({ success: false, error: 'Page not found' }, { status: 404 })
        }

        return NextResponse.json({ success: true, message: 'Page deleted' })
    } catch (error: any) {
        return NextResponse.json({ success: false, error: error.message }, { status: 500 })
    }
}
