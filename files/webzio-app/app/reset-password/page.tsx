'use client'
import { useState, useEffect, Suspense } from 'react'
import Link from 'next/link'
import { useRouter, useSearchParams } from 'next/navigation'
import toast from 'react-hot-toast'

function ResetPasswordForm() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [email, setEmail] = useState('')
    const [otp, setOtp] = useState('')
    const [newPassword, setNewPassword] = useState('')
    const [confirmPassword, setConfirmPassword] = useState('')
    const [loading, setLoading] = useState(false)
    const [resending, setResending] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const [showConfirmPassword, setShowConfirmPassword] = useState(false)
    const [timeLeft, setTimeLeft] = useState(180) // 3 minutes in seconds
    const [canResend, setCanResend] = useState(false)

    useEffect(() => {
        const emailParam = searchParams.get('email')
        if (emailParam) {
            setEmail(emailParam)
        }
    }, [searchParams])

    // Timer countdown
    useEffect(() => {
        if (timeLeft <= 0) {
            setCanResend(true)
            return
        }

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    setCanResend(true)
                    return 0
                }
                return prev - 1
            })
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const mins = Math.floor(seconds / 60)
        const secs = seconds % 60
        return `${mins}:${secs.toString().padStart(2, '0')}`
    }

    async function handleResendOTP() {
        if (!canResend || !email) return

        setResending(true)
        try {
            const res = await fetch('/api/auth/forgot-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email })
            })

            const data = await res.json()

            if (data.success) {
                toast.success('New OTP sent to your email!')
                setTimeLeft(180) // Reset timer to 3 minutes
                setCanResend(false)
            } else {
                toast.error(data.message || 'Failed to resend OTP')
            }
        } catch (error) {
            toast.error('Something went wrong. Please try again.')
        }
        setResending(false)
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault()

        if (newPassword !== confirmPassword) {
            toast.error('Passwords do not match!')
            return
        }

        if (newPassword.length < 6) {
            toast.error('Password must be at least 6 characters!')
            return
        }

        setLoading(true)

        try {
            const res = await fetch('/api/auth/reset-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, otp, newPassword })
            })

            const data = await res.json()

            if (data.success) {
                toast.success('Password reset successful!')
                router.push('/login')
            } else {
                toast.error(data.message || 'Failed to reset password')
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
                        🔒
                    </div>
                    <h2 style={{ fontSize: '1.6rem', fontWeight: 900, marginBottom: 6, color: '#111' }}>Reset Password</h2>
                    <p style={{ color: '#6b7280', fontSize: '.9rem' }}>Enter OTP and new password</p>
                </div>

                {/* Timer */}
                {!canResend && (
                    <div style={{
                        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                        padding: '12px',
                        borderRadius: 10,
                        textAlign: 'center',
                        marginBottom: 20,
                        color: '#fff'
                    }}>
                        <div style={{ fontSize: '.75rem', marginBottom: 4 }}>⏰ OTP expires in</div>
                        <div style={{ fontSize: '1.5rem', fontWeight: 900, letterSpacing: 2 }}>
                            {formatTime(timeLeft)}
                        </div>
                    </div>
                )}

                {/* Expired message */}
                {canResend && (
                    <div style={{
                        background: '#fef2f2',
                        border: '1px solid #fecaca',
                        padding: '12px',
                        borderRadius: 10,
                        textAlign: 'center',
                        marginBottom: 20,
                        color: '#991b1b'
                    }}>
                        <div style={{ fontSize: '.85rem', fontWeight: 600 }}>⚠️ OTP has expired</div>
                        <div style={{ fontSize: '.75rem', marginTop: 4 }}>Please request a new OTP</div>
                    </div>
                )}

                {/* Form */}
                <form onSubmit={handleSubmit} style={{ display: 'grid', gap: 18 }}>
                    <div>
                        <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Email Address</label>
                        <input
                            type="email" required value={email}
                            onChange={e => setEmail(e.target.value)}
                            placeholder="you@example.com"
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                        />
                    </div>

                    <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
                            <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151' }}>OTP Code</label>
                            {canResend && (
                                <button
                                    type="button"
                                    onClick={handleResendOTP}
                                    disabled={resending}
                                    style={{
                                        fontSize: '.75rem',
                                        color: '#4f46e5',
                                        background: 'none',
                                        border: 'none',
                                        cursor: resending ? 'not-allowed' : 'pointer',
                                        fontWeight: 700,
                                        opacity: resending ? 0.5 : 1
                                    }}
                                >
                                    {resending ? '⏳ Sending...' : '🔄 Resend OTP'}
                                </button>
                            )}
                        </div>
                        <input
                            type="text" required value={otp}
                            onChange={e => setOtp(e.target.value)}
                            placeholder="Enter 6-digit OTP"
                            maxLength={6}
                            style={inputStyle}
                            onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                            onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                        />
                    </div>

                    <div>
                        <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>New Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showPassword ? 'text' : 'password'} required value={newPassword}
                                onChange={e => setNewPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ ...inputStyle, paddingRight: 44 }}
                                onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                            />
                            <button type="button" onClick={() => setShowPassword(!showPassword)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#9ca3af' }}>
                                {showPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <div>
                        <label style={{ fontSize: '.82rem', fontWeight: 600, color: '#374151', display: 'block', marginBottom: 6 }}>Confirm Password</label>
                        <div style={{ position: 'relative' }}>
                            <input
                                type={showConfirmPassword ? 'text' : 'password'} required value={confirmPassword}
                                onChange={e => setConfirmPassword(e.target.value)}
                                placeholder="••••••••"
                                style={{ ...inputStyle, paddingRight: 44 }}
                                onFocus={e => (e.target.style.borderColor = '#4f46e5')}
                                onBlur={e => (e.target.style.borderColor = '#e5e7eb')}
                            />
                            <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', color: '#9ca3af' }}>
                                {showConfirmPassword ? '🙈' : '👁️'}
                            </button>
                        </div>
                    </div>

                    <button type="submit" disabled={loading}
                        style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 14px rgba(79,70,229,.4)', opacity: loading ? 0.75 : 1, transition: 'all .2s' }}>
                        {loading ? 'Resetting Password...' : 'Reset Password'}
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

export default function ResetPasswordPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <ResetPasswordForm />
        </Suspense>
    )
}
