import { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { tasksAPI } from '../../services/api';

const pageTitles = {
  '/':          'Dashboard',
  '/tasks':     'Tasks',
  '/calendar':  'Calendar',
  '/groups':    'Groups',
  '/resources': 'Resources',
};

export default function Topbar() {
  const { pathname } = useLocation();
  const title    = pageTitles[pathname] || 'StudySync';
  const userName = localStorage.getItem('userName') || 'Student';

  const [showNotifs, setShowNotifs] = useState(false);
  const [notifs, setNotifs]         = useState([]);
  const [unread, setUnread]         = useState(0);
  const dropdownRef = useRef(null);

  useEffect(() => {
    async function fetchNotifs() {
  try {
    const tasks = await tasksAPI.getAll();
    if (!tasks) return;

    const todayStr = new Date().toISOString().slice(0, 10);
    const notifications = [];

    tasks.forEach(t => {
      if (!t.dueDate || t.status === 'done') return;
      const dueStr = new Date(t.dueDate).toISOString().slice(0, 10);
      const diff   = Math.ceil((new Date(dueStr) - new Date(todayStr)) / 86400000);

      if (diff < 0) {
        notifications.push({ id: t._id, type: 'overdue', title: t.title, message: `Overdue by ${Math.abs(diff)} day${Math.abs(diff) > 1 ? 's' : ''}`, color: '#EF4444', icon: '🚨' });
      } else if (diff === 0) {
        notifications.push({ id: t._id, type: 'today', title: t.title, message: 'Due today!', color: '#F59E0B', icon: '⚠️' });
      } else if (diff <= 3) {
        notifications.push({ id: t._id, type: 'soon', title: t.title, message: `Due in ${diff} day${diff > 1 ? 's' : ''}`, color: '#6366F1', icon: '📌' });
      }
    });

    const order = { overdue: 0, today: 1, soon: 2 };
    notifications.sort((a, b) => order[a.type] - order[b.type]);

    setNotifs(notifications);
    setUnread(notifications.length);
  } catch (err) {
    console.error('Notifs error:', err);
  }
}
    fetchNotifs();
  }, []);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClick(e) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowNotifs(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, []);

  function handleOpenNotifs() {
    setShowNotifs(v => !v);
    setUnread(0);
  }

  return (
    <header style={{
      height: '64px', minHeight: '64px',
      background: 'var(--bg-surface)',
      display: 'flex', alignItems: 'center',
      justifyContent: 'space-between',
      padding: '0 1.5rem',
      position: 'sticky', top: 0, zIndex: 20,
      width: '100%', boxSizing: 'border-box',
    }}>

      {/* Left — welcome or empty */}
      <div>
        {title === 'Dashboard' && (
          <>
            <h1 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.5rem', color:'var(--text-primary)', margin:0 }}>
              Welcome back, {userName}! 👋
            </h1>
            <p style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'2px', marginBottom:0 }}>
              {new Date().toLocaleDateString('en-US', { weekday:'long', year:'numeric', month:'long', day:'numeric' })}
            </p>
          </>
        )}
      </div>

      {/* Right — bell + avatar */}
      <div style={{ display:'flex', alignItems:'center', gap:'1rem', flexShrink:0 }} ref={dropdownRef}>

        {/* Notification bell */}
        <div style={{ position:'relative' }}>
          <button
            onClick={handleOpenNotifs}
            style={{ position:'relative', padding:'0.5rem', borderRadius:'8px', background:'transparent', border:'none', cursor:'pointer', color:'var(--text-muted)', fontSize:'1.1rem' }}
          >
            🔔
            {unread > 0 && (
              <span style={{ position:'absolute', top:'4px', right:'4px', width:'16px', height:'16px', background:'var(--red)', borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.6rem', fontWeight:700, color:'#fff' }}>
                {unread > 9 ? '9+' : unread}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {showNotifs && (
            <div style={{
              position:'absolute', top:'calc(100% + 8px)', right:0,
              width:'320px', background:'var(--bg-surface)',
              border:'1px solid var(--border)', borderRadius:'12px',
              boxShadow:'0 20px 60px rgba(0,0,0,0.4)',
              zIndex:100, overflow:'hidden',
            }}>
              <div style={{ padding:'1rem 1.25rem', borderBottom:'1px solid var(--border)', display:'flex', alignItems:'center', justifyContent:'space-between' }}>
                <span style={{ fontWeight:700, fontSize:'0.9rem', color:'var(--text-primary)' }}>Notifications</span>
                <span style={{ fontSize:'0.75rem', color:'var(--text-muted)' }}>{notifs.length} alerts</span>
              </div>

              {notifs.length === 0 ? (
                <div style={{ padding:'2rem', textAlign:'center', color:'var(--text-muted)', fontSize:'0.875rem' }}>
                  <div style={{ fontSize:'1.5rem', marginBottom:'0.5rem' }}>🎉</div>
                  All caught up! No urgent tasks.
                </div>
              ) : (
                <div style={{ maxHeight:'320px', overflowY:'auto' }}>
                  {notifs.map(n => (
                    <div key={n.id} style={{
                      display:'flex', alignItems:'flex-start', gap:'0.75rem',
                      padding:'0.875rem 1.25rem',
                      borderBottom:'1px solid var(--border)',
                      borderLeft:`3px solid ${n.color}`,
                      transition:'background 0.15s',
                    }}
                      onMouseEnter={e => e.currentTarget.style.background='var(--bg-elevated)'}
                      onMouseLeave={e => e.currentTarget.style.background='transparent'}
                    >
                      <span style={{ fontSize:'1.1rem', flexShrink:0, marginTop:'1px' }}>{n.icon}</span>
                      <div>
                        <div style={{ fontSize:'0.825rem', fontWeight:600, color:'var(--text-primary)', marginBottom:'2px' }}>{n.title}</div>
                        <div style={{ fontSize:'0.75rem', color: n.color }}>{n.message}</div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              <div style={{ padding:'0.75rem 1.25rem', borderTop:'1px solid var(--border)', textAlign:'center' }}>
                <a href="/tasks" style={{ fontSize:'0.8rem', color:'var(--indigo)', fontWeight:600, textDecoration:'none' }}>View all tasks →</a>
              </div>
            </div>
          )}
        </div>

        {/* Avatar */}
        <div style={{ display:'flex', alignItems:'center', cursor:'pointer' }}>
          <div style={{ width:'36px', height:'36px', borderRadius:'50%', background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:700, fontSize:'0.9rem', flexShrink:0 }}>
            {userName[0]?.toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
}