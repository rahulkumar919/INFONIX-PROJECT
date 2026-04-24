'use client'
import React, { useState } from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'
import { useThemeStore } from '../../stores/themeStore'
import PricingModal from '../../components/PricingModal'
import WebrazeoLogo from '../../components/WebrazeoLogo'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()
  const { theme, toggleTheme } = useThemeStore()
  const [showPricing, setShowPricing] = useState(false)

  const isDark = theme === 'dark'

  const colors = {
    bg: isDark ? '#0F172A' : '#F8F9FB',
    sidebar: isDark ? '#1E293B' : '#FFFFFF',
    sidebarBorder: isDark ? '#334155' : '#E2E8F0',
    text: isDark ? '#F1F5F9' : '#0F172A',
    textMuted: isDark ? '#94A3B8' : '#64748B',
    primary: '#3B82F6',
    activeItemBg: isDark ? 'rgba(59, 130, 246, 0.1)' : '#EFF6FF',
    activeItemBorder: isDark ? 'rgba(59, 130, 246, 0.2)' : 'rgba(59, 130, 246, 0.3)',
    hoverBg: isDark ? 'rgba(255, 255, 255, 0.05)' : '#F1F5F9',
  }

  const menu = [
    { label: 'Overview', icon: '📊', path: '/dashboard' },
    { label: 'My Stores', icon: '🏪', path: '/dashboard/stores' },
    { label: 'Products', icon: '📦', path: '/dashboard/products' },
    { label: 'Templates', icon: '🎨', path: '/dashboard/templates' },
    { label: 'Categories', icon: '📁', path: '/dashboard/categories' },
    { label: 'Portfolio', icon: '🖼️', path: '/dashboard/portfolio' },
    { label: 'Subscription', icon: '💳', path: '/dashboard/subscription' },
    { label: 'Settings', icon: '⚙️', path: '/dashboard/settings' },
  ]

  // Check if user is admin or superadmin
  const isAdmin = user?.role === 'admin' || user?.role === 'superadmin'

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: colors.bg, transition: 'background 0.3s ease' }}>

      {/* Sidebar */}
      <aside style={{ width: 260, background: colors.sidebar, borderRight: `1px solid ${colors.sidebarBorder}`, position: 'fixed', top: 0, bottom: 0, left: 0, padding: '24px 20px', display: 'flex', flexDirection: 'column', transition: 'all 0.3s ease', boxShadow: isDark ? '4px 0 24px rgba(0, 0, 0, 0.3)' : '4px 0 24px rgba(0, 0, 0, 0.05)' }}>

        <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
          <WebrazeoLogo size={44} showText={true} />
        </div>

        <nav style={{ flex: 1 }}>
          {menu.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path} style={{
                display: 'flex', alignItems: 'center', gap: 12,
                padding: '12px 16px', borderRadius: 10, marginBottom: 6,
                textDecoration: 'none', color: isActive ? colors.primary : colors.textMuted,
                background: isActive ? colors.activeItemBg : 'transparent',
                fontWeight: isActive ? 700 : 500, fontSize: '0.9rem',
                transition: 'all 0.2s',
                border: isActive ? `1px solid ${colors.activeItemBorder}` : '1px solid transparent'
              }}
                onMouseEnter={e => !isActive && (e.currentTarget.style.background = colors.hoverBg)}
                onMouseLeave={e => !isActive && (e.currentTarget.style.background = 'transparent')}
              >
                <span style={{ fontSize: '1.2rem', marginBottom: 2 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}

          {/* Admin Panel Link - Only visible to admin/superadmin */}
          {isAdmin && (
            <>
              <div style={{ height: 1, background: colors.sidebarBorder, margin: '16px 0' }}></div>
              <Link href="/admin" style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '14px 18px', borderRadius: 12, marginBottom: 8,
                textDecoration: 'none', color: '#8B5CF6',
                background: 'rgba(139, 92, 246, 0.1)',
                fontWeight: 700, fontSize: '0.92rem',
                transition: 'all 0.2s',
                border: '1px solid rgba(139, 92, 246, 0.2)'
              }}>
                <span style={{ fontSize: '1.2rem', marginBottom: 2 }}>⚡</span>
                Super Admin
              </Link>
            </>
          )}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: `1px solid ${colors.sidebarBorder}` }}>
          {/* Upgrade Button */}
          <button
            onClick={() => setShowPricing(true)}
            style={{
              width: '100%',
              padding: '16px',
              background: 'linear-gradient(135deg, #EC4899, #DB2777)',
              border: 'none',
              borderRadius: 12,
              color: '#fff',
              fontWeight: 800,
              fontSize: '.9rem',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: 10,
              marginBottom: 20,
              boxShadow: '0 4px 16px rgba(236, 72, 153, 0.4)',
              transition: 'all 0.3s',
              position: 'relative',
              overflow: 'hidden'
            }}
            onMouseEnter={e => {
              e.currentTarget.style.transform = 'translateY(-2px)'
              e.currentTarget.style.boxShadow = '0 6px 20px rgba(236, 72, 153, 0.5)'
            }}
            onMouseLeave={e => {
              e.currentTarget.style.transform = 'translateY(0)'
              e.currentTarget.style.boxShadow = '0 4px 16px rgba(236, 72, 153, 0.4)'
            }}
          >
            <span style={{ fontSize: '1.2rem' }}>⚡</span>
            <span>Upgrade to Pro</span>
            {user?.plan === 'free' && (
              <span style={{
                position: 'absolute',
                top: -6,
                right: -6,
                background: '#22C55E',
                color: '#fff',
                fontSize: '.65rem',
                fontWeight: 800,
                padding: '3px 8px',
                borderRadius: 10,
                boxShadow: '0 2px 8px rgba(34, 197, 94, 0.4)'
              }}>
                NEW
              </span>
            )}
          </button>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 16, padding: '0 12px' }}>
            <div style={{ width: 42, height: 42, background: 'linear-gradient(135deg, #3B82F6, #2563EB)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#fff', fontWeight: 800, boxShadow: '0 4px 12px rgba(59, 130, 246, 0.3)' }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden', flex: 1 }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: colors.text }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: colors.textMuted, whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email}</div>
              {user?.plan && (
                <div style={{
                  display: 'inline-block',
                  fontSize: '.65rem',
                  fontWeight: 800,
                  color: user.plan === 'free' ? '#6B7280' : user.plan === 'pro' ? '#EC4899' : '#0F172A',
                  background: user.plan === 'free' ? '#F3F4F6' : user.plan === 'pro' ? '#FCE7F3' : '#F1F5F9',
                  padding: '2px 8px',
                  borderRadius: 6,
                  marginTop: 4,
                  textTransform: 'uppercase',
                  letterSpacing: '0.05em'
                }}>
                  {user.plan} Plan
                </div>
              )}
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: 'rgba(239, 68, 68, 0.1)', border: '1.5px solid rgba(239, 68, 68, 0.2)', borderRadius: 12, color: '#EF4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8, transition: 'all 0.2s' }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Pricing Modal */}
      <PricingModal
        isOpen={showPricing}
        onClose={() => setShowPricing(false)}
        currentPlan={user?.plan || 'free'}
      />

      {/* Main Content */}
      <main style={{ marginLeft: 260, flex: 1, padding: '32px 40px', background: colors.bg, transition: 'background 0.3s ease', position: 'relative', minHeight: '100vh' }}>
        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          style={{
            position: 'fixed',
            top: 32,
            right: 40,
            width: 44,
            height: 44,
            background: colors.sidebar,
            border: `1.5px solid ${colors.sidebarBorder}`,
            borderRadius: 12,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            cursor: 'pointer',
            fontSize: '1.2rem',
            transition: 'all 0.3s ease',
            boxShadow: isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)',
            zIndex: 1000
          }}
          title={isDark ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          onMouseEnter={e => {
            e.currentTarget.style.transform = 'scale(1.05)'
            e.currentTarget.style.boxShadow = isDark ? '0 6px 16px rgba(0, 0, 0, 0.4)' : '0 6px 16px rgba(0, 0, 0, 0.15)'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.transform = 'scale(1)'
            e.currentTarget.style.boxShadow = isDark ? '0 4px 12px rgba(0, 0, 0, 0.3)' : '0 4px 12px rgba(0, 0, 0, 0.1)'
          }}
        >
          {isDark ? '☀️' : '🌙'}
        </button>
        {children}
      </main>

    </div >
  )
}
