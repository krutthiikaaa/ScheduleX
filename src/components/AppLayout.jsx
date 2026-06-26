import { useState } from "react";
import Sidebar from "./Sidebar";

function AppLayout({ children }) {
  const [search, setSearch] = useState("");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="app-main">
        <div className="main-topbar" style={{ display: 'flex', justifyContent: 'flex-end', gap: '16px', alignItems: 'center', position: 'relative' }}>
          <div className="search-bar" style={{ margin: 0, position: 'relative' }}>
            <span>🔍</span>
            <input 
              type="text" 
              placeholder="Search across workspace..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onFocus={() => setIsFocused(true)}
              onBlur={() => setTimeout(() => setIsFocused(false), 200)}
            />
            {isFocused && search && (
              <div style={{ position: 'absolute', top: '120%', left: 0, right: 0, background: '#FFF', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: 16, boxShadow: 'var(--shadow-card)', zIndex: 1000 }}>
                <p style={{ margin: 0, fontSize: '0.85rem', color: 'var(--text-muted)' }}>Searching for "{search}"...</p>
                <p style={{ margin: '8px 0 0 0', fontSize: '0.85rem' }}>No results found across Courses, Assignments, or Resources.</p>
              </div>
            )}
          </div>
          <div className="topbar-actions">
            <div className="user-avatar" style={{ cursor: "pointer" }}>JD</div>
          </div>
        </div>
        {children}
      </main>
    </div>
  );
}

export default AppLayout;
