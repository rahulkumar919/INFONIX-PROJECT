'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

interface Store {
    _id: string
    siteName: string
    slug: string
    templateCategory: string
    content: {
        heroTitle?: string
        aboutText?: string
        primaryColor?: string
    }
    createdAt: string
    views: number
}

export default function ListingsPage() {
    const [stores, setStores] = useState<Store[]>([])
    const [loading, setLoading] = useState(true)
    const [searchName, setSearchName] = useState('')
    const [searchCategory, setSearchCategory] = useState('')

    useEffect(() => {
        loadStores()
    }, [])

    const loadStores = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/listings')
            const data = await res.json()
            if (data.success) {
                setStores(data.stores)
            }
        } catch (error) {
            console.error('Failed to load stores:', error)
        }
        setLoading(false)
    }

    const filteredStores = stores.filter(store => {
        const matchesName = !searchName || store.siteName.toLowerCase().includes(searchName.toLowerCase())
        const matchesCategory = !searchCategory || store.templateCategory.toLowerCase().includes(searchCategory.toLowerCase())
        return matchesName && matchesCategory
    })

    const categories = Array.from(new Set(stores.map(s => s.templateCategory).filter(Boolean)))

    return (
        <div style={{ minHeight: '100vh', background: '#FDF1F1', fontFamily: "'Inter', sans-serif" }}>
            {/* Header */}
            <div style={{
                background: 'white',
                borderBottom: '1px solid rgba(0,0,0,0.08)',
                padding: '20px 5%',
                position: 'sticky',
                top: 0,
                zIndex: 100,
                backdropFilter: 'blur(10px)'
            }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <Link href="/" style={{
                        fontSize: '1.5rem',
                        fontWeight: 900,
                        color: '#FF6B7A',
                        textDecoration: 'none',
                        display: 'inline-block',
                        marginBottom: 20
                    }}>
                        ← Back to Home
                    </Link>
                    <h1 style={{
                        fontSize: 'clamp(1.8rem, 4vw, 2.5rem)',
                        fontWeight: 900,
                        color: '#1a1a1a',
                        marginBottom: 8
                    }}>
                        Store Listings
                    </h1>
                    <p style={{ color: '#6b7280', fontSize: '1rem' }}>
                        Discover amazing stores created by our community
                    </p>
                </div>
            </div>

            {/* Search Section */}
            <div style={{ padding: '40px 5%', maxWidth: 1200, margin: '0 auto' }}>
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
                    gap: 16,
                    marginBottom: 40
                }}>
                    <input
                        type="text"
                        placeholder="Search by company name"
                        value={searchName}
                        onChange={(e) => setSearchName(e.target.value)}
                        style={{
                            padding: '14px 20px',
                            borderRadius: 12,
                            border: '2px solid #f0f0f0',
                            fontSize: '.95rem',
                            outline: 'none',
                            transition: 'all .2s',
                            background: 'white'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B7A'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                    />
                    <input
                        type="text"
                        placeholder="Search by category"
                        value={searchCategory}
                        onChange={(e) => setSearchCategory(e.target.value)}
                        style={{
                            padding: '14px 20px',
                            borderRadius: 12,
                            border: '2px solid #f0f0f0',
                            fontSize: '.95rem',
                            outline: 'none',
                            transition: 'all .2s',
                            background: 'white'
                        }}
                        onFocus={(e) => e.currentTarget.style.borderColor = '#FF6B7A'}
                        onBlur={(e) => e.currentTarget.style.borderColor = '#f0f0f0'}
                    />
                    <button
                        onClick={() => { setSearchName(''); setSearchCategory('') }}
                        style={{
                            padding: '14px 32px',
                            background: 'linear-gradient(135deg, #FF6B7A, #FF8A94)',
                            color: 'white',
                            border: 'none',
                            borderRadius: 12,
                            fontSize: '.95rem',
                            fontWeight: 700,
                            cursor: 'pointer',
                            transition: 'transform .2s'
                        }}
                        onMouseEnter={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(-2px)'}
                        onMouseLeave={(e) => (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'}
                    >
                        Clear Filters
                    </button>
                </div>

                {/* Categories */}
                {categories.length > 0 && (
                    <div style={{ marginBottom: 30 }}>
                        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                            {categories.map(cat => (
                                <button
                                    key={cat}
                                    onClick={() => setSearchCategory(cat)}
                                    style={{
                                        padding: '8px 16px',
                                        background: searchCategory === cat ? '#FF6B7A' : 'white',
                                        color: searchCategory === cat ? 'white' : '#6b7280',
                                        border: `2px solid ${searchCategory === cat ? '#FF6B7A' : '#f0f0f0'}`,
                                        borderRadius: 50,
                                        fontSize: '.85rem',
                                        fontWeight: 600,
                                        cursor: 'pointer',
                                        transition: 'all .2s'
                                    }}
                                >
                                    {cat}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                {/* Results Count */}
                <div style={{
                    marginBottom: 24,
                    fontSize: '.9rem',
                    color: '#6b7280',
                    fontWeight: 600
                }}>
                    {loading ? 'Loading...' : `${filteredStores.length} stores found`}
                </div>

                {/* Stores Grid */}
                {loading ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>⏳</div>
                        <div style={{ color: '#6b7280' }}>Loading stores...</div>
                    </div>
                ) : filteredStores.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '60px 0' }}>
                        <div style={{ fontSize: '3rem', marginBottom: 16 }}>🔍</div>
                        <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#1a1a1a', marginBottom: 8 }}>
                            No stores found
                        </div>
                        <div style={{ color: '#6b7280' }}>
                            Try adjusting your search filters
                        </div>
                    </div>
                ) : (
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))',
                        gap: 24
                    }}>
                        {filteredStores.map((store) => (
                            <Link
                                key={store._id}
                                href={`/store/${store.slug}`}
                                target="_blank"
                                style={{
                                    textDecoration: 'none',
                                    background: 'white',
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    border: '2px solid #f0f0f0',
                                    transition: 'all .3s ease',
                                    display: 'block'
                                }}
                                onMouseEnter={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(-8px)'
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 12px 40px rgba(255,107,122,0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    (e.currentTarget as HTMLElement).style.transform = 'translateY(0)'
                                        (e.currentTarget as HTMLElement).style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                                }}
                            >
                                {/* Store Header */}
                                <div style={{
                                    padding: 24,
                                    background: store.content?.primaryColor || '#FF6B7A',
                                    minHeight: 120,
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'center',
                                    position: 'relative',
                                    overflow: 'hidden'
                                }}>
                                    <div style={{
                                        position: 'absolute',
                                        top: -20,
                                        right: -20,
                                        width: 100,
                                        height: 100,
                                        background: 'rgba(255,255,255,0.1)',
                                        borderRadius: '50%'
                                    }} />
                                    <div style={{
                                        fontSize: '2rem',
                                        marginBottom: 8,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {store.templateCategory === 'Restaurant' ? '🍴' :
                                            store.templateCategory === 'Hotel' ? '🏨' :
                                                store.templateCategory === 'Pharmacy' ? '💊' :
                                                    store.templateCategory === 'Gym' ? '💪' :
                                                        store.templateCategory === 'Salon' ? '💅' : '🏪'}
                                    </div>
                                    <h3 style={{
                                        fontSize: '1.3rem',
                                        fontWeight: 900,
                                        color: 'white',
                                        marginBottom: 4,
                                        position: 'relative',
                                        zIndex: 1
                                    }}>
                                        {store.siteName}
                                    </h3>
                                    {store.templateCategory && (
                                        <div style={{
                                            display: 'inline-block',
                                            padding: '4px 12px',
                                            background: 'rgba(255,255,255,0.2)',
                                            borderRadius: 50,
                                            fontSize: '.75rem',
                                            fontWeight: 700,
                                            color: 'white',
                                            width: 'fit-content',
                                            position: 'relative',
                                            zIndex: 1
                                        }}>
                                            {store.templateCategory}
                                        </div>
                                    )}
                                </div>

                                {/* Store Info */}
                                <div style={{ padding: 20 }}>
                                    <div style={{
                                        fontSize: '.85rem',
                                        color: '#6b7280',
                                        marginBottom: 12,
                                        lineHeight: 1.6,
                                        display: '-webkit-box',
                                        WebkitLineClamp: 2,
                                        WebkitBoxOrient: 'vertical',
                                        overflow: 'hidden'
                                    }}>
                                        {store.content?.heroTitle || store.content?.aboutText || 'Visit our store to explore more'}
                                    </div>

                                    <div style={{
                                        display: 'flex',
                                        justifyContent: 'space-between',
                                        alignItems: 'center',
                                        paddingTop: 12,
                                        borderTop: '1px solid #f0f0f0'
                                    }}>
                                        <div style={{ fontSize: '.75rem', color: '#9ca3af' }}>
                                            👁️ {store.views || 0} views
                                        </div>
                                        <div style={{
                                            padding: '6px 16px',
                                            background: 'rgba(255,107,122,0.1)',
                                            color: '#FF6B7A',
                                            borderRadius: 50,
                                            fontSize: '.8rem',
                                            fontWeight: 700
                                        }}>
                                            Visit Website →
                                        </div>
                                    </div>
                                </div>
                            </Link>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
