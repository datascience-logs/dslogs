'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { usePathname } from 'next/navigation';
import SearchBox from '@/components/SearchBox';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Database, Cpu, Globe, Copy, Check, ExternalLink, Heart, X } from 'lucide-react';
import { SITE } from '@/lib/constants';

// ── Toast System ──────────────────────────────────────────────
function useToast() {
  const [toasts, setToasts] = useState<{id:number;msg:string;type:'success'|'error'}[]>([]);
  const show = useCallback((msg: string, type: 'success'|'error' = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, {id, msg, type}]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);
  return { toasts, show };
}

// ── Animated Counter ─────────────────────────────────────────
function Counter({ target, suffix = '' }: { target: number; suffix?: string }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLSpanElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      obs.disconnect();
      let start = 0;
      const step = target / 60;
      const t = setInterval(() => {
        start += step;
        if (start >= target) { setCount(target); clearInterval(t); }
        else setCount(Math.floor(start));
      }, 16);
    });
    obs.observe(el);
    return () => obs.disconnect();
  }, [target]);
  return <span ref={ref}>{count}{suffix}</span>;
}

// ── Scroll Reveal Hook ───────────────────────────────────────
function useReveal() {
  useEffect(() => {
    const obs = new IntersectionObserver(entries => {
      entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('visible'); });
    }, { threshold: 0.1 });
    document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
    return () => obs.disconnect();
  }, []);
}

// ── Resource Modal ───────────────────────────────────────────
const RESOURCES = [
  { code: 'Dslogs-001', title: 'SQL Joins Cheat Sheet', cat: 'SQL', content: '## SQL Joins\n\n**INNER JOIN** – Returns rows with matches in both tables.\n```sql\nSELECT * FROM a INNER JOIN b ON a.id = b.id;\n```\n\n**LEFT JOIN** – All rows from left + matches from right.\n```sql\nSELECT * FROM a LEFT JOIN b ON a.id = b.id;\n```\n\n**FULL OUTER JOIN** – All rows from both tables.\n```sql\nSELECT * FROM a FULL OUTER JOIN b ON a.id = b.id;\n```' },
  { code: 'Dslogs-002', title: 'Pandas Quick Guide', cat: 'Python', content: '## Pandas Essentials\n\n**Load Data**\n```python\nimport pandas as pd\ndf = pd.read_csv("data.csv")\n```\n\n**Explore**\n```python\ndf.head()     # first 5 rows\ndf.info()     # dtypes & nulls\ndf.describe() # stats summary\n```\n\n**Filter**\n```python\ndf[df["age"] > 25]\n```' },
  { code: 'Dslogs-003', title: 'ML Model Checklist', cat: 'ML', content: '## ML Model Checklist\n\n1. Define the problem (classification/regression?)\n2. Collect & clean data\n3. EDA – distributions, correlations\n4. Feature engineering\n5. Train/val/test split (70/15/15)\n6. Baseline model\n7. Hyperparameter tuning\n8. Evaluate (F1, AUC, RMSE)\n9. Interpret results\n10. Deploy & monitor' },
];

function Modal({ res, onClose, onToast }: { res: typeof RESOURCES[0]; onClose: ()=>void; onToast: (m:string,t:'success'|'error')=>void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div>
            <span className="section-label">{res.cat}</span>
            <h3 style={{marginTop:8}}>{res.title}</h3>
          </div>
          <button className="modal-close" onClick={onClose}><X size={18}/></button>
        </div>
        <div className="modal-body">
          <div className="modal-instagram-banner">
            <p>Love this resource? Follow {SITE.instagram.handle} for daily codes!</p>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-kiwi" style={{padding:'8px 18px',fontSize:'0.85rem'}}>Follow</a>
          </div>
          <div className="modal-content">
            {res.content.split('\n').map((line, i) => {
              if (line.startsWith('## ')) return <h3 key={i} style={{color:'var(--kiwi)',marginBottom:12}}>{line.slice(3)}</h3>;
              if (line.startsWith('**') && line.endsWith('**')) return <p key={i} style={{color:'var(--text-h)',fontWeight:700,marginBottom:4}}>{line.slice(2,-2)}</p>;
              if (line.startsWith('```')) return null;
              if (line.match(/^\d+\./)) return <p key={i} style={{color:'var(--text-b)',paddingLeft:16,marginBottom:4}}>{line}</p>;
              if (line.trim()) return <pre key={i} className="modal-code">{line}</pre>;
              return <br key={i}/>;
            })}
          </div>
          <div className="modal-actions">
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-kiwi">Follow {SITE.instagram.handle}</a>
            <button className="btn btn-outline" onClick={() => { navigator.clipboard.writeText(res.code); onToast('Code copied!','success'); }}>Copy Code</button>
          </div>
        </div>
      </div>
      <style jsx>{`
        .modal-content { margin-bottom: 24px; }
        .modal-code { background: var(--night-hard); color: var(--kiwi); padding: 10px 16px; border-radius: var(--r-sm); font-size: 0.85rem; margin-bottom: 8px; overflow-x: auto; }
        .modal-actions { display: flex; gap: 12px; flex-wrap: wrap; }
      `}</style>
    </div>
  );
}

// ── Main Page ────────────────────────────────────────────────
export default function Home() {
  const { toasts, show: showToast } = useToast();
  const [activeFilter, setActiveFilter] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string|null>(null);
  const [hearts, setHearts] = useState<Record<number,boolean>>({});
  const [modal, setModal] = useState<typeof RESOURCES[0]|null>(null);
  const pathname = usePathname();
  useReveal();

  useEffect(() => {
    setModal(null);
    // Clearing toasts on route change
    const container = document.querySelector('.toast-container');
    if (container) {
      container.innerHTML = ''; 
    }
  }, [pathname]);

  useEffect(() => {
    if (modal) {
      const onReset = () => setModal(null);
      window.addEventListener('dslogs:reset-ui', onReset);
      return () => window.removeEventListener('dslogs:reset-ui', onReset);
    }
  }, [modal]);

  const filters = ['All','Python','SQL','Career','ML','Stats'];

  const copyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    showToast(`${code} copied to clipboard!`, 'success');
    setTimeout(() => setCopiedCode(null), 2000);
  };

  const toggleHeart = (i: number) => setHearts(h => ({...h,[i]:!h[i]}));

  const instaPosts = [
    { code:'Dslogs-001', caption:'SQL Joins explained in 60 seconds! Unlock the full cheat sheet with this code 🔥', likes:842, resource: RESOURCES[0] },
    { code:'Dslogs-002', caption:'Pandas is the backbone of data science. Get the complete quick-reference guide!', likes:1204, resource: RESOURCES[1] },
    { code:'Dslogs-003', caption:'Before you train any ML model, run through this 10-point checklist. No more rookie mistakes!', likes:976, resource: RESOURCES[2] },
  ];

  return (
    <div style={{paddingTop:72}}>

      {/* ── HERO ── */}
      <section className="section hero-section">
        <div className="container">
          <div className="hero-inner">
            <motion.div initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.6}}>
              <span className="section-label">
                <span className="pulse" style={{width:8,height:8,background:'var(--kiwi)',borderRadius:'50%',display:'inline-block'}}></span>
                Data Science Resources
              </span>
              <h1 style={{marginBottom:24}}>
                Your Data Science Journey<br/>
                <span className="kiwi-text-animate">Starts With One Code.</span>
              </h1>
              <p style={{fontSize:'1.2rem',maxWidth:540,marginBottom:48,color:'var(--text-b)'}}>
                We were once beginners too — overwhelmed by paywalls and scattered tutorials. That's why every resource here is free. Just grab the code from {SITE.instagram.handle} and unlock what you need.
              </p>
              <SearchBox onToast={showToast} />
            </motion.div>

            {/* Hero Visual */}
            <motion.div initial={{opacity:0,x:40}} animate={{opacity:1,x:0}} transition={{duration:0.7,delay:0.2}} className="hero-visual">
              <div className="terminal-card">
                <div className="terminal-header">
                  <span className="dot red"></span><span className="dot yellow"></span><span className="dot green"></span>
                  <span style={{marginLeft:'auto',fontSize:'0.75rem',color:'var(--text-mute)'}}>dslogs_unlock.py</span>
                </div>
                <div className="terminal-body">
                  <p><span style={{color:'#6B7280'}}>$</span> <span style={{color:'var(--kiwi)'}}>dslogs</span> unlock Dslogs-001</p>
                  <p style={{color:'var(--text-mute)',marginTop:8}}>🔍 Verifying code…</p>
                  <p style={{color:'var(--kiwi)',marginTop:4}}>✅ Access granted!</p>
                  <p style={{color:'var(--text-b)',marginTop:4}}>📄 Loading: SQL Joins Cheat Sheet</p>
                  <div className="progress-mini">
                    <motion.div initial={{width:0}} animate={{width:'100%'}} transition={{duration:2,delay:1,repeat:Infinity,repeatDelay:2}} className="progress-fill-mini"/>
                  </div>
                </div>
              </div>
              <div className="hero-glow"></div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats-bar">
        <div className="container">
          <div className="stats-grid">
            {[{label:'Resources',val:50,suf:'+'},{label:'Community',val:10,suf:'k+'},{label:'Free Access',val:100,suf:'%'},{label:'Daily Updates',val:1,suf:'🔥'}].map(s => (
              <div key={s.label} className="stat-card card reveal">
                <div className="stat-num"><Counter target={s.val} suffix={s.suf}/></div>
                <div className="stat-label">{s.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ── */}
      <section className="section">
        <div className="container">
          <div className="section-header reveal">
            <span className="section-label">Why Dslogs</span>
            <h2>Built for <span className="kiwi-text">Serious Learners</span></h2>
            <p style={{maxWidth:560,margin:'16px auto 0',color:'var(--text-mute)'}}>We don't do watered-down tutorials. Every resource is production-quality.</p>
          </div>
          <div className="features-grid">
            {[
              { icon: <Database size={32}/>, title:'Built for Real Portfolios', desc:'These aren\'t toy examples. Every dataset, every SQL query, every template is something you\'d actually use in an interview or on the job.' },
              { icon: <Cpu size={32}/>, title:'Logic Before Syntax', desc:'We teach you the "why" before the "how." Pseudo-code first, then clean Python — so the concept sticks forever.' },
              { icon: <Globe size={32}/>, title:'Zero Barriers', desc:`No sign-ups, no credit cards, no email walls. Follow ${SITE.instagram.handle}, get a code, and start learning in seconds.` },
            ].map((f,i) => (
              <div key={i} className={`feature-card card reveal reveal-d${i+1}`}>
                <div className="feat-icon">{f.icon}</div>
                <h3 style={{marginBottom:12}}>{f.title}</h3>
                <p style={{color:'var(--text-mute)',fontSize:'0.95rem'}}>{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── INSTAGRAM ── */}
      <section className="section" id="community">
        <div className="container">
          <div className="section-header reveal" style={{textAlign:'center',marginBottom:48}}>
            <span className="section-label">Instagram Movement</span>
            <h2>Where the <span className="kiwi-text">Codes Come From</span></h2>
          </div>
          <div className="insta-grid">
            {instaPosts.map((p,i) => (
              <div key={i} className={`insta-card card reveal reveal-d${i+1}`}>
                <div className="insta-img">
                  <span style={{fontSize:'3rem',opacity:0.15}}>📸</span>
                </div>
                <div className="insta-body">
                  <p style={{fontSize:'0.9rem',color:'var(--text-b)',marginBottom:16,lineHeight:1.6}}>{p.caption}</p>
                  <div className="insta-footer">
                    <button onClick={() => copyCode(p.code)} className="code-pill">
                      {copiedCode === p.code ? <Check size={14}/> : <Copy size={14}/>}
                      {p.code}
                    </button>
                    <div style={{display:'flex',gap:12,alignItems:'center'}}>
                      <button onClick={() => toggleHeart(i)} style={{background:'none',border:'none',cursor:'pointer',display:'flex',alignItems:'center',gap:4,color:hearts[i]?'#FF4D6D':'var(--text-mute)',transition:'color 0.2s',animation:hearts[i]?'heartBeat 0.6s ease':undefined}}>
                        <Heart size={18} fill={hearts[i]?'currentColor':'none'}/>
                        <span style={{fontSize:'0.85rem'}}>{p.likes + (hearts[i]?1:0)}</span>
                      </button>
                      <button onClick={() => setModal(p.resource)} className="btn btn-kiwi" style={{padding:'8px 16px',fontSize:'0.85rem'}}>
                        Unlock
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-outline">
              Follow {SITE.instagram.handle} for Daily Codes →
            </a>
          </div>
        </div>
      </section>

      {/* ── LIBRARY ── */}
      <section className="section library-section">
        <div className="container">
          <div className="section-header reveal" style={{textAlign:'center',marginBottom:40}}>
            <span className="section-label">Resource Library</span>
            <h2>Browse by <span className="kiwi-text">Category</span></h2>
          </div>
          <div className="filter-tabs reveal">
            {filters.map(f => (
              <button key={f} onClick={() => setActiveFilter(f)} className={`filter-tab${activeFilter===f?' active':''}`}>{f}</button>
            ))}
          </div>
          <div className="resources-grid">
            {RESOURCES.filter(r => activeFilter==='All' || r.cat===activeFilter).map((r,i) => (
              <div key={r.code} className={`res-card card reveal reveal-d${i+1}`}>
                <div className="res-top">
                  <span className="section-label" style={{marginBottom:0}}>{r.cat}</span>
                  <span className="code-pill">{r.code}</span>
                </div>
                <h3 style={{margin:'16px 0 12px'}}>{r.title}</h3>
                <div style={{display:'flex',gap:12,marginTop:'auto'}}>
                  <button onClick={() => setModal(r)} className="btn btn-kiwi" style={{flex:1,padding:'10px'}}>Unlock</button>
                  <button onClick={() => copyCode(r.code)} className="btn btn-ghost">
                    {copiedCode===r.code?<Check size={16}/>:<Copy size={16}/>}
                  </button>
                </div>
              </div>
            ))}
          </div>
          <div style={{textAlign:'center',marginTop:40}}>
            <Link href="/library" className="btn btn-outline">View All Resources →</Link>
          </div>
        </div>
      </section>

      {/* ── MISSION ── */}
      <section className="section">
        <div className="container">
          <div className="mission-split">
            <div className="mission-left reveal">
              <span className="section-label">Our Mission</span>
              <h2>Data Science Should Be <span className="kiwi-text">Accessible</span></h2>
              <p style={{color:'var(--text-mute)',marginBottom:24}}>We started Dslogs because great learning resources were locked behind expensive courses. We believe that with the right community and the right tools, anyone can break into data science.</p>
              <blockquote className="pull-quote">
                "Every code we share is a door we open. Every resource we unlock is a barrier we break."
              </blockquote>
              <Link href="/about" className="btn btn-outline" style={{marginTop:32}}>Read Our Story →</Link>
            </div>
            <div className="mission-visual reveal reveal-d2">
              <div className="laptop-icon">
                <svg viewBox="0 0 200 160" fill="none" xmlns="http://www.w3.org/2000/svg" width="100%">
                  <rect x="20" y="20" width="160" height="100" rx="8" fill="#2A2A2A" stroke="#3A3A3A" strokeWidth="2"/>
                  <rect x="32" y="32" width="136" height="76" rx="4" fill="#1A1A1A"/>
                  <text x="100" y="75" textAnchor="middle" fill="#89E900" fontSize="28" fontFamily="monospace" fontWeight="bold">DS</text>
                  <rect x="0" y="120" width="200" height="12" rx="6" fill="#2A2A2A"/>
                  <rect x="80" y="120" width="40" height="12" rx="6" fill="#3A3A3A"/>
                </svg>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── MODAL ── */}
      {modal && <Modal res={modal} onClose={() => setModal(null)} onToast={showToast} />}

      {/* ── TOASTS ── */}
      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>
            <span className="toast-icon">{t.type==='success'?'✅':'❌'}</span>
            {t.msg}
          </div>
        ))}
      </div>

      <style jsx>{`
        .hero-section { }
        .hero-inner { display: grid; grid-template-columns: 1.1fr 0.9fr; gap: 64px; align-items: center; }
        .hero-visual { position: relative; }
        .terminal-card { background: var(--night-hard); border: 1px solid var(--border); border-radius: var(--r-lg); overflow: hidden; box-shadow: var(--shadow-kiwi-lg); }
        .terminal-header { background: var(--night-soft); padding: 14px 20px; display: flex; align-items: center; gap: 8px; border-bottom: 1px solid var(--border); }
        .dot { width: 12px; height: 12px; border-radius: 50%; }
        .red { background: #FF5F56; } .yellow { background: #FFBD2E; } .green { background: var(--kiwi); }
        .terminal-body { padding: 28px; font-family: var(--font-mono); font-size: 0.9rem; line-height: 1.8; }
        .progress-mini { height: 4px; background: var(--border); border-radius: 2px; margin-top: 16px; overflow: hidden; }
        .progress-fill-mini { height: 100%; background: var(--kiwi); border-radius: 2px; }
        .hero-glow { position: absolute; width: 400px; height: 400px; background: radial-gradient(circle, rgba(137,233,0,0.08) 0%, transparent 70%); top: 50%; left: 50%; transform: translate(-50%,-50%); pointer-events: none; z-index: -1; }

        .stats-bar { padding: 0; margin: 0; }
        .stats-grid { display: grid; grid-template-columns: repeat(4,1fr); gap: 24px; padding: 0; }
        .stat-card { padding: 36px 24px; text-align: center; }
        .stat-num { font-family: var(--font-head); font-size: 2.75rem; font-weight: 800; color: var(--kiwi); line-height: 1; margin-bottom: 8px; }
        .stat-label { font-size: 0.85rem; font-weight: 700; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.08em; }

        .section-header { text-align: center; margin-bottom: 56px; }
        .features-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
        .feature-card { padding: 40px 32px; }
        .feat-icon { width: 72px; height: 72px; background: rgba(137,233,0,0.08); color: var(--kiwi); border-radius: var(--r-md); display: flex; align-items: center; justify-content: center; margin-bottom: 24px; transition: 0.3s; border: 1px solid rgba(137,233,0,0.2); }
        .feature-card:hover .feat-icon { background: var(--kiwi); color: #111; }

        .insta-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
        .insta-card { overflow: hidden; }
        .insta-img { aspect-ratio: 1; background: var(--night-hard); display: flex; align-items: center; justify-content: center; border-bottom: 1px solid var(--border); }
        .insta-body { padding: 24px; }
        .insta-footer { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 12px; }

        .library-section { background: var(--night-soft); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
        .resources-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 28px; }
        .res-card { padding: 28px; display: flex; flex-direction: column; }
        .res-top { display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 8px; }

        .mission-split { display: grid; grid-template-columns: 1fr 1fr; gap: 80px; align-items: center; }
        .pull-quote { border-left: 3px solid var(--kiwi); padding: 16px 24px; background: rgba(137,233,0,0.05); border-radius: 0 var(--r-md) var(--r-md) 0; color: var(--text-b); font-style: italic; font-size: 1.05rem; line-height: 1.7; }
        .laptop-icon { max-width: 340px; margin: 0 auto; filter: drop-shadow(0 0 40px rgba(137,233,0,0.15)); }

        @media (max-width: 1024px) {
          .hero-inner { grid-template-columns: 1fr; gap: 48px; }
          .hero-visual { display: none; }
          .features-grid, .insta-grid, .resources-grid { grid-template-columns: repeat(2,1fr); }
          .stats-grid { grid-template-columns: repeat(2,1fr); gap: 16px; }
          .mission-split { grid-template-columns: 1fr; }
          .mission-visual { display: none; }
        }
        @media (max-width: 640px) {
          .features-grid, .insta-grid, .resources-grid { grid-template-columns: 1fr; }
          .stats-grid { grid-template-columns: repeat(2,1fr); }
        }
      `}</style>
    </div>
  );
}
