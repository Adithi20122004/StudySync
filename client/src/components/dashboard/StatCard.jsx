// StatCard — shows a single KPI metric on the dashboard
// Props:
//   title: string        — label e.g. "Due This Week"
//   value: string|number — main number
//   icon: string         — emoji icon
//   variant: string      — "urgent" | "warning" | "success"
//   trend: string        — optional e.g. "+2 from last week"
//   trendUp: bool        — green if true, red if false

export default function StatCard({ title, value, icon, variant = 'urgent', trend, trendUp }) {
  return (
    <div className={`ss-stat-card ${variant}`}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <div className="ss-stat-label">{title}</div>
          <div className="ss-stat-value">{value}</div>
          {trend && (
            <div className={`ss-stat-change ${trendUp ? 'positive' : 'negative'}`}>
              {trendUp ? '↑' : '↓'} {trend}
            </div>
          )}
        </div>
        <div style={{ fontSize: '2rem', opacity: 0.8 }}>{icon}</div>
      </div>
    </div>
  );
}