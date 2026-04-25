'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

export default function AdminBlogsPage() {
    const { token } = useAuthStore()
    const { C } = useAdminTheme()
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [showForm, setShowForm] = useState(false)
    const [form, setForm] = useState<any>({
        title: '', slug: '', excerpt: '', content: '', featuredImage: '',
        category: '', tags: '', metaTitle: '', metaDescription: '', metaKeywords: '',
        ogImage: '', isPublished: false
    })
    const [editing, setEditing] = useState<string | null>(null)
    const [saving, setSaving] = useState(false)
    const [filter, setFilter] = useState('')

    const load = async () => {
        setLoading(true)
        const res = await fetch('/api/admin/blogs', { headers: { Authorization: `Bearer ${token}` } })
        const data = await res.json()
        if (data.success) setBlogs(data.blogs)
        setLoading(false)
    }

    useEffect(() => { load() }, [])

    const save = async () => {
        if (!form.title || !form.slug || !form.excerpt || !form.content || !form.category) {
            return alert('Please fill all required fields')
        }
        setSaving(true)
        const body = {
            ...form,
            tags: form.tags.split(',').map((t: string) => t.trim()).filter(Boolean),
            metaKeywords: form.metaKeywords.split(',').map((t: string) => t.trim()).filter(Boolean)
        }
        const url = editing ? `/api/admin/blogs/${editing}` : '/api/admin/blogs'
        const method = editing ? 'PATCH' : 'POST'
        const res = await fetch(url, {
            method,
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify(body)
        })
        const data = await res.json()
        if (data.success) {
            editing ? setBlogs(b => b.map(x => x._id === editing ? data.blog : x)) : setBlogs(b => [data.blog, ...b])
            setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: '', tags: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImage: '', isPublished: false })
            setEditing(null)
            setShowForm(false)
            alert(data.message)
        } else {
            alert(data.message)
        }
        setSaving(false)
    }

    const togglePublish = async (id: string, current: boolean) => {
        await fetch(`/api/admin/blogs/${id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ isPublished: !current })
        })
        setBlogs(b => b.map(x => x._id === id ? { ...x, isPublished: !current } : x))
    }

    const del = async (id: string) => {
        if (!confirm('Delete this blog?')) return
        await fetch(`/api/admin/blogs/${id}`, { method: 'DELETE', headers: { Authorization: `Bearer ${token}` } })
        setBlogs(b => b.filter(x => x._id !== id))
    }

    const startEdit = (blog: any) => {
        setForm({
            ...blog,
            tags: (blog.tags || []).join(', '),
            metaKeywords: (blog.metaKeywords || []).join(', ')
        })
        setEditing(blog._id)
        setShowForm(true)
    }

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
    }

    const inp = { width: '100%', padding: '10px 14px', background: C.bg, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontSize: '.85rem', outline: 'none', fontFamily: 'inherit' }
    const filtered = blogs.filter(b => !filter || b.category.toLowerCase().includes(filter.toLowerCase()) || b.title.toLowerCase().includes(filter.toLowerCase()))

    return (
        <div>
            <style>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(8px); } to { opacity: 1; transform: translateY(0); } }
        .blog-card { transition: transform .2s, box-shadow .2s; }
        .blog-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(99,102,241,.15); }
      `}</style>

            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, animation: 'fadeIn .4s ease' }}>
                <div>
                    <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: C.text, letterSpacing: '-.02em' }}>📝 Blog Management</h1>
                    <p style={{ color: C.textMuted, fontSize: '.85rem', marginTop: 4 }}>{blogs.length} blogs · {blogs.filter(b => b.isPublished).length} published</p>
                </div>
                <button
                    onClick={() => {
                        setForm({ title: '', slug: '', excerpt: '', content: '', featuredImage: '', category: '', tags: '', metaTitle: '', metaDescription: '', metaKeywords: '', ogImage: '', isPublished: false })
                        setEditing(null)
                        setShowForm(!showForm)
                    }}
                    style={{ padding: '10px 20px', background: `linear-gradient(135deg,${C.purple},${C.cyan})`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '.86rem', cursor: 'pointer', boxShadow: `0 4px 16px ${C.purple}40` }}
                >
                    {showForm ? '✕ Cancel' : '+ Create Blog'}
                </button>
            </div>

            {/* Form */}
            {showForm && (
                <div style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 16, padding: 24, marginBottom: 24, animation: 'fadeIn .3s ease' }}>
                    <h3 style={{ fontSize: '1rem', fontWeight: 800, color: C.text, marginBottom: 20 }}>{editing ? '✏️ Edit Blog' : '➕ Create New Blog'}</h3>

                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Title *</label>
                            <input
                                style={inp}
                                value={form.title}
                                onChange={e => {
                                    setForm({ ...form, title: e.target.value, slug: generateSlug(e.target.value) })
                                }}
                                placeholder="Enter blog title"
                            />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Slug *</label>
                            <input style={inp} value={form.slug} onChange={e => setForm({ ...form, slug: e.target.value })} placeholder="url-slug" />
                        </div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Excerpt *</label>
                        <textarea
                            style={{ ...inp, minHeight: 60, resize: 'vertical' }}
                            value={form.excerpt}
                            onChange={e => setForm({ ...form, excerpt: e.target.value })}
                            placeholder="Short description (150-160 characters for SEO)"
                            maxLength={160}
                        />
                        <div style={{ fontSize: '.7rem', color: C.textMuted, marginTop: 4 }}>{form.excerpt.length}/160 characters</div>
                    </div>

                    <div style={{ marginBottom: 16 }}>
                        <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Content * (HTML Supported)</label>
                        <textarea
                            style={{ ...inp, minHeight: 300, fontFamily: 'Monaco, Consolas, monospace', fontSize: '.8rem', resize: 'vertical' }}
                            value={form.content}
                            onChange={e => setForm({ ...form, content: e.target.value })}
                            placeholder="Write your blog content here... HTML tags are supported"
                        />
                    </div>

                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16, marginBottom: 16 }}>
                        <div>
                            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Featured Image URL</label>
                            <input style={inp} value={form.featuredImage} onChange={e => setForm({ ...form, featuredImage: e.target.value })} placeholder="https://..." />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Category *</label>
                            <input style={inp} value={form.category} onChange={e => setForm({ ...form, category: e.target.value })} placeholder="Tech, Lifestyle, etc." />
                        </div>
                        <div>
                            <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6, textTransform: 'uppercase' }}>Tags (comma-sep)</label>
                            <input style={inp} value={form.tags} onChange={e => setForm({ ...form, tags: e.target.value })} placeholder="web, design, seo" />
                        </div>
                    </div>

                    {/* SEO Section */}
                    <div style={{ background: `${C.purple}08`, padding: 16, borderRadius: 12, marginBottom: 16, border: `1px solid ${C.purple}20` }}>
                        <h4 style={{ fontSize: '.85rem', fontWeight: 800, color: C.text, marginBottom: 12 }}>🔍 SEO Optimization</h4>
                        <div style={{ display: 'grid', gap: 12 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Meta Title (60 chars)</label>
                                <input
                                    style={inp}
                                    value={form.metaTitle}
                                    onChange={e => setForm({ ...form, metaTitle: e.target.value })}
                                    placeholder="Leave empty to use blog title"
                                    maxLength={60}
                                />
                                <div style={{ fontSize: '.7rem', color: C.textMuted, marginTop: 4 }}>{form.metaTitle.length}/60</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Meta Description (160 chars)</label>
                                <textarea
                                    style={{ ...inp, minHeight: 60 }}
                                    value={form.metaDescription}
                                    onChange={e => setForm({ ...form, metaDescription: e.target.value })}
                                    placeholder="Leave empty to use excerpt"
                                    maxLength={160}
                                />
                                <div style={{ fontSize: '.7rem', color: C.textMuted, marginTop: 4 }}>{form.metaDescription.length}/160</div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>Meta Keywords (comma-sep)</label>
                                <input style={inp} value={form.metaKeywords} onChange={e => setForm({ ...form, metaKeywords: e.target.value })} placeholder="keyword1, keyword2, keyword3" />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '.7rem', fontWeight: 700, color: C.textMuted, marginBottom: 6 }}>OG Image URL</label>
                                <input style={inp} value={form.ogImage} onChange={e => setForm({ ...form, ogImage: e.target.value })} placeholder="Leave empty to use featured image" />
                            </div>
                        </div>
                    </div>

                    <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: '.85rem', color: C.text, cursor: 'pointer' }}>
                            <input type="checkbox" checked={form.isPublished} onChange={e => setForm({ ...form, isPublished: e.target.checked })} />
                            Publish immediately
                        </label>
                    </div>

                    <button
                        onClick={save}
                        disabled={saving}
                        style={{ padding: '12px 28px', background: `linear-gradient(135deg,${C.purple},${C.cyan})`, border: 'none', borderRadius: 10, color: '#fff', fontWeight: 800, fontSize: '.9rem', cursor: 'pointer', boxShadow: `0 4px 16px ${C.purple}40` }}
                    >
                        {saving ? 'Saving...' : editing ? '💾 Update Blog' : '✨ Create Blog'}
                    </button>
                </div>
            )}

            {/* Filter */}
            <div style={{ marginBottom: 16 }}>
                <input
                    value={filter}
                    onChange={e => setFilter(e.target.value)}
                    placeholder="🔍 Search blogs..."
                    style={{ width: '100%', maxWidth: 400, padding: '10px 14px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 10, color: C.text, fontSize: '.85rem', outline: 'none' }}
                />
            </div>

            <p style={{ color: C.textMuted, fontSize: '.75rem', marginBottom: 14 }}>Showing {filtered.length} blogs</p>

            {/* Grid */}
            {loading ? (
                <div style={{ textAlign: 'center', padding: 60, color: C.textMuted }}>Loading blogs...</div>
            ) : (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: 16 }}>
                    {filtered.map((blog, i) => (
                        <div key={blog._id} className="blog-card" style={{ background: C.card, border: `1px solid ${C.cardBorder}`, borderRadius: 14, overflow: 'hidden', animation: `fadeIn .3s ease ${i * 30}ms both` }}>
                            {blog.featuredImage && (
                                <div style={{ height: 160, background: `url(${blog.featuredImage}) center/cover`, position: 'relative' }}>
                                    <div style={{ position: 'absolute', top: 8, right: 8, display: 'flex', gap: 4 }}>
                                        <span style={{ fontSize: '.6rem', fontWeight: 800, padding: '3px 10px', borderRadius: 20, background: blog.isPublished ? 'rgba(34,197,94,.9)' : 'rgba(239,68,68,.9)', color: '#fff' }}>
                                            {blog.isPublished ? 'Published' : 'Draft'}
                                        </span>
                                    </div>
                                    <div style={{ position: 'absolute', bottom: 8, left: 8, background: 'rgba(0,0,0,.6)', padding: '3px 10px', borderRadius: 20, fontSize: '.65rem', fontWeight: 700, color: '#fff' }}>
                                        {blog.category}
                                    </div>
                                </div>
                            )}
                            <div style={{ padding: '14px 16px' }}>
                                <div style={{ fontSize: '.95rem', fontWeight: 800, color: C.text, marginBottom: 6, lineHeight: 1.3 }}>{blog.title}</div>
                                <div style={{ fontSize: '.75rem', color: C.textMuted, marginBottom: 10, lineHeight: 1.5 }}>{blog.excerpt.substring(0, 100)}...</div>
                                <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 12 }}>
                                    {(blog.tags || []).slice(0, 3).map((tag: string) => (
                                        <span key={tag} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 20, background: `${C.purple}12`, color: C.purpleLight }}>{tag}</span>
                                    ))}
                                </div>
                                <div style={{ fontSize: '.7rem', color: C.textMuted, marginBottom: 12 }}>
                                    👁️ {blog.views || 0} views · {new Date(blog.createdAt).toLocaleDateString()}
                                </div>
                                <div style={{ display: 'flex', gap: 5 }}>
                                    <button onClick={() => startEdit(blog)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', background: `${C.blue}10`, border: 'none', color: '#60A5FA' }}>
                                        Edit
                                    </button>
                                    <button onClick={() => togglePublish(blog._id, blog.isPublished)} style={{ flex: 1, padding: '7px', borderRadius: 8, fontSize: '.72rem', fontWeight: 700, cursor: 'pointer', background: blog.isPublished ? `${C.red}10` : `${C.green}10`, border: 'none', color: blog.isPublished ? C.red : C.green }}>
                                        {blog.isPublished ? 'Unpublish' : 'Publish'}
                                    </button>
                                    <button onClick={() => del(blog._id)} style={{ padding: '7px 10px', borderRadius: 8, fontSize: '.72rem', cursor: 'pointer', background: `${C.red}10`, border: 'none', color: C.red }}>
                                        🗑
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                    {filtered.length === 0 && <p style={{ color: C.textMuted, gridColumn: '1/-1', textAlign: 'center', padding: 40 }}>No blogs found.</p>}
                </div>
            )}
        </div>
    )
}
