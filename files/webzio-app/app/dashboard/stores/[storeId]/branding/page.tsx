'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)', green: '#22C55E'
}

export default function BrandingPage() {
  const params = useParams()
  const { token } = useAuthStore()
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [form, setForm] = useState({
    siteName: '',
    logo: '',
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
  }, [params.storeId, token])

  const loadStore = async () => {
    try {
      const res = await fetch(`/api/websites/${params.storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        const store = data.website
        setForm({
          siteName: store.siteName || '',
          logo: store.content?.logo || '',
          contactEmail: store.content?.contactEmail || '',
          contactPhone: store.content?.contactPhone || '',
          address: store.content?.contactAddress || '',
          facebook: store.content?.socialLinks?.facebook || '',
          instagram: store.content?.socialLinks?.instagram || '',
          twitter: store.content?.socialLinks?.twitter || '',
          linkedin: store.content?.socialLinks?.linkedin || ''
        })
      } else {
        toast.error(data.message || 'Failed to load store')
      }
    } catch (error) {
      toast.error('Failed to load store')
      console.error(error)
    }
    setLoading(false)
  }

  const handleSave = async () => {
    setSaving(true)
    try {
      const res = await fetch(`/api/websites/${params.storeId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({
          siteName: form.siteName,
          content: {
            logo: form.logo,
            contactEmail: form.contactEmail,
            contactPhone: form.contactPhone,
            contactAddress: form.address,
            socialLinks: {
              facebook: form.facebook,
              instagram: form.instagram,
              twitter: form.twitter,
              linkedin: form.linkedin
            }
          }
        })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('✅ Branding updated successfully!')
      } else {
        toast.error(data.message || 'Failed to update')
      }
    } catch (error) {
      toast.error('An error occurred while saving')
      console.error(error)
    }
    setSaving(false)
  }

  if (loading) return (
    <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>
      <div style={{ fontSize: '1.2rem', marginBottom: 12 }}>⏳ Loading branding...</div>
    </div>
  )

  const inputStyle = {
    width: '100%', padding: '12px 14px', background: '#0A0F1E', border: `1px solid ${C.border}`,
    borderRadius: 10, color: C.text, outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit',
    transition: 'all 0.2s'
  }

  const labelStyle = {
    display: 'block', fontSize: '0.75rem', fontWeight: 800, color: C.textMuted,
    marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em'
  }

  const sectionStyle = {
    background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28,
    transition: 'all 0.2s'
  }

  return (
    <div style={{ padding: '32px 24px', maxWidth: 1000, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 40 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
          <div style={{ fontSize: '2rem' }}>🎨</div>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 900, color: C.text, margin: 0 }}>Branding & Identity</h1>
            <p style={{ color: C.textMuted, margin: '4px 0 0 0', fontSize: '0.9rem' }}>Customize your store's look and feel</p>
          </div>
        </div>
        <div style={{ height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)`, marginTop: 16 }} />
      </div>

      <div style={{ display: 'grid', gap: 28 }}>
        {/* Store Name */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '1.3rem' }}>🏪</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Store Name</h3>
          </div>
          <input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })}
            placeholder="My Awesome Store" style={inputStyle} />
        </div>

        {/* Logo */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '1.3rem' }}>🖼️</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Logo</h3>
          </div>
          <div>
            <label style={labelStyle}>Logo URL</label>
            <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
              placeholder="https://example.com/logo.png" style={inputStyle} />
            {form.logo && (
              <div style={{ marginTop: 14, padding: 16, background: '#0A0F1E', borderRadius: 10, textAlign: 'center', border: `1px solid ${C.border}` }}>
                <img src={form.logo} alt="Logo" style={{ maxWidth: 150, maxHeight: 80, objectFit: 'contain', borderRadius: 6 }} onError={() => { }} />
                <div style={{ fontSize: '0.75rem', color: C.textMuted, marginTop: 8 }}>Logo preview</div>
              </div>
            )}
          </div>
        </div>

        {/* Contact Details */}
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '1.3rem' }}>📞</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Contact Details</h3>
          </div>
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
                  placeholder="+91 999 999 9999" style={inputStyle} />
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
        <div style={sectionStyle}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
            <span style={{ fontSize: '1.3rem' }}>🌐</span>
            <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Social Media Links</h3>
          </div>
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
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 12 }}>
          <button onClick={handleSave} disabled={saving} style={{
            padding: '14px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
            border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
            cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
            transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)'
          }}>
            {saving ? '⏳ Saving...' : '💾 Save Changes'}
          </button>
        </div>
      </div>
    </div>
  )
}
