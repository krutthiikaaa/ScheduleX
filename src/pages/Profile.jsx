import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchProfile, updateProfileApi, changePasswordApi, resetPasswordApi, exportUserDataApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("overview"); // 'overview' | 'edit' | 'security'
  
  const [user, setUser] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    university: "State Technical University",
    semester: "Semester 5",
    cgpa: 3.85,
    preferences: { theme: "light", notifications: true }
  });

  const [stats, setStats] = useState({
    studyStreak: 12,
    totalStudyHours: 42,
    completedAssignments: 8,
    pomodoroSessions: 18,
    weeklyProductivity: 88
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...user });
  const [saveLoading, setSaveLoading] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "", confirmPassword: "" });
  const [passwordLoading, setPasswordLoading] = useState(false);

  // Toast Notifications
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  useEffect(() => {
    loadProfileData();
  }, []);

  useEffect(() => {
    if (user.preferences?.theme === "dark") {
      document.body.classList.add("dark-theme");
    } else {
      document.body.classList.remove("dark-theme");
    }
  }, [user.preferences?.theme]);

  const loadProfileData = async () => {
    setLoading(true);
    try {
      const data = await fetchProfile();
      if (data && data.user) {
        setUser(data.user);
        setEditForm(data.user);
      }
      if (data && data.stats) {
        setStats(data.stats);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    e.preventDefault();
    setSaveLoading(true);
    try {
      const updatedUser = await updateProfileApi(editForm);
      setUser(updatedUser);
      showToast("Profile updated successfully", "success");
      setActiveTab("overview");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleTheme = async (newTheme) => {
    const updatedPrefs = { ...user.preferences, theme: newTheme };
    const updatedUser = { ...user, preferences: updatedPrefs };
    setUser(updatedUser);
    setEditForm(updatedUser);
    try {
      await updateProfileApi({ preferences: updatedPrefs });
      showToast(`Theme switched to ${newTheme}`, "success");
    } catch (err) {
      console.error("Failed to sync theme preference:", err);
    }
  };

  const handleToggleNotifications = async () => {
    const newNotif = !user.preferences?.notifications;
    const updatedPrefs = { ...user.preferences, notifications: newNotif };
    const updatedUser = { ...user, preferences: updatedPrefs };
    setUser(updatedUser);
    setEditForm(updatedUser);
    try {
      await updateProfileApi({ preferences: updatedPrefs });
      showToast(newNotif ? "Notifications enabled" : "Notifications disabled", "success");
    } catch (err) {
      console.error("Failed to sync notification preference:", err);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      showToast("New passwords do not match", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword,
        newPassword: passwordForm.newPassword
      });
      showToast("Password changed successfully", "success");
      setPasswordForm({ currentPassword: "", newPassword: "", confirmPassword: "" });
    } catch (err) {
      showToast(err.message || "Failed to change password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm("Reset password to the default ('password123')?")) return;
    try {
      const res = await resetPasswordApi();
      showToast(res.message || "Password reset successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to reset password", "error");
    }
  };

  const handleExportData = async () => {
    try {
      showToast("Compiling user data...", "success");
      const exportData = await exportUserDataApi();
      const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: "application/json" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `ScheduleX_${user.fullName.replace(/\s+/g, '_')}_data.json`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      showToast("Data exported successfully", "success");
    } catch (err) {
      showToast("Failed to export user data", "error");
    }
  };

  const getInitials = (name) => {
    if (!name) return "U";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)" }}>Loading profile...</div>
      </AppLayout>
    );
  }

  return (
    <AppLayout>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          padding: "12px 20px",
          borderRadius: "var(--radius-sm)",
          background: toast.type === "error" ? "var(--danger)" : "var(--text-heading)",
          color: "var(--card-bg)",
          fontWeight: 600,
          fontSize: "0.85rem",
          boxShadow: "var(--shadow-lg)",
          animation: "fadeInUp 0.2s ease-out"
        }}>
          {toast.message}
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1040 }}>
        
        {/* Minimalist Profile Header Card */}
        <div className="card" style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{
              width: 72,
              height: 72,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#FFF",
              fontSize: "1.75rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: 700,
              flexShrink: 0
            }}>
              {getInitials(user.fullName)}
            </div>
            
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 4 }}>
                <h1 style={{ fontSize: "1.75rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>{user.fullName}</h1>
              </div>
              <p style={{ color: "var(--text-muted)", fontSize: "0.95rem", margin: 0, marginBottom: 8 }}>{user.email}</p>
              <div style={{ display: "flex", gap: 16, fontSize: "0.85rem", color: "var(--text-body)" }}>
                <span>{user.university}</span>
                <span>/</span>
                <span>{user.semester}</span>
                <span>/</span>
                <span style={{ fontWeight: 600, color: "var(--primary)" }}>CGPA {user.cgpa}</span>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={() => {
                setEditForm({ ...user });
                setActiveTab(activeTab === "edit" ? "overview" : "edit");
              }}
              className={activeTab === "edit" ? "btn btn-secondary" : "btn btn-primary"}
              style={{ padding: "10px 20px", fontSize: "0.9rem" }}
            >
              {activeTab === "edit" ? "Cancel Edit" : "Edit Profile"}
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div style={{ display: "flex", gap: 8, borderBottom: "1px solid var(--border-light)", paddingBottom: 12 }}>
          {[
            { id: "overview", label: "Overview" },
            { id: "edit", label: "Preferences" },
            { id: "security", label: "Security" }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              style={{
                padding: "8px 20px",
                borderRadius: "var(--radius-sm)",
                border: "none",
                background: activeTab === tab.id ? "var(--text-heading)" : "transparent",
                color: activeTab === tab.id ? "var(--card-bg)" : "var(--text-muted)",
                fontWeight: 600,
                fontSize: "0.9rem",
                cursor: "pointer",
                transition: "all 0.2s"
              }}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* TAB 1: OVERVIEW */}
        {activeTab === "overview" && (
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Academic Information Details */}
            <div className="card" style={{ padding: 32 }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24, paddingBottom: 16, borderBottom: "1px solid var(--border-light)" }}>
                <div>
                  <h2 style={{ fontSize: "1.1rem", fontWeight: 700, margin: 0 }}>Academic Information</h2>
                  <p style={{ margin: 0, fontSize: "0.85rem", color: "var(--text-muted)", marginTop: 4 }}>Registered institutional details</p>
                </div>
                <button
                  onClick={() => { setEditForm({ ...user }); setActiveTab("edit"); }}
                  className="btn btn-secondary"
                  style={{ padding: "6px 16px", fontSize: "0.85rem" }}
                >
                  Edit
                </button>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 28 }}>
                <div>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Full Name</span>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)" }}>{user.fullName}</div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Email Address</span>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)" }}>{user.email}</div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>University</span>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)" }}>{user.university}</div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Semester</span>
                  <div style={{ fontSize: "1rem", fontWeight: 600, color: "var(--text-heading)" }}>{user.semester}</div>
                </div>

                <div>
                  <span style={{ display: "block", fontSize: "0.75rem", color: "var(--text-muted)", fontWeight: 700, textTransform: "uppercase", letterSpacing: "0.5px", marginBottom: 6 }}>Cumulative GPA</span>
                  <div style={{ fontSize: "1rem", fontWeight: 700, color: "var(--primary)" }}>{user.cgpa}</div>
                </div>
              </div>
            </div>

          </div>
        )}

        {/* TAB 2: EDIT PREFERENCES */}
        {activeTab === "edit" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            
            {/* Edit Profile Form */}
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>Personal Information</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Update your profile details and academic standing.</p>

              <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Full Name</label>
                  <input
                    type="text"
                    required
                    value={editForm.fullName || ""}
                    onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Email Address</label>
                  <input
                    type="email"
                    required
                    value={editForm.email || ""}
                    onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>University</label>
                  <input
                    type="text"
                    value={editForm.university || ""}
                    onChange={(e) => setEditForm({ ...editForm, university: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                  <div>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Semester</label>
                    <input
                      type="text"
                      value={editForm.semester || ""}
                      onChange={(e) => setEditForm({ ...editForm, semester: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>

                  <div>
                    <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>CGPA</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="4.0"
                      value={editForm.cgpa || ""}
                      onChange={(e) => setEditForm({ ...editForm, cgpa: e.target.value })}
                      style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                    />
                  </div>
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={saveLoading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "12px 24px" }}
                  >
                    {saveLoading ? "Saving..." : "Save Changes"}
                  </button>
                </div>
              </form>
            </div>

            {/* System Preferences Card */}
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>System Preferences</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Manage your appearance and notification settings.</p>

              <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
                
                {/* Theme Selector */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Interface Theme</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Select your preferred appearance mode.</div>
                  </div>
                  <div style={{ display: "flex", gap: 4, background: "var(--bg-secondary)", padding: 4, borderRadius: "var(--radius-sm)" }}>
                    <button
                      type="button"
                      onClick={() => handleToggleTheme("light")}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: user.preferences?.theme !== "dark" ? "var(--card-bg)" : "transparent",
                        color: user.preferences?.theme !== "dark" ? "var(--text-heading)" : "var(--text-muted)",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        boxShadow: user.preferences?.theme !== "dark" ? "var(--shadow-xs)" : "none"
                      }}
                    >
                      Light
                    </button>
                    <button
                      type="button"
                      onClick={() => handleToggleTheme("dark")}
                      style={{
                        padding: "6px 16px",
                        borderRadius: "6px",
                        border: "none",
                        background: user.preferences?.theme === "dark" ? "var(--card-bg)" : "transparent",
                        color: user.preferences?.theme === "dark" ? "var(--text-heading)" : "var(--text-muted)",
                        fontWeight: 600,
                        fontSize: "0.8rem",
                        cursor: "pointer",
                        boxShadow: user.preferences?.theme === "dark" ? "var(--shadow-xs)" : "none"
                      }}
                    >
                      Dark
                    </button>
                  </div>
                </div>

                {/* Notifications Selector */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Deadline Alerts</div>
                    <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Receive notifications for classes and tasks.</div>
                  </div>
                  <button
                    type="button"
                    onClick={handleToggleNotifications}
                    className={`toggle-btn ${user.preferences?.notifications ? "on" : ""}`}
                  >
                    <div className="toggle-knob" />
                  </button>
                </div>

              </div>
            </div>

          </div>
        )}

        {/* TAB 3: SECURITY */}
        {activeTab === "security" && (
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: 24 }}>
            
            {/* Change Password Card */}
            <div className="card" style={{ padding: 32 }}>
              <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>Password & Security</h2>
              <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Update your password to keep your account secure.</p>

              <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 20 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Current Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.currentPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Confirm New Password</label>
                  <input
                    type="password"
                    required
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>

                <div style={{ display: "flex", gap: 12, marginTop: 8 }}>
                  <button
                    type="submit"
                    disabled={passwordLoading}
                    className="btn btn-primary"
                    style={{ flex: 1, padding: "12px 24px" }}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                  <button
                    type="button"
                    onClick={handleResetPassword}
                    className="btn btn-secondary"
                    style={{ padding: "12px 18px" }}
                  >
                    Reset Default
                  </button>
                </div>
              </form>
            </div>

            {/* Data Management & Actions */}
            <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", justify: "space-between", gap: 32 }}>
              <div>
                <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4 }}>Account Data</h2>
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Download your activity archives or sign out of your session.</p>

                <div style={{ padding: 20, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", marginBottom: 16 }}>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 6 }}>Export Archive</div>
                  <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, marginBottom: 16 }}>Download all your assignments, focus sessions, and schedule as a formatted JSON file.</p>
                  <button
                    onClick={handleExportData}
                    className="btn btn-secondary"
                    style={{ fontSize: "0.85rem", padding: "8px 16px" }}
                  >
                    Download Data
                  </button>
                </div>
              </div>

              <div style={{ padding: 20, background: "var(--danger-light)", borderRadius: "var(--radius-sm)", border: "1px solid rgba(217, 83, 79, 0.2)" }}>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--danger)", marginBottom: 6 }}>Sign Out</div>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)", margin: 0, marginBottom: 16 }}>Sign out of your active session on this device.</p>
                <button
                  onClick={logout}
                  style={{
                    padding: "10px 20px",
                    borderRadius: "var(--radius-btn)",
                    background: "var(--danger)",
                    color: "#FFF",
                    fontWeight: 600,
                    border: "none",
                    cursor: "pointer",
                    fontSize: "0.85rem"
                  }}
                >
                  Sign Out
                </button>
              </div>
            </div>

          </div>
        )}

      </div>
    </AppLayout>
  );
}

export default Profile;
