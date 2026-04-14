'use client'
import Link from 'next/link'
import { useCallback, useEffect, useRef, useState } from 'react'
import { ALL_TEMPLATES } from '../lib/templates'
import MobileNav from '../components/MobileNav'

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
    { name: 'Pro', monthlyPrice: 299, yearlyPrice: 199, sub: '/month', popular: true, dark: true, bg: 'linear-gradient(145deg,#4f46e5,#7c3aed)', border: 'none', features: ['5 Stores', 'Unlimited Items', 'All 25 Templates', 'Custom Colors & Logo', 'SEO Tools', 'Visitor Analytics', 'Priority Support', 'Remove Branding'], cta: 'Get Pro' },
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

  const scrollTemplates = [...ALL_TEMPLATES, ...ALL_TEMPLATES]

  const navLinks: [string, string][] = [['Features', '#features'], ['Templates', '#templates'], ['How it Works', '#how'], ['Pricing', '#pricing']]

  return (
    <div style={{ fontFamily: "'Inter',system-ui,sans-serif", background: '#fff', color: '#111', overflowX: 'hidden' }}>

      {/* ── NAV ── */}
      <MobileNav navLinks={navLinks} activeSection={activeSection} navScrolled={navScrolled} />

      {/* ── HERO ── */}
      <section style={{ padding: '140px 6% 100px', background: 'linear-gradient(135deg,#eef2ff 0%,#fdf4ff 35%,#fff1f2 65%,#f0fdf4 100%)', position: 'relative', overflow: 'hidden', textAlign: 'center' }}>
        {/* animated particles */}
        {[
          { w: 12, h: 12, top: '12%', left: '6%', bg: '#4f46e5', dur: '6s', delay: '0s' },
          { w: 8, h: 8, top: '20%', left: '90%', bg: '#ec4899', dur: '8s', delay: '1s' },
          { w: 16, h: 16, top: '55%', left: '4%', bg: '#7c3aed', dur: '7s', delay: '2s' },
          { w: 10, h: 10, top: '65%', left: '93%', bg: '#f97316', dur: '9s', delay: '0.5s' },
          { w: 6, h: 6, top: '35%', left: '96%', bg: '#ec4899', dur: '5s', delay: '3s' },
          { w: 14, h: 14, top: '78%', left: '12%', bg: '#4f46e5', dur: '7s', delay: '1.5s' },
          { w: 9, h: 9, top: '45%', left: '2%', bg: '#10b981', dur: '8s', delay: '2.5s' },
          { w: 7, h: 7, top: '88%', left: '85%', bg: '#f59e0b', dur: '6s', delay: '0.8s' },
        ].map((p, i) => (
          <div key={i} className="particle" style={{ width: p.w, height: p.h, top: p.top, left: p.left, background: p.bg, opacity: .7, animationDuration: p.dur, animationDelay: p.delay, position: 'absolute', borderRadius: '50%', pointerEvents: 'none', animation: `particleFloat ${p.dur} ${p.delay} ease-in-out infinite` }} />
        ))}
        {/* bg blobs */}
        <div style={{ position: 'absolute', top: -120, right: -80, width: 500, height: 500, background: 'radial-gradient(circle,rgba(79,70,229,.18),transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', bottom: -100, left: -80, width: 400, height: 400, background: 'radial-gradient(circle,rgba(236,72,153,.14),transparent 68%)', borderRadius: '50%', pointerEvents: 'none' }} />
        <div style={{ position: 'absolute', top: '40%', left: '50%', transform: 'translateX(-50%)', width: 600, height: 300, background: 'radial-gradient(ellipse,rgba(124,58,237,.08),transparent 70%)', borderRadius: '50%', pointerEvents: 'none' }} />

        <div style={{ maxWidth: 800, margin: '0 auto', position: 'relative', zIndex: 1 }}>
          <Reveal>
            <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 24 }}>
              <span className="blink" style={{ display: 'inline-block', width: 7, height: 7, background: '#4f46e5', borderRadius: '50%', marginRight: 7, verticalAlign: 'middle' }} />
              Built for Restaurants, Hotels &amp; Local Businesses
            </div>
          </Reveal>

          <Reveal delay={100}>
            <h1 style={{ fontSize: 'clamp(2.6rem,5.5vw,4.4rem)', fontWeight: 900, lineHeight: 1.08, marginBottom: 22, letterSpacing: '-.04em', fontFamily: '"Playfair Display",serif' }}>
              Your business online<br />
              <TypeWriter words={['in 5 minutes', 'without coding', 'with WhatsApp orders', 'for free']} />
            </h1>
          </Reveal>

          <Reveal delay={200}>
            <p style={{ fontSize: '1.1rem', color: '#4b5563', lineHeight: 1.9, marginBottom: 40, maxWidth: 560, margin: '0 auto 40px' }}>
              Build a beautiful website for your restaurant, hotel, pharmacy, salon or any local business. Add your menu, set prices, and let customers order via WhatsApp — <strong>no coding needed.</strong>
            </p>
          </Reveal>

          <Reveal delay={300}>
            <div style={{ display: 'flex', gap: 14, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 32 }}>
              <Link href="/signup" className="btn-primary" style={{ padding: '15px 38px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 12, textDecoration: 'none', fontSize: '1.02rem', fontWeight: 700, boxShadow: '0 8px 24px rgba(79,70,229,.38)', display: 'inline-block' }}>
                Create My Store — Free →
              </Link>
              <Link href="/store/demo" className="btn-outline" style={{ padding: '15px 38px', background: '#fff', color: '#111', border: '1.5px solid #d1d5db', borderRadius: 12, textDecoration: 'none', fontSize: '1.02rem', fontWeight: 600, display: 'inline-block' }}>
                See a Live Example
              </Link>
            </div>
          </Reveal>

          <Reveal delay={400}>
            <div style={{ display: 'flex', gap: 24, flexWrap: 'wrap', justifyContent: 'center', marginBottom: 52 }}>
              {['No credit card needed', 'Free plan available', 'Live in under 5 minutes'].map(t => (
                <span key={t} style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: '.84rem', color: '#6b7280', fontWeight: 500 }}>
                  <span style={{ color: '#10b981', fontWeight: 900, fontSize: '1rem' }}>✓</span>{t}
                </span>
              ))}
            </div>
          </Reveal>

          <Reveal delay={500}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12, flexWrap: 'wrap' }}>
              {[{ icon: '🍴', label: 'Restaurants' }, { icon: '🏨', label: 'Hotels' }, { icon: '💊', label: 'Pharmacies' }, { icon: '💪', label: 'Gyms' }, { icon: '💅', label: 'Salons' }, { icon: '🏥', label: 'Clinics' }].map(b => (
                <div key={b.label} style={{ display: 'flex', alignItems: 'center', gap: 7, padding: '8px 16px', background: 'rgba(255,255,255,0.75)', borderRadius: 50, border: '1px solid #e5e7eb', fontSize: '.8rem', fontWeight: 600, color: '#374151', backdropFilter: 'blur(8px)', transition: 'all .2s' }}
                  onMouseEnter={e => { (e.currentTarget as HTMLDivElement).style.background = '#fff'; (e.currentTarget as HTMLDivElement).style.borderColor = '#c7d2fe' }}
                  onMouseLeave={e => { (e.currentTarget as HTMLDivElement).style.background = 'rgba(255,255,255,0.75)'; (e.currentTarget as HTMLDivElement).style.borderColor = '#e5e7eb' }}>
                  <span style={{ fontSize: '1rem' }}>{b.icon}</span>{b.label}
                </div>
              ))}
            </div>
          </Reveal>

          {/* scroll down arrow */}
          <Reveal delay={600}>
            <div style={{ marginTop: 48, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 6, color: '#9ca3af', fontSize: '.75rem', fontWeight: 500 }}>
              <span>Scroll to explore</span>
              <div style={{ width: 24, height: 24, border: '2px solid #d1d5db', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'floatY 2s ease-in-out infinite' }}>↓</div>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── STATS ── */}
      <div ref={statsRef} style={{ background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 50%,#1e1b4b 100%)', padding: '52px 6%', position: 'relative', overflow: 'hidden' }}>
        <div style={{ position: 'absolute', inset: 0, background: 'radial-gradient(ellipse at 50% 50%,rgba(99,102,241,.3),transparent 70%)', pointerEvents: 'none' }} />
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 20, maxWidth: 900, margin: '0 auto', textAlign: 'center', position: 'relative', zIndex: 1 }}>
          {[
            { val: stores, suf: '+', label: 'Stores Created', icon: '🏪', pct: stores / 12 },
            { val: products, suf: '+', label: 'Menu Items Added', icon: '🍽️', pct: products / 180 },
            { val: views, suf: 'K+', label: 'Monthly Visitors', icon: '👁️', pct: views / 5 },
            { val: uptime, suf: '%', label: 'Uptime Guaranteed', icon: '⚡', pct: uptime },
          ].map((s, i) => (
            <div key={i} style={{ animation: statsVisible ? `popIn .5s ease ${i * 120}ms both` : 'none' }}>
              <div style={{ fontSize: '1.6rem', marginBottom: 6 }}>{s.icon}</div>
              <div style={{ fontSize: 'clamp(1.6rem,3vw,2.3rem)', fontWeight: 900, color: '#fff', fontFamily: '"Playfair Display",serif', lineHeight: 1 }}>
                {s.val.toLocaleString()}{s.suf}
              </div>
              <div style={{ fontSize: '.78rem', color: '#c7d2fe', marginTop: 5, fontWeight: 500, marginBottom: 10 }}>{s.label}</div>
              {/* progress bar */}
              <div style={{ height: 4, background: 'rgba(255,255,255,.15)', borderRadius: 2, overflow: 'hidden' }}>
                <div style={{ height: '100%', background: 'linear-gradient(90deg,#818cf8,#ec4899)', borderRadius: 2, width: statsVisible ? `${Math.min(s.pct, 100)}%` : '0%', transition: 'width 2s cubic-bezier(.4,0,.2,1)' }} />
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
              <span key={i} style={{ color: '#fff', fontSize: '.78rem', fontWeight: 700, letterSpacing: '.07em', padding: '0 24px', whiteSpace: 'nowrap' }}>{t} &nbsp;·</span>
            ))}
          </div>
        </div>
      </div>

      {/* ── TEMPLATES ── */}
      <section id="templates" style={{ padding: '88px 0', background: '#fafafa', overflow: 'hidden' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 44, padding: '0 6%' }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>25 Templates</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif', letterSpacing: '-.02em' }}>A template for every business</h2>
          <div className="divider" />
          <p style={{ color: '#6b7280', marginTop: 16, fontSize: '.93rem', maxWidth: 500, margin: '16px auto 0' }}>From restaurants to pharmacies, gyms to portfolios — pick a template and go live in minutes</p>
        </Reveal>

        {[tplRow1, tplRow2].map((row, ri) => (
          <div key={ri} style={{ overflow: 'hidden', marginBottom: ri === 0 ? 16 : 0 }}>
            <div ref={row.wrapRef} className="scroll-wrap" style={{ overflow: 'hidden' }}>
              <div ref={row.trackRef} className="scroll-track" style={{ gap: 16, padding: '8px 24px' }}>
                {scrollTemplates.slice(0, 50).map((t, i) => (
                  <div key={i} className="tpl-card">
                    <div style={{ height: 130, background: t.color, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#fff', position: 'relative', padding: 16 }}>
                      {t.popular && <div style={{ position: 'absolute', top: 8, right: 8, background: 'rgba(245,158,11,.9)', color: '#fff', padding: '2px 8px', borderRadius: 50, fontSize: '.58rem', fontWeight: 800, animation: 'blink 2s ease-in-out infinite' }}>🔥 Popular</div>}
                      <div style={{ position: 'absolute', top: 10, left: 12, background: 'rgba(255,255,255,.2)', padding: '2px 10px', borderRadius: 50, fontSize: '.6rem', fontWeight: 700 }}>{t.category}</div>
                      <div style={{ fontSize: '2.4rem', marginBottom: 6 }}>{t.icon}</div>
                      <div style={{ fontWeight: 800, fontSize: '.82rem', textAlign: 'center', fontFamily: '"Playfair Display",serif' }}>{t.name}</div>
                      {/* hover overlay */}
                      <div className="tpl-overlay">
                        <Link href="/signup" style={{ padding: '8px 18px', background: '#fff', color: '#4f46e5', borderRadius: 8, textDecoration: 'none', fontWeight: 700, fontSize: '.78rem' }}>Use Template →</Link>
                      </div>
                    </div>
                    <div style={{ padding: '12px 14px' }}>
                      <div style={{ fontSize: '.73rem', color: '#6b7280', lineHeight: 1.6, marginBottom: 8 }}>{t.desc}</div>
                      <div style={{ display: 'flex', gap: 4, flexWrap: 'wrap' }}>
                        {t.tags.map(tag => (
                          <span key={tag} style={{ fontSize: '.6rem', fontWeight: 700, padding: '2px 8px', borderRadius: 50, background: '#f0f0ff', color: '#4f46e5' }}>{tag}</span>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}

        <Reveal style={{ textAlign: 'center', marginTop: 36 }}>
          <Link href="/signup" className="btn-primary" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: '.95rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(79,70,229,.3)', display: 'inline-block' }}>
            Browse All 25 Templates →
          </Link>
        </Reveal>
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

      {/* ── HOW IT WORKS ── */}
      <section id="how" style={{ padding: '88px 6%', background: 'linear-gradient(135deg,#f5f3ff 0%,#ede9fe 50%,#fdf4ff 100%)' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>How it works</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif' }}>Go live in 3 simple steps</h2>
          <div className="divider" />
        </Reveal>

        <div style={{ position: 'relative', display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(260px,1fr))', gap: 24, maxWidth: 900, margin: '0 auto 40px' }}>
          {/* connecting dotted line */}
          <div style={{ position: 'absolute', top: 18, left: '16%', right: '16%', height: 2, background: 'repeating-linear-gradient(90deg,#c7d2fe 0,#c7d2fe 8px,transparent 8px,transparent 16px)', zIndex: 0, display: 'none' }} />

          {steps.map((s, i) => (
            <Reveal key={i} delay={i * 120}>
              <div onClick={() => setActiveStep(i)} className={`step-card card${activeStep === i ? ' step-active' : ''}`}
                style={{ textAlign: 'center', padding: '44px 24px 32px', background: '#fff', borderRadius: 20, boxShadow: '0 4px 18px rgba(0,0,0,.05)', position: 'relative', border: activeStep === i ? `2px solid ${s.color}` : '2px solid transparent' }}>
                <div style={{ position: 'absolute', top: -18, left: '50%', transform: activeStep === i ? 'translateX(-50%) scale(1.15)' : 'translateX(-50%) scale(1)', width: 36, height: 36, background: `linear-gradient(135deg,${s.color},${s.color}cc)`, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 900, fontSize: '.8rem', boxShadow: `0 4px 12px ${s.color}55`, transition: 'transform .3s' }}>
                  {s.n}
                </div>
                <div style={{ fontSize: '2.6rem', marginBottom: 12, marginTop: 4, transition: 'transform .3s', transform: activeStep === i ? 'scale(1.1)' : 'scale(1)' }}>{s.icon}</div>
                <div style={{ fontWeight: 800, fontSize: '1rem', marginBottom: 10, color: '#111' }}>{s.title}</div>
                <div style={{ color: '#6b7280', fontSize: '.84rem', lineHeight: 1.8, marginBottom: 14 }}>{s.desc}</div>
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, background: activeStep === i ? `${s.color}15` : '#f9fafb', color: activeStep === i ? s.color : '#9ca3af', padding: '5px 12px', borderRadius: 50, fontSize: '.72rem', fontWeight: 700, transition: 'all .3s' }}>
                  ⏱ {s.detail}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        <Reveal style={{ textAlign: 'center' }}>
          <Link href="/signup" className="btn-primary" style={{ padding: '13px 32px', background: 'linear-gradient(135deg,#4f46e5,#7c3aed)', color: '#fff', borderRadius: 10, textDecoration: 'none', fontSize: '.95rem', fontWeight: 700, boxShadow: '0 6px 20px rgba(79,70,229,.3)', display: 'inline-block' }}>
            Start Building Now — It's Free →
          </Link>
        </Reveal>
      </section>

      {/* ── PRICING ── */}
      <section id="pricing" style={{ padding: '88px 6%', background: '#fff' }}>
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
      <section style={{ padding: '88px 0', background: 'linear-gradient(135deg,#f0f9ff 0%,#e0f2fe 50%,#f0fdf4 100%)', overflow: 'hidden' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 44, padding: '0 6%' }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>Real stories</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif' }}>Owners love HospitalityCore</h2>
          <div className="divider" />
        </Reveal>
        <div style={{ overflow: 'hidden' }}>
          <div ref={testimonialScroll.wrapRef} className="scroll-wrap" style={{ overflow: 'hidden' }}>
            <div ref={testimonialScroll.trackRef} className="scroll-track" style={{ gap: 20, padding: '8px 24px' }}>
              {[...testimonials, ...testimonials, ...testimonials].map((t, i) => (
                <div key={i} className="testi-card" style={{ background: '#fff', borderRadius: 18, padding: '26px', boxShadow: '0 4px 18px rgba(0,0,0,.06)', border: '1.5px solid #f0f0f0', flexShrink: 0, width: 320 }}>
                  <div style={{ color: '#f59e0b', fontSize: '1rem', marginBottom: 12, letterSpacing: 2, background: 'linear-gradient(90deg,#f59e0b,#fbbf24,#f97316)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent', backgroundClip: 'text', backgroundSize: '200% auto', animation: 'shimmer 2s linear infinite' }}>★★★★★</div>
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

      {/* ── FAQ ── */}
      <section id="faq" style={{ padding: '88px 6%', background: '#fff' }}>
        <Reveal style={{ textAlign: 'center', marginBottom: 52 }}>
          <div className="tag" style={{ background: '#eef2ff', color: '#4f46e5', marginBottom: 14 }}>FAQ</div>
          <h2 style={{ fontSize: 'clamp(1.7rem,3vw,2.5rem)', fontWeight: 900, fontFamily: '"Playfair Display",serif' }}>Common questions, honest answers</h2>
          <div className="divider" />
        </Reveal>
        <Reveal style={{ maxWidth: 660, margin: '0 auto' }}>
          {faqs.map((f, i) => <FaqItem key={i} q={f.q} a={f.a} />)}
        </Reveal>
      </section>

      {/* ── CTA ── */}
      <section style={{ padding: '88px 6%', background: 'linear-gradient(135deg,#1e1b4b 0%,#312e81 40%,#4c1d95 70%,#1e1b4b 100%)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
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
      <footer style={{ padding: '48px 6% 28px', background: '#0a0f1e', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.8fr 1fr 1fr 1fr', gap: 36, maxWidth: 1100, margin: '0 auto', paddingBottom: 36, borderBottom: '1px solid rgba(255,255,255,.07)' }}>
          <div>
            <div style={{ fontWeight: 900, fontSize: '1.15rem', fontFamily: '"Playfair Display",serif', marginBottom: 12 }}>Hospitality<span style={{ color: '#818cf8' }}>Core</span></div>
            <p style={{ color: '#64748b', fontSize: '.83rem', lineHeight: 1.8, maxWidth: 240 }}>The easiest way for restaurants, hotels and local businesses to get online and grow.</p>
          </div>
          {[
            { title: 'Product', links: ['Features', 'Templates', 'Pricing', 'Dashboard'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Use', 'Cookies'] },
          ].map((col, i) => (
            <div key={i}>
              <div style={{ fontWeight: 700, fontSize: '.75rem', color: '#e2e8f0', letterSpacing: '.08em', textTransform: 'uppercase', marginBottom: 16 }}>{col.title}</div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                {col.links.map(l => (
                  <a key={l} href="#" style={{ color: '#64748b', textDecoration: 'none', fontSize: '.83rem', transition: 'color .18s' }}
                    onMouseEnter={e => (e.currentTarget.style.color = '#818cf8')}
                    onMouseLeave={e => (e.currentTarget.style.color = '#64748b')}>{l}</a>
                ))}
              </div>
            </div>
          ))}
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 22, maxWidth: 1100, margin: '0 auto', flexWrap: 'wrap', gap: 12 }}>
          <div style={{ color: '#334155', fontSize: '.78rem' }}>© 2026 HospitalityCore. All rights reserved.</div>
          <div style={{ display: 'flex', gap: 16 }}>
            <Link href="/login" style={{ color: '#334155', textDecoration: 'none', fontSize: '.78rem', fontWeight: 600 }}>Log In</Link>
            <Link href="/signup" style={{ color: '#818cf8', textDecoration: 'none', fontSize: '.78rem', fontWeight: 700 }}>Sign Up Free</Link>
          </div>
        </div>
      </footer>

      {/* ── BACK TO TOP ── */}
      {showBackTop && (
        <button className="back-top" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} title="Back to top">↑</button>
      )}
    </div>
  )
}
