import AppLayout from "../components/AppLayout";

function Analytics() {
  const stats = [
    { label: "Study Hours", value: "42h", sub: "This week", icon: "⏱️", accent: "terracotta" },
    { label: "Productivity Score", value: "87%", sub: "+5% vs last week", icon: "📈", accent: "sage" },
    { label: "Completed Tasks", value: "28", sub: "Out of 34", icon: "✅", accent: "clay" },
    { label: "Upcoming Tasks", value: "6", sub: "Next 7 days", icon: "📋", accent: "brown" },
  ];

  const weekData = [
    { day: "Mon", hours: 6, pct: 75 },
    { day: "Tue", hours: 7, pct: 87 },
    { day: "Wed", hours: 5, pct: 62 },
    { day: "Thu", hours: 8, pct: 100 },
    { day: "Fri", hours: 6, pct: 75 },
    { day: "Sat", hours: 3, pct: 37 },
    { day: "Sun", hours: 2, pct: 25 },
  ];

  const categories = [
    { name: "Computer Science", hours: 14, color: "var(--primary)" },
    { name: "Mathematics", hours: 10, color: "var(--accent)" },
    { name: "Physics", hours: 8, color: "var(--secondary)" },
    { name: "Engineering", hours: 6, color: "var(--cat-brown)" },
    { name: "Other", hours: 4, color: "var(--text-muted)" },
  ];

  const totalHours = categories.reduce((s, c) => s + c.hours, 0);

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Analytics</h1>
        <p>Track your productivity and study patterns</p>
      </div>

      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`stat-icon ${s.accent}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
            <div style={{ fontSize: "0.78rem", color: "var(--text-muted)", marginTop: 4 }}>{s.sub}</div>
          </div>
        ))}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 20, marginBottom: 24 }}>
        {/* Weekly Chart */}
        <div className="card" style={{ animationDelay: "320ms" }}>
          <h2 style={{ marginBottom: 4 }}>Weekly Study Hours</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Hours spent studying each day</p>
          <div className="bar-chart">
            {weekData.map((d) => (
              <div className="bar-col" key={d.day}>
                <div className="bar-value">{d.hours}h</div>
                <div className="bar-track">
                  <div className="bar-fill" style={{ height: `${d.pct}%` }}></div>
                </div>
                <div className="bar-label">{d.day}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Category Breakdown */}
        <div className="card" style={{ animationDelay: "400ms" }}>
          <h2 style={{ marginBottom: 4 }}>Category Breakdown</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Hours by subject area</p>
          <div className="category-list">
            {categories.map((c) => (
              <div className="category-item" key={c.name}>
                <div className="category-info">
                  <span className="category-dot" style={{ background: c.color }}></span>
                  <span>{c.name}</span>
                </div>
                <div className="category-bar-wrap">
                  <div className="category-bar" style={{ width: `${(c.hours / totalHours) * 100}%`, background: c.color }}></div>
                </div>
                <span className="category-hours">{c.hours}h</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Calendar Heatmap */}
      <div className="card" style={{ animationDelay: "480ms" }}>
        <h2 style={{ marginBottom: 4 }}>Productivity Heatmap</h2>
        <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>Your activity over the past 12 weeks</p>
        <div className="heatmap-grid">
          {Array.from({ length: 84 }, (_, i) => {
            const intensity = Math.random();
            const level = intensity < 0.2 ? 0 : intensity < 0.4 ? 1 : intensity < 0.65 ? 2 : intensity < 0.85 ? 3 : 4;
            return <div className={`heatmap-cell level-${level}`} key={i}></div>;
          })}
        </div>
        <div className="heatmap-legend">
          <span>Less</span>
          {[0,1,2,3,4].map((l) => <div className={`heatmap-cell level-${l}`} key={l}></div>)}
          <span>More</span>
        </div>
      </div>
    </AppLayout>
  );
}

export default Analytics;
