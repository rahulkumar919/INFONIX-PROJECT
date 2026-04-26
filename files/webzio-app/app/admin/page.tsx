'use client'
import { useEffect, useState, useRef } from 'react'
import { useAuthStore } from '../../stores/authStore'
import Link from 'next/link'
import { useAdminTheme } from './theme'

function useCountUp(target: number, start: boolean) {
  const [val, setVal] = useState(0)
  useEffect(() => {
    if (!start || !target) return
    let t0: number
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / 1400, 1)
      setVal(Math.floor(ease(p) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target])
  return val
}

function AnimatedBar({ pct, color, delay = 0 }: { pct: number; color: string; delay?: number }) {
  const [w, setW] = useState(0)
  useEffect(() => { const t = setTimeout(() => setW(pct), delay + 200); return () => clearTimeout(t) }, [pct, delay])
  return (
    <div style={{ height: 8, background: `${color}20`, borderRadius: 4, overflow: 'hidden' }}>
      <div style={{ height: '100%', width: `${w}%`, background: `linear-gradient(90deg,${color},${color}99)`, borderRadius: 4, transition: 'width 1.2s cubic-bezier(.4,0,.2,1)' }} />
    </div>
  )
}

function BarChart({ data, color }: { data: any[]; color: string }) {
  const [ready, setReady] = useState(false)
  useEffect(() => { const t = setTimeout(() => setReady(true), 300); return () => clearTimeout(t) }, [])
  const max = Math.max(...data.map(d => d.count), 1)
  if (!data.length) return <div style={{ textAlign: 'center', padding: '20px 0', color: '#64748B', fontSize: '.82rem' }}>No data yet</div>
  return (
    <div style={{ display: 'flex', alignItems: 'flex-end', gap: 4, height: 80 }}>
      {data.map((d, i) => (
        <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
          <div style={{ fontSize: '.55rem', color: '#64748B', fontWeight: 700, opacity: d.count ? 1 : 0 }}>{d.count}</div>
          <div style={{ width: '100%', background: `${color}18`, borderRadius: '3px 3px 0 0', overflow: 'hidden', height: 60, display: 'flex', alignItems: 'flex-end' }}>
            <div style={{ width: '100%', background: `linear-gradient(to top,${color},${color}80)`, borderRadius: '3px 3px 0 0', height: ready ? `${(d.count / max) * 100}%` : '0%', minHeight: d.count && ready ? 4 : 0, transition: `height 1s cubic-bezier(.34,1.56,.64,1) ${i * 40}ms` }} />
          </div>
          <div style={{ fontSize: '.5rem', color: '#64748B', transform: 'rotate(-45deg)', transformOrigin: 'center', width: 18, textAlign: 'center', overflow: 'hidden' }}>{d._id?.slice(5)}</div>
        </div>
      ))}
    </div>
  )
}

export default function AdminDashboard() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [stats, setStats] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [countStart, setCountStart] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    fetch('/api/admin/stats', { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) { setStats(d); setTimeout(() => setCountStart(true), 200) } })
      .finally(() => setLoading(false))
  }, [token])

  const s = stats?.stats || {}

  const totalUsers = useCountUp(s.totalUsers ?? 0, countStart)
  const totalStores = useCountUp(s.totalStores ?? 0, countStart)
  const activeStores = useCountUp(s.activeStores ?? 0, countStart)
  const totalTemplates = useCountUp(s.totalTemplates ?? 0, countStart)

  const statCards = [
    { label: 'Total Users', value: totalUsers, icon: '👥', color: C.purple, sub: `${s.activeUsers ?? 0} active`, pct: s.totalUsers ? (s.activeUsers / s.totalUsers) * 100 : 0 },
    { label: 'Total Stores', value: totalStores, icon: '🏪', color: C.blue, sub: `${s.activeStores ?? 0} enabled`, pct: s.totalStores ? (s.activeStores / s.totalStores) * 100 : 0 },
    { label: 'Inactive Stores', value: useCountUp(s.inactiveStores ?? 0, countStart), icon: '⛔', color: C.red, sub: 'disabled', pct: s.totalStores ? (s.inactiveStores / s.totalStores) * 100 : 0 },
    { label: 'Templates', value: totalTemplates, icon: '🎨', color: C.amber, sub: `${s.activeTemplates ?? 0} active`, pct: s.totalTemplates ? (s.activeTemplates / s.totalTemplates) * 100 : 0 },
  ]

  const quickLinks = [
    { label: 'Manage Users', icon: '👥', path: '/admin/users', desc: 'View, activate or deactivate users', color: C.purple },
    { label: 'Manage Stores', icon: '🏪', path: '/admin/stores', desc: 'Enable, disable or delete stores', color: C.blue },
    { label: 'Templates', icon: '🎨', path: '/admin/templates', desc: 'Add & manage templates', color: C.amber },
    { label: 'Categories', icon: '📁', path: '/admin/categories', desc: 'Manage template categories', color: C.green },
    { label: 'Hero Banner', icon: '🎯', path: '/admin/hero-banner', desc: 'Update homepage hero images', color: C.pink },
    { label: 'Portfolio', icon: '🖼️', path: '/admin/portfolio', desc: 'Portfolio template section', color: C.cyan },
    { label: 'Reports', icon: '📈', path: '/admin/reports', desc: 'Analytics & growth reports', color: C.purple },
  ]

  return (
    <div ref={ref}>
      {/* Header */}
      <div style={{ marginBottom: 28, animation: 'fadeIn .5s ease' }}>
        <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: C.text, letterSpacing: '-.03em', marginBottom: 4 }}>
          Master <span style={{ color: C.purple }}>Dashboard</span>
        </h1>
        <p style={{ color: C.textMuted, fontSize: '.86rem' }}>Real-time control over your entire platform.</p>
      </div>

      {/* Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 24 }}>
        {statCards.map((c, i) => (
          <div key={i} className="admin-card" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 22, position: 'relative', overflow: 'hidden', animation: `fadeIn .5s ease ${i * 80}ms both` }}>
            <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: `linear-gradient(90deg,transparent,${c.color},transparent)` }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
              <div style={{ width: 44, height: 44, background: `${c.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.4rem', border: `1px solid ${c.color}25` }}>{c.icon}</div>
              <div style={{ fontSize: '.68rem', fontWeight: 800, color: c.color, background: `${c.color}12`, padding: '3px 9px', borderRadius: 20, border: `1px solid ${c.color}20` }}>{c.sub}</div>
            </div>
            <div style={{ fontSize: '.68rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 4 }}>{c.label}</div>
            <div style={{ fontSize: '1.9rem', fontWeight: 900, color: C.text, marginBottom: 12 }}>{loading ? '—' : c.value.toLocaleString()}</div>
            <AnimatedBar pct={c.pct} color={c.color} delay={i * 100} />
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 20 }}>
        {/* User Growth */}
        <div className="admin-card" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24, animation: 'fadeIn .5s ease .3s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '.92rem', fontWeight: 800, color: C.text }}>👥 User Growth</h3>
            <span style={{ fontSize: '.7rem', color: C.textMuted, background: C.card2, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` }}>Last 14 days</span>
          </div>
          {loading ? <div style={{ color: C.textMuted, fontSize: '.85rem' }}>Loading...</div> : <BarChart data={stats?.userGrowth || []} color={C.purple} />}
        </div>

        {/* Store Creation */}
        <div className="admin-card" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24, animation: 'fadeIn .5s ease .4s both' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
            <h3 style={{ fontSize: '.92rem', fontWeight: 800, color: C.text }}>🏪 Store Creations</h3>
            <span style={{ fontSize: '.7rem', color: C.textMuted, background: C.card2, padding: '3px 10px', borderRadius: 20, border: `1px solid ${C.border}` }}>Last 14 days</span>
          </div>
          {loading ? <div style={{ color: C.textMuted, fontSize: '.85rem' }}>Loading...</div> : <BarChart data={stats?.storeGrowth || []} color={C.blue} />}
        </div>
      </div>

      {/* Recent Activities */}
      <div className="admin-card" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24, marginBottom: 20, animation: 'fadeIn .5s ease .5s both' }}>
        <h3 style={{ fontSize: '.92rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>⚡ Recent Activities</h3>
        {loading ? <div style={{ color: C.textMuted }}>Loading...</div> : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(280px,1fr))', gap: 10 }}>
            {(stats?.recentActivities || []).slice(0, 8).map((a: any, i: number) => (
              <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 14px', background: C.card2, borderRadius: 10, border: `1px solid ${C.border}`, animation: `fadeIn .3s ease ${i * 50}ms both` }}>
                <div style={{ width: 32, height: 32, borderRadius: 8, background: a.type === 'user' ? `${C.purple}20` : `${C.blue}20`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.95rem', flexShrink: 0 }}>{a.icon}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: '.8rem', fontWeight: 600, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{a.message}</div>
                  <div style={{ fontSize: '.68rem', color: C.textMuted }}>{new Date(a.time).toLocaleString()}</div>
                </div>
                <div style={{ width: 6, height: 6, borderRadius: '50%', background: a.type === 'user' ? C.purple : C.blue, flexShrink: 0 }} />
              </div>
            ))}
            {!stats?.recentActivities?.length && <p style={{ color: C.textMuted, fontSize: '.85rem', gridColumn: '1/-1' }}>No recent activities yet.</p>}
          </div>
        )}
      </div>

      {/* Quick Nav */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {quickLinks.map((item, i) => (
          <Link key={item.path} href={item.path} className="quick-card" style={{ display: 'block', background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, padding: '18px 20px', textDecoration: 'none', animation: `fadeIn .4s ease ${.6 + i * .06}s both` }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <div style={{ width: 36, height: 36, background: `${item.color}15`, borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', border: `1px solid ${item.color}20` }}>{item.icon}</div>
              <span style={{ fontSize: '.88rem', fontWeight: 800, color: C.text }}>{item.label}</span>
            </div>
            <p style={{ fontSize: '.76rem', color: C.textMuted, margin: '0 0 10px' }}>{item.desc}</p>
            <div style={{ fontSize: '.7rem', fontWeight: 700, color: item.color, background: `${item.color}12`, padding: '3px 10px', borderRadius: 20, border: `1px solid ${item.color}20`, display: 'inline-block' }}>Open →</div>
          </Link>
        ))}
      </div>
    </div>
  )
}
