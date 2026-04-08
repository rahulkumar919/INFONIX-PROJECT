'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'

export default function StoresPage() {
  const { token } = useAuthStore()
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [creating, setCreating] = useState(false)
  const [form, setForm] = useState({ siteName: '', templateId: 1 })
  const [deleting, setDeleting] = useState<string | null>(null)

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function loadStores() {
    try {
      const res = await fetch('/api/websites', { headers })
      const data = await res.json()
      if (data.success) setStores(data.websites)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { loadStores() }, [])

  async function createStore(e: React.FormEvent) {
    e.preventDefault()
    if (!form.siteName.trim()) { toast.error('Name required'); return }
    setCreating(true)
    try {
      const res = await fetch('/api/websites', { method: 'POST', headers, body: JSON.stringify(form) })
      const data = await res.json()
      if (!data.success) { toast.error(data.message); return }
      toast.success('Hub deployed successfully! 🚀')
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

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 40 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>Managed Hubs</h1>
          <p style={{ color: '#64748b', fontSize: '0.9rem' }}>Orchestrate and monitor your live commerce entities.</p>
        </div>
        <button onClick={() => setShowModal(true)} style={{ padding: '12px 24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 12, fontSize: '0.88rem', fontWeight: 700, cursor: 'pointer', boxShadow: '0 4px 12px rgba(15,23,42,0.1)' }}>
          + New Project
        </button>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: 100, color: '#94a3b8' }}>Synchronizing local database...</div>
      ) : stores.length === 0 ? (
        <div style={{ textAlign: 'center', padding: 80, background: '#fff', borderRadius: 24, border: '1.5px solid #f1f5f9' }}>
          <div style={{ fontSize: '3rem', marginBottom: 20 }}>🏗️</div>
          <h3 style={{ fontWeight: 800, marginBottom: 8, fontSize: '1.2rem' }}>No active entities found.</h3>
          <p style={{ color: '#64748b', marginBottom: 32, fontSize: '0.92rem' }}>Deploy your first storefront to start capturing market share.</p>
          <button onClick={() => setShowModal(true)} style={{ padding: '14px 32px', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', color: '#fff', border: 'none', borderRadius: 12, fontWeight: 700, cursor: 'pointer' }}>
            Initialize Hub 01
          </button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: 24 }}>
          {stores.map(store => (
            <div key={store._id} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 24, overflow: 'hidden', display: 'flex', flexDirection: 'column' }}>
              <div style={{ height: 110, background: '#0f172a', padding: 24, display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', position: 'relative' }}>
                <div style={{ background: 'rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.68rem', fontWeight: 800, padding: '4px 10px', borderRadius: 6, backdropFilter: 'blur(4px)' }}>ID: {store.templateId}</div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'rgba(16,185,129,0.15)', color: '#10b981', padding: '4px 10px', borderRadius: 50, fontSize: '0.68rem', fontWeight: 800 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: '#10b981', animation: 'pulse 2s infinite' }}></div>
                  LIVE
                </div>
              </div>
              <div style={{ padding: 24, marginTop: -40, flex: 1, display: 'flex', flexDirection: 'column' }}>
                 <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #f1f5f9', padding: 16, boxShadow: '0 4px 12px rgba(0,0,0,0.02)', marginBottom: 20 }}>
                    <h3 style={{ fontWeight: 800, fontSize: '1.1rem', marginBottom: 4 }}>{store.siteName}</h3>
                    <div style={{ fontSize: '0.82rem', color: '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 6 }}>
                       🔗 store/{store.slug}
                    </div>
                 </div>
                 
                 <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12, marginBottom: 24 }}>
                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12 }}>
                       <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>Views</div>
                       <div style={{ fontSize: '1rem', fontWeight: 800 }}>{store.views || 0}</div>
                    </div>
                    <div style={{ background: '#f8fafc', padding: 12, borderRadius: 12 }}>
                       <div style={{ fontSize: '0.62rem', color: '#94a3b8', fontWeight: 800, textTransform: 'uppercase', marginBottom: 2 }}>Template</div>
                       <div style={{ fontSize: '1rem', fontWeight: 800 }}>T-{store.templateId}</div>
                    </div>
                 </div>

                 <div style={{ display: 'flex', gap: 10, marginTop: 'auto' }}>
                    <Link href={`/dashboard/stores/${store._id}/edit`} style={{ flex: 1, padding: '12px', background: '#f1f5f9', color: '#475569', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Configure</Link>
                    <Link href={`/store/${store.slug}`} target="_blank" style={{ flex: 1, padding: '12px', background: '#0f172a', color: '#fff', borderRadius: 10, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none', textAlign: 'center' }}>Go Live</Link>
                    <button onClick={() => deleteStore(store._id)} style={{ padding: '12px', background: '#fee2e2', color: '#ef4444', border: 'none', borderRadius: 10, fontWeight: 700, cursor: 'pointer' }}>🗑</button>
                 </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CREATE MODAL */}
      {showModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(15,23,42,0.6)', backdropFilter: 'blur(8px)', zIndex: 200, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }} onClick={() => setShowModal(false)}>
          <div style={{ background: '#fff', borderRadius: 28, width: '100%', maxWidth: 540, overflow: 'hidden', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding: '32px 40px', borderBottom: '1px solid #f1f5f9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontWeight: 900, fontSize: '1.25rem' }}>Deploy New Entity</h2>
              <button onClick={() => setShowModal(false)} style={{ background: '#f1f5f9', border: 'none', width: 36, height: 36, borderRadius: '50%', cursor: 'pointer' }}>✕</button>
            </div>
            <form onSubmit={createStore} style={{ padding: 40 }}>
               <div style={{ marginBottom: 32 }}>
                 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 12, textTransform: 'uppercase' }}>Entity Name</label>
                 <input type="text" required autoFocus value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })} placeholder="e.g. Neo-Matrix Store" style={{ width: '100%', padding: '16px 20px', border: '1.5px solid #e2e8f0', borderRadius: 12, fontSize: '1rem', outline: 'none' }} />
               </div>
               <div style={{ marginBottom: 40 }}>
                 <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: 800, color: '#475569', marginBottom: 16, textTransform: 'uppercase' }}>Visual Architecture</label>
                 <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
                   {[1, 2].map(id => (
                     <div key={id} onClick={() => setForm({ ...form, templateId: id })} style={{ padding: '24px 16px', border: form.templateId === id ? '2px solid #6366f1' : '1.5px solid #e2e8f0', borderRadius: 20, cursor: 'pointer', textAlign: 'center', background: form.templateId === id ? '#f5f3ff' : '#fff', transition: 'all 0.2s' }}>
                       <div style={{ fontSize: '2rem', marginBottom: 8 }}>{id === 1 ? '🍴' : '🏨'}</div>
                       <div style={{ fontSize: '0.85rem', fontWeight: 800, color: form.templateId === id ? '#6366f1' : '#1e293b', marginBottom: 4 }}>{id === 1 ? 'Restaurant Elite' : 'Luxury Hotel'}</div>
                       <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>{id === 1 ? 'Visual Culinary Experience' : 'Premium Booking Engine'}</div>
                     </div>
                   ))}
                 </div>
               </div>
               <button type="submit" disabled={creating} style={{ width: '100%', padding: '18px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 14, fontSize: '1rem', fontWeight: 800, cursor: 'pointer' }}>
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
