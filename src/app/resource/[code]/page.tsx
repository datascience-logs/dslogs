'use client';

import { useParams } from 'next/navigation';
import { Resource } from '@/lib/resources-data';
import { ResourceService } from '@/lib/resource-service';
import ReactMarkdown from 'react-markdown';
import { Instagram, ArrowLeft, Share2, Loader2, Copy, Check } from 'lucide-react';
import { SITE } from '@/lib/constants';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import remarkGfm from 'remark-gfm';

export default function ResourcePage() {
  const params = useParams();
  const code = params.code as string;
  const [resource, setResource] = useState<Resource | null>(null);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    async function loadResource() {
      const data = await ResourceService.getByCode(code);
      setResource(data || null);
      setLoading(false);
    }
    loadResource();
  }, [code]);

  const handleCopy = () => {
    if (!resource) return;
    navigator.clipboard.writeText(resource.code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleShare = () => {
    navigator.share?.({ title: resource?.title, url: window.location.href }).catch(() => {});
  };

  if (loading) {
    return (
      <div style={{paddingTop:140,textAlign:'center',color:'var(--text-mute)'}}>
        <Loader2 className="spin" size={48} />
        <p style={{marginTop:16}}>Loading resource…</p>
      </div>
    );
  }

  if (!resource) {
    return (
      <div style={{paddingTop:140,textAlign:'center'}}>
        <h2 style={{marginBottom:16}}>Resource Not Found</h2>
        <p style={{color:'var(--text-mute)',marginBottom:32}}>
          The code <span className="code-pill">{code}</span> doesn't match any resource.
        </p>
        <Link href="/library" className="btn btn-kiwi">Browse Library</Link>
      </div>
    );
  }

  return (
    <div className="res-page" style={{paddingTop:100}}>
      <div className="container">
        <motion.div initial={{opacity:0,y:20}} animate={{opacity:1,y:0}} transition={{duration:0.5}}>
          {/* Breadcrumb */}
          <Link href="/library" className="back-link">
            <ArrowLeft size={16}/> Back to Library
          </Link>

          {/* Header */}
          <div className="res-header">
            <div className="res-meta">
              <span className="section-label" style={{marginBottom:0}}>{resource.category}</span>
              <span className="code-pill" onClick={handleCopy} style={{cursor:'pointer'}}>
                {copied ? <Check size={14}/> : <Copy size={14}/>}
                {resource.code}
              </span>
            </div>
            <h1 style={{marginBottom:16}}>{resource.title}</h1>
            <p className="res-excerpt">{resource.excerpt}</p>
          </div>

          {/* Instagram Banner */}
          <div className="modal-instagram-banner" style={{marginBottom:40}}>
            <p>Love this? Follow {SITE.instagram.handle} for daily data science codes!</p>
            <a href={SITE.instagram.url} target="_blank" rel="noopener noreferrer" className="btn btn-kiwi" style={{padding:'8px 18px',fontSize:'0.85rem',whiteSpace:'nowrap'}}>
              <Instagram size={16}/> Follow
            </a>
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

          {/* Actions */}
          <div className="res-actions">
            <button onClick={handleShare} className="btn btn-outline">
              <Share2 size={16}/> Share
            </button>
            <Link href="/library" className="btn btn-kiwi">
              More Resources →
            </Link>
          </div>
        </motion.div>
      </div>

      <style jsx>{`
        .back-link {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          color: var(--text-mute);
          font-weight: 600;
          font-size: 0.9rem;
          margin-bottom: 32px;
          transition: color 0.2s;
        }
        .back-link:hover { color: var(--kiwi); }
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
        .res-content h1, .res-content h2, .res-content h3 { color: var(--kiwi); margin: 32px 0 16px; }
        .res-content p { margin-bottom: 16px; }
        .res-content code { background: var(--night-hard); color: var(--kiwi); padding: 2px 8px; border-radius: 4px; font-size: 0.9em; }
        .res-content pre { background: var(--night-hard); border: 1px solid var(--border); border-radius: var(--r-md); padding: 24px; overflow-x: auto; margin: 16px 0; }
        .res-content pre code { background: none; padding: 0; }
        .res-content ul, .res-content ol { padding-left: 24px; margin-bottom: 16px; }
        .res-content li { margin-bottom: 8px; }
        .res-content strong { color: var(--text-h); }
        .res-actions { display: flex; gap: 16px; flex-wrap: wrap; padding-bottom: 80px; }
        @media (max-width: 768px) {
          .res-content { padding: 24px; }
        }
      `}</style>
    </div>
  );
}
