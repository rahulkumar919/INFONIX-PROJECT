'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function ProfileSettingsPage() {
  const { user, token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [profileForm, setProfileForm] = useState({
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
      setProfileForm({
        name: user.name || '',
        email: user.email || ''
      })
    }
  }, [user])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!profileForm.name || !profileForm.email) {
      toast.error('Name and email are required')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/user/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify(profileForm)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Profile updated successfully')
      } else {
        toast.error(data.error || 'Failed to update profile')
      }
    } catch (error) {
      toast.error('Failed to update profile')
    }
    setLoading(false)
  }

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!passwordForm.currentPassword || !passwordForm.newPassword || !passwordForm.confirmPassword) {
      toast.error('All password fields are required')
      return
    }
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      toast.error('New passwords do not match')
      return
    }
    if (passwordForm.newPassword.length < 6) {
      toast.error('Password must be at least 6 characters')
      return
    }

    setLoading(true)
    try {
      const res = await fetch('/api/user/password', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          currentPassword: passwordForm.currentPassword,
          newPassword: passwordForm.newPassword
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Password changed successfully')
        setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' })
      } else {
        toast.error(data.error || 'Failed to change password')
      }
    } catch (error) {
      toast.error('Failed to change password')
    }
    setLoading(false)
  }

  return (
    <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>⚙️ Profile Settings</h1>
        <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Manage your account settings</p>
      </div>

      {/* Profile Information */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>👤 Profile Information</h2>
        <form onSubmit={handleProfileUpdate}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
            {/* Name */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Full Name *
              </label>
              <input
                type="text"
                value={profileForm.name}
                onChange={(e) => setProfileForm({ ...profileForm, name: e.target.value })}
                placeholder="John Doe"
                style={{
                  width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: '0.95rem'
                }}
                required
              />
            </div>

            {/* Email */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Email Address *
              </label>
              <input
                type="email"
                value={profileForm.email}
                onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                placeholder="john@example.com"
                style={{
                  width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: '0.95rem'
                }}
                required
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                  border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Saving...' : '💾 Save Changes'}
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* Change Password */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🔒 Change Password</h2>
        <form onSubmit={handlePasswordChange}>
          <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
            {/* Current Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Current Password *
              </label>
              <input
                type="password"
                value={passwordForm.currentPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                placeholder="Enter current password"
                style={{
                  width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: '0.95rem'
                }}
              />
            </div>

            {/* New Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                New Password *
              </label>
              <input
                type="password"
                value={passwordForm.newPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                placeholder="Enter new password (min 6 characters)"
                style={{
                  width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Confirm Password */}
            <div style={{ marginBottom: 24 }}>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                Confirm New Password *
              </label>
              <input
                type="password"
                value={passwordForm.confirmPassword}
                onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                placeholder="Confirm new password"
                style={{
                  width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                  borderRadius: 8, color: C.text, fontSize: '0.95rem'
                }}
              />
            </div>

            {/* Submit */}
            <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                  border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer',
                  opacity: loading ? 0.6 : 1
                }}
              >
                {loading ? 'Changing...' : '🔐 Change Password'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}
