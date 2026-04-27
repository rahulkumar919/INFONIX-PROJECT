import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Website from '@/models/Website'
import Template from '@/models/Template'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()
        const slug = params.slug as string

        // Find website by slug
        const website = await Website.findOne({ slug, isActive: true })

        if (!website) {
            return NextResponse.json({
                success: false,
                message: 'Store not found'
            }, { status: 404 })
        }

        // Fetch template if templateId exists
        let template = null
        if (website.templateId) {
            template = await Template.findById(website.templateId)
        }

        return NextResponse.json({
            success: true,
            store: website,
            template: template
        })
    } catch (error: any) {
        console.error('Error fetching store by slug:', error)
        return NextResponse.json({
            success: false,
            message: error.message || 'Failed to fetch store'
        }, { status: 500 })
    }
}
