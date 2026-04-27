import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import Portfolio from '@/models/Portfolio'

export async function GET(req: NextRequest, { params }: { params: { slug: string } }) {
    try {
        await dbConnect()
        const portfolio = await Portfolio.findOne({ slug: params.slug, isPublished: true })

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }

        // Increment view count
        portfolio.viewCount = (portfolio.viewCount || 0) + 1
        await portfolio.save()

        return NextResponse.json(portfolio)
    } catch (error) {
        console.error('Error fetching portfolio:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
    }
}
