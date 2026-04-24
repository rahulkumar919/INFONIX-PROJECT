'use client'
import { useState, useEffect } from 'react'
import { useAuthStore } from '../../../stores/authStore'

interface Category {
    _id: string
    name: string
    description: string
    icon: string
    color: string
    slug: string
}

export default function CategoriesPage() {
    const { token } = useAuthStore()
    const [categories, setCategories] = useState<Category[]>([])
    const [loading, setLoading] = useState(true)
    const [search, setSearch] = useState('')

    useEffect(() => {
        async function loadCategories() {
            try {
                const res = await fetch('/api/admin/categories', {
                    headers: { Authorization: `Bearer ${token}` }
                })
                const data = await res.json()
                if (data.success) {
                    setCategories(data.categories)
                }
            } catch (error) {
                console.error('Failed to load categories:', error)
            } finally {
                setLoading(false)
            }
        }
        loadCategories()
    }, [token])

    const filtered = categories.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) ||
        c.description?.toLowerCase().includes(search.toLowerCase())
    )

    if (loading) {
        return (
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
                <div style={{ textAlign: 'center' }}>
                    <div style={{ fontSize: '2rem', marginBottom: '12px', animation: 'pulse 1.5s infinite' }}>📁</div>
                    <div style={{ color: '#64748b', fontSize: '.9rem' }}>Loading categories...</div>
                </div>
            </div>
        )
    }

    return (
        <div>
            <style>{`
        @keyframes pulse { 0%, 100% { opacity: 1; } 50% { opacity: 0.4; } }
        .cat-card { transition: transform .25s, box-shadow .25s; }
        .cat-card:hover { transform: translateY(-4px); box-shadow: 0 12px 36px rgba(0,0,0,.12); }
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
                    📁 Categories
                </h1>
                <p style={{ color: '#64748b', fontSize: '.9rem' }}>
                    Browse {categories.length} template categories
                </p>
            </div>

            {/* Search */}
            <div style={{ marginBottom: 28 }}>
                <input
                    type="text"
                    placeholder="🔍  Search categories..."
                    value={search}
                    onChange={e => setSearch(e.target.value)}
                    style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 300, background: '#fff' }}
                />
            </div>

            {/* Count */}
            <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
                Showing {filtered.length} categor{filtered.length !== 1 ? 'ies' : 'y'}
            </p>

            {/* Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 16 }}>
                {filtered.map(cat => (
                    <div key={cat._id} className="cat-card" style={{ background: '#fff', border: `1px solid ${cat.color}25`, borderRadius: 14, padding: 20, position: 'relative', overflow: 'hidden', boxShadow: '0 2px 12px rgba(0,0,0,.04)' }}>
                        <div style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 3, background: cat.color }} />
                        <div style={{ width: 48, height: 48, background: `${cat.color}15`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', border: `1px solid ${cat.color}25`, marginBottom: 14 }}>
                            {cat.icon}
                        </div>
                        <div style={{ fontSize: '.95rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>{cat.name}</div>
                        <div style={{ fontSize: '.75rem', color: '#64748b', marginBottom: 8, lineHeight: 1.5 }}>
                            {cat.description || 'No description'}
                        </div>
                        <div style={{ fontSize: '.68rem', fontWeight: 700, color: cat.color }}>/{cat.slug}</div>
                    </div>
                ))}
            </div>

            {filtered.length === 0 && (
                <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
                    <div style={{ fontWeight: 700, marginBottom: 6 }}>No categories found</div>
                    <div style={{ fontSize: '.85rem' }}>Try a different search</div>
                </div>
            )}
        </div>
    )
}
