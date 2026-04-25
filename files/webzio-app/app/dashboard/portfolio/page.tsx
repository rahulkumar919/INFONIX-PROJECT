'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../stores/authStore'

interface PortfolioTemplate {
    _id: string
    name: string
    category: string
    icon: string
    desc: string
    color: string
    accentColor: string
    tags: string[]
    popular: boolean
    isActive: boolean
    previewImage?: string
    templateType: string
}

interface Store {
    _id: string
    siteName: string
    slug: string
}

export default function PortfolioPage() {
    const router = useRouter()
    const { token } = useAuthStore()
    const [templates, setTemplates] = useState<PortfolioTemplate[]>([])
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')
    const [showStoreSelector, setShowStoreSelector] = useState(false)
    const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null)
    const [showPreview, setShowPreview] = useState(false)
    const [previewTemplate, setPreviewTemplate] = useState<any>(null)

    useEffect(() => {
        async function loadData() {
            try {
                // Load portfolio templates
                const templatesRes = await fetch('/api/templates?type=portfolio', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const templatesData = await templatesRes.json()
                if (templatesData.success) {
                    setTemplates(templatesData.templates) // All templates are already active from API
                }

                // Load user's stores
                const storesRes = await fetch('/api/websites', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const storesData = await storesRes.json()
                if (storesData.success) {
                    setStores(storesData.websites)
                }
            } catch (error) {
                console.error('Failed to load data:', error)
            } finally {
                setLoading(false)
            }
        }
        loadData()
    }, [token])

    const filtered = templates.filter(t =>
        t.name.toLowerCase().includes(search.toLowerCase()) ||
        t.category.toLowerCase().includes(search.toLowerCase()) ||
        t.desc.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>🖼️</div>
                    <div style={{ color: '#64748b', fontSize: '.9rem' }}>Loading portfolio templates...</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .portfolio-card { transition: transform .25s, box-shadow .25s; }
        .portfolio-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(236,72,153,.15); }
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
                    🖼️ Portfolio Templates
                </h1>
                <p style={{ color: '#64748b', fontSize: '.9rem' }}>
                    Choose from {templates.length} professional portfolio templates. Perfect for showcasing your work.
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 28 }}>
                <input
                    type="text"
                    placeholder="🔍  Search portfolio templates..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 'min(300px, 100%)', background: '#fff', minWidth: '200px' }}
                />
            </div>

            {/* Count */}
            <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
                Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(min(260px, 100%), 1fr))', gap: 16 }}>
                {filtered.map(t => (
                    <div key={t._id} className="portfolio-card" style={{ background: '#fff', border: '1px solid rgba(236,72,153,.15)', borderRadius: 14, overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
                        {/* Preview */}
                        <div style={{ height: 110, background: t.color || 'linear-gradient(135deg,#EC4899,#9D174D)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '2.5rem', position: 'relative' }}>
                            {t.previewImage ? (
                                <img src={t.previewImage} alt={t.name} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
                            ) : (
                                t.icon || '🖼️'
                            )}
                            {t.popular && (
                                <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 800 }}>
                                    🔥 Popular
                                </div>
                            )}
                            <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(236,72,153,.3)', padding: '2px 8px', borderRadius: 20, fontSize: '.6rem', fontWeight: 700, color: '#fff', border: '1px solid rgba(236,72,153,.4)' }}>
                                Portfolio
                            </div>
                        </div>

                        {/* Info */}
                        <div style={{ padding: '12px 14px' }}>
                            <div style={{ fontSize: '.88rem', fontWeight: 800, color: '#0f172a', marginBottom: 3 }}>{t.name}</div>
                            <div style={{ fontSize: '.72rem', color: '#F9A8D4', fontWeight: 700, marginBottom: 6 }}>{t.category}</div>
                            <div style={{ fontSize: '.72rem', color: '#64748b', marginBottom: 10, lineHeight: 1.5 }}>{t.desc}</div>

                            {/* Tags */}
                            <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 10 }}>
                                {t.tags.slice(0, 3).map(tag => (
                                    <span key={tag} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: 'rgba(236,72,153,.1)', color: '#F9A8D4', border: '1px solid rgba(236,72,153,.2)' }}>
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            {/* Action Buttons */}
                            <div style={{ display: 'flex', gap: 8, marginBottom: 10 }}>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        setPreviewTemplate(t)
                                        setShowPreview(true)
                                    }}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '8px',
                                        background: 'linear-gradient(135deg,#10b981,#059669)',
                                        color: '#fff',
                                        borderRadius: 6,
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '.75rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(16, 185, 129, 0.25)'
                                    }}
                                >
                                    👁️ Preview
                                </button>
                                <button
                                    onClick={(e) => {
                                        e.preventDefault()
                                        if (stores.length === 0) {
                                            // No stores - redirect to stores page with modal open
                                            router.push(`/dashboard/stores?openModal=true&template=${t._id}`)
                                        } else if (stores.length === 1) {
                                            // One store - go directly to edit
                                            router.push(`/dashboard/stores/${stores[0]._id}/edit`)
                                        } else {
                                            // Multiple stores - show selector
                                            setSelectedTemplate(t._id)
                                            setShowStoreSelector(true)
                                        }
                                    }}
                                    style={{
                                        flex: 1,
                                        textAlign: 'center',
                                        padding: '8px',
                                        background: 'linear-gradient(135deg,#EC4899,#9D174D)',
                                        color: '#fff',
                                        borderRadius: 6,
                                        border: 'none',
                                        fontWeight: 600,
                                        fontSize: '.75rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(236, 72, 153, 0.25)'
                                    }}
                                >
                                    {stores.length > 0 ? 'Use Template' : 'Use Template'}
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>No portfolio templates found</div>
                    <div style={{ fontSize: '.85rem' }}>Try a different search or check back later</div>
                </div>
            )}

            {/* Template Preview Modal */}
            {showPreview && previewTemplate && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1001, backdropFilter: 'blur(8px)' }} onClick={() => setShowPreview(false)}>
                    <div style={{ background: '#fff', borderRadius: 20, maxWidth: '95vw', maxHeight: '95vh', width: '1200px', overflow: 'hidden', boxShadow: '0 25px 50px rgba(0,0,0,0.25)' }} onClick={(e) => e.stopPropagation()}>
                        {/* Header */}
                        <div style={{ padding: '20px 24px', borderBottom: '1px solid #e5e7eb', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: '#f8fafc' }}>
                            <div>
                                <h2 style={{ fontSize: '1.25rem', fontWeight: 900, color: '#0f172a', marginBottom: 4 }}>
                                    {previewTemplate.icon} {previewTemplate.name}
                                </h2>
                                <p style={{ color: '#64748b', fontSize: '.9rem' }}>
                                    {previewTemplate.htmlCode ? '💻 HTML Template' : '🎨 Visual Template'} • Portfolio • {previewTemplate.category}
                                </p>
                            </div>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <button
                                    onClick={() => {
                                        setShowPreview(false)
                                        if (stores.length === 0) {
                                            router.push(`/dashboard/stores?openModal=true&template=${previewTemplate._id}`)
                                        } else if (stores.length === 1) {
                                            router.push(`/dashboard/stores/${stores[0]._id}/edit`)
                                        } else {
                                            setSelectedTemplate(previewTemplate._id)
                                            setShowStoreSelector(true)
                                        }
                                    }}
                                    style={{
                                        padding: '10px 20px',
                                        background: 'linear-gradient(135deg, #EC4899, #9D174D)',
                                        border: 'none',
                                        borderRadius: 10,
                                        color: '#fff',
                                        fontWeight: 700,
                                        fontSize: '.85rem',
                                        cursor: 'pointer',
                                        boxShadow: '0 4px 12px rgba(236, 72, 153, 0.3)'
                                    }}
                                >
                                    🚀 Use This Template
                                </button>
                                <button
                                    onClick={() => setShowPreview(false)}
                                    style={{
                                        padding: '8px 12px',
                                        background: '#f1f5f9',
                                        border: 'none',
                                        borderRadius: 8,
                                        color: '#64748b',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        fontSize: '1.1rem'
                                    }}
                                >
                                    ✕
                                </button>
                            </div>
                        </div>

                        {/* Preview Content */}
                        <div style={{ height: 'calc(95vh - 100px)', overflow: 'auto', background: '#f1f5f9' }}>
                            {previewTemplate.htmlCode ? (
                                // HTML Template Preview
                                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                        <div style={{ padding: '8px 16px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                                            </div>
                                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 6, padding: '4px 12px', fontSize: '.8rem', color: '#64748b' }}>
                                                🔒 localhost/{previewTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                            </div>
                                        </div>
                                        <iframe
                                            srcDoc={previewTemplate.htmlCode}
                                            style={{ width: '100%', height: '70vh', border: 'none' }}
                                            title="Template Preview"
                                            sandbox="allow-scripts allow-same-origin"
                                        />
                                    </div>
                                </div>
                            ) : (
                                // Visual Template Preview
                                <div style={{ padding: '20px', display: 'flex', justifyContent: 'center' }}>
                                    <div style={{ width: '100%', maxWidth: '1000px', background: '#fff', borderRadius: 12, overflow: 'hidden', boxShadow: '0 8px 32px rgba(0,0,0,0.1)' }}>
                                        <div style={{ padding: '8px 16px', background: '#e2e8f0', borderBottom: '1px solid #cbd5e1', display: 'flex', alignItems: 'center', gap: 8 }}>
                                            <div style={{ display: 'flex', gap: 6 }}>
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#ef4444' }} />
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b' }} />
                                                <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#22c55e' }} />
                                            </div>
                                            <div style={{ flex: 1, background: '#f8fafc', borderRadius: 6, padding: '4px 12px', fontSize: '.8rem', color: '#64748b' }}>
                                                🔒 localhost/{previewTemplate.name.toLowerCase().replace(/[^a-z0-9]/g, '-')}
                                            </div>
                                        </div>
                                        <div style={{ height: '70vh', overflow: 'auto' }}>
                                            <PortfolioTemplatePreview template={previewTemplate} />
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Store Selector Modal */}
            {showStoreSelector && (
                <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }} onClick={() => setShowStoreSelector(false)}>
                    <div style={{ background: '#fff', borderRadius: 16, padding: 32, maxWidth: 500, width: '90%', maxHeight: '80vh', overflowY: 'auto' }} onClick={(e) => e.stopPropagation()}>
                        <h2 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#0f172a', marginBottom: 8 }}>Select Store to Configure</h2>
                        <p style={{ color: '#64748b', fontSize: '.9rem', marginBottom: 24 }}>Choose which store you want to configure with this template</p>

                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            {stores.map(store => (
                                <Link
                                    key={store._id}
                                    href={`/dashboard/stores/${store._id}/edit`}
                                    style={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'space-between',
                                        padding: '16px',
                                        border: '2px solid #e5e7eb',
                                        borderRadius: 12,
                                        textDecoration: 'none',
                                        transition: 'all .2s',
                                        background: '#fff'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.borderColor = '#EC4899'
                                        e.currentTarget.style.background = '#fdf2f8'
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.borderColor = '#e5e7eb'
                                        e.currentTarget.style.background = '#fff'
                                    }}
                                >
                                    <div>
                                        <div style={{ fontSize: '.95rem', fontWeight: 700, color: '#0f172a', marginBottom: 4 }}>{store.siteName}</div>
                                        <div style={{ fontSize: '.75rem', color: '#64748b' }}>/{store.slug}</div>
                                    </div>
                                    <div style={{ fontSize: '1.2rem' }}>→</div>
                                </Link>
                            ))}
                        </div>

                        <button
                            onClick={() => setShowStoreSelector(false)}
                            style={{
                                marginTop: 20,
                                width: '100%',
                                padding: '12px',
                                background: '#f1f5f9',
                                border: 'none',
                                borderRadius: 10,
                                color: '#64748b',
                                fontWeight: 600,
                                cursor: 'pointer',
                                fontSize: '.9rem'
                            }}
                        >
                            Cancel
                        </button>
                    </div>
                </div>
            )}
        </div>
    )
}

// Portfolio Template Preview Component
function PortfolioTemplatePreview({ template }: { template: any }) {
    const cfg = template.config || {}
    const headFont = cfg.headingFont || 'Playfair Display'
    const bodyFont = cfg.bodyFont || 'Inter'
    const fontSize = cfg.baseFontSize || 16
    const primary = cfg.primaryColor || template.accentColor || '#EC4899'
    const secondary = cfg.secondaryColor || '#9D174D'
    const textColor = cfg.textColor || '#111827'
    const bgLight = cfg.bgLight || '#FFFFFF'
    const bgDark = cfg.bgDark || '#0F172A'
    const cardBg = cfg.cardBg || '#FDF2F8'
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
                    <div style={{ width: 28, height: 28, background: isMinimal ? primary : 'rgba(255,255,255,.25)', borderRadius: 8, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '.9rem' }}>{template.icon || '🖼️'}</div>
                    <span style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1rem', color: isMinimal ? textColor : '#fff' }}>
                        {template.name || 'Portfolio'}
                    </span>
                </div>
                <div style={{ display: 'flex', gap: 20, alignItems: 'center' }}>
                    {['Home', 'Portfolio', 'About', 'Contact'].map(l => (
                        <span key={l} style={{ fontSize: '.78rem', fontWeight: 500, color: isMinimal ? textColor : 'rgba(255,255,255,.85)', cursor: 'pointer' }}>{l}</span>
                    ))}
                    {cfg.showNavCTA && (
                        <span style={{ fontSize: '.75rem', fontWeight: 700, padding: '7px 16px', borderRadius: 8, background: isMinimal ? primary : 'rgba(255,255,255,.18)', color: '#fff', border: isMinimal ? 'none' : '1px solid rgba(255,255,255,.3)', cursor: 'pointer' }}>
                            {cfg.navCTAText || 'Get Started'}
                        </span>
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
                            ✨ Portfolio
                        </div>
                        <h1 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: 'clamp(1.6rem,3vw,2.4rem)', lineHeight: 1.15, marginBottom: 14, color: cfg.heroBgImage ? '#fff' : textColor }}>
                            {cfg.heroTitle || template.name || 'My Portfolio'}
                        </h1>
                        <p style={{ fontSize: '.9rem', opacity: .75, marginBottom: 24, lineHeight: 1.7, maxWidth: 480 }}>
                            {cfg.heroSubtitle || template.desc || 'Showcasing my creative work and projects.'}
                        </p>
                        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', justifyContent: cfg.heroLayout !== 'split' ? 'center' : 'flex-start' }}>
                            <span style={{ padding: '10px 24px', borderRadius: 10, background: primary, color: '#fff', fontWeight: 700, fontSize: '.85rem', cursor: 'pointer', boxShadow: `0 4px 14px ${primary}40` }}>
                                View Portfolio
                            </span>
                            <span style={{ padding: '10px 24px', borderRadius: 10, border: `1.5px solid ${cfg.heroBgImage ? 'rgba(255,255,255,.4)' : primary}`, color: cfg.heroBgImage ? '#fff' : primary, fontWeight: 600, fontSize: '.85rem', cursor: 'pointer' }}>
                                Contact Me
                            </span>
                        </div>
                    </div>
                    {cfg.heroLayout === 'split' && (
                        <div style={{ background: `${primary}12`, borderRadius: 20, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '4rem', minHeight: 200, border: `1px solid ${primary}20` }}>
                            {template.icon || '🖼️'}
                        </div>
                    )}
                </section>
            )}

            {/* Portfolio Gallery */}
            <section style={{ padding: '48px 40px', background: cardBg }}>
                <div style={{ textAlign: 'center', marginBottom: 32 }}>
                    <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 8 }}>My Work</h2>
                    <div style={{ width: 40, height: 3, background: primary, borderRadius: 2, margin: '0 auto' }} />
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 20 }}>
                    {[
                        { title: 'Project Alpha', category: 'Web Design', image: '🎨' },
                        { title: 'Brand Identity', category: 'Branding', image: '🏷️' },
                        { title: 'Mobile App', category: 'UI/UX', image: '📱' },
                        { title: 'E-commerce Site', category: 'Development', image: '🛒' },
                        { title: 'Photography', category: 'Creative', image: '📸' },
                        { title: 'Logo Design', category: 'Branding', image: '✨' }
                    ].map((project, i) => (
                        <div key={i} style={{ background: bgLight, borderRadius: 14, overflow: 'hidden', border: `1px solid ${primary}12`, boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'transform .3s ease' }}>
                            <div style={{ height: 180, background: `linear-gradient(135deg,${primary}20,${secondary}15)`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '3rem', position: 'relative' }}>
                                {project.image}
                                <div style={{ position: 'absolute', top: 12, left: 12, background: 'rgba(0,0,0,0.6)', color: '#fff', padding: '4px 10px', borderRadius: 20, fontSize: '.7rem', fontWeight: 600 }}>
                                    {project.category}
                                </div>
                            </div>
                            <div style={{ padding: '16px' }}>
                                <h3 style={{ fontSize: '.95rem', fontWeight: 700, color: textColor, marginBottom: 8 }}>{project.title}</h3>
                                <p style={{ fontSize: '.8rem', color: `${textColor}70`, lineHeight: 1.6 }}>
                                    A beautiful project showcasing modern design principles and user experience.
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </section>

            {/* About Section */}
            <section style={{ padding: '48px 40px', background: bgLight }}>
                <div style={{ maxWidth: '800px', margin: '0 auto', textAlign: 'center' }}>
                    <h2 style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.5rem', color: textColor, marginBottom: 16 }}>About Me</h2>
                    <div style={{ width: 40, height: 3, background: secondary, borderRadius: 2, margin: '0 auto 24px' }} />
                    <p style={{ fontSize: '.9rem', color: `${textColor}80`, lineHeight: 1.8, marginBottom: 32 }}>
                        I'm a passionate creative professional with expertise in design, development, and digital strategy.
                        I love bringing ideas to life through beautiful, functional solutions that make a difference.
                    </p>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
                        {[
                            { skill: 'Design', level: '95%' },
                            { skill: 'Development', level: '88%' },
                            { skill: 'Strategy', level: '92%' }
                        ].map((skill, i) => (
                            <div key={i} style={{ textAlign: 'left' }}>
                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8 }}>
                                    <span style={{ fontSize: '.85rem', fontWeight: 600, color: textColor }}>{skill.skill}</span>
                                    <span style={{ fontSize: '.8rem', color: primary, fontWeight: 700 }}>{skill.level}</span>
                                </div>
                                <div style={{ height: 6, background: `${primary}15`, borderRadius: 3, overflow: 'hidden' }}>
                                    <div style={{ height: '100%', background: primary, width: skill.level, borderRadius: 3 }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Footer */}
            {cfg.sections?.footer !== false && (
                <>
                    <footer style={{ padding: '40px', background: bgDark }}>
                        <div style={{ textAlign: 'center' }}>
                            <div style={{ fontFamily: `'${headFont}',serif`, fontWeight: 900, fontSize: '1.2rem', color: '#fff', marginBottom: 16 }}>{template.name || 'Portfolio'}</div>
                            <div style={{ fontSize: '.85rem', color: 'rgba(255,255,255,.6)', marginBottom: 24 }}>
                                Let's work together to bring your ideas to life.
                            </div>
                            <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 24 }}>
                                {['📧', '💼', '📸', '🐦'].map((icon, i) => (
                                    <div key={i} style={{ width: 40, height: 40, background: 'rgba(255,255,255,.1)', borderRadius: 10, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.1rem', cursor: 'pointer', transition: 'background .3s ease' }}>
                                        {icon}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </footer>
                    <div style={{ padding: '16px 40px', background: bgDark, borderTop: '1px solid rgba(255,255,255,.1)', textAlign: 'center' }}>
                        <span style={{ fontSize: '.75rem', color: 'rgba(255,255,255,.4)' }}>{cfg.footerCopyright || '© 2026 All rights reserved.'}</span>
                    </div>
                </>
            )}
        </div>
    )
}
