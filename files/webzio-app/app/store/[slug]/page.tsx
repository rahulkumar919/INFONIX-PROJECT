'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [store, setStore] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch(`/api/store/slug/${slug}`)
        const data = await res.json()
        if (data.success) {
          setStore(data.store)
          await fetch(`/api/store/slug/${slug}/view`, { method: 'POST' })
        }
      } catch (error) {
        console.error('Error loading store:', error)
      }
      setLoading(false)
    }
    loadStore()
  }, [slug])

  if (loading) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
      }}>
        <div style={{ textAlign: 'center', color: '#fff' }}>
          <div style={{
            width: 60,
            height: 60,
            border: '4px solid rgba(255,255,255,0.3)',
            borderTop: '4px solid #fff',
            borderRadius: '50%',
            margin: '0 auto 20px'
          }}></div>
          <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading store...</p>
        </div>
      </div>
    )
  }

  if (!store) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        background: '#f8fafc',
        padding: '20px'
      }}>
        <div style={{
          textAlign: 'center',
          maxWidth: '500px',
          background: '#fff',
          padding: '60px 40px',
          borderRadius: '24px',
          boxShadow: '0 20px 60px rgba(0,0,0,0.1)'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: '20px' }}>🔍</div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '12px', color: '#0f172a' }}>
            Store Not Found
          </h1>
          <p style={{ color: '#64748b', marginBottom: '32px', fontSize: '1rem' }}>
            The store you are looking for does not exist or has been removed.
          </p>
          <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '0.9rem' }}>
            Slug: <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{slug}</code>
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
            color: '#fff',
            borderRadius: '12px',
            textDecoration: 'none',
            fontWeight: 700,
            boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
          }}>
            Go Home
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div style={{ minHeight: '100vh', background: '#f8fafc' }}>
      {/* Header */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #e2e8f0',
        padding: '20px 40px',
        boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
      }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
            {store.siteName}
          </h1>
          <div style={{ display: 'flex', gap: '12px' }}>
            <a href={`https://wa.me/${store.content?.whatsappNumber || '919999999999'}`}
              target="_blank"
              style={{
                padding: '10px 20px',
                background: '#25D366',
                color: '#fff',
                borderRadius: '8px',
                textDecoration: 'none',
                fontWeight: 700,
                fontSize: '0.9rem',
                display: 'flex',
                alignItems: 'center',
                gap: '8px'
              }}>
              📱 WhatsApp
            </a>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section style={{
        background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
        padding: '80px 40px',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
          <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>
            {store.content?.heroTitle || 'Welcome to Our Store'}
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
            {store.content?.heroSubtitle || 'Discover our amazing collection'}
          </p>
        </div>
      </section>

      {/* About Section */}
      <section style={{ padding: '60px 40px', background: '#fff' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px', color: '#0f172a' }}>
            {store.content?.aboutTitle || 'About Us'}
          </h3>
          <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.8 }}>
            {store.content?.aboutText || 'We are passionate about quality.'}
          </p>
        </div>
      </section>

      {/* Contact Section */}
      <section style={{ padding: '60px 40px', background: '#f8fafc' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '32px', color: '#0f172a', textAlign: 'center' }}>
            Get In Touch
          </h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '24px' }}>
            {store.content?.contactPhone && (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📞</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '4px' }}>Phone</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{store.content.contactPhone}</div>
              </div>
            )}
            {store.content?.contactEmail && (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📧</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '4px' }}>Email</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{store.content.contactEmail}</div>
              </div>
            )}
            {store.content?.whatsappNumber && (
              <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>💬</div>
                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '4px' }}>WhatsApp</div>
                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{store.content.whatsappNumber}</div>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: '#0f172a', color: '#fff', padding: '40px', textAlign: 'center' }}>
        <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
          {store.content?.footerDesc || 'Quality products delivered to you.'}
        </p>
        <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '16px' }}>
          Powered by StoreBuilder
        </p>
      </footer>
    </div>
  )
}
