import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchFocusSessions, fetchAssignments } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { logout } = useAuth();
  const [focusStats, setFocusStats] = useState({ count: 0, minutes: 0 });
  const [assignmentStats, setAssignmentStats] = useState(0);

  const [darkMode, setDarkMode] = useState(false);
  const [notifications, setNotifications] = useState(true);

  useEffect(() => {
    fetchFocusSessions().then(data => {
      const minutes = data.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      setFocusStats({ count: data.length, minutes });
    });
    fetchAssignments().then(data => {
      setAssignmentStats(data.filter(a => a.status === 'Completed').length);
    });
  }, []);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Student Profile</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your academic information and settings.</p>
        </div>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
        
        {/* Personal Information */}
        <div className="card">
          <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Personal Information</h3>
          <div style={{ display: "flex", gap: 32, alignItems: "center" }}>
            <div style={{ width: 100, height: 100, borderRadius: "50%", background: "var(--primary)", color: "#FFF", fontSize: "2.5rem", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: "bold", flexShrink: 0 }}>JD</div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: "16px 32px", flex: 1 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Full Name</label>
                <div style={{ fontWeight: "bold" }}>Jane Doe</div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Email</label>
                <div style={{ fontWeight: "bold" }}>jane.doe@example.com</div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>University</label>
                <div style={{ fontWeight: "bold" }}>State Technical University</div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>Semester</label>
                <div style={{ fontWeight: "bold" }}>Semester 5</div>
              </div>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 4 }}>CGPA</label>
                <div style={{ fontWeight: "bold" }}>3.85</div>
              </div>
            </div>
          </div>
        </div>

        {/* Account */}
        <div className="card">
          <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Account</h3>
          <div style={{ display: "flex", gap: 16, flexWrap: "wrap" }}>
            <button className="btn btn-secondary">Edit Profile</button>
            <button className="btn btn-secondary">Change Password</button>
            <button className="btn btn-secondary">Reset Password</button>
          </div>
        </div>

        {/* Preferences */}
        <div className="card">
          <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Preferences</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: 4 }}>Theme Selection</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Switch between Light and Dark mode.</p>
              </div>
              <select className="form-input form-select" value={darkMode ? "dark" : "light"} onChange={e => setDarkMode(e.target.value === "dark")} style={{ width: 150 }}>
                <option value="light">Light Mode</option>
                <option value="dark">Dark Mode</option>
              </select>
            </div>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: 4 }}>Notification Preferences</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Receive alerts for upcoming deadlines and classes.</p>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ width: 20, height: 20, accentColor: "var(--primary)", cursor: "pointer" }} />
            </div>
          </div>
        </div>

        {/* Statistics */}
        <div className="card">
          <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Statistics</h3>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))", gap: 16 }}>
            <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>Study Streak 🔥</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>12 Days</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>Total Study Hours ⏱️</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{Math.round(focusStats.minutes / 60)} Hours</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>Completed Assignments ✅</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{assignmentStats}</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>Pomodoro Sessions 🍅</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{focusStats.count}</div>
            </div>
            <div style={{ padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", marginBottom: 8 }}>Weekly Productivity 📈</div>
              <div style={{ fontSize: "1.5rem", fontWeight: "bold" }}>85%</div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h3 style={{ marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>Account Actions</h3>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            <button className="btn btn-secondary" style={{ width: "fit-content" }}>Export User Data (JSON)</button>
            <button className="btn btn-secondary" onClick={logout} style={{ width: "fit-content", background: "var(--danger-light)", color: "var(--danger)", border: "none" }}>Logout</button>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default Profile;
