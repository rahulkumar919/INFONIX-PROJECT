'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import toast from 'react-hot-toast'

export default function PortfoliosDashboard() {
    const [portfolios, setPortfolios] = useState([])
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPortfolios()
    }, [])

    const fetchPortfolios = async () => {
        try {
            const res = await fetch('/api/portfolios')
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setPortfolios(data)
        } catch (error) {
            toast.error('Failed to load portfolios')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    const deletePortfolio = async (id: string) => {
        if (!confirm('Are you sure?')) return
        try {
            const res = await fetch(`/api/portfolios/${id}`, { method: 'DELETE' })
            if (!res.ok) throw new Error('Failed to delete')
            setPortfolios(portfolios.filter((p: any) => p._id !== id))
            toast.success('Portfolio deleted')
        } catch (error) {
            toast.error('Failed to delete portfolio')
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 4%' }}>
            <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900 }}>My Portfolios</h1>
                    <Link href="/dashboard/portfolios/create" style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600 }}>
                        + Create Portfolio
                    </Link>
                </div>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '3rem' }}>Loading...</div>
                ) : portfolios.length === 0 ? (
                    <div style={{ textAlign: 'center', padding: '3rem', background: 'white', borderRadius: 12 }}>
                        <p style={{ color: '#6b7280', marginBottom: '1rem' }}>No portfolios yet. Create your first one!</p>
                        <Link href="/dashboard/portfolios/create" style={{ padding: '0.75rem 1.5rem', background: '#4f46e5', color: 'white', borderRadius: 8, textDecoration: 'none', fontWeight: 600, display: 'inline-block' }}>
                            Create Portfolio
                        </Link>
                    </div>
                ) : (
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
                        {portfolios.map((portfolio: any) => (
                            <div key={portfolio._id} style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)', transition: 'all 0.3s' }} onMouseEnter={(e) => { e.currentTarget.style.transform = 'translateY(-4px)'; e.currentTarget.style.boxShadow = '0 8px 32px rgba(0,0,0,0.12)' }} onMouseLeave={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)' }}>
                                <div style={{ padding: '1.5rem' }}>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{portfolio.fullName}</h3>
                                    <p style={{ color: '#6b7280', fontSize: '0.9rem', marginBottom: '1rem' }}>{portfolio.category}</p>
                                    <p style={{ color: '#9ca3af', fontSize: '0.85rem', marginBottom: '1.5rem' }}>{portfolio.description}</p>
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1.5rem' }}>
                                        {portfolio.sections?.skills?.items?.slice(0, 3).map((skill: any, idx: number) => (
                                            <span key={idx} style={{ background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: 20, fontSize: '0.75rem', color: '#6b7280' }}>
                                                {skill.name}
                                            </span>
                                        ))}
                                    </div>
                                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                                        <Link href={`/dashboard/portfolios/${portfolio._id}`} style={{ flex: 1, padding: '0.5rem', background: '#4f46e5', color: 'white', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                                            Edit
                                        </Link>
                                        <Link href={`/portfolio/${portfolio.slug}`} target="_blank" style={{ flex: 1, padding: '0.5rem', background: '#e5e7eb', color: '#1a1a1a', borderRadius: 6, textDecoration: 'none', textAlign: 'center', fontWeight: 600, fontSize: '0.9rem' }}>
                                            View
                                        </Link>
                                        <button onClick={() => deletePortfolio(portfolio._id)} style={{ flex: 1, padding: '0.5rem', background: '#fee2e2', color: '#dc2626', border: 'none', borderRadius: 6, fontWeight: 600, fontSize: '0.9rem', cursor: 'pointer' }}>
                                            Delete
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
