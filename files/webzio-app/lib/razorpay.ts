// Razorpay Integration Helper
// Install: npm install razorpay

interface RazorpayOrderOptions {
    amount: number // in paise (299 INR = 29900 paise)
    currency: string
    receipt: string
    notes?: Record<string, any>
}

interface RazorpayOrder {
    id: string
    entity: string
    amount: number
    currency: string
    receipt: string
    status: string
    created_at: number
}

// Initialize Razorpay (uncomment when ready to use)
// import Razorpay from 'razorpay'
// 
// const razorpay = new Razorpay({
//   key_id: process.env.RAZORPAY_KEY_ID!,
//   key_secret: process.env.RAZORPAY_KEY_SECRET!
// })

export async function createRazorpayOrder(
    amount: number, // in INR
    userEmail: string,
    planId: string,
    billingCycle: string
): Promise<any> {
    // TODO: Uncomment when Razorpay is configured

    // const options: RazorpayOrderOptions = {
    //   amount: amount * 100, // Convert to paise
    //   currency: 'INR',
    //   receipt: `order_${Date.now()}`,
    //   notes: {
    //     email: userEmail,
    //     planId,
    //     billingCycle
    //   }
    // }

    // const order = await razorpay.orders.create(options)
    // return order

    // TEMPORARY: Return mock order for testing
    return {
        id: `order_${Date.now()}`,
        amount: amount * 100,
        currency: 'INR',
        receipt: `receipt_${Date.now()}`,
        status: 'created'
    }
}

export async function verifyRazorpayPayment(
    orderId: string,
    paymentId: string,
    signature: string
): Promise<boolean> {
    // TODO: Implement signature verification
    // const crypto = require('crypto')
    // const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!)
    // hmac.update(orderId + '|' + paymentId)
    // const generatedSignature = hmac.digest('hex')
    // return generatedSignature === signature

    return true // TEMPORARY
}

export async function createRazorpaySubscription(
    planId: string,
    customerId: string,
    billingCycle: 'monthly' | 'yearly'
): Promise<any> {
    // TODO: Create Razorpay subscription plan
    // const subscription = await razorpay.subscriptions.create({
    //   plan_id: planId,
    //   customer_notify: 1,
    //   total_count: billingCycle === 'monthly' ? 12 : 1,
    //   notes: {
    //     customerId
    //   }
    // })
    // return subscription

    return {
        id: `sub_${Date.now()}`,
        status: 'created'
    }
}
