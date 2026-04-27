import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '@/lib/db'
import HeroBanner from '@/models/HeroBanner'
import { verifyToken } from '@/lib/auth'

export async function GET(req: NextRequest) {
    try {
        await dbConnect()

        // No authentication required for GET - public endpoint
        const banner = await HeroBanner.findOne({ isActive: true }).sort({ createdAt: -1 })
        return NextResponse.json({ success: true, banner })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}

export async function POST(req: NextRequest) {
    try {
        await dbConnect()
        const token = req.headers.get('Authorization')?.split(' ')[1]
        if (!token) return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })

        const decoded = verifyToken(token)
        if (!decoded) return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })

        const body = await req.json()

        let banner = await HeroBanner.findOne()
        if (!banner) {
            banner = new HeroBanner({ ...body, isActive: true })
        } else {
            Object.assign(banner, { ...body, isActive: true })
        }

        await banner.save()
        return NextResponse.json({ success: true, banner })
    } catch (error: any) {
        return NextResponse.json({ success: false, message: error.message }, { status: 500 })
    }
}
