'use client'
import { useState } from 'react'
import Link from 'next/link'
import { portfolioTemplates } from '@/lib/portfolioTemplates'

export default function TemplatesPage() {
    const [selectedTemplate, setSelectedTemplate] = useState<any>(null)
    const [filter, setFilter] = useState('All')

    const categories = ['All', ...new Set(portfolioTemplates.map(t => t.category))]
    const filtered = filter === 'All' ? portfolioTemplates : portfolioTemplates.filter(t => t.category === filter)

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', paddingTop: 80 }}>
            {/* Header */}
            <div style={{ background: '#fff', borderBottom: '1px solid #e5e7eb', padding: '3rem 4%' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto', textAlign: 'center' }}>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: '1rem' }}>Portfolio Templates</h1>
                    <p style={{ fontSize: '1.1rem', color: '#6b7280', marginBottom: '2rem' }}>
                        Choose from our professional templates and customize to match your brand
                    </p>

                    {/* Filters */}
                    <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        {categories.map(cat => (
                            <button
                                key={cat}
                                onClick={() => setFilter(cat)}
                                style={{
                                    padding: '0.5rem 1.5rem',
                                    background: filter === cat ? '#4f46e5' : '#e5e7eb',
                                    color: filter === cat ? '#fff' : '#1a1a1a',
                                    border: 'none',
                                    borderRadius: 50,
                                    fontWeight: 600,
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                }}
                            >
                                {cat}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Templates Grid */}
            <div style={{ padding: '3rem 4%' }}>
                <div style={{ maxWidth: 1200, margin: '0 auto' }}>
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '2rem' }}>
                        {filtered.map(template => (
                            <div
                                key={template.id}
                                onClick={() => setSelectedTemplate(template)}
                                style={{
                                    background: '#fff',
                                    borderRadius: 16,
                                    overflow: 'hidden',
                                    boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s',
                                    transform: selectedTemplate?.id === template.id ? 'scale(1.02)' : 'scale(1)',
                                    border: selectedTemplate?.id === template.id ? `2px solid ${template.color}` : '2px solid transparent',
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.transform = 'translateY(-8px)'
                                    e.currentTarget.style.boxShadow = '0 12px 40px rgba(0,0,0,0.15)'
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.transform = selectedTemplate?.id === template.id ? 'scale(1.02)' : 'scale(1)'
                                    e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)'
                                }}
                            >
                                {/* Preview Image */}
                                <div style={{ position: 'relative', height: 200, overflow: 'hidden', background: template.color }}>
                                    <img
                                        src={template.preview}
                                        alt={template.name}
                                        style={{ width: '100%', height: '100%', objectFit: 'cover', opacity: 0.7 }}
                                    />
                                    <div style={{
                                        position: 'absolute',
                                        inset: 0,
                                        background: `linear-gradient(135deg, ${template.color}cc, ${template.color}99)`,
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        fontSize: '3rem',
                                    }}>
                                        {template.icon}
                                    </div>
                                </div>

                                {/* Content */}
                                <div style={{ padding: '1.5rem' }}>
                                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
                                        <span style={{ fontSize: '0.75rem', background: template.color, color: '#fff', padding: '0.25rem 0.75rem', borderRadius: 50, fontWeight: 600 }}>
                                            {template.category}
                                        </span>
                                    </div>
                                    <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '0.5rem' }}>{template.name}</h3>
                                    <p style={{ fontSize: '0.9rem', color: '#6b7280', marginBottom: '1rem' }}>{template.description}</p>

                                    {/* Sections */}
                                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap', marginBottom: '1rem' }}>
                                        {template.sections.map(section => (
                                            <span key={section} style={{ fontSize: '0.75rem', background: '#f0f0f0', padding: '0.25rem 0.75rem', borderRadius: 20, color: '#6b7280' }}>
                                                {section}
                                            </span>
                                        ))}
                                    </div>

                                    {/* Button */}
                                    <Link
                                        href={`/dashboard/portfolios/create?template=${template.id}`}
                                        style={{
                                            display: 'block',
                                            textAlign: 'center',
                                            padding: '0.75rem',
                                            background: template.color,
                                            color: '#fff',
                                            borderRadius: 8,
                                            textDecoration: 'none',
                                            fontWeight: 600,
                                            transition: 'all 0.3s',
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.opacity = '0.9'
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.opacity = '1'
                                        }}
                                    >
                                        Use Template
                                    </Link>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* Preview Modal */}
            {selectedTemplate && (
                <div
                    style={{
                        position: 'fixed',
                        inset: 0,
                        background: 'rgba(0,0,0,0.5)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        zIndex: 1000,
                        padding: '1rem',
                    }}
                    onClick={() => setSelectedTemplate(null)}
                >
                    <div
                        style={{
                            background: '#fff',
                            borderRadius: 16,
                            maxWidth: 900,
                            width: '100%',
                            maxHeight: '90vh',
                            overflow: 'auto',
                            boxShadow: '0 20px 60px rgba(0,0,0,0.3)',
                        }}
                        onClick={(e) => e.stopPropagation()}
                    >
                        {/* Modal Header */}
                        <div style={{ padding: '2rem', borderBottom: '1px solid #e5e7eb', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <div>
                                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '0.5rem' }}>{selectedTemplate.name}</h2>
                                <p style={{ color: '#6b7280' }}>{selectedTemplate.description}</p>
                            </div>
                            <button
                                onClick={() => setSelectedTemplate(null)}
                                style={{
                                    background: 'none',
                                    border: 'none',
                                    fontSize: '1.5rem',
                                    cursor: 'pointer',
                                    color: '#6b7280',
                                }}
                            >
                                ✕
                            </button>
                        </div>

                        {/* Modal Content */}
                        <div style={{ padding: '2rem' }}>
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Included Sections</h3>
                                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '1rem' }}>
                                    {selectedTemplate.sections.map((section: string) => (
                                        <div key={section} style={{ padding: '1rem', background: '#f9fafb', borderRadius: 8, textAlign: 'center', fontWeight: 500, color: '#1a1a1a' }}>
                                            ✓ {section}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* Features */}
                            <div style={{ marginBottom: '2rem' }}>
                                <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Features</h3>
                                <ul style={{ listStyle: 'none', padding: 0 }}>
                                    {[
                                        'Fully Responsive Design',
                                        'Customizable Colors & Fonts',
                                        'Mobile Optimized',
                                        'SEO Friendly',
                                        'Fast Loading',
                                        'Professional Layout',
                                    ].map(feature => (
                                        <li key={feature} style={{ padding: '0.5rem 0', color: '#6b7280' }}>
                                            ✓ {feature}
                                        </li>
                                    ))}
                                </ul>
                            </div>

                            {/* CTA */}
                            <Link
                                href={`/dashboard/portfolios/create?template=${selectedTemplate.id}`}
                                style={{
                                    display: 'block',
                                    textAlign: 'center',
                                    padding: '1rem',
                                    background: selectedTemplate.color,
                                    color: '#fff',
                                    borderRadius: 8,
                                    textDecoration: 'none',
                                    fontWeight: 700,
                                    fontSize: '1rem',
                                }}
                            >
                                Start Creating with This Template
                            </Link>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}
