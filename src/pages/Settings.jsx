import AppLayout from "../components/AppLayout";
import { useState } from "react";

function Settings() {
  const [notif, setNotif] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (
    <AppLayout>
      <div className="page-header">
        <h1>Settings</h1>
        <p>Manage your preferences and account</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 20 }}>General</h2>

          <div className="settings-row">
            <div>
              <div className="settings-label">Notifications</div>
              <div className="settings-desc">Receive schedule reminders and updates</div>
            </div>
            <button
              className={`toggle-btn${notif ? " on" : ""}`}
              onClick={() => setNotif(!notif)}
              id="toggle-notifications"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>

          <div className="settings-row">
            <div>
              <div className="settings-label">Dark Mode</div>
              <div className="settings-desc">Switch to a darker color theme</div>
            </div>
            <button
              className={`toggle-btn${darkMode ? " on" : ""}`}
              onClick={() => setDarkMode(!darkMode)}
              id="toggle-dark-mode"
            >
              <span className="toggle-knob"></span>
            </button>
          </div>
        </div>

        <div className="card" style={{ marginBottom: 20 }}>
          <h2 style={{ marginBottom: 20 }}>Account</h2>
          <div className="form-group">
            <label htmlFor="settings-email">Email Address</label>
            <input id="settings-email" className="form-input" defaultValue="jane@university.edu" />
          </div>
          <div className="form-group">
            <label htmlFor="settings-timezone">Timezone</label>
            <select id="settings-timezone" className="form-input form-select">
              <option>UTC+4 (Gulf Standard Time)</option>
              <option>UTC+0 (GMT)</option>
              <option>UTC-5 (EST)</option>
              <option>UTC+5:30 (IST)</option>
            </select>
          </div>
          <button className="btn btn-primary" style={{ marginTop: 8 }}>Save Changes</button>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 12, color: "#C24A3A" }}>Danger Zone</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem", marginBottom: 16 }}>
            Permanently delete your account and all associated data.
          </p>
          <button className="btn" style={{ background: "#FDECEB", color: "#C24A3A", border: "1px solid #F5D0CC" }}>
            Delete Account
          </button>
        </div>
      </div>
    </AppLayout>
  );
}

export default Settings;
