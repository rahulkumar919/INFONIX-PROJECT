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
        const res = await fetch(`/api/store/${slug}`)
        const data = await res.json()
        if (data.success) {
          setStore(data.store)
          // Track view
          await fetch(`/api/store/${slug}/view`, { method: 'POST' })
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
            The store you're looking for doesn't exist or has been removed.
          </p>
          <Link href="/" style={{
            display: 'inline-block',
            padding: '14px 32px',
            background: 'linear-gradient(135deg, #667eea, #764ba2)',
            color: '#fff',
            borderRadius: '12px',
         