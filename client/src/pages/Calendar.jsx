import { useState, useEffect } from 'react';
import { tasksAPI } from '../services/api';

const DAYS   = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const SUBJECT_COLORS = ['#6366F1','#F59E0B','#10B981','#EF4444','#8B5CF6','#06B6D4','#EC4899','#14B8A6'];
const colorFor = (subject, cache) => {
  if (!cache[subject]) {
    const idx = Object.keys(cache).length % SUBJECT_COLORS.length;
    cache[subject] = SUBJECT_COLORS[idx];
  }
  return cache[subject];
};

export default function Calendar() {
  const today = new Date();
  const [current, setCurrent] = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDate, setSelectedDate] = useState(null);
  const [tasks, setTasks] = useState([]);
  const colorCache = {};

  useEffect(() => {
    tasksAPI.getAll().then(data => setTasks(data || [])).catch(console.error);
  }, []);

  const { year, month } = current;
  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDay    = new Date(year, month, 1).getDay();

  function prevMonth() {
    setCurrent(({ year, month }) => month === 0 ? { year: year-1, month: 11 } : { year, month: month-1 });
  }
  function nextMonth() {
    setCurrent(({ year, month }) => month === 11 ? { year: year+1, month: 0 } : { year, month: month+1 });
  }

  function getTasksForDay(day) {
    const dateStr = `${year}-${String(month+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`;
    return tasks.filter(t => t.dueDate && t.dueDate.slice(0,10) === dateStr);
  }

  const selectedTasks = selectedDate ? getTasksForDay(selectedDate) : [];
  const upcoming = tasks
    .filter(t => { if (!t.dueDate) return false; const d = new Date(t.dueDate); const diff = (d-today)/86400000; return diff >= 0 && diff <= 14; })
    .sort((a,b) => new Date(a.dueDate)-new Date(b.dueDate));

  const cells = [];
  for (let i = 0; i < firstDay; i++) cells.push(null);
  for (let d = 1; d <= daysInMonth; d++) cells.push(d);

  const isToday = (day) => day === today.getDate() && month === today.getMonth() && year === today.getFullYear();

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:'1.5rem' }}>
      <div className="ss-board-header">
        <h2 className="ss-board-title">📅 Calendar</h2>
      </div>

      <div style={{ display:'grid', gridTemplateColumns:'1fr 280px', gap:'1.5rem', alignItems:'start' }}>

        {/* Calendar grid */}
        <div className="ss-card" style={{ padding:'1.5rem' }}>
          <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:'1.5rem' }}>
            <button onClick={prevMonth} style={{ background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.5rem 1rem', color:'var(--text-primary)', cursor:'pointer', fontSize:'1rem' }}>‹</button>
            <h3 style={{ fontFamily:'var(--font-display)', fontWeight:700, fontSize:'1.25rem', color:'var(--text-primary)' }}>{MONTHS[month]} {year}</h3>
            <button onClick={nextMonth} style={{ background:'var(--bg-base)', border:'1px solid var(--border)', borderRadius:'8px', padding:'0.5rem 1rem', color:'var(--text-primary)', cursor:'pointer', fontSize:'1rem' }}>›</button>
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px', marginBottom:'4px' }}>
            {DAYS.map(d => <div key={d} style={{ textAlign:'center', fontSize:'0.7rem', fontWeight:600, color:'var(--text-muted)', padding:'0.5rem 0', textTransform:'uppercase', letterSpacing:'0.05em' }}>{d}</div>)}
          </div>

          <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:'4px' }}>
            {cells.map((day, i) => {
              if (!day) return <div key={`e-${i}`} />;
              const dayTasks = getTasksForDay(day);
              const selected = selectedDate === day;
              const todayCell = isToday(day);
              return (
                <div key={day} onClick={() => setSelectedDate(selected ? null : day)} style={{
                  minHeight:'72px', padding:'0.375rem', borderRadius:'8px',
                  border: selected ? '2px solid var(--indigo)' : '2px solid transparent',
                  background: todayCell ? 'rgba(99,102,241,0.15)' : selected ? 'rgba(99,102,241,0.08)' : 'var(--bg-base)',
                  cursor:'pointer', transition:'all 0.15s', display:'flex', flexDirection:'column', gap:'2px',
                }}>
                  <div style={{ width:'24px', height:'24px', borderRadius:'50%', background: todayCell ? 'var(--indigo)' : 'transparent', display:'flex', alignItems:'center', justifyContent:'center', fontSize:'0.8rem', fontWeight: todayCell ? 700 : 500, color: todayCell ? '#fff' : 'var(--text-primary)' }}>{day}</div>
                  {dayTasks.slice(0,2).map(t => (
                    <div key={t._id} style={{ fontSize:'0.6rem', fontWeight:500, color:'#fff', background: colorFor(t.subject||'Other', colorCache), borderRadius:'3px', padding:'1px 4px', whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{t.title}</div>
                  ))}
                  {dayTasks.length > 2 && <div style={{ fontSize:'0.6rem', color:'var(--text-muted)' }}>+{dayTasks.length-2} more</div>}
                </div>
              );
            })}
          </div>
        </div>

        {/* Right panel */}
        <div style={{ display:'flex', flexDirection:'column', gap:'1rem' }}>
          {selectedDate && (
            <div className="ss-card">
              <div className="ss-card-title">{MONTHS[month]} {selectedDate}</div>
              {selectedTasks.length === 0
                ? <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', textAlign:'center', padding:'1rem 0' }}>No tasks due</p>
                : selectedTasks.map(t => (
                  <div key={t._id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.625rem 0.75rem', background:'var(--bg-base)', borderRadius:'8px', borderLeft:`3px solid ${colorFor(t.subject||'Other', colorCache)}`, marginBottom:'0.5rem' }}>
                    <div>
                      <div style={{ fontSize:'0.875rem', fontWeight:600, color:'var(--text-primary)' }}>{t.title}</div>
                      <div style={{ fontSize:'0.75rem', color:'var(--text-muted)', marginTop:'2px' }}>{t.subject || 'No subject'} · {t.priority}</div>
                    </div>
                  </div>
                ))
              }
            </div>
          )}

          <div className="ss-card">
            <div className="ss-card-title">🔜 Upcoming</div>
            {upcoming.length === 0
              ? <p style={{ color:'var(--text-muted)', fontSize:'0.875rem', textAlign:'center', padding:'1rem 0' }}>No upcoming tasks</p>
              : upcoming.map(t => {
                const diff = Math.ceil((new Date(t.dueDate)-today)/86400000);
                return (
                  <div key={t._id} style={{ display:'flex', alignItems:'center', gap:'0.75rem', padding:'0.625rem 0.75rem', background:'var(--bg-base)', borderRadius:'8px', borderLeft:`3px solid ${colorFor(t.subject||'Other', colorCache)}`, marginBottom:'0.5rem' }}>
                    <div style={{ flex:1 }}>
                      <div style={{ fontSize:'0.8rem', fontWeight:600, color:'var(--text-primary)' }}>{t.title}</div>
                      <div style={{ fontSize:'0.7rem', color:'var(--text-muted)', marginTop:'2px' }}>{diff===0?'Today':diff===1?'Tomorrow':`In ${diff} days`}</div>
                    </div>
                    <span style={{ fontSize:'0.65rem', fontWeight:700, background: colorFor(t.subject||'Other',colorCache)+'22', color: colorFor(t.subject||'Other',colorCache), padding:'2px 6px', borderRadius:'4px', whiteSpace:'nowrap' }}>{t.subject||'—'}</span>
                  </div>
                );
              })
            }
          </div>
        </div>
      </div>
    </div>
  );
}