'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

export default function NewStorePage() {
    const router = useRouter()
    const { token } = useAuthStore()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(false)
    const [templates, setTemplates] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])

    const [formData, setFormData] = useState({
        templateId: '',
        category: '',
        name: '',
        description: '',
        contactEmail: '',
        contactPhone: '',
        address: ''
    })

    useEffect(() => {
        if (step === 1) loadTemplates()
        if (step === 2) loadCategories()
    }, [step])

    const loadTemplates = async () => {
        const res = await fetch('/api/admin/templates')
        const data = await res.json()
        if (data.success) setTemplates(data.templates.filter((t: any) => t.isActive))
    }

    const loadCategories = async () => {
        const res = await fetch('/api/admin/categories')
        const data = await res.json()
        if (data.success) setCategories(data.categories)
    }

    const handleNext = () => {
        if (step === 1 && !formData.templateId) return toast.error('Please select a template')
        if (step === 2 && !formData.category) return toast.error('Please select a category')
        if (step === 3) {
            if (!formData.name) return toast.error('Store name is required')
            if (!formData.contactEmail) return toast.error('Contact email is required')
        }
        if (step < 4) setStep(step + 1)
    }

    const handlePublish = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/websites', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify(formData)
            })
            const data = await res.json()
            if (data.success) {
                toast.success('Store created successfully!')
                router.push(`/dashboard/stores/${data.website._id}`)
            } else {
                toast.error(data.message || 'Failed to create store')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
        setLoading(false)
    }

    return (
        <div style={{ padding: 24 }}>
            {/* Progress Steps */}
            <div style={{ maxWidth: 800, margin: '0 auto 40px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    {[1, 2, 3, 4].map(s => (
                        <div key={s} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%',
                                background: step >= s ? `linear-gradient(135deg, ${C.purple}, ${C.cyan})` : C.card,
                                border: `2px solid ${step >= s ? C.purple : C.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                margin: '0 auto 8px', fontWeight: 700, color: '#fff'
                            }}>{s}</div>
                            <div style={{ fontSize: '0.75rem', color: step >= s ? C.cyan : C.textMuted, fontWeight: 600 }}>
                                {s === 1 ? 'Template' : s === 2 ? 'Category' : s === 3 ? 'Info' : 'Publish'}
                            </div>
                        </div>
                    ))}
                </div>
                <div style={{ height: 4, background: C.card, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                        width: `${(step / 4) * 100}%`, height: '100%',
                        background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
                        transition: 'width 0.3s'
                    }} />
                </div>
            </div>

            {/* Step Content */}
            <div style={{ maxWidth: 900, margin: '0 auto', background: C.card, borderRadius: 16, padding: 32, border: `1px solid ${C.border}` }}>

                {/* Step 1: Select Template */}
                {step === 1 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 8 }}>🎨 Choose Your Template</h2>
                        <p style={{ color: C.textMuted, marginBottom: 24 }}>Select a template that fits your business</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            {templates.map(t => (
                                <div key={t._id} onClick={() => setFormData({ ...formData, templateId: t._id })} style={{
                                    background: formData.templateId === t._id ? `${C.purple}20` : '#0A0F1E',
                                    border: `2px solid ${formData.templateId === t._id ? C.purple : C.border}`,
                                    borderRadius: 12, padding: 16, cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{t.icon}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text, marginBottom: 4 }}>{t.name}</div>
                                    <div style={{ fontSize: '0.75rem', color: C.textMuted }}>{t.category}</div>
                                    {t.popular && <span style={{ fontSize: '0.65rem', background: '#F59E0B', color: '#000', padding: '2px 8px', borderRadius: 10, marginTop: 8, display: 'inline-block' }}>⭐ Popular</span>}
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Select Category */}
                {step === 2 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 8 }}>📁 Choose Category</h2>
                        <p style={{ color: C.textMuted, marginBottom: 24 }}>What type of business do you have?</p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 16 }}>
                            {categories.map(cat => (
                                <div key={cat._id} onClick={() => setFormData({ ...formData, category: cat.name })} style={{
                                    background: formData.category === cat.name ? `${C.purple}20` : '#0A0F1E',
                                    border: `2px solid ${formData.category === cat.name ? C.purple : C.border}`,
                                    borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s'
                                }}>
                                    <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>{cat.icon}</div>
                                    <div style={{ fontSize: '1rem', fontWeight: 700, color: C.text, marginBottom: 6 }}>{cat.name}</div>
                                    <div style={{ fontSize: '0.8rem', color: C.textMuted }}>{cat.description}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Business Info */}
                {step === 3 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 8 }}>📝 Business Information</h2>
                        <p style={{ color: C.textMuted, marginBottom: 24 }}>Tell us about your business</p>
                        <div style={{ display: 'grid', gap: 20 }}>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Store Name *</label>
                                <input value={formData.name} onChange={e => setFormData({ ...formData, name: e.target.value })}
                                    placeholder="My Awesome Store" style={{ width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, outline: 'none' }} />
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Description</label>
                                <textarea value={formData.description} onChange={e => setFormData({ ...formData, description: e.target.value })}
                                    placeholder="Brief description of your business..." rows={3} style={{ width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, outline: 'none', resize: 'vertical' }} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Contact Email *</label>
                                    <input type="email" value={formData.contactEmail} onChange={e => setFormData({ ...formData, contactEmail: e.target.value })}
                                        placeholder="contact@store.com" style={{ width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, outline: 'none' }} />
                                </div>
                                <div>
                                    <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Contact Phone</label>
                                    <input value={formData.contactPhone} onChange={e => setFormData({ ...formData, contactPhone: e.target.value })}
                                        placeholder="+1 234 567 8900" style={{ width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, outline: 'none' }} />
                                </div>
                            </div>
                            <div>
                                <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted, marginBottom: 8 }}>Address</label>
                                <input value={formData.address} onChange={e => setFormData({ ...formData, address: e.target.value })}
                                    placeholder="123 Main St, City, Country" style={{ width: '100%', padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, outline: 'none' }} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Publish */}
                {step === 4 && (
                    <div style={{ textAlign: 'center', padding: '40px 0' }}>
                        <div style={{ fontSize: '4rem', marginBottom: 20 }}>🎉</div>
                        <h2 style={{ fontSize: '1.8rem', fontWeight: 800, color: C.text, marginBottom: 12 }}>Ready to Publish!</h2>
                        <p style={{ color: C.textMuted, marginBottom: 32, fontSize: '1.1rem' }}>Your store is ready to go live</p>
                        <div style={{ background: '#0A0F1E', borderRadius: 12, padding: 24, marginBottom: 32, textAlign: 'left' }}>
                            <div style={{ marginBottom: 12 }}><span style={{ color: C.textMuted }}>Store Name:</span> <span style={{ color: C.text, fontWeight: 600 }}>{formData.name}</span></div>
                            <div style={{ marginBottom: 12 }}><span style={{ color: C.textMuted }}>Category:</span> <span style={{ color: C.text, fontWeight: 600 }}>{formData.category}</span></div>
                            <div style={{ marginBottom: 12 }}><span style={{ color: C.textMuted }}>Email:</span> <span style={{ color: C.text, fontWeight: 600 }}>{formData.contactEmail}</span></div>
                            {formData.contactPhone && <div><span style={{ color: C.textMuted }}>Phone:</span> <span style={{ color: C.text, fontWeight: 600 }}>{formData.contactPhone}</span></div>}
                        </div>
                    </div>
                )}

                {/* Navigation Buttons */}
                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32, paddingTop: 24, borderTop: `1px solid ${C.border}` }}>
                    <button onClick={() => step > 1 ? setStep(step - 1) : router.push('/dashboard/stores')}
                        style={{ padding: '12px 24px', background: C.card, border: `1px solid ${C.border}`, borderRadius: 8, color: C.text, fontWeight: 600, cursor: 'pointer' }}>
                        {step === 1 ? 'Cancel' : 'Back'}
                    </button>
                    <button onClick={step === 4 ? handlePublish : handleNext} disabled={loading}
                        style={{ padding: '12px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`, border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: loading ? 'not-allowed' : 'pointer', opacity: loading ? 0.7 : 1 }}>
                        {loading ? 'Publishing...' : step === 4 ? '🚀 Publish Store' : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    )
}
