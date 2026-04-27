'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import Link from 'next/link'
import { renderTemplate } from '../../lib/templateRenderer'

export default function DomainPage() {
    const params = useParams()
    const domain = params.domain as string
    const [store, setStore] = useState<any>(null)
    const [template, setTemplate] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        async function loadStore() {
            try {
                const res = await fetch(`/api/store/slug/${domain}`)
                const data = await res.json()
                if (data.success) {
                    setStore(data.store)
                    setTemplate(data.template)
                    // Track view
                    await fetch(`/api/store/slug/${domain}/view`, { method: 'POST' }).catch(() => { })
                }
            } catch (error) {
                console.error('Error loading store:', error)
            }
            setLoading(false)
        }
        loadStore()
    }, [domain])

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
                        margin: '0 auto 20px',
                        animation: 'spin 1s linear infinite'
                    }}></div>
                    <p style={{ fontSize: '1.1rem', fontWeight: 600 }}>Loading store...</p>
                </div>
                <style jsx>{`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}</style>
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
                        Domain: <code style={{ background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px' }}>{domain}</code>
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

    // If template has HTML code, render it with user data
    if (template?.htmlCode) {
        // Render template with user's store data
        const renderedHtml = renderTemplate(template.htmlCode, store)

        return (
            <div>
                <div dangerouslySetInnerHTML={{ __html: renderedHtml }} />
                <style>{`
                    * {
                        margin: 0;
                        padding: 0;
                        box-sizing: border-box;
                    }
                    body {
                        font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', 'Fira Sans', 'Droid Sans', 'Helvetica Neue', sans-serif;
                    }
                `}</style>
            </div>
        )
    }

    // Fallback: Render basic store content
    return (
        <div style={{ minHeight: '100vh', background: store.content?.backgroundColor || '#f8fafc' }}>
            {/* Header */}
            <header style={{
                background: '#fff',
                borderBottom: '1px solid #e2e8f0',
                padding: '20px 40px',
                boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}>
                <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                        {store.content?.logo && (
                            <img src={store.content.logo} alt="Logo" style={{ height: '40px', objectFit: 'contain' }} />
                        )}
                        <h1 style={{ fontSize: '1.5rem', fontWeight: 900, color: '#0f172a' }}>
                            {store.siteName}
                        </h1>
                    </div>
                    <div style={{ display: 'flex', gap: '12px' }}>
                        {store.content?.whatsappNumber && (
                            <a href={`https://wa.me/${store.content.whatsappNumber}`}
                                target="_blank"
                                rel="noopener noreferrer"
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
                        )}
                    </div>
                </div>
            </header>

            {/* Hero Section */}
            <section style={{
                background: store.content?.primaryColor ? `linear-gradient(135deg, ${store.content.primaryColor}, ${store.content.primaryColor}dd)` : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                padding: '80px 40px',
                color: '#fff',
                textAlign: 'center',
                minHeight: '400px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div style={{ maxWidth: '800px', margin: '0 auto' }}>
                    {store.content?.heroImage && (
                        <img src={store.content.heroImage} alt="Hero" style={{ maxWidth: '100%', height: 'auto', marginBottom: '24px', borderRadius: '12px' }} />
                    )}
                    <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '16px' }}>
                        {store.content?.heroTitle || 'Welcome to Our Store'}
                    </h2>
                    <p style={{ fontSize: '1.2rem', opacity: 0.9 }}>
                        {store.content?.heroSubtitle || 'Discover our amazing collection'}
                    </p>
                </div>
            </section>

            {/* About Section */}
            {store.content?.aboutText && (
                <section style={{ padding: '60px 40px', background: '#fff' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
                        <h3 style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: '20px', color: '#0f172a' }}>
                            {store.content?.aboutTitle || 'About Us'}
                        </h3>
                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'center' }}>
                            <div>
                                <p style={{ fontSize: '1.1rem', color: '#64748b', lineHeight: 1.8 }}>
                                    {store.content.aboutText}
                                </p>
                            </div>
                            {store.content?.aboutImage && (
                                <img src={store.content.aboutImage} alt="About" style={{ maxWidth: '100%', height: 'auto', borderRadius: '12px' }} />
                            )}
                        </div>
                    </div>
                </section>
            )}

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
                                <a href={`mailto:${store.content.contactEmail}`} style={{ fontSize: '1.1rem', fontWeight: 700, color: '#3B82F6', textDecoration: 'none' }}>
                                    {store.content.contactEmail}
                                </a>
                            </div>
                        )}
                        {store.content?.contactAddress && (
                            <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                <div style={{ fontSize: '2rem', marginBottom: '12px' }}>📍</div>
                                <div style={{ fontSize: '0.9rem', color: '#64748b', marginBottom: '4px' }}>Address</div>
                                <div style={{ fontSize: '1.1rem', fontWeight: 700, color: '#0f172a' }}>{store.content.contactAddress}</div>
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

            {/* Social Links */}
            {store.content?.socialLinks && Object.values(store.content.socialLinks).some((link: any) => link) && (
                <section style={{ padding: '40px', background: '#fff', borderTop: '1px solid #e2e8f0' }}>
                    <div style={{ maxWidth: '1200px', margin: '0 auto', textAlign: 'center' }}>
                        <h4 style={{ fontSize: '1rem', fontWeight: 700, marginBottom: '20px', color: '#0f172a' }}>Follow Us</h4>
                        <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', flexWrap: 'wrap' }}>
                            {store.content.socialLinks?.facebook && (
                                <a href={store.content.socialLinks.facebook} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: '#1877F2', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                                    📘 Facebook
                                </a>
                            )}
                            {store.content.socialLinks?.instagram && (
                                <a href={store.content.socialLinks.instagram} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: '#E4405F', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                                    📷 Instagram
                                </a>
                            )}
                            {store.content.socialLinks?.twitter && (
                                <a href={store.content.socialLinks.twitter} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: '#1DA1F2', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                                    🐦 Twitter
                                </a>
                            )}
                            {store.content.socialLinks?.linkedin && (
                                <a href={store.content.socialLinks.linkedin} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: '#0A66C2', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                                    💼 LinkedIn
                                </a>
                            )}
                            {store.content.socialLinks?.youtube && (
                                <a href={store.content.socialLinks.youtube} target="_blank" rel="noopener noreferrer" style={{ padding: '10px 16px', background: '#FF0000', color: '#fff', borderRadius: '8px', textDecoration: 'none', fontWeight: 700 }}>
                                    ▶️ YouTube
                                </a>
                            )}
                        </div>
                    </div>
                </section>
            )}

            {/* Footer */}
            <footer style={{ background: '#0f172a', color: '#fff', padding: '40px', textAlign: 'center' }}>
                <p style={{ fontSize: '0.9rem', opacity: 0.8 }}>
                    {store.content?.footerDesc || 'Quality products delivered to you.'}
                </p>
                <p style={{ fontSize: '0.8rem', opacity: 0.6, marginTop: '16px' }}>
                    Powered by Webrazeo
                </p>
            </footer>
        </div>
    )
}