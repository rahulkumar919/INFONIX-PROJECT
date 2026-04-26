import re

# Read the file
with open('app/page.tsx', 'r', encoding='utf-8') as f:
    content = f.read()

# Find the hero section
hero_start = content.find('{/* ── HERO ── */')
hero_end = content.find('{/* ── CTA BANNER — After Hero ── */')

if hero_start == -1 or hero_end == -1:
    print('Could not find hero section markers')
    exit(1)

# New hero section
new_hero = '''      {/* ── HERO ── */}
      <section style={{ padding: '60px 4% 80px', background: '#fff', position: 'relative', overflow: 'hidden' }}>
        
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
                  src="https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=300&fit=crop" 
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
                  src="https://images.unsplash.com/photo-1551434678-e076c223a692?w=400&h=300&fit=crop" 
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
                  src="https://images.unsplash.com/photo-1557804506-669a67965ba0?w=400&h=300&fit=crop" 
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
                  src="https://images.unsplash.com/photo-1542744173-8e7e53415bb0?w=400&h=300&fit=crop" 
                  alt="Business Template 4"
                  style={{ width: '100%', height: '200px', objectFit: 'cover', display: 'block' }}
                />
              </div>
            </div>
          </Reveal>

        </div>
      </section>

      '''

# Replace
new_content = content[:hero_start] + new_hero + content[hero_end:]

# Write back
with open('app/page.tsx', 'w', encoding='utf-8') as f:
    f.write(new_content)

print('Hero section replaced successfully!')
