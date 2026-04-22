import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

export async function GET(req: NextRequest) {
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

        // Get user with subscription details
        const user = await User.findById(decoded.userId).select('name email plan createdAt')
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Get plan limits
        const planLimits = {
            free: {
                stores: 1,
                menuItems: 10,
                templates: 5,
                storage: '100MB',
                support: 'Community'
            },
            pro: {
                stores: 5,
                menuItems: -1, // unlimited
                templates: 25,
                storage: '5GB',
                support: 'Priority'
            },
            business: {
                stores: -1, // unlimited
                menuItems: -1,
                templates: -1,
                storage: '50GB',
                support: 'Dedicated'
            }
        }

        return NextResponse.json({
            success: true,
            subscription: {
                plan: user.plan,
                limits: planLimits[user.plan],
                memberSince: user.createdAt
            }
        })

    } catch (error: any) {
        console.error('Subscription status error:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 })
    }
}
