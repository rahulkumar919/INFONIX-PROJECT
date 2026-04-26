import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import Website from '../../../../models/Website'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        const { searchParams } = new URL(req.url)
        const slug = searchParams.get('slug')

        if (!slug) {
            return NextResponse.json({ success: false, message: 'Slug is required' }, { status: 400 })
        }

        // Check if slug exists
        const existingWebsite = await Website.findOne({ slug })

        return NextResponse.json({
            success: true,
            available: !existingWebsite,
            slug
        })
    } catch (error: any) {
        console.error('Error checking domain:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
