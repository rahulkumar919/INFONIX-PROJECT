import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import Website from '../../../../models/Website'
import { enforcePlanLimit, createLimitResponse } from '../../../../middleware/planEnforcement'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

// Example: Create store with plan enforcement
export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        // Get token from Authorization header
        const authHeader = req.headers.get('authorization')
        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return NextResponse.json({ success: false, message: 'Unauthorized' }, { status: 401 })
        }

        const token = authHeader.split(' ')[1]
        let decoded: any

        try {
            decoded = jwt.verify(token, JWT_SECRET)
        } catch (error) {
            return NextResponse.json({ success: false, message: 'Invalid token' }, { status: 401 })
        }

        // Get user with plan
        const user = await User.findById(decoded.userId)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Check current store count
        const currentStoreCount = await Website.countDocuments({ userId: user._id })

        // Enforce plan limit
        const limitCheck = enforcePlanLimit(currentStoreCount, 'stores', user.plan)
        if (!limitCheck.allowed) {
            return createLimitResponse(limitCheck.message!)
        }

        // Create store
        const { siteName, slug, category } = await req.json()

        const newStore = await Website.create({
            userId: user._id,
            siteName,
            slug,
            category,
            isEnabled: true
        })

        return NextResponse.json({
            success: true,
            message: 'Store created successfully',
            store: newStore,
            remainingStores: user.plan === 'free' ? 1 - currentStoreCount - 1 : 'unlimited'
        })

    } catch (error: any) {
        console.error('Create store error:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 })
    }
}
