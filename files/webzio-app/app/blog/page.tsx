'use client'
import { useEffect, useState } from 'react'
import Link from 'next/link'

export default function BlogPage() {
    const [blogs, setBlogs] = useState<any[]>([])
    const [loading, setLoading] = useState(true)
    const [category, setCategory] = useState('')
    const [categories, setCategories] = useState<string[]>([])

    useEffect(() => {
        async function load() {
            const url = category
                ? `/api/blogs?limit=20&category=${encodeURIComponent(category)}`
                : '/api/blogs?limit=20'
            const res = await fetch(url)
            const data = await res.json()
            if (data.success) {
                setBlogs(data.blogs)
                if (!category) {
                    const cats = [...new Set(data.blogs.map((b: any) => b.category))] as string[]
                    setCategories(cats)
                }
            }
            setLoading(false)
        }
        load()
    }, [category])

    const accentColors = ['#4f46e5', '#7c3aed', '#ec4899', '#0ea5e9', '#f97316', '#10b981']
    const getColor = (i: number) => accentColors[i % accentColors.length]

    return (
        <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
            <style>{`
                @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');
                @keyframes fadeIn { from { opacity: 0; transform: translateY(14px); } to { opacity: 1; transform: translateY(0); } }
                @keyframes shimmer { 0%{background-position:-200% 0} 100%{background-position:200% 0} }
                .blog-card-link { transition: transform .25s, box-shadow .25s; display: block; text-decoration: none; }
                .blog-card-link:hover { transform: translateY(-6px); box-shadow: 0 16px 48px rgba(79,70,229,.14) !important; }
                .cat-btn { transition: all .18s; cursor: pointer; border: none; }
                .cat-btn:hover { transform: translateY(-1px); }
                @media (max-width: 768px) {
                    .blog-grid { grid-template-columns: 1fr !important; }
                    .blog-hero-inner { flex-direction: column !important; gap: 16px !important; }
                }
            `}</style>

            {/* ── STICKY NAV ── */}
            <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', padding: '0 6%' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                    <Link href="/" style={{ fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none', color: '#111', fontFamily: "'Playfair Display', serif" }}>
                        Webra<span style={{ color: '#4f46e5' }}>zeo</span>
                    </Link>
                    <nav style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
                        <Link href="/" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '.88rem' }}>Home</Link>
                        <Link href="/blog" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 700, fontSize: '.88rem' }}>Blog</Link>
                        <Link href="/#pricing" style={{ color: '#6b7280', textDecoration: 'none', fontWeight: 500, fontSize: '.88rem' }}>Pricing</Link>
                        <Link href="/login" style={{ padding: '8px 20px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.85rem' }}>
                            Login
                        </Link>
                    </nav>
                </div>
            </header>

            {/* ── HERO ── */}
            <section style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#fdf4ff 40%,#fff1f2 100%)', padding: '72px 6% 52px', position: 'relative', overflow: 'hidden' }}>
                <div style={{ position: 'absolute', top: -80, right: -80, width: 360, height: 360, background: 'radial-gradient(circle,rgba(79,70,229,.14),transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, background: 'radial-gradient(circle,rgba(236,72,153,.1),transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
                <div style={{ maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
                    <div style={{ display: 'inline-block', background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)', border: '1px solid #c7d2fe', padding: '6px 18px', borderRadius: 50, fontSize: '.72rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 20 }}>
                        📝 Webrazeo Blog
                    </div>
                    <h1 style={{ fontSize: 'clamp(2rem,4vw,3rem)', fontWeight: 900, fontFamily: "'Playfair Display', serif", letterSpacing: '-.03em', marginBottom: 16, lineHeight: 1.2 }}>
                        Insights to <span style={{ background: 'linear-gradient(135deg,#4f46e5,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>Grow Your Business</span>
                    </h1>
                    <div style={{ width: 52, height: 3, background: 'linear-gradient(90deg,#4f46e5,#ec4899)', borderRadius: 2, margin: '0 auto 20px' }} />
                    <p style={{ fontSize: '1.05rem', color: '#6b7280', maxWidth: 560, margin: '0 auto', lineHeight: 1.8 }}>
                        Discover tips, strategies and stories to help your restaurant, hotel, or local business thrive online.
                    </p>
                </div>
            </section>

            {/* ── CATEGORY FILTER ── */}
            {categories.length > 0 && (
                <div style={{ padding: '24px 6% 0', background: '#fff' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', gap: 8, flexWrap: 'wrap' }}>
                        <button
                            className="cat-btn"
                            onClick={() => setCategory('')}
                            style={{ padding: '7px 18px', borderRadius: 50, fontSize: '.8rem', fontWeight: 700, background: !category ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9', color: !category ? '#fff' : '#6b7280', boxShadow: !category ? '0 4px 14px rgba(79,70,229,.3)' : 'none' }}
                        >All</button>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                className="cat-btn"
                                onClick={() => setCategory(cat)}
                                style={{ padding: '7px 18px', borderRadius: 50, fontSize: '.8rem', fontWeight: 700, background: category === cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9', color: category === cat ? '#fff' : '#6b7280', boxShadow: category === cat ? '0 4px 14px rgba(79,70,229,.3)' : 'none' }}
                            >{cat}</button>
                        ))}
                    </div>
                </div>
            )}

            {/* ── BLOG GRID ── */}
            <section style={{ maxWidth: 1200, margin: '0 auto', padding: '48px 6% 80px' }}>
                {loading ? (
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
                        {[1, 2, 3, 4, 5, 6].map(i => (
                            <div key={i} style={{ borderRadius: 18, overflow: 'hidden', border: '1.5px solid #f0f0f0' }}>
                                <div style={{ height: 220, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                                <div style={{ padding: 24 }}>
                                    <div style={{ height: 14, background: '#f0f0f0', borderRadius: 8, marginBottom: 12, width: '80%' }} />
                                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 8, marginBottom: 8 }} />
                                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 8, width: '65%' }} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : blogs.length > 0 ? (
                    <div className="blog-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(320px,1fr))', gap: 24 }}>
                        {blogs.map((blog, i) => (
                            <Link
                                key={blog._id}
                                href={`/blog/${blog.slug}`}
                                className="blog-card-link"
                                style={{ background: '#fff', borderRadius: 18, overflow: 'hidden', boxShadow: '0 4px 20px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0', animation: `fadeIn .4s ease ${i * 80}ms both` }}
                            >
                                {/* Image */}
                                <div style={{ height: 220, position: 'relative', overflow: 'hidden', background: blog.featuredImage ? '#f0f0f0' : `linear-gradient(135deg,${getColor(i)},${getColor(i)}cc)` }}>
                                    {blog.featuredImage
                                        ? <img src={blog.featuredImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
                                        : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3.5rem', opacity: .35 }}>📝</div>
                                    }
                                    <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.55) 0%, transparent 55%)' }} />
                                    <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                        <span style={{ fontSize: '.65rem', color: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', gap: 4 }}>
                                            📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                        </span>
                                        <span style={{ background: getColor(i), color: '#fff', padding: '3px 12px', borderRadius: 20, fontSize: '.62rem', fontWeight: 800 }}>
                                            {blog.category}
                                        </span>
                                    </div>
                                </div>

                                <div style={{ padding: '20px 22px 24px' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14, fontSize: '.72rem', color: '#9ca3af' }}>
                                        <span style={{ fontSize: '.72rem' }}>♦ {blog.category}</span>
                                        <span>👁️ {blog.views || 0} views</span>
                                    </div>
                                    <div style={{ width: 28, height: 3, background: `linear-gradient(90deg,${getColor(i)},${getColor(i)}60)`, borderRadius: 2, marginBottom: 12 }} />
                                    <h2 style={{ fontWeight: 800, fontSize: '1.02rem', color: '#111', lineHeight: 1.4, marginBottom: 10, letterSpacing: '-.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                                        {blog.title}
                                    </h2>
                                    <p style={{ fontSize: '.83rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical' as any, overflow: 'hidden' }}>
                                        {blog.excerpt}
                                    </p>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 18 }}>
                                        {(blog.tags || []).slice(0, 3).map((tag: string) => (
                                            <span key={tag} style={{ fontSize: '.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: `${getColor(i)}12`, color: getColor(i) }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                    <span style={{ color: getColor(i), fontWeight: 800, fontSize: '.84rem', display: 'flex', alignItems: 'center', gap: 5 }}>
                                        Read More <span>→</span>
                                    </span>
                                </div>
                            </Link>
                        ))}
                    </div>
                ) : (
                    <div style={{ textAlign: 'center', padding: '80px 0', color: '#9ca3af' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 20 }}>📝</div>
                        <div style={{ fontWeight: 800, fontSize: '1.3rem', marginBottom: 10, color: '#6b7280' }}>No blogs published yet</div>
                        <p style={{ fontSize: '.9rem', maxWidth: 360, margin: '0 auto', lineHeight: 1.7 }}>Our team is working on great content. Check back soon for tips to grow your business!</p>
                        <Link href="/" style={{ display: 'inline-block', marginTop: 24, padding: '12px 28px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '.9rem' }}>
                            ← Back to Home
                        </Link>
                    </div>
                )}
            </section>

            {/* ── NEWSLETTER CTA ── */}
            <section style={{ padding: '0 6% 80px' }}>
                <div style={{ maxWidth: 900, margin: '0 auto', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 24, padding: '52px 48px', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 240, height: 240, background: 'rgba(255,255,255,.06)', borderRadius: '50%' }} />
                    <div style={{ position: 'absolute', bottom: -40, left: -40, width: 180, height: 180, background: 'rgba(255,255,255,.04)', borderRadius: '50%' }} />
                    <div style={{ position: 'relative' }}>
                        <h2 style={{ fontWeight: 900, fontSize: 'clamp(1.4rem,3vw,2rem)', fontFamily: "'Playfair Display', serif", color: '#fff', marginBottom: 12 }}>
                            Ready to Get Your Business Online?
                        </h2>
                        <p style={{ color: 'rgba(255,255,255,.8)', fontSize: '.95rem', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.7 }}>
                            Join 1,200+ local businesses already growing with Webrazeo. Live in 5 minutes. Free forever plan.
                        </p>
                        <Link href="/signup" style={{ display: 'inline-block', padding: '14px 36px', background: '#fff', color: '#4f46e5', borderRadius: 12, textDecoration: 'none', fontWeight: 800, fontSize: '.97rem', boxShadow: '0 8px 28px rgba(0,0,0,.15)' }}>
                            Build My Website Free →
                        </Link>
                    </div>
                </div>
            </section>

            {/* ── FOOTER ── */}
            <footer style={{ background: '#0a0f1e', color: '#fff', padding: '40px 6% 24px' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                    <div style={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>
                        Webra<span style={{ color: '#818cf8' }}>zeo</span>
                    </div>
                    <div style={{ display: 'flex', gap: 20 }}>
                        <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem' }}>Home</Link>
                        <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700 }}>Blog</Link>
                        <Link href="/signup" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem' }}>Sign Up Free</Link>
                        <Link href="/login" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem' }}>Login</Link>
                    </div>
                    <div style={{ color: '#334155', fontSize: '.75rem' }}>© 2026 Webrazeo. All rights reserved.</div>
                </div>
            </footer>
        </div>
    )
}
