'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'

export default function DashboardPage() {
  const { user, token } = useAuthStore()
  const { theme } = useThemeStore()
  const [stats, setStats] = useState({ stores: 0, products: 0, views: 0 })
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  const isDark = theme === 'dark'

  const colors = {
    bg: isDark ? '#0F172A' : '#F8F9FB',
    card: isDark ? '#1E293B' : '#FFFFFF',
    cardBorder: isDark ? '#334155' : '#E2E8F0',
    text: isDark ? '#F1F5F9' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    textLight: isDark ? '#64748B' : '#94A3B8',
    primary: '#3B82F6',
    chartBg: isDark ? '#334155' : '#E2E8F0',
    chartGradient: isDark ? 'rgba(59, 130, 246, 0.05)' : 'rgba(59, 130, 246, 0.1)',
    innerCard: isDark ? '#0F172A' : '#F8FAFC',
  }

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
      } catch { }
      setLoading(false)
    }
    load()
  }, [])

  const statCards = [
    { label: 'Total Stores', value: stats.stores, icon: '🏪', color: '#3B82F6', trend: '+12%', bg: 'rgba(59, 130, 246, 0.1)' },
    { label: 'Products', value: stats.products, icon: '📦', color: '#22C55E', trend: '+8%', bg: 'rgba(34, 197, 94, 0.1)' },
    { label: 'Total Views', value: stats.views, icon: '👁️', color: '#F59E0B', trend: '+24%', bg: 'rgba(245, 158, 11, 0.1)' },
    { label: 'Conversion', value: '3.4%', icon: '📈', color: '#EC4899', trend: '+1.2%', bg: 'rgba(236, 72, 153, 0.1)' },
  ]

  const templates: Record<number, { name: string; color: string; icon: string }> = {
    1: { name: 'Restaurant Elite', color: '#c2410c', icon: '🍴' },
    2: { name: 'Luxury Hotel', color: '#1e3a8a', icon: '🏨' },
  }

  return (
    <div style={{ maxWidth: '1400px', margin: '0 auto', paddingBottom: 60 }}>
      {/* Dynamic Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 36 }}>
        <div>
          <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: colors.text, marginBottom: 6, letterSpacing: '-0.02em' }}>
            Dashboard Overview
          </h1>
          <p style={{ fontSize: '0.95rem', color: colors.textMuted }}>Welcome back, {user?.name || 'User'}! Here's what's happening with your stores.</p>
        </div>
        <Link href="/dashboard/stores" style={{ padding: '12px 28px', background: 'linear-gradient(135deg, #3B82F6, #2563EB)', color: '#fff', border: 'none', borderRadius: 10, fontSize: '0.9rem', fontWeight: 700, textDecoration: 'none', boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)', transition: 'all 0.2s', display: 'flex', alignItems: 'center', gap: 8 }}
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
        </Link>
      </div>

      {/* Stats Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 24, marginBottom: 44 }}>
        {statCards.map((s, i) => (
          <div key={i} style={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 20, padding: '28px', position: 'relative', overflow: 'hidden', transition: 'all 0.3s' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: s.bg, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: `1px solid ${s.color}20` }}>{s.icon}</div>
              <div style={{ fontSize: '0.72rem', fontWeight: 800, color: s.color, background: s.bg, padding: '4px 8px', borderRadius: 6, height: 'fit-content', border: `1px solid ${s.color}30` }}>{s.trend}</div>
            </div>
            <div>
              <div style={{ fontSize: '0.8rem', fontWeight: 600, color: colors.textLight, marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.05em' }}>{s.label}</div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, color: colors.text }}>{loading ? '...' : s.value}</div>
            </div>
            <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: 3, background: `linear-gradient(90deg, transparent, ${s.color})`, opacity: 0.5 }}></div>
          </div>
        ))}
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr', gap: 32 }}>

        {/* Real-time Intel (Visual Chart Placeholder) */}
        <div style={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 20, padding: 32, display: 'flex', flexDirection: 'column' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: colors.text }}>Global Traffic Velocity</h3>
            <div style={{ display: 'flex', gap: 8 }}>
              {['24H', '7D', '30D'].map(t => <button key={t} style={{ padding: '6px 12px', background: t === '7D' ? colors.primary : colors.innerCard, color: t === '7D' ? '#fff' : colors.textMuted, border: t === '7D' ? 'none' : `1px solid ${colors.cardBorder}`, borderRadius: 8, fontSize: '0.72rem', fontWeight: 700, cursor: 'pointer', transition: 'all 0.2s' }}>{t}</button>)}
            </div>
          </div>
          <div style={{ flex: 1, display: 'flex', alignItems: 'flex-end', gap: 12, height: 240, background: `linear-gradient(to bottom, ${colors.chartGradient}, transparent)`, borderRadius: 16, padding: '20px 0' }}>
            {[35, 60, 45, 80, 55, 90, 70, 40, 65, 85, 50, 75].map((h, i) => (
              <div key={i} style={{ flex: 1, background: i === 11 ? 'linear-gradient(to top, #3B82F6, #60A5FA)' : colors.chartBg, borderRadius: '4px 4px 0 0', height: `${h}%`, transition: 'height 1s ease', position: 'relative', boxShadow: i === 11 ? '0 0 20px rgba(59, 130, 246, 0.5)' : 'none' }}>
                {i === 11 && <div style={{ position: 'absolute', top: -30, left: '50%', transform: 'translateX(-50%)', background: colors.primary, color: '#fff', fontSize: '0.65rem', padding: '4px 8px', borderRadius: 6, fontWeight: 800, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.4)' }}>PEAK</div>}
              </div>
            ))}
          </div>
        </div>

        {/* Top Performing Hubs */}
        <div style={{ background: colors.card, border: `1px solid ${colors.cardBorder}`, borderRadius: 20, padding: 32 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 28 }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 800, color: colors.text }}>Top Entities</h3>
            <Link href="/dashboard/stores" style={{ fontSize: '0.75rem', fontWeight: 700, color: colors.primary, textDecoration: 'none' }}>View All Hubs</Link>
          </div>
          {loading ? (
            <p style={{ color: colors.textMuted, fontSize: '0.85rem' }}>Loading hub data...</p>
          ) : stores.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '40px 0' }}>
              <div style={{ fontSize: '2rem', marginBottom: 12 }}>🚀</div>
              <p style={{ fontSize: '0.85rem', color: colors.textMuted }}>No active hubs. Launch your first project to begin tracking.</p>
            </div>
          ) : (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
              {stores.map((s: any) => (
                <div key={s._id} style={{ display: 'flex', alignItems: 'center', gap: 16, padding: '16px', background: colors.innerCard, borderRadius: 12, border: `1px solid ${colors.cardBorder}`, transition: 'all 0.2s' }}>
                  <div style={{ width: 44, height: 44, background: 'rgba(59, 130, 246, 0.1)', borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid rgba(59, 130, 246, 0.2)' }}>{templates[s.templateId]?.icon || '📦'}</div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: '0.88rem', fontWeight: 700, color: colors.text }}>{s.siteName}</div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 2 }}>
                      <span style={{ fontSize: '0.7rem', color: colors.textLight }}>/store/{s.slug}</span>
                      <span style={{ width: 3, height: 3, borderRadius: '50%', background: colors.textLight }}></span>
                      <span style={{ fontSize: '0.7rem', fontWeight: 700, color: '#22C55E' }}>{s.views || 0} IMPRSSNS</span>
                    </div>
                  </div>
                  <Link href={`/dashboard/stores/${s._id}/edit`} style={{ padding: '8px', background: 'rgba(59, 130, 246, 0.1)', borderRadius: 8, color: colors.primary, fontSize: '0.8rem', textDecoration: 'none', border: '1px solid rgba(59, 130, 246, 0.2)' }}>🔧</Link>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}
