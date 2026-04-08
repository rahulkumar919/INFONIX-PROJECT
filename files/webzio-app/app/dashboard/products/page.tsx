'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import toast from 'react-hot-toast'

export default function ProductsPage() {
  const { token } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [stores, setStores] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [saving, setSaving] = useState(false)
  const [editProduct, setEditProduct] = useState<any>(null)
  const [selectedStore, setSelectedStore] = useState('')
  const [form, setForm] = useState({ websiteId:'', name:'', description:'', price:'', comparePrice:'', image:'', category:'General', badge:'', inStock:true, featured:false })

  const headers = { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json' }

  async function load() {
    try {
      const [pRes, sRes] = await Promise.all([
        fetch(`/api/products${selectedStore ? `?websiteId=${selectedStore}` : ''}`, { headers }),
        fetch('/api/websites', { headers })
      ])
      const [pData, sData] = await Promise.all([pRes.json(), sRes.json()])
      if (pData.success) setProducts(pData.products)
      if (sData.success) setStores(sData.websites)
    } catch {}
    setLoading(false)
  }

  useEffect(() => { load() }, [selectedStore])

  function openAdd() { setEditProduct(null); setForm({ websiteId: stores[0]?._id||'', name:'', description:'', price:'', comparePrice:'', image:'', category:'General', badge:'', inStock:true, featured:false }); setShowModal(true) }
  function openEdit(p: any) { setEditProduct(p); setForm({ websiteId:p.websiteId, name:p.name, description:p.description, price:String(p.price), comparePrice:String(p.comparePrice||''), image:p.image, category:p.category, badge:p.badge||'', inStock:p.inStock, featured:p.featured }); setShowModal(true) }

  async function save(e: React.FormEvent) {
    e.preventDefault()
    if (!form.websiteId || !form.name || !form.price) { toast.error('Fill required fields'); return }
    setSaving(true)
    try {
      const url = editProduct ? `/api/products/${editProduct._id}` : '/api/products'
      const method = editProduct ? 'PUT' : 'POST'
      const res = await fetch(url, { method, headers, body: JSON.stringify({ ...form, price: Number(form.price), comparePrice: form.comparePrice ? Number(form.comparePrice) : null }) })
      const data = await res.json()
      if (!data.success) { toast.error(data.message); return }
      toast.success(editProduct ? 'Product updated!' : 'Product added! 📦')
      setShowModal(false)
      load()
    } catch { toast.error('Failed to save product') }
    finally { setSaving(false) }
  }

  async function deleteProduct(id: string) {
    if (!confirm('Delete this product?')) return
    try {
      const res = await fetch(`/api/products/${id}`, { method:'DELETE', headers })
      const data = await res.json()
      if (data.success) { toast.success('Product deleted'); load() }
    } catch { toast.error('Failed to delete') }
  }

  const inp = { width:'100%', padding:'10px 14px', border:'1.5px solid #e5e5e5', borderRadius:8, fontSize:'.88rem', outline:'none', fontFamily:'inherit' } as any
  const storeMap = Object.fromEntries(stores.map(s => [s._id, s.siteName]))

  return (
    <div>
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:28 }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:800, marginBottom:4 }}>Menu / Inventory</h1>
          <p style={{ color:'#888', fontSize:'.9rem' }}>{products.length} item{products.length !== 1 ? 's' : ''} listed</p>
        </div>
        <div style={{ display:'flex', gap:12, alignItems:'center' }}>
          <select value={selectedStore} onChange={e => setSelectedStore(e.target.value)}
            style={{ padding:'8px 16px', border:'1.5px solid #e5e5e5', borderRadius:8, fontSize:'.85rem', outline:'none', background:'#fff', cursor:'pointer' }}>
            <option value="">All Stores</option>
            {stores.map(s => <option key={s._id} value={s._id}>{s.siteName}</option>)}
          </select>
          <button onClick={openAdd} style={{ padding:'10px 20px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:8, fontSize:'.88rem', fontWeight:700, cursor:'pointer' }}>
            + Add Item / Room
          </button>
        </div>
      </div>

      {/* Table */}
      <div style={{ background:'#fff', border:'1.5px solid #f0f0f0', borderRadius:12, overflow:'hidden' }}>
        {loading ? (
          <div style={{ padding:60, textAlign:'center', color:'#bbb' }}>Loading products...</div>
        ) : products.length === 0 ? (
          <div style={{ padding:60, textAlign:'center' }}>
            <div style={{ fontSize:'3rem', marginBottom:16 }}>📦</div>
            <h3 style={{ fontWeight:700, marginBottom:8 }}>No products yet</h3>
            <p style={{ color:'#888', fontSize:'.9rem', marginBottom:24 }}>Add your first product to start selling</p>
            <button onClick={openAdd} style={{ padding:'10px 24px', background:'#6366f1', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:'pointer' }}>Add First Product</button>
          </div>
        ) : (
          <table style={{ width:'100%', borderCollapse:'collapse' }}>
            <thead>
              <tr style={{ borderBottom:'1.5px solid #f0f0f0', background:'#fafafa' }}>
                {['Item / Room', 'Hub', 'Price (₹)', 'Status', 'Featured', 'Actions'].map(h => (
                  <th key={h} style={{ padding:'12px 16px', textAlign:'left', fontSize:'.75rem', fontWeight:700, color:'#888', letterSpacing:'.06em', textTransform:'uppercase' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {products.map((p, i) => (
                <tr key={p._id} style={{ borderBottom:'1px solid #f8f8f8', background: i % 2 === 0 ? '#fff' : '#fafafa' }}>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                      <div style={{ width:40, height:40, borderRadius:6, background:p.image?'transparent':'#f0f0f0', overflow:'hidden', flexShrink:0, display:'flex', alignItems:'center', justifyContent:'center', color:'#ccc', fontSize:'1.2rem' }}>
                        {p.image ? <img src={p.image} alt={p.name} style={{ width:'100%', height:'100%', objectFit:'cover' }} /> : '🖼'}
                      </div>
                      <div>
                        <div style={{ fontWeight:600, fontSize:'.88rem' }}>{p.name}</div>
                        <div style={{ fontSize:'.72rem', color:'#999' }}>{p.category}{p.badge ? ` • ${p.badge}` : ''}</div>
                      </div>
                    </div>
                  </td>
                  <td style={{ padding:'14px 16px', fontSize:'.82rem', color:'#888' }}>{storeMap[p.websiteId] || '—'}</td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontWeight:700, fontSize:'.9rem' }}>₹{p.price.toLocaleString('en-IN')}</span>
                    {p.comparePrice && <span style={{ fontSize:'.75rem', color:'#bbb', textDecoration:'line-through', marginLeft:6 }}>₹{p.comparePrice.toLocaleString('en-IN')}</span>}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <span style={{ fontSize:'.72rem', fontWeight:600, padding:'3px 10px', borderRadius:50, background:p.inStock?'#ecfdf5':'#fef2f2', color:p.inStock?'#10b981':'#ef4444' }}>
                      {p.inStock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    {p.featured && <span style={{ fontSize:'.72rem', fontWeight:600, padding:'3px 10px', borderRadius:50, background:'#fffbeb', color:'#f59e0b' }}>⭐ Featured</span>}
                  </td>
                  <td style={{ padding:'14px 16px' }}>
                    <div style={{ display:'flex', gap:6 }}>
                      <button onClick={() => openEdit(p)} style={{ padding:'6px 14px', background:'#f0f0ff', color:'#6366f1', border:'none', borderRadius:6, fontSize:'.78rem', fontWeight:600, cursor:'pointer' }}>Edit</button>
                      <button onClick={() => deleteProduct(p._id)} style={{ padding:'6px 14px', background:'#fff0f0', color:'#ef4444', border:'none', borderRadius:6, fontSize:'.78rem', fontWeight:600, cursor:'pointer' }}>Delete</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* MODAL */}
      {showModal && (
        <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.5)', backdropFilter:'blur(4px)', zIndex:200, display:'flex', alignItems:'center', justifyContent:'center', padding:24 }} onClick={() => setShowModal(false)}>
          <div style={{ background:'#fff', borderRadius:16, width:'100%', maxWidth:520, maxHeight:'90vh', overflowY:'auto' }} onClick={e => e.stopPropagation()}>
            <div style={{ padding:'20px 24px', borderBottom:'1px solid #f0f0f0', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
              <h2 style={{ fontWeight:800, fontSize:'1.05rem' }}>{editProduct ? 'Edit Product' : 'Add New Product'}</h2>
              <button onClick={() => setShowModal(false)} style={{ background:'none', border:'none', fontSize:'1.2rem', cursor:'pointer', color:'#888' }}>✕</button>
            </div>
            <form onSubmit={save} style={{ padding:'24px' }}>
              {[
                { label:'Assigned Hub *', el:'select' },
                { label:'Item / Room Name *', key:'name', placeholder:'e.g. Deluxe Suite / Grilled Salmon' },
                { label:'Description', key:'description', rows:3, placeholder:'Details about this offering...' },
                { label:'Price (₹) *', key:'price', type:'number', placeholder:'999' },
                { label:'Seasonal Price (₹)', key:'comparePrice', type:'number', placeholder:'1499' },
                { label:'Showcase Image URL', key:'image', placeholder:'https://...' },
                { label:'Category', key:'category', placeholder:'Appetizer / Suite / etc.' },
                { label:'Highlight Badge', key:'badge', placeholder:'Best Seller / Newly Added' },
              ].map((f: any, i) => (
                <div key={i} style={{ marginBottom:16 }}>
                  <label style={{ display:'block', fontSize:'.78rem', fontWeight:600, color:'#555', marginBottom:5 }}>{f.label}</label>
                  {f.el === 'select' ? (
                    <select value={form.websiteId} onChange={e => setForm({ ...form, websiteId: e.target.value })} style={inp}>
                      <option value="">Select a store</option>
                      {stores.map(s => <option key={s._id} value={s._id}>{s.siteName}</option>)}
                    </select>
                  ) : f.rows ? (
                    <textarea rows={f.rows} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={{ ...inp, resize:'vertical', lineHeight:1.6 }} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                  ) : (
                    <input type={f.type||'text'} value={(form as any)[f.key]} onChange={e => setForm({ ...form, [f.key]: e.target.value })} placeholder={f.placeholder} style={inp} onFocus={e => e.target.style.borderColor='#6366f1'} onBlur={e => e.target.style.borderColor='#e5e5e5'} />
                  )}
                </div>
              ))}

              <div style={{ display:'flex', gap:20, marginBottom:20 }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.85rem', fontWeight:500 }}>
                  <input type="checkbox" checked={form.inStock} onChange={e => setForm({ ...form, inStock: e.target.checked })} />
                  In Stock
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, cursor:'pointer', fontSize:'.85rem', fontWeight:500 }}>
                  <input type="checkbox" checked={form.featured} onChange={e => setForm({ ...form, featured: e.target.checked })} />
                  Featured Product
                </label>
              </div>

              <button type="submit" disabled={saving} style={{ width:'100%', padding:'12px', background:'linear-gradient(135deg,#6366f1,#8b5cf6)', color:'#fff', border:'none', borderRadius:8, fontWeight:700, cursor:saving?'not-allowed':'pointer', fontSize:'.9rem', display:'flex', alignItems:'center', justifyContent:'center', gap:8, fontFamily:'inherit' }}>
                {saving ? <><span className="spinner" style={{ width:14,height:14,borderWidth:2 }}></span> Saving...</> : (editProduct ? '💾 Update Product' : '📦 Add Product')}
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
