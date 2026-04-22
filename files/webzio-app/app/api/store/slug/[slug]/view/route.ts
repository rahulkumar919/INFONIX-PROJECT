import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Website from '@/models/Website'

export async function POST(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect()

        // Increment view count
        await Website.updateOne(
            { slug: params.slug },
            { $inc: { views: 1 } }
        )

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Error incrementing view:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
