'use client'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import MobileNav from '../components/MobileNav'
import HowItWorks from '../components/HowItWorks'

/* ─────────────────────────────────────────
   BLOG CARD COMPONENT (used in Latest Blog section)
───────────────────────────────────────── */
function BlogCard({ blog, i }: { blog: any; i: number }) {
  const fallbackColors = ['#4f46e5', '#7c3aed', '#ec4899', '#0ea5e9', '#f97316', '#10b981']
  const color = fallbackColors[i % fallbackColors.length]

  return (
    <Link
      href={`/blog/${blog.slug}`}
      style={{
        textDecoration: 'none',
        display: 'block',
        background: '#fff',
        borderRadius: 18,
        overflow: 'hidden',
        boxShadow: '0 4px 20px rgba(0,0,0,.06)',
        border: '1.5px solid #f0f0f0',
        transition: 'transform .25s, box-shadow .25s',
        animation: `fadeIn .4s ease ${i * 120}ms both`,
      }}
      onMouseEnter={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'translateY(-6px)'
        el.style.boxShadow = '0 16px 48px rgba(79,70,229,.14)'
      }}
      onMouseLeave={e => {
        const el = e.currentTarget as HTMLElement
        el.style.transform = 'none'
        el.style.boxShadow = '0 4px 20px rgba(0,0,0,.06)'
      }}
    >
      {/* Image or colour block */}
      <div style={{ height: 200, position: 'relative', overflow: 'hidden', background: blog.featuredImage ? '#f0f0f0' : `linear-gradient(135deg,${color},${color}cc)` }}>
        {blog.featuredImage
          ? <img src={blog.featuredImage} alt={blog.title} style={{ width: '100%', height: '100%', objectFit: 'cover', display: 'block' }} />
          : <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', fontSize: '3rem', opacity: .4 }}>📝</div>
        }
        {/* Overlay */}
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(to top, rgba(0,0,0,.5) 0%, transparent 60%)' }} />
        {/* Date + category */}
        <div style={{ position: 'absolute', bottom: 12, left: 12, right: 12, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '.66rem', color: 'rgba(255,255,255,.9)', display: 'flex', alignItems: 'center', gap: 4 }}>
            📅 {new Date(blog.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
          </span>
          <span style={{ background: color, color: '#fff', padding: '3px 10px', borderRadius: 20, fontSize: '.62rem', fontWeight: 800 }}>
            {blog.category}
          </span>
        </div>
      </div>

      <div style={{ padding: '20px 22px' }}>
        {/* Title */}
        <div style={{ width: 28, height: 3, background: `linear-gradient(90deg,${color},${color}60)`, borderRadius: 2, marginBottom: 12 }} />
        <h3 style={{ fontWeight: 800, fontSize: '1rem', color: '#111', lineHeight: 1.4, marginBottom: 10, letterSpacing: '-.01em', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {blog.title}
        </h3>
        <p style={{ fontSize: '.82rem', color: '#6b7280', lineHeight: 1.7, marginBottom: 18, display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {blog.excerpt}
        </p>
        <span style={{ color, fontWeight: 800, fontSize: '.82rem', display: 'flex', alignItems: 'center', gap: 4 }}>
          Read More <span style={{ fontSize: '.95rem', transition: 'transform .2s' }}>→</span>
        </span>
      </div>
    </Link>
  )
}

/* ─────────────────────────────────────────
   HOOKS
───────────────────────────────────────── */

/** Count-up with easeOut */
function useCountUp(target: number, duration = 2000, start = false) {
  const [count, setCount] = useState(0)
  useEffect(() => {
    if (!start) return
    let t0: number
    const ease = (t: number) => 1 - Math.pow(1 - t, 3)
    const step = (ts: number) => {
      if (!t0) t0 = ts
      const p = Math.min((ts - t0) / duration, 1)
      setCount(Math.floor(ease(p) * target))
      if (p < 1) requestAnimationFrame(step)
    }
    requestAnimationFrame(step)
  }, [start, target, duration])
  return count
}

/** Draggable auto-scroll */
function useAutoScroll(speed = 0.6, direction: 'left' | 'right' = 'left') {
  const wrapRef = useRef<HTMLDivElement>(null)
  const trackRef = useRef<HTMLDivElement>(null)
  const posRef = useRef(0)
  const pausedRef = useRef(false)
  const rafRef = useRef<number>(0)
  const dragRef = useRef({ active: false, startX: 0, startPos: 0 })
  useEffect(() => {
    const wrap = wrapRef.current; const track = trackRef.current
    if (!wrap || !track) return
    const dir = direction === 'left' ? -1 : 1
    const animate = () => {
      if (!pausedRef.current && !dragRef.current.active) {
        posRef.current += speed * dir
        const half = track.scrollWidth / 2
        if (direction === 'left' && posRef.current <= -half) posRef.current = 0
        if (direction === 'right' && posRef.current >= 0) posRef.current = -half
        track.style.transform = `translateX(${posRef.current}px)`
      }
      rafRef.current = requestAnimationFrame(animate)
    }
    rafRef.current = requestAnimationFrame(animate)
    const pause = () => { pausedRef.current = true }
    const resume = () => { pausedRef.current = false }
    wrap.addEventListener('mouseenter', pause)
    wrap.addEventListener('mouseleave', resume)
    const onDown = (e: MouseEvent) => { dragRef.current = { active: true, startX: e.clientX, startPos: posRef.current }; wrap.style.cursor = 'grabbing' }
    const onMove = (e: MouseEvent) => {
      if (!dragRef.current.active) return
      const half = track.scrollWidth / 2
      posRef.current = Math.max(-half, Math.min(0, dragRef.current.startPos + e.clientX - dragRef.current.startX))
      track.style.transform = `translateX(${posRef.current}px)`
    }
    const onUp = () => { dragRef.current.active = false; wrap.style.cursor = 'grab' }
    wrap.addEventListener('mousedown', onDown)
    window.addEventListener('mousemove', onMove)
    window.addEventListener('mouseup', onUp)
    const onTS = (e: TouchEvent) => { dragRef.current = { active: true, startX: e.touches[0].clientX, startPos: posRef.current } }
    const onTM = (e: TouchEvent) => {
      if (!dragRef.current.active) return
      const half = track.scrollWidth / 2
      posRef.current = Math.max(-half, Math.min(0, dragRef.current.startPos + e.touches[0].clientX - dragRef.current.startX))
      track.style.transform = `translateX(${posRef.current}px)`
    }
    const onTE = () => { dragRef.current.active = false }
    wrap.addEventListener('touchstart', onTS, { passive: true })
    wrap.addEventListener('touchmove', onTM, { passive: true })
    wrap.addEventListener('touchend', onTE)
    return () => {
      cancelAnimationFrame(rafRef.current)
      wrap.removeEventListener('mouseenter', pause); wrap.removeEventListener('mouseleave', resume)
      wrap.removeEventListener('mousedown', onDown); window.removeEventListener('mousemove', onMove); window.removeEventListener('mouseup', onUp)
      wrap.removeEventListener('touchstart', onTS); wrap.removeEventListener('touchmove', onTM); wrap.removeEventListener('touchend', onTE)
    }
  }, [speed, direction])
  return { wrapRef, trackRef }
}

/** Intersection observer — returns true once element enters viewport */
function useInView(threshold = 0.12) {
  const ref = useRef<HTMLDivElement>(null)
  const [visible, setVisible] = useState(false)
  useEffect(() => {
    // If IntersectionObserver not available, show immediately
    if (typeof IntersectionObserver === 'undefined') { setVisible(true); return }
    const obs = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { setVisible(true); obs.disconnect() }
    }, { threshold, rootMargin: '0px 0px -40px 0px' })
    const el = ref.current
    if (el) {
      // If already in viewport on mount, show immediately
      const rect = el.getBoundingClientRect()
      if (rect.top < window.innerHeight) { setVisible(true); return }
      obs.observe(el)
    }
    return () => obs.disconnect()
  }, [threshold])
  return { ref, visible }
}

/* ─────────────────────────────────────────
   SUB-COMPONENTS
───────────────────────────────────────── */

/** Typing animation headline */
function TypeWriter({ words }: { words: string[] }) {
  const [idx, setIdx] = useState(0)
  const [text, setText] = useState('')
  const [deleting, setDeleting] = useState(false)
  useEffect(() => {
    const word = words[idx]
    const speed = deleting ? 40 : 80
    const timeout = setTimeout(() => {
      if (!deleting && text === word) {
        setTimeout(() => setDeleting(true), 1800)
        return
      }
      if (deleting && text === '') {
        setDeleting(false)
        setIdx(i => (i + 1) % words.length)
        return
      }
      setText(prev => deleting ? prev.slice(0, -1) : word.slice(0, prev.length + 1))
    }, speed)
    return () => clearTimeout(timeout)
  }, [text, deleting, idx, words])
  return (
    <span style={{ background: 'linear-gradient(135deg,#4f46e5,#ec4899)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text' }}>
      {text}<span style={{ animation: 'cursorBlink 1s step-end infinite', WebkitTextFillColor: '#4f46e5' }}>|</span>
    </span>
  )
}

/** Scroll-triggered fade-in wrapper */
function Reveal({ children, delay = 0, style = {} }: { children: React.ReactNode; delay?: number; style?: React.CSSProperties }) {
  const { ref, visible } = useInView()
  return (
    <div ref={ref} style={{ opacity: visible ? 1 : 0, transform: visible ? 'translateY(0)' : 'translateY(28px)', transition: `opacity .65s ease ${delay}ms, transform .65s ease ${delay}ms`, ...style }}>
      {children}
    </div>
  )
}

/** FAQ with smooth height animation */
function FaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false)
  const bodyRef = useRef<HTMLDivElement>(null)
  const [height, setHeight] = useState(0)
  useEffect(() => {
    if (bodyRef.current) setHeight(open ? bodyRef.current.scrollHeight : 0)
  }, [open])
  return (
    <div onClick={() => setOpen(o => !o)} style={{ borderBottom: '1px solid #f0f0f0', cursor: 'pointer', padding: '20px 0', transition: 'background .2s' }}
      onMouseEnter={e => (e.currentTarget.style.background = '#fafafa')}
      onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 16, padding: '0 12px' }}>
        <div style={{ fontWeight: 700, fontSize: '.95rem', color: '#111' }}>{q}</div>
        <div style={{ width: 30, height: 30, borderRadius: '50%', background: open ? '#4f46e5' : '#eef2ff', display: 'flex', alignItems: 'center', justifyContent: 'center', color: open ? '#fff' : '#4f46e5', fontWeight: 900, fontSize: '1.1rem', flexShrink: 0, transition: 'all .25s', transform: open ? 'rotate(45deg)' : 'none' }}>+</div>
      </div>
      <div ref={bodyRef} style={{ overflow: 'hidden', height, transition: 'height .35s cubic-bezier(.4,0,.2,1)' }}>
        <div style={{ color: '#6b7280', fontSize: '.88rem', lineHeight: 1.85, padding: '12px 12px 0 12px' }}>{a}</div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   LAPTOP SHOWCASE COMPONENT
───────────────────────────────────────── */
function LaptopShowcase() {
  const scrollRef = useRef<HTMLDivElement>(null)
  const [activeIdx, setActiveIdx] = useState(0)

  // Website previews data
  const websites = [
    {
      name: 'The Grand Bistro',
      url: 'grandbistro.webrazeo.com',
      color: '#c2410c',
      gradient: 'linear-gradient(135deg,#c2410c,#ea580c)',
      category: 'Restaurant',
      sections: [
        { type: 'nav', bg: '#c2410c' },
        { type: 'hero', bg: 'linear-gradient(135deg,#c2410c,#ea580c)', title: 'The Grand Bistro', sub: 'Fine Dining · Open Now' },
        { type: 'menu', items: ['Grilled Salmon ₹850', 'Truffle Pasta ₹720', 'Wagyu Steak ₹2,400', 'Caesar Salad ₹380'] },
        { type: 'about', color: '#fff7ed' },
        { type: 'footer', bg: '#1c0a00' },
      ]
    },
    {
      name: 'Majestic Suites',
      url: 'majesticsuites.webrazeo.com',
      color: '#1e3a8a',
      gradient: 'linear-gradient(135deg,#1e3a8a,#3b82f6)',
      category: 'Hotel',
      sections: [
        { type: 'nav', bg: '#1e3a8a' },
        { type: 'hero', bg: 'linear-gradient(135deg,#1e3a8a,#3b82f6)', title: 'Majestic Suites', sub: 'Luxury Stay · 5 Star' },
        { type: 'menu', items: ['Deluxe Room ₹4,500/night', 'Suite ₹8,900/night', 'Presidential ₹18,000/night', 'Pool Villa ₹24,000/night'] },
        { type: 'about', color: '#eff6ff' },
        { type: 'footer', bg: '#0f172a' },
      ]
    },
    {
      name: 'MedPlus Pharmacy',
      url: 'medplus.webrazeo.com',
      color: '#0f766e',
      gradient: 'linear-gradient(135deg,#0f766e,#14b8a6)',
      category: 'Pharmacy',
      sections: [
        { type: 'nav', bg: '#0f766e' },
        { type: 'hero', bg: 'linear-gradient(135deg,#0f766e,#14b8a6)', title: 'MedPlus Store', sub: 'Open 24/7 · Home Delivery' },
        { type: 'menu', items: ['Paracetamol 500mg ₹25', 'Vitamin C 1000mg ₹180', 'BP Monitor ₹1,200', 'Insulin Pen ₹450'] },
        { type: 'about', color: '#f0fdf4' },
        { type: 'footer', bg: '#042f2e' },
      ]
    },
    {
      name: 'FitZone Gym',
      url: 'fitzone.webrazeo.com',
      color: '#dc2626',
      gradient: 'linear-gradient(135deg,#dc2626,#f97316)',
      category: 'Gym',
      sections: [
        { type: 'nav', bg: '#dc2626' },
        { type: 'hero', bg: 'linear-gradient(135deg,#dc2626,#f97316)', title: 'FitZone Gym', sub: 'Transform Your Body' },
        { type: 'menu', items: ['Monthly Pass ₹999', 'Quarterly ₹2,499', 'Annual ₹7,999', 'Personal Training ₹500/hr'] },
        { type: 'about', color: '#fff1f2' },
        { type: 'footer', bg: '#1c0000' },
      ]
    },
  ]

  // Auto-scroll inside laptop screen
  useEffect(() => {
    const el = scrollRef.current
    if (!el) return
    let pos = 0
    let dir = 1
    const speed = 0.8
    let raf: number

    const animate = () => {
      pos += speed * dir
      const maxScroll = el.scrollHeight - el.clientHeight
      if (pos >= maxScroll) { dir = -1; pos = maxScroll }
      if (pos <= 0) { dir = 1; pos = 0 }
      el.scrollTop = pos
      raf = requestAnimationFrame(animate)
    }
    raf = requestAnimationFrame(animate)

    const pause = () => cancelAnimationFrame(raf)
    const resume = () => { raf = requestAnimationFrame(animate) }
    el.addEventListener('mouseenter', pause)
    el.addEventListener('mouseleave', resume)

    return () => {
      cancelAnimationFrame(raf)
      el.removeEventListener('mouseenter', pause)
      el.removeEventListener('mouseleave', resume)
    }
  }, [activeIdx])

  // Auto-cycle websites
  useEffect(() => {
    const id = setInterval(() => setActiveIdx(i => (i + 1) % websites.length), 4000)
    return () => clearInterval(id)
  }, [])

  const site = websites[activeIdx]

  return (
    <div style={{ position: 'relative', animation: 'fadeIn .8s ease .3s both' }}>
      <style>{`
        @keyframes laptopFloat { 0%,100%{transform:translateY(0) rotateX(2deg)} 50%{transform:translateY(-10px) rotateX(2deg)} }
        @keyframes screenGlow { 0%,100%{box-shadow:0 0 30px rgba(79,70,229,.3)} 50%{box-shadow:0 0 60px rgba(79,70,229,.5)} }
        @keyframes siteSwitch { from{opacity:0;transform:translateY(8px)} to{opacity:1;transform:translateY(0)} }
        .laptop-wrap { animation: laptopFloat 5s ease-in-out infinite; perspective: 1000px; }
        .laptop-screen { animation: screenGlow 3s ease-in-out infinite; }
        .site-content { animation: siteSwitch .4s ease; }
        .dot-btn { transition: all .2s ease; cursor: pointer; }
        .dot-btn:hover { transform: scale(1.3); }
      `}</style>

      {/* Live Preview Label - Improved */}
      <div style={{
        position: 'absolute',
        top: -24,
        left: '50%',
        transform: 'translateX(-50%)',
        background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
        color: '#fff',
        padding: '8px 20px',
        borderRadius: 50,
        fontSize: '.8rem',
        fontWeight: 800,
        whiteSpace: 'nowrap',
        boxShadow: '0 6px 20px rgba(79,70,229,.5)',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: 8,
        border: '2px solid rgba(255,255,255,0.2)'
      }}>
        <span style={{
          width: 8,
          height: 8,
          borderRadius: '50%',
          background: '#4ade80',
          display: 'inline-block',
          animation: 'blink 1.5s infinite',
          boxShadow: '0 0 8px #4ade80'
        }} />
        <span>Live Preview</span>
        <span style={{
          fontSize: '.7rem',
          opacity: 0.8,
          fontWeight: 600,
          background: 'rgba(255,255,255,0.15)',
          padding: '2px 8px',
          borderRadius: 12
        }}>
          {site.category}
        </span>
      </div>

      {/* Laptop wrapper */}
      <div className="laptop-wrap" style={{ maxWidth: 560, margin: '0 auto' }}>

        {/* Laptop body */}
        <div style={{ position: 'relative' }}>

          {/* Screen bezel - Enhanced laptop look */}
          <div className="laptop-screen" style={{
            background: 'linear-gradient(145deg,#2d2d2d,#1a1a1a)',
            borderRadius: '20px 20px 0 0',
            padding: '16px 16px 0',
            boxShadow: '0 -6px 30px rgba(0,0,0,.4), inset 0 2px 0 rgba(255,255,255,.08)',
            border: '3px solid #1a1a1a'
          }}>

            {/* Camera dot */}
            <div style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: 'radial-gradient(circle, #444, #222)',
              margin: '0 auto 10px',
              boxShadow: 'inset 0 2px 4px rgba(0,0,0,.8), 0 0 2px rgba(255,255,255,.1)',
              border: '1px solid #111'
            }} />

            {/* Screen */}
            <div style={{
              borderRadius: '10px 10px 0 0',
              overflow: 'hidden',
              background: '#fff',
              position: 'relative',
              boxShadow: 'inset 0 0 0 1px rgba(0,0,0,.1)'
            }}>

              {/* Browser chrome */}
              <div style={{ background: '#f1f3f4', padding: '8px 12px', display: 'flex', alignItems: 'center', gap: 8, borderBottom: '1px solid #e0e0e0' }}>
                <div style={{ display: 'flex', gap: 5 }}>
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#ff5f57' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#febc2e' }} />
                  <div style={{ width: 10, height: 10, borderRadius: '50%', background: '#28c840' }} />
                </div>
                <div style={{ flex: 1, background: '#fff', borderRadius: 20, padding: '4px 12px', fontSize: '.62rem', color: '#666', display: 'flex', alignItems: 'center', gap: 5, border: '1px solid #e0e0e0' }}>
                  <span style={{ color: '#4f46e5', fontSize: '.6rem' }}>🔒</span>
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{site.url}</span>
                </div>
              </div>

              {/* Scrollable website content */}
              <div ref={scrollRef} key={activeIdx} className="site-content" style={{ height: 320, overflowY: 'scroll', scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
                <style>{`.site-content::-webkit-scrollbar{display:none}`}</style>

                {/* Navbar */}
                <div style={{ padding: '10px 16px', background: site.color, display: 'flex', justifyContent: 'space-between', alignItems: 'center', position: 'sticky', top: 0, zIndex: 5 }}>
                  <span style={{ fontWeight: 900, fontSize: '.75rem', color: '#fff', fontFamily: 'serif' }}>{site.name}</span>
                  <div style={{ display: 'flex', gap: 10 }}>
                    {['Home', 'Menu', 'About', 'Contact'].map(l => <span key={l} style={{ fontSize: '.55rem', color: 'rgba(255,255,255,.8)' }}>{l}</span>)}
                    <span style={{ fontSize: '.55rem', fontWeight: 700, padding: '3px 8px', background: 'rgba(255,255,255,.2)', borderRadius: 4, color: '#fff' }}>Order Now</span>
                  </div>
                </div>

                {/* Hero */}
                <div style={{ padding: '28px 16px', background: site.gradient, textAlign: 'center', color: '#fff' }}>
                  <div style={{ fontSize: '.6rem', fontWeight: 700, opacity: .8, marginBottom: 6, textTransform: 'uppercase', letterSpacing: '.1em' }}>{site.category}</div>
                  <h2 style={{ fontFamily: 'serif', fontWeight: 900, fontSize: '1.1rem', marginBottom: 6 }}>{site.name}</h2>
                  <p style={{ fontSize: '.65rem', opacity: .85, marginBottom: 14 }}>{site.sections[1].sub as string}</p>
                  <div style={{ display: 'flex', gap: 8, justifyContent: 'center' }}>
                    <span style={{ padding: '6px 14px', background: 'rgba(255,255,255,.2)', borderRadius: 6, fontSize: '.6rem', fontWeight: 700, border: '1px solid rgba(255,255,255,.3)' }}>View Menu</span>
                    <span style={{ padding: '6px 14px', background: '#25D366', borderRadius: 6, fontSize: '.6rem', fontWeight: 700 }}>📲 WhatsApp</span>
                  </div>
                </div>

                {/* Menu items */}
                <div style={{ padding: '16px', background: '#fff' }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 800, color: '#111', marginBottom: 10, textTransform: 'uppercase', letterSpacing: '.06em' }}>Our Menu</div>
                  {(site.sections[2].items as string[]).map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '8px 10px', background: i % 2 === 0 ? '#f9fafb' : '#fff', borderRadius: 8, marginBottom: 6, border: '1px solid #f0f0f0' }}>
                      <span style={{ fontSize: '.62rem', fontWeight: 600, color: '#111' }}>{item.split('₹')[0]}</span>
                      <span style={{ fontSize: '.65rem', fontWeight: 800, color: site.color }}>₹{item.split('₹')[1]}</span>
                    </div>
                  ))}
                </div>

                {/* About section */}
                <div style={{ padding: '16px', background: site.sections[3].color as string }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 800, color: '#111', marginBottom: 8 }}>About Us</div>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                    {[80, 65, 72, 55].map((w, i) => <div key={i} style={{ height: 5, background: '#e5e7eb', borderRadius: 3, width: `${w}%` }} />)}
                  </div>
                  <div style={{ marginTop: 12, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8 }}>
                    {['⭐ 4.9 Rating', '📍 Location', '🕐 Open Now', '📞 Call Us'].map(s => (
                      <div key={s} style={{ padding: '6px 8px', background: '#fff', borderRadius: 6, fontSize: '.58rem', fontWeight: 600, color: '#374151', border: '1px solid #e5e7eb' }}>{s}</div>
                    ))}
                  </div>
                </div>

                {/* Testimonials */}
                <div style={{ padding: '16px', background: '#fff' }}>
                  <div style={{ fontSize: '.65rem', fontWeight: 800, color: '#111', marginBottom: 10 }}>Customer Reviews</div>
                  {[{ av: 'R', text: 'Amazing food!', stars: '★★★★★' }, { av: 'P', text: 'Best in town.', stars: '★★★★★' }].map((r, i) => (
                    <div key={i} style={{ display: 'flex', gap: 8, padding: '8px', background: '#f9fafb', borderRadius: 8, marginBottom: 6 }}>
                      <div style={{ width: 24, height: 24, borderRadius: '50%', background: site.gradient, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '.6rem', fontWeight: 800, flexShrink: 0 }}>{r.av}</div>
                      <div>
                        <div style={{ fontSize: '.55rem', color: '#f59e0b' }}>{r.stars}</div>
                        <div style={{ fontSize: '.6rem', color: '#374151' }}>{r.text}</div>
                      </div>
                    </div>
                  ))}
                </div>

                {/* CTA */}
                <div style={{ padding: '20px 16px', background: site.gradient, textAlign: 'center' }}>
                  <div style={{ fontSize: '.7rem', fontWeight: 800, color: '#fff', marginBottom: 8 }}>Ready to Order?</div>
                  <div style={{ padding: '8px 20px', background: '#25D366', borderRadius: 8, fontSize: '.65rem', fontWeight: 700, color: '#fff', display: 'inline-block' }}>📲 Order on WhatsApp</div>
                </div>

                {/* Footer */}
                <div style={{ padding: '14px 16px', background: site.sections[4].bg as string }}>
                  <div style={{ fontWeight: 900, fontSize: '.7rem', color: '#fff', marginBottom: 6, fontFamily: 'serif' }}>{site.name}</div>
                  <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
                    {['📘', '📸', '🐦'].map(s => <span key={s} style={{ fontSize: '.75rem' }}>{s}</span>)}
                  </div>
                  <div style={{ fontSize: '.55rem', color: 'rgba(255,255,255,.4)' }}>© 2026 {site.name}. Powered by Webrazeo</div>
                </div>
              </div>
            </div>
          </div>

          {/* Laptop base - Enhanced */}
          <div style={{
            background: 'linear-gradient(180deg,#3a3a3a,#2a2a2a)',
            height: 16,
            borderRadius: '0 0 6px 6px',
            position: 'relative',
            boxShadow: 'inset 0 1px 0 rgba(255,255,255,.05)'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 0,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 70,
              height: 5,
              background: 'linear-gradient(180deg,#2a2a2a,#1a1a1a)',
              borderRadius: '0 0 6px 6px',
              boxShadow: 'inset 0 1px 2px rgba(0,0,0,.5)'
            }} />
          </div>
          {/* Hinge */}
          <div style={{
            background: 'linear-gradient(180deg,#1a1a1a,#0a0a0a)',
            height: 8,
            borderRadius: '0 0 10px 10px',
            boxShadow: '0 6px 24px rgba(0,0,0,.5)',
            border: '1px solid #0a0a0a'
          }} />
          {/* Base - Enhanced laptop bottom */}
          <div style={{
            background: 'linear-gradient(180deg,#2d2d2d,#1a1a1a)',
            height: 24,
            borderRadius: '0 0 16px 16px',
            boxShadow: '0 10px 40px rgba(0,0,0,.4)',
            position: 'relative',
            border: '2px solid #1a1a1a',
            borderTop: 'none'
          }}>
            <div style={{
              position: 'absolute',
              bottom: 6,
              left: '50%',
              transform: 'translateX(-50%)',
              width: 100,
              height: 8,
              background: 'linear-gradient(180deg,#1a1a1a,#0a0a0a)',
              borderRadius: 4,
              boxShadow: 'inset 0 1px 3px rgba(0,0,0,.8)'
            }} />
          </div>
        </div>

        {/* Website selector dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 8, marginTop: 16 }}>
          {websites.map((w, i) => (
            <button key={i} className="dot-btn" onClick={() => setActiveIdx(i)} style={{ display: 'flex', alignItems: 'center', gap: 6, padding: '5px 12px', borderRadius: 50, border: `2px solid ${i === activeIdx ? w.color : '#e5e7eb'}`, background: i === activeIdx ? `${w.color}15` : '#fff', cursor: 'pointer' }}>
              <div style={{ width: 8, height: 8, borderRadius: '50%', background: i === activeIdx ? w.color : '#d1d5db', transition: 'all .2s' }} />
              <span style={{ fontSize: '.65rem', fontWeight: 700, color: i === activeIdx ? w.color : '#9ca3af' }}>{w.category}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}

/* ─────────────────────────────────────────
   MAIN PAGE
───────────────────────────────────────── */
export default function HomePage() {
  const [statsVisible, setStatsVisible] = useState(false)
  const [activeStep, setActiveStep] = useState(0)
  const [billingYearly, setBillingYearly] = useState(false)
  const [navScrolled, setNavScrolled] = useState(false)
  const [showBackTop, setShowBackTop] = useState(false)
  const [activeSection, setActiveSection] = useState('')
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const [latestBlogs, setLatestBlogs] = useState<any[]>([])
  const [blogsLoading, setBlogsLoading] = useState(true)
  const [templates, setTemplates] = useState<any[]>([])
  const [templatesLoading, setTemplatesLoading] = useState(true)
  const [heroBanner, setHeroBanner] = useState<any>(null)
  const statsRef = useRef<HTMLDivElement>(null)

  const tplRow1 = useAutoScroll(0.5, 'left')
  const tplRow2 = useAutoScroll(0.4, 'right')
  const testimonialScroll = useAutoScroll(0.45, 'left')
  const tickerScroll = useAutoScroll(0.8, 'left')

  // nav scroll effect + back-to-top + active section
  useEffect(() => {
    const onScroll = () => {
      setNavScrolled(window.scrollY > 40)
      setShowBackTop(window.scrollY > 600)
      const sections = ['features', 'templates', 'how', 'pricing']
      for (const id of sections) {
        const el = document.getElementById(id)
        if (el) {
          const rect = el.getBoundingClientRect()
          if (rect.top <= 80 && rect.bottom >= 80) { setActiveSection(id); break }
        }
      }
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // stats observer
  useEffect(() => {
    const obs = new IntersectionObserver(([e]) => { if (e.isIntersecting) setStatsVisible(true) }, { threshold: 0.3 })
    if (statsRef.current) obs.observe(statsRef.current)
    return () => obs.disconnect()
  }, [])

  // auto-cycle steps
  useEffect(() => {
    const id = setInterval(() => setActiveStep(s => (s + 1) % 3), 3000)
    return () => clearInterval(id)
  }, [])

  // fetch latest blogs
  useEffect(() => {
    fetch('/api/blogs?limit=3')
      .then(r => r.json())
      .then(d => { if (d.success) setLatestBlogs(d.blogs) })
      .catch(() => { })
      .finally(() => setBlogsLoading(false))
  }, [])

  // fetch templates
  useEffect(() => {
    fetch('/api/templates')
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setTemplates(d.templates) // All templates are already active from API
        }
      })
      .catch(() => { })
      .finally(() => setTemplatesLoading(false))
  }, [])

  // fetch hero banner
  useEffect(() => {
    fetch('/api/admin/hero-banner')
      .then(r => r.json())
      .then(d => {
        if (d.success && d.banner) {
          setHeroBanner(d.banner)
        }
      })
      .catch(() => { })
  }, [])

  const stores = useCountUp(1200, 2000, statsVisible)
  const products = useCountUp(18000, 2000, statsVisible)
  const views = useCountUp(500, 2000, statsVisible)
  const uptime = useCountUp(99, 1500, statsVisible)

  const features = [
    { icon: '🥘', title: 'Digital Menu / Catalog', desc: 'Add items with photos, prices & categories. Update anytime — live in seconds.', color: '#fff7ed', border: '#fb923c', accent: '#ea580c' },
    { icon: '💬', title: 'WhatsApp Orders', desc: 'One tap and the order lands on your WhatsApp. No app, no commission, no hassle.', color: '#f0fdf4', border: '#4ade80', accent: '#16a34a' },
    { icon: '🎨', title: 'Your Brand, Your Way', desc: 'Upload your logo, pick colors, choose font. Looks exactly like your business.', color: '#fdf4ff', border: '#c084fc', accent: '#9333ea' },
    { icon: '📱', title: 'Mobile First', desc: 'Looks perfect on every phone. 80% of customers browse on mobile.', color: '#eff6ff', border: '#60a5fa', accent: '#2563eb' },
    { icon: '🔍', title: 'Google Friendly (SEO)', desc: 'Built-in SEO so your business shows up when people search on Google.', color: '#fefce8', border: '#facc15', accent: '#ca8a04' },
    { icon: '📊', title: 'Visitor Analytics', desc: 'See how many people visit, which items they click, where they come from.', color: '#fff1f2', border: '#fb7185', accent: '#e11d48' },
    { icon: '⚡', title: 'Live in 5 Minutes', desc: 'Sign up, fill details, go live. No coding, no hosting, no tech skills needed.', color: '#f5f3ff', border: '#818cf8', accent: '#4f46e5' },
    { icon: '🔗', title: 'Shareable Link', desc: 'Get a clean link — share on Instagram bio, WhatsApp, or Google Maps listing.', color: '#ecfdf5', border: '#34d399', accent: '#059669' },
    { icon: '🛡️', title: '99.9% Uptime', desc: 'Your store is always online. We handle servers, security & backups for you.', color: '#f0f9ff', border: '#38bdf8', accent: '#0284c7' },
  ]

  const steps = [
    { n: '01', icon: '✍️', title: 'Create your free account', desc: "Sign up in 30 seconds. No credit card. No setup fee. Just your email and you're in.", detail: 'Takes less than 30 seconds', color: '#4f46e5' },
    { n: '02', icon: '🎨', title: 'Build & customize your store', desc: 'Choose a template, add your menu items or products, upload photos, set prices, and customize your brand colors and logo.', detail: 'Average setup time: 4 minutes', color: '#7c3aed' },
    { n: '03', icon: '🚀', title: 'Share & start getting customers', desc: 'Copy your unique store link and share it on WhatsApp, Instagram bio, or Google Maps. Customers browse and order directly.', detail: 'First order usually within 24 hours', color: '#ec4899' },
  ]

  const pricingBase = [
    { name: 'Starter', monthlyPrice: 0, yearlyPrice: 0, sub: 'Free forever', popular: false, dark: false, bg: '#fff', border: '#e5e7eb', features: ['1 Store', '10 Menu Items', 'WhatsApp Button', 'Mobile Optimized', 'Basic Template', 'Shareable Link'], cta: 'Start for Free' },
    { name: 'Pro', monthlyPrice: 299, yearlyPrice: 199, sub: '/month', popular: true, dark: true, bg: 'linear-gradient(145deg,#4f46e5,#7c3aed)', border: 'none', features: ['5 Stores', 'Unlimited Items', 'All Templates', 'Custom Colors & Logo', 'SEO Tools', 'Visitor Analytics', 'Priority Support', 'Remove Branding'], cta: 'Get Pro' },
    { name: 'Business', monthlyPrice: 799, yearlyPrice: 549, sub: '/month', popular: false, dark: true, bg: '#0f172a', border: 'none', features: ['Unlimited Stores', 'Unlimited Items', 'Custom Domain', 'Advanced Analytics', 'White Label', 'API Access', 'Dedicated Manager', 'Invoice & GST'], cta: 'Get Business' },
  ]

  const testimonials = [
    { name: 'Rahul Sharma', role: 'Restaurant Owner · Delhi', av: 'R', avBg: '#f97316', text: 'My restaurant went online in 10 minutes. Now customers WhatsApp me orders directly — no middleman, no commission!' },
    { name: 'Priya Mehta', role: 'Hotel Manager · Jaipur', av: 'P', avBg: '#8b5cf6', text: 'Our hotel website looks 5-star now. Bookings went up 3x in the first month. Best ₹299 I ever spent.' },
    { name: 'Arjun Nair', role: 'Cafe Owner · Bangalore', av: 'A', avBg: '#10b981', text: 'Updating the menu is so easy. I change prices from my phone in 10 seconds. Customers always see the latest menu.' },
    { name: 'Sunita Patel', role: 'Pharmacy Owner · Ahmedabad', av: 'S', avBg: '#0ea5e9', text: 'I added all my medicines with prices. Customers WhatsApp me their list and I deliver. Sales doubled in 2 weeks!' },
    { name: 'Vikram Singh', role: 'Gym Owner · Pune', av: 'V', avBg: '#dc2626', text: 'My gym page shows all classes, trainers and pricing. New members find me on Google now. Incredible!' },
    { name: 'Meera Iyer', role: 'Salon Owner · Chennai', av: 'M', avBg: '#db2777', text: 'The salon template is so beautiful. Clients book appointments via WhatsApp after seeing my page. Love it!' },
  ]

  const faqs = [
    { q: 'Do I need to know coding or tech?', a: 'Not at all. If you can use WhatsApp, you can build your store. Everything is point-and-click. No coding, no design skills needed.' },
    { q: 'How do customers place orders?', a: 'They browse your menu or catalog, tap the "Order via WhatsApp" button, and the order comes directly to your WhatsApp number. Simple as that.' },
    { q: 'Can I use my own logo and brand colors?', a: 'Yes! Upload your logo and pick any color you want. Your store will look exactly like your brand — professional and unique.' },
    { q: 'How do I update my menu or products?', a: 'Login to your dashboard, click on the item, make changes, and save. Updates go live in seconds. You can do it from your phone anytime.' },
    { q: 'Is the free plan really free forever?', a: 'Yes. The Starter plan is completely free with 1 store and 10 items. No credit card needed. Upgrade only when you want more features.' },
    { q: 'What types of businesses can use this?', a: 'Restaurants, hotels, cafes, pharmacies, gyms, salons, freelancers, shops — basically any business that wants an online presence without a big budget.' },
  ]

  const scrollTemplates = [...templates, ...templates]

  const navLinks: [string, string][] = [['Features', '#features'], ['Templates', '#templates'], ['How it Works', '#how'], ['Pricing', '#pricing'], ['Blog', '/blog']]

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', color: '#111', overflowX: 'hidden' }}>
      <style>{`
        @media (max-width: 768px) {
          .hero-grid { grid-template-columns: 1fr !important; }
          .stats-grid { grid-template-columns: repeat(2,1fr) !important; }
          .footer-grid { grid-template-columns: 1fr !important; }
          .tpl-card { width: 200px !important; }
          .scroll-track { padding: 8px 16px !important; }
          .setup-grid { grid-template-columns: 1fr !important; gap: 24px !important; }
        }
        @media (max-width: 480px) {
          .tpl-card { width: 180px !important; }
          .scroll-track { padding: 8px 12px !important; }
          .setup-grid { gap: 20px !important; }
        }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        @keyframes popIn { from { opacity: 0; transform: scale(0.8) translateY(20px); } to { opacity: 1; transform: scale(1) translateY(0); } }
        @keyframes expandWidth { from { width: 0; } to { width: 100%; } }
        @keyframes particleFloat { 0%, 100% { transform: translateY(0px) rotate(0deg); } 50% { transform: translateY(-20px) rotate(180deg); } }
        @keyframes shineSweep { 0% { left: -100%; } 100% { left: 100%; } }
        @keyframes blink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0.3; } }
        @keyframes cursorBlink { 0%, 50% { opacity: 1; } 51%, 100% { opacity: 0; } }
        @keyframes shimmer { 0% { background-position: -200% 0; } 100% { background-position: 200% 0; } }
        .animated-bg { background: linear-gradient(135deg, #FDF1F1, #FFE5E5, #FDF1F1); }
        .scroll-wrap { cursor: grab; user-select: none; }
        .scroll-wrap:active { cursor: grabbing; }
        .scroll-track { display: flex; animation: none; }
        .tpl-card { width: 240px; background: #fff; borderRadius: 14px; overflow: hidden; boxShadow: 0 4px 20px rgba(0,0,0,.08); border: 1.5px solid #f0f0f0; flexShrink: 0; position: relative; transition: transform .25s, boxShadow .25s; }
        .tpl-card:hover { transform: translateY(-6px); boxShadow: 0 16px 48px rgba(79,70,229,.14); }
        .tpl-overlay { position: absolute; inset: 0; background: rgba(0,0,0,.7); display: flex; alignItems: center; justifyContent: center; opacity: 0; transition: opacity .25s; }
        .tpl-card:hover .tpl-overlay { opacity: 1; }
        .card { transition: transform .25s, boxShadow .25s; }
        .card:hover { transform: translateY(-4px); }
        .feat-card:hover .feat-icon { transform: scale(1.1); }
        .feat-icon { transition: transform .25s; }
        .pro-card { position: relative; overflow: hidden; }
        .pro-card::before { content: ''; position: absolute; top: 0; left: -100%; width: 100%; height: 100%; background: linear-gradient(90deg, transparent, rgba(255,255,255,.1), transparent); animation: shineSweep 3s ease-in-out infinite; }
        .testi-card { transition: transform .25s; }
        .testi-card:hover { transform: translateY(-4px); }
        .back-top { position: fixed; bottom: 24px; right: 24px; width: 48px; height: 48px; borderRadius: 50%; background: linear-gradient(135deg,#4f46e5,#7c3aed); color: #fff; border: none; fontSize: 1.2rem; fontWeight: 900; cursor: pointer; boxShadow: 0 4px 16px rgba(79,70,229,.3); zIndex: 1000; transition: all .25s; }
        .back-top:hover { transform: translateY(-2px); boxShadow: 0 8px 24px rgba(79,70,229,.4); }
        .tag { display: inline-block; padding: 6px 16px; borderRadius: 50px; fontSize: .72rem; fontWeight: 800; letterSpacing: .06em; textTransform: uppercase; }
        .divider { width: 60px; height: 3px; background: linear-gradient(90deg,#4f46e5,#ec4899); borderRadius: 2px; margin: 0 auto; }
        .btn-primary { transition: all .25s; }
        .btn-primary:hover { transform: translateY(-2px); }
        .btn-outline { transition: all .25s; }
        .btn-outline:hover { background: rgba(255,255,255,.12) !important; }
      `}</style>

      {/* ── NAV ── */}
      <MobileNav navLinks={navLinks} activeSection={activeSection} navScrolled={navScrolled} />

      {/* ── HERO ── */}
      <section style={{ padding: '80px 4% 80px', background: '#FDF1F1', position: 'relative', overflow: 'hidden' }}>

        {/* Hero Heading */}
        <div style={{ textAlign: 'center', marginBottom: 48, animation: 'fadeIn .6s ease' }}>
          <h1 style={{
            fontSize: 'clamp(2rem, 4vw, 3.5rem)',
            fontWeight: 900,
            fontFamily: '"Playfair Display", serif',
            background: 'linear-gradient(135deg, #ec4899, #f97316, #ec4899)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            backgroundClip: 'text',
            letterSpacing: '-.02em',
            lineHeight: 1.2,
            marginBottom: 12
          }}>
            Build Your Dream Website With Webrazeo
          </h1>
          <p style={{
            fontSize: 'clamp(.95rem, 2vw, 1.1rem)',
            color: '#6b7280',
            maxWidth: 600,
            margin: '0 auto',
            fontWeight: 500
          }}>
            Create stunning, professional websites in minutes with our easy-to-use platform
          </p>
        </div>

        {/* 3-Column Grid: Left Templates | Center Laptop | Right Templates */}
        <div style={{ maxWidth: 1400, margin: '0 auto', display: 'grid', gridTemplateColumns: '300px 1fr 300px', gap: 40, alignItems: 'center', position: 'relative', zIndex: 1 }}>

          {/* LEFT — 2 Template Images */}
          <Reveal>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid #f0f0f0',
                transition: 'transform 0.3s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={heroBanner?.topLeftImage || "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop"}
                  alt="Business Template 1"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid #f0f0f0',
                transition: 'transform 0.3s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={heroBanner?.bottomLeftImage || "https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop"}
                  alt="Business Template 2"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </Reveal>

          {/* CENTER — Laptop Showcase (UNCHANGED) */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <LaptopShowcase />
          </div>

          {/* RIGHT — 2 Template Images */}
          <Reveal delay={200}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid #f0f0f0',
                transition: 'transform 0.3s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={heroBanner?.topRightImage || "https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop"}
                  alt="Business Template 3"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />
              </div>

              <div style={{
                background: '#fff',
                borderRadius: 16,
                overflow: 'hidden',
                boxShadow: '0 8px 32px rgba(0,0,0,0.1)',
                border: '2px solid #f0f0f0',
                transition: 'transform 0.3s ease'
              }}
                onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-8px)'}
                onMouseLeave={e => e.currentTarget.style.transform = 'translateY(0)'}
              >
                <img
                  src={heroBanner?.bottomRightImage || "https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop"}
                  alt="Business Template 4"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      {/* ── CTA BANNER — After Hero ── */}
      <section style={{ padding: '20px 6%', background: '#FDF1F1' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: 'linear-gradient(120deg, #eef2ff 0%, #e0e7ff 50%, #ede9fe 100%)',
          borderRadius: 20,
          padding: '24px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          boxShadow: '0 4px 24px rgba(79,70,229,.10)',
          border: '1.5px solid rgba(99,102,241,.15)',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(.95rem,2vw,1.15rem)', color: '#1e1b4b', marginBottom: 5 }}>
              Transform Your Online Presence with a Professional Website
            </div>
            <div style={{ color: '#4b5563', fontSize: '.88rem' }}>
              Get a high-converting website tailored for your business — live in under 5 minutes with Webrazeo.
            </div>
          </div>
          <Link href="/signup" style={{
            padding: '13px 28px',
            background: '#1e1b4b',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '.9rem',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(30,27,75,.25)',
            transition: 'background .2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#312e81' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1e1b4b' }}
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ background: '#FDF1F1', padding: '52px 6%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(255,182,193,.15),transparent 70%)', pointerEvents: 'none' }} />
        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {[
            { val: stores, suf: '+', label: 'Stores Created', icon: '🏪', pct: stores / 12 },
            { val: products, suf: '+', label: 'Menu Items Added', icon: '🍽️', pct: products / 180 },
            { val: views, suf: 'K+', label: 'Monthly Visitors', icon: '👁️', pct: views / 5 },
            { val: uptime, suf: '%', label: 'Uptime Guaranteed', icon: '⚡', pct: uptime },
          ].map((s, i) => (
            <div key={i} style={{ animation: statsVisible ? `popIn .5s ease ${i * 120}ms both` : 'none' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(1.6rem,3vw,2.3rem)', fontWeight: 900, color: '#1e1b4b', fontFamily: '"Playfair Display",serif', lineHeight: 1 }}>
                {s.val.toLocaleString()}{s.suf}
              </div>
              <div style={{ fontSize: '.78rem', color: '#6b7280', marginTop: 5, fontWeight: 500, marginBottom: 10 }}>{s.label}</div>
              {/* progress bar */}
              <div style={{ height: 4, background: 'rgba(107,114,128,.15)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#ec4899,#f97316)', borderRadius: 2, width: statsVisible ? `${Math.min(s.pct, 100)}%` : '0%', transition: 'width 2s cubic-bezier(.4,0,.2,1)' }} />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── TICKER ── */}
      <div className="animated-bg" style={{ padding: '12px 0', overflow: 'hidden' }}>
        <div ref={tickerScroll.wrapRef} className="scroll-wrap" style={{ overflow: 'hidden' }}>
          <div ref={tickerScroll.trackRef} className="scroll-track">
            {Array(3).fill(['🍴 Restaurant Menus', '🏨 Hotel Rooms', '💊 Pharmacy Catalog', '💪 Gym Classes', '💅 Salon Services', '🏠 Real Estate', '📸 Photography', '👗 Clothing Store', '🛒 Grocery Shop', '🏥 Medical Clinic', '🚀 Startup Landing', '👨‍💻 Developer Portfolio']).flat().map((t, i) => (
              <span key={i} style={{ color: '#6b7280', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.07em', padding: '0 24px', whiteSpace: 'nowrap' }}>{t} &nbsp;·</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEMPLATES ── */}
      <section id="templates" style={{ padding: '88px 0', background: '#FDF1F1', overflow: 'hidden' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 44, padding: '0 6%' }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>
            {templatesLoading ? 'Loading...' : `${templates.length} Templates`}
          </div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', letterSpacing: '-.02em' }}>A template for every business</h2>
          <div className="divider" />
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: '.93rem', maxWidth: 500, margin: '16px auto 0' }}>
            {templatesLoading
              ? 'Loading professional templates...'
              : templates.length > 0
                ? 'From restaurants to pharmacies, gyms to portfolios — pick a template and go live in minutes'
                : 'Admin will add templates soon. Check back later!'
            }
          </p>
        </Reveal>

        {templatesLoading ? (
          // Loading state
          <div style={{ display: 'flex', justifyContent: 'center', padding: '60px 0' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16, animation: 'pulse 1.5s infinite' }}>🎨</div>
              <div style={{ color: '#6b7280', fontSize: '.9rem' }}>Loading templates...</div>
            </div>
          </div>
        ) : templates.length === 0 ? (
          // Empty state
          <div style={{ textAlign: 'center', padding: '60px 0', color: '#94a3b8' }}>
            <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
            <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#6b7280' }}>No templates available yet</div>
            <p style={{ fontSize: '.9rem' }}>Admin is working on adding professional templates. Check back soon!</p>
          </div>
        ) : (
          // Templates grid
          [tplRow1, tplRow2].map((row, ri) => (
            <div key={ri} style={{ overflow: 'hidden', marginBottom: ri === 0 ? 16 : 0 }}>
              <div ref={row.wrapRef} className="scroll-wrap" style={{ overflow: 'hidden' }}>
                <div ref={row.trackRef} className="scroll-track" style={{ gap: 16, padding: '8px 24px' }}>
                  {scrollTemplates.slice(0, Math.min(50, templates.length * 2)).map((t, i) => (
                    <div key={i} className="tpl-card">
                      <div style={{ height: 130, background: t.color || 'linear-gradient(135deg,#4f46e5,#7c3aed)', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', padding: 16 }}>
                        {t.popular && <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 8px', borderRadius: 50, fontSize: '.58rem', fontWeight: 800, animation: 'blink 2s ease-in-out infinite' }}>🔥 Popular</div>}
                        <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(255,255,255,.2)', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 700 }}>{t.category}</div>
                        <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>{t.icon || '🌐'}</div>
                        <div style={{ fontWeight: 800, fontSize: '.82rem', textAlign: 'center', fontFamily: '"Playfair Display",serif' }}>{t.name}</div>
                        {/* hover overlay */}
                        <div className="tpl-overlay">
                          <Link href="/signup" style={{ padding: '8px 18px', background: '#fff', color: '#4f46e5', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.78rem' }}>Use Template →</Link>
                        </div>
                      </div>
                      <div style={{ padding: '12px 14px' }}>
                        <div style={{ fontSize: '.73rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 8 }}>{t.desc}</div>
                        <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                          {(t.tags || []).map((tag: string) => (
                            <span key={tag} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                          ))}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))
        )}

        {templates.length > 0 && (
          <Reveal style={{ textAlign: 'center', marginTop: 36 }}>
            <Link href="/signup" className="btn-primary" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: '.95rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(79,70,229,.3)', display: 'inline-block' }}>
              Browse All {templates.length} Templates →
            </Link>
          </Reveal>
        )}
      </section>

      {/* ── FEATURES ── */}
      <section id="features" style={{ padding: '88px 6%', background: '#fff' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>What you get</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', letterSpacing: '-.02em' }}>Everything your business needs</h2>
          <div className="divider" />
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: '.93rem', maxWidth: 460, margin: '16px auto 0' }}>Simple tools that actually make a difference for local businesses</p>
        </Reveal>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(290px,1fr))', gap: 18, maxWidth: 1060, margin: '0 auto' }}>
          {features.map((f, i) => (
            <Reveal key={i} delay={i * 60}>
              <div className="card feat-card" style={{ padding: '26px', borderRadius: 14, background: f.color, border: `2px solid ${f.border}`, boxShadow: `0 4px 20px ${f.border}44`, height: '100%' }}>
                <div className="feat-icon" style={{ fontSize: '2rem', marginBottom: 12, width: 48, height: 48, background: `${f.border}33`, borderRadius: 12, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>{f.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '.95rem', marginBottom: 7, color: f.accent }}>{f.title}</div>
                <div style={{ color: '#6b7280', fontSize: '.84rem', lineHeight: 1.8 }}>{f.desc}</div>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── HOW TO SETUP WEBSITE ── */}
      <section style={{ padding: '88px 6%', background: '#FDF1F1' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#fef2f2', color: '#FF6B7A', marginBottom: 14 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', letterSpacing: '-.02em' }}>How To Setup Website</h2>
          <div className="divider" />
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: '.93rem', maxWidth: 500, margin: '16px auto 0' }}>Get your professional website live in just 4 simple steps</p>
        </Reveal>

        <div style={{ maxWidth: 1100, margin: '0 auto' }}>
          <div className="setup-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: 32, alignItems: 'start' }}>
            {[
              {
                step: '01',
                icon: '🛒',
                title: 'Create Templates',
                desc: 'Choose from 25+ professional templates designed for your business type. One-time payment, lifetime access.',
                color: '#FF6B7A',
                bgColor: '#fff5f5'
              },
              {
                step: '02',
                icon: '⚙️',
                title: 'Add Services',
                desc: 'Customize your template with your logo, colors, menu items, services, and business information.',
                color: '#4f46e5',
                bgColor: '#eef2ff'
              },
              {
                step: '03',
                icon: '🔧',
                title: 'Setup Website',
                desc: 'Configure WhatsApp ordering, SEO settings, analytics, and all the features you need for your business.',
                color: '#10b981',
                bgColor: '#ecfdf5'
              },
              {
                step: '04',
                icon: '🚀',
                title: 'Launch Website',
                desc: 'Go live instantly! Share your website link on social media, Google Maps, and start getting customers.',
                color: '#f59e0b',
                bgColor: '#fffbeb'
              }
            ].map((step, i) => (
              <Reveal key={i} delay={i * 100}>
                <div style={{
                  background: '#fff',
                  borderRadius: 20,
                  padding: '32px 28px',
                  textAlign: 'center',
                  border: `2px solid ${step.color}20`,
                  boxShadow: `0 8px 32px ${step.color}15`,
                  position: 'relative',
                  height: '100%',
                  display: 'flex',
                  flexDirection: 'column'
                }}>
                  {/* Step number */}
                  <div style={{
                    position: 'absolute',
                    top: -16,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: 32,
                    height: 32,
                    borderRadius: '50%',
                    background: step.color,
                    color: '#fff',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '.8rem',
                    fontWeight: 900,
                    boxShadow: `0 4px 16px ${step.color}40`
                  }}>
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div style={{
                    width: 64,
                    height: 64,
                    borderRadius: '50%',
                    background: step.bgColor,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '20px auto 20px',
                    border: `2px solid ${step.color}30`
                  }}>
                    {step.icon}
                  </div>

                  {/* Content */}
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
                    <h3 style={{
                      fontSize: '1.1rem',
                      fontWeight: 800,
                      color: '#111',
                      marginBottom: 12,
                      fontFamily: '"Playfair Display",serif'
                    }}>
                      {step.title}
                    </h3>
                    <p style={{
                      fontSize: '.88rem',
                      color: '#6b7280',
                      lineHeight: 1.7,
                      flex: 1
                    }}>
                      {step.desc}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          {/* CTA */}
          <Reveal style={{ textAlign: 'center', marginTop: 48 }}>
            <Link href="/signup" style={{
              display: 'inline-block',
              padding: '16px 36px',
              background: 'linear-gradient(135deg, #FF6B7A, #ff8a95)',
              color: '#fff',
              borderRadius: 12,
              textDecoration: 'none',
              fontSize: '1rem',
              fontWeight: 700,
              boxShadow: '0 8px 24px rgba(255,107,122,.3)',
              transition: 'all .25s ease'
            }}
              onMouseEnter={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(-2px)'
                el.style.boxShadow = '0 12px 32px rgba(255,107,122,.4)'
              }}
              onMouseLeave={e => {
                const el = e.currentTarget as HTMLElement
                el.style.transform = 'translateY(0)'
                el.style.boxShadow = '0 8px 24px rgba(255,107,122,.3)'
              }}
            >
              🚀 Start Building My Website
            </Link>
          </Reveal>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <HowItWorks />

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '88px 6%', background: '#FDF1F1' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>Pricing</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif' }}>Start free, grow at your pace</h2>
          <div className="divider" />
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: '.93rem' }}>No hidden fees. Cancel anytime.</p>

          {/* billing toggle */}
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 12, marginTop: 24, background: '#f1f5f9', borderRadius: 50, padding: '6px 8px' }}>
            <button onClick={() => setBillingYearly(false)} style={{ padding: '7px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.82rem', background: !billingYearly ? '#fff' : 'transparent', color: !billingYearly ? '#4f46e5' : '#6b7280', boxShadow: !billingYearly ? '0 2px 8px rgba(0,0,0,.08)' : 'none', transition: 'all .25s' }}>Monthly</button>
            <button onClick={() => setBillingYearly(true)} style={{ padding: '7px 20px', borderRadius: 50, border: 'none', cursor: 'pointer', fontWeight: 700, fontSize: '.82rem', background: billingYearly ? '#fff' : 'transparent', color: billingYearly ? '#4f46e5' : '#6b7280', boxShadow: billingYearly ? '0 2px 8px rgba(0,0,0,.08)' : 'none', transition: 'all .25s', display: 'flex', alignItems: 'center', gap: 6 }}>
              Yearly <span style={{ background: 'linear-gradient(135deg,#10b981,#059669)', color: '#fff', padding: '2px 8px', borderRadius: 50, fontSize: '.65rem', fontWeight: 800 }}>Save 33%</span>
            </button>
          </div>
        </Reveal>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(270px,1fr))', gap: 24, maxWidth: 940, margin: '0 auto', alignItems: 'center' }}>
          {pricingBase.map((p, i) => (
            <Reveal key={i} delay={i * 100}>
              <div className={`card${p.popular ? ' pro-card' : ''}`} style={{ borderRadius: 20, padding: '32px 28px', background: p.bg, border: `1.5px solid ${p.border}`, boxShadow: p.popular ? '0 20px 52px rgba(79,70,229,.28)' : '0 4px 16px rgba(0,0,0,.05)', position: 'relative', transform: p.popular ? 'scale(1.04)' : 'scale(1)' }}>
                {p.popular && (
                  <div style={{ position: 'absolute', top: -13, left: '50%', transform: 'translateX(-50%)', background: 'linear-gradient(135deg,#f59e0b,#f97316)', color: '#fff', padding: '4px 16px', borderRadius: 50, fontSize: '.68rem', fontWeight: 800, whiteSpace: 'nowrap', boxShadow: '0 4px 12px rgba(249,115,22,.4)' }}>
                    ⭐ Most Popular
                  </div>
                )}
                <div style={{ color: p.dark ? 'rgba(255,255,255,.55)' : '#9ca3af', fontSize: '.78rem', fontWeight: 600, marginBottom: 5, textTransform: 'uppercase', letterSpacing: '.06em' }}>{p.name}</div>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 3, marginBottom: 4 }}>
                  <span style={{ fontSize: '2.4rem', fontWeight: 900, color: p.dark ? '#fff' : '#111', fontFamily: '"Playfair Display",serif', lineHeight: 1, transition: 'all .3s' }}>
                    ₹{billingYearly ? p.yearlyPrice : p.monthlyPrice}
                  </span>
                  <span style={{ color: p.dark ? 'rgba(255,255,255,.45)' : '#9ca3af', fontSize: '.8rem' }}>{p.monthlyPrice === 0 ? 'Free forever' : p.sub}</span>
                </div>
                {billingYearly && p.monthlyPrice > 0 && (
                  <div style={{ fontSize: '.72rem', color: '#10b981', fontWeight: 700, marginBottom: 4 }}>
                    Save ₹{(p.monthlyPrice - p.yearlyPrice) * 12}/year
                  </div>
                )}
                <div style={{ height: 1, background: p.dark ? 'rgba(255,255,255,.12)' : '#f3f4f6', margin: '18px 0' }} />
                <div style={{ display: 'flex', flexDirection: 'column', gap: 10, marginBottom: 24 }}>
                  {p.features.map((f, j) => (
                    <div key={j} style={{ display: 'flex', alignItems: 'center', gap: 9, fontSize: '.84rem', color: p.dark ? 'rgba(255,255,255,.85)' : '#374151' }}>
                      <span style={{ color: p.dark ? '#a5f3fc' : '#10b981', fontWeight: 900, fontSize: '.9rem', flexShrink: 0 }}>✓</span>{f}
                    </div>
                  ))}
                </div>
                <Link href="/signup" className="btn-primary" style={{ display: 'block', textAlign: 'center', padding: '12px', background: p.popular ? 'rgba(255,255,255,.18)' : p.dark ? 'rgba(255,255,255,.1)' : 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '.88rem', border: p.dark ? '1.5px solid rgba(255,255,255,.25)' : 'none', boxShadow: !p.dark ? '0 4px 14px rgba(79,70,229,.3)' : 'none' }}>
                  {p.cta}
                </Link>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section style={{ padding: '88px 0', background: '#FDF1F1', overflow: 'hidden' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 44, padding: '0 6%' }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>Real stories</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', color: '#111' }}>Owners love Webrazeo</h2>
          <div className="divider" />
        </Reveal>
        <div style={{ overflow: 'hidden' }}>
          <div ref={testimonialScroll.wrapRef} className="scroll-wrap" style={{ overflow: 'hidden' }}>
            <div ref={testimonialScroll.trackRef} className="scroll-track" style={{ gap: 20, padding: '8px 24px' }}>
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="testi-card" style={{ background: '#fff', borderRadius: 18, padding: '26px', boxShadow: '0 4px 20px rgba(79,70,229,.08)', border: '1.5px solid #e0e7ff', flexShrink: 0, width: 320 }}>
                  <div style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: 12, letterSpacing: 2 }}>★★★★★</div>
                  <p style={{ color: '#374151', fontSize: '.87rem', lineHeight: 1.85, marginBottom: 20, fontStyle: 'italic' }}>"{t.text}"</p>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 11 }}>
                    <div style={{ width: 40, height: 40, background: t.avBg, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 800, fontSize: '.95rem', flexShrink: 0 }}>{t.av}</div>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '.86rem', color: '#111' }}>{t.name}</div>
                      <div style={{ color: '#9ca3af', fontSize: '.74rem', marginTop: 2 }}>{t.role}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA BANNER 1 ── */}
      <section style={{ padding: '28px 6%', background: '#FDF1F1' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: 'linear-gradient(120deg, #e8eeff 0%, #dbeafe 60%, #c7d2fe 100%)',
          borderRadius: 20,
          padding: '28px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          boxShadow: '0 4px 24px rgba(79,70,229,.10)',
          border: '1.5px solid rgba(99,102,241,.12)',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(.95rem,2vw,1.15rem)', color: '#1e1b4b', marginBottom: 6 }}>
              Launch Your Professional Website in Under 5 Minutes
            </div>
            <div style={{ color: '#4b5563', fontSize: '.88rem' }}>
              Pick a template, add your content, go live — no coding needed with Webrazeo.
            </div>
          </div>
          <Link href="/signup" style={{
            padding: '13px 28px',
            background: '#1e1b4b',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '.9rem',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(30,27,75,.25)',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = '#312e81' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = '#1e1b4b' }}
          >
            Start for Free →
          </Link>
        </div>
      </section>

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '88px 6%', background: '#FDF1F1' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>FAQ</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', color: '#111' }}>Common questions, honest answers</h2>
          <div className="divider" />
        </Reveal>
        <Reveal style={{ maxWidth: 680, margin: '0 auto', background: '#fff', borderRadius: 20, border: '1px solid #e5e7eb', overflow: 'hidden', boxShadow: '0 4px 24px rgba(79,70,229,.06)' }}>
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </Reveal>
      </section>

      {/* ── CTA BANNER 2 ── */}
      <section style={{ padding: '28px 6% 56px', background: '#FDF1F1' }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          background: 'linear-gradient(120deg, #f5f3ff 0%, #ede9fe 50%, #ddd6fe 100%)',
          borderRadius: 20,
          padding: '28px 36px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: 24,
          flexWrap: 'wrap',
          boxShadow: '0 4px 24px rgba(124,58,237,.10)',
          border: '1.5px solid rgba(124,58,237,.14)',
        }}>
          <div>
            <div style={{ fontWeight: 800, fontSize: 'clamp(.95rem,2vw,1.15rem)', color: '#3b0764', marginBottom: 6 }}>
              Already have a business? Bring it online today.
            </div>
            <div style={{ color: '#4b5563', fontSize: '.88rem' }}>
              Join 1,200+ restaurants, hotels & local businesses growing with Webrazeo.
            </div>
          </div>
          <Link href="/signup" style={{
            padding: '13px 28px',
            background: 'linear-gradient(135deg,#7c3aed,#4f46e5)',
            color: '#fff',
            borderRadius: 10,
            textDecoration: 'none',
            fontWeight: 700,
            fontSize: '.9rem',
            whiteSpace: 'nowrap',
            flexShrink: 0,
            boxShadow: '0 4px 14px rgba(124,58,237,.3)',
            transition: 'all .2s',
          }}
            onMouseEnter={e => { (e.currentTarget as HTMLElement).style.opacity = '.88' }}
            onMouseLeave={e => { (e.currentTarget as HTMLElement).style.opacity = '1' }}
          >
            Get Started Free →
          </Link>
        </div>
      </section>

      {/* ── LATEST BLOG SECTION ── */}
      <section id="blog" style={{ padding: '88px 6%', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        {/* Decorative blobs */}
        <div style={{ position: 'absolute', top: -80, right: -80, width: 350, height: 350, background: 'radial-gradient(circle,rgba(79,70,229,.07),transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -60, left: -60, width: 280, height: 280, background: 'radial-gradient(circle,rgba(236,72,153,.06),transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <Reveal style={{ maxWidth: 1100, margin: '0 auto', position: 'relative' }}>
          {/* Section Header */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
            <div>
              <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>Our Blog</div>
              <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', letterSpacing: '-.02em', color: '#111', marginBottom: 8 }}>Our Latest Blog</h2>
              <div className="divider" style={{ margin: 0 }} />
              <p style={{ color: '#6b7280', marginTop: 14, fontSize: '.93rem', maxWidth: 440 }}>Stay updated with tips, insights & stories to grow your business online</p>
            </div>
            <Link href="/blog" style={{ padding: '12px 26px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontWeight: 700, fontSize: '.88rem', boxShadow: '0 6px 20px rgba(79,70,229,.3)', whiteSpace: 'nowrap', display: 'inline-block' }}>
              View More →
            </Link>
          </div>

          {/* Blog Cards Grid */}
          {blogsLoading ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {[0, 1, 2].map(i => (
                <div key={i} style={{ borderRadius: 18, overflow: 'hidden', border: '1.5px solid #f0f0f0' }}>
                  <div style={{ height: 200, background: 'linear-gradient(90deg,#f0f0f0 25%,#e8e8e8 50%,#f0f0f0 75%)', backgroundSize: '200% 100%', animation: 'shimmer 1.5s infinite' }} />
                  <div style={{ padding: 22 }}>
                    <div style={{ height: 14, background: '#f0f0f0', borderRadius: 8, marginBottom: 12, width: '80%' }} />
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 8, marginBottom: 8, width: '100%' }} />
                    <div style={{ height: 12, background: '#f0f0f0', borderRadius: 8, width: '65%' }} />
                  </div>
                </div>
              ))}
            </div>
          ) : latestBlogs.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill,minmax(300px,1fr))', gap: 24 }}>
              {latestBlogs.map((blog, i) => <BlogCard key={blog._id} blog={blog} i={i} />)}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '64px 0', color: '#9ca3af' }}>
              <div style={{ fontSize: '3rem', marginBottom: 16 }}>📝</div>
              <div style={{ fontWeight: 700, fontSize: '1.1rem', marginBottom: 8, color: '#6b7280' }}>No blogs published yet</div>
              <p style={{ fontSize: '.88rem' }}>Admin is working on great content. Check back soon!</p>
            </div>
          )}
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 6%', background: 'linear-gradient(135deg,#FDF1F1 0%,#FFE5E5 50%,#FDF1F1 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', top: '-80px', left: '50%', transform: 'translateX(-50%)', width: 700, height: 700, background: 'radial-gradient(circle,rgba(129,140,248,.25),transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: '-60px', right: '-60px', width: 300, height: 300, background: 'radial-gradient(circle,rgba(236,72,153,.2),transparent 65%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <Reveal style={{ position: 'relative', zIndex: 1 }}>
          <div className="tag" style={{ background: 'rgba(99,102,241,.2)', color: '#a5b4fc', marginBottom: 18 }}>Get started today</div>
          <h2 style={{ fontSize: 'clamp(1.8rem,4vw,2.9rem)', fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display",serif', marginBottom: 16, lineHeight: 1.15 }}>
            Your customers are searching<br />for you online right now
          </h2>
          <p style={{ color: '#94a3b8', fontSize: '.97rem', maxWidth: 440, margin: '0 auto 32px', lineHeight: 1.85 }}>
            1,200+ restaurants, hotels and local businesses already have their store live. Join them — it takes less than 5 minutes.
          </p>
          <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
            <Link href="/signup" className="btn-primary" style={{ padding: '14px 36px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: '.97rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(79,70,229,.45)', display: 'inline-block' }}>
              Create My Free Store →
            </Link>
            <Link href="/login" className="btn-outline" style={{ padding: '14px 36px', background: 'rgba(255,255,255,.08)', color: '#e2e8f0', border: '1.5px solid rgba(255,255,255,.15)', borderRadius: 10, textDecoration: 'none', fontSize: '.97rem', fontWeight: 600, display: 'inline-block' }}>
              Log In
            </Link>
          </div>
          <p style={{ color: '#475569', fontSize: '.78rem', marginTop: 18 }}>No credit card · Free plan available · Cancel anytime</p>
        </Reveal>
      </section>

      {/* ── FOOTER ── */}
      <footer style={{ padding: '48px 6% 28px', background: '#1A1A1A', color: '#fff' }}>
        <div className="footer-grid" style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 36, maxWidth: 1100, margin: '0 auto', paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,.07)' }}>

          {/* Brand Column */}
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.15rem', fontFamily: '"Playfair Display",serif', marginBottom: 12 }}>
              Webra<span style={{ color: '#FF6B7A' }}>zeo</span>
            </div>
            <p style={{ color: '#9ca3af', fontSize: '.83rem', lineHeight: 1.8, maxWidth: 240, marginBottom: 20 }}>
              The easiest way for restaurants, hotels and local businesses to get online and grow with professional websites.
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              {[
                { icon: '📘', color: '#1877f2', label: 'Facebook' },
                { icon: '📸', color: '#e4405f', label: 'Instagram' },
                { icon: '🐦', color: '#1da1f2', label: 'Twitter' },
                { icon: '💼', color: '#0077b5', label: 'LinkedIn' }
              ].map((social, i) => (
                <a key={i} href="#" style={{
                  width: 36,
                  height: 36,
                  borderRadius: '50%',
                  background: `${social.color}20`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '.9rem',
                  textDecoration: 'none',
                  transition: 'all .2s',
                  border: `1px solid ${social.color}30`
                }}
                  onMouseEnter={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = social.color
                    el.style.transform = 'translateY(-2px)'
                  }}
                  onMouseLeave={e => {
                    const el = e.currentTarget as HTMLElement
                    el.style.background = `${social.color}20`
                    el.style.transform = 'translateY(0)'
                  }}
                  title={social.label}
                >
                  {social.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Useful Links Column */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '.75rem', color: '#e2e8f0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>Useful Links</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {[
                { label: 'Features', href: '#features' },
                { label: 'Templates', href: '#templates' },
                { label: 'Pricing', href: '#pricing' },
                { label: 'Blog', href: '/blog' },
                { label: 'Dashboard', href: '/dashboard' },
                { label: 'Admin Panel', href: '/admin' }
              ].map(link => (
                <a key={link.label} href={link.href} style={{
                  color: '#9ca3af',
                  textDecoration: 'none',
                  fontSize: '.83rem',
                  transition: 'color .18s',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6
                }}
                  onMouseEnter={e => (e.currentTarget.style.color = '#FF6B7A')}
                  onMouseLeave={e => (e.currentTarget.style.color = '#9ca3af')}
                >
                  <span style={{ fontSize: '.7rem', opacity: 0.6 }}>→</span>
                  {link.label}
                </a>
              ))}
            </div>
          </div>

          {/* Contact Us Column */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '.75rem', color: '#e2e8f0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>Contact Us</div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {[
                { icon: '📧', label: 'support@webrazeo.com', type: 'email' },
                { icon: '📞', label: '+91 98765 43210', type: 'phone' },
                { icon: '📍', label: 'Mumbai, India', type: 'location' },
                { icon: '💬', label: 'WhatsApp Support', type: 'whatsapp' }
              ].map((contact, i) => (
                <div key={i} style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 8,
                  color: '#9ca3af',
                  fontSize: '.83rem'
                }}>
                  <span style={{ fontSize: '.9rem', opacity: 0.8 }}>{contact.icon}</span>
                  <span>{contact.label}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Newsletter Column */}
          <div>
            <div style={{ fontWeight: 700, fontSize: '.75rem', color: '#e2e8f0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>Newsletter</div>
            <p style={{ color: '#9ca3af', fontSize: '.8rem', lineHeight: 1.6, marginBottom: 16 }}>
              Get tips, updates & exclusive offers for growing your business online.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              <input
                type="email"
                placeholder="Enter your email"
                style={{
                  padding: '10px 12px',
                  borderRadius: 8,
                  border: '1px solid #374151',
                  background: '#111827',
                  color: '#fff',
                  fontSize: '.8rem',
                  outline: 'none',
                  transition: 'border-color .2s'
                }}
                onFocus={e => (e.currentTarget.style.borderColor = '#FF6B7A')}
                onBlur={e => (e.currentTarget.style.borderColor = '#374151')}
              />
              <button style={{
                padding: '10px 16px',
                background: 'linear-gradient(135deg, #FF6B7A, #ff8a95)',
                color: '#fff',
                border: 'none',
                borderRadius: 8,
                fontSize: '.8rem',
                fontWeight: 700,
                cursor: 'pointer',
                transition: 'all .2s'
              }}
                onMouseEnter={e => (e.currentTarget.style.transform = 'translateY(-1px)')}
                onMouseLeave={e => (e.currentTarget.style.transform = 'translateY(0)')}
              >
                Subscribe 📧
              </button>
            </div>
          </div>
        </div>

        {/* Footer Bottom */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 22, maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ color: '#6b7280', fontSize: '.78rem' }}>
            © 2026 Webrazeo. All rights reserved. Made with ❤️ in India
          </div>
          <div style={{ display: 'flex', gap: 16, alignItems: 'center' }}>
            <Link href="/privacy" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.78rem', fontWeight: 600 }}>Privacy Policy</Link>
            <Link href="/terms" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.78rem', fontWeight: 600 }}>Terms of Service</Link>
            <Link href="/login" style={{ color: '#6b7280', textDecoration: 'none', fontSize: '.78rem', fontWeight: 600 }}>Log In</Link>
            <Link href="/signup" style={{ color: '#FF6B7A', textDecoration: 'none', fontSize: '.78rem', fontWeight: 700 }}>Sign Up Free</Link>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP ── */}
      {
        showBackTop && (
          <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top">↑</button>
        )
      }
    </div >
  )
}
