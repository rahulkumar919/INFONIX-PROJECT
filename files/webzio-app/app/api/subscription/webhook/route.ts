import { NextRequest, NextResponse } from 'next/server'
import dbConnect from '../../../../lib/db'
import User from '../../../../models/User'
import Subscription from '../../../../models/Subscription'
import { verifyRazorpayPayment } from '../../../../lib/razorpay'

// Webhook handler for payment gateway events
export async function POST(req: NextRequest) {
    try {
        await dbConnect()

        const body = await req.json()
        const signature = req.headers.get('x-razorpay-signature')

        // TODO: Verify webhook signature
        // if (!signature || !verifyWebhookSignature(body, signature)) {
        //   return NextResponse.json({ success: false, message: 'Invalid signature' }, { status: 401 })
        // }

        const { event, payload } = body

        switch (event) {
            case 'payment.captured':
                await handlePaymentSuccess(payload)
                break

            case 'payment.failed':
                await handlePaymentFailed(payload)
                break

            case 'subscription.activated':
                await handleSubscriptionActivated(payload)
                break

            case 'subscription.cancelled':
                await handleSubscriptionCancelled(payload)
                break

            default:
                console.log('Unhandled webhook event:', event)
        }

        return NextResponse.json({ success: true, message: 'Webhook processed' })

    } catch (error: any) {
        console.error('Webhook error:', error)
        return NextResponse.json({
            success: false,
            message: 'Webhook processing failed',
            error: error.message
        }, { status: 500 })
    }
}

async function handlePaymentSuccess(payload: any) {
    const { order_id, payment_id, amount, notes } = payload

    // Find subscription by order ID
    const subscription = await Subscription.findOne({ orderId: order_id })
    if (!subscription) {
        console.error('Subscription not found for order:', order_id)
        return
    }

    // Update subscription status
    subscription.status = 'active'
    subscription.paymentId = payment_id
    await subscription.save()

    // Update user plan
    await User.findByIdAndUpdate(subscription.userId, {
        plan: subscription.planId
    })

    console.log('Payment successful:', payment_id)
}

async function handlePaymentFailed(payload: any) {
    const { order_id, error } = payload

    const subscription = await Subscription.findOne({ orderId: order_id })
    if (subscription) {
        subscription.status = 'expired'
        await subscription.save()
    }

    console.log('Payment failed:', order_id, error)
}

async function handleSubscriptionActivated(payload: any) {
    const { subscription_id, customer_id } = payload

    // Update subscription status
    await Subscription.findOneAndUpdate(
        { orderId: subscription_id },
        { status: 'active' }
    )

    console.log('Subscription activated:', subscription_id)
}

async function handleSubscriptionCancelled(payload: any) {
    const { subscription_id } = payload

    const subscription = await Subscription.findOne({ orderId: subscription_id })
    if (subscription) {
        subscription.status = 'cancelled'
        subscription.cancelledAt = new Date()
        subscription.autoRenew = false
        await subscription.save()

        // Downgrade user to free plan
        await User.findByIdAndUpdate(subscription.userId, {
            plan: 'free'
        })
    }

    console.log('Subscription cancelled:', subscription_id)
}
