'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const SECTIONS = [
  { key: 'general', label: 'General', icon: '⚙️' },
  { key: 'hero', label: 'Hero', icon: '🖼' },
  { key: 'promotion', label: 'Promotion', icon: '📣' },
  { key: 'about', label: 'Our Story', icon: '📖' },
  { key: 'contact', label: 'Contact', icon: '📞' },
  { key: 'social', label: 'Social', icon: '📱' },
  { key: 'design', label: 'Design', icon: '🎨' },
  { key: 'service', label: 'Service', icon: '🕰' },
]

export default function StoreEditPage({ params }: { params: { storeId: string } }) {
  const { token } = useAuthStore()
  const router = useRouter()
  const [website, setWebsite] = useState<any>(null)
  const [content, setContent] = useState<any>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [activeSection, setActiveSection] = useState('general')
  const [previewMode, setPreviewMode] = useState<'live' | 'mobile'>('live')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`/api/websites/${params.storeId}`, { headers })
        const data = await res.json()
        if (!data.success) { router.push('/dashboard/stores'); return }
        setWebsite(data.website)
        setContent(data.website.content || {})
      } catch { router.push('/dashboard/stores') }
      setLoading(false)
    }
    load()
  }, [params.storeId])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/websites/${params.storeId}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ siteName: website.siteName, content }),
      })
      const data = await res.json()
      if (data.success) toast.success('✅ Saved!')
      else toast.error(data.message)
    } catch { toast.error('Failed') }
    finally { setSaving(false) }
  }

  const Field = ({ label, field, type = 'text', placeholder = '', rows = 0, isSocial = false }: any) => (
    <div style={{ marginBottom: 16 }}>
      <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>{label}</label>
      {rows > 0 ? (
        <textarea rows={rows} value={isSocial ? content.socialLinks?.[field] : content[field] || ''}
          onChange={e => isSocial
            ? setContent({ ...content, socialLinks: { ...content.socialLinks, [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid #334155', borderRadius: 8, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', background: '#0f172a', color: '#e2e8f0' }} />
      ) : (
        <input type={type} value={isSocial ? (content.socialLinks?.[field] || '') : (content[field] || '')}
          onChange={e => isSocial
            ? setContent({ ...content, socialLinks: { ...(content.socialLinks || {}), [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })}
          placeholder={placeholder}
          style={{ width: '100%', padding: '10px 14px', border: '1px solid #334155', borderRadius: 8, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit', background: '#0f172a', color: '#e2e8f0' }}
        />
      )}
    </div>
  )

  if (loading) return (
    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100vh', background: '#0a0f1e' }}>
      <div style={{ width: 35, height: 35, border: '3px solid #1e293b', borderTopColor: '#6366f1', borderRadius: '50%', animation: 'spin 0.7s linear infinite' }}></div>
    </div>
  )
  if (!website) return null

  return (
    <div style={{ height: '100vh', background: '#0f172a', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        input:focus, textarea:focus { border-color: #6366f1 !important; }
      `}</style>

      {/* Top Bar */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '12px 20px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Link href="/dashboard/stores" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '.9rem', display: 'flex', alignItems: 'center', gap: 6 }}>
            ← Back
          </Link>
          <div style={{ width: 1, height: 20, background: '#334155' }}></div>
          <div>
            <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#e2e8f0' }}>{website.siteName}</div>
            <div style={{ fontSize: '.7rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 4 }}>
              <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981' }}></span>LIVE
            </div>
          </div>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '10px 24px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 8, fontSize: '.85rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? '🔄 Syncing...' : '🔄 Sync'}
        </button>
      </div>

      {/* Main Content */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left Sidebar - Sections */}
        <div style={{ width: 240, background: '#1a1f2e', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '.7rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.05em' }}>CUSTOMIZATION</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                style={{ width: '100%', textAlign: 'left', padding: '12px 14px', borderRadius: 8, border: 'none', background: activeSection === s.key ? '#6366f1' : 'transparent', color: activeSection === s.key ? '#fff' : '#94a3b8', fontSize: '.85rem', fontWeight: activeSection === s.key ? 600 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, transition: 'all 0.15s' }}>
                <span style={{ fontSize: '1.1rem' }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle - Editor */}
        <div style={{ width: 400, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #334155' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: '1.2rem' }}>{SECTIONS.find(s => s.key === activeSection)?.icon}</span>
              <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#e2e8f0' }}>
                {SECTIONS.find(s => s.key === activeSection)?.label}
              </div>
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '20px' }}>

            {activeSection === 'general' && (
              <div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Store Name</label>
                  <input value={website.siteName} onChange={e => setWebsite({ ...website, siteName: e.target.value })}
                    style={{ width: '100%', padding: '10px 14px', border: '1px solid #334155', borderRadius: 8, fontSize: '.85rem', outline: 'none', background: '#0f172a', color: '#e2e8f0' }} />
                </div>
                <div style={{ marginBottom: 16 }}>
                  <label style={{ display: 'block', fontSize: '.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 8 }}>Domain</label>
                  <div style={{ padding: '10px 14px', border: '1px solid #334155', borderRadius: 8, fontSize: '.8rem', color: '#64748b', background: '#0f172a' }}>
                    yourapp.com/store/<span style={{ color: '#6366f1' }}>{website.slug}</span>
                  </div>
                </div>
                <Field label="WhatsApp" field="whatsappNumber" placeholder="919999999999" />
                <Field label="Primary Color" field="primaryColor" placeholder="#6366f1" />
                <Field label="Button Text" field="buttonText" placeholder="Book Now" />
              </div>
            )}

            {activeSection === 'hero' && (
              <div>
                <Field label="Hero Title" field="heroTitle" placeholder="Welcome" />
                <Field label="Subtitle" field="heroSubtitle" rows={2} placeholder="Tagline..." />
                <Field label="Hero Image URL" field="heroImage" placeholder="https://..." />
                <Field label="Logo URL" field="logo" placeholder="https://..." />
              </div>
            )}

            {activeSection === 'promotion' && (
              <div>
                <Field label="Announcement" field="announcement" rows={2} placeholder="Special offer..." />
              </div>
            )}

            {activeSection === 'about' && (
              <div>
                <Field label="Title" field="aboutTitle" placeholder="Our Story" />
                <Field label="Description" field="aboutText" rows={4} placeholder="Tell your story..." />
                <Field label="Image URL" field="aboutImage" placeholder="https://..." />
              </div>
            )}

            {activeSection === 'contact' && (
              <div>
                <Field label="Phone" field="contactPhone" placeholder="+91 00000 00000" />
                <Field label="Email" field="contactEmail" type="email" placeholder="contact@store.com" />
                <Field label="Address" field="contactAddress" rows={2} placeholder="Address..." />
              </div>
            )}

            {activeSection === 'social' && (
              <div>
                <Field label="Instagram" field="instagram" isSocial={true} placeholder="https://instagram.com/..." />
                <Field label="Twitter" field="twitter" isSocial={true} placeholder="https://twitter.com/..." />
                <Field label="Facebook" field="facebook" isSocial={true} placeholder="https://facebook.com/..." />
              </div>
            )}

            {activeSection === 'design' && (
              <div>
                <Field label="Primary Color" field="primaryColor" placeholder="#6366f1" />
                <Field label="Secondary Color" field="secondaryColor" placeholder="#f9f9f9" />
                <Field label="Footer Text" field="footerDesc" rows={2} placeholder="© 2024" />
              </div>
            )}

            {activeSection === 'service' && (
              <div>
                <Field label="Hours" field="openingHours" placeholder="Mon-Sun: 9 AM - 11 PM" />
                <Field label="Amenities" field="amenities" rows={2} placeholder="WiFi, Parking..." />
              </div>
            )}

          </div>
        </div>

        {/* Right - Preview */}
        <div style={{ flex: 1, background: '#0f172a', overflowY: 'auto', display: 'flex', flexDirection: 'column' }}>
          {/* Preview Header */}
          <div style={{ background: '#1e293b', padding: '16px 20px', borderBottom: '1px solid #334155', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
            <div>
              <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#e2e8f0', marginBottom: 4 }}>Live Preview</div>
              <div style={{ fontSize: '.7rem', color: '#64748b' }}>Real-time</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => setPreviewMode('live')} style={{ padding: '8px 16px', background: previewMode === 'live' ? '#6366f1' : '#334155', border: 'none', borderRadius: 6, color: '#fff', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>
                🌐 Live
              </button>
              <button onClick={() => setPreviewMode('mobile')} style={{ padding: '8px 16px', background: previewMode === 'mobile' ? '#6366f1' : '#334155', border: 'none', borderRadius: 6, color: '#fff', fontSize: '.75rem', fontWeight: 600, cursor: 'pointer' }}>
                📱 Mobile
              </button>
            </div>
          </div>

          {/* Browser Frame */}
          <div style={{ flex: 1, padding: '20px', display: 'flex', justifyContent: 'center', alignItems: 'flex-start' }}>
            <div style={{ width: previewMode === 'mobile' ? '375px' : '100%', maxWidth: '100%', background: '#1e293b', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.5)' }}>
              {/* Browser Bar */}
              <div style={{ background: '#0f172a', padding: '8px 12px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ display: 'flex', gap: 4 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 4, padding: '4px 10px', fontSize: '.7rem', color: '#64748b' }}>
                  🔒 yourapp.com/store/{website.slug}
                </div>
              </div>

              {/* Preview Content */}
              <div style={{ background: content.primaryColor || '#6366f1', minHeight: 400, maxHeight: 600, overflowY: 'auto' }}>
                <div style={{ padding: '60px 40px', textAlign: 'center', color: '#fff' }}>
                  <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 16 }}>
                    Welcome to
                  </h1>
                  <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 20 }}>
                    {website.siteName}
                  </h2>
                  <p style={{ fontSize: '1.1rem', opacity: 0.9, marginBottom: 32 }}>
                    Start shopping our amazing collection now.
                  </p>
                  {content.buttonText && (
                    <button style={{ padding: '14px 32px', background: '#fff', color: content.primaryColor || '#6366f1', border: 'none', borderRadius: 8, fontSize: '.95rem', fontWeight: 700, cursor: 'pointer' }}>
                      {content.buttonText}
                    </button>
                  )}
                </div>

                <div style={{ background: '#fff', padding: '40px', minHeight: 300 }}>
                  <div style={{ maxWidth: 800, margin: '0 auto' }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, color: '#0f172a', marginBottom: 12 }}>{website.siteName}</h3>
                    <p style={{ fontSize: '.95rem', color: '#64748b' }}>Welcome</p>

                    {content.aboutText && (
                      <div style={{ marginTop: 40 }}>
                        <h4 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#0f172a', marginBottom: 16 }}>Our Story</h4>
                        <p style={{ fontSize: '.95rem', color: '#475569', lineHeight: 1.7 }}>{content.aboutText}</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
