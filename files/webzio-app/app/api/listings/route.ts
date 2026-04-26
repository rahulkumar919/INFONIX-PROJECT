import { NextResponse } from 'next/server'
import dbConnect from '../../../lib/db'
import Website from '../../../models/Website'

export async function GET(req: Request) {
    try {
        await dbConnect()

        // Fetch all active and published stores
        const stores = await Website.find({
            isActive: true,
            isEnabled: true
        })
            .select('siteName slug templateCategory content createdAt views')
            .sort({ createdAt: -1 })
            .limit(100) // Limit to 100 stores for performance

        return NextResponse.json({
            success: true,
            stores,
            count: stores.length
        })
    } catch (error: any) {
        console.error('Listings API error:', error)
        return NextResponse.json({
            success: false,
            message: error.message
        }, { status: 500 })
    }
}
