'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)'
}

const MAX_IMAGES = 5

export default function GalleryPage() {
  const params = useParams()
  const { token } = useAuthStore()
  const [images, setImages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [uploading, setUploading] = useState(false)
  const [newImageUrl, setNewImageUrl] = useState('')

  useEffect(() => {
    loadGallery()
  }, [])

  const loadGallery = async () => {
    try {
      const res = await fetch(`/api/store/${params.storeId}/gallery`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setImages(data.images)
    } catch (error) {
      console.error('Failed to load gallery')
    }
    setLoading(false)
  }

  const handleAddImage = async () => {
    if (!newImageUrl.trim()) {
      toast.error('Please enter an image URL')
      return
    }
    if (images.length >= MAX_IMAGES) {
      toast.error(`Maximum ${MAX_IMAGES} images allowed`)
      return
    }

    setUploading(true)
    try {
      const res = await fetch(`/api/store/${params.storeId}/gallery`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ imageUrl: newImageUrl })
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Image added!')
        setNewImageUrl('')
        loadGallery()
      } else {
        toast.error(data.message || 'Failed to add image')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
    setUploading(false)
  }

  const handleDeleteImage = async (id: string) => {
    if (!confirm('Delete this image?')) return

    try {
      const res = await fetch(`/api/store/${params.storeId}/gallery/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Image deleted')
        loadGallery()
      } else {
        toast.error(data.message || 'Failed to delete')
      }
    } catch (error) {
      toast.error('An error occurred')
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>

  return (
    <div style={{ padding: 24, maxWidth: 1000, margin: '0 auto' }}>
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>🖼️ Media Gallery</h1>
        <p style={{ color: C.textMuted }}>Upload and manage images (Maximum {MAX_IMAGES} images)</p>
      </div>

      {/* Upload Section */}
      {images.length < MAX_IMAGES && (
        <div style={{ background: C.card, border: `1px solid ${C.border}`, borderRadius: 16, padding: 24, marginBottom: 32 }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: C.text, marginBottom: 16 }}>Add New Image</h3>
          <div style={{ display: 'flex', gap: 12 }}>
            <input
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL (https://...)"
              style={{
                flex: 1, padding: 12, background: '#0A0F1E', border: `1px solid ${C.border}`,
                borderRadius: 8, color: C.text, outline: 'none'
              }}
              onKeyPress={e => e.key === 'Enter' && handleAddImage()}
            />
            <button onClick={handleAddImage} disabled={uploading} style={{
              padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
              border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700,
              cursor: uploading ? 'not-allowed' : 'pointer', opacity: uploading ? 0.7 : 1
            }}>
              {uploading ? 'Adding...' : '+ Add Image'}
            </button>
          </div>
          <div style={{ marginTop: 12, fontSize: '0.75rem', color: C.textMuted }}>
            💡 Tip: Use image hosting services like Imgur, Cloudinary, or your own server
          </div>
        </div>
      )}

      {/* Images Count */}
      <div style={{ marginBottom: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ fontSize: '0.9rem', color: C.textMuted }}>
          {images.length} / {MAX_IMAGES} images used
        </div>
        {images.length >= MAX_IMAGES && (
          <div style={{ fontSize: '0.8rem', color: '#F59E0B', fontWeight: 600 }}>
            ⚠️ Maximum limit reached
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 80, textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>🖼️</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>No Images Yet</h3>
          <p style={{ color: C.textMuted }}>Add your first image to get started</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: 20 }}>
          {images.map(img => (
            <div key={img._id} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
              overflow: 'hidden', position: 'relative'
            }}>
              <div style={{ aspectRatio: '16/9', overflow: 'hidden', background: '#0A0F1E' }}>
                <img
                  src={img.imageUrl}
                  alt={img.title || 'Gallery image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%230A0F1E" width="400" height="300"/%3E%3Ctext fill="%2394A3B8" font-family="Arial" font-size="20" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3EImage not found%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              <div style={{ padding: 12 }}>
                <div style={{ fontSize: '0.75rem', color: C.textMuted, marginBottom: 8 }}>
                  {img.title || 'Untitled'}
                </div>
                <button onClick={() => handleDeleteImage(img._id)} style={{
                  width: '100%', padding: '8px', background: 'rgba(239, 68, 68, 0.1)',
                  border: '1px solid rgba(239, 68, 68, 0.3)', borderRadius: 6,
                  color: '#EF4444', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer'
                }}>
                  🗑️ Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
