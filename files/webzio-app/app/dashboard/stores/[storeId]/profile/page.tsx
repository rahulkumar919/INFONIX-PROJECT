'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function ProfileSettingsPage() {
    const { user, token, updateUser } = useAuthStore()
    const [saving, setSaving] = useState(false)
    const [changingPassword, setChangingPassword] = useState(false)
    const [form, setForm] = useState({
        name: '',
        email: ''
    })
    const [passwordForm, setPasswordForm] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    })

    useEffect(() => {
        if (user) {
            setForm({
                name: user.name || '',
                email: user.email || ''
            })
        }
    }, [user])

    const handleUpdateProfile = async () => {
        if (!form.name.trim()) {
            toast.error('Name is required')
            return
        }
        if (!form.email.trim()) {
            toast.error('Email is required')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/user/profile', {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data.success) {
                updateUser(data.user)
                toast.success('Profile updated successfully!')
            } else {
                toast.error(data.message || 'Failed to update profile')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
        setSaving(false)
    }

    const handleChangePassword = async () => {
        if (!passwordForm.currentPassword) {
            toast.error('Current password is required')
            return
        }
        if (!passwordForm.newPassword || passwordForm.newPassword.length < 6) {
            toast.error('New password must be at least 6 characters')
            return
        }
        if (passwordForm.newPassword !== passwordForm.confirmPassword) {
            toast.error('Passwords do not match')
            return
        }

        setChangingPassword(true)
        try {
            const res = await fetch('/api/user/change-password', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    currentPassword: passwordForm.currentPassword,
                    newPassword: passwordForm.newPassword
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Password changed successfully!')
                setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
            } else {
                toast.error(data.message || 'Failed to change password')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
        setChangingPassword(false)
    }

    const inputStyle = {
        width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.text, outline: 'none', fontSize: '0.9rem'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.8rem', fontWeight: 700, color: C.textMuted,
        marginBottom: 8, textTransform: 'uppercase' as const
    }

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>👤 Profile Settings</h1>
                <p style={{ color: C.textMuted }}>Manage your account information</p>
            </div>

            <div style={{ display: 'grid', gap: 32 }}>
                {/* Profile Information */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>
                        📝 Profile Information
                    </h3>
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Full Name</label>
                            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                                placeholder="John Doe" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Email Address</label>
                            <input type="email" value={form.email}
                                onChange={e => setForm({ ...form, email: e.target.value })}
                                placeholder="john@example.com" style={inputStyle} />
                            <div style={{ marginTop: 8, fontSize: '0.75rem', color: C.textMuted }}>
                                💡 This email will be used for login and notifications
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button onClick={handleUpdateProfile} disabled={saving}
                            style={{
                                padding: '12px 28px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                                border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                                cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                            }}>
                            {saving ? 'Saving...' : '💾 Save Changes'}
                        </button>
                    </div>
                </div>

                {/* Change Password */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>
                        🔒 Change Password
                    </h3>
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Current Password</label>
                            <input type="password" value={passwordForm.currentPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                                placeholder="Enter current password" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>New Password</label>
                            <input type="password" value={passwordForm.newPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                                placeholder="Enter new password (min 6 characters)" style={inputStyle} />
                        </div>
                        <div>
                            <label style={labelStyle}>Confirm New Password</label>
                            <input type="password" value={passwordForm.confirmPassword}
                                onChange={e => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                                placeholder="Confirm new password" style={inputStyle} />
                        </div>
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 24 }}>
                        <button onClick={handleChangePassword} disabled={changingPassword}
                            style={{
                                padding: '12px 28px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                                border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                                cursor: changingPassword ? 'not-allowed' : 'pointer', opacity: changingPassword ? 0.7 : 1
                            }}>
                            {changingPassword ? 'Changing...' : '🔐 Change Password'}
                        </button>
                    </div>
                </div>

                {/* Account Info */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>
                        ℹ️ Account Information
                    </h3>
                    <div style={{ display: 'grid', gap: 16 }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: '0.85rem', color: C.textMuted }}>Account Type</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.text }}>
                                {user?.role === 'admin' ? 'Administrator' : 'Store Owner'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0', borderBottom: `1px solid ${C.border}` }}>
                            <span style={{ fontSize: '0.85rem', color: C.textMuted }}>Member Since</span>
                            <span style={{ fontSize: '0.85rem', fontWeight: 700, color: C.text }}>
                                {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                            </span>
                        </div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', padding: '12px 0' }}>
                            <span style={{ fontSize: '0.85rem', color: C.textMuted }}>User ID</span>
                            <span style={{ fontSize: '0.75rem', fontWeight: 600, color: C.textMuted, fontFamily: 'monospace' }}>
                                {user?._id || 'N/A'}
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
