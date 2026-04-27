import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import dbConnect from '@/lib/db'
import Portfolio from '@/models/Portfolio'

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        const portfolio = await Portfolio.findById(params.id)

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }

        return NextResponse.json(portfolio)
    } catch (error) {
        console.error('Error fetching portfolio:', error)
        return NextResponse.json({ error: 'Failed to fetch portfolio' }, { status: 500 })
    }
}

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const data = await req.json()
        const portfolio = await Portfolio.findByIdAndUpdate(params.id, data, { new: true })

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }

        return NextResponse.json(portfolio)
    } catch (error) {
        console.error('Error updating portfolio:', error)
        return NextResponse.json({ error: 'Failed to update portfolio' }, { status: 500 })
    }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
    try {
        await dbConnect()
        const session = await getServerSession()

        if (!session?.user?.email) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
        }

        const portfolio = await Portfolio.findByIdAndDelete(params.id)

        if (!portfolio) {
            return NextResponse.json({ error: 'Portfolio not found' }, { status: 404 })
        }

        return NextResponse.json({ message: 'Portfolio deleted' })
    } catch (error) {
        console.error('Error deleting portfolio:', error)
        return NextResponse.json({ error: 'Failed to delete portfolio' }, { status: 500 })
    }
}
