'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Instagram, Send, Mail } from 'lucide-react';
import { SITE } from '@/lib/constants';

export default function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: 'smooth' });

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-top">
          {/* Brand */}
          <div className="footer-brand">
            <Link href="/" className="flogo">
              <Image src={SITE.logo} alt={SITE.fullName} width={36} height={36} style={{borderRadius:'50%', objectFit: 'cover', width: 'auto', height: 'auto'}} />
              <span className="kiwi-text" style={{fontFamily:'var(--font-head)',fontWeight:700,fontSize:'1.4rem', letterSpacing: '-0.02em'}}>{SITE.name}</span>
            </Link>
            <p className="brand-desc">
              Born from a single Instagram post, Dslogs is on a mission to make pro-level data science resources completely free for every curious mind.
            </p>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="insta-badge">
              <Instagram size={18} />
              <span>{SITE.instagram.handle}</span>
            </a>
            <a href={`mailto:${SITE.email}`} className="email-link">
              <Mail size={16} />
              <span>{SITE.email}</span>
            </a>
          </div>

          {/* Links */}
          <div className="footer-links-wrap">
            <div className="link-col">
              <h4>Platform</h4>
              <Link href="/library">Resource Library</Link>
              <Link href="/">Unlock Code</Link>
              <Link href="/about">Our Mission</Link>
            </div>
            <div className="link-col">
              <h4>Categories</h4>
              <Link href="/library?cat=python">Python</Link>
              <Link href="/library?cat=sql">SQL</Link>
              <Link href="/library?cat=ml">Machine Learning</Link>
            </div>
          </div>

          {/* Newsletter */}
          <div className="newsletter-col">
            <h4>Stay in the Loop</h4>
            <p>Get fresh cheat sheets and guides before anyone else.</p>
            <form className="newsletter-form" onSubmit={e => e.preventDefault()}>
              <input type="email" placeholder="your@email.com" required />
              <button type="submit" className="sub-btn"><Send size={16} /></button>
            </form>
          </div>
        </div>

        <hr className="divider" />

        <div className="footer-bottom">
          <p>&copy; {new Date().getFullYear()} {SITE.fullName}. Made with ☕ for the data community.</p>
          <div className="socials">
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" aria-label="Instagram"><Instagram size={20} /></a>
            <a href={`mailto:${SITE.email}`} aria-label="Email"><Mail size={20} /></a>
          </div>
          <button onClick={scrollTop} className="back-top" aria-label="Back to top">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 15l7-7 7 7"/></svg>
            Top
          </button>
        </div>
      </div>

      <style jsx>{`
        .footer { background: var(--night-hard); border-top: 1px solid var(--border); margin-top: 80px; padding: 72px 0 32px; }
        .footer-top { display: grid; grid-template-columns: 1.4fr 1fr 1fr; gap: 48px; margin-bottom: 48px; }
        .flogo { display: flex; align-items: center; gap: 10px; margin-bottom: 20px; }
        .brand-desc { color: var(--text-mute); font-size: 0.95rem; line-height: 1.7; max-width: 300px; margin-bottom: 20px; }
        .insta-badge { display: inline-flex; align-items: center; gap: 8px; background: rgba(137,233,0,0.08); border: 1px solid rgba(137,233,0,0.2); color: var(--kiwi); padding: 8px 16px; border-radius: var(--r-full); font-size: 0.85rem; font-weight: 700; transition: 0.2s; margin-bottom: 12px; }
        .insta-badge:hover { background: rgba(137,233,0,0.16); box-shadow: var(--shadow-kiwi-sm); }
        .email-link { display: flex; align-items: center; gap: 8px; color: var(--text-mute); font-size: 0.85rem; transition: color 0.2s; }
        .email-link:hover { color: var(--kiwi); }
        .footer-links-wrap { display: flex; gap: 48px; }
        .link-col { display: flex; flex-direction: column; gap: 12px; }
        .link-col h4 { color: var(--kiwi); font-size: 0.75rem; letter-spacing: 0.12em; text-transform: uppercase; margin-bottom: 8px; font-family: var(--font-head); }
        .link-col a { color: var(--text-mute); font-size: 0.9rem; transition: color 0.2s; }
        .link-col a:hover { color: var(--kiwi); }
        .newsletter-col h4 { font-family: var(--font-head); color: var(--text-h); font-size: 1rem; margin-bottom: 8px; }
        .newsletter-col p { font-size: 0.85rem; color: var(--text-mute); margin-bottom: 16px; }
        .newsletter-form { display: flex; background: var(--night-soft); border: 1px solid var(--border); border-radius: var(--r-md); overflow: hidden; transition: border-color 0.2s; }
        .newsletter-form:focus-within { border-color: var(--kiwi); }
        .newsletter-form input { flex: 1; background: transparent; border: none; outline: none; padding: 12px 16px; color: var(--text-h); font-size: 0.9rem; }
        .sub-btn { background: var(--kiwi); color: #111; padding: 12px 16px; cursor: pointer; transition: background 0.2s; border: none; }
        .sub-btn:hover { background: var(--kiwi-bright); }
        .footer-bottom { display: flex; align-items: center; justify-content: space-between; padding-top: 28px; font-size: 0.85rem; color: var(--text-mute); flex-wrap: wrap; gap: 16px; }
        .socials { display: flex; gap: 16px; }
        .socials a { color: var(--text-mute); transition: color 0.2s; }
        .socials a:hover { color: var(--kiwi); }
        .back-top { display: flex; align-items: center; gap: 6px; color: var(--text-mute); font-size: 0.85rem; font-weight: 600; transition: color 0.2s; background: none; border: none; cursor: pointer; }
        .back-top:hover { color: var(--kiwi); }
        @media (max-width: 1024px) { .footer-top { grid-template-columns: 1fr 1fr; } .newsletter-col { grid-column: span 2; } }
        @media (max-width: 640px) { .footer-top { grid-template-columns: 1fr; } .newsletter-col { grid-column: span 1; } .footer-links-wrap { gap: 32px; } }
      `}</style>
    </footer>
  );
}
