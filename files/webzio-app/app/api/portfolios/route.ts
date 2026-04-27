import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/db'
import Portfolio from '@/models/Portfolio'
import { generatePortfolioHTML } from '@/lib/portfolioGenerator'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const portfolios = await Portfolio.find({ userId: session.user.id }).sort({ createdAt: -1 })
        return NextResponse.json(portfolios)
    } catch (error) {
        console.error('Error fetching portfolios:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolios' }, { status: 500 })
    }
}S

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await req.json()

        // Generate portfolio code
        const { htmlCode, cssCode, jsCode } = generatePortfolioHTML(data)

        // Create slug
        const slug = `${data.fullName.toLowerCase().replace(/\s+/g, '-')}-${Date.now()}`

        const portfolio = new Portfolio({
            userId: session.user.id,
            ...data,
            htmlCode,
            cssCode,
            jsCode,
            slug,
        })

        await portfolio.save()
        return NextResponse.json(portfolio, { status: 201 })
    } catch (error) {
        console.error('Error creating portfolio:', error)
        return NextResponse.json({ error: 'Failed to create portfolio' }, { status: 500 })
    }
}
