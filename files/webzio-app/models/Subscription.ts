import mongoose, { Schema, Document } from 'mongoose'

export interface ISubscription extends Document {
    userId: mongoose.Types.ObjectId
    planId: 'free' | 'pro' | 'business'
    billingCycle: 'monthly' | 'yearly'
    status: 'active' | 'cancelled' | 'expired' | 'pending'
    amount: number
    currency: string
    startDate: Date
    endDate: Date
    autoRenew: boolean
    paymentGateway: 'razorpay' | 'stripe' | 'manual'
    paymentId?: string
    orderId?: string
    cancelledAt?: Date
    cancelReason?: string
    createdAt: Date
    updatedAt: Date
}

const SubscriptionSchema = new Schema<ISubscription>({
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    planId: { type: String, enum: ['free', 'pro', 'business'], required: true },
    billingCycle: { type: String, enum: ['monthly', 'yearly'], required: true },
    status: { type: String, enum: ['active', 'cancelled', 'expired', 'pending'], default: 'pending' },
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    autoRenew: { type: Boolean, default: true },
    paymentGateway: { type: String, enum: ['razorpay', 'stripe', 'manual'], default: 'razorpay' },
    paymentId: { type: String },
    orderId: { type: String },
    cancelledAt: { type: Date },
    cancelReason: { type: String },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now }
})

// Update the updatedAt timestamp before saving
SubscriptionSchema.pre('save', function (next) {
    this.updatedAt = new Date()
    next()
})

// Index for faster queries
SubscriptionSchema.index({ userId: 1, status: 1 })
SubscriptionSchema.index({ endDate: 1, status: 1 })

export default mongoose.models.Subscription || mongoose.model<ISubscription>('Subscription', SubscriptionSchema)
