'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)', green: '#22C55E', red: '#EF4444'
}

export default function StoreDashboardPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuthStore()
  const [store, setStore] = useState<any>(null)
  const [stats, setStats] = useState({ visitors: 0, leads: 0, pages: 0, images: 0 })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadStore()
    loadStats()
  }, [])

  const loadStore = async () => {
    try {
      const res = await fetch(`/api/store/${params.storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setStore(data.website)
      else toast.error('Store not found')
    } catch (error) {
      toast.error('Failed to load store')
    }
    setLoading(false)
  }

  const loadStats = async () => {
    try {
      const res = await fetch(`/api/store/dashboard?storeId=${params.storeId}`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setStats(data.stats)
    } catch (error) {
      console.error('Failed to load stats')
    }
  }

  const toggleStatus = async () => {
    try {
      const res = await fetch(`/api/store/${params.storeId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isActive: !store.isActive })
      })
      const data = await res.json()
      if (data.success) {
        setStore({ ...store, isActive: !store.isActive })
        toast.success(`Store ${!store.isActive ? 'activated' : 'deactivated'}`)
      }
    } catch (error) {
      toast.error('Failed to update status')
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>
  if (!store) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Store not found</div>

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: 16 }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>{store.name}</h1>
            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', color: C.textMuted }}>/{store.slug || 'no-url'}</span>
              <span style={{
                fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                background: store.isActive ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                color: store.isActive ? C.green : C.red
              }}>
                {store.isActive ? '● Active' : '● Inactive'}
              </span>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 12 }}>
            <button onClick={toggleStatus} style={{
              padding: '10px 20px', background: C.card, border: `1px solid ${C.border}`,
              borderRadius: 8, color: C.text, fontWeight: 600, cursor: 'pointer'
            }}>
              {store.isActive ? 'Deactivate' : 'Activate'}
            </button>
            <Link href={`/store/${store.slug}`} target="_blank">
              <button style={{
                padding: '10px 20px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer'
              }}>
                🌐 View Live
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20, marginBottom: 32 }}>
        {[
          { label: 'Visitors', value: stats.visitors, icon: '👥', color: C.purple },
          { label: 'Leads / Orders', value: stats.leads, icon: '📊', color: C.cyan },
          { label: 'Pages', value: stats.pages, icon: '📄', color: '#F59E0B' },
          { label: 'Images', value: stats.images, icon: '🖼️', color: '#EC4899' }
        ].map((stat, i) => (
          <div key={i} style={{
            background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24,
            position: 'relative', overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute', top: -20, right: -20, fontSize: '5rem', opacity: 0.05
            }}>{stat.icon}</div>
            <div style={{ fontSize: '0.75rem', fontWeight: 700, color: C.textMuted, marginBottom: 8, textTransform: 'uppercase' }}>
              {stat.label}
            </div>
            <div style={{ fontSize: '2rem', fontWeight: 900, color: C.text }}>{stat.value}</div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div style={{ marginBottom: 32 }}>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>⚡ Quick Actions</h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16 }}>
          {[
            { title: 'Branding & Identity', desc: 'Logo, colors, social links', icon: '🎨', href: 'branding' },
            { title: 'Manage Pages', desc: 'Create and edit pages', icon: '📄', href: 'pages' },
            { title: 'Media Gallery', desc: 'Upload images (max 5)', icon: '🖼️', href: 'gallery' },
            { title: 'Site Settings', desc: 'SEO, URL, favicon', icon: '⚙️', href: 'settings' }
          ].map((action, i) => (
            <Link key={i} href={`/dashboard/stores/${params.storeId}/${action.href}`} style={{ textDecoration: 'none' }}>
              <div style={{
                background: C.card, border: `1px solid ${C.border}`, borderRadius: 12, padding: 20,
                cursor: 'pointer', transition: 'all 0.2s'
              }}
                onMouseEnter={e => e.currentTarget.style.borderColor = C.purple}
                onMouseLeave={e => e.currentTarget.style.borderColor = C.border}>
                <div style={{ fontSize: '2rem', marginBottom: 12 }}>{action.icon}</div>
                <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, marginBottom: 6 }}>{action.title}</div>
                <div style={{ fontSize: '0.8rem', color: C.textMuted }}>{action.desc}</div>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div>
        <h2 style={{ fontSize: '1.2rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>📊 Recent Activity</h2>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
          <div style={{ textAlign: 'center', padding: 40, color: C.textMuted }}>
            <div style={{ fontSize: '3rem', marginBottom: 12 }}>📈</div>
            <p>Activity tracking coming soon...</p>
          </div>
        </div>
      </div>
    </div>
  )
}
