'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'

export default function StorePage() {
  const params = useParams()
  const slug = params.slug as string
  const [store, setStore] = useState<any>(null)
  const [template, setTemplate] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStore() {
      try {
        const res = await fetch(`/api/store/slug/${slug}`)
        const data = await res.json()
        if (data.success) {
          setStore(data.store)
          setTemplate(data.template)
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

  // If template has HTML code, render it in iframe with store data injected
  if (template?.htmlCode) {
    // Inject store data into HTML template
    let customizedHtml = template.htmlCode
      .replace(/\{\{siteName\}\}/g, store.siteName)
      .replace(/\{\{heroTitle\}\}/g, store.content?.heroTitle || 'Welcome to Our Store')
      .replace(/\{\{heroSubtitle\}\}/g, store.content?.heroSubtitle || 'Discover our amazing collection')
      .replace(/\{\{aboutTitle\}\}/g, store.content?.aboutTitle || 'About Us')
      .replace(/\{\{aboutText\}\}/g, store.content?.aboutText || 'We are passionate about quality.')
      .replace(/\{\{contactPhone\}\}/g, store.content?.contactPhone || '')
      .replace(/\{\{contactEmail\}\}/g, store.content?.contactEmail || '')
      .replace(/\{\{whatsappNumber\}\}/g, store.content?.whatsappNumber || '')
      .replace(/\{\{footerDesc\}\}/g, store.content?.footerDesc || 'Quality products delivered to you.')

    return (
      <div style={{ minHeight: '100vh', background: '#fff' }}>
        <iframe
          srcDoc={customizedHtml}
          style={{ width: '100%', minHeight: '100vh', border: 'none' }}
          title={store.siteName}
          sandbox="allow-scripts allow-same-origin allow-forms"
        />
      </div>
    )
  }

  // Otherwise render using Visual Template with store data
  if (template) {
    return <VisualStoreTemplate store={store} template={template} />
  }

  // Fallback: Generic template if no template found
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
        background: store.content?.primaryColor ? `linear-gradient(135deg, ${store.content.primaryColor}, ${store.content.primaryColor}dd)` : 'linear-gradient(135deg, #3B82F6, #2563EB)',
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
          Powered by WebZio
        </p>
      </footer>
    </div>
  )
}

// Visual Store Template Component - renders store using template configuration
function VisualStoreTemplate({ store, template }: { store: any; template: any }) {
  const cfg = template.config || {}
  const headFont = cfg.headingFont || 'Playfair Display'
  const bodyFont = cfg.bodyFont || 'Inter'
  const fontSize = cfg.baseFontSize || 16
  const primary = store.content?.primaryColor || cfg.primaryColor || template.accentColor || '#4F46E5'
  const secondary = cfg.secondaryColor || '#7C3AED'
  const textColor = cfg.textColor || '#111827'
  const bgLight = cfg.bgLight || '#FFFFFF'
  const bgDark = cfg.bgDark || '#0F172A'
  const cardBg = cfg.cardBg || '#F8FAFF'
  const isMinimal = cfg.navbarStyle === 'minimal'
  const isTransparent = cfg.navbarStyle === 'transparent'

  const fontUrl = `https://fonts.googleapis.com/css2?family=${headFont.replace(/ /g, '+')}:wght@700;900&family=${bodyFont.replace(/ /g, '+')}:wght@400;500;600;700&display=swap`

  return (
    <div style={{ fontFamily: `'${bodyFont}',sans-serif`, fontSize: `${fontSize}px`, background: bgLight, color: textColor }}>
      <link href={fontUrl} rel="stylesheet" />

      {/* Navbar */}
      <nav style={{
        padding: '0 24px', height: 56, display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isTransparent ? 'transparent' : isMinimal ? bgLight : primary,
        borderBottom: isMinimal ? `1px solid ${primary}20` : 'none',
        position: cfg.navbarStyle === 'sticky' ? 'sticky' : 'relative',
        top: 0, zIndex: 10,
        boxShadow: isMinimal ? '0 1px 8px rgba(0,0,0,.06)' : 'none',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <div style={{ width: 28, height: 28, background: isMinimal ? primary : 'rgba(255,255,255,.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>{template.icon || '⚡'}</div>
          <span style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1rem', color: isMinimal ? textColor : '#fff' }}>
            {store.siteName}
          </span>
        </div>
        <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
          {['Home', 'About', 'Services', 'Contact'].map(l => (
            <span key={l} style={{ fontSize: '.78rem', fontWeight: 500, color: isMinimal ? textColor : 'rgba(255,255,255,.85)', cursor: 'pointer' }}>{l}</span>
          ))}
          {store.content?.whatsappNumber && (
            <a href={`https://wa.me/${store.content.whatsappNumber}`} target="_blank" style={{ fontSize: '.75rem', fontWeight: 700, padding: '7px 16px', borderRadius: 8, background: '#25D366', color: '#fff', textDecoration: 'none', cursor: 'pointer' }}>
              📱 WhatsApp
            </a>
          )}
        </div>
      </nav>

      {/* Hero */}
      {cfg.sections?.hero !== false && (
        <section style={{
          padding: cfg.heroLayout === 'fullscreen' ? '80px 40px' : '60px 40px',
          background: cfg.heroBgImage
            ? `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url(${cfg.heroBgImage}) center/cover no-repeat`
            : `linear-gradient(135deg,${primary}18,${secondary}10,${bgLight})`,
          display: cfg.heroLayout === 'split' ? 'grid' : 'flex',
          gridTemplateColumns: cfg.heroLayout === 'split' ? '1fr 1fr' : undefined,
          flexDirection: cfg.heroLayout !== 'split' ? 'column' : undefined,
          alignItems: 'center',
          justifyContent: cfg.heroLayout !== 'split' ? 'center' : undefined,
          textAlign: cfg.heroLayout !== 'split' ? 'center' : 'left',
          gap: 32,
          color: cfg.heroBgImage ? '#fff' : textColor,
          minHeight: cfg.heroLayout === 'fullscreen' ? 320 : 240,
        }}>
          <div>
            <div style={{ display: 'inline-block', padding: '4px 14px', borderRadius: 50, background: `${primary}18`, color: primary, fontSize: '.72rem', fontWeight: 700, marginBottom: 16, border: `1px solid ${primary}25` }}>
              ✨ {template.category || 'Store'}
            </div>
            <h1 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.4rem)', lineHeight: 1.15, marginBottom: 14, color: cfg.heroBgImage ? '#fff' : textColor }}>
              {store.content?.heroTitle || 'Welcome to Our Store'}
            </h1>
            <p style={{ fontSize: '.9rem', opacity: .75, marginBottom: 24, lineHeight: 1.7, maxWidth: 480 }}>
              {store.content?.heroSubtitle || 'Discover amazing products and services.'}
            </p>
            <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: cfg.heroLayout !== 'split' ? 'center' : 'flex-start' }}>
              <span style={{ padding: '10px 24px', borderRadius: 10, background: primary, color: '#fff', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', boxShadow: `0 4px 14px ${primary}40` }}>
                Explore Now
              </span>
              {store.content?.whatsappNumber && (
                <a href={`https://wa.me/${store.content.whatsappNumber}`} target="_blank" style={{ padding: '10px 24px', borderRadius: 10, border: `1.5px solid ${cfg.heroBgImage ? 'rgba(255,255,255,.4)' : primary}`, color: cfg.heroBgImage ? '#fff' : primary, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer', textDecoration: 'none' }}>
                  Contact Us
                </a>
              )}
            </div>
          </div>
          {cfg.heroLayout === 'split' && (
            <div style={{ background: `${primary}12`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: 200, border: `1px solid ${primary}20` }}>
              {template.icon || '🌐'}
            </div>
          )}
        </section>
      )}

      {/* About Section */}
      {cfg.sections?.about !== false && (
        <section style={{ padding: '48px 40px', background: bgLight }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>
                {store.content?.aboutTitle || 'About Us'}
              </h2>
              <div style={{ width: 40, height: 3, background: primary, borderRadius: 2, margin: '0 auto' }} />
            </div>
            <p style={{ fontSize: '.9rem', color: `${textColor}80`, lineHeight: 1.8, textAlign: 'center', maxWidth: '800px', margin: '0 auto' }}>
              {store.content?.aboutText || 'We are passionate about quality products and excellent service.'}
            </p>
          </div>
        </section>
      )}

      {/* Features */}
      {cfg.sections?.features !== false && (
        <section style={{ padding: '48px 40px', background: cardBg }}>
          <div style={{ textAlign: 'center', marginBottom: 32 }}>
            <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>Why Choose Us</h2>
            <div style={{ width: 40, height: 3, background: primary, borderRadius: 2, margin: '0 auto' }} />
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 16, maxWidth: '1200px', margin: '0 auto' }}>
            {[{ icon: '⚡', title: 'Fast & Reliable', desc: 'Quick service and delivery' }, { icon: '🎨', title: 'Quality Products', desc: 'Only the best for you' }, { icon: '📱', title: '24/7 Support', desc: 'Always here to help' }].map((f, i) => (
              <div key={i} style={{ padding: '20px', background: bgLight, borderRadius: 14, border: `1px solid ${primary}12`, textAlign: 'center' }}>
                <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>{f.icon}</div>
                <div style={{ fontWeight: 700, fontSize: '.88rem', color: textColor, marginBottom: 6 }}>{f.title}</div>
                <div style={{ fontSize: '.75rem', color: `${textColor}80`, lineHeight: 1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Contact Section */}
      {cfg.sections?.contact !== false && (
        <section style={{ padding: '48px 40px', background: bgLight }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <div style={{ textAlign: 'center', marginBottom: 32 }}>
              <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>Get In Touch</h2>
              <div style={{ width: 40, height: 3, background: secondary, borderRadius: 2, margin: '0 auto' }} />
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 20 }}>
              {store.content?.contactPhone && (
                <div style={{ background: cardBg, padding: '24px', borderRadius: 12, border: `1px solid ${primary}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>📞</div>
                  <div style={{ fontSize: '.8rem', color: `${textColor}60`, marginBottom: 4 }}>Phone</div>
                  <div style={{ fontSize: '.95rem', fontWeight: 700, color: textColor }}>{store.content.contactPhone}</div>
                </div>
              )}
              {store.content?.contactEmail && (
                <div style={{ background: cardBg, padding: '24px', borderRadius: 12, border: `1px solid ${primary}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>📧</div>
                  <div style={{ fontSize: '.8rem', color: `${textColor}60`, marginBottom: 4 }}>Email</div>
                  <div style={{ fontSize: '.95rem', fontWeight: 700, color: textColor }}>{store.content.contactEmail}</div>
                </div>
              )}
              {store.content?.whatsappNumber && (
                <div style={{ background: cardBg, padding: '24px', borderRadius: 12, border: `1px solid ${primary}10`, textAlign: 'center' }}>
                  <div style={{ fontSize: '2rem', marginBottom: 12 }}>💬</div>
                  <div style={{ fontSize: '.8rem', color: `${textColor}60`, marginBottom: 4 }}>WhatsApp</div>
                  <div style={{ fontSize: '.95rem', fontWeight: 700, color: textColor }}>{store.content.whatsappNumber}</div>
                </div>
              )}
            </div>
          </div>
        </section>
      )}

      {/* Footer */}
      {cfg.sections?.footer !== false && (
        <>
          <footer style={{ padding: '40px', background: bgDark }}>
            <div style={{ display: 'grid', gridTemplateColumns: `repeat(auto-fit, minmax(200px, 1fr))`, gap: 24, marginBottom: 32, maxWidth: '1200px', margin: '0 auto' }}>
              <div>
                <div style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1rem', color: '#fff', marginBottom: 10 }}>{store.siteName}</div>
                <div style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.45)', lineHeight: 1.7 }}>
                  {store.content?.footerDesc || 'Your trusted partner for quality products and services.'}
                </div>
              </div>
            </div>
          </footer>
          <div style={{ padding: '14px 40px', background: bgDark, borderTop: '1px solid rgba(255,255,255,.06)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '.72rem', color: 'rgba(255,255,255,.3)' }}>© 2026 {store.siteName}. All rights reserved.</span>
            <span style={{ fontSize: '.72rem', color: `${primary}80` }}>Powered by WebZio</span>
          </div>
        </>
      )}
    </div>
  )
}
