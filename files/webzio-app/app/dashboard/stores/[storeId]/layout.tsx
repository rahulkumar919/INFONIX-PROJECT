'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter, useParams } from 'next/navigation'
import { useAuthStore } from '../../../../stores/authStore'

const C = {
  bg: '#F8F9FB', sidebar: '#FFFFFF', border: '#E2E8F0',
  text: '#0F172A', textMuted: '#64748B', blue: '#3B82F6', blueLight: '#60A5FA',
  active: 'rgba(59,130,246,0.08)', activeBorder: 'rgba(59,130,246,0.2)',
  hover: '#F1F5F9'
}

export default function StoreAdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const params = useParams()
  const storeId = params?.storeId as string
  const { user, logout } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = () => { logout(); router.push('/login') }
  const base = `/dashboard/stores/${storeId}`
  const sideW = collapsed ? 68 : 248

  const NAV = [
    { label: 'Overview', icon: '📊', path: base },
    { label: 'Setup Wizard', icon: '🧙', path: `${base}/wizard` },
    { label: 'Branding', icon: '🎨', path: `${base}/branding` },
    { label: 'Pages (CMS)', icon: '📄', path: `${base}/pages` },
    { label: 'Gallery', icon: '🖼️', path: `${base}/gallery` },
    { label: 'Settings', icon: '⚙️', path: `${base}/settings` },
    { label: 'Profile', icon: '👤', path: `${base}/profile` },
  ]

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter', sans-serif" }}>
      {/* Sidebar */}
      <aside style={{ width: sideW, minHeight: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', transition: 'width 0.3s ease', overflow: 'hidden', zIndex: 100, boxShadow: '4px 0 24px rgba(0,0,0,0.04)' }}>
        {/* Logo */}
        <div style={{ padding: collapsed ? '22px 14px' : '24px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, minWidth: 36, background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', boxShadow: '0 0 16px rgba(59,130,246,0.4)' }}>🏪</div>
          {!collapsed && (
            <div>
              <div style={{ fontSize: '0.88rem', fontWeight: 900, color: C.text }}>Store<span style={{ color: C.blue }}>Admin</span></div>
              <div style={{ fontSize: '0.62rem', color: C.textMuted, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.07em' }}>Client Panel</div>
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '14px 10px', display: 'flex', flexDirection: 'column', gap: 3 }}>
          {NAV.map(item => {
            const isActive = item.path === base ? pathname === base : pathname.startsWith(item.path)
            return (
              <Link key={item.path} href={item.path} title={collapsed ? item.label : ''} style={{
                display: 'flex', alignItems: 'center', gap: 10,
                padding: collapsed ? '11px' : '10px 13px', borderRadius: 10,
                textDecoration: 'none', justifyContent: collapsed ? 'center' : 'flex-start',
                background: isActive ? C.active : 'transparent',
                border: `1px solid ${isActive ? C.activeBorder : 'transparent'}`,
                color: isActive ? C.blue : C.textMuted,
                fontWeight: isActive ? 700 : 500, fontSize: '0.85rem', transition: 'all 0.18s',
              }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = C.hover)}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '1.05rem', minWidth: 18, textAlign: 'center' }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && isActive && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.blue, boxShadow: '0 0 6px rgba(59,130,246,0.8)' }} />}
              </Link>
            )
          })}

          {!collapsed && (
            <div style={{ marginTop: 12, padding: '0 4px' }}>
              <div style={{ height: 1, background: C.border, marginBottom: 12 }} />
              <Link href="/dashboard" style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 13px', borderRadius: 10, textDecoration: 'none', color: C.textMuted, fontSize: '0.82rem', fontWeight: 600 }}>
                ← Back to Dashboard
              </Link>
            </div>
          )}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: 'rgba(59,130,246,0.06)', borderRadius: 10, border: `1px solid ${C.border}`, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, minWidth: 32, background: 'linear-gradient(135deg,#3B82F6,#2563EB)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', color: '#fff', fontWeight: 800 }}>
                {user?.name?.[0]?.toUpperCase() || 'U'}
              </div>
              <div style={{ overflow: 'hidden' }}>
                <div style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name}</div>
                <div style={{ fontSize: '0.65rem', color: C.blue, fontWeight: 700 }}>Store Owner</div>
              </div>
            </div>
          )}
          <button onClick={() => setCollapsed(!collapsed)} style={{ width: '100%', padding: '8px', background: 'rgba(255,255,255,0.03)', border: `1px solid ${C.border}`, borderRadius: 8, color: C.textMuted, fontSize: '0.9rem', cursor: 'pointer', marginBottom: 6, transition: 'all 0.2s' }}>
            {collapsed ? '→' : '← Collapse'}
          </button>
          <button onClick={handleLogout} style={{ width: '100%', padding: '8px', background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 8, color: '#F87171', fontWeight: 700, fontSize: '0.78rem', cursor: 'pointer' }}>
            {collapsed ? '🚪' : '🚪 Logout'}
          </button>
        </div>
      </aside>

      {/* Main */}
      <main style={{ marginLeft: sideW, flex: 1, minHeight: '100vh', transition: 'margin-left 0.3s ease' }}>
        <div style={{ padding: '28px 36px' }}>{children}</div>
      </main>

      <style>{`@import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&display=swap'); *{box-sizing:border-box}`}</style>
    </div>
  )
}
