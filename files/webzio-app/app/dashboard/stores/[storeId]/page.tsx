'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../../stores/authStore'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'

const C = {
  blue: '#3B82F6', blueLight: '#60A5FA', card: '#111827', border: 'rgba(59,130,246,0.15)',
  text: '#E2E8F0', textMuted: '#6B7280', green: '#22C55E', red: '#EF4444',
  amber: '#F59E0B', bg: '#0D1117',
}

function Stat({ label, value, icon, color, sub }: any) {
  return (
    <div style={{ background: C.card, border: `1px solid ${color}20`, borderRadius: 14, padding: '22px 20px', position: 'relative', overflow: 'hidden' }}>
      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 2, background: color }} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 14 }}>
        <div style={{ width: 44, height: 44, background: `${color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.3rem', border: `1px solid ${color}25` }}>{icon}</div>
        {sub && <div style={{ fontSize: '0.68rem', fontWeight: 800, color, background: `${color}15`, padding: '3px 9px', borderRadius: 20 }}>{sub}</div>}
      </div>
      <div style={{ fontSize: '0.7rem', fontWeight: 700, color: C.textMuted, textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 5 }}>{label}</div>
      <div style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text }}>{value}</div>
    </div>
  )
}

export default function StoreOverviewPage() {
  const { token } = useAuthStore()
  const params = useParams()
  const router = useRouter()
  const storeId = params?.storeId as string
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetch(`/api/store/${storeId}`, { headers: { Authorization: `Bearer ${token}` } })
      .then(r => r.json()).then(d => { if (d.success) setStore(d.store) })
      .finally(() => setLoading(false))
  }, [storeId, token])

  const base = `/dashboard/stores/${storeId}`

  const quickActions = [
    { label: 'Branding & Identity', desc: 'Logo, colors, social links', icon: '🎨', path: `${base}/branding`, color: C.blue },
    { label: 'CMS Pages', desc: 'About, Contact, Custom pages', icon: '📄', path: `${base}/pages`, color: '#8B5CF6' },
    { label: 'Media Gallery', desc: 'Upload & manage images', icon: '🖼️', path: `${base}/gallery`, color: '#EC4899' },
    { label: 'SEO Settings', desc: 'Title, meta, favicon', icon: '🔍', path: `${base}/seo`, color: C.green },
    { label: 'Site Settings', desc: 'URL, username, config', icon: '⚙️', path: `${base}/settings`, color: C.amber },
    { label: 'Profile', desc: 'Name, email, password', icon: '👤', path: `${base}/profile`, color: '#14B8A6' },
  ]

  if (loading) return <div style={{ color: C.textMuted, padding: 40 }}>Loading...</div>
  if (!store) return <div style={{ color: C.red, padding: 40 }}>Store not found.</div>

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text, letterSpacing: '-0.02em' }}>{store.siteName}</h1>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, color: store.isEnabled ? C.green : C.red, background: store.isEnabled ? 'rgba(34,197,94,0.1)' : 'rgba(239,68,68,0.1)', border: `1px solid ${store.isEnabled ? 'rgba(34,197,94,0.2)' : 'rgba(239,68,68,0.2)'}` }}>
              {store.isEnabled ? '● Live' : '○ Disabled'}
            </span>
            <span style={{ fontSize: '0.72rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, color: store.isPublished ? C.blue : C.amber, background: store.isPublished ? 'rgba(59,130,246,0.1)' : 'rgba(245,158,11,0.1)' }}>
              {store.isPublished ? 'Published' : 'Draft'}
            </span>
          </div>
          <p style={{ color: C.textMuted, fontSize: '0.85rem' }}>/{store.slug} · Template #{store.templateId}</p>
        </div>
        <div style={{ display: 'flex', gap: 10 }}>
          <a href={`/store/${store.slug}`} target="_blank" rel="noreferrer" style={{ padding: '10px 18px', background: 'rgba(59,130,246,0.1)', border: `1px solid ${C.border}`, borderRadius: 10, color: C.blueLight, fontSize: '0.82rem', fontWeight: 700, textDecoration: 'none' }}>
            🔗 View Live Store
          </a>
          <Link href={`${base}/branding`} style={{ padding: '10px 18px', background: 'linear-gradient(135deg,#3B82F6,#2563EB)', border: 'none', borderRadius: 10, color: '#fff', fontSize: '0.82rem', fontWeight: 800, textDecoration: 'none', boxShadow: '0 4px 16px rgba(59,130,246,0.4)' }}>
            ✏️ Edit Store
          </Link>
        </div>
      </div>

      {/* Stats */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 18, marginBottom: 28 }}>
        <Stat label="Total Visitors" value={store.views || 0} icon="👁" color={C.blue} sub="All time" />
        <Stat label="Leads" value={store.leads || 0} icon="📋" color={C.green} sub="Enquiries" />
        <Stat label="Orders" value={store.orders || 0} icon="📦" color="#8B5CF6" sub="Received" />
        <Stat label="Gallery Images" value={(store.gallery || []).length} icon="🖼️" color="#EC4899" sub="Max 5" />
      </div>

      {/* Store Info Card */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 24 }}>
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>📋 Store Information</h3>
          {[
            { l: 'Store URL', v: `/${store.slug}` },
            { l: 'Primary Color', v: store.content?.primaryColor || '—' },
            { l: 'Contact Email', v: store.content?.contactEmail || '—' },
            { l: 'Contact Phone', v: store.content?.contactPhone || '—' },
            { l: 'WhatsApp', v: store.content?.whatsappNumber || '—' },
            { l: 'Created', v: new Date(store.createdAt).toLocaleDateString() },
          ].map(({ l, v }) => (
            <div key={l} style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', borderRadius: 8, marginBottom: 4, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.04)' }}>
              <span style={{ fontSize: '0.75rem', color: C.textMuted, fontWeight: 600 }}>{l}</span>
              <span style={{ fontSize: '0.78rem', fontWeight: 700, color: C.text }}>{v}</span>
            </div>
          ))}
        </div>

        {/* Setup Checklist */}
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 22 }}>
          <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>✅ Setup Checklist</h3>
          {[
            { label: 'Store Name', done: !!store.siteName },
            { label: 'Logo Uploaded', done: !!store.content?.logo },
            { label: 'Hero Image Set', done: !!store.content?.heroImage },
            { label: 'Contact Info Added', done: !!(store.content?.contactEmail || store.content?.contactPhone) },
            { label: 'SEO Title Set', done: !!store.content?.seoTitle },
            { label: 'Gallery Has Images', done: (store.gallery?.length || 0) > 0 },
            { label: 'Published Live', done: store.isPublished },
          ].map(({ label, done }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 12px', borderRadius: 8, marginBottom: 4, background: done ? 'rgba(34,197,94,0.05)' : 'rgba(255,255,255,0.02)', border: `1px solid ${done ? 'rgba(34,197,94,0.12)' : 'rgba(255,255,255,0.04)'}` }}>
              <div style={{ width: 18, height: 18, borderRadius: '50%', background: done ? C.green : 'rgba(255,255,255,0.08)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.65rem', color: '#fff', fontWeight: 800, flexShrink: 0 }}>{done ? '✓' : '○'}</div>
              <span style={{ fontSize: '0.8rem', fontWeight: 600, color: done ? C.text : C.textMuted }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Quick Actions */}
      <h3 style={{ fontSize: '0.92rem', fontWeight: 800, color: C.text, marginBottom: 14 }}>⚡ Quick Actions</h3>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {quickActions.map(item => (
          <Link key={item.path} href={item.path} style={{ display: 'block', background: C.card, border: `1px solid ${item.color}15`, borderRadius: 12, padding: '16px 18px', textDecoration: 'none', transition: 'all 0.2s' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6 }}>
              <span style={{ fontSize: '1.2rem' }}>{item.icon}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 800, color: C.text }}>{item.label}</span>
            </div>
            <p style={{ fontSize: '0.75rem', color: C.textMuted, margin: 0, marginBottom: 10 }}>{item.desc}</p>
            <span style={{ fontSize: '0.7rem', fontWeight: 700, color: item.color, background: `${item.color}12`, padding: '2px 10px', borderRadius: 20 }}>Open →</span>
          </Link>
        ))}
      </div>
    </div>
  )
}
