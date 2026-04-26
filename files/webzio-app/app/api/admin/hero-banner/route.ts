import { NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import HeroBanner from '../../../../models/HeroBanner'
import { verifyToken } from '../../../../lib/auth'

// GET - Fetch hero banner
export async function GET(req: Request) {
    try {
        await dbConnect()

        const banner = await HeroBanner.findOne({ isActive: true }).sort({ createdAt: -1 })

        return NextResponse.json({ success: true, banner })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

// POST - Create/Update hero banner
export async function POST(req: Request) {
    try {
        await dbConnect()

        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

        const body = await req.json()
        const { topLeftImage, bottomLeftImage, topRightImage, bottomRightImage } = body

        if (!topLeftImage || !bottomLeftImage || !topRightImage || !bottomRightImage) {
            return NextResponse.json({ success: false, message: 'All 4 images are required' }, { status: 400 })
        }

        // Deactivate all existing banners
        await HeroBanner.updateMany({}, { isActive: false })

        // Create new banner
        const banner = await HeroBanner.create({
            topLeftImage,
            bottomLeftImage,
            topRightImage,
            bottomRightImage,
            isActive: true
        })

        return NextResponse.json({ success: true, banner, message: 'Hero banner updated successfully!' })
    } catch (error: any) {
        console.error('Hero banner error:', error)
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
