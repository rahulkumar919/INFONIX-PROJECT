'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function SettingsPage() {
    const params = useParams()
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
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
    }, [])

    const loadStore = async () => {
        try {
            const res = await fetch(`/api/store/${params.storeId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                const store = data.website
                setForm({
                    slug: store.slug || '',
                    metaTitle: store.metaTitle || '',
                    metaDescription: store.metaDescription || '',
                    metaKeywords: store.metaKeywords || '',
                    favicon: store.favicon || '',
                    themeColor: store.themeColor || '#7C3AED'
                })
            }
        } catch (error) {
            toast.error('Failed to load settings')
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
            const res = await fetch(`/api/store/${params.storeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Settings updated successfully!')
            } else {
                toast.error(data.message || 'Failed to update')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
        setSaving(false)
    }

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>

    const inputStyle = {
        width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`,
        borderRadius: 8, color: C.text, outline: 'none', fontSize: '0.9rem'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.8rem', fontWeight: 700, color: C.textMuted,
        marginBottom: 8, textTransform: 'uppercase' as const
    }

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>⚙️ Site Settings</h1>
                <p style={{ color: C.textMuted }}>Configure your store's technical settings</p>
            </div>

            <div style={{ display: 'grid', gap: 32 }}>
                {/* URL Settings */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🔗 URL Settings</h3>
                    <div>
                        <label style={labelStyle}>Store URL (Slug)</label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                            <span style={{ color: C.textMuted, fontSize: '0.9rem' }}>yoursite.com/store/</span>
                            <input
                                value={form.slug}
                                onChange={e => setForm({ ...form, slug: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '') })}
                                placeholder="my-store"
                                style={{ ...inputStyle, flex: 1 }}
                            />
                        </div>
                        <div style={{ marginTop: 8, fontSize: '0.75rem', color: C.textMuted }}>
                            💡 Use lowercase letters, numbers, and hyphens only
                        </div>
                    </div>
                </div>

                {/* SEO Settings */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🔍 SEO Settings</h3>
                    <div style={{ display: 'grid', gap: 20 }}>
                        <div>
                            <label style={labelStyle}>Meta Title</label>
                            <input
                                value={form.metaTitle}
                                onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                                placeholder="My Awesome Store - Best Products Online"
                                style={inputStyle}
                                maxLength={60}
                            />
                            <div style={{ marginTop: 6, fontSize: '0.7rem', color: C.textMuted, textAlign: 'right' }}>
                                {form.metaTitle.length}/60 characters
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Meta Description</label>
                            <textarea
                                value={form.metaDescription}
                                onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                                placeholder="Discover amazing products at great prices. Shop now and get free shipping on orders over $50!"
                                rows={3}
                                style={{ ...inputStyle, resize: 'vertical' as const }}
                                maxLength={160}
                            />
                            <div style={{ marginTop: 6, fontSize: '0.7rem', color: C.textMuted, textAlign: 'right' }}>
                                {form.metaDescription.length}/160 characters
                            </div>
                        </div>
                        <div>
                            <label style={labelStyle}>Meta Keywords (comma-separated)</label>
                            <input
                                value={form.metaKeywords}
                                onChange={e => setForm({ ...form, metaKeywords: e.target.value })}
                                placeholder="online store, products, shopping, deals"
                                style={inputStyle}
                            />
                        </div>
                    </div>
                </div>

                {/* Appearance */}
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24 }}>
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>🎨 Appearance</h3>
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
                                <div style={{ marginTop: 12, padding: 16, background: '#0A0F1E', borderRadius: 8, display: 'flex', alignItems: 'center', gap: 12 }}>
                                    <img src={form.favicon} alt="Favicon" style={{ width: 32, height: 32 }} />
                                    <span style={{ fontSize: '0.8rem', color: C.textMuted }}>Favicon preview</span>
                                </div>
                            )}
                        </div>
                        <div>
                            <label style={labelStyle}>Theme Color</label>
                            <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                                <input
                                    type="color"
                                    value={form.themeColor}
                                    onChange={e => setForm({ ...form, themeColor: e.target.value })}
                                    style={{ width: 60, height: 42, border: `1px solid ${C.border}`, borderRadius: 8, cursor: 'pointer' }}
                                />
                                <input
                                    value={form.themeColor}
                                    onChange={e => setForm({ ...form, themeColor: e.target.value })}
                                    placeholder="#7C3AED"
                                    style={{ ...inputStyle, flex: 1 }}
                                />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Save Button */}
                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
                    <button onClick={handleSave} disabled={saving} style={{
                        padding: '14px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                        border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                    }}>
                        {saving ? 'Saving...' : '💾 Save Settings'}
                    </button>
                </div>
            </div>
        </div>
    )
}
