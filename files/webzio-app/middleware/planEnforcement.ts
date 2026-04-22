// Middleware to enforce plan limits
import { NextResponse } from 'next/server'
import { getPlanLimits } from '../lib/planLimits'

export function enforcePlanLimit(
    currentCount: number,
    limitType: 'stores' | 'menuItems' | 'templates',
    userPlan: 'free' | 'pro' | 'business'
): { allowed: boolean; message?: string } {
    const limits = getPlanLimits(userPlan)
    const limit = limits[limitType]

    // Unlimited
    if (limit === -1) {
        return { allowed: true }
    }

    // Check limit
    if (currentCount >= limit) {
        const upgradeMessage = userPlan === 'free'
            ? 'Upgrade to Pro to get more!'
            : 'Upgrade to Business for unlimited access!'

        return {
            allowed: false,
            message: `You've reached your ${limitType} limit (${limit}). ${upgradeMessage}`
        }
    }

    return { allowed: true }
}

export function createLimitResponse(message: string) {
    return NextResponse.json({
        success: false,
        message,
        limitReached: true,
        upgradeRequired: true
    }, { status: 403 })
}
