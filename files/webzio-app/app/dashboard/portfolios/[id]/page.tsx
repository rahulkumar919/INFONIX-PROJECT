'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import toast from 'react-hot-toast'

export default function PortfolioDetail() {
    const params = useParams()
    const id = params.id as string
    const [portfolio, setPortfolio] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [activeTab, setActiveTab] = useState('preview')

    useEffect(() => {
        fetchPortfolio()
    }, [id])

    const fetchPortfolio = async () => {
        try {
            const res = await fetch(`/api/portfolios/${id}`)
            if (!res.ok) throw new Error('Failed to fetch')
            const data = await res.json()
            setPortfolio(data)
        } catch (error) {
            toast.error('Failed to load portfolio')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    if (!portfolio) return <div style={{ padding: '2rem', textAlign: 'center' }}>Portfolio not found</div>

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 4%' }}>
            <div style={{ maxWidth: 1400, margin: '0 auto' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, marginBottom: '2rem' }}>{portfolio.fullName}'s Portfolio</h1>

                {/* Tabs */}
                <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid #e5e7eb' }}>
                    {['preview', 'html', 'css', 'js'].map(tab => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            style={{
                                padding: '0.75rem 1.5rem',
                                background: activeTab === tab ? '#4f46e5' : 'transparent',
                                color: activeTab === tab ? 'white' : '#6b7280',
                                border: 'none',
                                borderRadius: '8px 8px 0 0',
                                fontWeight: 600,
                                cursor: 'pointer',
                                textTransform: 'uppercase',
                                fontSize: '0.85rem',
                            }}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Preview Tab */}
                {activeTab === 'preview' && (
                    <div style={{ background: 'white', borderRadius: 12, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <iframe
                            srcDoc={portfolio.htmlCode}
                            style={{ width: '100%', height: '800px', border: 'none' }}
                            title="Portfolio Preview"
                        />
                    </div>
                )}

                {/* HTML Tab */}
                {activeTab === 'html' && (
                    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 600 }}>HTML Code</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(portfolio.htmlCode)
                                    toast.success('Copied to clipboard!')
                                }}
                                style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                            >
                                Copy
                            </button>
                        </div>
                        <pre style={{ background: '#1a1a1a', color: '#00ff00', padding: '1rem', borderRadius: 8, overflow: 'auto', maxHeight: '600px', fontSize: '0.85rem' }}>
                            {portfolio.htmlCode}
                        </pre>
                    </div>
                )}

                {/* CSS Tab */}
                {activeTab === 'css' && (
                    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 600 }}>CSS Code</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(portfolio.cssCode)
                                    toast.success('Copied to clipboard!')
                                }}
                                style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                            >
                                Copy
                            </button>
                        </div>
                        <pre style={{ background: '#1a1a1a', color: '#00ff00', padding: '1rem', borderRadius: 8, overflow: 'auto', maxHeight: '600px', fontSize: '0.85rem' }}>
                            {portfolio.cssCode}
                        </pre>
                    </div>
                )}

                {/* JS Tab */}
                {activeTab === 'js' && (
                    <div style={{ background: 'white', borderRadius: 12, padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                            <h3 style={{ fontWeight: 600 }}>JavaScript Code</h3>
                            <button
                                onClick={() => {
                                    navigator.clipboard.writeText(portfolio.jsCode)
                                    toast.success('Copied to clipboard!')
                                }}
                                style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer', fontWeight: 600 }}
                            >
                                Copy
                            </button>
                        </div>
                        <pre style={{ background: '#1a1a1a', color: '#00ff00', padding: '1rem', borderRadius: 8, overflow: 'auto', maxHeight: '600px', fontSize: '0.85rem' }}>
                            {portfolio.jsCode}
                        </pre>
                    </div>
                )}
            </div>
        </div>
    )
}
