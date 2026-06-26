import { Link } from "react-router-dom";
import { useState } from "react";

function TopNav() {
  const [searchOpen, setSearchOpen] = useState(false);

  return (
    <header className="topnav">
      <div className="topnav-left">
        <Link to="/dashboard" className="topnav-brand">
          <span className="topnav-logo">S</span>
          <span className="topnav-title">ScheduleX</span>
        </Link>
      </div>

      <div className="topnav-right">
        <div className={`topnav-search${searchOpen ? " open" : ""}`}>
          <span className="search-icon">🔍</span>
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
