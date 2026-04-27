import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Website from '@/models/Website'

export async function POST(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()
        const slug = params.slug as string

        // Find and update view count
        const website = await Website.findOneAndUpdate(
            { slug, isActive: true },
            { $inc: { views: 1 } },
            { new: true }
        )

        if (!website) {
            return NextResponse.json({
                success: false,
                message: 'Store not found'
            }, { status: 404 })
        }

        return NextResponse.json({
            success: true,
            views: website.views
        })
    } catch (error: any) {
        console.error('Error tracking view:', error)
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to track view'
        }, { status: 500 })
    }
}
