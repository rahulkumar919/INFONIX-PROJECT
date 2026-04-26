'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'

export default function AdminHeroBannerPage() {
    const { token } = useAuthStore()
    const { C } = useAdminTheme()
    const [banner, setBanner] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [uploading, setUploading] = useState<string | null>(null)
    const [form, setForm] = useState({
        topLeftImage: '',
        bottomLeftImage: '',
        topRightImage: '',
        bottomRightImage: ''
    })

    useEffect(() => {
        loadBanner()
    }, [])

    const loadBanner = async () => {
        setLoading(true)
        try {
            const res = await fetch('/api/admin/hero-banner', {
                headers: { Authorization: `Bearer ${token}` }
            })
            const data = await res.json()
            if (data.success && data.banner) {
                setBanner(data.banner)
                setForm({
                    topLeftImage: data.banner.topLeftImage || '',
                    bottomLeftImage: data.banner.bottomLeftImage || '',
                    topRightImage: data.banner.topRightImage || '',
                    bottomRightImage: data.banner.bottomRightImage || ''
                })
            }
        } catch (error) {
            console.error('Failed to load banner:', error)
        }
        setLoading(false)
    }

    const handleImageUpload = async (position: string, file: File) => {
        if (!file) return

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please upload an image file')
            return
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size should be less than 5MB')
            return
        }

        setUploading(position)

        try {
            // Convert to base64 for simple storage (you can replace with Cloudinary later)
            const reader = new FileReader()
            reader.onloadend = () => {
                const base64 = reader.result as string
                setForm(prev => ({ ...prev, [position]: base64 }))
                setUploading(null)
            }
            reader.onerror = () => {
                alert('Failed to read image file')
                setUploading(null)
            }
            reader.readAsDataURL(file)
        } catch (error) {
            console.error('Upload error:', error)
            alert('Failed to upload image')
            setUploading(null)
        }
    }

    const handleSave = async () => {
        // Validate all images are uploaded
        if (!form.topLeftImage || !form.bottomLeftImage || !form.topRightImage || !form.bottomRightImage) {
            alert('Please upload all 4 images')
            return
        }

        setSaving(true)
        try {
            const res = await fetch('/api/admin/hero-banner', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`
                },
                body: JSON.stringify(form)
            })

            const data = await res.json()
            if (data.success) {
                alert('Hero banner updated successfully!')
                setBanner(data.banner)
            } else {
                alert(data.message || 'Failed to save banner')
            }
        } catch (error) {
            console.error('Save error:', error)
            alert('Failed to save banner')
        }
        setSaving(false)
    }

    const ImageUploadBox = ({ position, label }: { position: string; label: string }) => {
        const imageUrl = form[position as keyof typeof form]
        const isUploading = uploading === position

        return (
            <div style={{
                background: C.card,
                border: `2px dashed ${imageUrl ? C.green : C.border}`,
                borderRadius: 16,
                padding: 20,
                textAlign: 'center',
                position: 'relative',
                overflow: 'hidden'
            }}>
                <div style={{
                    fontSize: '.8rem',
                    fontWeight: 700,
                    color: C.text,
                    marginBottom: 12,
                    textTransform: 'uppercase',
                    letterSpacing: '.05em'
                }}>
                    {label}
                </div>

                {imageUrl ? (
                    <div style={{ position: 'relative' }}>
                        <img
                            src={imageUrl}
                            alt={label}
                            style={{
                                width: '100%',
                                height: 200,
                                objectFit: 'cover',
                                borderRadius: 12,
                                display: 'block'
                            }}
                        />
                        <button
                            onClick={() => setForm(prev => ({ ...prev, [position]: '' }))}
                            style={{
                                position: 'absolute',
                                top: 8,
                                right: 8,
                                background: 'rgba(239,68,68,0.9)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: 8,
                                padding: '6px 12px',
                                fontSize: '.75rem',
                                fontWeight: 700,
                                cursor: 'pointer'
                            }}
                        >
                            ✕ Remove
                        </button>
                    </div>
                ) : (
                    <label style={{
                        display: 'block',
                        cursor: 'pointer',
                        padding: '40px 20px',
                        background: C.card2,
                        borderRadius: 12,
                        border: `1px solid ${C.border}`
                    }}>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => {
                                const file = e.target.files?.[0]
                                if (file) handleImageUpload(position, file)
                            }}
                            style={{ display: 'none' }}
                            disabled={isUploading}
                        />
                        <div style={{ fontSize: '2.5rem', marginBottom: 12 }}>
                            {isUploading ? '⏳' : '📸'}
                        </div>
                        <div style={{
                            fontSize: '.85rem',
                            fontWeight: 600,
                            color: C.text,
                            marginBottom: 6
                        }}>
                            {isUploading ? 'Uploading...' : 'Click to upload'}
                        </div>
                        <div style={{ fontSize: '.72rem', color: C.textMuted }}>
                            PNG, JPG up to 5MB
                        </div>
                    </label>
                )}
            </div>
        )
    }

    if (loading) {
        return (
            <div style={{ textAlign: 'center', padding: '60px 0' }}>
                <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🎨</div>
                <div style={{ color: C.textMuted, fontSize: '.9rem' }}>Loading hero banner...</div>
            </div>
        )
    }

    return (
        <div>
            <style>{`
        @keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}
        @keyframes pulse{0%,100%{opacity:1}50%{opacity:.5}}
      `}</style>

            {/* Header */}
            <div style={{ marginBottom: 28, animation: 'fadeIn .5s ease' }}>
                <h1 style={{ fontSize: '1.75rem', fontWeight: 900, color: C.text, letterSpacing: '-.03em', marginBottom: 4 }}>
                    🎨 Hero Banner Management
                </h1>
                <p style={{ color: C.textMuted, fontSize: '.86rem' }}>
                    Upload 4 images to display in the homepage hero section
                </p>
            </div>

            {/* Info Banner */}
            <div style={{
                background: `${C.blue}10`,
                border: `1px solid ${C.blue}30`,
                borderRadius: 12,
                padding: '14px 18px',
                marginBottom: 24,
                display: 'flex',
                alignItems: 'center',
                gap: 12
            }}>
                <div style={{ fontSize: '1.5rem' }}>💡</div>
                <div>
                    <div style={{ fontSize: '.82rem', fontWeight: 600, color: C.text, marginBottom: 2 }}>
                        Image Guidelines
                    </div>
                    <div style={{ fontSize: '.75rem', color: C.textMuted }}>
                        Upload high-quality images (recommended: 400x300px). Images will be displayed in the hero section grid layout.
                    </div>
                </div>
            </div>

            {/* Image Upload Grid */}
            <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: 20,
                marginBottom: 24
            }}>
                <ImageUploadBox position="topLeftImage" label="Top Left Image" />
                <ImageUploadBox position="topRightImage" label="Top Right Image" />
                <ImageUploadBox position="bottomLeftImage" label="Bottom Left Image" />
                <ImageUploadBox position="bottomRightImage" label="Bottom Right Image" />
            </div>

            {/* Preview Section */}
            {form.topLeftImage && form.bottomLeftImage && form.topRightImage && form.bottomRightImage && (
                <div style={{
                    background: C.card,
                    border: `1px solid ${C.cardBorder}`,
                    borderRadius: 16,
                    padding: 24,
                    marginBottom: 24
                }}>
                    <h3 style={{ fontSize: '.92rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>
                        📱 Preview
                    </h3>
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: '1fr 2fr 1fr',
                        gap: 20,
                        alignItems: 'center',
                        background: '#f9fafb',
                        padding: 24,
                        borderRadius: 12
                    }}>
                        {/* Left Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <img src={form.topLeftImage} alt="Top Left" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }} />
                            <img src={form.bottomLeftImage} alt="Bottom Left" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }} />
                        </div>

                        {/* Center - Placeholder */}
                        <div style={{
                            background: 'linear-gradient(135deg, #4f46e5, #7c3aed)',
                            borderRadius: 16,
                            padding: 40,
                            textAlign: 'center',
                            color: '#fff'
                        }}>
                            <div style={{ fontSize: '2rem', marginBottom: 8 }}>💻</div>
                            <div style={{ fontSize: '.85rem', fontWeight: 700 }}>Laptop Showcase</div>
                            <div style={{ fontSize: '.7rem', opacity: 0.8 }}>Live Preview Section</div>
                        </div>

                        {/* Right Column */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                            <img src={form.topRightImage} alt="Top Right" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }} />
                            <img src={form.bottomRightImage} alt="Bottom Right" style={{ width: '100%', height: 120, objectFit: 'cover', borderRadius: 12 }} />
                        </div>
                    </div>
                </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: 12, justifyContent: 'flex-end' }}>
                <button
                    onClick={loadBanner}
                    disabled={loading}
                    style={{
                        padding: '12px 24px',
                        background: C.card2,
                        border: `1px solid ${C.border}`,
                        borderRadius: 10,
                        color: C.text,
                        fontWeight: 700,
                        fontSize: '.85rem',
                        cursor: 'pointer'
                    }}
                >
                    🔄 Reset
                </button>
                <button
                    onClick={handleSave}
                    disabled={saving || !form.topLeftImage || !form.bottomLeftImage || !form.topRightImage || !form.bottomRightImage}
                    style={{
                        padding: '12px 32px',
                        background: saving ? C.textMuted : `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
                        border: 'none',
                        borderRadius: 10,
                        color: '#fff',
                        fontWeight: 800,
                        fontSize: '.86rem',
                        cursor: saving ? 'not-allowed' : 'pointer',
                        boxShadow: `0 4px 16px ${C.purple}40`,
                        opacity: (!form.topLeftImage || !form.bottomLeftImage || !form.topRightImage || !form.bottomRightImage) ? 0.5 : 1
                    }}
                >
                    {saving ? '⏳ Saving...' : '✓ Save Hero Banner'}
                </button>
            </div>

            {/* Current Banner Info */}
            {banner && (
                <div style={{
                    marginTop: 24,
                    padding: 16,
                    background: `${C.green}10`,
                    border: `1px solid ${C.green}30`,
                    borderRadius: 12
                }}>
                    <div style={{ fontSize: '.8rem', fontWeight: 700, color: C.green, marginBottom: 4 }}>
                        ✓ Current Banner Active
                    </div>
                    <div style={{ fontSize: '.72rem', color: C.textMuted }}>
                        Last updated: {new Date(banner.updatedAt).toLocaleString()}
                    </div>
                </div>
            )}
        </div>
    )
}
