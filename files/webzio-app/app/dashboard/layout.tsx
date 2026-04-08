'use client'
import React from 'react'
import Link from 'next/link'
import { usePathname, useRouter } from 'next/navigation'
import { useAuthStore } from '../../stores/authStore'

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname()
  const router = useRouter()
  const { user, logout } = useAuthStore()

  const menu = [
    { label: 'Overview',  icon: '📊', path: '/dashboard' },
    { label: 'My Stores', icon: '🏪', path: '/dashboard/stores' },
    { label: 'Products',  icon: '📦', path: '/dashboard/products' },
    { label: 'Templates', icon: '🎨', path: '/dashboard/templates' },
    { label: 'Settings',  icon: '⚙️', path: '/dashboard/settings' },
  ]

  const handleLogout = () => {
    logout()
    router.push('/login')
  }

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#f8f9fb' }}>
      
      {/* Sidebar */}
      <aside style={{ width: 280, background: '#fff', borderRight: '1px solid #f0f0f2', position: 'fixed', top: 0, bottom: 0, left: 0, padding: '32px 24px', display: 'flex', flexDirection: 'column' }}>
        
        <div style={{ fontWeight: 900, fontSize: '1.4rem', letterSpacing: '-0.03em', marginBottom: 48, display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem' }}>S</div>
          Store<span style={{ color: '#6366f1' }}>Builder</span>
        </div>

        <nav style={{ flex: 1 }}>
          {menu.map((item) => {
            const isActive = pathname === item.path
            return (
              <Link key={item.path} href={item.path} style={{ 
                display: 'flex', alignItems: 'center', gap: 14, 
                padding: '14px 18px', borderRadius: 12, marginBottom: 8,
                textDecoration: 'none', color: isActive ? '#6366f1' : '#64748b',
                background: isActive ? '#f0f0ff' : 'transparent',
                fontWeight: isActive ? 700 : 500, fontSize: '0.92rem',
                transition: 'all 0.2s'
              }}>
                <span style={{ fontSize: '1.2rem', marginBottom: 2 }}>{item.icon}</span>
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div style={{ marginTop: 'auto', paddingTop: 24, borderTop: '1px solid #f5f5f7' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 24, padding: '0 12px' }}>
            <div style={{ width: 42, height: 42, background: '#f0f0f5', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1rem', color: '#6366f1', fontWeight: 800 }}>
              {user?.name?.[0]?.toUpperCase() || 'U'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <div style={{ fontSize: '0.88rem', fontWeight: 700, whiteSpace: 'nowrap', textOverflow: 'ellipsis', color: '#111' }}>{user?.name || 'User'}</div>
              <div style={{ fontSize: '0.75rem', color: '#94a3b8', whiteSpace: 'nowrap', textOverflow: 'ellipsis' }}>{user?.email}</div>
            </div>
          </div>
          <button onClick={handleLogout} style={{ width: '100%', padding: '12px', background: '#fff', border: '1.5px solid #f0f0f2', borderRadius: 12, color: '#ef4444', fontWeight: 700, fontSize: '0.85rem', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8 }}>
            🚪 Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main style={{ marginLeft: 280, flex: 1, padding: '40px 60px' }}>
        {children}
      </main>

    </div>
  )
}
