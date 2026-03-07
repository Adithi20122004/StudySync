import { useState, useEffect } from 'react';

const API = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authHeader = () => ({ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` });

const TYPE_ICONS = { link:'🔗', pdf:'📄', doc:'📝', pptx:'📊', other:'📁' };
const COLOR_LIST = ['#6366F1','#F59E0B','#10B981','#EF4444','#8B5CF6','#06B6D4','#EC4899'];
const subjectColor = (subject, list) => {
  const idx = list.indexOf(subject);
  return COLOR_LIST[idx % COLOR_LIST.length] || '#6366F1';
};

function Modal({ title, onClose, children }) {
  return (
    <div style={{ position:'fixed', inset:0, background:'rgba(0,0,0,0.6)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:100, padding:'1rem' }}>
      <div style={{ background:'var(--bg-surface)', border:'1px solid var(--border)', borderRadius:'16px', padding:'2rem', width:'100%', maxWidth:'440px', boxShadow:'0 20px 60px rgba(0,0,0,0.5)' }}>
        <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
          <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.2rem', color:'var(--text-primary)' }}>{title}</h3>
          <button onClick={onClose} style={{ background:'transparent', border:'none', color:'var(--text-muted)', fontSize:'1.25rem', cursor:'pointer' }}>✕</button>
        </div>
        {children}
      </div>
    </div>
  );
}

const inputStyle = { width:'100%', background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.7rem 1rem', color:'var(--text-primary)', fontSize:'0.875rem', outline:'none', fontFamily:'var(--font-body)', boxSizing:'border-box' };
const labelStyle = { display:'block', fontSize:'0.75rem', fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase', letterSpacing:'0.05em', marginBottom:'0.4rem' };

export default function Resources() {
  const [resources, setResources] = useState([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState('All');
  const [search, setSearch]       = useState('');
  const [showAdd, setShowAdd]     = useState(false);
  const [error, setError]         = useState('');
  const [form, setForm]           = useState({ title:'', subject:'', type:'link', url:'' });

  useEffect(() => {
    fetch(`${API}/resources`, { headers: authHeader() })
      .then(r => r.json())
      .then(data => { setResources(data || []); setLoading(false); })
      .catch(() => setLoading(false));
  }, []);

  async function handleAdd() {
    if (!form.title) return setError('Title is required');
    if (!form.url)   return setError('URL is required');
    try {
      const res  = await fetch(`${API}/resources`, { method:'POST', headers: authHeader(), body: JSON.stringify(form) });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message);
      setResources(prev => [data, ...prev]);
      setShowAdd(false);
      setForm({ title:'', subject:'', type:'link', url:'' });
      setError('');
    } catch (err) { setError(err.message); }
  }

  async function handleDelete(id) {
    if (!confirm('Delete this resource?')) return;
    await fetch(`${API}/resources/${id}`, { method:'DELETE', headers: authHeader() });
    setResources(prev => prev.filter(r => r._id !== id));
  }

  const allSubjects = Array.from(new Set(resources.map(r => r.subject).filter(Boolean)));
  const subjects    = ['All', ...allSubjects];

  const filtered = resources.filter(r => {
    const matchSubject = filter === 'All' || r.subject === filter;
    const matchSearch  = r.title.toLowerCase().includes(search.toLowerCase());
    return matchSubject && matchSearch;
  });

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div className="ss-board-header">
        <h2 className="ss-board-title">📚 Resources</h2>
        <button className="ss-btn-primary" onClick={() => { setShowAdd(true); setError(''); }}>+ Add Resource</button>
      </div>

      {/* Search + Filter */}
      <div style={{ display:'flex', gap:'1rem', alignItems:'center', flexWrap:'wrap' }}>
        <input
          value={search} onChange={e => setSearch(e.target.value)}
          placeholder="🔍 Search resources…"
          style={{ ...inputStyle, flex:1, minWidth:'200px' }}
        />
        <div style={{ display:'flex', gap:'0.5rem', flexWrap:'wrap' }}>
          {subjects.map(s => (
            <button key={s} onClick={() => setFilter(s)} style={{
              padding:'0.375rem 0.875rem', borderRadius:'20px', fontSize:'0.8rem',
              fontWeight:600, cursor:'pointer', border:'none', fontFamily:'var(--font-body)',
              background: filter===s ? 'var(--indigo)' : 'var(--bg-surface)',
              color: filter===s ? '#fff' : 'var(--text-muted)',
              transition:'all 0.15s',
            }}>{s}</button>
          ))}
        </div>
      </div>

      {/* Resource list */}
      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>⚙️ Loading…</div>
      ) : filtered.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>📭</div>
          <div style={{ fontWeight:600, marginBottom:'0.25rem' }}>No resources found</div>
          <div style={{ fontSize:'0.875rem' }}>Click "+ Add Resource" to add your first one</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill,minmax(300px,1fr))', gap:'1rem' }}>
          {filtered.map(r => {
            const color = subjectColor(r.subject, allSubjects);
            return (
              <div key={r._id} className="ss-card" style={{ display:'flex', alignItems:'center', gap:'1rem' }}>
                <div style={{ width:44, height:44, borderRadius:'10px', background:color+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.4rem', flexShrink:0 }}>
                  {TYPE_ICONS[r.type] || '📁'}
                </div>
                <div style={{ flex:1, minWidth:0 }}>
                  <div style={{ fontWeight:600, fontSize:'0.875rem', color:'var(--text-primary)', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{r.title}</div>
                  <div style={{ display:'flex', gap:'0.5rem', marginTop:'0.25rem', alignItems:'center' }}>
                    {r.subject && <span style={{ fontSize:'0.7rem', background:color+'22', color, padding:'1px 6px', borderRadius:'4px', fontWeight:600 }}>{r.subject}</span>}
                    <span style={{ fontSize:'0.7rem', color:'var(--text-muted)', textTransform:'uppercase' }}>{r.type}</span>
                  </div>
                </div>
                <div style={{ display:'flex', gap:'0.375rem', flexShrink:0 }}>
                  <a href={r.url} target="_blank" rel="noreferrer" style={{ fontSize:'1rem', textDecoration:'none' }} title="Open">↗️</a>
                  <button onClick={() => handleDelete(r._id)} style={{ background:'transparent', border:'none', cursor:'pointer', fontSize:'1rem', color:'var(--red)' }} title="Delete">🗑️</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Add Resource Modal */}
      {showAdd && (
        <Modal title="Add Resource" onClose={() => { setShowAdd(false); setError(''); }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={labelStyle}>Title</label>
              <input style={inputStyle} placeholder="e.g. DBMS Notes Chapter 1" value={form.title} onChange={e => setForm(p=>({...p,title:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>URL / Link</label>
              <input style={inputStyle} type="url" placeholder="https://..." value={form.url} onChange={e => setForm(p=>({...p,url:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <input style={inputStyle} placeholder="e.g. DBMS, Web Dev, ML" value={form.subject} onChange={e => setForm(p=>({...p,subject:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>Type</label>
              <select style={inputStyle} value={form.type} onChange={e => setForm(p=>({...p,type:e.target.value}))}>
                <option value="link">🔗 Link</option>
                <option value="pdf">📄 PDF</option>
                <option value="doc">📝 Doc</option>
                <option value="pptx">📊 PPTX</option>
                <option value="other">📁 Other</option>
              </select>
            </div>
            {error && <div style={{ color:'var(--red)', fontSize:'0.875rem' }}>{error}</div>}
            <button onClick={handleAdd} className="ss-btn-primary" style={{ width:'100%', padding:'0.75rem', marginTop:'0.5rem' }}>Add Resource</button>
          </div>
        </Modal>
      )}
    </div>
  );
}