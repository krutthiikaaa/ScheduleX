import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "🏠" },
    { path: "/timetable", label: "Timetable", icon: "📅" },
    { path: "/resources", label: "Resources", icon: "📂" },
    { path: "/assignments", label: "Assignments", icon: "📝" },
    { path: "/tasks", label: "Tasks & Goals", icon: "🎯" },
    { path: "/focus", label: "Focus Mode", icon: "🍅" },
    { path: "/calendar", label: "Calendar", icon: "📆" },
    { path: "/analytics", label: "Analytics", icon: "📈" },
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
        <button onClick={logout} className="sidebar-link" style={{ color: "var(--danger)", background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "var(--font)", fontSize: "0.95rem", padding: "12px 16px" }}>
          <span>🚪</span> Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;