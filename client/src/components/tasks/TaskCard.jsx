// TaskCard — all logic unchanged, only class names updated

const priorityConfig = {
  high:   { variant: 'urgent',  label: '🔴 High'   },
  medium: { variant: 'warning', label: '🟡 Medium' },
  low:    { variant: 'normal',  label: '🟢 Low'    },
};

export default function TaskCard({ task, onEdit, onDelete, dragHandlers }) {
  const cfg = priorityConfig[task.priority] || priorityConfig.medium;

  const dueDate  = task.dueDate ? new Date(task.dueDate) : null;
  const today    = new Date();
  const diffDays = dueDate ? Math.ceil((dueDate - today) / (1000 * 60 * 60 * 24)) : null;
  const overdue  = diffDays !== null && diffDays < 0;

  return (
    <div
      className={`ss-task-card ${task.status === 'done' ? 'done' : cfg.variant}`}
      style={{ cursor: 'grab', userSelect: 'none' }}
      {...dragHandlers}
    >
      {/* Header row */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '0.5rem', marginBottom: '0.5rem' }}>
        <div className={`ss-task-title${task.status === 'done' ? ' done' : ''}`} style={{ flex: 1, fontSize: '0.875rem' }}>
          {task.title}
        </div>
        <div style={{ display: 'flex', gap: '0.25rem', flexShrink: 0 }}>
          <button
            onClick={() => onEdit?.(task)}
            style={{ padding: '0.25rem', borderRadius: '4px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}
            title="Edit"
          >
            ✏️
          </button>
          <button
            onClick={() => onDelete?.(task._id)}
            style={{ padding: '0.25rem', borderRadius: '4px', background: 'transparent', border: 'none', cursor: 'pointer', fontSize: '0.75rem', color: 'var(--text-muted)' }}
            title="Delete"
          >
            🗑️
          </button>
        </div>
      </div>

      {/* Description */}
      {task.description && (
        <div className="ss-task-meta" style={{ marginBottom: '0.75rem', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
          {task.description}
        </div>
      )}

      {/* Priority + due date */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '0.5rem' }}>
        <span className={`ss-tag ${cfg.variant}`}>{cfg.label}</span>

        {dueDate && (
          <span style={{ fontSize: '0.75rem', fontWeight: 500, color: overdue ? 'var(--red)' : 'var(--text-muted)' }}>
            📅 {overdue ? 'Overdue' : diffDays === 0 ? 'Today' : dueDate.toLocaleDateString()}
          </span>
        )}
      </div>

      {/* Subject tag */}
      {task.subject && (
        <div style={{ marginTop: '0.5rem' }}>
          <span className="ss-tag course">{task.subject}</span>
        </div>
      )}
    </div>
  );
}