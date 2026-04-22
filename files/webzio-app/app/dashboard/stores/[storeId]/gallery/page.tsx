'use client'
import { useEffect, useState } from 'react'
import { useParams } from 'next/navigation'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

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
        toast.success('Image added successfully! 🎉')
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
    if (!confirm('Are you sure you want to delete this image?')) return

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

  if (loading) {
    return (
      <div style={{ padding: '100px 0', textAlign: 'center' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 16, animation: 'spin 1s linear infinite' }}>⚙️</div>
        <div style={{ color: '#64748b', fontSize: '0.95rem', fontWeight: 600 }}>Loading gallery...</div>
        <style>{`@keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }`}</style>
      </div>
    )
  }

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
      {/* Header */}
      <div style={{ marginBottom: 32 }}>
        <h1 style={{ fontSize: '1.9rem', fontWeight: 900, color: '#0f172a', marginBottom: 8, letterSpacing: '-0.02em' }}>
          🖼️ Media Gallery
        </h1>
        <p style={{ color: '#64748b', fontSize: '0.95rem' }}>
          Upload and manage your store images (Maximum {MAX_IMAGES} images)
        </p>
      </div>

      {/* Upload Section */}
      {images.length < MAX_IMAGES && (
        <div style={{
          background: '#fff',
          border: '2px dashed #e2e8f0',
          borderRadius: 16,
          padding: 32,
          marginBottom: 32,
          transition: 'all 0.2s'
        }}
          onMouseEnter={e => {
            e.currentTarget.style.borderColor = '#3B82F6'
            e.currentTarget.style.background = '#f8fafc'
          }}
          onMouseLeave={e => {
            e.currentTarget.style.borderColor = '#e2e8f0'
            e.currentTarget.style.background = '#fff'
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
            <div style={{
              width: 48,
              height: 48,
              background: 'linear-gradient(135deg, #3B82F6, #2563EB)',
              borderRadius: 12,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '1.5rem',
              boxShadow: '0 4px 14px rgba(59, 130, 246, 0.3)'
            }}>
              📸
            </div>
            <div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 800, color: '#0f172a', marginBottom: 4 }}>Add New Image</h3>
              <p style={{ fontSize: '0.85rem', color: '#64748b' }}>Paste your image URL below</p>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 12, marginBottom: 16 }}>
            <input
              value={newImageUrl}
              onChange={e => setNewImageUrl(e.target.value)}
              placeholder="Enter image URL (https://...)"
              style={{
                flex: 1,
                padding: '14px 18px',
                background: '#f8fafc',
                border: '1.5px solid #e2e8f0',
                borderRadius: 10,
                color: '#0f172a',
                outline: 'none',
                fontSize: '0.95rem',
                transition: 'all 0.2s'
              }}
              onFocus={e => {
                e.currentTarget.style.borderColor = '#3B82F6'
                e.currentTarget.style.background = '#fff'
              }}
              onBlur={e => {
                e.currentTarget.style.borderColor = '#e2e8f0'
                e.currentTarget.style.background = '#f8fafc'
              }}
              onKeyPress={e => e.key === 'Enter' && handleAddImage()}
            />
            <button
              onClick={handleAddImage}
              disabled={uploading}
              style={{
                padding: '14px 32px',
                background: uploading ? '#94a3b8' : 'linear-gradient(135deg, #3B82F6, #2563EB)',
                border: 'none',
                borderRadius: 10,
                color: '#fff',
                fontWeight: 700,
                fontSize: '0.9rem',
                cursor: uploading ? 'not-allowed' : 'pointer',
                boxShadow: uploading ? 'none' : '0 4px 14px rgba(59, 130, 246, 0.3)',
                transition: 'all 0.2s',
                display: 'flex',
                alignItems: 'center',
                gap: 8
              }}
              onMouseEnter={e => !uploading && (e.currentTarget.style.transform = 'translateY(-2px)')}
              onMouseLeave={e => !uploading && (e.currentTarget.style.transform = 'translateY(0)')}
            >
              {uploading ? (
                <>⏳ Adding...</>
              ) : (
                <>➕ Add Image</>
              )}
            </button>
          </div>

          <div style={{
            padding: '12px 16px',
            background: '#eff6ff',
            border: '1px solid #bfdbfe',
            borderRadius: 8,
            display: 'flex',
            alignItems: 'center',
            gap: 10
          }}>
            <span style={{ fontSize: '1.2rem' }}>💡</span>
            <span style={{ fontSize: '0.85rem', color: '#1e40af', fontWeight: 500 }}>
              Use image hosting services like Imgur, Cloudinary, or your own server
            </span>
          </div>
        </div>
      )}

      {/* Images Count */}
      <div style={{
        marginBottom: 24,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 20px',
        background: '#fff',
        borderRadius: 12,
        border: '1px solid #e2e8f0'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: '0.95rem', color: '#0f172a', fontWeight: 700 }}>
            Gallery Status:
          </div>
          <div style={{
            padding: '6px 14px',
            background: images.length >= MAX_IMAGES ? '#fef3c7' : '#dbeafe',
            color: images.length >= MAX_IMAGES ? '#92400e' : '#1e40af',
            borderRadius: 8,
            fontSize: '0.85rem',
            fontWeight: 700
          }}>
            {images.length} / {MAX_IMAGES} images
          </div>
        </div>
        {images.length >= MAX_IMAGES && (
          <div style={{
            fontSize: '0.85rem',
            color: '#f59e0b',
            fontWeight: 600,
            display: 'flex',
            alignItems: 'center',
            gap: 6
          }}>
            <span>⚠️</span> Maximum limit reached
          </div>
        )}
      </div>

      {/* Gallery Grid */}
      {images.length === 0 ? (
        <div style={{
          background: '#fff',
          border: '2px dashed #e2e8f0',
          borderRadius: 20,
          padding: '80px 40px',
          textAlign: 'center'
        }}>
          <div style={{ fontSize: '5rem', marginBottom: 20, opacity: 0.5 }}>🖼️</div>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 800, color: '#0f172a', marginBottom: 10 }}>No Images Yet</h3>
          <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: 24 }}>
            Add your first image to showcase your products or services
          </p>
          <div style={{
            display: 'inline-block',
            padding: '10px 20px',
            background: '#f1f5f9',
            borderRadius: 8,
            fontSize: '0.85rem',
            color: '#64748b',
            fontWeight: 600
          }}>
            👆 Use the form above to get started
          </div>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: 20 }}>
          {images.map((img, index) => (
            <div key={img._id} style={{
              background: '#fff',
              border: '1.5px solid #e2e8f0',
              borderRadius: 16,
              overflow: 'hidden',
              transition: 'all 0.2s',
              boxShadow: '0 2px 8px rgba(0,0,0,0.04)'
            }}
              onMouseEnter={e => {
                e.currentTarget.style.transform = 'translateY(-4px)'
                e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'
                e.currentTarget.style.borderColor = '#3B82F6'
              }}
              onMouseLeave={e => {
                e.currentTarget.style.transform = 'translateY(0)'
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.04)'
                e.currentTarget.style.borderColor = '#e2e8f0'
              }}
            >
              <div style={{
                aspectRatio: '16/9',
                overflow: 'hidden',
                background: '#f8fafc',
                position: 'relative'
              }}>
                <div style={{
                  position: 'absolute',
                  top: 10,
                  left: 10,
                  background: 'rgba(0,0,0,0.6)',
                  color: '#fff',
                  padding: '4px 10px',
                  borderRadius: 6,
                  fontSize: '0.75rem',
                  fontWeight: 700,
                  backdropFilter: 'blur(8px)'
                }}>
                  #{index + 1}
                </div>
                <img
                  src={img.imageUrl}
                  alt={img.title || 'Gallery image'}
                  style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="400" height="300"%3E%3Crect fill="%23f8fafc" width="400" height="300"/%3E%3Ctext fill="%2394A3B8" font-family="Arial" font-size="16" x="50%25" y="50%25" text-anchor="middle" dominant-baseline="middle"%3E❌ Image not found%3C/text%3E%3C/svg%3E'
                  }}
                />
              </div>
              <div style={{ padding: 16 }}>
                <div style={{
                  fontSize: '0.85rem',
                  color: '#64748b',
                  marginBottom: 12,
                  fontWeight: 600
                }}>
                  {img.title || 'Untitled Image'}
                </div>
                <button
                  onClick={() => handleDeleteImage(img._id)}
                  style={{
                    width: '100%',
                    padding: '10px',
                    background: '#fee2e2',
                    border: '1px solid #fecaca',
                    borderRadius: 8,
                    color: '#ef4444',
                    fontSize: '0.85rem',
                    fontWeight: 700,
                    cursor: 'pointer',
                    transition: 'all 0.2s',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 6
                  }}
                  onMouseEnter={e => {
                    e.currentTarget.style.background = '#fecaca'
                  }}
                  onMouseLeave={e => {
                    e.currentTarget.style.background = '#fee2e2'
                  }}
                >
                  🗑️ Delete Image
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
