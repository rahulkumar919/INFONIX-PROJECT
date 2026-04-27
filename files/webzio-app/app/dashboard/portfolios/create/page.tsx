'use client'
import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import toast from 'react-hot-toast'
import { portfolioTemplates } from '@/lib/portfolioTemplates'

export default function CreatePortfolio() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const templateId = searchParams.get('template')
    const [loading, setLoading] = useState(false)

    const selectedTemplate = portfolioTemplates.find(t => t.id === templateId)

    const [formData, setFormData] = useState({
        title: selectedTemplate?.name || '',
        category: selectedTemplate?.category || 'Developer',
        description: selectedTemplate?.description || '',
        fullName: '',
        email: '',
        phone: '',
        location: '',
        bio: '',
        profileImage: '',
        sections: {
            hero: { enabled: true, title: '', subtitle: '' },
            about: { enabled: true, content: '' },
            skills: { enabled: true, items: [{ name: '', level: 'Advanced' }] },
            experience: { enabled: true, items: [{ title: '', company: '', duration: '', description: '' }] },
            education: { enabled: true, items: [{ degree: '', school: '', year: '', details: '' }] },
            projects: { enabled: true, items: [{ name: '', description: '', image: '', link: '', technologies: [] }] },
            contact: { enabled: true, email: '', phone: '', social: { linkedin: '', github: '', twitter: '' } },
        },
        design: {
            colorScheme: selectedTemplate?.color || '#4f46e5',
            accentColor: '#FF6B7A',
            font: 'Inter',
            layout: 'modern',
        },
    })

    const handleInputChange = (e: any) => {
        const { name, value } = e.target
        setFormData(prev => ({ ...prev, [name]: value }))
    }

    const handleSectionChange = (section: string, field: string, value: any) => {
        setFormData(prev => ({
            ...prev,
            sections: {
                ...prev.sections,
                [section]: { ...prev.sections[section as keyof typeof prev.sections], [field]: value },
            },
        }))
    }

    const handleArrayItemChange = (section: string, index: number, field: string, value: any) => {
        setFormData(prev => {
            const newSections = { ...prev.sections }
            const sectionData = newSections[section as keyof typeof newSections] as any
            if (sectionData.items) {
                sectionData.items[index] = { ...sectionData.items[index], [field]: value }
            }
            return { ...prev, sections: newSections }
        })
    }

    const addArrayItem = (section: string) => {
        setFormData(prev => {
            const newSections = { ...prev.sections }
            const sectionData = newSections[section as keyof typeof newSections] as any
            if (sectionData.items) {
                sectionData.items.push(
                    section === 'skills' ? { name: '', level: 'Advanced' } :
                        section === 'experience' ? { title: '', company: '', duration: '', description: '' } :
                            section === 'education' ? { degree: '', school: '', year: '', details: '' } :
                                { name: '', description: '', image: '', link: '', technologies: [] }
                )
            }
            return { ...prev, sections: newSections }
        })
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault()
        setLoading(true)

        try {
            const res = await fetch('/api/portfolios', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(formData),
            })

            if (!res.ok) throw new Error('Failed to create portfolio')

            const portfolio = await res.json()
            toast.success('Portfolio created successfully!')
            router.push(`/dashboard/portfolios/${portfolio._id}`)
        } catch (error) {
            toast.error('Failed to create portfolio')
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <div style={{ minHeight: '100vh', background: '#f9fafb', padding: '2rem 4%' }}>
            <div style={{ maxWidth: 1000, margin: '0 auto' }}>
                <div style={{ marginBottom: '2rem' }}>
                    <Link href="/dashboard/portfolios" style={{ color: '#4f46e5', textDecoration: 'none', fontWeight: 600 }}>
                        ← Back to Portfolios
                    </Link>
                    <h1 style={{ fontSize: '2rem', fontWeight: 900, marginTop: '1rem' }}>Create New Portfolio</h1>
                </div>

                <form onSubmit={handleSubmit} style={{ background: 'white', borderRadius: 16, padding: '2rem', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
                    {/* Basic Info */}
                    <div style={{ marginBottom: '2rem' }}>
                        <h2 style={{ fontSize: '1.3rem', fontWeight: 700, marginBottom: '1rem' }}>Basic Information</h2>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem' }}>
                            <input type="text" name="fullName" placeholder="Full Name" value={formData.fullName} onChange={handleInputChange} required style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                            <input type="email" name="email" placeholder="Email" value={formData.email} onChange={handleInputChange} required style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                            <input type="tel" name="phone" placeholder="Phone" value={formData.phone} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                            <input type="text" name="location" placeholder="Location" value={formData.location} onChange={handleInputChange} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                        </div>
                        <textarea name="bio" placeholder="Bio" value={formData.bio} onChange={handleInputChange} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, marginTop: '1rem', minHeight: 100 }} />
                    </div>

                    {/* About Section */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" checked={formData.sections.about.enabled} onChange={(e) => handleSectionChange('about', 'enabled', e.target.checked)} />
                            <span style={{ fontWeight: 600 }}>About Section</span>
                        </label>
                        {formData.sections.about.enabled && (
                            <textarea placeholder="About content" value={formData.sections.about.content} onChange={(e) => handleSectionChange('about', 'content', e.target.value)} style={{ width: '100%', padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8, minHeight: 100 }} />
                        )}
                    </div>

                    {/* Skills Section */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: 12 }}>
                        <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                            <input type="checkbox" checked={formData.sections.skills.enabled} onChange={(e) => handleSectionChange('skills', 'enabled', e.target.checked)} />
                            <span style={{ fontWeight: 600 }}>Skills Section</span>
                        </label>
                        {formData.sections.skills.enabled && (
                            <>
                                {formData.sections.skills.items.map((skill, idx) => (
                                    <div key={idx} style={{ display: 'grid', gridTemplateColumns: '1fr 150px', gap: '1rem', marginBottom: '1rem' }}>
                                        <input type="text" placeholder="Skill name" value={skill.name} onChange={(e) => handleArrayItemChange('skills', idx, 'name', e.target.value)} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }} />
                                        <select value={skill.level} onChange={(e) => handleArrayItemChange('skills', idx, 'level', e.target.value)} style={{ padding: '0.75rem', border: '1px solid #e5e7eb', borderRadius: 8 }}>
                                            <option>Beginner</option>
                                            <option>Advanced</option>
                                            <option>Expert</option>
                                        </select>
                                    </div>
                                ))}
                                <button type="button" onClick={() => addArrayItem('skills')} style={{ padding: '0.5rem 1rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 6, cursor: 'pointer' }}>
                                    + Add Skill
                                </button>
                            </>
                        )}
                    </div>

                    {/* Design Settings */}
                    <div style={{ marginBottom: '2rem', padding: '1.5rem', background: '#f9fafb', borderRadius: 12 }}>
                        <h3 style={{ fontWeight: 600, marginBottom: '1rem' }}>Design</h3>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem' }}>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Primary Color</label>
                                <input type="color" value={formData.design.colorScheme} onChange={(e) => setFormData(prev => ({ ...prev, design: { ...prev.design, colorScheme: e.target.value } }))} style={{ width: '100%', height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 500 }}>Accent Color</label>
                                <input type="color" value={formData.design.accentColor} onChange={(e) => setFormData(prev => ({ ...prev, design: { ...prev.design, accentColor: e.target.value } }))} style={{ width: '100%', height: 40, border: 'none', borderRadius: 8, cursor: 'pointer' }} />
                            </div>
                        </div>
                    </div>

                    {/* Submit */}
                    <div style={{ display: 'flex', gap: '1rem' }}>
                        <button type="submit" disabled={loading} style={{ padding: '0.75rem 2rem', background: '#4f46e5', color: 'white', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', opacity: loading ? 0.6 : 1 }}>
                            {loading ? 'Creating...' : 'Create Portfolio'}
                        </button>
                        <Link href="/dashboard/portfolios" style={{ padding: '0.75rem 2rem', background: '#e5e7eb', color: '#1a1a1a', border: 'none', borderRadius: 8, fontWeight: 600, textDecoration: 'none', display: 'inline-block' }}>
                            Cancel
                        </Link>
                    </div>
                </form>
            </div>
        </div>
    )
}
