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
    <div style={{ marginBottom: 12 }}>
      <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>{label}</label>
      {rows > 0 ? (
        <textarea rows={rows} value={isSocial ? content.socialLinks?.[field] : content[field] || ''}
          onChange={e => isSocial
            ? setContent({ ...content, socialLinks: { ...content.socialLinks, [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })}
          placeholder={placeholder}
          style={{ width: '100%', padding: '7px 9px', border: '1px solid #334155', borderRadius: 5, fontSize: '.8rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical', background: '#0f172a', color: '#e2e8f0' }} />
      ) : (
        <input type={type} value={isSocial ? (content.socialLinks?.[field] || '') : (content[field] || '')}
          onChange={e => isSocial
            ? setContent({ ...content, socialLinks: { ...(content.socialLinks || {}), [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })}
          placeholder={placeholder}
          style={{ width: '100%', padding: '7px 9px', border: '1px solid #334155', borderRadius: 5, fontSize: '.8rem', outline: 'none', fontFamily: 'inherit', background: '#0f172a', color: '#e2e8f0' }}
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
    <div style={{ height: '100vh', background: '#0a0f1e', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
      {/* Top Bar - Fixed */}
      <div style={{ background: '#1e293b', borderBottom: '1px solid #334155', padding: '8px 12px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexShrink: 0 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <Link href="/dashboard/stores" style={{ color: '#94a3b8', textDecoration: 'none', fontSize: '.85rem' }}>←</Link>
          <div>
            <div style={{ fontSize: '.85rem', fontWeight: 700, color: '#e2e8f0' }}>{website.siteName}</div>
            <div style={{ fontSize: '.65rem', color: '#10b981', display: 'flex', alignItems: 'center', gap: 3 }}>
              <span style={{ width: 4, height: 4, borderRadius: '50%', background: '#10b981' }}></span>LIVE
            </div>
          </div>
        </div>
        <button onClick={save} disabled={saving} style={{ padding: '7px 16px', background: '#6366f1', color: '#fff', border: 'none', borderRadius: 5, fontSize: '.75rem', fontWeight: 700, cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.6 : 1 }}>
          {saving ? 'Syncing...' : '🔄 Sync'}
        </button>
      </div>

      {/* Main Content - 3 Columns */}
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Left - Sections */}
        <div style={{ width: 180, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 8px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '.62rem', fontWeight: 700, color: '#64748b', textTransform: 'uppercase', letterSpacing: '.03em' }}>CUSTOMIZATION</div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '6px' }}>
            {SECTIONS.map(s => (
              <button key={s.key} onClick={() => setActiveSection(s.key)}
                style={{ width: '100%', textAlign: 'left', padding: '7px 8px', borderRadius: 4, border: 'none', background: activeSection === s.key ? '#334155' : 'transparent', color: activeSection === s.key ? '#e2e8f0' : '#94a3b8', fontSize: '.75rem', fontWeight: activeSection === s.key ? 600 : 500, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 7, marginBottom: 1, transition: 'all 0.1s' }}>
                <span style={{ fontSize: '.8rem' }}>{s.icon}</span>
                {s.label}
              </button>
            ))}
          </div>
        </div>

        {/* Middle - Editor */}
        <div style={{ width: 320, background: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
          <div style={{ padding: '10px 12px', borderBottom: '1px solid #334155' }}>
            <div style={{ fontSize: '.8rem', fontWeight: 700, color: '#e2e8f0' }}>
              {SECTIONS.find(s => s.key === activeSection)?.icon} {SECTIONS.find(s => s.key === activeSection)?.label}
            </div>
          </div>
          <div style={{ flex: 1, overflowY: 'auto', padding: '12px' }}>

            {activeSection === 'general' && (
              <div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>Store Name</label>
                  <input value={website.siteName} onChange={e => setWebsite({ ...website, siteName: e.target.value })}
                    style={{ width: '100%', padding: '7px 9px', border: '1px solid #334155', borderRadius: 5, fontSize: '.8rem', outline: 'none', background: '#0f172a', color: '#e2e8f0' }} />
                </div>
                <div style={{ marginBottom: 12 }}>
                  <label style={{ display: 'block', fontSize: '.72rem', fontWeight: 600, color: '#94a3b8', marginBottom: 5 }}>Domain</label>
                  <div style={{ padding: '7px 9px', border: '1px solid #334155', borderRadius: 5, fontSize: '.75rem', color: '#64748b', background: '#0f172a' }}>
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
        <div style={{ flex: 1, background: '#0a0f1e', overflowY: 'auto' }}>
          <div style={{ padding: '12px' }}>
            {/* Preview Header */}
            <div style={{ background: '#1e293b', borderRadius: 6, padding: 10, marginBottom: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <div style={{ width: 28, height: 28, borderRadius: 5, background: 'linear-gradient(135deg,#6366f1,#8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>👁</div>
                <div>
                  <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#e2e8f0' }}>Live Preview</div>
                  <div style={{ fontSize: '.65rem', color: '#64748b' }}>Real-time</div>
                </div>
              </div>
              <div style={{ display: 'flex', gap: 5 }}>
                <Link href={`/store/${website.slug}`} target="_blank" style={{ padding: '5px 10px', background: '#334155', border: 'none', borderRadius: 4, color: '#e2e8f0', fontSize: '.7rem', fontWeight: 600, textDecoration: 'none' }}>
                  🌐 Live
                </Link>
                <button style={{ padding: '5px 10px', background: '#334155', border: 'none', borderRadius: 4, color: '#e2e8f0', fontSize: '.7rem', fontWeight: 600, cursor: 'pointer' }}>
                  📱 Mobile
                </button>
              </div>
            </div>

            {/* Browser Frame */}
            <div style={{ background: '#1e293b', borderRadius: 6, overflow: 'hidden', boxShadow: '0 6px 25px rgba(0,0,0,0.5)' }}>
              {/* Browser Bar */}
              <div style={{ background: '#0f172a', padding: '6px 10px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', gap: 6 }}>
                <div style={{ display: 'flex', gap: 3 }}>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#ef4444' }}></div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#f59e0b' }}></div>
                  <div style={{ width: 7, height: 7, borderRadius: '50%', background: '#10b981' }}></div>
                </div>
                <div style={{ flex: 1, background: '#1e293b', borderRadius: 3, padding: '3px 8px', fontSize: '.68rem', color: '#64748b' }}>
                  yourapp.com/store/{website.slug}
                </div>
              </div>

              {/* Preview Content */}
              <div style={{ background: '#fff', minHeight: 500, maxHeight: 'calc(100vh - 140px)', overflowY: 'auto' }}>
                {/* Announcement */}
                {content.announcement && (
                  <div style={{ background: content.primaryColor || '#6366f1', color: '#fff', padding: '8px 14px', textAlign: 'center', fontSize: '.78rem', fontWeight: 600 }}>
                    📣 {content.announcement}
                  </div>
                )}

                {/* Hero */}
                {content.heroImage ? (
                  <div style={{ position: 'relative', height: 300, background: `linear-gradient(rgba(0,0,0,0.4), rgba(0,0,0,0.4)), url(${content.heroImage})`, backgroundSize: 'cover', backgroundPosition: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: 20 }}>
                    <div>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 10, textShadow: '0 2px 8px rgba(0,0,0,0.3)' }}>
                        {content.heroTitle || 'Your Title'}
                      </h1>
                      <p style={{ fontSize: '1rem', opacity: 0.95 }}>
                        {content.heroSubtitle || 'Your subtitle'}
                      </p>
                      {content.buttonText && (
                        <button style={{ marginTop: 16, padding: '10px 24px', background: content.primaryColor || '#6366f1', color: '#fff', border: 'none', borderRadius: 6, fontSize: '.85rem', fontWeight: 700, cursor: 'pointer' }}>
                          {content.buttonText}
                        </button>
                      )}
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)', height: 250, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textAlign: 'center', padding: 20 }}>
                    <div>
                      <h1 style={{ fontSize: '2.2rem', fontWeight: 900, marginBottom: 10 }}>
                        {content.heroTitle || 'Your Title'}
                      </h1>
                      <p style={{ fontSize: '1rem', opacity: 0.9 }}>
                        {content.heroSubtitle || 'Add hero image'}
                      </p>
                    </div>
                  </div>
                )}

                {/* Content */}
                <div style={{ padding: '30px 20px' }}>
                  {/* Logo & Name */}
                  <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 30, paddingBottom: 20, borderBottom: '2px solid #f1f5f9' }}>
                    {content.logo && <img src={content.logo} alt="Logo" style={{ width: 60, height: 60, objectFit: 'contain', borderRadius: 6 }} />}
                    <div>
                      <h2 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#1e293b', marginBottom: 3 }}>{website.siteName}</h2>
                      <p style={{ fontSize: '.85rem', color: '#64748b' }}>Welcome</p>
                    </div>
                  </div>

                  {/* About */}
                  {content.aboutText && (
                    <div style={{ marginBottom: 30 }}>
                      <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>
                        {content.aboutTitle || '📖 About'}
                      </h3>
                      <div style={{ display: 'grid', gridTemplateColumns: content.aboutImage ? '1fr 1fr' : '1fr', gap: 20, alignItems: 'center' }}>
                        <p style={{ fontSize: '.9rem', color: '#475569', lineHeight: 1.6 }}>{content.aboutText}</p>
                        {content.aboutImage && <img src={content.aboutImage} alt="About" style={{ width: '100%', height: 200, objectFit: 'cover', borderRadius: 10 }} />}
                      </div>
                    </div>
                  )}

                  {/* Contact & Social */}
                  <div style={{ display: 'grid', gridTemplateColumns: (content.contactPhone || content.contactEmail) && (content.socialLinks?.facebook || content.socialLinks?.instagram) ? '1fr 1fr' : '1fr', gap: 20, marginBottom: 30 }}>
                    {(content.contactPhone || content.contactEmail || content.contactAddress) && (
                      <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>📞 Contact</h4>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                          {content.contactPhone && <div style={{ display: 'flex', gap: 8 }}><span>📱</span><span style={{ fontSize: '.85rem', color: '#475569' }}>{content.contactPhone}</span></div>}
                          {content.contactEmail && <div style={{ display: 'flex', gap: 8 }}><span>✉️</span><span style={{ fontSize: '.85rem', color: '#475569' }}>{content.contactEmail}</span></div>}
                          {content.contactAddress && <div style={{ display: 'flex', gap: 8 }}><span>📍</span><span style={{ fontSize: '.85rem', color: '#475569' }}>{content.contactAddress}</span></div>}
                        </div>
                      </div>
                    )}

                    {(content.socialLinks?.facebook || content.socialLinks?.instagram || content.socialLinks?.twitter) && (
                      <div style={{ background: '#f8fafc', padding: 20, borderRadius: 10, border: '1px solid #e2e8f0', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>Follow Us</h4>
                        <div style={{ display: 'flex', justifyContent: 'center', gap: 10 }}>
                          {content.socialLinks?.facebook && <a href={content.socialLinks.facebook} target="_blank" style={{ width: 40, height: 40, borderRadius: '50%', background: '#1877f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '1.2rem', fontWeight: 700 }}>f</a>}
                          {content.socialLinks?.instagram && <a href={content.socialLinks.instagram} target="_blank" style={{ width: 40, height: 40, borderRadius: '50%', background: 'linear-gradient(45deg,#f09433,#dc2743)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>📷</a>}
                          {content.socialLinks?.twitter && <a href={content.socialLinks.twitter} target="_blank" style={{ width: 40, height: 40, borderRadius: '50%', background: '#1da1f2', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', textDecoration: 'none', fontSize: '1.1rem' }}>🐦</a>}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Service */}
                  {(content.openingHours || content.amenities) && (
                    <div style={{ background: '#fff', padding: 20, borderRadius: 10, border: '2px solid #e2e8f0', marginBottom: 30 }}>
                      <h4 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#1e293b', marginBottom: 12 }}>🕰 Service</h4>
                      {content.openingHours && <div style={{ marginBottom: 8 }}><span style={{ fontSize: '.8rem', fontWeight: 700, color: '#64748b' }}>Hours: </span><span style={{ fontSize: '.8rem', color: '#475569' }}>{content.openingHours}</span></div>}
                      {content.amenities && <div><span style={{ fontSize: '.8rem', fontWeight: 700, color: '#64748b' }}>Amenities: </span><span style={{ fontSize: '.8rem', color: '#475569' }}>{content.amenities}</span></div>}
                    </div>
                  )}

                  {/* Footer */}
                  <div style={{ paddingTop: 20, borderTop: '2px solid #f1f5f9', textAlign: 'center' }}>
                    <p style={{ fontSize: '.8rem', color: '#94a3b8' }}>
                      {content.footerDesc || `© ${new Date().getFullYear()} ${website.siteName}`}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  )
}
