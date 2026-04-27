'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)', green: '#22C55E',
    red: '#EF4444', amber: '#F59E0B', bg: '#0D1117'
}

export default function SettingsPage() {
    const params = useParams()
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [storeName, setStoreName] = useState('')
    const [form, setForm] = useState({
        slug: '',
        metaTitle: '',
        metaDescription: '',
        metaKeywords: '',
        favicon: '',
        themeColor: '#7C3AED'
    })

    useEffect(() => {
        loadStore()
    }, [params.storeId, token])

    const loadStore = async () => {
        try {
            const res = await fetch(`/api/websites/${params.storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                const store = data.website
                setStoreName(store.siteName || '')
                setForm({
                    slug: store.slug || '',
                    metaTitle: store.content?.seoTitle || '',
                    metaDescription: store.content?.seoDescription || '',
                    metaKeywords: store.content?.metaKeywords || '',
                    favicon: store.content?.favicon || '',
                    themeColor: store.content?.primaryColor || '#7C3AED'
                })
            } else {
                toast.error(data.message || 'Failed to load store')
            }
        } catch (error) {
            toast.error('Failed to load settings')
            console.error(error)
        }
        setLoading(false)
    }

    const handleSave = async () => {
        if (!form.slug.trim()) {
            toast.error('URL slug is required')
            return
        }

        setSaving(true)
        try {
            const res = await fetch(`/api/websites/${params.storeId}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    siteName: storeName,
                    slug: form.slug,
                    content: {
                        seoTitle: form.metaTitle,
                        seoDescription: form.metaDescription,
                        metaKeywords: form.metaKeywords,
                        favicon: form.favicon,
                        primaryColor: form.themeColor
                    }
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('✅ Settings saved successfully!')
            } else {
                toast.error(data.message || 'Failed to update')
            }
        } catch (error) {
            toast.error('An error occurred while saving')
            console.error(error)
        }
        setSaving(false)
    }

    if (loading) return (
        <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>
            <div style={{ fontSize: '1.2rem', marginBottom: 12 }}>⏳ Loading settings...</div>
        </div>
    )

    const inputStyle = {
        width: '100%', padding: '12px 14px', background: '#0A0F1E', border: `1px solid ${C.border}`,
        borderRadius: 10, color: C.text, outline: 'none', fontSize: '0.9rem', fontFamily: 'inherit',
        transition: 'all 0.2s'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.75rem', fontWeight: 800, color: C.textMuted,
        marginBottom: 10, textTransform: 'uppercase' as const, letterSpacing: '0.05em'
    }

    const sectionStyle = {
        background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28,
        transition: 'all 0.2s'
    }

    return (
        <div style={{ padding: '32px 20px', maxWidth: 1200, margin: '0 auto', minHeight: '100vh' } as any}>
            {/* Header */}
            <div style={{ marginBottom: 40 }}>
                <div style={{ display: 'grid', gridTemplateColumns: 'auto 1fr', gap: 16, alignItems: 'start', marginBottom: 12 }}>
                    <div style={{ fontSize: '2rem' }}>⚙️</div>
                    <div>
                        <h1 style={{ fontSize: 'clamp(1.5rem, 5%, 2rem)', fontWeight: 900, color: C.text, margin: 0 }}>Site Settings</h1>
                        <p style={{ color: C.textMuted, margin: '4px 0 0 0', fontSize: '0.9rem' }}>Configure your store's technical settings and SEO</p>
                    </div>
                </div>
                <div style={{ height: 1, background: `linear-gradient(90deg, ${C.border}, transparent)`, marginTop: 16 }} />
            </div>

            <div style={{ display: 'grid', gap: 28, gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))' }}>
                {/* Store Name */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <span style={{ fontSize: '1.3rem' }}>🏪</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Store Name</h3>
                    </div>
                    <input
                        value={storeName}
                        onChange={e => setStoreName(e.target.value)}
                        placeholder="My Awesome Store"
                        style={inputStyle}
                    />
                </div>

                {/* URL Settings */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <span style={{ fontSize: '1.3rem' }}>🔗</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>URL Settings</h3>
                    </div>
                    <div>
                        <label style={labelStyle}>Store URL (Slug)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12, background: '#0A0F1E', borderRadius: 10, border: `1px solid ${C.border}`, padding: '2px', flexWrap: 'wrap' }}>
                            <span style={{ color: C.textMuted, fontSize: '0.9rem', paddingLeft: 12, whiteSpace: 'nowrap' }}>localhost:3001/</span>
                            <input
                                value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                placeholder="my-store"
                                style={{ ...inputStyle, border: 'none', background: 'transparent', flex: 1, padding: '12px 14px', minWidth: '120px' }}
                            />
                        </div>
                        <div style={{ marginTop: 10, fontSize: '0.75rem', color: C.textMuted, display: 'flex', alignItems: 'center', gap: 6 }}>
                            💡 Use lowercase letters, numbers, and hyphens only
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div style={sectionStyle}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                        <span style={{ fontSize: '1.3rem' }}>🎨</span>
                        <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>Appearance</h3>
                    </div>
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Favicon URL</label>
                            <input
                                value={form.favicon}
                                onChange={e => setForm({ ...form, favicon: e.target.value })}
                                placeholder="https://example.com/favicon.ico"
                                style={inputStyle}
                            />
                            {form.favicon && (
                                <div style={{ marginTop: 12, padding: 14, background: '#0A0F1E', borderRadius: 10, display: 'flex', alignItems: 'center', gap: 12, border: `1px solid ${C.border}` }}>
                                    <img src={form.favicon} alt="Favicon" style={{ width: 32, height: 32, borderRadius: 6 }} onError={() => { }} />
                                    <span style={{ fontSize: '0.8rem', color: C.textMuted }}>Favicon preview</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>Primary Theme Color</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center', flexWrap: 'wrap' }}>
                                <input
                                    type="color"
                                    value={form.themeColor}
                                    onChange={e => setForm({ ...form, themeColor: e.target.value })}
                                    style={{ width: 60, height: 44, border: `2px solid ${C.border}`, borderRadius: 10, cursor: 'pointer' }}
                                />
                                <input
                                    value={form.themeColor}
                                    onChange={e => setForm({ ...form, themeColor: e.target.value })}
                                    placeholder="#7C3AED"
                                    style={{ ...inputStyle, flex: 1, minWidth: '120px' }}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* SEO Settings - Full Width */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 14, padding: 28, transition: 'all 0.2s', marginTop: 28 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 20 }}>
                    <span style={{ fontSize: '1.3rem' }}>🔍</span>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, margin: 0 }}>SEO Settings</h3>
                </div>
                <div style={{ display: 'grid', gap: 20, gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))' }}>
                    <div>
                        <label style={labelStyle}>Meta Title (Page Title)</label>
                        <input
                            value={form.metaTitle}
                            onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                            placeholder="My Awesome Store - Best Products Online"
                            style={inputStyle}
                            maxLength={60}
                        />
                        <div style={{ marginTop: 8, fontSize: '0.7rem', color: C.textMuted, textAlign: 'right' }}>
                            {form.metaTitle.length}/60 characters
                        </div>
                    </div>
                    <div style={{ gridColumn: 'span 1' }}>
                        <label style={labelStyle}>Meta Keywords (comma-separated)</label>
                        <input
                            value={form.metaKeywords}
                            onChange={e => setForm({ ...form, metaKeywords: e.target.value })}
                            placeholder="online store, products, shopping, deals"
                            style={inputStyle}
                        />
                    </div>
                </div>
                <div style={{ marginTop: 20 }}>
                    <label style={labelStyle}>Meta Description</label>
                    <textarea
                        value={form.metaDescription}
                        onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                        placeholder="Discover amazing products at great prices. Shop now and get free shipping on orders over $50!"
                        rows={3}
                        style={{ ...inputStyle, resize: 'vertical' as const }}
                        maxLength={160}
                    />
                    <div style={{ marginTop: 8, fontSize: '0.7rem', color: C.textMuted, textAlign: 'right' }}>
                        {form.metaDescription.length}/160 characters
                    </div>
                </div>
            </div>

            {/* Save Button */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, paddingTop: 28, flexWrap: 'wrap' }}>
                <button onClick={handleSave} disabled={saving} style={{
                    padding: '14px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                    border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700, fontSize: '0.95rem',
                    cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1,
                    transition: 'all 0.2s', boxShadow: '0 4px 16px rgba(124, 58, 237, 0.3)', whiteSpace: 'nowrap'
                }}>
                    {saving ? '⏳ Saving...' : '💾 Save Settings'}
                </button>
            </div>
        </div>
    )
}
