'use client';

import { useState, useEffect, useMemo, useCallback } from 'react';
import { useRouter, useSearchParams, usePathname } from 'next/navigation';
import { Resource, categories } from '@/lib/resources-data';
import { ResourceService } from '@/lib/resource-service';
import { supabase } from '@/lib/supabase';
import { 
  Plus, Edit, Trash2, LogOut, Save, X, ExternalLink, 
  Loader2, Search, Filter, Download, CheckSquare, 
  Square, BarChart3, List, AlertTriangle, Eye, EyeOff,
  Copy, Instagram, ArrowLeft, Share2, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { 
  BarChart, Bar, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import ImageUpload from '@/components/ImageUpload';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { atomDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { SITE } from '@/lib/constants';

import { Suspense } from 'react';

function AdminContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  
  const [session, setSession] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  
  // View is now managed by URL query param ?tab=...
  const currentTab = searchParams.get('tab') || 'list';
  const editingId = searchParams.get('id');

  const [resources, setResources] = useState<Resource[]>([]);
  const [isDataLoading, setIsDataLoading] = useState(false);

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);

  const IS_MOCK = !process.env.NEXT_PUBLIC_SUPABASE_URL;

  // Helper to change tabs without full refresh
  const setTab = (tab: string, id?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set('tab', tab);
    if (id) params.set('id', id);
    else params.delete('id');
    router.push(`${pathname}?${params.toString()}`);
  };

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (session || IS_MOCK) {
      loadResources();
    }
  }, [session]);

  const loadResources = async () => {
    setIsDataLoading(true);
    const data = await ResourceService.getAll();
    setResources(data);
    setIsDataLoading(false);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (IS_MOCK) {
      if (password === 'admin123') {
        setSession({ user: { email: 'admin@mock.com' } });
        toast.success('Mock login successful');
      } else {
        toast.error('Invalid mock password');
      }
      return;
    }

    setIsLoggingIn(true);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) {
      toast.error(error.message);
    } else {
      toast.success('Welcome back!');
    }
    setIsLoggingIn(false);
  };

  const handleLogout = async () => {
    if (IS_MOCK) {
      setSession(null);
    } else {
      await supabase.auth.signOut();
    }
    toast.success('Logged out');
  };

  const handleSave = async (data: any) => {
    let res;
    if (editingId) {
      res = await ResourceService.update(editingId, data);
      if (res) toast.success('Resource updated!');
    } else {
      res = await ResourceService.create(data);
      if (res) {
        toast.success(`Created! Code: ${res.code}`);
        navigator.clipboard.writeText(res.code);
      }
    }

    if (res) {
      await loadResources();
      setTab('list');
    } else {
      toast.error('Failed to save resource');
    }
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this resource?')) {
      const success = await ResourceService.delete(id);
      if (success) {
        toast.success('Deleted successfully');
        await loadResources();
      } else {
        toast.error('Delete failed');
      }
    }
  };

  const handleBulkDelete = async () => {
    if (confirm(`Are you sure you want to delete ${selectedIds.length} resources?`)) {
      const success = await ResourceService.bulkDelete(selectedIds);
      if (success) {
        toast.success(`Deleted ${selectedIds.length} items`);
        setSelectedIds([]);
        await loadResources();
      } else {
        toast.error('Bulk delete failed');
      }
    }
  };

  const filteredResources = useMemo(() => {
    return resources.filter(r => {
      const matchesSearch = 
        r.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        r.code.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCat = categoryFilter === 'All' || r.category === categoryFilter;
      return matchesSearch && matchesCat;
    });
  }, [resources, searchQuery, categoryFilter]);

  const chartData = useMemo(() => {
    const counts: Record<string, number> = {};
    resources.forEach(r => {
      counts[r.category] = (counts[r.category] || 0) + 1;
    });
    return Object.entries(counts).map(([name, value]) => ({ name, value }));
  }, [resources]);

  const editingResource = useMemo(() => {
    if (!editingId) return null;
    return resources.find(r => r.id === editingId) || null;
  }, [resources, editingId]);

  if (loading) return null;

  if (!session) {
    return (
      <div className="admin-login section-padding">
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="login-card glass">
            <h2>Admin Portal</h2>
            <p>{IS_MOCK ? 'Running in MOCK mode. Password: admin123' : 'Enter your credentials to manage resources.'}</p>
            <form onSubmit={handleLogin} className="login-form">
              {!IS_MOCK && (
                <div className="form-group">
                  <label>Email Address</label>
                  <input type="email" placeholder="admin@dslogs.com" value={email} onChange={(e) => setEmail(e.target.value)} required />
                </div>
              )}
              <div className="form-group">
                <label>Password</label>
                <input type="password" placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} required />
              </div>
              <button type="submit" className="btn btn-kiwi" style={{ width: '100%', marginTop: 20 }} disabled={isLoggingIn}>
                {isLoggingIn ? <Loader2 className="spin" size={20} /> : 'Login to Dashboard'}
              </button>
            </form>
          </motion.div>
        </div>
        <style jsx>{`
          .admin-login { display: flex; align-items: center; justify-content: center; min-height: 80vh; }
          .login-card { max-width: 440px; width: 100%; padding: 48px; text-align: center; }
          .login-card h2 { margin-bottom: 8px; font-family: var(--font-head); }
          .login-card p { margin-bottom: 32px; opacity: 0.7; font-size: 0.9rem; }
          .login-form { text-align: left; }
          .form-group { margin-bottom: 20px; }
          .form-group label { display: block; font-size: 0.85rem; font-weight: 600; margin-bottom: 8px; opacity: 0.8; }
          input { width: 100%; padding: 12px 16px; border-radius: 8px; border: 1px solid var(--border); background: var(--night-soft); color: var(--text-h); }
          .spin { animation: spin 1s linear infinite; }
          @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        `}</style>
      </div>
    );
  }

  return (
    <div className="admin-dashboard section-padding">
      <div className="container">
        {IS_MOCK && (
          <div className="mock-banner">
            <AlertTriangle size={18} />
            <span>Running in <strong>Mock Mode</strong>. Changes will not be saved permanently.</span>
          </div>
        )}

        <div className="admin-header">
          <div className="ah-left">
            <h1>Dslogs Control Center</h1>
            <p>Welcome back, <strong>{session.user.email}</strong></p>
          </div>
          <div className="ah-actions">
            <nav className="view-nav">
              <button className={currentTab === 'list' ? 'active' : ''} onClick={() => setTab('list')}><List size={18} /> Resources</button>
              <button className={currentTab === 'dashboard' ? 'active' : ''} onClick={() => setTab('dashboard')}><BarChart3 size={18} /> Analytics</button>
            </nav>
            <button className="btn btn-kiwi" onClick={() => setTab('create')}>
              <Plus size={18} /> New Resource
            </button>
            <button className="logout-btn" onClick={handleLogout} title="Logout">
              <LogOut size={20} />
            </button>
          </div>
        </div>

        {isDataLoading && currentTab === 'list' ? (
          <div className="loading-state">
            <Loader2 className="spin" size={48} />
            <p>Syncing with Supabase…</p>
          </div>
        ) : (
          <AnimatePresence mode="wait">
            {currentTab === 'list' && (
              <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="table-controls">
                  <div className="search-wrap">
                    <Search size={18} className="search-icon" />
                    <input type="text" placeholder="Search title or code..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} />
                  </div>
                  <div className="filter-wrap">
                    <Filter size={18} className="filter-icon" />
                    <select value={categoryFilter} onChange={(e) => setCategoryFilter(e.target.value)}>
                      {['All', ...categories.filter(c => c !== 'All')].map(c => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                  <div className="bulk-actions">
                    {selectedIds.length > 0 && (
                      <button className="btn btn-error" onClick={handleBulkDelete}><Trash2 size={16} /> Delete ({selectedIds.length})</button>
                    )}
                    <button className="btn btn-ghost" onClick={() => ResourceService.exportToCSV(filteredResources)}><Download size={16} /> Export CSV</button>
                  </div>
                </div>
                <ResourceList resources={filteredResources} selectedIds={selectedIds} onSelect={(id:string) => setSelectedIds(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id])} onSelectAll={() => setSelectedIds(selectedIds.length === filteredResources.length ? [] : filteredResources.map(r => r.id))} onEdit={(r:Resource) => setTab('edit', r.id)} onDelete={handleDelete} />
              </motion.div>
            )}

            {currentTab === 'dashboard' && (
              <motion.div key="dash" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <div className="stats-grid">
                  <div className="stat-card glass"><span className="stat-label">Total Resources</span><span className="stat-value">{resources.length}</span></div>
                  <div className="stat-card glass"><span className="stat-label">Active Codes</span><span className="stat-value">{resources.filter(r => r.code).length}</span></div>
                  <div className="stat-card glass"><span className="stat-label">Categories</span><span className="stat-value">{Object.keys(chartData).length}</span></div>
                </div>
                <div className="chart-container glass">
                  <h3>Resources by Category</h3>
                  <div style={{ height: 300, width: '100%' }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={chartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
                        <XAxis dataKey="name" stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <YAxis stroke="#888" fontSize={12} tickLine={false} axisLine={false} />
                        <Tooltip contentStyle={{ background: '#222', border: '1px solid #444', borderRadius: '8px' }} cursor={{ fill: 'rgba(137, 233, 0, 0.05)' }} />
                        <Bar dataKey="value" radius={[4, 4, 0, 0]}>
                          {chartData.map((entry, index) => <Cell key={`cell-${index}`} fill={index % 2 === 0 ? '#89E900' : '#76c700'} />)}
                        </Bar>
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </motion.div>
            )}

            {(currentTab === 'create' || currentTab === 'edit') && (
              <ResourceForm key={editingId || 'new'} resource={editingResource} onSave={handleSave} onCancel={() => setTab('list')} />
            )}
          </AnimatePresence>
        )}
      </div>
      <style jsx>{`
        .mock-banner { background: rgba(255, 122, 0, 0.1); border: 1px solid rgba(255, 122, 0, 0.3); color: #ff7a00; padding: 12px 20px; border-radius: 8px; margin-bottom: 24px; display: flex; align-items: center; gap: 12px; font-size: 0.9rem; }
        .admin-header { display: flex; justify-content: space-between; align-items: flex-end; margin-bottom: 48px; flex-wrap: wrap; gap: 24px; }
        .ah-left h1 { font-family: var(--font-head); margin-bottom: 4px; }
        .ah-left p { opacity: 0.6; font-size: 0.95rem; }
        .ah-actions { display: flex; align-items: center; gap: 20px; }
        .view-nav { display: flex; background: var(--night-soft); padding: 4px; border-radius: 10px; border: 1px solid var(--border); }
        .view-nav button { display: flex; align-items: center; gap: 8px; padding: 8px 16px; border-radius: 6px; border: none; background: transparent; color: var(--text-mute); font-size: 0.85rem; font-weight: 600; cursor: pointer; transition: 0.2s; }
        .view-nav button.active { background: #333; color: var(--kiwi); }
        .logout-btn { background: none; border: none; color: var(--text-mute); cursor: pointer; transition: 0.2s; }
        .logout-btn:hover { color: var(--error); }
        .table-controls { display: flex; gap: 16px; margin-bottom: 24px; flex-wrap: wrap; }
        .search-wrap, .filter-wrap { position: relative; display: flex; align-items: center; flex: 1; min-width: 200px; }
        .search-icon, .filter-icon { position: absolute; left: 12px; opacity: 0.4; }
        .search-wrap input, .filter-wrap select { width: 100%; padding: 10px 16px 10px 40px; background: var(--night-soft); border: 1px solid var(--border); border-radius: 8px; color: var(--text-h); font-size: 0.9rem; }
        .bulk-actions { display: flex; gap: 12px; }
        .btn-ghost { background: transparent; border: 1px solid var(--border); color: var(--text-mute); }
        .btn-error { background: rgba(255, 71, 71, 0.1); border: 1px solid rgba(255, 71, 71, 0.3); color: #ff4747; }
        .stats-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 24px; margin-bottom: 40px; }
        .stat-card { padding: 32px; text-align: center; }
        .stat-label { display: block; font-size: 0.85rem; color: var(--text-mute); text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 8px; }
        .stat-value { display: block; font-size: 2.5rem; font-weight: 800; font-family: var(--font-head); color: var(--kiwi); }
        .chart-container { padding: 32px; }
        .chart-container h3 { margin-bottom: 32px; font-family: var(--font-head); font-size: 1.1rem; }
        .loading-state { display: flex; flex-direction: column; align-items: center; justify-content: center; padding: 100px 0; gap: 20px; opacity: 0.5; }
        .spin { animation: spin 1s linear infinite; }
        @keyframes spin { from { transform: rotate(0deg); } to { transform: rotate(360deg); } }
        @media (max-width: 768px) { .stats-grid { grid-template-columns: 1fr; } .ah-actions { width: 100%; justify-content: space-between; } }
      `}</style>
    </div>
  );
}

export default function AdminPage() {
  return (
    <Suspense fallback={
      <div className="loading-state section-padding" style={{textAlign:'center', padding: '100px 0'}}>
        <Loader2 className="spin" size={48} style={{margin:'0 auto 20px'}} />
        <p>Loading Admin Portal…</p>
      </div>
    }>
      <AdminContent />
    </Suspense>
  );
}

function ResourceList({ resources, selectedIds, onSelect, onSelectAll, onEdit, onDelete }: any) {
  const allSelected = selectedIds.length === resources.length && resources.length > 0;
  const handleCopy = (e: React.MouseEvent, code: string) => { e.stopPropagation(); navigator.clipboard.writeText(code); toast.success('Code copied!'); };
  return (
    <div className="resource-table-container glass">
      <table className="resource-table">
        <thead>
          <tr>
            <th style={{ width: 40 }}><button className="checkbox-btn" onClick={onSelectAll}>{allSelected ? <CheckSquare size={18} color="#89E900" /> : <Square size={18} />}</button></th>
            <th>Code</th><th>Title</th><th>Category</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {resources.map((res: any) => (
            <tr key={res.id} className={selectedIds.includes(res.id) ? 'selected' : ''}>
              <td><button className="checkbox-btn" onClick={() => onSelect(res.id)}>{selectedIds.includes(res.id) ? <CheckSquare size={18} color="#89E900" /> : <Square size={18} />}</button></td>
              <td className="code-cell"><span onClick={(e) => handleCopy(e, res.code)} className="copyable-code">{res.code}</span></td>
              <td className="title-cell">{res.title}</td><td><span className="cat-badge">{res.category}</span></td>
              <td className="actions-cell">
                <button onClick={() => onEdit(res)} title="Edit"><Edit size={18} /></button>
                <button className="delete" onClick={() => onDelete(res.id)} title="Delete"><Trash2 size={18} /></button>
                <a href={`/resource/${res.code.toLowerCase()}`} target="_blank" title="View"><ExternalLink size={18} /></a>
              </td>
            </tr>
          ))}
          {resources.length === 0 && <tr><td colSpan={5} style={{ textAlign: 'center', padding: '60px', opacity: 0.5 }}>No resources found matching your filters.</td></tr>}
        </tbody>
      </table>
      <style jsx>{`
        .resource-table-container { overflow-x: auto; border-radius: 12px; }
        .resource-table { width: 100%; border-collapse: collapse; text-align: left; }
        th, td { padding: 16px 20px; border-bottom: 1px solid var(--border); }
        th { font-size: 0.75rem; text-transform: uppercase; letter-spacing: 0.1em; color: var(--text-mute); }
        tr:hover { background: rgba(255, 255, 255, 0.02); }
        tr.selected { background: rgba(137, 233, 0, 0.03); }
        .checkbox-btn { background: none; border: none; color: var(--text-mute); cursor: pointer; padding: 0; display: flex; align-items: center; }
        .code-cell { font-family: monospace; font-weight: 700; color: var(--kiwi); }
        .copyable-code { cursor: pointer; transition: opacity 0.2s; }
        .copyable-code:hover { opacity: 0.7; }
        .title-cell { font-weight: 500; min-width: 250px; }
        .cat-badge { background: #333; padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; color: var(--text-mute); }
        .actions-cell { display: flex; gap: 16px; }
        .actions-cell button, .actions-cell a { background: none; border: none; color: var(--text-mute); cursor: pointer; transition: 0.2s; }
        .actions-cell button:hover, .actions-cell a:hover { color: var(--kiwi); }
        .actions-cell .delete:hover { color: #ff4747; }
      `}</style>
    </div>
  );
}

function ResourceForm({ resource, onSave, onCancel }: any) {
  const [formData, setFormData] = useState({
    title: resource?.title || '',
    category: resource?.category || 'Python',
    excerpt: resource?.excerpt || '',
    content: resource?.content || '',
    instagram_url: resource?.instagram_url || '',
    pdf_url: resource?.pdf_url || ''
  });
  const [hasChanges, setHasChanges] = useState(false);
  const [showLivePreview, setShowLivePreview] = useState(false);

  const handleFullPreview = () => {
    // Save current unsaved form data to sessionStorage
    sessionStorage.setItem('dslogs_preview_data', JSON.stringify({
      ...formData,
      code: resource?.code || 'Dslogs-XXX',
      date: new Date().toISOString().split('T')[0]
    }));
    // Open the dedicated preview page in a new tab
    window.open('/admin/preview', '_blank');
  };

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasChanges) {
        e.preventDefault();
        e.returnValue = '';
      }
    };
    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [hasChanges]);

  const handleChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setHasChanges(true);
  };

  const handleImageUpload = (url: string) => {
    const markdownImage = `\n![Image](${url})\n`;
    handleChange('content', formData.content + markdownImage);
  };

  return (
    <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="resource-form-container glass">
      <div className="form-header">
        <h2>{resource ? 'Update Resource' : 'Create New Resource'}</h2>
        <div className="fh-actions">
          <button type="button" onClick={handleFullPreview} className="btn btn-outline" style={{ marginRight: 12 }}><Eye size={18} /> Full Preview</button>
          <button type="button" onClick={onCancel} className="close-btn"><X size={24} /></button>
        </div>
      </div>

      <form onSubmit={(e) => { e.preventDefault(); setHasChanges(false); onSave(formData); }} className="admin-form">
        <div className="form-grid">
          <div className="form-group">
            <label>Resource Title</label>
            <input type="text" required value={formData.title} onChange={e => handleChange('title', e.target.value)} placeholder="e.g., Master SQL Joins" />
          </div>
          <div className="form-group">
            <label>Category</label>
            <select value={formData.category} onChange={e => handleChange('category', e.target.value)}>
              {categories.filter(c => c !== 'All').map(c => <option key={c}>{c}</option>)}
            </select>
          </div>
        </div>

        <div className="form-group">
          <label>Short Excerpt</label>
          <textarea rows={2} required value={formData.excerpt} onChange={e => handleChange('excerpt', e.target.value)} placeholder="A brief summary for the card..." />
        </div>

        <div className="form-group">
          <div className="md-header">
            <label style={{ marginBottom: 0 }}>Markdown Content</label>
            <div className="md-actions">
              <button type="button" onClick={() => setShowLivePreview(!showLivePreview)} className={`toggle-preview ${showLivePreview ? 'active' : ''}`}>
                {showLivePreview ? <EyeOff size={16} /> : <Eye size={16} />}
                {showLivePreview ? 'Hide Preview' : 'Live Preview'}
              </button>
              <ImageUpload onUpload={handleImageUpload} />
            </div>
          </div>
          
          <div className="markdown-split">
            <textarea 
              rows={12} required className="markdown-area" 
              value={formData.content} onChange={e => handleChange('content', e.target.value)} 
              placeholder="# Use Markdown here..." 
            />
            {showLivePreview && (
              <div className="live-preview-pane markdown-content">
                <ReactMarkdown remarkPlugins={[remarkGfm]} components={{
                  table({ children }) {
                    return <div className="table-container"><table>{children}</table></div>;
                  },
                  code({ node, inline, className, children, ...props }: any) {
                    const match = /language-(\w+)/.exec(className || '');
                    return !inline && match ? (<SyntaxHighlighter style={atomDark} language={match[1]} PreTag="div" {...props}>{String(children).replace(/\n$/, '')}</SyntaxHighlighter>) : (<code className={className} {...props}>{children}</code>);
                  }
                }}>{(formData.content || '_No content yet…_').replace(/\\n/g, '\n')}</ReactMarkdown>
              </div>
            )}
          </div>
        </div>

        <div className="form-grid">
          <div className="form-group">
            <label>Instagram URL</label>
            <input type="url" value={formData.instagram_url} onChange={e => handleChange('instagram_url', e.target.value)} placeholder="https://..." />
          </div>
          <div className="form-group">
            <label>PDF Path (Optional)</label>
            <input type="text" value={formData.pdf_url} onChange={e => handleChange('pdf_url', e.target.value)} placeholder="/files/..." />
          </div>
        </div>

        <div className="form-footer">
          <p className="code-hint">{resource ? `Editing: ${resource.code}` : 'Code will be generated automatically.'}</p>
          <div className="form-actions">
            <button type="button" onClick={onCancel} className="btn btn-ghost">Cancel</button>
            <button type="submit" className="btn btn-kiwi"><Save size={18} /> {resource ? 'Save Changes' : 'Create Resource'}</button>
          </div>
        </div>
      </form>

      <style jsx>{`
        .resource-form-container { padding: 48px; max-width: 1000px; margin: 0 auto; position: relative; }
        .form-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 40px; }
        .fh-actions { display: flex; align-items: center; }
        .admin-form { display: flex; flex-direction: column; gap: 24px; }
        .form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 24px; }
        .form-group { display: flex; flex-direction: column; gap: 10px; }
        .form-group label { font-size: 0.9rem; font-weight: 600; opacity: 0.8; }
        .md-header { display: flex; justify-content: space-between; align-items: center; }
        .md-actions { display: flex; gap: 12px; }
        .toggle-preview { display: flex; align-items: center; gap: 8px; background: rgba(255,255,255,0.05); border: 1px solid var(--border); color: var(--text-mute); padding: 6px 12px; border-radius: 6px; font-size: 0.8rem; cursor: pointer; transition: 0.2s; }
        .toggle-preview.active { background: rgba(137, 233, 0, 0.1); border-color: var(--kiwi); color: var(--kiwi); }
        .markdown-split { display: grid; grid-template-columns: 1fr; gap: 20px; transition: 0.3s; }
        .markdown-split:has(.live-preview-pane) { grid-template-columns: 1fr 1fr; }
        input, select, textarea { padding: 14px 18px; border-radius: 10px; border: 1px solid var(--border); background: var(--night-soft); color: var(--text-h); font-family: inherit; }
        .markdown-area { font-family: 'JetBrains Mono', monospace; font-size: 0.85rem; line-height: 1.6; min-height: 300px; }
        .live-preview-pane { background: var(--night-hard); border: 1px solid var(--border); border-radius: 10px; padding: 24px; overflow-y: auto; max-height: 400px; }
        .form-footer { margin-top: 24px; padding-top: 32px; border-top: 1px solid var(--border); display: flex; justify-content: space-between; align-items: center; }
        .code-hint { font-size: 0.85rem; opacity: 0.5; font-weight: 600; }
        .form-actions { display: flex; gap: 12px; }
        .close-btn { background: none; border: none; cursor: pointer; color: var(--text-mute); }
        
        @media (max-width: 768px) { 
          .form-grid { grid-template-columns: 1fr; } 
          .markdown-split:has(.live-preview-pane) { grid-template-columns: 1fr; } 
        }
      `}</style>
    </motion.div>
  );
}
