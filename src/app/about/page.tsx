'use client';

import Link from 'next/link';
import Image from 'next/image';
import { Users, Target, Heart, Zap, Mail } from 'lucide-react';
import { SITE } from '@/lib/constants';

export default function AboutPage() {
  return (
    <div className="about-page">
      <div className="container">
        {/* Header */}
        <div className="about-header">
          <Image src={SITE.logo} alt={SITE.fullName} width={80} height={80} style={{borderRadius:'50%', objectFit: 'cover', margin:'0 auto 24px', width: 'auto', height: 'auto'}} />
          <span className="section-label">The Mission</span>
          <h1>I was a data science student. <span className="kiwi-text">And I wasted months.</span></h1>
          <p style={{maxWidth:700,margin:'24px auto 0',fontSize:'1.15rem',color:'var(--text-mute)',lineHeight:1.7}}>
            Not because I wasn't smart enough, but because I couldn't find what I needed.
            Late nights. Endless tabs. Expensive courses I couldn’t afford. 
            Free tutorials that stopped halfway. Datasets that were either too simple or completely broken.
          </p>
        </div>

        {/* Origin Story */}
        <div className="origin-section">
          <div className="origin-card card">
            <div className="origin-body">
              <h2 style={{fontSize:'1.5rem',marginBottom:16}}>I Remember Sitting at My Desk at <span className="kiwi-text">1 AM.</span></h2>
              <p style={{color:'var(--text-b)',lineHeight:1.8}}>
                I was frustrated to the point of tears. I had the will to learn. I had the curiosity. 
                But I didn’t have <em>a single place</em> where everything just… worked.
              </p>
              <p style={{color:'var(--text-b)',lineHeight:1.8}}>
                I missed out on concepts because the explanation was buried in a 2-hour video. 
                I wasted weeks hunting for a good SQL cheat sheet. 
                I lost confidence because everyone else seemed to know things I couldn’t even find.
              </p>
              <p style={{color:'var(--text-b)',lineHeight:1.8, marginTop: 24}}>
                <strong style={{color:'var(--kiwi)'}}>So I built Dslogs.</strong><br/>
                Not as a business. Not as a brand. As a gift to the student I used to be — 
                and to the student you are right now. Every resource here is something I wished existed 
                when I was learning. It's the hand I needed but never got.
              </p>
            </div>
          </div>
        </div>

        {/* Values (What you'll find) */}
        <div className="values-header" style={{textAlign:'center',marginBottom:48}}>
          <span className="section-label">What You'll Find</span>
          <h2>Everything You Need <span className="kiwi-text">Under One Roof</span></h2>
        </div>
        <div className="values-grid">
          {[
            { icon: <Target size={28}/>, title: 'Real Resources', desc: 'No fluff. No clickbait. No "SEO-optimized" junk. Just what you actually need to solve problems and pass interviews.' },
            { icon: <Zap size={28}/>, title: 'Instant Access', desc: 'Get the code from Instagram, paste it, start learning. No signups, no emails, no "freemium" traps.' },
            { icon: <Users size={28}/>, title: 'Everything for Data', desc: 'Python, SQL, ML, Stats, Career, Projects. All organized. All tested. All free. Forever.' },
            { icon: <Heart size={28}/>, title: 'By a Student, For You', desc: 'I know your pain because I lived it. I don\'t call it a platform; I call it my logbook — shared with you.' },
          ].map((v, i) => (
            <div key={i} className="value-card card">
              <div className="val-icon">{v.icon}</div>
              <h3 style={{marginBottom: 8}}>{v.title}</h3>
              <p style={{color:'var(--text-mute)', fontSize:'0.95rem', lineHeight:1.6}}>{v.desc}</p>
            </div>
          ))}
        </div>

        {/* Pull Quote */}
        <div className="quote-block">
          <blockquote>
            "Every resource you unlock here is a door that was locked for me.<br/>
            I’m opening it for you."
          </blockquote>
          <p className="quote-attr">— The {SITE.fullName} Team</p>
        </div>

        {/* CTA */}
        <div className="about-cta">
          <span className="section-label" style={{marginBottom:16}}>Payback</span>
          <h2>Ready to learn <span className="kiwi-text">Without the Weight?</span></h2>
          <p style={{color:'var(--text-mute)', marginBottom: 32, fontSize:'1.1rem', maxWidth:600, margin:'0 auto 32px'}}>
            This isn’t a platform. It’s payback for all the sleepless nights and missed opportunities. 
            You’re not alone anymore. We learn together. We rise together.
          </p>
          <div style={{display:'flex',gap:16,justifyContent:'center',flexWrap:'wrap'}}>
            <Link href="/library" className="btn btn-kiwi">Browse Library →</Link>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Follow @Dslogs
            </a>
          </div>
          <p style={{color:'var(--text-mute)',fontSize:'0.85rem',marginTop:24}}>
            Questions? I reply to every single message at <a href={`mailto:${SITE.email}`} style={{color:'var(--kiwi)',fontWeight:700}}>{SITE.email}</a>
          </p>
        </div>
      </div>

      <style jsx>{`
        .about-header { text-align: center; margin-bottom: 64px; }
        .origin-section { margin-bottom: 80px; }
        .origin-card { padding: 48px; border: 1px solid var(--border); background: var(--night-soft); }
        .values-grid { display: grid; grid-template-columns: repeat(2, 1fr); gap: 28px; margin-bottom: 80px; }
        .value-card { padding: 36px; }
        .val-icon { width: 56px; height: 56px; background: rgba(137,233,0,0.08); color: var(--kiwi); border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; margin-bottom: 20px; border: 1px solid rgba(137,233,0,0.2); transition: 0.3s; }
        .value-card:hover .val-icon { background: var(--kiwi); color: #111; }
        .quote-block { text-align: center; padding: 48px 32px; margin-bottom: 80px; }
        .quote-block blockquote { font-family: var(--font-head); font-size: clamp(1.2rem, 3vw, 1.6rem); color: var(--text-h); line-height: 1.7; font-style: italic; border-left: 3px solid var(--kiwi); padding-left: 28px; display: inline-block; text-align: left; }
        .quote-attr { color: var(--kiwi); font-weight: 700; margin-top: 16px; }
        .about-cta { text-align: center; padding: 64px 0; }
        @media (max-width: 768px) { .values-grid { grid-template-columns: 1fr; } .origin-card { padding: 28px; } }
      `}</style>
    </div>
  );
}
