import { useState } from "react";
import AppLayout from "../components/AppLayout";

function Settings() {
  const [notifications, setNotifications] = useState(true);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Settings</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your account preferences and application settings.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 32 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
          <button className="btn btn-primary" style={{ justifyContent: "flex-start" }}>General</button>
          <button className="btn btn-secondary" style={{ justifyContent: "flex-start", background: "transparent" }}>Notifications</button>
          <button className="btn btn-secondary" style={{ justifyContent: "flex-start", background: "transparent" }}>Privacy & Security</button>
          <button className="btn btn-secondary" style={{ justifyContent: "flex-start", background: "transparent" }}>Data Export</button>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Preferences</h3>
            
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "16px 0" }}>
              <div>
                <h4 style={{ margin: 0, marginBottom: 4 }}>Enable Notifications</h4>
                <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)" }}>Receive alerts for upcoming deadlines and classes.</p>
              </div>
              <input type="checkbox" checked={notifications} onChange={() => setNotifications(!notifications)} style={{ width: 20, height: 20, accentColor: "var(--primary)" }} />
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: 24 }}>Data Management</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button className="btn btn-secondary" style={{ width: "fit-content" }}>Export All Data (JSON)</button>
              <button className="btn btn-secondary" style={{ width: "fit-content", background: "var(--danger-light)", color: "var(--danger)" }}>Delete Account</button>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Settings;
