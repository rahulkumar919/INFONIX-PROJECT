'use client'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import Image from 'next/image'

interface MobileNavProps {
    navLinks: [string, string][]
    activeSection: string
    navScrolled: boolean
}

export default function MobileNav({ navLinks, activeSection, navScrolled }: MobileNavProps) {
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768)
        check()
        window.addEventListener('resize', check)
        return () => window.removeEventListener('resize', check)
    }, [])

    // lock body scroll when drawer open
    useEffect(() => {
        document.body.style.overflow = mobileMenuOpen ? 'hidden' : ''
        return () => { document.body.style.overflow = '' }
    }, [mobileMenuOpen])

    return (
        <>
            <style>{`
                @keyframes navFadeDown {
                    from { opacity: 0; transform: translateY(-12px); }
                    to   { opacity: 1; transform: translateY(0); }
                }
                @keyframes drawerSlide {
                    from { opacity: 0; transform: translateY(-8px) scale(.97); }
                    to   { opacity: 1; transform: translateY(0) scale(1); }
                }
                @keyframes overlayFade {
                    from { opacity: 0; }
                    to   { opacity: 1; }
                }
                .nav-link-item {
                    position: relative;
                    color: #374151;
                    text-decoration: none;
                    font-size: .85rem;
                    font-weight: 500;
                    padding: 6px 14px;
                    border-radius: 50px;
                    transition: all .22s ease;
                    letter-spacing: -.01em;
                }
                .nav-link-item:hover {
                    color: #4f46e5;
                    background: rgba(79,70,229,.07);
                }
                .nav-link-item.active {
                    color: #4f46e5;
                    background: rgba(79,70,229,.09);
                    font-weight: 600;
                }
                .nav-link-item.active::after {
                    content: '';
                    position: absolute;
                    bottom: 2px;
                    left: 50%;
                    transform: translateX(-50%);
                    width: 4px;
                    height: 4px;
                    border-radius: 50%;
                    background: #4f46e5;
                }
                .nav-cta {
                    padding: 9px 22px;
                    background: linear-gradient(135deg, #4f46e5, #7c3aed);
                    color: #fff !important;
                    border-radius: 50px;
                    font-size: .85rem;
                    font-weight: 700;
                    text-decoration: none;
                    box-shadow: 0 4px 14px rgba(79,70,229,.35);
                    transition: all .22s ease;
                    letter-spacing: -.01em;
                    white-space: nowrap;
                }
                .nav-cta:hover {
                    transform: translateY(-1px);
                    box-shadow: 0 6px 20px rgba(79,70,229,.45);
                }
                .nav-login {
                    padding: 9px 18px;
                    color: #374151;
                    font-size: .85rem;
                    font-weight: 500;
                    text-decoration: none;
                    border-radius: 50px;
                    border: 1.5px solid #e5e7eb;
                    transition: all .22s ease;
                    white-space: nowrap;
                }
                .nav-login:hover {
                    border-color: #4f46e5;
                    color: #4f46e5;
                    background: rgba(79,70,229,.04);
                }
                .hamburger-line {
                    display: block;
                    width: 20px;
                    height: 2px;
                    background: #1e1b4b;
                    border-radius: 2px;
                    transition: all .28s cubic-bezier(.4,0,.2,1);
                }
                .mobile-nav-link {
                    display: flex;
                    align-items: center;
                    gap: 10px;
                    padding: 13px 16px;
                    border-radius: 12px;
                    color: #111827;
                    text-decoration: none;
                    font-size: .95rem;
                    font-weight: 600;
                    transition: all .18s ease;
                }
                .mobile-nav-link:hover, .mobile-nav-link.active {
                    background: #f5f3ff;
                    color: #4f46e5;
                }
            `}</style>

            {/* ── NAVBAR ── */}
            <nav style={{
                position: 'fixed', top: 0, left: 0, right: 0, zIndex: 200,
                padding: '0 5%',
                height: 64,
                display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                background: navScrolled ? 'rgba(255,255,255,0.92)' : 'rgba(255,255,255,0.5)',
                backdropFilter: 'blur(24px) saturate(180%)',
                WebkitBackdropFilter: 'blur(24px) saturate(180%)',
                borderBottom: navScrolled ? '1px solid rgba(0,0,0,.06)' : '1px solid rgba(255,255,255,.4)',
                boxShadow: navScrolled ? '0 2px 20px rgba(0,0,0,.06)' : 'none',
                transition: 'all .35s ease',
                animation: 'navFadeDown .5s ease',
            }}>

                {/* LOGO */}
                <Link href="/" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
                    {isMobile ? (
                        /* Mobile: W icon only */
                        <Image src="/logo.png" alt="W" width={36} height={36} style={{ objectFit: 'contain' }} priority />
                    ) : (
                        /* Desktop: full logo */
                        <Image src="/webrazeo.png" alt="Webrazeo" width={160} height={44} style={{ objectFit: 'contain', height: 44, width: 'auto' }} priority />
                    )}
                </Link>

                {/* CENTER — pill nav (desktop only) */}
                {!isMobile && (
                    <div style={{
                        position: 'absolute', left: '50%', transform: 'translateX(-50%)',
                        display: 'flex', alignItems: 'center', gap: 2,
                        background: 'rgba(255,255,255,.7)',
                        backdropFilter: 'blur(12px)',
                        border: '1px solid rgba(0,0,0,.07)',
                        borderRadius: 50,
                        padding: '4px 6px',
                        boxShadow: '0 2px 12px rgba(0,0,0,.06)',
                    }}>
                        {navLinks.map(([label, href]) => (
                            <a
                                key={label}
                                href={href}
                                className={`nav-link-item${activeSection === href.slice(1) ? ' active' : ''}`}
                            >
                                {label}
                            </a>
                        ))}
                    </div>
                )}

                {/* RIGHT — actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, flexShrink: 0 }}>
                    {!isMobile && (
                        <>
                            <Link href="/login" className="nav-login">Log in</Link>
                            <Link href="/signup" className="nav-cta">Get Started Free ✦</Link>
                        </>
                    )}

                    {/* Mobile: hamburger */}
                    {isMobile && (
                        <button
                            onClick={() => setMobileMenuOpen(o => !o)}
                            aria-label="Toggle menu"
                            style={{
                                width: 40, height: 40,
                                background: mobileMenuOpen ? 'rgba(79,70,229,.08)' : 'rgba(255,255,255,.8)',
                                border: '1.5px solid rgba(0,0,0,.08)',
                                borderRadius: 12,
                                cursor: 'pointer',
                                display: 'flex', flexDirection: 'column',
                                alignItems: 'center', justifyContent: 'center', gap: 5,
                                backdropFilter: 'blur(8px)',
                                transition: 'all .2s ease',
                            }}
                        >
                            <span className="hamburger-line" style={{ transform: mobileMenuOpen ? 'rotate(45deg) translate(3px, 3px)' : 'none' }} />
                            <span className="hamburger-line" style={{ opacity: mobileMenuOpen ? 0 : 1, transform: mobileMenuOpen ? 'scaleX(0)' : 'none' }} />
                            <span className="hamburger-line" style={{ transform: mobileMenuOpen ? 'rotate(-45deg) translate(3px, -3px)' : 'none' }} />
                        </button>
                    )}
                </div>
            </nav>

            {/* ── MOBILE DROPDOWN MENU ── */}
            {isMobile && mobileMenuOpen && (
                <>
                    {/* Backdrop */}
                    <div
                        onClick={() => setMobileMenuOpen(false)}
                        style={{
                            position: 'fixed', inset: 0, zIndex: 198,
                            background: 'rgba(15,10,40,.45)',
                            backdropFilter: 'blur(4px)',
                            animation: 'overlayFade .25s ease',
                        }}
                    />

                    {/* Dropdown card — drops from top */}
                    <div style={{
                        position: 'fixed', top: 72, left: '4%', right: '4%', zIndex: 199,
                        background: 'rgba(255,255,255,.97)',
                        backdropFilter: 'blur(24px)',
                        borderRadius: 20,
                        border: '1px solid rgba(0,0,0,.07)',
                        boxShadow: '0 20px 60px rgba(0,0,0,.15)',
                        padding: '16px',
                        animation: 'drawerSlide .25s ease',
                    }}>
                        {/* Nav links */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 2, marginBottom: 16 }}>
                            {navLinks.map(([label, href]) => (
                                <a
                                    key={label}
                                    href={href}
                                    onClick={() => setMobileMenuOpen(false)}
                                    className={`mobile-nav-link${activeSection === href.slice(1) ? ' active' : ''}`}
                                >
                                    <span style={{ fontSize: '1rem' }}>
                                        {label === 'Features' ? '⚡' : label === 'Templates' ? '🎨' : label === 'How it Works' ? '🔄' : label === 'Pricing' ? '💎' : label === 'Blog' ? '📝' : '→'}
                                    </span>
                                    {label}
                                </a>
                            ))}
                        </div>

                        {/* Divider */}
                        <div style={{ height: 1, background: 'linear-gradient(90deg,transparent,#e5e7eb,transparent)', margin: '4px 0 16px' }} />

                        {/* Auth buttons */}
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
                            <Link
                                href="/login"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block', textAlign: 'center',
                                    padding: '13px', borderRadius: 12,
                                    border: '1.5px solid #e5e7eb',
                                    color: '#374151', textDecoration: 'none',
                                    fontSize: '.95rem', fontWeight: 600,
                                    transition: 'all .18s',
                                }}
                            >
                                Log in
                            </Link>
                            <Link
                                href="/signup"
                                onClick={() => setMobileMenuOpen(false)}
                                style={{
                                    display: 'block', textAlign: 'center',
                                    padding: '13px', borderRadius: 12,
                                    background: 'linear-gradient(135deg,#4f46e5,#7c3aed)',
                                    color: '#fff', textDecoration: 'none',
                                    fontSize: '.95rem', fontWeight: 700,
                                    boxShadow: '0 4px 14px rgba(79,70,229,.35)',
                                }}
                            >
                                Get Started Free ✦
                            </Link>
                        </div>

                        {/* Bottom badge */}
                        <div style={{ marginTop: 14, textAlign: 'center', fontSize: '.72rem', color: '#9ca3af' }}>
                            ✓ Free forever &nbsp;·&nbsp; ✓ No credit card &nbsp;·&nbsp; ✓ Live in 5 min
                        </div>
                    </div>
                </>
            )}
        </>
    )
}
