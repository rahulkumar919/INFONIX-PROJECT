'use client'
import React, { useState } from 'react'

export default function RestaurantTemplate({ website, products }: any) {
  const { content } = website
  const accent = content.primaryColor || '#c2410c'
  const secondary = content.secondaryColor || '#f9f9f9'
  const font = content.fontFamily || 'Playfair Display'
  const btnText = content.buttonText || 'Reserve Table'

  const [activeTab, setActiveTab] = useState('All')
  const categories: string[] = ['All', ...Array.from(new Set(products.map((p: any) => p.category))) as string[]]

  return (
    <div style={{ fontFamily: `"${font}", serif`, background: '#fff', color: '#111', scrollBehavior: 'smooth' }}>
      <link href={`https://fonts.googleapis.com/css2?family=Playfair+Display:wght@400;700;900&family=Inter:wght@300;400;600;800&family=Montserrat:wght@400;700;900&family=Lora:ital,wght@0,400;0,700;1,400&display=swap`} rel="stylesheet" />
      
      {/* Announcement Bar */}
      {content.announcement && (
        <div style={{ background: accent, color: '#fff', padding: '12px 20px', textAlign: 'center', fontSize: '0.8rem', fontWeight: 800, letterSpacing: '0.1em', position: 'relative', zIndex: 1100 }}>
          {content.announcement}
        </div>
      )}

      {/* Glassmorphism Header */}
      <nav style={{ 
        padding: '0 6%', 
        height: 80, 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        position: 'sticky', 
        top: 0, 
        zIndex: 1000, 
        background: 'rgba(255,255,255,0.85)', 
        backdropFilter: 'blur(12px)',
        borderBottom: '1px solid rgba(0,0,0,0.05)'
      }}>
        <div style={{ fontSize: '1.6rem', fontWeight: 900, color: accent, letterSpacing: '-0.02em' }}>
          {content.logo ? <img src={content.logo} alt="Logo" style={{ height: 36, objectFit: 'contain' }} /> : website.siteName}
        </div>
        <div style={{ display: 'flex', gap: 32, fontSize: '0.75rem', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
          <a href="#menu" style={{ color: '#111', textDecoration: 'none' }}>Menu</a>
          <a href="#about" style={{ color: '#111', textDecoration: 'none' }}>Lore</a>
          <a href="#contact" style={{ color: accent, textDecoration: 'none', border: `1.5px solid ${accent}`, padding: '8px 20px', borderRadius: 4 }}>{btnText}</a>
        </div>
      </nav>

      {/* Dynamic Dramatic Hero */}
      <header style={{ 
        height: '92vh', 
        position: 'relative', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'center', 
        background: content.heroImage ? `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.5)), url(${content.heroImage})` : '#000',
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundAttachment: 'fixed',
        color: '#fff',
        textAlign: 'center',
        padding: '0 6%'
      }}>
        <div style={{ maxWidth: 900 }}>
          <div style={{ fontSize: '0.9rem', fontWeight: 700, letterSpacing: '0.4em', marginBottom: 24, textTransform: 'uppercase', opacity: 0.8 }}>ESTABLISHED 2026</div>
          <h1 style={{ fontSize: 'clamp(2.5rem, 10vw, 6.5rem)', fontWeight: 900, marginBottom: 24, lineHeight: 1.05 }}>
            {content.heroTitle}
          </h1>
          <p style={{ fontSize: 'clamp(1rem, 2.5vw, 1.4rem)', fontWeight: 400, marginBottom: 44, opacity: 0.9, maxWidth: 600, margin: '0 auto 44px', lineHeight: 1.8 }}>
            {content.heroSubtitle}
          </p>
          <div style={{ display: 'flex', gap: 20, justifyContent: 'center' }}>
            <a href="#menu" style={{ padding: '20px 48px', background: accent, color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', borderRadius: 2, letterSpacing: '0.2em', textTransform: 'uppercase', transition: 'transform 0.2s' }}>View Menu</a>
            <a href="#contact" style={{ padding: '20px 48px', background: 'transparent', border: '2px solid #fff', color: '#fff', textDecoration: 'none', fontWeight: 800, fontSize: '0.9rem', borderRadius: 2, letterSpacing: '0.2em', textTransform: 'uppercase' }}>Book Now</a>
          </div>
        </div>
      </header>

      {/* Service Highlights */}
      <section style={{ padding: '40px 6%', background: secondary, display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 64, borderBottom: '1px solid #eee' }}>
         <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Operational Hours</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{content.openingHours}</div>
         </div>
         <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Location</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{content.contactAddress.split(',')[0]}</div>
         </div>
         <div style={{ textAlign: 'center' }}>
            <div style={{ fontSize: '0.65rem', fontWeight: 800, color: '#999', textTransform: 'uppercase', letterSpacing: '0.2em', marginBottom: 8 }}>Support Dial</div>
            <div style={{ fontSize: '1rem', fontWeight: 700 }}>{content.contactPhone}</div>
         </div>
      </section>

      {/* Category-Filtered Menu */}
      <section id="menu" style={{ padding: '120px 6%', background: '#fff' }}>
        <div style={{ textAlign: 'center', marginBottom: 80 }}>
          <h2 style={{ fontSize: '3.5rem', fontWeight: 900, marginBottom: 16 }}>The Culinary Menu</h2>
          <div style={{ width: 80, height: 4, background: accent, margin: '0 auto 40px' }}></div>
          
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, flexWrap: 'wrap' }}>
            {categories.map((cat: string) => (
              <button key={cat} onClick={() => setActiveTab(cat)} style={{ 
                padding: '10px 24px', 
                background: activeTab === cat ? accent : 'transparent', 
                color: activeTab === cat ? '#fff' : '#444', 
                border: activeTab === cat ? 'none' : '1px solid #ddd', 
                borderRadius: 50, 
                fontSize: '0.85rem', 
                fontWeight: 700, 
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}>
                {cat}
              </button>
            ))}
          </div>
        </div>
        
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: 48 }}>
          {products.filter((p: any) => activeTab === 'All' || p.category === activeTab).map((p: any) => (
            <div key={p._id} style={{ display: 'flex', gap: 20, alignItems: 'flex-start', paddingBottom: 24, borderBottom: '1px solid #f2f2f2' }}>
              <div style={{ width: 100, height: 100, background: '#eee', borderRadius: 12, overflow: 'hidden', flexShrink: 0 }}>
                <img src={p.image || 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c'} alt={p.name} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 800 }}>{p.name}</h3>
                  <span style={{ fontWeight: 800, color: accent }}>₹{p.price}</span>
                </div>
                <p style={{ fontSize: '0.85rem', color: '#666', lineHeight: 1.6, fontFamily: 'Inter, sans-serif' }}>{p.description}</p>
                <div style={{ marginTop: 12, display: 'flex', gap: 8 }}>
                   {p.badge && <span style={{ background: accent + '10', color: accent, padding: '2px 8px', fontSize: '0.65rem', fontWeight: 800, borderRadius: 4 }}>{p.badge}</span>}
                   <button onClick={() => window.open(`https://wa.me/${content.whatsappNumber}?text=Reserve: ${p.name}`, '_blank')} 
                    style={{ background: 'none', border: 'none', color: '#111', fontSize: '0.75rem', fontWeight: 800, cursor: 'pointer', textDecoration: 'underline' }}>Order Now →</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Immersive About */}
      <section id="about" style={{ padding: '0 6%', display: 'flex', gap: 0, height: '80vh', overflow: 'hidden' }}>
         <div style={{ flex: 1, padding: '10% 8% 10% 0', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
            <div style={{ fontSize: '0.75rem', fontWeight: 800, color: accent, textTransform: 'uppercase', letterSpacing: '0.3em', marginBottom: 20 }}>Philosophy</div>
            <h2 style={{ fontSize: '3rem', fontWeight: 900, marginBottom: 32 }}>{content.aboutTitle}</h2>
            <p style={{ fontSize: '1.2rem', lineHeight: 1.9, color: '#444', fontFamily: 'Inter, sans-serif' }}>
              {content.aboutText}
            </p>
         </div>
         <div style={{ flex: 1, background: `url(${content.aboutImage || content.heroImage}) center/cover`, display: 'flex', alignItems: 'flex-end', padding: 60 }}>
            <div style={{ background: 'rgba(255,255,255,0.95)', padding: '32px 48px', borderRadius: 2 }}>
               <div style={{ fontSize: '2.5rem', fontWeight: 900, color: accent }}>94%</div>
               <div style={{ fontSize: '0.7rem', fontWeight: 700, color: '#999', textTransform: 'uppercase', letterSpacing: '0.1em' }}>Guest Satisfaction Score</div>
            </div>
         </div>
      </section>

      {/* Dynamic Grid Footer */}
      <footer id="contact" style={{ padding: '120px 6% 80px', background: secondary }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr 1fr 1fr', gap: 64, borderBottom: '1px solid #ddd', paddingBottom: 80 }}>
           <div>
              <div style={{ fontSize: '1.8rem', fontWeight: 900, marginBottom: 24, letterSpacing: '-0.02em' }}>{website.siteName}</div>
              <p style={{ color: '#666', lineHeight: 1.8, fontSize: '0.95rem' }}>{content.footerDesc}</p>
           </div>
           <div>
              <h4 style={{ fontWeight: 800, marginBottom: 24, fontSize: '0.75rem', textTransform: 'uppercase' }}>Navigation</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12, fontSize: '0.9rem' }}>
                <a href="#menu" style={{ color: '#444', textDecoration: 'none' }}>Our Menu</a>
                <a href="#about" style={{ color: '#444', textDecoration: 'none' }}>About Lore</a>
                <a href="#contact" style={{ color: '#444', textDecoration: 'none' }}>Reservations</a>
              </div>
           </div>
           <div>
              <h4 style={{ fontWeight: 800, marginBottom: 24, fontSize: '0.75rem', textTransform: 'uppercase' }}>Contact</h4>
              <div style={{ color: '#666', fontSize: '0.9rem', lineHeight: 1.8 }}>
                 {content.contactAddress}<br/>
                 T: {content.contactPhone}<br/>
                 E: {content.contactEmail}
              </div>
           </div>
           <div>
              <h4 style={{ fontWeight: 800, marginBottom: 24, fontSize: '0.75rem', textTransform: 'uppercase' }}>Aura</h4>
              <div style={{ display: 'flex', gap: 16 }}>
                 {content.socialLinks?.instagram && <a href={content.socialLinks.instagram} style={{ color: accent, fontSize: '1.2rem' }}>○</a>}
                 {content.socialLinks?.twitter && <a href={content.socialLinks.twitter} style={{ color: accent, fontSize: '1.2rem' }}>◇</a>}
                 {content.socialLinks?.facebook && <a href={content.socialLinks.facebook} style={{ color: accent, fontSize: '1.2rem' }}>▢</a>}
              </div>
           </div>
        </div>
        <div style={{ paddingTop: 40, display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: '#999', fontSize: '0.8rem' }}>
           <div>CREATED BY HOSPITALITY CORE ENGINE • 2026</div>
           <div style={{ display: 'flex', gap: 32 }}>
              <span style={{ cursor: 'pointer' }}>PRIVACY</span>
              <span style={{ cursor: 'pointer' }}>TERMS</span>
           </div>
        </div>
      </footer>
    </div>
  )
}
