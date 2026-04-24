'use client'
import { useState, useEffect } from 'react'
import Link from 'next/link'
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

export default function PortfolioPage() {
    const { token } = useAuthStore()
    const [templates, setTemplates] = useState<PortfolioTemplate[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function loadPortfolioTemplates() {
            try {
                const res = await fetch('/api/admin/templates?type=portfolio', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.success) {
                    // Filter only active portfolio templates for users
                    const activeTemplates = data.templates.filter((t: PortfolioTemplate) => t.isActive)
                    setTemplates(activeTemplates)
                }
            } catch (error) {
                console.error('Failed to load portfolio templates:', error)
            } finally {
                setLoading(false)
            }
        }
        loadPortfolioTemplates()
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
                    style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 300, background: '#fff' }}
                />
            </div>

            {/* Count */}
            <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
                Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
            </p>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(260px, 1fr))', gap: 16 }}>
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

                            {/* Use Button */}
                            <Link
                                href={`/dashboard/stores?openModal=true&template=${t._id}`}
                                style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'linear-gradient(135deg,#EC4899,#9D174D)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.8rem', boxShadow: '0 3px 10px rgba(236,72,153,.25)' }}
                            >
                                Use This Template →
                            </Link>
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
        </div>
    )
}
