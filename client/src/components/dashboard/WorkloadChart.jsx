// WorkloadChart — horizontal bar chart showing workload by subject

const COLORS = ['#6366F1', '#F59E0B', '#10B981', '#EF4444', '#8B5CF6', '#06B6D4'];

export default function WorkloadChart({ data = [] }) {
  const max = Math.max(...data.map((d) => d.hours), 1);

  return (
    <div className="ss-card">
      <div className="ss-card-title">📊 Workload This Week</div>

      {data.length === 0 ? (
        <div style={{ color: 'var(--text-muted)', fontSize: '0.875rem', textAlign: 'center', padding: '1rem 0' }}>
          No data yet
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {data.map((item, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem' }}>
                <span style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--text-muted)' }}>{item.subject}</span>
                <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-primary)' }}>{item.hours}h</span>
              </div>
              <div className="ss-progress-bar">
                <div
                  className="ss-progress-fill"
                  style={{
                    width: `${(item.hours / max) * 100}%`,
                    background: COLORS[i % COLORS.length],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Legend */}
      {data.length > 0 && (
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: '0.75rem',
          marginTop: '1rem', paddingTop: '1rem',
          borderTop: '1px solid var(--border)',
        }}>
          {data.map((item, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.375rem' }}>
              <div style={{ width: 10, height: 10, borderRadius: '50%', background: COLORS[i % COLORS.length], flexShrink: 0 }} />
              <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{item.subject}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}