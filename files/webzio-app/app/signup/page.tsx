'use client'
import { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'
import toast from 'react-hot-toast'

export default function SignupPage() {
  const router = useRouter()
  const { login } = useAuthStore()
  const [form, setForm] = useState({ name: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)

  async function register(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    try {
      const res = await fetch('/api/auth/signup', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form)
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Registration successful')
        login(data.user, data.token)
        router.push('/dashboard')
      } else {
        toast.error(data.message)
      }
    } catch {
      toast.error('Registration failed')
    }
    setLoading(false)
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8f9fc', padding: 20 }}>
      <div style={{ width: '100%', maxWidth: 420, padding: 40, background: '#fff', borderRadius: 20, boxShadow: '0 10px 40px rgba(0,0,0,0.05)' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, textAlign: 'center', marginBottom: 8 }}>Join StoreBuilder</h2>
        <p style={{ color: '#888', textAlign: 'center', fontSize: '.9rem', marginBottom: 32 }}>Build your store in minutes</p>
        
        <form onSubmit={register} style={{ display: 'grid', gap: 18 }}>
          <div>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#444' }}>Full Name</label>
            <input type="text" required value={form.name} onChange={e => setForm({...form, name: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #eef0f5', borderRadius: 10, outline: 'none', transition: 'all 0.2s', marginTop: 6 }} onFocus={e => e.target.style.borderColor = '#6366f1'} />
          </div>
          <div>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#444' }}>Email Address</label>
            <input type="email" required value={form.email} onChange={e => setForm({...form, email: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #eef0f5', borderRadius: 10, outline: 'none', transition: 'all 0.2s', marginTop: 6 }} onFocus={e => e.target.style.borderColor = '#6366f1'} />
          </div>
          <div>
            <label style={{ fontSize: '.8rem', fontWeight: 600, color: '#444' }}>Password</label>
            <input type="password" required value={form.password} onChange={e => setForm({...form, password: e.target.value})} style={{ width: '100%', padding: '12px 16px', border: '1.5px solid #eef0f5', borderRadius: 10, outline: 'none', transition: 'all 0.2s', marginTop: 6 }} onFocus={e => e.target.style.borderColor = '#6366f1'} />
          </div>
          <button type="submit" disabled={loading} style={{ width: '100%', padding: 14, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer', marginTop: 10 }}>
            {loading ? 'Creating...' : 'Sign Up Free'}
          </button>
        </form>
        <p style={{ textAlign: 'center', color: '#888', fontSize: '.85rem', marginTop: 24 }}>Already have an account? <Link href="/login" style={{ color: '#6366f1', textDecoration: 'none', fontWeight: 600 }}>Login</Link></p>
      </div>
    </div>
  )
}
