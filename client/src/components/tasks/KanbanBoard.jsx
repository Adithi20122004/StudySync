import { useState } from 'react';
import TaskCard from './TaskCard';

const COLUMNS = [
  { id: 'todo',        label: '📋 To Do',      borderColor: 'var(--border)'  },
  { id: 'in-progress', label: '⚡ In Progress', borderColor: 'var(--amber)'   },
  { id: 'review',      label: '👁 Review',      borderColor: 'var(--indigo)'  },
  { id: 'done',        label: '✅ Done',         borderColor: 'var(--green)'   },
];

export default function KanbanBoard({ tasks = [], onStatusChange, onEdit, onDelete }) {
  const [draggedTask, setDraggedTask] = useState(null);
  const [overColumn, setOverColumn]   = useState(null);

  function handleDragStart(task) {
    setDraggedTask(task);
  }

  function handleDragOver(e, columnId) {
    e.preventDefault();
    setOverColumn(columnId);
  }

  function handleDrop(columnId) {
    if (draggedTask && draggedTask.status !== columnId) {
      onStatusChange?.(draggedTask._id, columnId);
    }
    setDraggedTask(null);
    setOverColumn(null);
  }

  function handleDragEnd() {
    setDraggedTask(null);
    setOverColumn(null);
  }

  return (
    <div className="ss-kanban-board" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
      {COLUMNS.map((col) => {
        const colTasks = tasks.filter((t) => t.status === col.id);
        const isOver   = overColumn === col.id;

        return (
          <div
            key={col.id}
            onDragOver={(e) => handleDragOver(e, col.id)}
            onDrop={() => handleDrop(col.id)}
            className="ss-kanban-column"
            style={{
              borderTop: `4px solid ${col.borderColor}`,
              minHeight: '400px',
              display: 'flex',
              flexDirection: 'column',
              outline: isOver ? '2px solid rgba(99,102,241,0.4)' : 'none',
              background: isOver ? 'rgba(99,102,241,0.05)' : undefined,
              transition: 'background 0.15s, outline 0.15s',
            }}
          >
            {/* Column header */}
            <div className="ss-column-header" style={{ borderBottom: '1px solid var(--border)', padding: '0.75rem 1rem' }}>
              <span className="ss-column-title" style={{ fontSize: '0.875rem' }}>{col.label}</span>
              <span className="ss-column-count">{colTasks.length}</span>
            </div>

            {/* Cards */}
            <div style={{ flex: 1, padding: '0.75rem', display: 'flex', flexDirection: 'column', gap: '0.75rem', overflowY: 'auto' }}>
              {colTasks.map((task) => (
                <TaskCard
                  key={task._id}
                  task={task}
                  onEdit={onEdit}
                  onDelete={onDelete}
                  dragHandlers={{
                    draggable: true,
                    onDragStart: () => handleDragStart(task),
                    onDragEnd:   handleDragEnd,
                  }}
                />
              ))}

              {colTasks.length === 0 && (
                <div style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 0', color: 'var(--text-muted)', fontSize: '0.75rem', textAlign: 'center' }}>
                  Drop tasks here
                </div>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}