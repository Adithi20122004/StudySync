import { useState, useEffect } from 'react';
import StatCard      from '../components/dashboard/StatCard';
import TimelineCard  from '../components/dashboard/TimelineCard';
import WorkloadChart from '../components/dashboard/WorkloadChart';
import { dashboardAPI } from '../services/api';

export default function Dashboard() {
  const [stats,    setStats]    = useState(null);
  const [timeline, setTimeline] = useState([]);
  const [workload, setWorkload] = useState([]);
  const [loading,  setLoading]  = useState(true);

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        const [statsRes, timelineRes, workloadRes] = await Promise.all([
          dashboardAPI.getStats(),
          dashboardAPI.getTimeline(),
          dashboardAPI.getWorkload(),
        ]);
        setStats(statsRes);
        setTimeline(timelineRes);
        setWorkload(workloadRes);
        console.log('stats:', statsRes);    
        console.log('timeline:', timelineRes); 
        console.log('workload:', workloadRes); 
      } catch (err) {
        console.error('Dashboard fetch error:', err);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  const STAT_CARDS = stats ? [
    { title: 'Due This Week',   value: stats.dueThisWeek, icon: '⏰', variant: 'urgent'  },
    { title: 'Tasks Completed', value: stats.completed,   icon: '✅', variant: 'success' },
    { title: 'In Progress',     value: stats.inProgress,  icon: '⚡', variant: 'warning' },
    { title: 'Pending Reviews', value: stats.inReview,    icon: '👁', variant: 'urgent'  },
  ] : [];

  if (loading) {
    return (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '16rem', color: 'var(--text-muted)' }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>⚙️</div>
          <p>Loading your dashboard…</p>
        </div>
      </div>
    );
  }

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>

      <section className="ss-stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)' }}>
        {STAT_CARDS.map((stat) => (
          <StatCard key={stat.title} {...stat} />
        ))}
      </section>

      <section style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1.5rem' }}>
        <TimelineCard tasks={timeline} />
        <WorkloadChart data={workload} />
      </section>

    </div>
  );
}