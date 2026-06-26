import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/timetable", label: "Timetable", icon: "📅" },
    { path: "/subjects", label: "Subjects", icon: "📚" },
    { path: "/assignments", label: "Assignments", icon: "📝" },
    { path: "/notes", label: "Notes", icon: "📖" },
    { path: "/resources", label: "Resources", icon: "📂" },
    { path: "/attendance", label: "Attendance", icon: "📊" },
    { path: "/cgpa", label: "CGPA Tracker", icon: "🧮" },
    { path: "/exams", label: "Exams", icon: "📆" },
    { path: "/tasks", label: "Tasks & Goals", icon: "🎯" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
    { path: "/settings", label: "Settings", icon: "⚙️" },
    { path: "/profile", label: "Profile", icon: "👤" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-header">
        <div className="sidebar-logo">
          <div className="sidebar-logo-icon">S</div>
          ScheduleX
        </div>
        <div className="sidebar-tagline">Student Productivity Workspace</div>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link ${location.pathname === item.path ? "active" : ""}`}
          >
            <span>{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="user-profile-card">
          <div className="user-avatar">JD</div>
          <div className="user-info">
            <span className="user-name">Jane Doe</span>
            <span className="user-role">Student</span>
          </div>
        </div>
        <Link to="/settings" className="sidebar-link">
          <span>⚙️</span> Settings Shortcut
        </Link>
        <Link to="/login" className="sidebar-link" style={{ color: "var(--danger)" }}>
          <span>🚪</span> Logout
        </Link>
      </div>
    </div>
  );
}

export default Sidebar;