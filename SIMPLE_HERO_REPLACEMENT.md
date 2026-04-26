# Simple Hero Section Replacement

## Instructions (Hindi)
1. Open `files/webzio-app/app/page.tsx`
2. Find line 682: `{/* ── HERO ── */}`
3. Delete everything from line 682 to line 860 (where `</section>` ends)
4. Copy and paste the code below

## Code to Replace (Lines 682-860)

```tsx
      {/* ── HERO ── */}
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
```

## What This Does
- Removes ALL text (heading, subtext, buttons, pills, etc.)
- Creates 3-column layout
- Left: 2 template images (stacked vertically)
- Center: Your existing laptop showcase
- Right: 2 template images (stacked vertically)
- Clean white background
- Hover effects on images

## Images Used
Using Unsplash placeholder images. You can replace with your own template screenshots later.

## After Replacement
1. Save the file
2. The page will auto-reload
3. You'll see: [Template] [Laptop] [Template] layout
4. No text, just images and laptop

## To Add Your Own Template Images
Replace the `src` URLs with your template screenshot URLs:
- Line ~695: First left template
- Line ~710: Second left template  
- Line ~730: First right template
- Line ~745: Second right template
