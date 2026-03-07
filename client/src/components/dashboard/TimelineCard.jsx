// TimelineCard — shows upcoming deadlines as a vertical timeline
// All logic unchanged — only class names updated to ss- design system

const priorityConfig = {
  high:   { dot: 'urgent' },
  medium: { dot: 'warning' },
  low:    { dot: 'normal' },
};

function TimelineItem({ task, isLast }) {
  const cfg = priorityConfig[task.priority] || priorityConfig.medium;
  const dueDate  = new Date(task.dueDate);
  const today    = new Date();
  const diffDays = Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24));

  const dueSoon = diffDays <= 2 && diffDays >= 0;
  const overdue = diffDays < 0;

  const badgeStyle = overdue
    ? { background: 'rgba(239,68,68,0.2)',  color: 'var(--red)' }
    : dueSoon
    ? { background: 'rgba(245,158,11,0.2)', color: 'var(--amber)' }
    : { background: 'rgba(99,102,241,0.1)', color: 'var(--text-muted)' };

  const dueLabel = overdue       ? 'Overdue'
                 : diffDays === 0 ? 'Today'
                 : diffDays === 1 ? 'Tomorrow'
                 : `${diffDays}d left`;

  return (
    <div className="ss-timeline-item" style={isLast ? { marginBottom: 0 } : {}}>
      <div className={`ss-timeline-dot ${cfg.dot}`} />
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '0.5rem' }}>
        <div className="ss-timeline-title" style={{ fontSize: '0.9rem' }}>{task.title}</div>
        <span style={{
          ...badgeStyle,
          fontSize: '0.7rem', fontWeight: 600,
          padding: '0.2rem 0.6rem', borderRadius: '12px', flexShrink: 0,
        }}>
          {dueLabel}
        </span>
      </div>
      <div className="ss-timeline-meta">{task.subject}</div>
    </div>
  );
}

export default function TimelineCard({ tasks = [] }) {
  return (
    <div className="ss-card" style={{ height: '100%' }}>
      <div className="ss-card-title">📅 Upcoming Deadlines</div>

      {tasks.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '2rem 0', color: 'var(--text-muted)' }}>
          <div style={{ fontSize: '2rem', marginBottom: '0.5rem' }}>🎉</div>
          <div style={{ fontSize: '0.875rem' }}>No upcoming deadlines!</div>
        </div>
      ) : (
        tasks.map((task, i) => (
          <TimelineItem key={task._id || i} task={task} isLast={i === tasks.length - 1} />
        ))
      )}
    </div>
  );
}