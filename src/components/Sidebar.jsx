import { Link, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Sidebar() {
  const location = useLocation();
  const { logout } = useAuth();

  const navItems = [
    { path: "/dashboard", label: "Home" },
    { path: "/timetable", label: "Timetable" },
    { path: "/assignments", label: "Assignments" },
    { path: "/tasks", label: "To-Do List" },
    { path: "/focus", label: "Focus Mode" },
    { path: "/resources", label: "Resources" },
    { path: "/analytics", label: "Analytics" },
    { path: "/profile", label: "Profile" },
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
          Logout
        </button>
      </div>
    </div>
  );
}

export default Sidebar;