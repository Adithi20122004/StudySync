import { useState, useEffect } from 'react';
import KanbanBoard from '../components/tasks/KanbanBoard';
import { tasksAPI } from '../services/api';

export default function Tasks() {
  const [tasks,   setTasks]   = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchTasks() {
      try {
        const data = await tasksAPI.getAll();
        setTasks(data || []);
      } catch (err) {
        console.error('Tasks fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchTasks();
  }, []);

  async function handleStatusChange(taskId, newStatus) {
    setTasks((prev) => prev.map((t) => t._id === taskId ? { ...t, status: newStatus } : t));
    try {
      await tasksAPI.updateStatus(taskId, newStatus);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  }

  async function handleDeleteTask(taskId) {
    setTasks((prev) => prev.filter((t) => t._id !== taskId));
    try {
      await tasksAPI.delete(taskId);
    } catch (err) {
      console.error('Delete failed:', err);
    }
  }

  async function handleAddTask() {
    const title    = prompt('Task title:');
    if (!title) return;
    const subject  = prompt('Subject (e.g. DBMS, Web Dev, ML):') || '';
    const hours    = parseFloat(prompt('Hours spent on this subject this week (e.g. 3):') || '0');
    const priority = prompt('Priority (low / medium / high):') || 'medium';
    const dueDate  = prompt('Due date (YYYY-MM-DD):') || null;

    try {
      const newTask = await tasksAPI.create({
        title, subject, hours, priority, dueDate, status: 'todo',
      });
      setTasks((prev) => [newTask, ...prev]);
    } catch (err) {
      console.error('Create failed:', err);
    }
  }

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚙️</div>
          <p>Loading tasks…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
      <div className="ss-board-header">
        <h2 className="ss-board-title">📝 My Tasks</h2>
        <button className="ss-btn-primary" onClick={handleAddTask}>
          + Add Task
        </button>
      </div>
      <KanbanBoard
        tasks={tasks}
        onStatusChange={handleStatusChange}
        onDelete={handleDeleteTask}
        onEdit={(task) => console.log('Edit:', task)}
      />
    </div>
  );
}