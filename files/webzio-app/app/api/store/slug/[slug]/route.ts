import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Website from '@/models/Website'

export async function GET(
    request: NextRequest,
    { params }: { params: { slug: string } }
) {
    try {
        await dbConnect()

        const website = await Website.findOne({
            slug: params.slug,
            isActive: true
        }).lean()

        if (!website) {
            console.log('Store not found for slug:', params.slug)
            return NextResponse.json(
                { success: false, message: 'Store not found' },
                { status: 404 }
            )
        }

        // Fetch template data if templateId exists
        let template = null
        if (website.templateId) {
            const Template = (await import('@/models/Template')).default
            template = await Template.findById(website.templateId).lean()
        }

        console.log('Store found:', website.siteName)
        return NextResponse.json({
            success: true,
            store: website,
            template: template
        })
    } catch (error) {
        console.error('Error fetching store:', error)
        return NextResponse.json(
            { success: false, message: 'Internal server error' },
            { status: 500 }
        )
    }
}
