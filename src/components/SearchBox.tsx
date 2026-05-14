'use client';

import { useState, useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRouter, usePathname } from 'next/navigation';
import Link from 'next/link';
import { ResourceService } from '@/lib/resource-service';

const REDIRECT_DELAY = 2800;
const VALID_CODES = ['dslogs-001', 'dslogs-002', 'dslogs-003'];

export default function SearchBox({ onToast }: { onToast?: (msg: string, type: 'success' | 'error') => void }) {
  const [input, setInput] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'unlocking' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    setStatus('idle');
  }, [pathname]);

  useEffect(() => {
    if (status !== 'idle') {
      const onReset = () => setStatus('idle');
      window.addEventListener('dslogs:reset-ui', onReset);
      return () => window.removeEventListener('dslogs:reset-ui', onReset);
    }
  }, [status]);

  const handleRedirect = useCallback((code: string) => {
    setTimeout(() => router.push(`/resource/${code.toLowerCase()}`), REDIRECT_DELAY);
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const code = input.trim();
    if (!code) {
      setStatus('error');
      setErrorMsg('Please enter your Dslogs code.');
      return;
    }

    setStatus('loading');
    setErrorMsg('');

    try {
      const resource = await ResourceService.getByCode(code);
      if (!resource) {
        setStatus('error');
        setErrorMsg('Code not found. Check spelling or follow @dslogs for the latest code!');
        onToast?.('Code not recognised. Try Dslogs-001!', 'error');
        return;
      }
      setStatus('unlocking');
      onToast?.('Resource unlocked! Redirecting…', 'success');
      handleRedirect(resource.code);
    } catch {
      setStatus('error');
      setErrorMsg('Something went wrong. Please try again.');
    }
  };

  const fillCode = (code: string) => {
    setInput(code);
    setStatus('idle');
    setErrorMsg('');
  };

  const isLocked = status === 'unlocking';
  const isBusy   = status === 'loading' || isLocked;

  return (
    <div className="sb-root">
      <form onSubmit={handleSubmit} className={`sb-form${status === 'error' ? ' shake' : ''}`}>
        <div className={`sb-wrap${isBusy ? ' busy' : ''}`}>
          {/* Prefix */}
          <span className="sb-prefix">Dslogs-</span>
          <input
            type="text"
            value={input}
            onChange={e => { setInput(e.target.value); if(status === 'error') setStatus('idle'); }}
            placeholder="001"
            disabled={isBusy}
            className="sb-input"
            autoComplete="off"
          />
          <button type="submit" className="sb-btn" disabled={isBusy}>
            {status === 'loading'
              ? <svg className="spin" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/></svg>
              : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M5 12h14M12 5l7 7-7 7"/></svg>
            }
            <span>{isBusy ? 'Unlocking…' : 'Unlock'}</span>
          </button>
        </div>

        <AnimatePresence>
          {status === 'error' && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              className="sb-error"
            >
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M12 8v4M12 16h.01"/></svg>
              {errorMsg}
              <Link href="/library" className="sb-browse">Browse Library →</Link>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {/* Quick fill badges */}
      <div className="sb-hints">
        <span className="sb-hint-label">Try:</span>
        {VALID_CODES.map(c => (
          <button key={c} onClick={() => fillCode(c)} className="code-pill sb-hint-pill">
            {c.replace('dslogs-', 'Dslogs-')}
          </button>
        ))}
      </div>

      {/* Unlock Overlay */}
      <AnimatePresence>
        {isLocked && <UnlockOverlay />}
      </AnimatePresence>

      <style jsx>{`
        .sb-root { width: 100%; }
        .sb-form { position: relative; }

        .sb-wrap {
          display: flex;
          align-items: center;
          background: var(--night-soft);
          border: 2px solid var(--border);
          border-radius: var(--r-full);
          padding: 8px 8px 8px 24px;
          transition: border-color 0.25s, box-shadow 0.25s, transform 0.25s;
        }
        .sb-wrap:focus-within {
          border-color: var(--kiwi);
          box-shadow: var(--shadow-kiwi);
          transform: translateY(-2px);
        }
        .sb-wrap.busy { opacity: 0.8; pointer-events: none; }

        .sb-prefix {
          font-family: var(--font-mono);
          font-weight: 700;
          font-size: 1.15rem;
          color: var(--kiwi);
          white-space: nowrap;
        }
        .sb-input {
          flex: 1;
          background: transparent;
          border: none;
          outline: none;
          font-family: var(--font-mono);
          font-size: 1.15rem;
          font-weight: 700;
          color: var(--text-h);
          min-width: 60px;
        }
        .sb-input::placeholder { color: var(--text-mute); font-weight: 400; }

        .sb-btn {
          display: flex;
          align-items: center;
          gap: 8px;
          background: var(--kiwi);
          color: #111;
          border: none;
          padding: 12px 22px;
          border-radius: var(--r-full);
          font-family: var(--font-head);
          font-weight: 700;
          font-size: 0.95rem;
          cursor: pointer;
          transition: background 0.2s, box-shadow 0.2s;
          white-space: nowrap;
        }
        .sb-btn:hover { background: var(--kiwi-bright); box-shadow: var(--shadow-kiwi); }
        .sb-btn:disabled { opacity: 0.7; cursor: not-allowed; }

        .sb-error {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-top: 14px;
          padding: 12px 20px;
          background: rgba(255, 77, 77, 0.08);
          border: 1px solid rgba(255, 77, 77, 0.3);
          border-radius: var(--r-md);
          color: var(--error);
          font-size: 0.9rem;
          font-weight: 600;
        }
        .sb-browse {
          margin-left: auto;
          color: var(--kiwi);
          font-size: 0.85rem;
          font-weight: 700;
          white-space: nowrap;
        }
        .sb-browse:hover { text-decoration: underline; }

        .sb-hints {
          display: flex;
          align-items: center;
          gap: 10px;
          margin-top: 20px;
          flex-wrap: wrap;
        }
        .sb-hint-label {
          font-size: 0.85rem;
          color: var(--text-mute);
          font-weight: 600;
        }
        .sb-hint-pill { font-size: 0.8rem; }

        .shake { animation: shake 0.45s cubic-bezier(.36,.07,.19,.97) both; }
        @keyframes shake {
          10%, 90% { transform: translate3d(-2px, 0, 0); }
          20%, 80% { transform: translate3d(3px, 0, 0); }
          30%, 50%, 70% { transform: translate3d(-5px, 0, 0); }
          40%, 60% { transform: translate3d(5px, 0, 0); }
        }
        .spin { animation: spin 0.8s linear infinite; }

        @media (max-width: 480px) {
          .sb-prefix { font-size: 1rem; }
          .sb-input { font-size: 1rem; }
          .sb-btn span { display: none; }
          .sb-btn { padding: 12px 16px; }
        }
      `}</style>
    </div>
  );
}

function UnlockOverlay() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      style={{
        position: 'fixed', inset: 0,
        background: 'rgba(0,0,0,0.9)',
        backdropFilter: 'blur(12px)',
        zIndex: 5000,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}
    >
      <motion.div
        initial={{ scale: 0.85, y: 30 }}
        animate={{ scale: 1, y: 0 }}
        style={{
          background: 'var(--night-soft)',
          border: '2px solid var(--kiwi)',
          borderRadius: 'var(--r-xl)',
          padding: '60px 48px',
          textAlign: 'center',
          maxWidth: 440,
          width: '90%',
          boxShadow: 'var(--shadow-kiwi-lg)',
        }}
      >
        {/* Animated lock icon */}
        <motion.div
          animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
          transition={{ duration: 1.5, repeat: Infinity }}
          style={{ fontSize: '4rem', marginBottom: 24 }}
        >
          🔓
        </motion.div>
        <h3 style={{ color: 'var(--kiwi)', marginBottom: 16, fontFamily: 'var(--font-head)' }}>
          Unlocking Resource
        </h3>
        {/* Progress bar */}
        <div style={{ background: 'var(--border)', borderRadius: 4, height: 6, overflow: 'hidden', marginBottom: 20 }}>
          <motion.div
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 2.8, ease: 'easeInOut' }}
            style={{ height: '100%', background: 'var(--kiwi)', borderRadius: 4 }}
          />
        </div>
        <p style={{ color: 'var(--text-mute)', fontSize: '0.9rem' }}>
          Verifying access code…
        </p>
      </motion.div>
    </motion.div>
  );
}
