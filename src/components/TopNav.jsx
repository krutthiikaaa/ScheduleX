import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import { useFocus } from "../context/FocusContext";

function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);
  const location = useLocation();
  const focusContext = useFocus();

  const isActive = focusContext?.isActive || false;
  const timeLeft = focusContext?.timeLeft || 0;
  const duration = focusContext?.duration || 25;
  const formatTime = focusContext?.formatTime || ((s) => `${Math.floor(s/60)}:${s%60}`);

  const showFocusPill = (isActive || timeLeft < duration * 60) && location.pathname !== "/focus";

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link to="/dashboard" className="topnav-brand">
          <span className="topnav-logo">S</span>
          <span className="topnav-title">ScheduleX</span>
        </Link>
      </div>

      <div className="topnav-right" style={{ display: "flex", alignItems: "center", gap: 16 }}>
        {showFocusPill && (
          <Link 
            to="/focus" 
            style={{ 
              display: "flex", 
              alignItems: "center", 
              gap: 8, 
              background: isActive ? "rgba(214, 90, 49, 0.12)" : "var(--bg-secondary)", 
              border: `1.5px solid ${isActive ? "#D65A31" : "var(--border)"}`, 
              padding: "6px 14px", 
              borderRadius: "20px", 
              textDecoration: "none",
              color: "var(--text-heading)",
              fontWeight: 700,
              fontSize: "0.85rem",
              boxShadow: isActive ? "0 0 12px rgba(214, 90, 49, 0.25)" : "none",
              transition: "all 0.2s ease"
            }}
            title="Active Focus Session — Click to return"
          >
            <span style={{ 
              width: 8, 
              height: 8, 
              borderRadius: "50%", 
              background: isActive ? "#D65A31" : "var(--text-muted)",
              boxShadow: isActive ? "0 0 8px #D65A31" : "none" 
            }}></span>
            <span>Focus: {formatTime(timeLeft)}</span>
          </Link>
        )}

        <div className={`topnav-search${searchOpen ? " open" : ""}`}>
          <span className="search-icon"></span>
          <input
            type="text"
            placeholder="Search schedules, subjects…"
            className="search-input"
            onFocus={() => setSearchOpen(true)}
            onBlur={() => setSearchOpen(false)}
          />
          <kbd className="search-shortcut">⌘K</kbd>
        </div>
        <Link to="/profile" className="topnav-avatar" id="nav-profile">
          <span>JD</span>
        </Link>
      </div>
    </header>
  );
}

export default TopNav;
