'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '../../../stores/authStore'
import { useAdminTheme } from '../theme'
import TemplateBuilder from './builder'

/* ── Preview Panel with device switcher ── */
function LivePreviewPanel({ form }: { form: any }) {
  const { C } = useAdminTheme()
  const [device, setDevice] = useState<'desktop'|'tablet'|'mobile'>('desktop')
  const [fullscreen, setFullscreen] = useState(false)

  const widths = { desktop:'100%', tablet:'768px', mobile:'375px' }
  const deviceW = widths[device]

  const panel = (
    <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:fullscreen?0:16, padding:fullscreen?0:0, overflow:'hidden', display:'flex', flexDirection:'column', height:fullscreen?'100vh':'auto' }}>
      {/* Toolbar */}
      <div style={{ padding:'10px 14px', background:C.card2, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        {/* Live dot */}
        <div style={{ width:7, height:7, borderRadius:'50%', background:C.green, boxShadow:`0 0 6px ${C.green}`, animation:'pulse2 2s infinite' }}/>
        <span style={{ fontSize:'.8rem', fontWeight:700, color:C.text }}>Live Preview</span>
        <span style={{ fontSize:'.65rem', color:C.textMuted, marginRight:'auto' }}>Updates as you type</span>

        {/* Device switcher */}
        <div style={{ display:'flex', background:C.bg, borderRadius:8, padding:2, border:`1px solid ${C.border}` }}>
          {([['desktop','🖥️'],['tablet','📱'],['mobile','📲']] as const).map(([d,icon]) => (
            <button key={d} onClick={() => setDevice(d)} style={{ padding:'4px 10px', borderRadius:6, border:'none', cursor:'pointer', fontSize:'.75rem', background:device===d?C.purple:'transparent', color:device===d?'#fff':C.textMuted, transition:'all .15s' }}>
              {icon}
            </button>
          ))}
        </div>

        {/* Fullscreen toggle */}
        <button onClick={() => setFullscreen(f => !f)} style={{ padding:'5px 10px', borderRadius:8, border:`1px solid ${C.border}`, background:'transparent', color:C.textMuted, cursor:'pointer', fontSize:'.75rem', fontWeight:600 }}>
          {fullscreen ? '⊠ Exit' : '⊞ Full'}
        </button>
      </div>

      {/* Browser chrome */}
      <div style={{ padding:'8px 12px', background:C.bg, borderBottom:`1px solid ${C.border}`, display:'flex', alignItems:'center', gap:8, flexShrink:0 }}>
        <div style={{ display:'flex', gap:5 }}>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#ef4444' }}/>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#f59e0b' }}/>
          <div style={{ width:10, height:10, borderRadius:'50%', background:'#22c55e' }}/>
        </div>
        <div style={{ flex:1, background:C.card2, borderRadius:6, padding:'4px 10px', fontSize:'.68rem', color:C.textMuted, border:`1px solid ${C.border}` }}>
          🔒 yoursite.com/{(form.name||'template').toLowerCase().replace(/\s+/g,'-')}
        </div>
      </div>

      {/* Preview area */}
      <div style={{ flex:1, overflow:'auto', background:'#e5e7eb', padding: device==='desktop'?0:'16px', display:'flex', justifyContent:'center' }}>
        <div style={{ width:deviceW, maxWidth:'100%', background:'#fff', boxShadow: device!=='desktop'?'0 4px 24px rgba(0,0,0,.15)':'none', borderRadius: device!=='desktop'?12:0, overflow:'hidden', transition:'width .3s ease' }}>
          <LivePreview form={form} />
        </div>
      </div>
    </div>
  )

  if (fullscreen) {
    return (
      <div style={{ position:'fixed', inset:0, zIndex:9999, background:'#000' }}>
        {panel}
      </div>
    )
  }

  return panel
}

/* ── Default config ── */
const DEFAULT_CONFIG = {
  headingFont: 'Playfair Display', bodyFont: 'Inter', baseFontSize: 16,
  navbarStyle: 'sticky', showNavCTA: true, navCTAText: 'Get Started',
  primaryColor: '#4F46E5', secondaryColor: '#7C3AED',
  bgLight: '#FFFFFF', bgDark: '#0F172A', cardBg: '#F8FAFF', textColor: '#111827',
  sections: { hero:true, features:true, services:true, testimonials:true, gallery:false, faq:true, contactForm:true, footer:true },
  footerColumns: 3, footerCopyright: '© 2026 All rights reserved.',
  socialLinks: { facebook:'', instagram:'', twitter:'', youtube:'', linkedin:'' },
  logoUrl: '', faviconUrl: '',
  heroLayout: 'centered', heroTitle: 'Welcome to Our Store',
  heroSubtitle: 'Discover amazing products and services.', heroBgImage: '', heroCTAText: 'Explore Now',
}

const EMPTY: any = {
  name:'', category:'', icon:'🌐', desc:'',
  color:'linear-gradient(135deg,#4F46E5,#7C3AED)', accentColor:'#4F46E5',
  tags:'', popular:false, isActive:true, previewImage:'', templateType:'general',
  config: { ...DEFAULT_CONFIG, sections: { ...DEFAULT_CONFIG.sections }, socialLinks: { ...DEFAULT_CONFIG.socialLinks } },
}

const GOOGLE_FONTS = ['Inter','Roboto','Open Sans','Lato','Montserrat','Poppins','Nunito','Raleway','Playfair Display','Merriweather','Lora','Source Serif Pro','DM Sans','Plus Jakarta Sans','Outfit','Syne','Space Grotesk']

const SECTION_LIST = [
  { key:'hero',        label:'Hero Section',      icon:'🦸', desc:'Main banner with CTA' },
  { key:'features',    label:'Features',          icon:'⚡', desc:'Key features grid' },
  { key:'services',    label:'Services',          icon:'🛠️', desc:'Services offered' },
  { key:'testimonials',label:'Testimonials',      icon:'💬', desc:'Customer reviews' },
  { key:'gallery',     label:'Gallery',           icon:'🖼️', desc:'Photo gallery' },
  { key:'faq',         label:'FAQ',               icon:'❓', desc:'Frequently asked questions' },
  { key:'contactForm', label:'Contact Form',      icon:'📬', desc:'Contact / enquiry form' },
  { key:'footer',      label:'Footer',            icon:'📄', desc:'Footer with links' },
]

/* ── Live Preview Component ── */
function LivePreview({ form, fullscreen = false }: { form: any; fullscreen?: boolean }) {
  const cfg = form.config || DEFAULT_CONFIG
  const headFont = cfg.headingFont || 'Playfair Display'
  const bodyFont = cfg.bodyFont || 'Inter'
  const fontSize = cfg.baseFontSize || 16
  const primary = cfg.primaryColor || '#4F46E5'
  const secondary = cfg.secondaryColor || '#7C3AED'
  const textColor = cfg.textColor || '#111827'
  const bgLight = cfg.bgLight || '#FFFFFF'
  const bgDark = cfg.bgDark || '#0F172A'
  const cardBg = cfg.cardBg || '#F8FAFF'
  const isMinimal = cfg.navbarStyle === 'minimal'
  const isTransparent = cfg.navbarStyle === 'transparent'

  const fontUrl = `https://fonts.googleapis.com/css2?family=${headFont.replace(/ /g,'+')}:wght@700;900&family=${bodyFont.replace(/ /g,'+')}:wght@400;500;600;700&display=swap`

  return (
    <div style={{ fontFamily:`'${bodyFont}',sans-serif`, fontSize:`${fontSize}px`, background:bgLight, color:textColor, overflowY:'auto', height:'100%' }}>
      <link href={fontUrl} rel="stylesheet" />

      {/* ── NAVBAR ── */}
      <nav style={{
        padding:'0 24px', height:56, display:'flex', justifyContent:'space-between', alignItems:'center',
        background: isTransparent ? 'transparent' : isMinimal ? bgLight : primary,
        borderBottom: isMinimal ? `1px solid ${primary}20` : 'none',
        position: cfg.navbarStyle === 'sticky' ? 'sticky' : 'relative',
        top:0, zIndex:10,
        boxShadow: isMinimal ? '0 1px 8px rgba(0,0,0,.06)' : 'none',
      }}>
        <div style={{ display:'flex', alignItems:'center', gap:10 }}>
          {cfg.logoUrl
            ? <img src={cfg.logoUrl} alt="logo" style={{ height:28, objectFit:'contain' }} />
            : <div style={{ width:28, height:28, background:isMinimal?primary:'rgba(255,255,255,.25)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem' }}>{form.icon||'⚡'}</div>
          }
          <span style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1rem', color:isMinimal?textColor:'#fff' }}>
            {form.name || 'Brand Name'}
          </span>
        </div>
        <div style={{ display:'flex', gap:20, alignItems:'center' }}>
          {['Home','About','Services','Contact'].map(l => (
            <span key={l} style={{ fontSize:'.78rem', fontWeight:500, color:isMinimal?textColor:'rgba(255,255,255,.85)', cursor:'pointer' }}>{l}</span>
          ))}
          {cfg.showNavCTA && (
            <span style={{ fontSize:'.75rem', fontWeight:700, padding:'7px 16px', borderRadius:8, background:isMinimal?primary:'rgba(255,255,255,.18)', color:'#fff', border:isMinimal?'none':'1px solid rgba(255,255,255,.3)', cursor:'pointer' }}>
              {cfg.navCTAText || 'Get Started'}
            </span>
          )}
        </div>
      </nav>

      {/* ── HERO ── */}
      {cfg.sections?.hero !== false && (
        <section style={{
          padding: cfg.heroLayout==='fullscreen' ? '80px 40px' : '60px 40px',
          background: cfg.heroBgImage
            ? `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url(${cfg.heroBgImage}) center/cover no-repeat`
            : `linear-gradient(135deg,${primary}18,${secondary}10,${bgLight})`,
          display: cfg.heroLayout==='split' ? 'grid' : 'flex',
          gridTemplateColumns: cfg.heroLayout==='split' ? '1fr 1fr' : undefined,
          flexDirection: cfg.heroLayout!=='split' ? 'column' : undefined,
          alignItems:'center',
          justifyContent: cfg.heroLayout!=='split' ? 'center' : undefined,
          textAlign: cfg.heroLayout!=='split' ? 'center' : 'left',
          gap:32,
          color: cfg.heroBgImage ? '#fff' : textColor,
          minHeight: cfg.heroLayout==='fullscreen' ? 320 : 240,
        }}>
          <div>
            <div style={{ display:'inline-block', padding:'4px 14px', borderRadius:50, background:`${primary}18`, color:primary, fontSize:'.72rem', fontWeight:700, marginBottom:16, border:`1px solid ${primary}25` }}>
              ✨ {form.category || 'Template'}
            </div>
            <h1 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'clamp(1.6rem,3vw,2.4rem)', lineHeight:1.15, marginBottom:14, color:cfg.heroBgImage?'#fff':textColor }}>
              {cfg.heroTitle || 'Welcome to Our Store'}
            </h1>
            <p style={{ fontSize:'.9rem', opacity:.75, marginBottom:24, lineHeight:1.7, maxWidth:480 }}>
              {cfg.heroSubtitle || 'Discover amazing products and services.'}
            </p>
            <div style={{ display:'flex', gap:12, flexWrap:'wrap', justifyContent:cfg.heroLayout!=='split'?'center':'flex-start' }}>
              <span style={{ padding:'10px 24px', borderRadius:10, background:primary, color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer', boxShadow:`0 4px 14px ${primary}40` }}>
                {cfg.heroCTAText || 'Explore Now'}
              </span>
              <span style={{ padding:'10px 24px', borderRadius:10, border:`1.5px solid ${cfg.heroBgImage?'rgba(255,255,255,.4)':primary}`, color:cfg.heroBgImage?'#fff':primary, fontWeight:600, fontSize:'.85rem', cursor:'pointer' }}>
                Learn More
              </span>
            </div>
          </div>
          {cfg.heroLayout==='split' && (
            <div style={{ background:`${primary}12`, borderRadius:20, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'4rem', minHeight:200, border:`1px solid ${primary}20` }}>
              {form.icon || '🌐'}
            </div>
          )}
        </section>
      )}

      {/* ── FEATURES ── */}
      {cfg.sections?.features !== false && (
        <section style={{ padding:'48px 40px', background:cardBg }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>Our Features</h2>
            <div style={{ width:40, height:3, background:primary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:16 }}>
            {[{icon:'⚡',title:'Fast & Reliable',desc:'Built for speed and performance'},{icon:'🎨',title:'Beautiful Design',desc:'Stunning visuals that convert'},{icon:'📱',title:'Mobile Ready',desc:'Perfect on every device'}].map((f,i) => (
              <div key={i} style={{ padding:'20px', background:bgLight, borderRadius:14, border:`1px solid ${primary}12`, textAlign:'center' }}>
                <div style={{ fontSize:'1.8rem', marginBottom:10 }}>{f.icon}</div>
                <div style={{ fontWeight:700, fontSize:'.88rem', color:textColor, marginBottom:6 }}>{f.title}</div>
                <div style={{ fontSize:'.75rem', color:`${textColor}80`, lineHeight:1.6 }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── SERVICES ── */}
      {cfg.sections?.services !== false && (
        <section style={{ padding:'48px 40px', background:bgLight }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>Our Services</h2>
            <div style={{ width:40, height:3, background:secondary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(2,1fr)', gap:14 }}>
            {[{icon:'🛠️',title:'Custom Solutions'},{icon:'📊',title:'Analytics'},{icon:'🔒',title:'Security'},{icon:'🚀',title:'Fast Delivery'}].map((s,i) => (
              <div key={i} style={{ display:'flex', alignItems:'center', gap:14, padding:'16px', background:cardBg, borderRadius:12, border:`1px solid ${primary}10` }}>
                <div style={{ width:40, height:40, background:`${primary}15`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.1rem', flexShrink:0 }}>{s.icon}</div>
                <div>
                  <div style={{ fontWeight:700, fontSize:'.85rem', color:textColor }}>{s.title}</div>
                  <div style={{ fontSize:'.72rem', color:`${textColor}60`, marginTop:2 }}>Professional service</div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── TESTIMONIALS ── */}
      {cfg.sections?.testimonials !== false && (
        <section style={{ padding:'48px 40px', background:`linear-gradient(135deg,${primary}08,${secondary}05)` }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>What Clients Say</h2>
            <div style={{ width:40, height:3, background:primary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:14 }}>
            {[{name:'Rahul S.',role:'Restaurant Owner',text:'Amazing template! Our bookings doubled.'},{name:'Priya M.',role:'Hotel Manager',text:'Professional and easy to customize.'},{name:'Arjun N.',role:'Cafe Owner',text:'Customers love our new website!'}].map((t,i) => (
              <div key={i} style={{ padding:'20px', background:bgLight, borderRadius:14, border:`1px solid ${primary}12` }}>
                <div style={{ color:'#f59e0b', fontSize:'.85rem', marginBottom:10 }}>★★★★★</div>
                <p style={{ fontSize:'.78rem', color:`${textColor}80`, lineHeight:1.7, marginBottom:14, fontStyle:'italic' }}>"{t.text}"</p>
                <div style={{ display:'flex', alignItems:'center', gap:8 }}>
                  <div style={{ width:32, height:32, background:`linear-gradient(135deg,${primary},${secondary})`, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:800, fontSize:'.8rem' }}>{t.name[0]}</div>
                  <div>
                    <div style={{ fontWeight:700, fontSize:'.78rem', color:textColor }}>{t.name}</div>
                    <div style={{ fontSize:'.65rem', color:`${textColor}60` }}>{t.role}</div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── GALLERY ── */}
      {cfg.sections?.gallery && (
        <section style={{ padding:'48px 40px', background:cardBg }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>Gallery</h2>
            <div style={{ width:40, height:3, background:primary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:10 }}>
            {[1,2,3,4,5,6,7,8].map(i => (
              <div key={i} style={{ aspectRatio:'1', background:`linear-gradient(135deg,${primary}${i%2?'20':'10'},${secondary}15)`, borderRadius:10, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.5rem' }}>🖼️</div>
            ))}
          </div>
        </section>
      )}

      {/* ── FAQ ── */}
      {cfg.sections?.faq !== false && (
        <section style={{ padding:'48px 40px', background:bgLight }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>FAQ</h2>
            <div style={{ width:40, height:3, background:secondary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ maxWidth:600, margin:'0 auto', display:'flex', flexDirection:'column', gap:10 }}>
            {['How do I get started?','What payment methods do you accept?','Can I customize the template?'].map((q,i) => (
              <div key={i} style={{ padding:'14px 18px', background:cardBg, borderRadius:12, border:`1px solid ${primary}12`, display:'flex', justifyContent:'space-between', alignItems:'center' }}>
                <span style={{ fontSize:'.82rem', fontWeight:600, color:textColor }}>{q}</span>
                <span style={{ color:primary, fontWeight:700, fontSize:'1.1rem' }}>+</span>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── CONTACT FORM ── */}
      {cfg.sections?.contactForm !== false && (
        <section style={{ padding:'48px 40px', background:`linear-gradient(135deg,${primary}08,${secondary}05)` }}>
          <div style={{ textAlign:'center', marginBottom:32 }}>
            <h2 style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1.5rem', color:textColor, marginBottom:8 }}>Contact Us</h2>
            <div style={{ width:40, height:3, background:primary, borderRadius:2, margin:'0 auto' }}/>
          </div>
          <div style={{ maxWidth:480, margin:'0 auto', display:'flex', flexDirection:'column', gap:12 }}>
            {['Your Name','Email Address','Message'].map((p,i) => (
              i < 2
                ? <div key={p} style={{ padding:'11px 14px', background:bgLight, borderRadius:10, border:`1px solid ${primary}20`, fontSize:'.8rem', color:`${textColor}50` }}>{p}</div>
                : <div key={p} style={{ padding:'11px 14px', background:bgLight, borderRadius:10, border:`1px solid ${primary}20`, fontSize:'.8rem', color:`${textColor}50`, height:80 }}>{p}</div>
            ))}
            <div style={{ padding:'12px', background:primary, borderRadius:10, textAlign:'center', color:'#fff', fontWeight:700, fontSize:'.85rem', cursor:'pointer' }}>Send Message</div>
          </div>
        </section>
      )}

      {/* ── FOOTER ── */}
      {cfg.sections?.footer !== false && (
        <>
          <footer style={{ padding:'40px', background:bgDark }}>
            <div style={{ display:'grid', gridTemplateColumns:`repeat(${Math.min(cfg.footerColumns||3,4)},1fr)`, gap:24, marginBottom:32 }}>
              {Array.from({ length: cfg.footerColumns||3 }).map((_,i) => (
                <div key={i}>
                  {i===0 ? (
                    <>
                      <div style={{ fontFamily:`'${headFont}',serif`, fontWeight:900, fontSize:'1rem', color:'#fff', marginBottom:10 }}>{form.name||'Brand'}</div>
                      <div style={{ fontSize:'.75rem', color:'rgba(255,255,255,.45)', lineHeight:1.7 }}>Your trusted partner for quality products and services.</div>
                    </>
                  ) : (
                    <>
                      <div style={{ fontSize:'.72rem', fontWeight:800, color:'rgba(255,255,255,.5)', textTransform:'uppercase', letterSpacing:'.08em', marginBottom:12 }}>Column {i+1}</div>
                      {['Link One','Link Two','Link Three','Link Four'].map(l => (
                        <div key={l} style={{ fontSize:'.75rem', color:'rgba(255,255,255,.4)', marginBottom:8, cursor:'pointer' }}>{l}</div>
                      ))}
                    </>
                  )}
                </div>
              ))}
            </div>
            {/* Social links */}
            {Object.values(cfg.socialLinks||{}).some(v => v) && (
              <div style={{ display:'flex', gap:10, marginBottom:20 }}>
                {Object.entries(cfg.socialLinks||{}).filter(([,v]) => v).map(([k]) => {
                  const icons: Record<string,string> = { facebook:'📘', instagram:'📸', twitter:'🐦', youtube:'▶️', linkedin:'💼' }
                  return <div key={k} style={{ width:32, height:32, background:'rgba(255,255,255,.08)', borderRadius:8, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'.9rem', cursor:'pointer' }}>{icons[k]||'🔗'}</div>
                })}
              </div>
            )}
          </footer>
          <div style={{ padding:'14px 40px', background:bgDark, borderTop:'1px solid rgba(255,255,255,.06)', display:'flex', justifyContent:'space-between', alignItems:'center' }}>
            <span style={{ fontSize:'.72rem', color:'rgba(255,255,255,.3)' }}>{cfg.footerCopyright||'© 2026 All rights reserved.'}</span>
            <span style={{ fontSize:'.72rem', color:`${primary}80` }}>Powered by HospitalityCore</span>
          </div>
        </>
      )}
    </div>
  )
}

const EMPTY_FORM: any = {
  name:'', category:'', icon:'🌐', desc:'',
  color:'linear-gradient(135deg,#4F46E5,#7C3AED)', accentColor:'#4F46E5',
  tags:'', popular:false, isActive:true, previewImage:'', templateType:'general',
  config: { ...DEFAULT_CONFIG, sections:{...DEFAULT_CONFIG.sections}, socialLinks:{...DEFAULT_CONFIG.socialLinks} },
}

export default function AdminTemplatesPage() {
  const { token } = useAuthStore()
  const { C } = useAdminTheme()
  const [templates, setTemplates] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState<any>(EMPTY_FORM)
  const [editing, setEditing] = useState<string|null>(null)
  const [saving, setSaving] = useState(false)
  const [typeFilter, setTypeFilter] = useState('')
  const [catFilter, setCatFilter] = useState('')
  const [search, setSearch] = useState('')
  const [preview, setPreview] = useState<any|null>(null)
  const [categories, setCategories] = useState<string[]>([])

  const load = async () => {
    setLoading(true)
    const params = new URLSearchParams()
    if (typeFilter) params.set('type', typeFilter)
    if (catFilter) params.set('category', catFilter)
    const res = await fetch(`/api/admin/templates?${params}`, { headers:{ Authorization:`Bearer ${token}` } })
    const data = await res.json()
    if (data.success) {
      setTemplates(data.templates)
      setCategories(Array.from(new Set(data.templates.map((t:any) => t.category))) as string[])
    }
    setLoading(false)
  }
  useEffect(() => { load() }, [typeFilter, catFilter])

  const save = async () => {
    if (!form.name || !form.category) return alert('Name and category required')
    setSaving(true)
    const body = { ...form, tags: form.tags.split(',').map((t:string) => t.trim()).filter(Boolean) }
    const url = editing ? `/api/admin/templates/${editing}` : '/api/admin/templates'
    const method = editing ? 'PATCH' : 'POST'
    const res = await fetch(url, { method, headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify(body) })
    const data = await res.json()
    if (data.success) {
      editing ? setTemplates(t => t.map(x => x._id===editing ? data.template : x)) : setTemplates(t => [data.template,...t])
      setForm(EMPTY_FORM); setEditing(null); setShowForm(false)
    }
    setSaving(false)
  }

  const toggleStatus = async (id:string, cur:boolean) => {
    await fetch(`/api/admin/templates/${id}`, { method:'PATCH', headers:{'Content-Type':'application/json',Authorization:`Bearer ${token}`}, body:JSON.stringify({isActive:!cur}) })
    setTemplates(t => t.map(x => x._id===id ? {...x,isActive:!cur} : x))
  }

  const del = async (id:string) => {
    if (!confirm('Delete this template?')) return
    await fetch(`/api/admin/templates/${id}`, { method:'DELETE', headers:{Authorization:`Bearer ${token}`} })
    setTemplates(t => t.filter(x => x._id!==id))
  }

  const startEdit = (t:any) => {
    setForm({ ...EMPTY_FORM, ...t, tags:(t.tags||[]).join(', '), config:{ ...DEFAULT_CONFIG, ...(t.config||{}), sections:{...DEFAULT_CONFIG.sections,...(t.config?.sections||{})}, socialLinks:{...DEFAULT_CONFIG.socialLinks,...(t.config?.socialLinks||{})} } })
    setEditing(t._id); setShowForm(true)
  }

  const inp = { width:'100%', padding:'9px 12px', background:C.bg, border:`1px solid ${C.border}`, borderRadius:8, color:C.text, fontSize:'.83rem', outline:'none', fontFamily:'inherit' }
  const filtered = templates.filter(t => !search || t.name.toLowerCase().includes(search.toLowerCase()) || t.category.toLowerCase().includes(search.toLowerCase()))

  return (
    <div>
      <style>{`@keyframes fadeIn{from{opacity:0;transform:translateY(8px)}to{opacity:1;transform:translateY(0)}}.tpl-card{transition:transform .2s,box-shadow .2s}.tpl-card:hover{transform:translateY(-4px);box-shadow:0 12px 32px rgba(99,102,241,.15)!important}`}</style>

      {/* Header */}
      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:20, animation:'fadeIn .4s ease' }}>
        <div>
          <h1 style={{ fontSize:'1.6rem', fontWeight:900, color:C.text, letterSpacing:'-.02em' }}>🎨 Template Management</h1>
          <p style={{ color:C.textMuted, fontSize:'.84rem', marginTop:3 }}>{templates.length} templates · {categories.length} categories</p>
        </div>
        <button onClick={() => { setForm(EMPTY_FORM); setEditing(null); setShowForm(!showForm) }}
          style={{ padding:'10px 20px', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.86rem', cursor:'pointer', boxShadow:`0 4px 16px ${C.purple}40` }}>
          {showForm ? '✕ Cancel' : '+ Create Template'}
        </button>
      </div>

      {/* ── BUILDER FORM ── */}
      {showForm && (
        <div style={{ display:'grid', gridTemplateColumns:'1fr 380px', gap:20, marginBottom:24, animation:'fadeIn .3s ease' }}>
          {/* Left — form */}
          <div style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:16, padding:24 }}>
            <h3 style={{ fontSize:'.95rem', fontWeight:800, color:C.text, marginBottom:20 }}>{editing ? '✏️ Edit Template' : '➕ Create New Template'}</h3>

            {/* Basic info */}
            <div style={{ display:'grid', gridTemplateColumns:'repeat(3,1fr)', gap:12, marginBottom:20, paddingBottom:20, borderBottom:`1px solid ${C.border}` }}>
              {[
                {label:'Template Name *', key:'name', placeholder:'e.g. Modern Restaurant'},
                {label:'Category *', key:'category', placeholder:'e.g. Food & Dining'},
                {label:'Icon (Emoji)', key:'icon', placeholder:'🌐'},
                {label:'Description', key:'desc', placeholder:'Short description...'},
                {label:'Tags (comma-sep)', key:'tags', placeholder:'Menu, WhatsApp, Booking'},
                {label:'Preview Image URL', key:'previewImage', placeholder:'https://...'},
              ].map(({label,key,placeholder}) => (
                <div key={key}>
                  <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, color:C.textMuted, marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' }}>{label}</label>
                  <input style={inp} value={form[key]} onChange={e => setForm((f:any) => ({...f,[key]:e.target.value}))} placeholder={placeholder} />
                </div>
              ))}
              <div>
                <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, color:C.textMuted, marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' }}>Accent Color</label>
                <input type="color" style={{...inp, height:40, padding:'4px 8px'}} value={form.accentColor} onChange={e => setForm((f:any) => ({...f,accentColor:e.target.value,config:{...f.config,primaryColor:e.target.value}}))} />
              </div>
              <div>
                <label style={{ display:'block', fontSize:'.68rem', fontWeight:700, color:C.textMuted, marginBottom:4, textTransform:'uppercase', letterSpacing:'.05em' }}>Type</label>
                <select style={inp} value={form.templateType} onChange={e => setForm((f:any) => ({...f,templateType:e.target.value}))}>
                  <option value="general">General</option>
                  <option value="portfolio">Portfolio</option>
                </select>
              </div>
              <div style={{ display:'flex', gap:16, alignItems:'center', gridColumn:'1/-1' }}>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.popular} onChange={e => setForm((f:any) => ({...f,popular:e.target.checked}))} /> Popular
                </label>
                <label style={{ display:'flex', alignItems:'center', gap:8, fontSize:'.84rem', color:C.text, cursor:'pointer' }}>
                  <input type="checkbox" checked={form.isActive} onChange={e => setForm((f:any) => ({...f,isActive:e.target.checked}))} /> Active
                </label>
              </div>
            </div>

            {/* Design Config Builder */}
            <h4 style={{ fontSize:'.88rem', fontWeight:800, color:C.text, marginBottom:14 }}>⚙️ Design Configuration</h4>
            <TemplateBuilder config={form.config} onChange={cfg => setForm((f:any) => ({...f, config:cfg}))} />

            <button onClick={save} disabled={saving} style={{ marginTop:20, padding:'12px 28px', background:`linear-gradient(135deg,${C.purple},${C.cyan})`, border:'none', borderRadius:10, color:'#fff', fontWeight:800, fontSize:'.9rem', cursor:'pointer', boxShadow:`0 4px 16px ${C.purple}40` }}>
              {saving ? 'Saving...' : editing ? '💾 Update Template' : '✨ Create Template'}
            </button>
          </div>

          {/* Right — Live Preview */}
          <div style={{ position:'sticky', top:20 }}>
            <LivePreviewPanel form={form} />
          </div>
        </div>
      )}

      {/* Filters */}
      <div style={{ display:'flex', gap:10, marginBottom:16, flexWrap:'wrap', animation:'fadeIn .4s ease .1s both' }}>
        <div style={{ position:'relative', flex:1, minWidth:200 }}>
          <span style={{ position:'absolute', left:12, top:'50%', transform:'translateY(-50%)', color:C.textMuted }}>🔍</span>
          <input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search templates..."
            style={{ width:'100%', padding:'10px 14px 10px 36px', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:'.84rem', outline:'none' }} />
        </div>
        {[['','All'],['general','General'],['portfolio','Portfolio']].map(([v,l]) => (
          <button key={v} onClick={() => setTypeFilter(v)} style={{ padding:'9px 16px', borderRadius:10, fontSize:'.8rem', fontWeight:700, cursor:'pointer', background:typeFilter===v?`${C.purple}20`:C.card, border:`1px solid ${typeFilter===v?C.purple+'50':C.border}`, color:typeFilter===v?C.purpleLight:C.textMuted }}>{l}</button>
        ))}
        <select value={catFilter} onChange={e => setCatFilter(e.target.value)} style={{ padding:'9px 14px', background:C.card, border:`1px solid ${C.border}`, borderRadius:10, color:C.text, fontSize:'.8rem', outline:'none' }}>
          <option value="">All Categories</option>
          {categories.map(c => <option key={c} value={c}>{c}</option>)}
        </select>
      </div>

      <p style={{ color:C.textMuted, fontSize:'.75rem', marginBottom:14 }}>Showing {filtered.length} templates</p>

      {/* Grid */}
      {loading ? <div style={{ textAlign:'center', padding:60, color:C.textMuted }}>Loading templates...</div> : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(260px,1fr))', gap:16 }}>
          {filtered.map((t,i) => (
            <div key={t._id} className="tpl-card" style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:14, overflow:'hidden', animation:`fadeIn .3s ease ${i*30}ms both` }}>
              <div style={{ height:110, background:t.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'2.5rem', position:'relative' }}>
                {t.previewImage ? <img src={t.previewImage} alt="" style={{ position:'absolute', inset:0, width:'100%', height:'100%', objectFit:'cover' }} /> : t.icon}
                <div style={{ position:'absolute', top:8, right:8, display:'flex', gap:4 }}>
                  {t.popular && <span style={{ fontSize:'.6rem', fontWeight:800, background:'rgba(245,158,11,.9)', color:'#000', padding:'2px 8px', borderRadius:20 }}>⭐</span>}
                  <span style={{ fontSize:'.6rem', fontWeight:800, padding:'2px 8px', borderRadius:20, background:t.isActive?'rgba(34,197,94,.9)':'rgba(239,68,68,.9)', color:'#fff' }}>{t.isActive?'Active':'Off'}</span>
                </div>
                <div style={{ position:'absolute', bottom:8, left:8, background:'rgba(0,0,0,.4)', padding:'2px 8px', borderRadius:20, fontSize:'.6rem', fontWeight:700, color:'#fff' }}>{t.category}</div>
              </div>
              <div style={{ padding:'12px 14px' }}>
                <div style={{ fontSize:'.88rem', fontWeight:800, color:C.text, marginBottom:3 }}>{t.name}</div>
                <div style={{ fontSize:'.72rem', color:C.textMuted, marginBottom:8, lineHeight:1.5 }}>{t.desc}</div>
                {/* Config summary */}
                {t.config && (
                  <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:8 }}>
                    <span style={{ fontSize:'.58rem', fontWeight:700, padding:'2px 6px', borderRadius:20, background:`${C.blue}12`, color:C.blue }}>{t.config.headingFont?.split(' ')[0]}</span>
                    <span style={{ fontSize:'.58rem', fontWeight:700, padding:'2px 6px', borderRadius:20, background:`${C.green}12`, color:C.green }}>{t.config.navbarStyle}</span>
                    <span style={{ fontSize:'.58rem', fontWeight:700, padding:'2px 6px', borderRadius:20, background:`${C.amber}12`, color:C.amber }}>{Object.values(t.config.sections||{}).filter(Boolean).length} sections</span>
                  </div>
                )}
                <div style={{ display:'flex', gap:4, flexWrap:'wrap', marginBottom:10 }}>
                  {(t.tags||[]).slice(0,3).map((tag:string) => (
                    <span key={tag} style={{ fontSize:'.6rem', fontWeight:700, padding:'2px 8px', borderRadius:20, background:`${C.purple}12`, color:C.purpleLight, border:`1px solid ${C.purple}18` }}>{tag}</span>
                  ))}
                </div>
                <div style={{ display:'flex', gap:5 }}>
                  <button onClick={() => setPreview(t)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer', background:`${C.purple}12`, border:`1px solid ${C.purple}20`, color:C.purpleLight }}>Preview</button>
                  <button onClick={() => startEdit(t)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer', background:`${C.blue}10`, border:'none', color:'#60A5FA' }}>Edit</button>
                  <button onClick={() => toggleStatus(t._id,t.isActive)} style={{ flex:1, padding:'7px', borderRadius:8, fontSize:'.72rem', fontWeight:700, cursor:'pointer', background:t.isActive?`${C.red}10`:`${C.green}10`, border:'none', color:t.isActive?C.red:C.green }}>{t.isActive?'Off':'On'}</button>
                  <button onClick={() => del(t._id)} style={{ padding:'7px 10px', borderRadius:8, fontSize:'.72rem', cursor:'pointer', background:`${C.red}10`, border:'none', color:C.red }}>🗑</button>
                </div>
              </div>
            </div>
          ))}
          {filtered.length===0 && <p style={{ color:C.textMuted, gridColumn:'1/-1', textAlign:'center', padding:40 }}>No templates found.</p>}
        </div>
      )}

      {/* Preview Modal */}
      {preview && (
        <div onClick={() => setPreview(null)} style={{ position:'fixed', inset:0, background:'rgba(0,0,0,.85)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(8px)' }}>
          <div onClick={e => e.stopPropagation()} style={{ background:C.card, border:`1px solid ${C.cardBorder}`, borderRadius:20, padding:28, maxWidth:520, width:'90%', animation:'fadeIn .2s ease', maxHeight:'90vh', overflowY:'auto' }}>
            <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:16 }}>
              <h2 style={{ fontSize:'1.1rem', fontWeight:900, color:C.text }}>{preview.name}</h2>
              <button onClick={() => setPreview(null)} style={{ background:'none', border:'none', color:C.textMuted, cursor:'pointer', fontSize:'1.2rem' }}>✕</button>
            </div>
            <LivePreview form={preview} />
            {preview.config && (
              <div style={{ marginTop:14, display:'grid', gridTemplateColumns:'1fr 1fr', gap:8 }}>
                {[
                  { label:'Heading Font', value:preview.config.headingFont },
                  { label:'Body Font', value:preview.config.bodyFont },
                  { label:'Font Size', value:`${preview.config.baseFontSize}px` },
                  { label:'Navbar', value:preview.config.navbarStyle },
                  { label:'Hero Layout', value:preview.config.heroLayout },
                  { label:'Footer Cols', value:preview.config.footerColumns },
                  { label:'Sections', value:`${Object.values(preview.config.sections||{}).filter(Boolean).length} active` },
                  { label:'Type', value:preview.templateType },
                ].map(({ label, value }) => (
                  <div key={label} style={{ display:'flex', justifyContent:'space-between', padding:'7px 10px', background:C.card2, borderRadius:8 }}>
                    <span style={{ fontSize:'.72rem', color:C.textMuted }}>{label}</span>
                    <span style={{ fontSize:'.75rem', fontWeight:700, color:C.text }}>{String(value)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
