'use client'
import { useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { user, token } = useAuthStore()
  const [loading, setLoading] = useState(false)
  const [form, setForm] = useState({
    name: user?.name || '',
    email: user?.email || '',
    newPassword: '',
  })

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function updateProfile(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/profile', {
        method: 'PUT', headers,
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) toast.success('Profile updated! ✨')
      else toast.error(data.message)
    } catch {
      toast.error('Failed to sync profile')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ maxWidth: 640 }}>
      <div style={{ marginBottom: 40 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', marginBottom: 6 }}>Account Settings</h1>
        <p style={{ color: '#64748b', fontSize: '0.92rem' }}>Configure your profile preferences and security.</p>
      </div>

      <div style={{ background: '#fff', border: '1px solid #f0f0f2', borderRadius: 24, padding: 40, boxShadow: '0 4px 25px rgba(0,0,0,0.02)' }}>
        <form onSubmit={updateProfile}>
          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 700, color: '#334155', marginBottom: 10 }}>Account Name</label>
            <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '.92rem', outline: 'none', background: '#fcfcfd' }} />
          </div>

          <div style={{ marginBottom: 32 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 700, color: '#334155', marginBottom: 10 }}>Email Protocol (Authentication)</label>
            <input type="email" value={form.email} disabled
              style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #f1f5f9', borderRadius: 12, fontSize: '.92rem', outline: 'none', color: '#94a3b8', background: '#f8fafc' }} />
            <p style={{ fontSize: '0.75rem', color: '#94a3b8', marginTop: 8 }}>Internal security hash prevents email re-mapping for this account.</p>
          </div>

          <div style={{ marginBottom: 40 }}>
            <label style={{ display: 'block', fontSize: '.85rem', fontWeight: 700, color: '#334155', marginBottom: 10 }}>New Access Key (Optional)</label>
            <input type="password" value={form.newPassword} onChange={e => setForm({ ...form, newPassword: e.target.value })}
              placeholder="Leave blank to maintain current signature"
              style={{ width: '100%', padding: '14px 18px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '.92rem', outline: 'none', background: '#fcfcfd' }} />
          </div>

          <div style={{ display: 'flex', gap: 16 }}>
             <button type="submit" disabled={loading} style={{ 
               padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', 
               border: 'none', borderRadius: 12, fontSize: '0.9rem', fontWeight: 800, cursor: 'pointer', 
               boxShadow: '0 4px 12px rgba(99,102,241,0.2)', transition: 'all 0.2s'
             }}>
               {loading ? 'Initializing Sync...' : '💾 Sync Infrastructure'}
             </button>
          </div>
        </form>
      </div>

      <div style={{ marginTop: 40, padding: 32, background: '#fff1f2', borderRadius: 24, border: '1px solid #fecdd3' }}>
        <h3 style={{ fontSize: '1rem', fontWeight: 900, color: '#9f1239', marginBottom: 10 }}>🚨 Dangerous Access Area</h3>
        <p style={{ fontSize: '0.88rem', color: '#be123c', marginBottom: 24, lineHeight: 1.6 }}>Deleting your global account will terminate all stores and associated product databases permanently. This action cannot be undone.</p>
        <button style={{ padding: '12px 24px', background: '#fb7185', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.82rem', fontWeight: 800, cursor: 'pointer' }}>
          Deactivate Hub
        </button>
      </div>
    </div>
  )
}
