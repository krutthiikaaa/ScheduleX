import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { user, logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Home", icon: "" },
    { path: "/timetable", label: "Schedule", icon: "" },
    { path: "/assignments", label: "Assignments", icon: "" },
    { path: "/habits", label: "Habits", icon: "" },
    { path: "/focus", label: "Pomodoro", icon: "" },
    { path: "/resources", label: "Library", icon: "" },
  ];

  const displayName = user?.fullName || "Jane Doe";
  const initials = displayName.split(" ").filter(Boolean).map(n => n[0]).join("").slice(0, 2).toUpperCase() || "JD";

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
        <Link to="/profile" className="user-profile-card" style={{ textDecoration: "none", color: "inherit", display: "flex", alignItems: "center", gap: "12px", cursor: "pointer" }}>
          <div className="user-avatar">{initials}</div>
          <div className="user-info">
            <span className="user-name">{displayName}</span>
            <span className="user-role">Student</span>
          </div>
        </Link>
        <button onClick={logout} className="sidebar-link" style={{ color: "var(--danger)", background: "transparent", border: "none", width: "100%", textAlign: "left", cursor: "pointer", fontFamily: "var(--font)", fontSize: "0.95rem", padding: "12px 16px" }}>
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;