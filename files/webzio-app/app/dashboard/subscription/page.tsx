'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'
import PricingModal from '../../../components/PricingModal'

export default function SubscriptionPage() {
    const { user, token } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [subscription, setSubscription] = useState<any>(null)
    const [showPricing, setShowPricing] = useState(false)

    useEffect(() => {
        fetchSubscription()
    }, [])

    async function fetchSubscription() {
        try {
            const res = await fetch('/api/subscription/status', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                setSubscription(data.subscription)
            }
        } catch (error) {
            toast.error('Failed to load subscription')
        }
        setLoading(false)
    }

    if (loading) {
        return (
            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
                <div style={{ fontSize: '2rem' }}>⏳</div>
            </div>
        )
    }

    const planColors = {
        free: { bg: '#F3F4F6', text: '#6B7280', gradient: 'linear-gradient(135deg, #64748B, #475569)' },
        pro: { bg: '#FCE7F3', text: '#EC4899', gradient: 'linear-gradient(135deg, #EC4899, #DB2777)' },
        business: { bg: '#F1F5F9', text: '#0F172A', gradient: 'linear-gradient(135deg, #1E293B, #0F172A)' }
    }

    const currentPlan = user?.plan || 'free'
    const colors = planColors[currentPlan]

    return (
        <div>
            <div style={{ marginBottom: 40 }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: '#111', marginBottom: 8 }}>
                    Subscription
                </h1>
                <p style={{ color: '#6B7280', fontSize: '1rem' }}>
                    Manage your subscription and billing
                </p>
            </div>

            {/* Current Plan Card */}
            <div style={{
                background: '#fff',
                borderRadius: 20,
                padding: 40,
                boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                marginBottom: 32
            }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 32 }}>
                    <div>
                        <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 8 }}>
                            Current Plan
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                            <h2 style={{ fontSize: '2.5rem', fontWeight: 900, color: '#111', margin: 0 }}>
                                {currentPlan.charAt(0).toUpperCase() + currentPlan.slice(1)}
                            </h2>
                            <span style={{
                                background: colors.bg,
                                color: colors.text,
                                fontSize: '.75rem',
                                fontWeight: 800,
                                padding: '6px 16px',
                                borderRadius: 20,
                                textTransform: 'uppercase',
                                letterSpacing: '0.05em'
                            }}>
                                {currentPlan === 'free' ? 'Free Forever' : 'Active'}
                            </span>
                        </div>
                    </div>
                    <button
                        onClick={() => setShowPricing(true)}
                        style={{
                            padding: '14px 32px',
                            background: colors.gradient,
                            border: 'none',
                            borderRadius: 12,
                            color: '#fff',
                            fontWeight: 800,
                            fontSize: '.9rem',
                            cursor: 'pointer',
                            boxShadow: '0 4px 16px rgba(0,0,0,0.15)',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={e => {
                            e.currentTarget.style.transform = 'translateY(-2px)'
                            e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.2)'
                        }}
                        onMouseLeave={e => {
                            e.currentTarget.style.transform = 'translateY(0)'
                            e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.15)'
                        }}
                    >
                        {currentPlan === 'free' ? '⚡ Upgrade Now' : '🔄 Change Plan'}
                    </button>
                </div>

                {/* Plan Limits */}
                {subscription && (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(5, 1fr)',
                        gap: 24,
                        padding: 32,
                        background: '#F9FAFB',
                        borderRadius: 16
                    }}>
                        <div>
                            <div style={{ fontSize: '.75rem', color: '#6B7280', marginBottom: 8 }}>Stores</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                                {subscription.limits.stores === -1 ? '∞' : subscription.limits.stores}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '.75rem', color: '#6B7280', marginBottom: 8 }}>Menu Items</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                                {subscription.limits.menuItems === -1 ? '∞' : subscription.limits.menuItems}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '.75rem', color: '#6B7280', marginBottom: 8 }}>Templates</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                                {subscription.limits.templates === -1 ? '∞' : subscription.limits.templates}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '.75rem', color: '#6B7280', marginBottom: 8 }}>Storage</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                                {subscription.limits.storage}
                            </div>
                        </div>
                        <div>
                            <div style={{ fontSize: '.75rem', color: '#6B7280', marginBottom: 8 }}>Support</div>
                            <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#111' }}>
                                {subscription.limits.support}
                            </div>
                        </div>
                    </div>
                )}
            </div>

            {/* Member Since */}
            {subscription && (
                <div style={{
                    background: '#fff',
                    borderRadius: 20,
                    padding: 32,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)'
                }}>
                    <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: 12 }}>
                        Member Since
                    </div>
                    <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#111' }}>
                        {new Date(subscription.memberSince).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </div>
                </div>
            )}

            <PricingModal
                isOpen={showPricing}
                onClose={() => setShowPricing(false)}
                currentPlan={currentPlan}
            />
        </div>
    )
}
