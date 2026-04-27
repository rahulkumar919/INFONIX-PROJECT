'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'

export default function PublicPortfolio() {
    const params = useParams()
    const slug = params.slug as string
    const [portfolio, setPortfolio] = useState<any>(null)
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        fetchPortfolio()
    }, [slug])

    const fetchPortfolio = async () => {
        try {
            const res = await fetch(`/api/portfolios/slug/${slug}`)
            if (!res.ok) throw new Error('Not found')
            const data = await res.json()
            setPortfolio(data)
        } catch (error) {
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    if (loading) return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading...</div>
    if (!portfolio) return <div style={{ padding: '2rem', textAlign: 'center' }}>Portfolio not found</div>

    return (
        <div>
            <iframe
                srcDoc={portfolio.htmlCode}
                style={{ width: '100%', height: '100vh', border: 'none' }}
                title="Portfolio"
            />
        </div>
    )
}
