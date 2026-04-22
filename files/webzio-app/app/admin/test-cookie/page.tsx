'use client'
import { useEffect, useState } from 'react'

export default function TestCookiePage() {
    const [cookieInfo, setCookieInfo] = useState<any>(null)

    useEffect(() => {
        // Check localStorage
        const authStorage = localStorage.getItem('auth-storage')

        // Try to get cookie info from API
        fetch('/api/admin/test-cookie')
            .then(r => r.json())
            .then(data => {
                setCookieInfo({
                    localStorage: authStorage ? JSON.parse(authStorage) : null,
                    serverCookie: data
                })
            })
    }, [])

    return (
        <div style={{ padding: '40px', fontFamily: 'monospace' }}>
            <h1>Cookie & Auth Test</h1>
            <pre style={{ background: '#f5f5f5', padding: '20px', borderRadius: '8px', overflow: 'auto' }}>
                {JSON.stringify(cookieInfo, null, 2)}
            </pre>
        </div>
    )
}
