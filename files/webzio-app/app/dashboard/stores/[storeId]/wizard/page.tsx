'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
    purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
    textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)', green: '#22C55E'
}

export default function StoreSetupWizard() {
    const params = useParams()
    const router = useRouter()
    const { token } = useAuthStore()
    const [step, setStep] = useState(1)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [templates, setTemplates] = useState<any[]>([])
    const [categories, setCategories] = useState<any[]>([])
    const [form, setForm] = useState({
        templateId: '',
        categoryId: '',
        siteName: '',
        contactEmail: '',
        contactPhone: '',
        address: '',
        logo: '',
        heroTitle: '',
        heroSubtitle: ''
    })

    useEffect(() => {
        loadData()
    }, [])

    const loadData = async () => {
        try {
            // Load templates
            const tRes = await fetch('/api/admin/templates', { headers: { Authorization: `Bearer ${token}` } })
            const tData = await tRes.json()
            if (tData.success) setTemplates(tData.templates)

            // Load categories
            const cRes = await fetch('/api/admin/categories', { headers: { Authorization: `Bearer ${token}` } })
            const cData = await cRes.json()
            if (cData.success) setCategories(cData.categories)

            // Load existing store data
            const sRes = await fetch(`/api/store/${params.storeId}`, { headers: { Authorization: `Bearer ${token}` } })
            const sData = await sRes.json()
            if (sData.success) {
                const store = sData.website
                setForm({
                    templateId: store.templateId || '',
                    categoryId: store.categoryId || '',
                    siteName: store.siteName || '',
                    contactEmail: store.contactEmail || '',
                    contactPhone: store.contactPhone || '',
                    address: store.address || '',
                    logo: store.content?.logo || '',
                    heroTitle: store.content?.heroTitle || '',
                    heroSubtitle: store.content?.heroSubtitle || ''
                })
                // Determine current step based on completion
                if (!store.templateId) setStep(1)
                else if (!store.categoryId) setStep(2)
                else if (!store.siteName) setStep(3)
                else setStep(4)
            }
        } catch (error) {
            toast.error('Failed to load data')
        }
        setLoading(false)
    }

    const handleNext = async () => {
        if (step === 1 && !form.templateId) {
            toast.error('Please select a template')
            return
        }
        if (step === 2 && !form.categoryId) {
            toast.error('Please select a category')
            return
        }
        if (step === 3 && !form.siteName.trim()) {
            toast.error('Please enter business name')
            return
        }

        if (step < 4) {
            setStep(step + 1)
        } else {
            await handlePublish()
        }
    }

    const handlePublish = async () => {
        setSaving(true)
        try {
            const res = await fetch(`/api/store/${params.storeId}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
                body: JSON.stringify({
                    templateId: form.templateId,
                    categoryId: form.categoryId,
                    siteName: form.siteName,
                    contactEmail: form.contactEmail,
                    contactPhone: form.contactPhone,
                    address: form.address,
                    content: {
                        logo: form.logo,
                        heroTitle: form.heroTitle,
                        heroSubtitle: form.heroSubtitle
                    },
                    isActive: true
                })
            })
            const data = await res.json()
            if (data.success) {
                toast.success('🎉 Store published successfully!')
                router.push(`/dashboard/stores/${params.storeId}`)
            } else {
                toast.error(data.message || 'Failed to publish')
            }
        } catch (error) {
            toast.error('An error occurred')
        }
        setSaving(false)
    }

    if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading wizard...</div>

    const inputStyle = {
        width: '100%', padding: 14, background: '#0A0F1E', border: `1px solid ${C.border}`,
        borderRadius: 10, color: C.text, outline: 'none', fontSize: '0.9rem'
    }

    const labelStyle = {
        display: 'block', fontSize: '0.85rem', fontWeight: 700, color: C.textMuted,
        marginBottom: 10, textTransform: 'uppercase' as const
    }

    return (
        <div style={{ padding: 24, maxWidth: 900, margin: '0 auto' }}>
            {/* Header */}
            <div style={{ marginBottom: 40, textAlign: 'center' }}>
                <h1 style={{ fontSize: '2rem', fontWeight: 900, color: C.text, marginBottom: 12 }}>
                    🧙 Store Setup Wizard
                </h1>
                <p style={{ color: C.textMuted, fontSize: '0.95rem' }}>
                    Complete these 4 simple steps to launch your store
                </p>
            </div>

            {/* Progress Bar */}
            <div style={{ marginBottom: 48 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    {[
                        { num: 1, label: 'Template' },
                        { num: 2, label: 'Category' },
                        { num: 3, label: 'Business Info' },
                        { num: 4, label: 'Publish' }
                    ].map((s, i) => (
                        <div key={i} style={{ flex: 1, textAlign: 'center' }}>
                            <div style={{
                                width: 40, height: 40, borderRadius: '50%', margin: '0 auto 8px',
                                background: step >= s.num ? `linear-gradient(135deg, ${C.purple}, ${C.cyan})` : C.card,
                                border: `2px solid ${step >= s.num ? C.purple : C.border}`,
                                display: 'flex', alignItems: 'center', justifyContent: 'center',
                                color: step >= s.num ? '#fff' : C.textMuted, fontWeight: 800, fontSize: '0.9rem',
                                transition: 'all 0.3s'
                            }}>
                                {step > s.num ? '✓' : s.num}
                            </div>
                            <div style={{
                                fontSize: '0.75rem', fontWeight: 600,
                                color: step >= s.num ? C.text : C.textMuted
                            }}>{s.label}</div>
                        </div>
                    ))}
                </div>
                <div style={{ width: '100%', height: 4, background: C.card, borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{
                        width: `${(step / 4) * 100}%`, height: '100%',
                        background: `linear-gradient(90deg, ${C.purple}, ${C.cyan})`,
                        transition: 'width 0.5s ease'
                    }} />
                </div>
            </div>

            {/* Step Content */}
            <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 20, padding: 40, minHeight: 400 }}>

                {/* Step 1: Select Template */}
                {step === 1 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>
                            Step 1: Select Template
                        </h2>
                        <p style={{ color: C.textMuted, marginBottom: 32 }}>
                            Choose a design template that best fits your business
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
                            {templates.map((template) => (
                                <div key={template._id} onClick={() => setForm({ ...form, templateId: template._id })}
                                    style={{
                                        background: form.templateId === template._id ? 'rgba(124, 58, 237, 0.1)' : '#0A0F1E',
                                        border: `2px solid ${form.templateId === template._id ? C.purple : C.border}`,
                                        borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                                        position: 'relative'
                                    }}>
                                    {form.templateId === template._id && (
                                        <div style={{
                                            position: 'absolute', top: 10, right: 10, width: 24, height: 24,
                                            borderRadius: '50%', background: C.green, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem'
                                        }}>✓</div>
                                    )}
                                    <div style={{ fontSize: '2.5rem', marginBottom: 12, textAlign: 'center' }}>
                                        {template.icon || '🎨'}
                                    </div>
                                    <h3 style={{ fontSize: '1rem', fontWeight: 700, color: C.text, marginBottom: 6, textAlign: 'center' }}>
                                        {template.name}
                                    </h3>
                                    <p style={{ fontSize: '0.8rem', color: C.textMuted, textAlign: 'center' }}>
                                        {template.description}
                                    </p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 2: Choose Category */}
                {step === 2 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>
                            Step 2: Choose Category
                        </h2>
                        <p style={{ color: C.textMuted, marginBottom: 32 }}>
                            Select the category that best describes your business
                        </p>
                        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 16 }}>
                            {categories.map((category) => (
                                <div key={category._id} onClick={() => setForm({ ...form, categoryId: category._id })}
                                    style={{
                                        background: form.categoryId === category._id ? 'rgba(124, 58, 237, 0.1)' : '#0A0F1E',
                                        border: `2px solid ${form.categoryId === category._id ? C.purple : C.border}`,
                                        borderRadius: 12, padding: 20, cursor: 'pointer', transition: 'all 0.2s',
                                        textAlign: 'center', position: 'relative'
                                    }}>
                                    {form.categoryId === category._id && (
                                        <div style={{
                                            position: 'absolute', top: 10, right: 10, width: 24, height: 24,
                                            borderRadius: '50%', background: C.green, display: 'flex',
                                            alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '0.7rem'
                                        }}>✓</div>
                                    )}
                                    <div style={{ fontSize: '2rem', marginBottom: 8 }}>{category.icon || '📁'}</div>
                                    <div style={{ fontSize: '0.9rem', fontWeight: 700, color: C.text }}>{category.name}</div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Step 3: Add Business Info */}
                {step === 3 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>
                            Step 3: Add Business Info
                        </h2>
                        <p style={{ color: C.textMuted, marginBottom: 32 }}>
                            Tell us about your business
                        </p>
                        <div style={{ display: 'grid', gap: 24 }}>
                            <div>
                                <label style={labelStyle}>Business Name *</label>
                                <input value={form.siteName} onChange={e => setForm({ ...form, siteName: e.target.value })}
                                    placeholder="My Awesome Store" style={inputStyle} />
                            </div>
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                                <div>
                                    <label style={labelStyle}>Contact Email</label>
                                    <input type="email" value={form.contactEmail}
                                        onChange={e => setForm({ ...form, contactEmail: e.target.value })}
                                        placeholder="contact@store.com" style={inputStyle} />
                                </div>
                                <div>
                                    <label style={labelStyle}>Contact Phone</label>
                                    <input value={form.contactPhone}
                                        onChange={e => setForm({ ...form, contactPhone: e.target.value })}
                                        placeholder="+1 234 567 8900" style={inputStyle} />
                                </div>
                            </div>
                            <div>
                                <label style={labelStyle}>Business Address</label>
                                <input value={form.address} onChange={e => setForm({ ...form, address: e.target.value })}
                                    placeholder="123 Main St, City, Country" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Logo URL (Optional)</label>
                                <input value={form.logo} onChange={e => setForm({ ...form, logo: e.target.value })}
                                    placeholder="https://example.com/logo.png" style={inputStyle} />
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Publish */}
                {step === 4 && (
                    <div>
                        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: C.text, marginBottom: 24 }}>
                            Step 4: Ready to Publish!
                        </h2>
                        <p style={{ color: C.textMuted, marginBottom: 32 }}>
                            Add a hero message and publish your store
                        </p>
                        <div style={{ display: 'grid', gap: 24, marginBottom: 32 }}>
                            <div>
                                <label style={labelStyle}>Hero Title</label>
                                <input value={form.heroTitle} onChange={e => setForm({ ...form, heroTitle: e.target.value })}
                                    placeholder="Welcome to Our Store" style={inputStyle} />
                            </div>
                            <div>
                                <label style={labelStyle}>Hero Subtitle</label>
                                <textarea value={form.heroSubtitle}
                                    onChange={e => setForm({ ...form, heroSubtitle: e.target.value })}
                                    placeholder="Discover amazing products at great prices"
                                    rows={3} style={{ ...inputStyle, resize: 'vertical' as const }} />
                            </div>
                        </div>
                        <div style={{
                            background: 'rgba(34, 197, 94, 0.1)', border: '1px solid rgba(34, 197, 94, 0.3)',
                            borderRadius: 12, padding: 24, textAlign: 'center'
                        }}>
                            <div style={{ fontSize: '3rem', marginBottom: 12 }}>🎉</div>
                            <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.green, marginBottom: 8 }}>
                                You're All Set!
                            </h3>
                            <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>
                                Click the button below to publish your store and make it live
                            </p>
                        </div>
                    </div>
                )}
            </div>

            {/* Navigation Buttons */}
            <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 32 }}>
                <button onClick={() => step > 1 && setStep(step - 1)} disabled={step === 1}
                    style={{
                        padding: '14px 28px', background: C.card, border: `1px solid ${C.border}`,
                        borderRadius: 10, color: C.text, fontWeight: 700, cursor: step === 1 ? 'not-allowed' : 'pointer',
                        opacity: step === 1 ? 0.5 : 1
                    }}>
                    ← Previous
                </button>
                <button onClick={handleNext} disabled={saving}
                    style={{
                        padding: '14px 32px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                        border: 'none', borderRadius: 10, color: '#fff', fontWeight: 700,
                        cursor: saving ? 'not-allowed' : 'pointer', opacity: saving ? 0.7 : 1
                    }}>
                    {saving ? 'Publishing...' : step === 4 ? '🚀 Publish Store' : 'Next →'}
                </button>
            </div>
        </div>
    )
}
