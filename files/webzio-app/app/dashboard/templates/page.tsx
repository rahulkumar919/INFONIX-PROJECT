'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../stores/authStore'

interface Template {
  _id: string
  name: string
  category: string
  icon: string
  desc: string
  color: string
  accentColor: string
  tags: string[]
  popular: boolean
  isActive: boolean
  previewImage?: string
  htmlCode?: string
  config?: any
}

interface Store {
  _id: string
  siteName: string
  slug: string
}

export default function TemplatesPage() {
  const router = useRouter()
  const { token } = useAuthStore()
  const [templates, setTemplates] = useState<Template[]>([])
  const [stores, setStores] = useState<Store[]>([])
  const [categories, setCategories] = useState<string[]>([])
  const [loading, setLoading] = useState(true)
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [showStoreSelector, setShowStoreSelector] = useState(false)
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
  const [showTemplateConfig, setShowTemplateConfig] = useState(false)
  const [templateConfigData, setTemplateConfigData] = useState<any>(null)
  const [showPreview, setShowPreview] = useState(false)
  const [previewTemplate, setPreviewTemplate] = useState<any>(null)
  const [storeForm, setStoreForm] = useState({
    siteName: '',
    slug: '',
    heroTitle: '',
    heroSubtitle: '',
    aboutTitle: '',
    aboutText: '',
    contactPhone: '',
    contactEmail: '',
    whatsappNumber: '',
    footerDesc: ''
  })

  useEffect(() => {
    async function loadData() {
      try {
        // Load templates from admin dashboard (only active templates)
        const templatesRes = await fetch('/api/admin/templates', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const templatesData = await templatesRes.json()
        if (templatesData.success) {
          // Filter only active templates
          const activeTemplates = templatesData.templates.filter((t: Template) => t.isActive)
          setTemplates(activeTemplates)
          const cats = Array.from(new Set(activeTemplates.map((t: Template) => t.category)))
          setCategories(cats as string[])
        }

        // Load user's stores
        const storesRes = await fetch('/api/websites', {
          headers: { Authorization: `Bearer ${token}` }
        })
        const storesData = await storesRes.json()
        if (storesData.success) {
          setStores(storesData.websites)
        }
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [token])

  const filtered = templates.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>🎨</div>
          <div style={{ color: '#64748b', fontSize: '.9rem' }}>Loading templates...</div>
        </div>
      </div>
    )
  }

  return (
    <div>
      <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .template-card { transition: transform .25s, box-shadow .25s; }
        .template-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(79,70,229,.12); }
        .template-card:hover .preview-overlay { opacity: 1 !important; }
      `}</style>

      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
          🎨 Templates
        </h1>
        <p style={{ color: '#64748b', fontSize: '.9rem' }}>
          Choose from {templates.length} professional templates. Pick one and your store goes live instantly.
        </p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍  Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 'min(240px, 100%)', background: '#fff', minWidth: '200px' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', ...categories].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, transition: 'all .2s',
                background: activeCategory === cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9',
                color: activeCategory === cat ? '#fff' : '#475569',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(79,70,229,.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
        Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
      </p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(240px, 100%), 1fr))', gap: 20 }}>
        {filtered.map(t => (
          <div key={t._id} className="template-card" style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #f0f0f0', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,.04)', transition: 'transform .25s, box-shadow .25s' }}>
            {/* Preview */}
            <div style={{ height: 140, background: t.previewImage ? '#f8f9fa' : (t.color || 'linear-gradient(135deg,#4f46e5,#7c3aed)'), display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', padding: 16, overflow: 'hidden' }}>
              {t.previewImage ? (
                <img
                  src={t.previewImage}
                  alt={t.name}
                  style={{
                    position: 'absolute',
                    inset: 0,
                    width: '100%',
                    height: '100%',
                    objectFit: 'cover',
                    objectPosition: 'top center'
                  }}
                  onError={(e) => {
                    // Fallback to website preview if image fails to load
                    e.currentTarget.style.display = 'none'
                    const previewDiv = e.currentTarget.nextElementSibling as HTMLElement
                    if (previewDiv) previewDiv.style.display = 'block'
                  }}
                />
              ) : null}

              {/* Website Preview (shown if no previewImage or image fails) */}
              <div style={{
                position: 'absolute',
                inset: 0,
                display: t.previewImage ? 'none' : 'block',
                transform: 'scale(0.25)',
                transformOrigin: 'top left',
                width: '400%',
                height: '400%',
                pointerEvents: 'none'
              }}>
                {(t as any).htmlCode ? (
                  // HTML Template Preview
                  <iframe
                    srcDoc={(t as any).htmlCode}
                    style={{ width: '100%', height: '100%', border: 'none', background: '#fff' }}
                    title={`${t.name} Preview`}
                    sandbox="allow-scripts"
                  />
                ) : (
                  // Visual Template Preview
                  <div style={{ width: '100%', height: '100%', background: '#fff' }}>
                    <VisualTemplatePreview template={t} />
                  </div>
                )}
              </div>

              {t.popular && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 800 }}>
                  🔥 Popular
                </div>
              )}
              {(t as any).htmlCode && (
                <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(99,102,241,.9)', color: '#fff', padding: '2px 8px', borderRadius: 20, fontSize: '.6rem', fontWeight: 800 }}>
                  HTML
                </div>
              )}
              <div style={{ position: 'absolute', top: 10, left: (t as any).htmlCode ? 60 : 10, background: 'rgba(255,255,255,.2)', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 700 }}>
                {t.category}
              </div>

              {/* Preview overlay on hover */}
              <div style={{
                position: 'absolute',
                inset: 0,
                background: 'rgba(0,0,0,0.7)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0,
                transition: 'opacity 0.3s ease',
                cursor: 'pointer'
              }}
                className="preview-overlay"
                onClick={(e) => {
                  e.preventDefault()
                  setPreviewTemplate(t)
                  setShowPreview(true)
                }}
              >
                <div style={{ color: '#fff', textAlign: 'center' }}>
                  <div style={{ fontSize: '1.5rem', marginBottom: '4px' }}>👁️</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 600 }}>Preview Website</div>
                </div>
              </div>
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '.78rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 12 }}>{t.desc}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                ))}
              </div>
              <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setPreviewTemplate(t)
                    setShowPreview(true)
                  }}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    background: 'linear-gradient(135deg,#10b981,#059669)',
                    color: '#fff',
                    borderRadius: 6,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                  }}
                >
                  👁️ Preview
                </button>
                <button
                  onClick={(e) => {
                    e.preventDefault()
                    setSelectedTemplate(t._id)
                    setTemplateConfigData(t)
                    setShowTemplateConfig(true)
                  }}
                  style={{
                    flex: 1,
                    textAlign: 'center',
                    padding: '8px',
                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                    color: '#fff',
                    borderRadius: 6,
                    border: 'none',
                    fontWeight: 600,
                    fontSize: '.75rem',
                    cursor: 'pointer',
                    boxShadow: '0 2px 8px rgba(79, 70, 229, 0.25)'
                  }}
                >
                  Use Template
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No templates found</div>
          <div style={{ fontSize: '.85rem' }}>Try a different search or category</div>
        </div>
      )}

      {/* Template Configuration Modal */}
      {showTemplateConfig && templateConfigData && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowTemplateConfig(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 600, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Configure Your Store</h2>
            <p style={{ color: '#64748b', fontSize: '.9rem', marginBottom: 24 }}>Fill in your store information to create your website with the {templateConfigData.name} template</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Store Name *</label>
                <input
                  type="text"
                  value={storeForm.siteName}
                  onChange={(e) => setStoreForm({ ...storeForm, siteName: e.target.value, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') })}
                  placeholder="My Awesome Store"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Domain Name *</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span style={{ color: '#64748b', fontSize: '.9rem' }}>localhost/</span>
                  <input
                    type="text"
                    value={storeForm.slug}
                    onChange={(e) => setStoreForm({ ...storeForm, slug: e.target.value.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').replace(/^-|-$/g, '') })}
                    placeholder="my-store"
                    style={{ flex: 1, padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Hero Title</label>
                <input
                  type="text"
                  value={storeForm.heroTitle}
                  onChange={(e) => setStoreForm({ ...storeForm, heroTitle: e.target.value })}
                  placeholder="Welcome to Our Store"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Hero Subtitle</label>
                <input
                  type="text"
                  value={storeForm.heroSubtitle}
                  onChange={(e) => setStoreForm({ ...storeForm, heroSubtitle: e.target.value })}
                  placeholder="Discover our amazing collection"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>About Title</label>
                <input
                  type="text"
                  value={storeForm.aboutTitle}
                  onChange={(e) => setStoreForm({ ...storeForm, aboutTitle: e.target.value })}
                  placeholder="About Us"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>About Text</label>
                <textarea
                  value={storeForm.aboutText}
                  onChange={(e) => setStoreForm({ ...storeForm, aboutText: e.target.value })}
                  placeholder="Tell customers about your business..."
                  rows={3}
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none', resize: 'vertical' }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
                <div>
                  <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Contact Phone</label>
                  <input
                    type="text"
                    value={storeForm.contactPhone}
                    onChange={(e) => setStoreForm({ ...storeForm, contactPhone: e.target.value })}
                    placeholder="+1 234 567 8900"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                  />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>WhatsApp Number</label>
                  <input
                    type="text"
                    value={storeForm.whatsappNumber}
                    onChange={(e) => setStoreForm({ ...storeForm, whatsappNumber: e.target.value })}
                    placeholder="919999999999"
                    style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                  />
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Contact Email</label>
                <input
                  type="email"
                  value={storeForm.contactEmail}
                  onChange={(e) => setStoreForm({ ...storeForm, contactEmail: e.target.value })}
                  placeholder="contact@mystore.com"
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '.9rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>Footer Description</label>
                <input
                  type="text"
                  value={storeForm.footerDesc}
                  onChange={(e) => setStoreForm({ ...storeForm, footerDesc: e.target.value })}
                  placeholder="Quality products delivered to you."
                  style={{ width: '100%', padding: '12px', border: '2px solid #e5e7eb', borderRadius: 8, fontSize: '.9rem', outline: 'none' }}
                />
              </div>
            </div>

            <div style={{ display: 'flex', gap: 12, marginTop: 24 }}>
              <button
                onClick={() => setShowTemplateConfig(false)}
                style={{
                  flex: 1,
                  padding: '12px',
                  background: '#f1f5f9',
                  border: 'none',
                  borderRadius: 10,
                  color: '#64748b',
                  fontWeight: 600,
                  cursor: 'pointer',
                  fontSize: '.9rem'
                }}
              >
                Cancel
              </button>
              <button
                onClick={async () => {
                  if (!storeForm.siteName || !storeForm.slug) {
                    alert('Please fill in store name and domain name')
                    return
                  }

                  try {
                    const response = await fetch('/api/websites', {
                      method: 'POST',
                      headers: {
                        'Content-Type': 'application/json',
                        Authorization: `Bearer ${token}`
                      },
                      body: JSON.stringify({
                        siteName: storeForm.siteName,
                        slug: storeForm.slug,
                        templateId: selectedTemplate,
                        content: {
                          heroTitle: storeForm.heroTitle || 'Welcome to Our Store',
                          heroSubtitle: storeForm.heroSubtitle || 'Discover our amazing collection',
                          aboutTitle: storeForm.aboutTitle || 'About Us',
                          aboutText: storeForm.aboutText || 'We are passionate about quality.',
                          contactPhone: storeForm.contactPhone,
                          contactEmail: storeForm.contactEmail,
                          whatsappNumber: storeForm.whatsappNumber,
                          footerDesc: storeForm.footerDesc || 'Quality products delivered to you.',
                          primaryColor: templateConfigData.color || '#3B82F6'
                        }
                      })
                    })

                    const data = await response.json()
                    if (data.success) {
                      setShowTemplateConfig(false)
                      // Reset form
                      setStoreForm({
                        siteName: '',
                        slug: '',
                        heroTitle: '',
                        heroSubtitle: '',
                        aboutTitle: '',
                        aboutText: '',
                        contactPhone: '',
                        contactEmail: '',
                        whatsappNumber: '',
                        footerDesc: ''
                      })
                      // Redirect to the new store
                      window.open(`/${data.website.slug}`, '_blank')
                      router.push('/dashboard/stores')
                    } else {
                      alert(data.message || 'Failed to create store')
                    }
                  } catch (error) {
                    console.error('Error creating store:', error)
                    alert('Failed to create store')
                  }
                }}
                style={{
                  flex: 2,
                  padding: '12px',
                  background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                  border: 'none',
                  borderRadius: 10,
                  color: '#fff',
                  fontWeight: 700,
                  cursor: 'pointer',
                  fontSize: '.9rem',
                  boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                }}
              >
                🚀 Create Store
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Store Selector Modal */}
      {showStoreSelector && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowStoreSelector(false)}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
            <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Select Store to Configure</h2>
            <p style={{ color: '#64748b', fontSize: '.9rem', marginBottom: 24 }}>Choose which store you want to configure with this template</p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {stores.map(store => (
                <Link
                  key={store._id}
                  href={`/dashboard/stores/${store._id}/edit`}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    padding: '16px',
                    border: '2px solid #e5e7eb',
                    borderRadius: 12,
                    textDecoration: 'none',
                    transition: 'all .2s',
                    background: '#fff'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = '#4f46e5'
                    e.currentTarget.style.background = '#f5f3ff'
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = '#e5e7eb'
                    e.currentTarget.style.background = '#fff'
                  }}
                >
                  <div>
                    <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{store.siteName}</div>
                    <div style={{ fontSize: '.75rem', color: '#64748b' }}>/{store.slug}</div>
                  </div>
                  <div style={{ fontSize: '1.2rem' }}>→</div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => setShowStoreSelector(false)}
              style={{
                marginTop: 20,
                width: '100%',
                padding: '12px',
                background: '#f1f5f9',
                border: 'none',
                borderRadius: 10,
                color: '#64748b',
                fontWeight: 600,
                cursor: 'pointer',
                fontSize: '.9rem'
              }}
            >
              Cancel
            </button>
          </div>
        </div>
      )}
      {/* Template Preview Modal */}
      {showPreview && previewTemplate && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(8px)' }} onClick={() => setShowPreview(false)}>
          <div style={{ background: '#fff', borderRadius: 20, maxWidth: '95vw', maxHeight: '95vh', width: '1200px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
            {/* Header */}
            <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
              <div>
                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>
                  {previewTemplate.icon} {previewTemplate.name}
                </h2>
                <p style={{ color: '#64748b', fontSize: '.9rem' }}>
                  {previewTemplate.htmlCode ? '💻 HTML Template' : '🎨 Visual Template'} • {previewTemplate.category}
                </p>
              </div>
              <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                <button
                  onClick={() => {
                    setShowPreview(false)
                    setSelectedTemplate(previewTemplate._id)
                    setTemplateConfigData(previewTemplate)
                    setShowTemplateConfig(true)
                  }}
                  style={{
                    padding: '10px 20px',
                    background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                    border: 'none',
                    borderRadius: 10,
                    color: '#fff',
                    fontWeight: 700,
                    fontSize: '.85rem',
                    cursor: 'pointer',
                    boxShadow: '0 4px 12px rgba(79, 70, 229, 0.3)'
                  }}
                >
                  🚀 Use This Template
                </button>
                <button
                  onClick={() => setShowPreview(false)}
                  style={{
                    padding: '8px 12px',
                    background: '#f1f5f9',
                    border: 'none',
                    borderRadius: 8,
                    color: '#64748b',
                    fontWeight: 600,
                    cursor: 'pointer',
                    fontSize: '1.1rem'
                  }}
                >
                  ✕
                </button>
              </div>
            </div>

            {/* Preview Content */}
            <div style={{ height: 'calc(95vh - 100px)', overflow: 'auto', background: '#f1f5f9' }}>
              {previewTemplate.htmlCode ? (
                // HTML Template Preview
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '8px 16px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 6, padding: '4px 12px', fontSize: '.8rem', color: '#64748b' }}>
                        🔒 localhost/{previewTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                      </div>
                    </div>
                    <iframe
                      srcDoc={previewTemplate.htmlCode}
                      style={{ width: '100%', height: '70vh', border: 'none' }}
                      title="Template Preview"
                      sandbox="allow-scripts allow-same-origin"
                    />
                  </div>
                </div>
              ) : (
                // Visual Template Preview
                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                  <div style={{ width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                    <div style={{ padding: '8px 16px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 8 }}>
                      <div style={{ display: 'flex', gap: 6 }}>
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                      </div>
                      <div style={{ flex: 1, background: '#f8fafc', borderRadius: 6, padding: '4px 12px', fontSize: '.8rem', color: '#64748b' }}>
                        🔒 localhost/{previewTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                      </div>
                    </div>
                    <div style={{ height: '70vh', overflow: 'auto' }}>
                      <VisualTemplatePreview template={previewTemplate} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

    </div>
  )
}

// Visual Template Preview Component
function VisualTemplatePreview({ template }: { template: any }) {
  const cfg = template.config || {}
  const headFont = cfg.headingFont || 'Playfair Display'
  const bodyFont = cfg.bodyFont || 'Inter'
  const fontSize = cfg.baseFontSize || 16
  const primary = cfg.primaryColor || template.accentColor || '#4F46E5'
  const secondary = cfg.secondaryColor || '#7C3AED'
  const textColor = cfg.textColor || '#111827'
  const bgLight = cfg.bgLight || '#FFFFFF'
  const bgDark = cfg.bgDark || '#0F172A'
  const cardBg = cfg.cardBg || '#F8FAFF'
  const isMinimal = cfg.navbarStyle === 'minimal'
  const isTransparent = cfg.navbarStyle === 'transparent'

  const fontUrl = `https://fonts.googleapis.com/css2?family=${headFont.replace(/ /g, '+')}:wght@700;900&family=${bodyFont.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`

  return (
    <div style={{ fontFamily: `'${bodyFont}',sans-serif`, fontSize: `${fontSize}px`, background: bgLight, color: textColor }}>
      <link href={fontUrl} rel="stylesheet" />

      {/* Navbar */}
      <nav style={{
        padding: '0 24px', height: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isTransparent ? 'transparent' : isMinimal ? bgLight : primary,
        borderBottom: isMinimal ? `1px solid ${primary}20` : 'none',
        position: cfg.navbarStyle === 'sticky' ? 'sticky' : 'relative',
        top: 0, zIndex: 10,
        boxShadow: isMinimal ? '0 1px 8px rgba(0,0,0,.06)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: isMinimal ? primary : 'rgba(255,255,255,.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>{template.icon || '⚡'}</div>
          <span style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1rem', color: isMinimal ? textColor : '#fff' }}>
            {template.name || 'Brand Name'}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {['Home', 'About', 'Services', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '.78rem', fontWeight: 500, color: isMinimal ? textColor : 'rgba(255,255,255,.85)', cursor: 'pointer' }}>{l}</span>
          ))}
          {cfg.showNavCTA && (
            <span style={{ fontSize: '.75rem', fontWeight: 700, padding: '7px 16px', borderRadius: 8, background: isMinimal ? primary : 'rgba(255,255,255,.18)', color: '#fff', border: isMinimal ? 'none' : '1px solid rgba(255,255,255,.3)', cursor: 'pointer' }}>
              {cfg.navCTAText || 'Get Started'}
            </span>
          )}
        </div>
      </nav>

      {/* Hero */}
      {cfg.sections?.hero !== false && (
        <section style={{
          padding: cfg.heroLayout === 'fullscreen' ? '80px 40px' : '60px 40px',
          background: cfg.heroBgImage
            ? `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url(${cfg.heroBgImage}) center/cover no-repeat`
            : `linear-gradient(135deg,${primary}18,${secondary}10,${bgLight})`,
          display: cfg.heroLayout === 'split' ? 'grid' : 'flex',
          gridTemplateColumns: cfg.heroLayout === 'split' ? '1fr 1fr' : undefined,
          flexDirection: cfg.heroLayout !== 'split' ? 'column' : undefined,
          alignItems: 'center',
          justifyContent: cfg.heroLayout !== 'split' ? 'center' : undefined,
          textAlign: cfg.heroLayout !== 'split' ? 'center' : 'left',
          gap: 32,
          color: cfg.heroBgImage ? '#fff' : textColor,
          minHeight: cfg.heroLayout === 'fullscreen' ? 320 : 240,
        }}>
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, background: `${primary}18`, color: primary, fontSize: '.72rem', fontWeight: 700, marginBottom: 16, border: `1px solid ${primary}25` }}>
              ✨ {template.category || 'Template'}
            </div>
            <h1 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.4rem)', lineHeight: 1.15, marginBottom: 14, color: cfg.heroBgImage ? '#fff' : textColor }}>
              {cfg.heroTitle || template.name || 'Welcome to Our Store'}
            </h1>
            <p style={{ fontSize: '.9rem', opacity: .75, marginBottom: 24, lineHeight: 1.7, maxWidth: 480 }}>
              {cfg.heroSubtitle || template.desc || 'Discover amazing products and services.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: cfg.heroLayout !== 'split' ? 'center' : 'flex-start' }}>
              <span style={{ padding: '10px 24px', borderRadius: 10, background: primary, color: '#fff', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', boxShadow: `0 4px 14px ${primary}40` }}>
                {cfg.heroCTAText || 'Explore Now'}
              </span>
              <span style={{ padding: '10px 24px', borderRadius: 10, border: `1.5px solid ${cfg.heroBgImage ? 'rgba(255,255,255,.4)' : primary}`, color: cfg.heroBgImage ? '#fff' : primary, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer' }}>
                Learn More
              </span>
            </div>
          </div>
          {cfg.heroLayout === 'split' && (
            <div style={{ background: `${primary}12`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: 200, border: `1px solid ${primary}20` }}>
              {template.icon || '🌐'}
            </div>
          )}
        </section>
      )}

      {/* Features */}
      {cfg.sections?.features !== false && (
        <section style={{ padding: '48px 40px', background: cardBg }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>Our Features</h2>
            <div style={{ width: 40, height: 3, background: primary, borderRadius: 2, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
            {[{ icon: '⚡', title: 'Fast & Reliable', desc: 'Built for speed and performance' }, { icon: '🎨', title: 'Beautiful Design', desc: 'Stunning visuals that convert' }, { icon: '📱', title: 'Mobile Ready', desc: 'Perfect on every device' }].map((f, i) => (
              <div key={i} style={{ padding: '20px', background: bgLight, borderRadius: 14, border: `1px solid ${primary}12`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.88rem', color: textColor, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: '.75rem', color: `${textColor}80`, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Services */}
      {cfg.sections?.services !== false && (
        <section style={{ padding: '48px 40px', background: bgLight }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>Our Services</h2>
            <div style={{ width: 40, height: 3, background: secondary, borderRadius: 2, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 14 }}>
            {[{ icon: '🛠️', title: 'Custom Solutions' }, { icon: '📊', title: 'Analytics' }, { icon: '🔒', title: 'Security' }, { icon: '🚀', title: 'Fast Delivery' }].map((s, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: '16px', background: cardBg, borderRadius: 12, border: `1px solid ${primary}10` }}>
                <div style={{ width: 40, height: 40, background: `${primary}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', flexShrink: 0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight: 700, fontSize: '.85rem', color: textColor }}>{s.title}</div>
                  <div style={{ fontSize: '.72rem', color: `${textColor}60`, marginTop: 2 }}>Professional service</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Footer */}
      {cfg.sections?.footer !== false && (
        <>
          <footer style={{ padding: '40px', background: bgDark }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 24, marginBottom: 32 }}>
              <div>
                <div style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1rem', color: '#fff', marginBottom: 10 }}>{template.name || 'Brand'}</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>Your trusted partner for quality products and services.</div>
              </div>
              {Array.from({ length: Math.min((cfg.footerColumns || 3) - 1, 3) }).map((_, i) => (
                <div key={i}>
                  <div style={{ fontSize: '.72rem', fontWeight: 800, color: 'rgba(255,255,255,.5)', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 12 }}>Links</div>
                  {['Link One', 'Link Two', 'Link Three'].map(l => (
                    <div key={l} style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)', marginBottom: 8, cursor: 'pointer' }}>{l}</div>
                  ))}
                </div>
              ))}
            </div>
          </footer>
          <div style={{ padding: '14px 40px', background: bgDark, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>{cfg.footerCopyright || '© 2026 All rights reserved.'}</span>
            <span style={{ fontSize: '.72rem', color: `${primary}80` }}>Powered by WebZio</span>
          </div>
        </>
      )}
    </div>
  )
}
