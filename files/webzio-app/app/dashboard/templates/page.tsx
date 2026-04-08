'use client'
import { useState } from 'react'
import Link from 'next/link'
import { ALL_TEMPLATES, TEMPLATE_CATEGORIES } from '../../../lib/templates'

export default function TemplatesPage() {
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')

  const filtered = ALL_TEMPLATES.filter(t => {
    const matchCat = activeCategory === 'All' || t.category === activeCategory
    const matchSearch = t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase())
    return matchCat && matchSearch
  })

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.6rem', fontWeight: 900, color: '#0f172a', marginBottom: 6, letterSpacing: '-.02em' }}>
          🎨 Templates
        </h1>
        <p style={{ color: '#64748b', fontSize: '.9rem' }}>
          Choose from {ALL_TEMPLATES.length} professional templates. Pick one and your store goes live instantly.
        </p>
      </div>

      {/* Search + Filter */}
      <div style={{ display: 'flex', gap: 12, marginBottom: 28, flexWrap: 'wrap', alignItems: 'center' }}>
        <input
          type="text"
          placeholder="🔍  Search templates..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          style={{ padding: '10px 16px', border: '1.5px solid #e2e8f0', borderRadius: 10, fontSize: '.88rem', outline: 'none', width: 240, background: '#fff' }}
        />
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {['All', ...TEMPLATE_CATEGORIES].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              style={{
                padding: '8px 16px', borderRadius: 50, border: 'none', cursor: 'pointer', fontSize: '.8rem', fontWeight: 700, transition: 'all .2s',
                background: activeCategory === cat ? 'linear-gradient(135deg,#4f46e5,#7c3aed)' : '#f1f5f9',
                color: activeCategory === cat ? '#fff' : '#475569',
                boxShadow: activeCategory === cat ? '0 4px 12px rgba(79,70,229,.3)' : 'none',
              }}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Count */}
      <p style={{ color: '#94a3b8', fontSize: '.82rem', marginBottom: 20 }}>
        Showing {filtered.length} template{filtered.length !== 1 ? 's' : ''}
        {activeCategory !== 'All' ? ` in "${activeCategory}"` : ''}
      </p>

      {/* Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: 20 }}>
        {filtered.map(t => (
          <div key={t.id} style={{ borderRadius: 16, overflow: 'hidden', border: '1.5px solid #f0f0f0', background: '#fff', boxShadow: '0 2px 12px rgba(0,0,0,.04)', transition: 'transform .25s, box-shadow .25s' }}
            onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.transform = 'translateY(-4px)'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 12px 36px rgba(79,70,229,.12)' }}
            onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.transform = 'none'; (e.currentTarget as HTMLDivElement).style.boxShadow = '0 2px 12px rgba(0,0,0,.04)' }}
          >
            {/* Preview */}
            <div style={{ height: 140, background: t.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', padding: 16 }}>
              {t.popular && (
                <div style={{ position: 'absolute', top: 10, right: 10, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 800 }}>
                  🔥 Popular
                </div>
              )}
              <div style={{ position: 'absolute', top: 10, left: 10, background: 'rgba(255,255,255,.2)', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 700 }}>
                {t.category}
              </div>
              <div style={{ fontSize: '2.8rem', marginBottom: 8 }}>{t.icon}</div>
              <div style={{ fontWeight: 900, fontSize: '.88rem', textAlign: 'center', fontFamily: '"Playfair Display", serif' }}>{t.name}</div>
            </div>

            {/* Info */}
            <div style={{ padding: '14px 16px' }}>
              <div style={{ fontSize: '.78rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 12 }}>{t.desc}</div>
              <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap', marginBottom: 14 }}>
                {t.tags.map(tag => (
                  <span key={tag} style={{ fontSize: '.62rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                ))}
              </div>
              <Link
                href={`/dashboard/stores?template=${t.id}`}
                style={{ display: 'block', textAlign: 'center', padding: '9px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.8rem', boxShadow: '0 3px 10px rgba(79,70,229,.25)' }}
              >
                Use This Template →
              </Link>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>🔍</div>
          <div style={{ fontWeight: 700, marginBottom: 6 }}>No templates found</div>
          <div style={{ fontSize: '.85rem' }}>Try a different search or category</div>
        </div>
      )}
    </div>
  )
}
