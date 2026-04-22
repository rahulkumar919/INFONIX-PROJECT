'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'

export default function ForgotPasswordPage() {
    const router = useRouter()
    const [email, setEmail] = useState('')
    const [loading, setLoading] = useState(false)

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (data.success) {
                toast.success('OTP sent to your email!')
                router.push(`/reset-password?email=${encodeURIComponent(email)}`)
            } else {
                toast.error(data.message || 'Failed to send OTP')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        }

        setLoading(false)
    }

    const inputStyle = {
        width: '100%', padding: '12px 16px', border: '2px solid #e5e7eb',
        borderRadius: 10, outline: 'none', fontSize: '.95rem', transition: 'border-color .2s',
        fontFamily: 'inherit',
    }

    return (
        <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'linear-gradient(135deg,#4f46e5 0%,#7c3aed 100%)', padding: 20 }}>
            <div style={{ width: '100%', maxWidth: 420, padding: 40, background: '#fff', borderRadius: 20, boxShadow: '0 20px 60px rgba(0,0,0,0.25)' }}>

                {/* Header */}
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <div style={{ width: 60, height: 60, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 16px', fontSize: '1.6rem' }}>
                        🔑
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 6, color: '#111' }}>Forgot Password?</h2>
                    <p style={{ color: '#6b7280', fontSize: '.9rem' }}>Enter your email to receive OTP</p>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                        <input
                            type="email" required value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder=" Enter the Email "
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                        />
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,.4)', opacity: loading ? 0.75 : 1, transition: 'all .2s' }}>
                        {loading ? 'Sending OTP...' : 'Send OTP'}
                    </button>
                </form>

                <p style={{ textAlign: 'center', color: '#6b7280', fontSize: '.85rem', marginTop: 24 }}>
                    Remember your password?{' '}
                    <Link href="/login" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700 }}>Back to Login</Link>
                </p>
            </div>
        </div>
    )
}
