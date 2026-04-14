'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function EditPagePage() {
    const params = useParams()
    const router = useRouter()
    const { token } = useAuthStore()
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [form, setForm] = useState({
        title: '',
        slug: '',
        content: '',
        metaTitle: '',
        metaDescription: '',
        isPublished: true
    })

    useEffect(() => {
        loadPage()
    }, [])

    const loadPage = async () => {
        try {
            const res = await fetch(`/api/store/${params.storeId}/pages/${params.pageId}`, {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success) {
                const page = data.page
                setForm({
                    title: page.title,
                    slug: page.slug,
                    content: page.content || '',
                    metaTitle: page.metaTitle || '',
                    metaDescription: page.metaDescription || '',
                    isPublished: page.isPublished
                })
            } else {
                toast.error('Page not found')
                router.back()
            }
        } catch (error) {
            toast.error('Failed to load page')
        }
        setLoading(false)
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        if (!form.title || !form.slug) {
            toast.error('Title and slug are required')
            return
        }

        setSaving(true)
        try {
            const res = await fetch(`/api/store/${params.storeId}/pages/${params.pageId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(form)
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Page updated successfully')
                router.push(`/dashboard/stores/${params.storeId}/pages`)
            } else {
                toast.error(data.error || 'Failed to update page')
            }
        } catch (error) {
            toast.error('Failed to update page')
        }
        setSaving(false)
    }

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 32 }}>
                <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>✏️ Edit Page</h1>
                <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Update your page content</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit}>
                <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 32 }}>
                    {/* Title */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                            Page Title *
                        </label>
                        <input
                            type="text"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                            placeholder="About Us"
                            style={{
                                width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                                borderRadius: 8, color: C.text, fontSize: '0.95rem'
                            }}
                            required
                        />
                    </div>

                    {/* Slug */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                            URL Slug *
                        </label>
                        <input
                            type="text"
                            value={form.slug}
                            onChange={(e) => setForm({ ...form, slug: e.target.value })}
                            placeholder="about-us"
                            style={{
                                width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                                borderRadius: 8, color: C.text, fontSize: '0.95rem'
                            }}
                            required
                        />
                        <p style={{ fontSize: '0.75rem', color: C.textMuted, marginTop: 6 }}>
                            URL: /pages/{form.slug || 'your-slug'}
                        </p>
                    </div>

                    {/* Content */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                            Page Content
                        </label>
                        <textarea
                            value={form.content}
                            onChange={(e) => setForm({ ...form, content: e.target.value })}
                            placeholder="Write your page content here..."
                            rows={12}
                            style={{
                                width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                                borderRadius: 8, color: C.text, fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical'
                            }}
                        />
                    </div>

                    {/* SEO Section */}
                    <div style={{
                        background: 'rgba(124, 58, 237, 0.05)', border: `1px solid ${C.border}`,
                        borderRadius: 12, padding: 20, marginBottom: 24
                    }}>
                        <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.text, marginBottom: 16 }}>🔍 SEO Settings</h3>

                        <div style={{ marginBottom: 16 }}>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                                Meta Title
                            </label>
                            <input
                                type="text"
                                value={form.metaTitle}
                                onChange={(e) => setForm({ ...form, metaTitle: e.target.value })}
                                placeholder="About Us - Company Name"
                                style={{
                                    width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                                    borderRadius: 8, color: C.text, fontSize: '0.95rem'
                                }}
                            />
                        </div>

                        <div>
                            <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>
                                Meta Description
                            </label>
                            <textarea
                                value={form.metaDescription}
                                onChange={(e) => setForm({ ...form, metaDescription: e.target.value })}
                                placeholder="Brief description for search engines..."
                                rows={3}
                                style={{
                                    width: '100%', padding: '12px 16px', background: '#1E293B', border: `1px solid ${C.border}`,
                                    borderRadius: 8, color: C.text, fontSize: '0.95rem', fontFamily: 'inherit', resize: 'vertical'
                                }}
                            />
                        </div>
                    </div>

                    {/* Publish Status */}
                    <div style={{ marginBottom: 24 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 12, cursor: 'pointer' }}>
                            <input
                                type="checkbox"
                                checked={form.isPublished}
                                onChange={(e) => setForm({ ...form, isPublished: e.target.checked })}
                                style={{ width: 18, height: 18, cursor: 'pointer' }}
                            />
                            <span style={{ fontSize: '0.9rem', fontWeight: 600, color: C.text }}>
                                Published
                            </span>
                        </label>
                    </div>

                    {/* Actions */}
                    <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                        <button
                            type="button"
                            onClick={() => router.back()}
                            style={{
                                padding: '12px 24px', background: C.card, border: `1px solid ${C.border}`,
                                borderRadius: 8, color: C.text, fontWeight: 600, cursor: 'pointer'
                            }}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            style={{
                                padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                                border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer',
                                opacity: saving ? 0.6 : 1
                            }}
                        >
                            {saving ? 'Saving...' : '💾 Save Changes'}
                        </button>
                    </div>
                </div>
            </form>
        </div>
    )
}
