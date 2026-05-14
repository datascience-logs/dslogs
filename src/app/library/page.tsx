'use client';

import { useState, useEffect } from 'react';
import { categories } from '@/lib/resources-data';
import { Resource } from '@/lib/resources-data';
import { ResourceService } from '@/lib/resource-service';
import Link from 'next/link';
import { Calendar, ChevronRight, Copy, Check, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function LibraryPage() {
  const [allResources, setAllResources] = useState<Resource[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  useEffect(() => {
    async function loadResources() {
      const data = await ResourceService.getAll();
      setAllResources(data);
      setLoading(false);
    }
    loadResources();
  }, []);

  const filteredResources = allResources.filter(r => 
    selectedCategory === 'All' || r.category === selectedCategory
  );

  const handleCopy = (e: React.MouseEvent, code: string) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2000);
  };

  return (
    <div className="library-page" style={{paddingTop: 100}}>
      <div className="container">
        <div className="lib-header">
          <span className="section-label">Resource Library</span>
          <h1>Browse <span className="kiwi-text">All Resources</span></h1>
          <p style={{maxWidth:560,margin:'16px auto 0',color:'var(--text-mute)'}}>
            Click any card to unlock. Use the code from Instagram or copy it here.
          </p>
        </div>

        {/* Filter Bar */}
        <div className="filter-tabs">
          {categories.map((cat) => (
            <button
              key={cat}
              className={`filter-tab${selectedCategory === cat ? ' active' : ''}`}
              onClick={() => setSelectedCategory(cat)}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Resources Grid */}
        {loading ? (
          <div className="loading-state">
            <Loader2 className="spin" size={48} />
            <p>Loading resources…</p>
          </div>
        ) : (
          <div className="res-grid">
            <AnimatePresence mode="popLayout">
              {filteredResources.map((res) => (
                <motion.div
                  key={res.id}
                  layout
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.3 }}
                >
                  <Link href={`/resource/${res.code.toLowerCase()}`} className="res-card card">
                    <div className="rc-top">
                      <span className="section-label" style={{marginBottom:0}}>{res.category}</span>
                      <span className="rc-date">
                        <Calendar size={14} />
                        {new Date(res.date).toLocaleDateString()}
                      </span>
                    </div>
                    
                    <div className="rc-body">
                      <h3>{res.title}</h3>
                      <p>{res.excerpt}</p>
                    </div>

                    <div className="rc-footer">
                      <div className="code-pill" onClick={(e) => handleCopy(e, res.code)}>
                        {copiedCode === res.code ? <Check size={14} /> : <Copy size={14} />}
                        {res.code}
                      </div>
                      <span className="rc-read">
                        Read More <ChevronRight size={16} />
                      </span>
                    </div>
                  </Link>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>

      <style jsx>{`
        .lib-header { text-align: center; margin-bottom: 48px; }
        .loading-state { display: flex; flex-direction: column; align-items: center; padding: 100px 0; gap: 20px; color: var(--text-mute); }
        .res-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(340px, 1fr)); gap: 28px; }
        .res-card { display: flex; flex-direction: column; padding: 28px; height: 100%; }
        .rc-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 20px; }
        .rc-date { display: flex; align-items: center; gap: 6px; font-size: 0.85rem; color: var(--text-mute); }
        .rc-body { flex: 1; }
        .rc-body h3 { font-size: 1.3rem; margin-bottom: 10px; }
        .rc-body p { font-size: 0.95rem; color: var(--text-mute); display: -webkit-box; -webkit-line-clamp: 3; -webkit-box-orient: vertical; overflow: hidden; }
        .rc-footer { margin-top: 24px; padding-top: 20px; display: flex; justify-content: space-between; align-items: center; border-top: 1px dashed var(--border); }
        .rc-read { display: flex; align-items: center; gap: 4px; font-weight: 700; font-size: 0.9rem; color: var(--kiwi); }
        @media (max-width: 640px) { .res-grid { grid-template-columns: 1fr; } }
      `}</style>
    </div>
  );
}
