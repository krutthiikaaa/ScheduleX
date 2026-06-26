import { Link, useLocation } from "react-router-dom";
import { useState, useEffect, useRef } from "react";

function BottomDock() {
  const location = useLocation();
  const [visible, setVisible] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setVisible(y < lastScrollY.current || y < 60);
      lastScrollY.current = y;
    };
    const onMouse = (e) => {
      if (e.clientY > window.innerHeight - 100) setVisible(true);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("mousemove", onMouse, { passive: true });
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("mousemove", onMouse);
    };
  }, []);

  const items = [
    { path: "/dashboard", icon: "🏠", label: "Dashboard" },
    { path: "/view", icon: "📅", label: "Schedules" },
    { path: "/create", icon: "➕", label: "Create" },
    { path: "/analytics", icon: "📊", label: "Analytics" },
    { path: "/profile", icon: "👤", label: "Profile" },
  ];

  return (
    <nav className={`bottom-dock${visible ? "" : " hidden"}`}>
      <div className="dock-container">
        {items.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`dock-item${location.pathname === item.path ? " active" : ""}`}
          >
            <span className="dock-icon">{item.icon}</span>
            <span className="dock-label">{item.label}</span>
          </Link>
        ))}
      </div>
    </nav>
  );
}

export default BottomDock;
