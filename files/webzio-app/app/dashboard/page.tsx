'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../stores/authStore'

export default function DashboardPage() {
  const { user, token } = useAuthStore()
  const [stats, setStats] = useState({ stores: 0, products: 0, views: 0 })
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch('/api/websites', { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        if (data.success) {
          setStores(data.websites.slice(0, 4))
          const totalViews = data.websites.reduce((s: number, w: any) => s + (w.views || 0), 0)
          setStats(prev => ({ ...prev, stores: data.websites.length, views: totalViews }))
        }
        const pRes = await fetch('/api/products', { headers: { Authorization: `Bearer ${token}` } })
        const pData = await pRes.json()
        if (pData.success) setStats(prev => ({ ...prev, products: pData.products.length }))
      } catch {}
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Hospitality Hubs', value: stats.stores, icon: '🏨', color: '#6366f1', trend: '+12%', bg: '#f5f3ff' },
    { label: 'Menu / Room Inventory', value: stats.products, icon: '🍽️', color: '#10b981', trend: '+8%', bg: '#f0fdf4' },
    { label: 'Guest Traffic', value: stats.views, icon: '📈', color: '#f59e0b', trend: '+24%', bg: '#fffbeb' },
    { label: 'Reservation Interest', value: '3.4%', icon: '💎', color: '#ec4899', trend: '+1.2%', bg: '#fdf2f8' },
  ]

  const templates: Record<number, { name: string; color: string; icon: string }> = {
    1: { name: 'Restaurant Elite', color: '#c2410c', icon: '🍴' },
    2: { name: 'Luxury Hotel', color: '#1e3a8a', icon: '🏨' },
  }

  return (
    <div style={{ paddingBottom: 60 }}>
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 44 }}>
        <div>
          <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>
            Executive Dashboard
          </h1>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <span style={{ fontSize: '0.9rem', color: '#64748b' }}>Precision monitoring for your commerce empire.</span>
            <div style={{ padding: '4px 10px', background: '#f1f5f9', borderRadius: 6, fontSize: '0.72rem', fontWeight: 700, color: '#475569', textTransform: 'uppercase' }}>V2.4.0</div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button style={{ padding: '10px 18px', background: '#fff', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, color: '#475569', cursor: 'pointer' }}>Export Intelligence</button>
          <Link href="/dashboard/stores" style={{ padding: '10px 22px', background: 'linear-gradient(135deg, #0f172a, #334155)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.85rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 12px rgba(15,23,42,0.15)' }}>+ Deploy New Hub</Link>
        </div>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 44 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 24, padding: '28px', position: 'relative', overflow: 'hidden' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem' }}>{s.icon}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color, background: `${s.color}15`, padding: '4px 8px', borderRadius: 6, height: 'fit-content' }}>{s.trend}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: '#94a3b8', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: '#1e293b' }}>{loading ? '...' : s.value}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${s.color})`, opacity: 0.3 }}></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32 }}>
        
        {/* Real-time Intel (Visual Chart Placeholder) */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 24, padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Global Traffic Velocity</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['24H', '7D', '30D'].map(t => <button key={t} style={{ padding: '6px 12px', background: t === '7D' ? '#0f172a' : '#f8fafc', color: t === '7D' ? '#fff' : '#64748b', border: 'none', borderRadius: 8, fontSize: '0.72rem', fontWeight: 700 }}>{t}</button>)}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, height: 240, background: 'linear-gradient(to bottom, transparent, #fafafa)', borderRadius: 16, padding: '20px 0' }}>
            {[35, 60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 11 ? '#6366f1' : '#e2e8f0', borderRadius: '4px 4px 0 0', height: `${h}%`, transition: 'height 1s ease', position: 'relative' }}>
                {i === 11 && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: '#6366f1', color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: 6, fontWeight: 800 }}>PEAK</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Hubs */}
        <div style={{ background: '#fff', border: '1px solid #f1f5f9', borderRadius: 24, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800 }}>Top Entities</h3>
            <Link href="/dashboard/stores" style={{ fontSize: '0.75rem', fontWeight: 700, color: '#6366f1' }}>View All Hubs</Link>
          </div>
          {loading ? (
            <p style={{ color: '#94a3b8', fontSize: '0.85rem' }}>Loading hub data...</p>
          ) : stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
               <div style={{ fontSize: '2rem', marginBottom: 12 }}>🚀</div>
               <p style={{ fontSize: '0.85rem', color: '#64748b' }}>No active hubs. Launch your first project to begin tracking.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {stores.map((s: any) => (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <div style={{ width: 44, height: 44, background: '#f8fafc', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid #f1f5f9' }}>{templates[s.templateId]?.icon || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: '#1e293b' }}>{s.siteName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: '0.7rem', color: '#94a3b8' }}>/store/{s.slug}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: '#cbd5e1' }}></span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#10b981' }}>{s.views || 0} IMPRSSNS</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/stores/${s._id}/edit`} style={{ padding: '8px', background: '#f8fafc', borderRadius: 8, color: '#64748b', fontSize: '0.8rem' }}>🔧</Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
