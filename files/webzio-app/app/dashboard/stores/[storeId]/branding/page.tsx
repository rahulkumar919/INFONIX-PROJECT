'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function BrandingPage() {
  const params = useParams()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    name: '',
    logo: '',
    banner: '',
    contactEmail: '',
    contactPhone: '',
    address: '',
    facebook: '',
    instagram: '',
    twitter: '',
    linkedin: ''
  })

  useEffect(() => {
    loadStore()
  }, [])

  const loadStore = async () => {
    try {
      const res = await fetch(`/api/store/${params.storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const store = data.website
        setForm({
          name: store.name || '',
          logo: store.logo || '',
          banner: store.banner || '',
          contactEmail: store.contactEmail || '',
          contactPhone: store.contactPhone || '',
          address: store.address || '',
          facebook: store.socialLinks?.facebook || '',
          instagram: store.socialLinks?.instagram || '',
          twitter: store.socialLinks?.twitter || '',
          linkedin: store.socialLinks?.linkedin || ''
        })
      }
    } catch (error) {
      toast.error('Failed to load store')
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/store/${params.storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          name: form.name,
          logo: form.logo,
          banner: form.banner,
          contactEmail: form.contactEmail,
          contactPhone: form.contactPhone,
          address: form.address,
          socialLinks: {
            facebook: form.facebook,
            instagram: form.instagram,
            twitter: form.twitter,
            linkedin: form.linkedin
          }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Branding updated successfully!')
      } else {
        toast.error(data.message || 'Failed to update')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
    setSaving(false)
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>

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
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>🎨 Branding & Identity</h1>
        <p style={{ color: C.textMuted }}>Customize your store's look and feel</p>
      </div>

      <div style={{ display: 'grid', gap: 32 }}>
        {/* Store Name */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>Store Name</h3>
          <div>
            <label style={labelStyle}>Store Name</label>
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
              placeholder="My Awesome Store" style={inputStyle} />
          </div>
        </div>

        {/* Logo & Banner */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>Logo & Banner</h3>
          <div style={{ display: 'grid', gap: 20 }}>
            <div>
              <label style={labelStyle}>Logo URL</label>
              <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                placeholder="https://example.com/logo.png" style={inputStyle} />
              {form.logo && (
                <div style={{ marginTop: 12, padding: 16, background: '#0A0F1E', borderRadius: 8, textAlign: 'center' }}>
                  <img src={form.logo} alt="Logo" style={{ maxWidth: 150, maxHeight: 80, objectFit: 'contain' }} />
                </div>
              )}
            </div>
            <div>
              <label style={labelStyle}>Banner / Hero Image URL</label>
              <input value={form.banner} onChange={e => setForm({ ...form, banner: e.target.value })}
                placeholder="https://example.com/banner.jpg" style={inputStyle} />
              {form.banner && (
                <div style={{ marginTop: 12, padding: 16, background: '#0A0F1E', borderRadius: 8 }}>
                  <img src={form.banner} alt="Banner" style={{ width: '100%', maxHeight: 200, objectFit: 'cover', borderRadius: 8 }} />
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Contact Details */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>Contact Details</h3>
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>Contact Email</label>
                <input type="email" value={form.contactEmail} onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                  placeholder="contact@store.com" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>Contact Phone</label>
                <input value={form.contactPhone} onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                  placeholder="+1 234 567 8900" style={inputStyle} />
              </div>
            </div>
            <div>
              <label style={labelStyle}>Address</label>
              <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                placeholder="123 Main St, City, Country" style={inputStyle} />
            </div>
          </div>
        </div>

        {/* Social Media Links */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>Social Media Links</h3>
          <div style={{ display: 'grid', gap: 20 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>📘 Facebook</label>
                <input value={form.facebook} onChange={e => setForm({ ...form, facebook: e.target.value })}
                  placeholder="https://facebook.com/yourpage" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>📷 Instagram</label>
                <input value={form.instagram} onChange={e => setForm({ ...form, instagram: e.target.value })}
                  placeholder="https://instagram.com/yourpage" style={inputStyle} />
              </div>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div>
                <label style={labelStyle}>🐦 Twitter</label>
                <input value={form.twitter} onChange={e => setForm({ ...form, twitter: e.target.value })}
                  placeholder="https://twitter.com/yourpage" style={inputStyle} />
              </div>
              <div>
                <label style={labelStyle}>💼 LinkedIn</label>
                <input value={form.linkedin} onChange={e => setForm({ ...form, linkedin: e.target.value })}
                  placeholder="https://linkedin.com/company/yourpage" style={inputStyle} />
              </div>
            </div>
          </div>
        </div>

        {/* Save Button */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '14px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
            border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
          }}>
            {saving ? 'Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
