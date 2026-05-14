'use client';

import Link from 'next/link';
import Image from 'next/image';
import { usePathname } from 'next/navigation';
import { useState, useEffect } from 'react';
import { SITE } from '@/lib/constants';

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [pathname]);

  useEffect(() => {
    if (menuOpen) {
      const onReset = () => setMenuOpen(false);
      window.addEventListener('dslogs:reset-ui', onReset);
      return () => window.removeEventListener('dslogs:reset-ui', onReset);
    }
  }, [menuOpen]);

  const links = [
    { name: 'Resources', href: '/library' },
    { name: 'Community', href: '/#community' },
    { name: 'Mission', href: '/about' },
  ];

  return (
    <>
      <header className={`navbar${scrolled ? ' scrolled' : ''}`}>
        <div className="container">
          <div className="nav-inner">
            {/* Logo Section - Vertically Centered */}
            <Link href="/" className="nav-logo-group">
              <div className="logo-circle">
                <Image 
                  src={SITE.logo} 
                  alt={SITE.fullName} 
                  width={40} 
                  height={40} 
                  className="logo-img" 
                  priority
                  style={{ width: 'auto', height: 'auto' }}
                />
              </div>
              <div className="logo-bottom">
                <span className="kiwi-text logo-name">{SITE.name}</span>
                <span className="logo-sep">|</span>
                <span className="logo-tagline">{SITE.fullName}</span>
              </div>
            </Link>

            {/* Desktop Nav */}
            <nav className="nav-links">
              {links.map(l => (
                <Link key={l.name} href={l.href} className={`nav-link${pathname === l.href ? ' active' : ''}`}>
                  {l.name}
                  {pathname === l.href && <span className="active-dot"></span>}
                </Link>
              ))}
            </nav>

            {/* Right Actions */}
            <div className="nav-right">
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline btn-sm">
                Get Code
              </a>
              <button className="hamburger" onClick={() => setMenuOpen(o => !o)} aria-label="Toggle menu">
                <span className={`bar${menuOpen ? ' open' : ''}`}></span>
                <span className={`bar${menuOpen ? ' open' : ''}`}></span>
                <span className={`bar${menuOpen ? ' open' : ''}`}></span>
              </button>
            </div>
          </div>
        </div>

        {menuOpen && (
          <>
            <div className="mobile-backdrop" onClick={() => setMenuOpen(false)}></div>
            <div className="mobile-menu">
              {links.map(l => (
                <Link key={l.name} href={l.href} className="mobile-link" onClick={() => setMenuOpen(false)}>
                  {l.name}
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
                </Link>
              ))}
              <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-kiwi" style={{marginTop:16,textAlign:'center',justifyContent:'center'}}>
                Get Code →
              </a>
            </div>
          </>
        )}
      </header>

      <style jsx>{`
        .navbar {
          position: fixed; top: 0; left: 0; right: 0; z-index: 1000;
          transition: background 0.3s, box-shadow 0.3s, border-color 0.3s;
          border-bottom: 1px solid transparent;
          background: transparent;
        }
        .navbar.scrolled {
          background: rgba(26,26,26,0.95);
          backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px);
          border-bottom-color: var(--border);
          box-shadow: 0 4px 32px rgba(0,0,0,0.4);
        }
        
        /* Container and Inner Alignment */
        .nav-inner {
          display: flex;
          align-items: center;
          justify-content: space-between;
          min-height: 64px;
          padding: 16px 0; /* Vertical Padding - Desktop py-5 equivalent */
        }

        /* Logo Group Styling */
        .nav-logo-group {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 4px;
          text-decoration: none;
        }
        .logo-circle {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          overflow: hidden;
          border: 1px solid var(--border);
          transition: all 0.3s ease;
          display: flex;
          align-items: center;
          justify-content: center;
          background: var(--night-hard);
        }
        .nav-logo-group:hover .logo-circle {
          border-color: var(--kiwi);
          box-shadow: var(--shadow-kiwi-sm);
          transform: translateY(-2px) scale(1.05);
        }
        .logo-img {
          width: auto;
          height: auto;
          object-fit: cover;
        }
        
        .logo-bottom {
          display: flex;
          align-items: center;
          gap: 8px;
          line-height: 1;
        }
        .logo-name {
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 1.1rem;
          letter-spacing: -0.01em;
        }
        .logo-sep {
          color: var(--border);
          font-weight: 300;
          font-size: 1rem;
        }
        .logo-tagline {
          font-size: 9px;
          text-transform: uppercase;
          letter-spacing: 0.1em;
          color: var(--text-mute);
          font-weight: 600;
        }

        /* Navigation Links */
        .nav-links { display: flex; gap: 36px; align-items: center; }
        .nav-link {
          font-family: var(--font-head); font-weight: 500; font-size: 0.95rem;
          color: var(--text-mute); transition: color 0.2s; position: relative; padding-bottom: 2px;
        }
        .nav-link::after { content:''; position: absolute; bottom: -4px; left: 0; width: 0; height: 2px; background: var(--kiwi); border-radius: 2px; transition: width 0.25s; }
        .nav-link:hover, .nav-link.active { color: var(--text-h); }
        .nav-link.active::after, .nav-link:hover::after { width: 100%; }
        .active-dot { position: absolute; bottom: -8px; left: 50%; transform: translateX(-50%); width: 4px; height: 4px; background: var(--kiwi); border-radius: 50%; }
        
        .nav-right { display: flex; align-items: center; gap: 16px; }
        .btn-sm { padding: 9px 20px; font-size: 0.85rem; }
        
        .hamburger { display: none; flex-direction: column; gap: 5px; padding: 4px; cursor: pointer; background: none; border: none; }
        .bar { display: block; width: 24px; height: 2px; background: var(--text-h); border-radius: 2px; transition: all 0.3s; }
        
        .mobile-menu {
          position: absolute; top: 100%; left: 0; right: 0;
          background: var(--night-hard); border-bottom: 1px solid var(--border);
          padding: 24px; display: flex; flex-direction: column; gap: 4px;
          animation: slideDown 0.3s ease-out;
          box-shadow: 0 20px 40px rgba(0,0,0,0.5);
        }
        @keyframes slideDown { from { opacity:0; transform:translateY(-10px); } to { opacity:1; transform:translateY(0); } }
        
        .mobile-link {
          display: flex; justify-content: space-between; align-items: center;
          font-family: var(--font-head); font-size: 1.1rem; font-weight: 600;
          color: var(--text-b); padding: 14px 0; border-bottom: 1px solid var(--border); transition: color 0.2s;
        }
        .mobile-link:hover { color: var(--kiwi); }
        
        .mobile-backdrop {
          position: fixed; top: 0; left: 0; right: 0; bottom: 0;
          background: rgba(0,0,0,0.5); z-index: 999;
          backdrop-filter: blur(4px); -webkit-backdrop-filter: blur(4px);
        }

        @media (max-width: 768px) {
          .nav-inner { padding: 12px 0; } /* Mobile py-3 equivalent */
          .nav-links { display: none; }
          .hamburger { display: flex; }
          .btn-sm { display: none; }
          .logo-name { font-size: 1.25rem; }
          .logo-sep, .logo-tagline { display: none; }
        }
      `}</style>
    </>
  );
}
