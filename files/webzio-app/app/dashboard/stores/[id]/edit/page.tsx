'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const SECTIONS = [
  { key: 'general',  label: '⚙️ General',     icon: '⚙️' },
  { key: 'hero',     label: '🖼 Hero & Visuals', icon: '🖼' },
  { key: 'announcement', label: '📣 Promotion', icon: '📣' },
  { key: 'about',    label: '📖 Our Story',    icon: '📖' },
  { key: 'contact',  label: '📞 Contact Details', icon: '📞' },
  { key: 'social',   label: '📱 Social Links',  icon: '📱' },
  { key: 'branding', label: '🎨 Design Identity', icon: '🎨' },
  { key: 'hospitality', label: '🕰 Service Intel', icon: '🕰' },
  { key: 'seo',      label: '🔍 Marketing / SEO', icon: '🔍' },
]

export default function StoreEditPage({ params }: { params: { id: string } }) {
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
        const res = await fetch(`/api/websites/${params.id}`, { headers })
        const data = await res.json()
        if (!data.success) { router.push('/dashboard/stores'); return }
        setWebsite(data.website)
        setContent(data.website.content || {})
      } catch { router.push('/dashboard/stores') }
      setLoading(false)
    }
    load()
  }, [params.id])

  async function save() {
    setSaving(true)
    try {
      const res = await fetch(`/api/websites/${params.id}`, {
        method: 'PUT', headers,
        body: JSON.stringify({ siteName: website.siteName, content }),
      })
      const data = await res.json()
      if (data.success) toast.success('Store configuration synced! ✅')
      else toast.error(data.message)
    } catch { toast.error('Failed to sync changes') }
    finally { setSaving(false) }
  }

  const Field = ({ label, field, type = 'text', placeholder = '', rows = 0, isSocial = false }: any) => (
    <div style={{ marginBottom: 24 }}>
      <label style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#334155', marginBottom:8 }}>{label}</label>
      {rows > 0 ? (
        <textarea rows={rows} value={isSocial ? content.socialLinks?.[field] : content[field] || ''} 
          onChange={e => isSocial 
            ? setContent({ ...content, socialLinks: { ...content.socialLinks, [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })} 
          placeholder={placeholder}
          style={{ width:'100%', padding:'14px 18px', border:'1.5px solid #e2e8f0', borderRadius:12, fontSize:'.92rem', outline:'none', fontFamily:'inherit', resize:'vertical', lineHeight:1.6, background: '#fcfcfd' }}
          onFocus={e => (e.target.parentElement!.style.borderLeft='3px solid #6366f1')} onBlur={e => (e.target.parentElement!.style.borderLeft='none')} />
      ) : (
        <input type={type} value={isSocial ? (content.socialLinks?.[field] || '') : (content[field] || '')} 
          onChange={e => isSocial 
            ? setContent({ ...content, socialLinks: { ...(content.socialLinks || {}), [field]: e.target.value } })
            : setContent({ ...content, [field]: e.target.value })} 
          placeholder={placeholder}
          style={{ width:'100%', padding:'14px 18px', border:'1.5px solid #e2e8f0', borderRadius:12, fontSize:'.92rem', outline:'none', fontFamily:'inherit', background: '#fcfcfd' }}
        />
      )}
    </div>
  )

  if (loading) return (
    <div style={{ display:'flex', alignItems:'center', justifyContent:'center', height:'60vh', flexDirection:'column', gap:16 }}>
      <div className="spinner" style={{ width:32, height:32, borderTopColor:'#6366f1' }}></div>
      <p style={{ color:'#94a3b8', fontWeight:500 }}>Initializing editor engine...</p>
    </div>
  )
  if (!website) return null

  return (
    <div>
      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:32, background:'#fff', padding:'16px 24px', borderRadius:16, border:'1px solid #f0f0f2', boxShadow:'0 2px 10px rgba(0,0,0,0.02)' }}>
        <div style={{ display:'flex', alignItems:'center', gap:16 }}>
          <Link href="/dashboard/stores" style={{ width:36, height:36, borderRadius:10, background:'#f1f5f9', display:'flex', alignItems:'center', justifyContent:'center', textDecoration:'none', color:'#475569', fontSize:'1.1rem' }}>←</Link>
          <div>
            <h1 style={{ fontSize:'1.1rem', fontWeight:900, color:'#1e293b' }}>{website.siteName}</h1>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginTop:2 }}>
              <div style={{ width:6, height:6, borderRadius:'50%', background:'#10b981' }}></div>
              <span style={{ fontSize:'.72rem', color:'#10b981', fontWeight:700, textTransform:'uppercase' }}>Live Production</span>
            </div>
          </div>
        </div>
        <div style={{ display:'flex', gap:12 }}>
          <Link href={`/store/${website.slug}`} target="_blank" style={{ padding:'10px 20px', border:'1.5px solid #e2e8f0', borderRadius:10, textDecoration:'none', color:'#475569', fontSize:'0.85rem', fontWeight:700 }}>
            👁 Live Preview
          </Link>
          <button onClick={save} disabled={saving} style={{ padding:'10px 24px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:10, fontSize:'0.85rem', fontWeight:800, cursor:'pointer', display:'flex', alignItems:'center', gap:8, boxShadow:'0 4px 12px rgba(99,102,241,0.2)' }}>
            {saving ? 'Syncing...' : '💾 Sync Changes'}
          </button>
        </div>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'240px 1fr', gap:32 }}>
        {/* Navigation */}
        <div style={{ background:'#fff', border:'1px solid #f0f0f2', borderRadius:20, padding:14, height:'fit-content', position:'sticky', top:40 }}>
          <p style={{ fontSize:'.7rem', fontWeight:800, color:'#94a3b8', textTransform:'uppercase', letterSpacing:'.1em', padding:'0 12px 12px' }}>Customization</p>
          {SECTIONS.map(s => (
            <button key={s.key} onClick={() => setActiveSection(s.key)}
              style={{ width:'100%', textAlign:'left', padding:'12px 14px', borderRadius:12, border:'none', background:activeSection===s.key?'#f0f0ff':'transparent', color:activeSection===s.key?'#6366f1':'#475569', fontSize:'.88rem', fontWeight:activeSection===s.key?700:500, cursor:'pointer', marginBottom:4, display:'flex', alignItems:'center', gap:10, transition:'all 0.2s' }}>
              <span style={{ fontSize:'1.1rem' }}>{s.icon}</span>
              {s.label.split(' ')[1] || s.label}
            </button>
          ))}
          <div style={{ marginTop:16, paddingTop:16, borderTop:'1px solid #f1f5f9' }}>
            <Link href={`/dashboard/products?store=${params.id}`} style={{ display:'flex', alignItems:'center', gap:10, padding:'12px 14px', borderRadius:12, color:'#475569', textDecoration:'none', fontSize:'.88rem', fontWeight:500 }}>
              <span>🍽️</span> Menu / Catalog
            </Link>
          </div>
        </div>

        {/* Editor Panel */}
        <div style={{ background:'#fff', border:'1px solid #f0f0f2', borderRadius:24, padding:40, boxShadow:'0 4px 25px rgba(0,0,0,0.02)' }}>

          {activeSection === 'general' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem', color:'#1e293b' }}>⚙️ General Settings</h2></div>
              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#334155', marginBottom:8 }}>Store Name</label>
                <input value={website.siteName} onChange={e => setWebsite({ ...website, siteName: e.target.value })}
                  style={{ width:'100%', padding:'14px 18px', border:'1.5px solid #e2e8f0', borderRadius:12, fontSize:'.92rem', outline:'none', fontFamily:'inherit', background:'#fcfcfd' }} />
              </div>
              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#334155', marginBottom:8 }}>Domain Routing</label>
                <div style={{ padding:'14px 18px', border:'1.5px solid #f1f5f9', borderRadius:12, fontSize:'.9rem', color:'#64748b', background:'#f8fafc', fontWeight:600 }}>
                  yourapp.com/store/<span style={{ color:'#6366f1' }}>{website.slug}</span>
                </div>
              </div>
              <Field label="Contact WhatsApp (with 91 prefix)" field="whatsappNumber" placeholder="919999999999" />
              <Field label="Brand Primary Color" field="primaryColor" placeholder="#6366f1" />
              <Field label="CTA Button Text" field="buttonText" placeholder="Reserve Table / Book Now" />
              <div style={{ marginBottom:28 }}>
                <label style={{ display:'block', fontSize:'.85rem', fontWeight:700, color:'#334155', marginBottom:8 }}>Typography Aura</label>
                <select value={content.fontFamily} onChange={e => setContent({ ...content, fontFamily: e.target.value })} style={{ width:'100%', padding:'14px 18px', border:'1.5px solid #e2e8f0', borderRadius:12, fontSize:'.92rem', background:'#fcfcfd', outline:'none' }}>
                  <option value="Playfair Display">Classical Elegance (Serif)</option>
                  <option value="Inter">Modern Minimalist (Sans)</option>
                  <option value="Montserrat">Bold Digital (Sans)</option>
                  <option value="Lora">Cozy Journal (Serif)</option>
                </select>
              </div>
              <Field label="Footer Brand Text" field="footerDesc" rows={2} placeholder="Briefly describe your brand identity..." />
            </div>
          )}

          {activeSection === 'hero' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>🖼 Hero & Visuals</h2></div>
              <Field label="Main Catchphrase" field="heroTitle" placeholder="Welcome to Our Store" />
              <Field label="Sub-headline" field="heroSubtitle" rows={3} placeholder="Tell them why you are special..." />
              <Field label="Banner Image URL" field="heroImage" placeholder="https://images.unsplash.com/..." />
              <Field label="Brand Logo URL" field="logo" placeholder="https://..." />
            </div>
          )}

          {activeSection === 'announcement' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>📣 Store Announcement</h2></div>
              <Field label="Top Bar Text" field="announcement" rows={2} placeholder="Limited time offer! Free shipping on orders over ₹999" />
              <p style={{ fontSize:'.8rem', color:'#94a3b8' }}>This appears at the very top of your store page.</p>
            </div>
          )}

          {activeSection === 'about' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>📖 Our Story Content</h2></div>
              <Field label="About Heading" field="aboutTitle" placeholder="The Journey Behind our Brand" />
              <Field label="Brand Narrative" field="aboutText" rows={6} placeholder="How did you start? What is your mission?" />
              <Field label="About Showcase Image" field="aboutImage" placeholder="https://..." />
            </div>
          )}

          {activeSection === 'contact' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>📞 Customer Relations</h2></div>
              <Field label="Support Phone" field="contactPhone" placeholder="+91 00000 00000" />
              <Field label="Support Email" field="contactEmail" type="email" placeholder="support@brand.com" />
              <Field label="Business Address" field="contactAddress" rows={2} placeholder="Office location or warehouse address..." />
            </div>
          )}

          {activeSection === 'social' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>📱 Online Presence</h2></div>
              <Field label="Instagram Profile Link" field="instagram" isSocial={true} placeholder="https://instagram.com/yourhandle" />
              <Field label="X / Twitter Profile Link" field="twitter" isSocial={true} placeholder="https://twitter.com/yourhandle" />
              <Field label="Facebook Page Link" field="facebook" isSocial={true} placeholder="https://facebook.com/yourpage" />
            </div>
          )}

          {activeSection === 'branding' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>🎨 Brand Aura</h2></div>
              <Field label="Primary Global Tone" field="primaryColor" placeholder="#c2410c" />
              <Field label="Secondary Accent Color" field="secondaryColor" placeholder="#f9f9f9" />
              <p style={{ fontSize:'.82rem', color:'#94a3b8', lineHeight:1.6 }}>Changing these will update the overall theme color, background highlights, and accent points throughout the interface.</p>
            </div>
          )}

          {activeSection === 'hospitality' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>🕰 Service Intelligence</h2></div>
              <Field label="Operational Hours" field="openingHours" placeholder="Mon-Sun: 9:00 AM - 11:00 PM" />
              <Field label="Property Amenities" field="amenities" rows={3} placeholder="Free WiFi, AC, Parking, Room Service, etc." />
              <p style={{ fontSize:'.82rem', color:'#94a3b8', lineHeight:1.6 }}>These details are specifically optimized for Restaurant and Hotel templates to provide necessary information to guests.</p>
            </div>
          )}

          {activeSection === 'seo' && (
            <div>
              <div style={{ marginBottom:32 }}><h2 style={{ fontWeight:900, fontSize:'1.25rem' }}>🔍 Search Engine Optimization</h2></div>
              <Field label="Meta Title Tag" field="seoTitle" placeholder="Premium Fashion | Your Brand Name" />
              <Field label="Meta Description" field="seoDescription" rows={4} placeholder="Summarize your store for Google (150-160 chars)..." />
              <div style={{ background:'#f0f9ff', border:'1px solid #bae6fd', borderRadius:16, padding:20, fontSize:'.85rem', color:'#0369a1', lineHeight:1.6, display:'flex', gap:12 }}>
                <span>💡</span>
                <div>
                  <strong>Pro Tip:</strong> Meta titles and descriptions are crucial for ranking. Use keywords that your customers are likely to search for.
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  )
}
