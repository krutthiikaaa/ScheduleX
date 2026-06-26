import Sidebar from "../components/Sidebar";

function Dashboard() {
  const stats = [
    { label: "Total Timetables", value: "5", icon: "📋", accent: "terracotta" },
    { label: "Active Schedules", value: "3", icon: "✅", accent: "sage" },
    { label: "Subjects", value: "12", icon: "📚", accent: "clay" },
    { label: "Faculty", value: "8", icon: "👤", accent: "brown" },
  ];

  const recentSchedules = [
    { title: "CS Department — Fall 2026", tag: "Active", tagColor: "sage", desc: "Last updated 2 days ago" },
    { title: "Math Department — Fall 2026", tag: "Draft", tagColor: "clay", desc: "Last updated 5 days ago" },
    { title: "Physics Lab Schedule", tag: "Active", tagColor: "sage", desc: "Last updated 1 week ago" },
  ];

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Dashboard</h1>
          <p>Welcome back — here's your scheduling overview</p>
        </div>

        <div className="stats-grid">
          {stats.map((stat, i) => (
            <div
              className="stat-card"
              key={stat.label}
              style={{ animationDelay: `${i * 80}ms` }}
            >
              <div className={`stat-icon ${stat.accent}`}>{stat.icon}</div>
              <div className="stat-value">{stat.value}</div>
              <div className="stat-label">{stat.label}</div>
            </div>
          ))}
        </div>

        <div className="card" style={{ animationDelay: "320ms" }}>
          <h2 style={{ marginBottom: 4 }}>Recent Schedules</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 20 }}>
            Your most recently updated timetables
          </p>
          <div className="schedule-grid">
            {recentSchedules.map((sched, i) => (
              <div
                className="schedule-card"
                key={sched.title}
                style={{ animationDelay: `${400 + i * 80}ms` }}
              >
                <div className="schedule-card-header">
                  <h3>{sched.title}</h3>
                  <span className={`schedule-tag ${sched.tagColor}`}>{sched.tag}</span>
                </div>
                <p>{sched.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
}

export default Dashboard;