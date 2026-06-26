import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";

function Dashboard() {
  const stats = [
    { label: "Total Timetables", value: "5", icon: "📋", accent: "terracotta" },
    { label: "Active Schedules", value: "3", icon: "✅", accent: "sage" },
    { label: "Subjects", value: "12", icon: "📚", accent: "clay" },
    { label: "Faculty", value: "8", icon: "👤", accent: "brown" },
  ];

  const todaySchedule = [
    { time: "09:00", subject: "Data Structures", room: "A-201", color: "terracotta" },
    { time: "10:00", subject: "Linear Algebra", room: "B-105", color: "sage" },
    { time: "14:00", subject: "Computer Networks", room: "D-110", color: "clay" },
  ];

  const recentSchedules = [
    { title: "CS Department — Fall 2026", tag: "Active", tagColor: "sage", desc: "Last updated 2 days ago" },
    { title: "Math Department — Fall 2026", tag: "Draft", tagColor: "clay", desc: "Last updated 5 days ago" },
    { title: "Physics Lab Schedule", tag: "Active", tagColor: "sage", desc: "Last updated 1 week ago" },
  ];

  const activities = [
    { icon: "✏️", text: "Created Spring 2027 schedule", time: "2h ago" },
    { icon: "📝", text: "Updated Math timetable", time: "1d ago" },
    { icon: "✅", text: "Completed weekly study goal", time: "2d ago" },
  ];

  return (
    <AppLayout>
      {/* Welcome */}
      <div className="welcome-section">
        <div>
          <h1>Good morning, Jane 👋</h1>
          <p>Here's what's happening with your schedules today.</p>
        </div>
        <Link to="/create" className="btn btn-primary">+ New Schedule</Link>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        {stats.map((s, i) => (
          <div className="stat-card" key={s.label} style={{ animationDelay: `${i * 80}ms` }}>
            <div className={`stat-icon ${s.accent}`}>{s.icon}</div>
            <div className="stat-value">{s.value}</div>
            <div className="stat-label">{s.label}</div>
          </div>
        ))}
      </div>

      <div className="dashboard-grid">
        {/* Today's Schedule */}
        <div className="card" style={{ animationDelay: "320ms" }}>
          <h2 style={{ marginBottom: 4 }}>Today's Schedule</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 20 }}>Thursday, June 26</p>
          <div className="today-list">
            {todaySchedule.map((t) => (
              <div className="today-item" key={t.time}>
                <div className="today-time">{t.time}</div>
                <div className={`today-line ${t.color}`}></div>
                <div className="today-info">
                  <strong>{t.subject}</strong>
                  <span>Room {t.room}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Create */}
        <div className="card quick-create-card" style={{ animationDelay: "400ms" }}>
          <span style={{ fontSize: "2.5rem" }}>📝</span>
          <h3 style={{ marginTop: 12 }}>Quick Create</h3>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>Start building a new timetable in seconds</p>
          <Link to="/create" className="btn btn-primary" style={{ width: "100%" }}>Create Schedule</Link>
        </div>

        {/* Productivity Summary */}
        <div className="card" style={{ animationDelay: "480ms" }}>
          <h2 style={{ marginBottom: 4 }}>Productivity</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 16 }}>This week's summary</p>
          <div className="prod-row">
            <div className="prod-item">
              <div className="prod-circle" style={{ "--pct": "87%" }}>
                <span>87%</span>
              </div>
              <div className="prod-label">Score</div>
            </div>
            <div className="prod-item">
              <div className="prod-val">42h</div>
              <div className="prod-label">Study Hours</div>
            </div>
            <div className="prod-item">
              <div className="prod-val">28</div>
              <div className="prod-label">Tasks Done</div>
            </div>
          </div>
          <Link to="/analytics" style={{ fontSize: "0.85rem", marginTop: 12, display: "inline-block" }}>View Analytics →</Link>
        </div>
      </div>

      {/* Recent Schedules */}
      <div className="card" style={{ marginTop: 24, animationDelay: "560ms" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h2 style={{ marginBottom: 2 }}>Recent Timetables</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem" }}>Your most recently updated schedules</p>
          </div>
          <Link to="/view" className="btn btn-secondary">View All</Link>
        </div>
        <div className="schedule-grid">
          {recentSchedules.map((s, i) => (
            <div className="schedule-card" key={s.title} style={{ animationDelay: `${640 + i * 80}ms` }}>
              <div className="schedule-card-header">
                <h3>{s.title}</h3>
                <span className={`schedule-tag ${s.tagColor}`}>{s.tag}</span>
              </div>
              <p>{s.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Activity */}
      <div className="card" style={{ marginTop: 24, animationDelay: "720ms" }}>
        <h2 style={{ marginBottom: 16 }}>Recent Activity</h2>
        <div className="activity-list">
          {activities.map((a, i) => (
            <div className="activity-item" key={i}>
              <span className="activity-icon">{a.icon}</span>
              <div className="activity-info">
                <span>{a.text}</span>
                <span className="activity-time">{a.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;