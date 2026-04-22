import { NextRequest, NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key-change-in-production'

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

        const { planId, billingCycle } = await req.json()

        // Validate plan
        const validPlans = ['free', 'pro', 'business']
        if (!validPlans.includes(planId)) {
            return NextResponse.json({ success: false, message: 'Invalid plan' }, { status: 400 })
        }

        // Validate billing cycle
        if (!['monthly', 'yearly'].includes(billingCycle)) {
            return NextResponse.json({ success: false, message: 'Invalid billing cycle' }, { status: 400 })
        }

        // Get user
        const user = await User.findById(decoded.userId)
        if (!user) {
            return NextResponse.json({ success: false, message: 'User not found' }, { status: 404 })
        }

        // Check if already on this plan
        if (user.plan === planId) {
            return NextResponse.json({ success: false, message: 'Already on this plan' }, { status: 400 })
        }

        // Don't allow downgrade to free
        if (planId === 'free') {
            return NextResponse.json({ success: false, message: 'Cannot downgrade to free plan. Contact support.' }, { status: 400 })
        }

        // Calculate price
        const prices = {
            pro: { monthly: 299, yearly: 2990 },
            business: { monthly: 799, yearly: 7990 }
        }

        const amount = prices[planId as 'pro' | 'business'][billingCycle as 'monthly' | 'yearly']

        // In production, integrate with payment gateway (Razorpay/Stripe)
        // For now, we'll simulate successful payment

        // TODO: Integrate Razorpay
        // const razorpayOrder = await createRazorpayOrder(amount, user.email, planId, billingCycle)
        // return NextResponse.json({ 
        //   success: true, 
        //   paymentUrl: razorpayOrder.short_url,
        //   orderId: razorpayOrder.id 
        // })

        // TEMPORARY: Auto-upgrade for testing (remove in production)
        user.plan = planId
        await user.save()

        return NextResponse.json({
            success: true,
            message: `Successfully upgraded to ${planId.toUpperCase()} plan!`,
            user: {
                id: user._id,
                name: user.name,
                email: user.email,
                plan: user.plan
            },
            // In production, return payment URL
            // paymentUrl: 'https://razorpay.com/payment/...'
        })

    } catch (error: any) {
        console.error('Subscription upgrade error:', error)
        return NextResponse.json({
            success: false,
            message: 'Internal server error',
            error: error.message
        }, { status: 500 })
    }
}
