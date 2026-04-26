'use client'
import React, { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'
import { AdminThemeProvider, useAdminTheme } from './theme'
import WebrazeoLogo from '../../components/WebrazeoLogo'

const NAV_ITEMS = [
  { label: 'Dashboard', icon: '📊', path: '/admin' },
  { label: 'Users', icon: '👥', path: '/admin/users' },
  { label: 'Stores', icon: '🏪', path: '/admin/stores' },
  { label: 'Templates', icon: '🎨', path: '/admin/templates' },
  { label: 'Categories', icon: '📁', path: '/admin/categories' },
  { label: 'Hero Banner', icon: '🎯', path: '/admin/hero-banner' },
  { label: 'Portfolio', icon: '🖼️', path: '/admin/portfolio' },
  { label: 'Reports', icon: '📈', path: '/admin/reports' },
]

function AdminLayoutInner({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { theme, toggle, C } = useAdminTheme()
  const [collapsed, setCollapsed] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    // Skip check on login page
    if (pathname === '/admin/login') return

    // Wait for mount to ensure Zustand has hydrated
    if (!mounted) return

    // Add a small delay to ensure localStorage has been read
    const timer = setTimeout(() => {
      // Check if user is not logged in or doesn't have admin role
      if (!user || (user.role !== 'admin' && user.role !== 'superadmin')) {
        console.log('⚠️ Admin layout: No valid admin user, redirecting to login')
        console.log('User:', user)
        router.push('/admin/login')
      } else {
        console.log('✅ Admin layout: Valid admin user detected', user)
      }
    }, 100)

    return () => clearTimeout(timer)
  }, [user, pathname, router, mounted])

  if (pathname === '/admin/login') return <>{children}</>

  const handleLogout = () => { logout(); router.push('/admin/login') }
  const sideW = collapsed ? 68 : 256

  // Show loading state while hydrating to prevent flash
  if (!mounted) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'pulse2 1.5s infinite' }}>⚡</div>
          <div style={{ color: C.textMuted, fontSize: '0.9rem' }}>Loading admin panel...</div>
        </div>
      </div>
    )
  }

  // Show loading while checking auth
  if (!user) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '100vh', background: C.bg }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '3rem', marginBottom: '16px', animation: 'pulse2 1.5s infinite' }}>⚡</div>
          <div style={{ color: C.textMuted, fontSize: '0.9rem' }}>Verifying credentials...</div>
        </div>
      </div>
    )
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: C.bg, fontFamily: "'Inter',system-ui,sans-serif", transition: 'background .3s ease' }}>
      <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse2{0%,100%{opacity:1}50%{opacity:.4}}
        @keyframes slideIn{from{opacity:0;transform:translateX(-12px)}to{opacity:1;transform:translateX(0)}}
        @keyframes glow{0%,100%{box-shadow:0 0 8px rgba(99,102,241,.4)}50%{box-shadow:0 0 20px rgba(99,102,241,.8)}}
        .admin-nav-link{transition:all .2s ease!important}
        .admin-nav-link:hover{background:rgba(99,102,241,.12)!important;color:${C.purpleLight}!important;transform:translateX(3px)}
        .admin-card{transition:transform .2s ease,box-shadow .2s ease}
        .admin-card:hover{transform:translateY(-3px);box-shadow:${C.shadow}!important}
        .admin-btn{transition:all .18s ease;cursor:pointer}
        .admin-btn:hover{filter:brightness(1.1);transform:translateY(-1px)}
        .quick-card{transition:all .25s ease;cursor:pointer}
        .quick-card:hover{transform:translateY(-4px);border-color:${C.borderHover}!important}
      `}</style>

      {/* ── SIDEBAR ── */}
      <aside style={{ width: sideW, minHeight: '100vh', background: C.sidebar, borderRight: `1px solid ${C.border}`, position: 'fixed', top: 0, bottom: 0, left: 0, display: 'flex', flexDirection: 'column', transition: 'width .3s cubic-bezier(.4,0,.2,1)', overflow: 'hidden', zIndex: 100, boxShadow: C.shadow }}>

        {/* Logo */}
        <div style={{ padding: collapsed ? '20px 14px' : '24px 20px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', gap: 12, minHeight: 72 }}>
          {!collapsed && (
            <div style={{ animation: 'slideIn .3s ease' }}>
              <WebrazeoLogo size={44} showText={true} />
            </div>
          )}
          {collapsed && (
            <div style={{ width: 36, height: 36, minWidth: 36, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
              <WebrazeoLogo size={28} showText={false} variant="icon" />
            </div>
          )}
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '12px 10px', display: 'flex', flexDirection: 'column', gap: 3, overflowY: 'auto' }}>
          {NAV_ITEMS.map((item, idx) => {
            const isActive = pathname === item.path || (item.path !== '/admin' && pathname.startsWith(item.path))
            return (
              <Link key={item.path} href={item.path} className="admin-nav-link" title={collapsed ? item.label : ''}
                style={{ display: 'flex', alignItems: 'center', gap: 11, padding: collapsed ? '11px' : '10px 13px', borderRadius: 10, textDecoration: 'none', background: isActive ? `linear-gradient(135deg,${C.purple}25,${C.cyan}08)` : 'transparent', border: `1px solid ${isActive ? C.purple + '45' : 'transparent'}`, color: isActive ? C.purpleLight : C.textMuted, fontWeight: isActive ? 700 : 500, fontSize: '.86rem', justifyContent: collapsed ? 'center' : 'flex-start', boxShadow: isActive ? `0 2px 12px ${C.purple}25` : 'none', animation: `fadeIn .3s ease ${idx * 40}ms both` }}>
                <span style={{ fontSize: '1.1rem', minWidth: 18, textAlign: 'center', flexShrink: 0 }}>{item.icon}</span>
                {!collapsed && <span>{item.label}</span>}
                {!collapsed && isActive && <span style={{ marginLeft: 'auto', width: 5, height: 5, borderRadius: '50%', background: C.cyan, boxShadow: `0 0 8px ${C.cyan}`, animation: 'pulse2 2s infinite' }} />}
              </Link>
            )
          })}
        </nav>

        {/* Bottom */}
        <div style={{ padding: '12px 10px', borderTop: `1px solid ${C.border}` }}>
          {!collapsed && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 12px', background: C.purpleDim, borderRadius: 10, border: `1px solid ${C.purple}20`, marginBottom: 8 }}>
              <div style={{ width: 32, height: 32, minWidth: 32, background: `linear-gradient(135deg,${C.purple},${C.cyan})`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.85rem', color: '#fff', fontWeight: 800, flexShrink: 0 }}>
                {user?.name?.[0]?.toUpperCase() || 'S'}
              </div>
              <div style={{ overflow: 'hidden', flex: 1 }}>
                <div style={{ fontSize: '.78rem', fontWeight: 700, color: C.text, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{user?.name || 'Super Admin'}</div>
                <div style={{ fontSize: '.6rem', color: C.purple, fontWeight: 700 }}>SUPERADMIN</div>
              </div>
            </div>
          )}

          {/* Theme toggle */}
          <button onClick={toggle} className="admin-btn" style={{ width: '100%', padding: '9px', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 9, color: C.textMuted, fontSize: '.82rem', fontWeight: 600, marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8 }}>
            <span>{theme === 'dark' ? '☀️' : '🌙'}</span>
            {!collapsed && <span>{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>}
          </button>

          <button onClick={() => setCollapsed(!collapsed)} className="admin-btn" style={{ width: '100%', padding: '9px', background: C.card2, border: `1px solid ${C.border}`, borderRadius: 9, color: C.textMuted, fontSize: '.82rem', marginBottom: 6, display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8 }}>
            <span>{collapsed ? '→' : '←'}</span>
            {!collapsed && <span>Collapse</span>}
          </button>

          <button onClick={handleLogout} className="admin-btn" style={{ width: '100%', padding: '9px', background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.15)', borderRadius: 9, color: '#F87171', fontWeight: 700, fontSize: '.8rem', display: 'flex', alignItems: 'center', justifyContent: collapsed ? 'center' : 'flex-start', gap: 8 }}>
            <span>🚪</span>
            {!collapsed && <span>Logout</span>}
          </button>
        </div>
      </aside>

      {/* ── MAIN ── */}
      <main style={{ marginLeft: sideW, flex: 1, minHeight: '100vh', background: C.bg, transition: 'margin-left .3s cubic-bezier(.4,0,.2,1)' }}>
        {/* Topbar */}
        <div style={{ padding: '16px 36px', borderBottom: `1px solid ${C.border}`, display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: C.topbar, backdropFilter: 'blur(16px)', position: 'sticky', top: 0, zIndex: 50, transition: 'background .3s' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div style={{ padding: '4px 12px', background: `${C.purple}18`, border: `1px solid ${C.purple}35`, borderRadius: 20, fontSize: '.7rem', fontWeight: 800, color: C.purpleLight, textTransform: 'uppercase', letterSpacing: '.08em' }}>
              ⚡ Super Admin
            </div>
            <span style={{ color: C.textMuted, fontSize: '.78rem' }}>
              {NAV_ITEMS.find(n => pathname === n.path || (n.path !== '/admin' && pathname.startsWith(n.path)))?.label || 'Dashboard'}
            </span>
          </div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 7, height: 7, borderRadius: '50%', background: C.green, boxShadow: `0 0 8px ${C.green}`, animation: 'pulse2 2s infinite' }} />
              <span style={{ fontSize: '.75rem', color: C.textMuted, fontWeight: 600 }}>Online</span>
            </div>
            <Link
              href="/dashboard"
              className="admin-btn"
              style={{
                padding: '9px 18px',
                background: `linear-gradient(135deg, ${C.cyan}, ${C.blue})`,
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontSize: '.8rem',
                fontWeight: 800,
                textDecoration: 'none',
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                boxShadow: `0 4px 12px ${C.cyan}40`,
                transition: 'all .2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)'
                e.currentTarget.style.boxShadow = `0 6px 16px ${C.cyan}60`
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = `0 4px 12px ${C.cyan}40`
              }}
            >
              <span style={{ fontSize: '1rem' }}>👤</span>
              User Panel
            </Link>
          </div>
        </div>

        <div style={{ padding: '28px 36px', animation: 'fadeIn .4s ease' }}>
          {children}
        </div>
      </main>
    </div>
  )
}

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <AdminThemeProvider>
      <AdminLayoutInner>{children}</AdminLayoutInner>
    </AdminThemeProvider>
  )
}
