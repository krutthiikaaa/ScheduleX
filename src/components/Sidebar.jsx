import { Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();

  const navItems = [
    { path: "/dashboard", label: "Dashboard", icon: "📊" },
    { path: "/create", label: "Create", icon: "✏️" },
    { path: "/view", label: "View", icon: "📅" },
  ];

  return (
    <div className="sidebar">
      <div className="sidebar-brand">
        <div className="sidebar-logo">S</div>
        <h2>ScheduleX</h2>
      </div>

      <nav className="sidebar-nav">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar-link${location.pathname === item.path ? " active" : ""}`}
          >
            <span className="link-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}
      </nav>

      <div className="sidebar-bottom">
        <div className="sidebar-user">
          <div className="sidebar-avatar">JD</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">Jane Doe</div>
            <div className="sidebar-user-email">jane@university.edu</div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Sidebar;