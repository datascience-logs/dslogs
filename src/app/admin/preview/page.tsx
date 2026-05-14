'use client';

import { useState, useEffect } from 'react';
import { Resource } from '@/lib/resources-data';
import ReactMarkdown from 'react-markdown';
import { Instagram, ArrowLeft, Share2, Loader2, Copy, Check, Eye } from 'lucide-react';
import { SITE } from '@/lib/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function PreviewPage() {
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    const data = sessionStorage.getItem('dslogs_preview_data');
    if (data) {
      try {
        setResource(JSON.parse(data));
      } catch (err) {
        console.error('Failed to parse preview data', err);
      }
    }
    setLoading(false);
  }, []);

  const handleCopy = () => {
    if (!resource) return;
    navigator.clipboard.writeText(resource.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (loading) {
    return (
      <div style={{paddingTop:140,textAlign:'center',color:'var(--text-mute)'}}>
        <Loader2 className="spin" size={48} />
        <p style={{marginTop:16}}>Generating preview…</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div style={{paddingTop:140,textAlign:'center'}}>
        <h2 style={{marginBottom:16}}>No Preview Data Found</h2>
        <p style={{color:'var(--text-mute)',marginBottom:32}}>Please trigger the preview from the admin panel again.</p>
        <button onClick={() => window.close()} className="btn btn-kiwi">Close Tab</button>
      </div>
    );
  }

  return (
    <div className="res-page" style={{paddingTop:100}}>
      <div className="preview-banner">
        <Eye size={16} /> <strong>LIVE PREVIEW MODE</strong> — This is a preview of your unsaved changes.
      </div>

      <div className="container">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          {/* Breadcrumb Mock */}
          <div className="back-link" style={{opacity:0.5, cursor:'default'}}>
            <ArrowLeft size={16}/> Back to Library (Disabled)
          </div>

          {/* Header */}
          <div className="res-header">
            <div className="res-meta">
              <span className="section-label" style={{marginBottom:0}}>{resource.category}</span>
              <span className="code-pill" onClick={handleCopy} style={{cursor:'pointer'}}>
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                {resource.code || 'Dslogs-XXX'}
              </span>
            </div>
            <h1 style={{marginBottom:16}}>{resource.title || 'Untitled Resource'}</h1>
            <p className="res-excerpt">{resource.excerpt || 'No excerpt provided.'}</p>
          </div>

          {/* Instagram Banner */}
          <div className="modal-instagram-banner" style={{marginBottom:40}}>
            <p>Love this? Follow {SITE.instagram.handle} for daily data science codes!</p>
            <button disabled className="btn btn-kiwi" style={{padding:'8px 18px',fontSize:'0.85rem',whiteSpace:'nowrap'}}>
              <Instagram size={16}/> Follow
            </button>
          </div>

          {/* Content */}
          <div className="res-content markdown-content">
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                table({ children }) {
                  return <div className="table-container"><table>{children}</table></div>;
                },
                code({ node, inline, className, children, ...props }: any) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      style={atomDark}
                      language={match[1]}
                      PreTag="div"
                      {...props}
                    >
                      {String(children).replace(/\n$/, '')}
                    </SyntaxHighlighter>
                  ) : (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {(resource.content || '').replace(/\\n/g, '\n')}
            </ReactMarkdown>
          </div>

          {/* Actions Mock */}
          <div className="res-actions">
            <button disabled className="btn btn-outline">
              <Share2 size={16}/> Share
            </button>
            <button disabled className="btn btn-kiwi">
              More Resources →
            </button>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .preview-banner {
          position: fixed; top: 0; left: 0; right: 0; 
          background: var(--kiwi); color: #111;
          text-align: center; padding: 10px; font-size: 0.85rem;
          z-index: 2000; display: flex; align-items: center; justify-content: center; gap: 8px;
          box-shadow: 0 4px 20px rgba(0,0,0,0.5);
        }
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-mute);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 32px;
        }
        .res-header { margin-bottom: 40px; }
        .res-meta { display: flex; align-items: center; gap: 16px; margin-bottom: 20px; flex-wrap: wrap; }
        .res-excerpt { font-size: 1.15rem; color: var(--text-mute); max-width: 640px; line-height: 1.7; }
        .res-content {
          background: var(--night-soft);
          border: 1px solid var(--border);
          border-radius: var(--r-lg);
          padding: 48px;
          margin-bottom: 40px;
          line-height: 1.8;
        }
        /* Markdown overrides to match page.tsx exactly */
        .res-content :global(h1), .res-content :global(h2), .res-content :global(h3) { color: var(--kiwi); margin: 32px 0 16px; font-family: var(--font-head); }
        .res-content :global(p) { margin-bottom: 16px; }
        .res-content :global(code) { background: var(--night-hard); color: var(--kiwi); padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
        .res-content :global(pre) { background: var(--night-hard); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; overflow-x: auto; margin: 16px 0; }
        .res-content :global(pre code) { background: none; padding: 0; }
        .res-content :global(ul), .res-content :global(ol) { padding-left: 24px; margin-bottom: 16px; }
        .res-content :global(li) { margin-bottom: 8px; }
        .res-content :global(strong) { color: var(--text-h); }
        
        .res-actions { display: flex; gap: 16px; flex-wrap: wrap; padding-bottom: 80px; }
        @media (max-width: 768px) {
          .res-content { padding: 24px; }
          .preview-banner { font-size: 0.75rem; }
        }
      `}</style>
    </div>
  );
}
