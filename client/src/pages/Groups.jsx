import { useState, useEffect } from 'react';
import { groupsAPI } from '../services/api';

const COLORS = ['#6366F1','#F59E0B','#10B981','#EF4444','#8B5CF6','#06B6D4'];

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

export default function Groups() {
  const [groups, setGroups]         = useState([]);
  const [loading, setLoading]       = useState(true);
  const [showCreate, setShowCreate] = useState(false);
  const [showAddMember, setShowAddMember] = useState(null); 
  const [showAddTask, setShowAddTask]     = useState(null); 
  const [error, setError]           = useState('');

  const [newGroup, setNewGroup]     = useState({ name:'', subject:'', color:'#6366F1' });
  const [memberEmail, setMemberEmail] = useState('');
  const [newTask, setNewTask]       = useState({ title:'', priority:'medium', dueDate:'' });

  useEffect(() => {
    groupsAPI.getAll().then(data => { setGroups(data||[]); setLoading(false); }).catch(() => setLoading(false));
  }, []);

  async function handleCreateGroup() {
    if (!newGroup.name) return setError('Group name is required');
    try {
      const g = await groupsAPI.create(newGroup);
      setGroups(prev => [g, ...prev]);
      setShowCreate(false);
      setNewGroup({ name:'', subject:'', color:'#6366F1' });
      setError('');
    } catch (err) { setError(err.message); }
  }

  async function handleAddMember() {
    if (!memberEmail) return setError('Enter an email');
    try {
      const g = await groupsAPI.addMember(showAddMember, memberEmail);
      setGroups(prev => prev.map(gr => gr._id === showAddMember ? g : gr));
      setMemberEmail('');
      setShowAddMember(null);
      setError('');
    } catch (err) { setError(err.message); }
  }

  async function handleAddTask() {
    if (!newTask.title) return setError('Task title is required');
    try {
      const res = await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/groups/${showAddTask}/tasks`, {
        method:'POST',
        headers:{ 'Content-Type':'application/json', Authorization:`Bearer ${localStorage.getItem('token')}` },
        body: JSON.stringify(newTask),
      });
      const g = await res.json();
      setGroups(prev => prev.map(gr => gr._id === showAddTask ? g : gr));
      setNewTask({ title:'', priority:'medium', dueDate:'' });
      setShowAddTask(null);
      setError('');
    } catch (err) { setError(err.message); }
  }

  async function handleDeleteGroup(id) {
    if (!confirm('Delete this group?')) return;
    try {
      await fetch(`${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/groups/${id}`, {
        method:'DELETE',
        headers:{ Authorization:`Bearer ${localStorage.getItem('token')}` },
      });
      setGroups(prev => prev.filter(g => g._id !== id));
    } catch (err) { console.error(err); }
  }

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div className="ss-board-header">
        <h2 className="ss-board-title">👥 Groups</h2>
        <button className="ss-btn-primary" onClick={() => setShowCreate(true)}>+ New Group</button>
      </div>

      {loading ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>⚙️ Loading…</div>
      ) : groups.length === 0 ? (
        <div style={{ textAlign:'center', padding:'3rem', color:'var(--text-muted)' }}>
          <div style={{ fontSize:'2.5rem', marginBottom:'0.75rem' }}>👥</div>
          <div style={{ fontWeight:600, marginBottom:'0.25rem' }}>No groups yet</div>
          <div style={{ fontSize:'0.875rem' }}>Create a group to collaborate with classmates</div>
        </div>
      ) : (
        <div style={{ display:'grid', gridTemplateColumns:'repeat(auto-fill, minmax(300px,1fr))', gap:'1.5rem' }}>
          {groups.map(g => {
            const total     = g.tasks?.length || 0;
            const completed = g.tasks?.filter(t => t.status==='done').length || 0;
            const progress  = total ? Math.round((completed/total)*100) : 0;
            return (
              <div key={g._id} className="ss-card">
                {/* Header */}
                <div style={{ display:'flex', alignItems:'flex-start', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:'0.75rem' }}>
                    <div style={{ width:40, height:40, borderRadius:'10px', background:(g.color||'#6366F1')+'22', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'1.2rem' }}>👥</div>
                    <div>
                      <div style={{ fontWeight:700, color:'var(--text-primary)' }}>{g.name}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{g.subject || 'No subject'}</div>
                    </div>
                  </div>
                  <button onClick={() => handleDeleteGroup(g._id)} style={{ background:'transparent', border:'none', cursor:'pointer', color:'var(--red)', fontSize:'1rem' }} title="Delete">🗑️</button>
                </div>

                {/* Progress */}
                <div style={{ marginBottom:'1rem' }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'0.375rem' }}>
                    <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>Progress</span>
                    <span style={{ fontSize:'0.75rem', fontWeight:700, color:'var(--text-primary)' }}>{progress}%</span>
                  </div>
                  <div className="ss-progress-bar">
                    <div className="ss-progress-fill" style={{ width:`${progress}%`, background: g.color||'#6366F1' }} />
                  </div>
                </div>

                {/* Stats */}
                <div style={{ display:'flex', justifyContent:'space-between', marginBottom:'1rem' }}>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--text-primary)' }}>{total}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Tasks</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--green)' }}>{completed}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Done</div>
                  </div>
                  <div style={{ textAlign:'center' }}>
                    <div style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--text-primary)' }}>{g.members?.length||0}</div>
                    <div style={{ fontSize:'0.7rem', color:'var(--text-muted)' }}>Members</div>
                  </div>
                </div>

                {/* Member avatars */}
                <div style={{ display:'flex', alignItems:'center', gap:'0.375rem', marginBottom:'1rem' }}>
                  {(g.members||[]).slice(0,5).map((m,i) => (
                    <div key={i} title={m.name||m} style={{ width:28, height:28, borderRadius:'50%', background:`hsl(${i*60},60%,50%)`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.7rem', fontWeight:700, color:'#fff', border:'2px solid var(--bg-surface)', marginLeft:i>0?'-6px':0 }}>
                      {(m.name||m||'?')[0].toUpperCase()}
                    </div>
                  ))}
                </div>

                {/* Actions */}
                <div style={{ display:'flex', gap:'0.5rem' }}>
                  <button onClick={() => { setShowAddMember(g._id); setError(''); }} style={{ flex:1, padding:'0.5rem', borderRadius:'8px', background:'rgba(99,102,241,0.1)', border:'1px solid rgba(99,102,241,0.2)', color:'var(--indigo)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>+ Member</button>
                  <button onClick={() => { setShowAddTask(g._id); setError(''); }} style={{ flex:1, padding:'0.5rem', borderRadius:'8px', background:'rgba(16,185,129,0.1)', border:'1px solid rgba(16,185,129,0.2)', color:'var(--green)', fontSize:'0.8rem', fontWeight:600, cursor:'pointer' }}>+ Task</button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Create Group Modal */}
      {showCreate && (
        <Modal title="Create New Group" onClose={() => { setShowCreate(false); setError(''); }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={labelStyle}>Group Name</label>
              <input style={inputStyle} placeholder="e.g. Web Dev Team" value={newGroup.name} onChange={e => setNewGroup(p=>({...p,name:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>Subject</label>
              <input style={inputStyle} placeholder="e.g. DBMS, ML" value={newGroup.subject} onChange={e => setNewGroup(p=>({...p,subject:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>Color</label>
              <div style={{ display:'flex', gap:'0.5rem' }}>
                {COLORS.map(c => (
                  <div key={c} onClick={() => setNewGroup(p=>({...p,color:c}))} style={{ width:28, height:28, borderRadius:'50%', background:c, cursor:'pointer', border: newGroup.color===c ? '3px solid #fff' : '3px solid transparent', transition:'all 0.15s' }} />
                ))}
              </div>
            </div>
            {error && <div style={{ color:'var(--red)', fontSize:'0.875rem' }}>{error}</div>}
            <button onClick={handleCreateGroup} className="ss-btn-primary" style={{ width:'100%', padding:'0.75rem', marginTop:'0.5rem' }}>Create Group</button>
          </div>
        </Modal>
      )}

      {/* Add Member Modal */}
      {showAddMember && (
        <Modal title="Add Member" onClose={() => { setShowAddMember(null); setError(''); setMemberEmail(''); }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={labelStyle}>Member Email</label>
              <input style={inputStyle} type="email" placeholder="classmate@university.edu" autoComplete="off" value={memberEmail} onChange={e => setMemberEmail(e.target.value)} />
            </div>
            {error && <div style={{ color:'var(--red)', fontSize:'0.875rem' }}>{error}</div>}
            <button onClick={handleAddMember} className="ss-btn-primary" style={{ width:'100%', padding:'0.75rem' }}>Add Member</button>
          </div>
        </Modal>
      )}

      {/* Add Task Modal */}
      {showAddTask && (
        <Modal title="Add Group Task" onClose={() => { setShowAddTask(null); setError(''); setNewTask({ title:'', priority:'medium', dueDate:'' }); }}>
          <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
            <div>
              <label style={labelStyle}>Task Title</label>
              <input style={inputStyle} placeholder="e.g. Design the login page" value={newTask.title} onChange={e => setNewTask(p=>({...p,title:e.target.value}))} />
            </div>
            <div>
              <label style={labelStyle}>Priority</label>
              <select style={inputStyle} value={newTask.priority} onChange={e => setNewTask(p=>({...p,priority:e.target.value}))}>
                <option value="low">🟢 Low</option>
                <option value="medium">🟡 Medium</option>
                <option value="high">🔴 High</option>
              </select>
            </div>
            <div>
              <label style={labelStyle}>Due Date</label>
              <input style={inputStyle} type="date" value={newTask.dueDate} onChange={e => setNewTask(p=>({...p,dueDate:e.target.value}))} />
            </div>
            {error && <div style={{ color:'var(--red)', fontSize:'0.875rem' }}>{error}</div>}
            <button onClick={handleAddTask} className="ss-btn-primary" style={{ width:'100%', padding:'0.75rem' }}>Add Task</button>
          </div>
        </Modal>
      )}
    </div>
  );
}