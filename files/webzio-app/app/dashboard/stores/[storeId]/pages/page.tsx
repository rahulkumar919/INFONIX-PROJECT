'use client'
import { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { useAuthStore } from '../../../../../stores/authStore'
import toast from 'react-hot-toast'

const C = {
  purple: '#7C3AED', cyan: '#22D3EE', card: '#0F172A', text: '#E2E8F0',
  textMuted: '#94A3B8', border: 'rgba(124, 58, 237, 0.15)', green: '#22C55E', red: '#EF4444'
}

export default function PagesManagementPage() {
  const params = useParams()
  const router = useRouter()
  const { token } = useAuthStore()
  const [pages, setPages] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadPages()
  }, [])

  const loadPages = async () => {
    try {
      const res = await fetch(`/api/store/${params.storeId}/pages`, {
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) setPages(data.pages)
    } catch (error) {
      toast.error('Failed to load pages')
    }
    setLoading(false)
  }

  const deletePage = async (pageId: string) => {
    if (!confirm('Delete this page?')) return
    try {
      const res = await fetch(`/api/store/${params.storeId}/pages/${pageId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      })
      const data = await res.json()
      if (data.success) {
        toast.success('Page deleted')
        loadPages()
      } else {
        toast.error(data.error || 'Failed to delete')
      }
    } catch (error) {
      toast.error('Failed to delete page')
    }
  }

  const togglePublish = async (pageId: string, currentStatus: boolean) => {
    try {
      const res = await fetch(`/api/store/${params.storeId}/pages/${pageId}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ isPublished: !currentStatus })
      })
      const data = await res.json()
      if (data.success) {
        toast.success(`Page ${!currentStatus ? 'published' : 'unpublished'}`)
        loadPages()
      }
    } catch (error) {
      toast.error('Failed to update page')
    }
  }

  if (loading) return <div style={{ padding: 60, textAlign: 'center', color: C.textMuted }}>Loading...</div>

  return (
    <div style={{ padding: 24 }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: '1.8rem', fontWeight: 900, color: C.text, marginBottom: 8 }}>📄 CMS Pages</h1>
          <p style={{ color: C.textMuted, fontSize: '0.9rem' }}>Create and manage your website pages</p>
        </div>
        <Link href={`/dashboard/stores/${params.storeId}/pages/new`}>
          <button style={{
            padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
            border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer'
          }}>
            ➕ Create Page
          </button>
        </Link>
      </div>

      {/* Pages List */}
      {pages.length === 0 ? (
        <div style={{
          background: C.card, border: `1px solid ${C.border}`, borderRadius: 16,
          padding: 60, textAlign: 'center'
        }}>
          <div style={{ fontSize: '4rem', marginBottom: 16 }}>📄</div>
          <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: C.text, marginBottom: 8 }}>No pages yet</h3>
          <p style={{ color: C.textMuted, marginBottom: 24 }}>Create your first page to get started</p>
          <Link href={`/dashboard/stores/${params.storeId}/pages/new`}>
            <button style={{
              padding: '12px 24px', background: `linear-gradient(135deg, ${C.purple}, ${C.cyan})`,
              border: 'none', borderRadius: 8, color: '#fff', fontWeight: 700, cursor: 'pointer'
            }}>
              ➕ Create Page
            </button>
          </Link>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 16 }}>
          {pages.map((page) => (
            <div key={page._id} style={{
              background: C.card, border: `1px solid ${C.border}`, borderRadius: 12,
              padding: 20, display: 'flex', justifyContent: 'space-between', alignItems: 'center'
            }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 8 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: C.text }}>{page.title}</h3>
                  <span style={{
                    fontSize: '0.7rem', fontWeight: 700, padding: '4px 12px', borderRadius: 20,
                    background: page.isPublished ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    color: page.isPublished ? C.green : C.red
                  }}>
                    {page.isPublished ? '● Published' : '● Draft'}
                  </span>
                </div>
                <p style={{ fontSize: '0.85rem', color: C.textMuted }}>/{page.slug}</p>
              </div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button onClick={() => togglePublish(page._id, page.isPublished)} style={{
                  padding: '8px 16px', background: C.card, border: `1px solid ${C.border}`,
                  borderRadius: 6, color: C.text, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                }}>
                  {page.isPublished ? 'Unpublish' : 'Publish'}
                </button>
                <Link href={`/dashboard/stores/${params.storeId}/pages/${page._id}`}>
                  <button style={{
                    padding: '8px 16px', background: C.purple, border: 'none',
                    borderRadius: 6, color: '#fff', fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                  }}>
                    ✏️ Edit
                  </button>
                </Link>
                <button onClick={() => deletePage(page._id)} style={{
                  padding: '8px 16px', background: 'rgba(239, 68, 68, 0.1)', border: `1px solid ${C.red}`,
                  borderRadius: 6, color: C.red, fontSize: '0.85rem', fontWeight: 600, cursor: 'pointer'
                }}>
                  🗑️
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
