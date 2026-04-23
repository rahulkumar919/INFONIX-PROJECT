'use client'
import React, { useState } from 'react'

export default function HotelTemplate({ website, products }: any) {
  const { content } = website
  const accent = content.primaryColor || '#1e3a8a'
  const secondary = content.secondaryColor || '#f8fafc'
  const font = content.fontFamily || 'Inter'
  const btnText = content.buttonText || 'Book Now'

  const [activeTab, setActiveTab] = useState('All')
  const categories: string[] = ['All', ...Array.from(new Set(products.map((p: any) => p.category))) as string[]]

  // Dynamic Service Icons Mapping (Fallback)
  const serviceIcons: Record<string, string> = { 'Free WiFi':'📡', 'Parking':'🚗', 'Room Service':'🛋️', 'AC':'❄️', 'Swimming Pool':'🏊' };

  return (
    <div style={{ fontFamily: `"${font}", sans-serif`, background: secondary, color: '#111', scrollBehavior: 'smooth' }}>
      <link href={`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600;800&family=Montserrat:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap`} rel="stylesheet" />
      
      {/* Announcement Bar */}
      {content.announcement && (
        <div style={{ background: accent, color: '#fff', padding: '12px 20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', position: 'relative', zIndex: 1100 }}>
          {content.announcement}
        </div>
      )}

      {/* Modern Navigation */}
      <nav style={{ 
        padding: '0 8%', 
        height: 100, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: 'rgba(255,255,255,0.9)', 
        backdropFilter: 'blur(20px)',
        borderBottom: '1px solid rgba(0,0,0,0.02)'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {content.logo && <img src={content.logo} alt="Logo" style={{ height: 44, objectFit: 'contain' }} />}
          <h1 style={{ fontSize: '1.4rem', fontWeight: 900, color: '#1e293b', letterSpacing: '-0.02em' }}>{website.siteName}</h1>
        </div>
        <div style={{ display: 'flex', gap: 40, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.12em' }}>
          <a href="#rooms" style={{ color: '#64748b', textDecoration: 'none' }}>Accommodations</a>
          <a href="#about" style={{ color: '#64748b', textDecoration: 'none' }}>Heritage</a>
          <a href="#contact" style={{ color: accent, textDecoration: 'none', background: `${accent}15`, padding: '12px 24px', borderRadius: 8, transition: 'all 0.2s' }}>{btnText}</a>
        </div>
      </nav>

      {/* Cinematic Dramatic Hero */}
      <header style={{ 
        height: '95vh', 
        position: 'relative', 
        overflow: 'hidden',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: '#fff',
        textAlign: 'center'
      }}>
        <div style={{ 
          position: 'absolute', 
          inset: 0, 
          background: content.heroImage ? `url(${content.heroImage}) center/cover` : '#334155',
          transform: 'scale(1.02)',
          backgroundAttachment: 'fixed'
        }}></div>
        <div style={{ position: 'absolute', inset: 0, background: 'linear-gradient(rgba(15,23,42,0.4), rgba(15,23,42,0.6))' }}></div>
        
        <div style={{ position: 'relative', zIndex: 1, maxWidth: 1000, padding: '0 24px' }}>
          <div style={{ fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.6em', textTransform: 'uppercase', marginBottom: 32, opacity: 0.8 }}>REDEFINING LUXURY SINCE 2026</div>
          <h2 style={{ fontSize: 'clamp(2.5rem, 9vw, 5.5rem)', fontWeight: 900, fontFamily: '"Playfair Display", serif', marginBottom: 32, textShadow: '0 10px 30px rgba(0,0,0,0.3)' }}>
            {content.heroTitle}
          </h2>
          <p style={{ fontSize: '1.2rem', opacity: 0.9, lineHeight: 1.8, marginBottom: 56, maxWidth: 600, margin: '0 auto 56px' }}>
            {content.heroSubtitle}
          </p>
          <a href="#rooms" style={{ padding: '24px 64px', background: '#fff', color: '#0f172a', textDecoration: 'none', fontWeight: 900, fontSize: '0.9rem', borderRadius: 12, letterSpacing: '0.15em', textTransform: 'uppercase', boxShadow: '0 25px 60px rgba(0,0,0,0.2)' }}>Explore Sanctuary</a>
        </div>
      </header>

      {/* Floating Service Stats */}
      <section style={{ padding: '80px 8%', background: '#fff', display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 32, textAlign: 'center', marginTop: -100, position: 'relative', zIndex: 10, maxWidth: 1200, margin: '-100px auto 0', borderRadius: 24, boxShadow: '0 30px 100px rgba(0,0,0,0.06)' }}>
         {['120+ Rooms','8 Prime Suites','4 Cuisine Hubs','24/7 Support'].map((s, i) => (
            <div key={i} style={{ borderRight: i === 3 ? 'none' : '1px solid #f1f5f9' }}>
               <div style={{ fontSize: '1.4rem', fontWeight: 900, marginBottom: 8, color: accent }}>{s.split(' ')[0]}</div>
               <div style={{ fontSize: '0.75rem', fontWeight: 800, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.1em' }}>{s.split(' ').slice(1).join(' ')}</div>
            </div>
         ))}
      </section>

      {/* Curated Experience / Amenities */}
      <section style={{ padding: '120px 8%', display: 'flex', gap: 100, alignItems: 'center' }}>
         <div style={{ flex: 1 }}>
            <h3 style={{ fontSize: '3rem', fontWeight: 900, fontFamily: '"Playfair Display", serif', marginBottom: 24 }}>The Art of Sanctuary</h3>
            <p style={{ color: '#64748b', lineHeight: 1.9, fontSize: '1.1rem', marginBottom: 48 }}>{content.aboutText}</p>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 24 }}>
               {content.amenities?.split(',').map((a: string, i: number) => (
                 <div key={i} style={{ display: 'flex', alignItems: 'center', gap: 16, background: '#fff', padding: '16px 20px', borderRadius: 16, border: '1px solid #f1f5f9', boxShadow: '0 4px 12px rgba(0,0,0,0.01)' }}>
                   <span style={{ fontSize: '1.5rem' }}>{serviceIcons[a.trim()] || '✨'}</span>
                   <span style={{ fontSize: '0.85rem', fontWeight: 800, color: '#1e293b' }}>{a.trim()}</span>
                 </div>
               ))}
            </div>
         </div>
         <div style={{ flex: 1, position: 'relative' }}>
            <div style={{ width: '100%', height: 600, background: `url(${content.aboutImage || content.heroImage}) center/cover`, borderRadius: 32, boxShadow: '0 40px 100px rgba(0,0,0,0.1)' }}></div>
            <div style={{ position: 'absolute', bottom: -40, left: -40, background: accent, color: '#fff', padding: '40px', borderRadius: 24 }}>
               <div style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 8 }}>4.9/5</div>
               <div style={{ fontSize: '0.75rem', fontWeight: 700, opacity: 0.8, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Guest Rating</div>
            </div>
         </div>
      </section>

      {/* Living Collections (Products) */}
      <section id="rooms" style={{ padding: '120px 8%', background: '#fff' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 80 }}>
           <div>
              <h2 style={{ fontSize: '3.5rem', fontWeight: 900, fontFamily: '"Playfair Display", serif', marginBottom: 16 }}>The Accommodations</h2>
              <p style={{ color: '#64748b', fontSize: '1.1rem' }}>Sophisticated spaces designed for your utmost comfort.</p>
           </div>
           
           <div style={{ display: 'flex', gap: 8 }}>
            {categories.map((cat: string) => (
              <button key={cat} onClick={() => setActiveTab(cat)} style={{ 
                padding: '12px 24px', 
                background: activeTab === cat ? '#0f172a' : '#f8fafc', 
                color: activeTab === cat ? '#fff' : '#64748b', 
                border: 'none', 
                borderRadius: 12, 
                fontSize: '0.85rem', 
                fontWeight: 800, 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(400px, 1fr))', gap: 48 }}>
          {products.filter((p: any) => activeTab === 'All' || p.category === activeTab).map((p: any) => (
            <div key={p._id} style={{ background: '#fff', borderRadius: 40, border: '1px solid #f1f5f9', overflow: 'hidden', transition: 'transform 0.3s ease' }}>
              <div style={{ height: 440, position: 'relative' }}>
                <img src={p.image || 'https://images.unsplash.com/photo-1566073771259-6a8506099945'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                {p.badge && <div style={{ position: 'absolute', top: 32, left: 32, background: accent, color: '#fff', padding: '10px 24px', borderRadius: 12, fontSize: '0.75rem', fontWeight: 900 }}>{p.badge}</div>}
              </div>
              <div style={{ padding: 48 }}>
                 <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
                    <h3 style={{ fontSize: '2rem', fontWeight: 900, fontFamily: '"Playfair Display", serif' }}>{p.name}</h3>
                    <div style={{ fontSize: '1.5rem', fontWeight: 900, color: accent }}>₹{p.price.toLocaleString('en-IN')}<span style={{ fontSize: '0.8rem', color: '#94a3b8', fontWeight: 400 }}>/nt</span></div>
                 </div>
                 <p style={{ color: '#64748b', lineHeight: 1.9, fontSize: '1rem', marginBottom: 40, height: 100, overflow: 'hidden' }}>{p.description}</p>
                 <button 
                  onClick={() => window.open(`https://wa.me/${content.whatsappNumber}?text=Booking Inquiry for ${p.name}`, '_blank')}
                  style={{ width: '100%', padding: '24px', background: '#0f172a', color: '#fff', border: 'none', borderRadius: 20, fontSize: '0.95rem', fontWeight: 900, cursor: 'pointer', letterSpacing: '0.1em', boxShadow: '0 20px 40px rgba(0,0,0,0.1)' }}
                 >
                   RESERVE THIS SPACE
                 </button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Modern High-End Footer */}
      <footer id="contact" style={{ padding: '120px 8% 80px', background: '#0f172a', color: '#fff' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr', gap: 100, marginBottom: 120 }}>
           <div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 900, marginBottom: 40, letterSpacing: '-0.03em', fontFamily: '"Playfair Display", serif' }}>{website.siteName}</h2>
              <p style={{ color: 'rgba(255,255,255,0.6)', lineHeight: 2, fontSize: '1.1rem', maxWidth: 450 }}>{content.footerDesc}</p>
              <div style={{ display: 'flex', gap: 24, marginTop: 40 }}>
                 {content.socialLinks?.instagram && <a href={content.socialLinks.instagram} style={{ color: '#fff', fontSize: '1.2rem' }}>○</a>}
                 {content.socialLinks?.twitter && <a href={content.socialLinks.twitter} style={{ color: '#fff', fontSize: '1.2rem' }}>◇</a>}
                 {content.socialLinks?.facebook && <a href={content.socialLinks.facebook} style={{ color: '#fff', fontSize: '1.2rem' }}>▢</a>}
              </div>
           </div>
           <div>
              <h4 style={{ fontWeight: 800, marginBottom: 40, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Foundation</h4>
              <p style={{ fontSize: '1.2rem', fontWeight: 600, lineHeight: 1.8 }}>{content.contactAddress}</p>
              <div style={{ marginTop: 24 }}>
                 <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', marginBottom: 8 }}>Operational Since</div>
                 <div style={{ fontSize: '1rem', fontWeight: 800 }}>{content.openingHours}</div>
              </div>
           </div>
           <div>
              <h4 style={{ fontWeight: 800, marginBottom: 40, textTransform: 'uppercase', letterSpacing: '0.2em', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>Support Engine</h4>
              <p style={{ fontSize: '1.4rem', fontWeight: 900, color: accent }}>{content.contactPhone}</p>
              <p style={{ opacity: 0.6, marginTop: 12, wordBreak: 'break-all' }}>{content.contactEmail}</p>
              <button 
                onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
                style={{ marginTop: 40, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '16px 32px', borderRadius: 12, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 800 }}
              >
                TOP OF EXPERIENCE ↑
              </button>
           </div>
        </div>
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.75rem', fontWeight: 700, opacity: 0.4 }}>
           <div style={{ letterSpacing: '0.1em' }}>POWERED BY HOSPITALITY CORE TECHNOLOGY GROUP • 2026</div>
           <div style={{ display: 'flex', gap: 40 }}>
              <span>PRIVACY PROTOCOL</span>
              <span>TERMS OF ENGAGEMENT</span>
           </div>
        </div>
      </footer>
    </div>
  )
}
