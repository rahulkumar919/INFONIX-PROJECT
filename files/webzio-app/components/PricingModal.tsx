'use client'
import { useState } from 'react'
import { useAuthStore } from '../stores/authStore'
import toast from 'react-hot-toast'

interface PricingModalProps {
    isOpen: boolean
    onClose: () => void
    currentPlan?: string
}

export default function PricingModal({ isOpen, onClose, currentPlan = 'free' }: PricingModalProps) {
    const { user, token } = useAuthStore()
    const [billingCycle, setBillingCycle] = useState<'monthly' | 'yearly'>('monthly')
    const [loading, setLoading] = useState<string | null>(null)

    if (!isOpen) return null

    const plans = [
        {
            id: 'free',
            name: 'Starter',
            price: { monthly: 0, yearly: 0 },
            description: 'Perfect for getting started',
            features: [
                '1 Store',
                '10 Menu Items',
                'WhatsApp Button',
                'Mobile Optimized',
                'Basic Templates',
                'Community Support'
            ],
            color: '#64748B',
            gradient: 'linear-gradient(135deg, #64748B, #475569)',
            popular: false
        },
        {
            id: 'pro',
            name: 'Pro',
            price: { monthly: 299, yearly: 2990 },
            description: 'Most popular for growing businesses',
            features: [
                '5 Stores',
                'Unlimited Items',
                'All 25 Templates',
                'Custom Colors & Logo',
                'SEO Tools',
                'Advanced Analytics',
                'Priority Support',
                'Remove Branding'
            ],
            color: '#EC4899',
            gradient: 'linear-gradient(135deg, #EC4899, #DB2777)',
            popular: true,
            savings: 'Save 33%'
        },
        {
            id: 'business',
            name: 'Business',
            price: { monthly: 799, yearly: 7990 },
            description: 'For established businesses',
            features: [
                'Unlimited Stores',
                'Unlimited Items',
                'Custom Domain',
                'Advanced Analytics',
                'White Label',
                'API Access',
                'Dedicated Support',
                'Custom Features',
                'Priority Updates'
            ],
            color: '#0F172A',
            gradient: 'linear-gradient(135deg, #1E293B, #0F172A)',
            popular: false
        }
    ]

    const handleUpgrade = async (planId: string) => {
        if (planId === currentPlan) {
            toast.success('You are already on this plan!')
            return
        }

        if (planId === 'free') {
            toast.error('Cannot downgrade to free plan. Please contact support.')
            return
        }

        setLoading(planId)

        try {
            // In a real app, this would integrate with Stripe/Razorpay
            const res = await fetch('/api/subscription/upgrade', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify({
                    planId,
                    billingCycle
                })
            })

            const data = await res.json()

            if (data.success) {
                toast.success(`Successfully upgraded to ${planId.toUpperCase()} plan!`)
                // In real app, redirect to payment gateway
                // window.location.href = data.paymentUrl
                onClose()
            } else {
                toast.error(data.message || 'Upgrade failed')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        }

        setLoading(null)
    }

    return (
        <div
            onClick={onClose}
            style={{
                position: 'fixed',
                inset: 0,
                background: 'rgba(0, 0, 0, 0.7)',
                backdropFilter: 'blur(8px)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                zIndex: 9999,
                padding: 20,
                overflowY: 'auto'
            }}
        >
            <div
                onClick={e => e.stopPropagation()}
                style={{
                    background: '#fff',
                    borderRadius: 24,
                    maxWidth: 1200,
                    width: '100%',
                    maxHeight: '90vh',
                    overflowY: 'auto',
                    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                    animation: 'slideUp 0.3s ease'
                }}
            >
                <style>{`
          @keyframes slideUp {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
        `}</style>

                {/* Header */}
                <div style={{ padding: '40px 40px 32px', borderBottom: '1px solid #E5E7EB', position: 'relative' }}>
                    <button
                        onClick={onClose}
                        style={{
                            position: 'absolute',
                            top: 24,
                            right: 24,
                            width: 40,
                            height: 40,
                            borderRadius: 10,
                            border: '1px solid #E5E7EB',
                            background: '#F9FAFB',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            fontSize: '1.2rem',
                            transition: 'all 0.2s'
                        }}
                    >
                        ✕
                    </button>

                    <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: '.75rem', fontWeight: 800, color: '#3B82F6', textTransform: 'uppercase', letterSpacing: '0.1em', marginBottom: 12 }}>
                            PRICING
                        </div>
                        <h2 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', marginBottom: 8 }}>
                            Start free, grow at your pace
                        </h2>
                        <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                            No hidden fees. Cancel anytime.
                        </p>
                    </div>

                    {/* Billing Toggle */}
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, marginTop: 32 }}>
                        <span style={{ fontSize: '.9rem', fontWeight: 600, color: billingCycle === 'monthly' ? '#111' : '#9CA3AF' }}>
                            Monthly
                        </span>
                        <button
                            onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'yearly' : 'monthly')}
                            style={{
                                width: 56,
                                height: 32,
                                borderRadius: 16,
                                background: billingCycle === 'yearly' ? '#22C55E' : '#E5E7EB',
                                border: 'none',
                                cursor: 'pointer',
                                position: 'relative',
                                transition: 'all 0.3s'
                            }}
                        >
                            <div style={{
                                width: 24,
                                height: 24,
                                borderRadius: '50%',
                                background: '#fff',
                                position: 'absolute',
                                top: 4,
                                left: billingCycle === 'yearly' ? 28 : 4,
                                transition: 'all 0.3s',
                                boxShadow: '0 2px 4px rgba(0,0,0,0.2)'
                            }} />
                        </button>
                        <span style={{ fontSize: '.9rem', fontWeight: 600, color: billingCycle === 'yearly' ? '#111' : '#9CA3AF' }}>
                            Yearly
                        </span>
                        {billingCycle === 'yearly' && (
                            <span style={{
                                fontSize: '.75rem',
                                fontWeight: 700,
                                color: '#22C55E',
                                background: '#F0FDF4',
                                padding: '4px 12px',
                                borderRadius: 20,
                                border: '1px solid #BBF7D0'
                            }}>
                                Save 33%
                            </span>
                        )}
                    </div>
                </div>

                {/* Plans */}
                <div style={{ padding: 40, display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 24 }}>
                    {plans.map((plan) => {
                        const price = billingCycle === 'monthly' ? plan.price.monthly : plan.price.yearly
                        const isCurrentPlan = plan.id === currentPlan

                        return (
                            <div
                                key={plan.id}
                                style={{
                                    background: plan.popular ? '#FAFAFA' : '#fff',
                                    border: plan.popular ? '2px solid #EC4899' : '1px solid #E5E7EB',
                                    borderRadius: 16,
                                    padding: 32,
                                    position: 'relative',
                                    transition: 'all 0.3s',
                                    display: 'flex',
                                    flexDirection: 'column'
                                }}
                            >
                                {plan.popular && (
                                    <div style={{
                                        position: 'absolute',
                                        top: -12,
                                        left: '50%',
                                        transform: 'translateX(-50%)',
                                        background: plan.gradient,
                                        color: '#fff',
                                        fontSize: '.7rem',
                                        fontWeight: 800,
                                        padding: '6px 20px',
                                        borderRadius: 20,
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.4)'
                                    }}>
                                        ⭐ Most Popular
                                    </div>
                                )}

                                <div style={{ marginBottom: 24 }}>
                                    <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                                        {plan.name}
                                    </div>
                                    <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, marginBottom: 8 }}>
                                        <span style={{ fontSize: '3rem', fontWeight: 900, color: '#111' }}>
                                            ₹{price}
                                        </span>
                                        <span style={{ fontSize: '.9rem', color: '#6B7280' }}>
                                            /{billingCycle === 'monthly' ? 'month' : 'year'}
                                        </span>
                                    </div>
                                    <p style={{ fontSize: '.85rem', color: '#6B7280', lineHeight: 1.6 }}>
                                        {plan.description}
                                    </p>
                                </div>

                                <div style={{ flex: 1, marginBottom: 24 }}>
                                    {plan.features.map((feature, idx) => (
                                        <div key={idx} style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 12 }}>
                                            <div style={{
                                                width: 20,
                                                height: 20,
                                                borderRadius: '50%',
                                                background: plan.popular ? plan.gradient : '#F0F9FF',
                                                display: 'flex',
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                fontSize: '.7rem',
                                                flexShrink: 0
                                            }}>
                                                ✓
                                            </div>
                                            <span style={{ fontSize: '.85rem', color: '#374151' }}>{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <button
                                    onClick={() => handleUpgrade(plan.id)}
                                    disabled={loading === plan.id || isCurrentPlan}
                                    style={{
                                        width: '100%',
                                        padding: '14px',
                                        borderRadius: 12,
                                        border: 'none',
                                        background: isCurrentPlan ? '#E5E7EB' : plan.popular ? plan.gradient : '#F9FAFB',
                                        color: isCurrentPlan ? '#6B7280' : plan.popular ? '#fff' : '#111',
                                        fontSize: '.9rem',
                                        fontWeight: 700,
                                        cursor: isCurrentPlan || loading === plan.id ? 'not-allowed' : 'pointer',
                                        transition: 'all 0.2s',
                                        boxShadow: plan.popular && !isCurrentPlan ? '0 4px 12px rgba(236, 72, 153, 0.3)' : 'none',
                                        opacity: loading === plan.id ? 0.7 : 1
                                    }}
                                >
                                    {loading === plan.id ? '⏳ Processing...' : isCurrentPlan ? '✓ Current Plan' : plan.id === 'free' ? 'Get Started' : 'Upgrade Now'}
                                </button>
                            </div>
                        )
                    })}
                </div>

                {/* Footer */}
                <div style={{ padding: '24px 40px', borderTop: '1px solid #E5E7EB', background: '#F9FAFB', borderRadius: '0 0 24px 24px' }}>
                    <p style={{ textAlign: 'center', fontSize: '.85rem', color: '#6B7280', margin: 0 }}>
                        💳 Secure payment powered by Stripe • 🔒 Cancel anytime • 📧 Email support included
                    </p>
                </div>
            </div>
        </div>
    )
}
