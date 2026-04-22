'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'
import { ALL_TEMPLATES, TEMPLATE_CATEGORIES } from '../../../lib/templates'

export default function StoresPage() {
  const { token } = useAuthStore()
  const searchParams = useSearchParams()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ siteName: '', templateId: 1 })
  const [deleting, setDeleting] = useState<string | null>(null)
  const [templateSearch, setTemplateSearch] = useState('')
  const [templateCategory, setTemplateCategory] = useState('All')

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function loadStores() {
    try {
      const res = await fetch('/api/websites', { headers })
      const data = await res.json()
      if (data.success) setStores(data.websites)
    } catch { }
    setLoading(false)
  }

  useEffect(() => {
    loadStores()

    // Check URL params for template pre-selection
    const openModal = searchParams.get('openModal')
    const templateId = searchParams.get('template')

    if (openModal === 'true') {
      setShowModal(true)
      if (templateId) {
        const tid = parseInt(templateId)
        if (!isNaN(tid)) {
          setForm(prev => ({ ...prev, templateId: tid }))
        }
      }
    }
  }, [])

  async function createStore(e: React.FormEvent) {
    e.preventDefault()
    if (!form.siteName.trim()) { toast.error('Name required'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/websites', { method: 'POST', headers, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.success) {
        if (data.needsUpgrade) {
          toast.error('🔒 ' + data.message, { duration: 5000 })
        } else {
          toast.error(data.message)
        }
        return
      }
      toast.success('Store deployed successfully! 🚀')
      setShowModal(false)
      setForm({ siteName: '', templateId: 1 })
      loadStores()
    } catch { toast.error('Deployment failed') }
    finally { setCreating(false) }
  }

  async function deleteStore(id: string) {
    if (!confirm('Termination request: All stored data for this hub will be purged. Continue?')) return
    setDeleting(id)
    try {
      const res = await fetch(`/api/websites/${id}`, { method: 'DELETE', headers })
      const data = await res.json()
      if (data.success) { toast.success('Hub terminated'); loadStores() }
      else toast.error(data.message)
    } catch { toast.error('Termination failed') }
    finally { setDeleting(null) }
  }

  const filteredTemplates = ALL_TEMPLATES.filter(t => {
    const matchCat = templateCategory === 'All' || t.category === templateCategory
    const matchSearch = t.name.toLowerCase().includes(templateSearch.toLowerCase()) || t.category.toLowerCase().includes(templateSearch.toLowerCase())
    return matchCat && matchSearch
  })

  const selectedTemplate = ALL_TEMPLATES.find(t => t.id === form.templateId)

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-0.02em' }}>My Stores</h1>
          <p style={{ color: '#64748b', fontSize: '0.95rem' }}>Create and manage your online stores</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'translateY(-2px)'
            e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'translateY(0)'
            e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}
        >
          <span style={{ fontSize: '1.1rem' }}>+</span> New Store
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '100px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚙️</div>
          <div style={{ fontSize: '0.95rem', fontWeight: 600 }}>Loading your stores...</div>
          <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
        </div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '80px 40px', background: '#fff', borderRadius: 20, border: '2px dashed #e2e8f0', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
          <div style={{ fontSize: '3.5rem', marginBottom: 20 }}>🏪</div>
          <h3 style={{ fontWeight: 800, marginBottom: 10, fontSize: '1.3rem', color: '#0f172a' }}>No stores yet</h3>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.95rem', maxWidth: 400, margin: '0 auto 32px' }}>Create your first online store and start selling in minutes</p>
          <button onClick={() => setShowModal(true)} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer', fontSize: '0.95rem', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s' }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(59, 130, 246, 0.4)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 14px rgba(59, 130, 246, 0.3)'
            }}
          >
            Create Your First Store
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 20 }}>
          {stores.map(store => (
            <div key={store._id} style={{ background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 16, overflow: 'hidden', display: 'flex', flexDirection: 'column', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(0,0,0,0.04)' }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = '#3B82F6'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <div style={{ height: 100, background: 'linear-gradient(135deg, #3B82F6, #2563EB)', padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ background: 'rgba(255,255,255,0.15)', color: '#fff', fontSize: '0.7rem', fontWeight: 800, padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>T-{store.templateId}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(34,197,94,0.2)', color: '#fff', padding: '4px 10px', borderRadius: 50, fontSize: '0.7rem', fontWeight: 800, backdropFilter: 'blur(4px)' }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#22c55e', animation: 'pulse 2s infinite' }}></div>
                  LIVE
                </div>
              </div>
              <div style={{ padding: 20, flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 8, color: '#0f172a' }}>{store.siteName}</h3>
                <div style={{ fontSize: '0.85rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: '0.9rem' }}>🔗</span> store/{store.slug}
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Views</div>
                    <div style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a' }}>{store.views || 0}</div>
                  </div>
                  <div style={{ background: '#f8fafc', padding: 12, borderRadius: 10, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.65rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 4 }}>Status</div>
                    <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#22c55e' }}>Active</div>
                  </div>
                </div>

                <div style={{ display: 'flex', gap: 8, marginTop: 'auto' }}>
                  <Link href={`/dashboard/stores/${store._id}/edit`} style={{ flex: 1, padding: '10px', background: '#f1f5f9', color: '#475569', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s', border: '1px solid #e2e8f0' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#e2e8f0'
                      e.currentTarget.style.color = '#0f172a'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#f1f5f9'
                      e.currentTarget.style.color = '#475569'
                    }}
                  >⚙️ Edit</Link>
                  <Link href={`/store/${store.slug}`} target="_blank" style={{ flex: 1, padding: '10px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', borderRadius: 8, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center', transition: 'all 0.2s', boxShadow: '0 2px 8px rgba(59, 130, 246, 0.3)' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.boxShadow = '0 4px 12px rgba(59, 130, 246, 0.4)'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.boxShadow = '0 2px 8px rgba(59, 130, 246, 0.3)'
                    }}
                  >🚀 View</Link>
                  <button onClick={() => deleteStore(store._id)} disabled={deleting === store._id} style={{ padding: '10px 12px', background: '#fee2e2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: 8, fontWeight: 700, cursor: 'pointer', fontSize: '0.9rem', transition: 'all 0.2s' }}
                    onMouseEnter={e => {
                      e.currentTarget.style.background = '#fecaca'
                    }}
                    onMouseLeave={e => {
                      e.currentTarget.style.background = '#fee2e2'
                    }}
                  >{deleting === store._id ? '...' : '🗑'}</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 28, width: '100%', maxWidth: 900, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Deploy New Entity</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={createStore} style={{ padding: 40, maxHeight: 'calc(90vh - 100px)', overflowY: 'auto' }}>
              <div style={{ marginBottom: 32 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>Entity Name</label>
                <input type="text" required autoFocus value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} placeholder="e.g. Neo-Matrix Store" style={{ width: '100%', padding: '16px 20px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem', outline: 'none' }} />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 16, textTransform: 'uppercase' }}>Visual Architecture</label>

                {/* Search & Filter */}
                <div style={{ display: 'flex', gap: 12, marginBottom: 20, flexWrap: 'wrap' }}>
                  <input
                    type="text"
                    placeholder="🔍 Search templates..."
                    value={templateSearch}
                    onChange={e => setTemplateSearch(e.target.value)}
                    style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.85rem', outline: 'none', flex: '1 1 200px', background: '#fff' }}
                  />
                </div>

                {/* Category Pills */}
                <div style={{ display: 'flex', gap: 8, marginBottom: 20, flexWrap: 'wrap' }}>
                  {['All', ...TEMPLATE_CATEGORIES].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setTemplateCategory(cat)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: 50,
                        border: 'none',
                        cursor: 'pointer',
                        fontSize: '.75rem',
                        fontWeight: 700,
                        transition: 'all .2s',
                        background: templateCategory === cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9',
                        color: templateCategory === cat ? '#fff' : '#475569',
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Template Grid */}
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, maxHeight: '350px', overflowY: 'auto', padding: '4px', marginBottom: 20 }}>
                  {filteredTemplates.map(t => (
                    <div
                      key={t.id}
                      onClick={() => setForm({ ...form, templateId: t.id })}
                      style={{
                        padding: '14px 10px',
                        border: form.templateId === t.id ? '2px solid #6366f1' : '1.5px solid #e2e8f0',
                        borderRadius: 14,
                        cursor: 'pointer',
                        textAlign: 'center',
                        background: form.templateId === t.id ? '#f5f3ff' : '#fff',
                        transition: 'all 0.2s',
                        position: 'relative'
                      }}
                    >
                      {t.popular && (
                        <div style={{ position: 'absolute', top: 6, right: 6, background: '#f59e0b', color: '#fff', padding: '2px 6px', borderRadius: 50, fontSize: '0.55rem', fontWeight: 800 }}>
                          🔥
                        </div>
                      )}
                      <div style={{ fontSize: '1.8rem', marginBottom: 6 }}>{t.icon}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 800, color: form.templateId === t.id ? '#6366f1' : '#1e293b', marginBottom: 3, lineHeight: 1.3 }}>{t.name}</div>
                      <div style={{ fontSize: '0.6rem', color: '#94a3b8', marginBottom: 6 }}>{t.category}</div>
                      <div style={{ display: 'flex', gap: 3, flexWrap: 'wrap', justifyContent: 'center' }}>
                        {t.tags.slice(0, 2).map(tag => (
                          <span key={tag} style={{ fontSize: '0.52rem', fontWeight: 700, padding: '2px 5px', borderRadius: 50, background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>

                {filteredTemplates.length === 0 && (
                  <div style={{ textAlign: 'center', padding: '40px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>🔍</div>
                    <div style={{ fontSize: '.85rem' }}>No templates found</div>
                  </div>
                )}

                {/* Selected Template Info */}
                {selectedTemplate && (
                  <div style={{ padding: 16, background: '#f8fafc', borderRadius: 12, border: '1px solid #e2e8f0' }}>
                    <div style={{ fontSize: '0.7rem', fontWeight: 800, color: '#475569', marginBottom: 8 }}>SELECTED TEMPLATE</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                      <div style={{ fontSize: '2rem' }}>{selectedTemplate.icon}</div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 800, fontSize: '0.88rem', marginBottom: 2 }}>{selectedTemplate.name}</div>
                        <div style={{ fontSize: '0.72rem', color: '#64748b', lineHeight: 1.4 }}>{selectedTemplate.desc}</div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <button
                type="submit"
                disabled={creating}
                style={{
                  width: '100%',
                  padding: '18px',
                  background: creating ? '#94a3b8' : '#0f172a',
                  color: '#fff',
                  border: 'none',
                  borderRadius: 14,
                  fontSize: '1rem',
                  fontWeight: 800,
                  cursor: creating ? 'not-allowed' : 'pointer'
                }}
              >
                {creating ? 'Deploying Structure...' : 'Confirm Deployment'}
              </button>
            </form>
          </div>
        </div>
      )}
      <style>{`@keyframes pulse { 0% { opacity: 1; } 50% { opacity: 0.4; } 100% { opacity: 1; } }`}</style>
    </div>
  )
}
