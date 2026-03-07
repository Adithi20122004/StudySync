import { NavLink, useNavigate } from 'react-router-dom';
import { useState } from 'react';

const NAV_ITEMS = [
  { to: '/',          icon: '📊', label: 'Dashboard'  },
  { to: '/tasks',     icon: '📝', label: 'Tasks'       },
  { to: '/calendar',  icon: '📅', label: 'Calendar'    },
  { to: '/groups',    icon: '👥', label: 'Groups'      },
  { to: '/resources', icon: '📚', label: 'Resources'   },
];

export default function Sidebar({ collapsed, onToggle }) {
  const navigate  = useNavigate();
  const userName  = localStorage.getItem('userName') || 'Student';

  function handleLogout() {
    localStorage.removeItem('token');
    localStorage.removeItem('userName');
    navigate('/login');
  }

  return (
    <aside style={{
      width: collapsed ? '64px' : '240px',
      minHeight: '100vh',
      background: 'var(--bg-surface)',
      borderRight: '1px solid var(--border)',
      display: 'flex',
      flexDirection: 'column',
      transition: 'width 0.25s ease',
      overflow: 'hidden',
      flexShrink: 0,
    }}>

      {/* Logo */}
      <div style={{ padding: collapsed ? '1.25rem 0' : '1.25rem 1.25rem', display:'flex', alignItems:'center', gap:'0.75rem', justifyContent: collapsed ? 'center' : 'flex-start' }}>
        <div style={{ width:36, height:36, borderRadius:'10px', background:'linear-gradient(135deg,#6366F1,#8B5CF6)', display:'flex', alignItems:'center', justifyContent:'center', color:'#fff', fontWeight:900, fontSize:'1rem', flexShrink:0 }}>S</div>
        {!collapsed && <span style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.1rem', background:'linear-gradient(135deg,#818CF8,#8B5CF6)', WebkitBackgroundClip:'text', WebkitTextFillColor:'transparent' }}>StudySync</span>}
      </div>

      {/* Nav */}
      <nav style={{ flex:1, padding:'0.75rem 0.625rem', display:'flex', flexDirection:'column', gap:'0.25rem' }}>
        {NAV_ITEMS.map(({ to, icon, label }) => (
          <NavLink key={to} to={to} end={to==='/'} style={({ isActive }) => ({
            display:'flex', alignItems:'center', gap:'0.75rem',
            padding: collapsed ? '0.75rem 0' : '0.75rem 0.875rem',
            borderRadius:'10px', textDecoration:'none', fontWeight:600, fontSize:'0.875rem',
            justifyContent: collapsed ? 'center' : 'flex-start',
            background: isActive ? 'linear-gradient(135deg,rgba(99,102,241,0.2),rgba(139,92,246,0.2))' : 'transparent',
            color: isActive ? '#818CF8' : 'var(--text-muted)',
            borderLeft: isActive && !collapsed ? '3px solid #6366F1' : '3px solid transparent',
            transition: 'all 0.15s',
          })}>
            <span style={{ fontSize:'1.1rem', flexShrink:0 }}>{icon}</span>
            {!collapsed && label}
          </NavLink>
        ))}
      </nav>

      {/* Bottom */}
      <div style={{ padding:'0.75rem 0.625rem', borderTop:'1px solid var(--border)', display:'flex', flexDirection:'column', gap:'0.25rem' }}>
        {/* Collapse toggle */}
        <button onClick={onToggle} style={{
          display:'flex', alignItems:'center', gap:'0.75rem',
          padding: collapsed ? '0.75rem 0' : '0.75rem 0.875rem',
          borderRadius:'10px', background:'transparent', border:'none',
          color:'var(--text-muted)', fontWeight:600, fontSize:'0.875rem',
          cursor:'pointer', width:'100%', justifyContent: collapsed ? 'center' : 'flex-start',
          transition:'all 0.15s',
        }}>
          <span style={{ fontSize:'1.1rem' }}>{collapsed ? '→' : '←'}</span>
          {!collapsed && 'Collapse'}
        </button>

        {/* Logout */}
        <button onClick={handleLogout} style={{
          display:'flex', alignItems:'center', gap:'0.75rem',
          padding: collapsed ? '0.75rem 0' : '0.75rem 0.875rem',
          borderRadius:'10px', background:'transparent', border:'none',
          color:'var(--red)', fontWeight:600, fontSize:'0.875rem',
          cursor:'pointer', width:'100%', justifyContent: collapsed ? 'center' : 'flex-start',
          transition:'all 0.15s',
        }}>
          <span style={{ fontSize:'1.1rem' }}>🚪</span>
          {!collapsed && 'Logout'}
        </button>
      </div>
    </aside>
  );
}