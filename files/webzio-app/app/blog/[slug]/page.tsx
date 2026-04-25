import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import dbConnect from '../../../lib/db'
import Blog from '../../../models/Blog'

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
    try {
        await dbConnect()
        const blog = await Blog.findOne({ slug: params.slug, isPublished: true }).lean() as any
        if (!blog) return { title: 'Blog Not Found' }

        const metaTitle = blog.metaTitle || blog.title
        const metaDesc = blog.metaDescription || blog.excerpt
        const ogImg = blog.ogImage || blog.featuredImage || ''

        return {
            title: metaTitle,
            description: metaDesc,
            keywords: blog.metaKeywords?.join(', ') || blog.tags?.join(', '),
            authors: [{ name: blog.author || 'Webrazeo Team' }],
            openGraph: {
                title: metaTitle,
                description: metaDesc,
                type: 'article',
                publishedTime: blog.createdAt,
                modifiedTime: blog.updatedAt,
                authors: [blog.author || 'Webrazeo Team'],
                images: ogImg ? [{ url: ogImg, width: 1200, height: 630, alt: blog.title }] : [],
                siteName: 'Webrazeo',
            },
            twitter: {
                card: 'summary_large_image',
                title: metaTitle,
                description: metaDesc,
                images: ogImg ? [ogImg] : [],
            },
            alternates: {
                canonical: blog.canonicalUrl || `/blog/${params.slug}`,
            },
            robots: {
                index: true,
                follow: true,
                googleBot: { index: true, follow: true },
            },
        }
    } catch {
        return { title: 'Blog Post' }
    }
}

async function getBlog(slug: string) {
    try {
        await dbConnect()
        const blog = await Blog.findOne({ slug, isPublished: true }).lean() as any
        if (blog) {
            // Increment views
            await Blog.updateOne({ _id: blog._id }, { $inc: { views: 1 } })
        }
        return blog
    } catch {
        return null
    }
}

async function getRelatedBlogs(category: string, currentSlug: string) {
    try {
        await dbConnect()
        return await Blog.find({ category, slug: { $ne: currentSlug }, isPublished: true })
            .sort({ createdAt: -1 })
            .limit(3)
            .select('title slug excerpt featuredImage category createdAt views')
            .lean()
    } catch {
        return []
    }
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
    const blog = await getBlog(params.slug)
    if (!blog) notFound()

    const relatedBlogs = await getRelatedBlogs(blog.category, params.slug)

    const readingTime = Math.ceil(blog.content.replace(/<[^>]*>/g, '').split(' ').length / 200)

    // JSON-LD structured data for Google
    const jsonLd = {
        '@context': 'https://schema.org',
        '@type': 'BlogPosting',
        headline: blog.title,
        description: blog.excerpt,
        image: blog.featuredImage || blog.ogImage || '',
        author: { '@type': 'Person', name: blog.author || 'Webrazeo Team' },
        publisher: {
            '@type': 'Organization',
            name: 'Webrazeo',
            logo: { '@type': 'ImageObject', url: 'https://webrazeo.com/logo.png' },
        },
        datePublished: blog.createdAt,
        dateModified: blog.updatedAt,
        url: `https://webrazeo.com/blog/${blog.slug}`,
        keywords: blog.tags?.join(', '),
        articleSection: blog.category,
        wordCount: blog.content.replace(/<[^>]*>/g, '').split(' ').length,
    }

    return (
        <>
            {/* JSON-LD structured data */}
            <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
            />

            <div style={{ fontFamily: "'Inter', system-ui, sans-serif", background: '#fff', color: '#111', minHeight: '100vh' }}>
                <style>{`
                    @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800;900&family=Playfair+Display:wght@700;800;900&display=swap');
                    .blog-content h1, .blog-content h2, .blog-content h3, .blog-content h4 {
                        font-family: 'Playfair Display', serif;
                        font-weight: 800;
                        color: #111;
                        margin: 2rem 0 1rem;
                        line-height: 1.3;
                    }
                    .blog-content h2 { font-size: 1.7rem; }
                    .blog-content h3 { font-size: 1.3rem; }
                    .blog-content p { margin: 1.2rem 0; line-height: 1.9; color: #374151; }
                    .blog-content ul, .blog-content ol { padding-left: 1.5rem; margin: 1.2rem 0; }
                    .blog-content li { margin-bottom: .6rem; line-height: 1.8; color: #374151; }
                    .blog-content a { color: #4f46e5; text-decoration: underline; }
                    .blog-content a:hover { color: #7c3aed; }
                    .blog-content blockquote {
                        border-left: 4px solid #4f46e5;
                        margin: 2rem 0;
                        padding: 1rem 1.5rem;
                        background: #f5f3ff;
                        border-radius: 0 12px 12px 0;
                        font-style: italic;
                        color: #4f46e5;
                    }
                    .blog-content img { max-width: 100%; border-radius: 12px; margin: 1.5rem 0; }
                    .blog-content pre, .blog-content code {
                        background: #1e293b;
                        color: #e2e8f0;
                        padding: .2em .5em;
                        border-radius: 6px;
                        font-size: .9em;
                        font-family: 'Monaco', 'Consolas', monospace;
                    }
                    .blog-content pre { padding: 1.5rem; overflow-x: auto; margin: 1.5rem 0; border-radius: 12px; }
                    .blog-content pre code { background: none; padding: 0; }
                    .blog-content strong { color: #111; font-weight: 700; }
                    .blog-content table { width: 100%; border-collapse: collapse; margin: 1.5rem 0; }
                    .blog-content th, .blog-content td { padding: .75rem 1rem; border: 1px solid #e5e7eb; text-align: left; }
                    .blog-content th { background: #f8f7ff; font-weight: 700; }
                    .related-card { transition: transform .2s, box-shadow .2s; }
                    .related-card:hover { transform: translateY(-4px); box-shadow: 0 12px 32px rgba(79,70,229,.12) !important; }
                    @media (max-width: 768px) {
                        .blog-hero-title { font-size: 1.8rem !important; }
                        .blog-body-grid { grid-template-columns: 1fr !important; }
                        .blog-sidebar { display: none; }
                    }
                `}</style>

                {/* ── NAVBAR ── */}
                <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'rgba(255,255,255,.92)', backdropFilter: 'blur(12px)', borderBottom: '1px solid #f0f0f0', padding: '0 6%' }}>
                    <div style={{ maxWidth: 1200, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', height: 64 }}>
                        <Link href="/" style={{ fontWeight: 900, fontSize: '1.2rem', textDecoration: 'none', color: '#111', fontFamily: "'Playfair Display', serif" }}>
                            Webra<span style={{ color: '#4f46e5' }}>zeo</span>
                        </Link>
                        <nav style={{ display: 'flex', alignItems: 'center', gap: 28 }}>
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
                <section style={{ background: 'linear-gradient(135deg,#eef2ff 0%,#fdf4ff 50%,#fff1f2 100%)', padding: '64px 6% 48px', position: 'relative', overflow: 'hidden' }}>
                    <div style={{ position: 'absolute', top: -60, right: -60, width: 380, height: 380, background: 'radial-gradient(circle,rgba(79,70,229,.14),transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
                    <div style={{ maxWidth: 860, margin: '0 auto', position: 'relative' }}>
                        {/* Breadcrumb */}
                        <div style={{ fontSize: '.78rem', color: '#9ca3af', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 6 }}>
                            <Link href="/" style={{ color: '#9ca3af', textDecoration: 'none' }}>Home</Link>
                            <span>›</span>
                            <Link href="/blog" style={{ color: '#9ca3af', textDecoration: 'none' }}>Blog</Link>
                            <span>›</span>
                            <span style={{ color: '#4f46e5', fontWeight: 600 }}>{blog.category}</span>
                        </div>

                        {/* Category + Date Row */}
                        <div style={{ display: 'flex', gap: 12, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
                            <span style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', padding: '5px 16px', borderRadius: 20, fontSize: '.72rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '.08em' }}>
                                {blog.category}
                            </span>
                            <span style={{ fontSize: '.78rem', color: '#9ca3af', display: 'flex', alignItems: 'center', gap: 4 }}>
                                📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { day: 'numeric', month: 'long', year: 'numeric' })}
                            </span>
                            <span style={{ fontSize: '.78rem', color: '#9ca3af' }}>🕐 {readingTime} min read</span>
                            <span style={{ fontSize: '.78rem', color: '#9ca3af' }}>👁️ {blog.views || 0} views</span>
                        </div>

                        {/* Title */}
                        <h1 className="blog-hero-title" style={{ fontSize: '2.4rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", lineHeight: 1.2, marginBottom: 20, letterSpacing: '-.02em', color: '#111' }}>
                            {blog.title}
                        </h1>

                        {/* Excerpt */}
                        <p style={{ fontSize: '1.05rem', color: '#6b7280', lineHeight: 1.8, marginBottom: 24, maxWidth: 720 }}>
                            {blog.excerpt}
                        </p>

                        {/* Author + Tags */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                                <div style={{ width: 36, height: 36, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '.85rem' }}>
                                    {(blog.author || 'W')[0].toUpperCase()}
                                </div>
                                <div>
                                    <div style={{ fontWeight: 700, fontSize: '.82rem', color: '#111' }}>{blog.author || 'Webrazeo Team'}</div>
                                    <div style={{ fontSize: '.7rem', color: '#9ca3af' }}>Author</div>
                                </div>
                            </div>
                            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                {(blog.tags || []).map((tag: string) => (
                                    <span key={tag} style={{ fontSize: '.65rem', fontWeight: 700, padding: '3px 10px', borderRadius: 20, background: '#eef2ff', color: '#4f46e5' }}>
                                        #{tag}
                                    </span>
                                ))}
                            </div>
                        </div>
                    </div>
                </section>

                {/* ── FEATURED IMAGE ── */}
                {blog.featuredImage && (
                    <div style={{ maxWidth: 900, margin: '0 auto', padding: '0 6%' }}>
                        <div style={{ borderRadius: 20, overflow: 'hidden', boxShadow: '0 20px 60px rgba(0,0,0,.12)', marginTop: -16, position: 'relative', zIndex: 5 }}>
                            <img
                                src={blog.featuredImage}
                                alt={blog.title}
                                style={{ width: '100%', maxHeight: 460, objectFit: 'cover', display: 'block' }}
                            />
                        </div>
                    </div>
                )}

                {/* ── MAIN CONTENT ── */}
                <div className="blog-body-grid" style={{ maxWidth: 1100, margin: '0 auto', padding: '52px 6%', display: 'grid', gridTemplateColumns: '1fr 300px', gap: 48, alignItems: 'start' }}>

                    {/* Article Body */}
                    <article>
                        <div
                            className="blog-content"
                            style={{ fontSize: '1.02rem', lineHeight: 1.9 }}
                            dangerouslySetInnerHTML={{ __html: blog.content }}
                        />

                        {/* Share + Tags Footer */}
                        <div style={{ marginTop: 52, paddingTop: 32, borderTop: '1px solid #e5e7eb' }}>
                            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
                                <div>
                                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Tags</div>
                                    <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                        {(blog.tags || []).map((tag: string) => (
                                            <span key={tag} style={{ fontSize: '.73rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: '#eef2ff', color: '#4f46e5' }}>
                                                #{tag}
                                            </span>
                                        ))}
                                    </div>
                                </div>
                                <div>
                                    <div style={{ fontSize: '.78rem', fontWeight: 700, color: '#9ca3af', textTransform: 'uppercase', letterSpacing: '.08em', marginBottom: 10 }}>Share</div>
                                    <div style={{ display: 'flex', gap: 8 }}>
                                        {[
                                            { label: 'Twitter', href: `https://twitter.com/intent/tweet?url=https://webrazeo.com/blog/${blog.slug}&text=${encodeURIComponent(blog.title)}`, color: '#1da1f2' },
                                            { label: 'LinkedIn', href: `https://linkedin.com/sharing/share-offsite/?url=https://webrazeo.com/blog/${blog.slug}`, color: '#0077b5' },
                                            { label: 'WhatsApp', href: `https://wa.me/?text=${encodeURIComponent(blog.title + ' https://webrazeo.com/blog/' + blog.slug)}`, color: '#25d366' },
                                        ].map(s => (
                                            <a key={s.label} href={s.href} target="_blank" rel="noopener noreferrer" style={{ padding: '7px 14px', borderRadius: 8, background: `${s.color}15`, color: s.color, textDecoration: 'none', fontWeight: 700, fontSize: '.75rem', border: `1px solid ${s.color}30` }}>
                                                {s.label}
                                            </a>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Author Box */}
                        <div style={{ marginTop: 40, padding: 28, background: 'linear-gradient(135deg,#eef2ff,#fdf4ff)', borderRadius: 18, border: '1px solid #c7d2fe', display: 'flex', gap: 20, alignItems: 'flex-start' }}>
                            <div style={{ width: 64, height: 64, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '1.4rem', flexShrink: 0 }}>
                                {(blog.author || 'W')[0].toUpperCase()}
                            </div>
                            <div>
                                <div style={{ fontWeight: 800, fontSize: '1rem', color: '#111', marginBottom: 4 }}>
                                    {blog.author || 'Webrazeo Team'}
                                </div>
                                <div style={{ fontSize: '.78rem', color: '#6b7280', marginBottom: 8 }}>Content Writer at Webrazeo</div>
                                <p style={{ fontSize: '.84rem', color: '#4b5563', lineHeight: 1.7, margin: 0 }}>
                                    Passionate about helping local businesses grow online. Writing about web design, SEO, and digital marketing strategies.
                                </p>
                            </div>
                        </div>
                    </article>

                    {/* Sidebar */}
                    <aside className="blog-sidebar" style={{ position: 'sticky', top: 84 }}>
                        {/* CTA Box */}
                        <div style={{ background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', borderRadius: 18, padding: 24, marginBottom: 24, textAlign: 'center' }}>
                            <div style={{ fontSize: '1.8rem', marginBottom: 10 }}>🚀</div>
                            <div style={{ fontWeight: 900, fontSize: '1rem', color: '#fff', marginBottom: 8, lineHeight: 1.3 }}>
                                Build Your Business Website
                            </div>
                            <p style={{ fontSize: '.8rem', color: 'rgba(255,255,255,.8)', marginBottom: 16, lineHeight: 1.6 }}>
                                Get online in 5 minutes. No coding required.
                            </p>
                            <Link href="/signup" style={{ display: 'block', padding: '11px', background: '#fff', color: '#4f46e5', borderRadius: 10, textDecoration: 'none', fontWeight: 800, fontSize: '.88rem' }}>
                                Start Free →
                            </Link>
                        </div>

                        {/* Article Info */}
                        <div style={{ background: '#f8f7ff', borderRadius: 16, padding: 20, marginBottom: 24, border: '1px solid #e0e7ff' }}>
                            <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#111', marginBottom: 16 }}>Article Info</div>
                            {[
                                { icon: '📅', label: 'Published', val: new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) },
                                { icon: '🏷️', label: 'Category', val: blog.category },
                                { icon: '🕐', label: 'Reading Time', val: `${readingTime} min` },
                                { icon: '👁️', label: 'Views', val: `${blog.views || 0}` },
                            ].map(item => (
                                <div key={item.label} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 0', borderBottom: '1px solid #e0e7ff', fontSize: '.8rem' }}>
                                    <span style={{ color: '#6b7280', display: 'flex', gap: 6, alignItems: 'center' }}>{item.icon} {item.label}</span>
                                    <span style={{ fontWeight: 700, color: '#111' }}>{item.val}</span>
                                </div>
                            ))}
                        </div>

                        {/* Tags */}
                        {(blog.tags || []).length > 0 && (
                            <div style={{ background: '#f8f7ff', borderRadius: 16, padding: 20, border: '1px solid #e0e7ff' }}>
                                <div style={{ fontWeight: 800, fontSize: '.85rem', color: '#111', marginBottom: 12 }}>Tags</div>
                                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                                    {(blog.tags || []).map((tag: string) => (
                                        <span key={tag} style={{ fontSize: '.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20, background: '#eef2ff', color: '#4f46e5' }}>#{tag}</span>
                                    ))}
                                </div>
                            </div>
                        )}
                    </aside>
                </div>

                {/* ── RELATED BLOGS ── */}
                {relatedBlogs.length > 0 && (
                    <section style={{ background: '#f8f7ff', padding: '64px 6%' }}>
                        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
                            <div style={{ marginBottom: 36, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                <div>
                                    <div style={{ fontSize: '.72rem', fontWeight: 800, color: '#4f46e5', letterSpacing: '.1em', textTransform: 'uppercase', marginBottom: 6 }}>More to Read</div>
                                    <h2 style={{ fontSize: '1.8rem', fontWeight: 900, fontFamily: "'Playfair Display', serif", color: '#111' }}>Related Articles</h2>
                                </div>
                                <Link href="/blog" style={{ padding: '10px 22px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '.85rem' }}>
                                    View All →
                                </Link>
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: 24 }}>
                                {relatedBlogs.map((rb: any) => (
                                    <Link key={rb._id?.toString()} href={`/blog/${rb.slug}`} style={{ textDecoration: 'none' }}>
                                        <div className="related-card" style={{ background: '#fff', borderRadius: 16, overflow: 'hidden', boxShadow: '0 4px 20px rgba(79,70,229,.07)', border: '1px solid #e0e7ff' }}>
                                            {rb.featuredImage && (
                                                <div style={{ height: 180, background: `url(${rb.featuredImage}) center/cover`, position: 'relative' }}>
                                                    <div style={{ position: 'absolute', bottom: 10, left: 10, background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', padding: '3px 12px', borderRadius: 20, fontSize: '.65rem', fontWeight: 700, color: '#fff' }}>
                                                        {rb.category}
                                                    </div>
                                                </div>
                                            )}
                                            <div style={{ padding: '16px 20px' }}>
                                                <div style={{ fontSize: '.72rem', color: '#9ca3af', marginBottom: 8 }}>
                                                    📅 {new Date(rb.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                                                </div>
                                                <h3 style={{ fontWeight: 800, fontSize: '.95rem', color: '#111', lineHeight: 1.4, marginBottom: 10 }}>{rb.title}</h3>
                                                <p style={{ fontSize: '.8rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 12 }}>{rb.excerpt?.substring(0, 100)}...</p>
                                                <span style={{ color: '#4f46e5', fontWeight: 700, fontSize: '.82rem' }}>Read More →</span>
                                            </div>
                                        </div>
                                    </Link>
                                ))}
                            </div>
                        </div>
                    </section>
                )}

                {/* ── FOOTER ── */}
                <footer style={{ background: '#0a0f1e', color: '#fff', padding: '40px 6% 24px' }}>
                    <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
                        <div style={{ fontWeight: 900, fontSize: '1.1rem', fontFamily: "'Playfair Display', serif" }}>
                            Webra<span style={{ color: '#818cf8' }}>zeo</span>
                        </div>
                        <div style={{ display: 'flex', gap: 20 }}>
                            <Link href="/" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem' }}>Home</Link>
                            <Link href="/blog" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '.82rem', fontWeight: 700 }}>Blog</Link>
                            <Link href="/signup" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.82rem' }}>Sign Up</Link>
                        </div>
                        <div style={{ color: '#334155', fontSize: '.75rem' }}>© 2026 Webrazeo. All rights reserved.</div>
                    </div>
                </footer>
            </div>
        </>
    )
}
