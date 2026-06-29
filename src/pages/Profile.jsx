import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchProfile, updateProfileApi, changePasswordApi, resetPasswordApi, exportUserDataApi } from "../utils/api";
import { useAuth } from "../context/AuthContext";

function Profile() {
  const { logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState({
    fullName: "Jane Doe",
    email: "jane.doe@example.com",
    university: "State Technical University",
    degree: "B.Sc. Computer Science",
    semester: "Semester 5",
    cgpa: 3.85,
    preferences: { 
      theme: "light", 
      notifications: true,
      reminderNotifications: true,
      soundEffects: true,
      dailyStudyGoal: 4,
      pomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      defaultReminderTime: "09:00",
      weekStartsOn: "Monday"
    }
  });

  // Edit Profile Form State
  const [editForm, setEditForm] = useState({ ...user });
  const [saveLoading, setSaveLoading] = useState(false);
  const [prefsLoading, setPrefsLoading] = useState(false);

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
        // Merge with defaults in case of missing fields
        const loadedUser = {
          ...user,
          ...data.user,
          preferences: {
            ...user.preferences,
            ...(data.user.preferences || {})
          }
        };
        setUser(loadedUser);
        setEditForm(loadedUser);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (e) => {
    if(e) e.preventDefault();
    setSaveLoading(true);
    try {
      const updatedUser = await updateProfileApi(editForm);
      const mergedUser = { ...editForm, ...updatedUser };
      setUser(mergedUser);
      setEditForm(mergedUser);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleUpdatePreferences = async (e) => {
    if(e) e.preventDefault();
    setPrefsLoading(true);
    try {
      const updatedUser = await updateProfileApi(editForm);
      const mergedUser = { ...editForm, ...updatedUser };
      setUser(mergedUser);
      setEditForm(mergedUser);
      showToast("Preferences saved successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to save preferences", "error");
    } finally {
      setPrefsLoading(false);
    }
  };

  const handlePrefChange = (key, value) => {
    setEditForm(prev => ({
      ...prev,
      preferences: {
        ...prev.preferences,
        [key]: value
      }
    }));
  };

  const handleToggleTheme = async (newTheme) => {
    handlePrefChange('theme', newTheme);
    const updatedPrefs = { ...editForm.preferences, theme: newTheme };
    const updatedUser = { ...editForm, preferences: updatedPrefs };
    setUser(updatedUser);
    setEditForm(updatedUser);
    try {
      await updateProfileApi({ preferences: updatedPrefs });
      showToast(`Theme switched to ${newTheme}`, "success");
    } catch (err) {
      console.error("Failed to sync theme preference:", err);
    }
  };

  const handleToggleBooleanPref = async (key) => {
    const newValue = !editForm.preferences[key];
    handlePrefChange(key, newValue);
    const updatedPrefs = { ...editForm.preferences, [key]: newValue };
    const updatedUser = { ...editForm, preferences: updatedPrefs };
    setUser(updatedUser);
    setEditForm(updatedUser);
    try {
      await updateProfileApi({ preferences: updatedPrefs });
      showToast(`${key} updated`, "success");
    } catch (err) {
      console.error(`Failed to sync ${key}:`, err);
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

  // Parse semester numbers for academic journey
  const currentSem = parseInt(user.semester.replace(/[^0-9]/g, '')) || 5;
  const totalSem = 8;
  const progressPercent = Math.min(100, Math.round((currentSem / totalSem) * 100));

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

      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1040, paddingBottom: 40, margin: "0 auto" }}>
        
        {/* Profile Header */}
        <div className="card" style={{ padding: 32, display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: 24 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 24 }}>
            <div style={{
              width: 80,
              height: 80,
              borderRadius: "50%",
              background: "var(--primary)",
              color: "#FFF",
              fontSize: "2rem",
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
              <div style={{ display: "inline-block", background: "var(--primary-light)", color: "var(--primary)", fontSize: "0.75rem", fontWeight: 700, padding: "2px 8px", borderRadius: "12px", marginBottom: 8, letterSpacing: "0.5px", textTransform: "uppercase" }}>
                Student
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
              onClick={() => document.getElementById('personal-info-card').scrollIntoView({ behavior: 'smooth' })}
              className="btn btn-secondary"
              style={{ padding: "10px 20px", fontSize: "0.9rem" }}
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Two Column Layout for Cards */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: 32, alignItems: "stretch" }}>
          
          {/* Card 1: Personal Information */}
          <div id="personal-info-card" className="card" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Personal Information</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Update your profile details and academic standing.</p>

            <form onSubmit={handleUpdateProfile} style={{ display: "flex", flexDirection: "column", gap: 20, flex: 1 }}>
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
              
              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Degree / Program</label>
                <input
                  type="text"
                  value={editForm.degree || ""}
                  onChange={(e) => setEditForm({ ...editForm, degree: e.target.value })}
                  placeholder="e.g. B.Sc. Computer Science"
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

              <div style={{ marginTop: "auto", paddingTop: 16 }}>
                <button
                  type="submit"
                  disabled={saveLoading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "12px 24px" }}
                >
                  {saveLoading ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>

          {/* Card 2: Study Preferences */}
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Study Preferences</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Personalize your study sessions and timings.</p>

            <form onSubmit={handleUpdatePreferences} style={{ display: "flex", flexDirection: "column", gap: 24, flex: 1 }}>
              
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                  <label style={{ fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)" }}>Daily Study Goal</label>
                  <span style={{ fontSize: "0.85rem", color: "var(--primary)", fontWeight: 600 }}>{editForm.preferences?.dailyStudyGoal || 4} hours</span>
                </div>
                <input
                  type="range"
                  min="1" max="12" step="1"
                  value={editForm.preferences?.dailyStudyGoal || 4}
                  onChange={(e) => handlePrefChange('dailyStudyGoal', parseInt(e.target.value))}
                  style={{ width: "100%", accentColor: "var(--primary)" }}
                />
              </div>

              <div>
                <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Preferred Pomodoro Duration (mins)</label>
                <select
                  value={editForm.preferences?.pomodoroDuration || 25}
                  onChange={(e) => handlePrefChange('pomodoroDuration', parseInt(e.target.value))}
                  style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem" }}
                >
                  <option value={15}>15 Minutes</option>
                  <option value={25}>25 Minutes</option>
                  <option value={30}>30 Minutes</option>
                  <option value={45}>45 Minutes</option>
                  <option value={60}>60 Minutes</option>
                </select>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Short Break</label>
                  <select
                    value={editForm.preferences?.shortBreakDuration || 5}
                    onChange={(e) => handlePrefChange('shortBreakDuration', parseInt(e.target.value))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem" }}
                  >
                    <option value={5}>5 mins</option>
                    <option value={10}>10 mins</option>
                    <option value={15}>15 mins</option>
                  </select>
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Long Break</label>
                  <select
                    value={editForm.preferences?.longBreakDuration || 15}
                    onChange={(e) => handlePrefChange('longBreakDuration', parseInt(e.target.value))}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem" }}
                  >
                    <option value={15}>15 mins</option>
                    <option value={20}>20 mins</option>
                    <option value={30}>30 mins</option>
                  </select>
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Default Reminder</label>
                  <input
                    type="time"
                    value={editForm.preferences?.defaultReminderTime || "09:00"}
                    onChange={(e) => handlePrefChange('defaultReminderTime', e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem", boxSizing: "border-box" }}
                  />
                </div>
                <div>
                  <label style={{ display: "block", fontWeight: 600, fontSize: "0.85rem", color: "var(--text-heading)", marginBottom: 8 }}>Week Starts On</label>
                  <select
                    value={editForm.preferences?.weekStartsOn || "Monday"}
                    onChange={(e) => handlePrefChange('weekStartsOn', e.target.value)}
                    style={{ width: "100%", padding: "12px 16px", borderRadius: "var(--radius-sm)", border: "1px solid var(--border)", background: "var(--bg)", color: "var(--text-heading)", fontSize: "0.9rem" }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>
              </div>

              <div style={{ marginTop: "auto", paddingTop: 16 }}>
                <button
                  type="submit"
                  disabled={prefsLoading}
                  className="btn btn-primary"
                  style={{ width: "100%", padding: "12px 24px" }}
                >
                  {prefsLoading ? "Saving..." : "Save Preferences"}
                </button>
              </div>
            </form>
          </div>

          {/* Card 3: Account & Security */}
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Account & Security</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Manage your password and authentication.</p>

            <form onSubmit={handleChangePassword} style={{ display: "flex", flexDirection: "column", gap: 20, marginBottom: 32 }}>
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

              <div style={{ marginTop: 8 }}>
                <button
                  type="submit"
                  disabled={passwordLoading}
                  className="btn btn-secondary"
                  style={{ width: "100%", padding: "12px 24px" }}
                >
                  {passwordLoading ? "Updating..." : "Update Password"}
                </button>
              </div>
            </form>

            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 24, borderBottom: "1px solid var(--border-light)", marginBottom: 24 }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Two-Factor Authentication</div>
                <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Coming Soon</div>
              </div>
              <button type="button" disabled className="toggle-btn" style={{ opacity: 0.5, cursor: "not-allowed" }}>
                <div className="toggle-knob" />
              </button>
            </div>

            <div style={{ marginTop: "auto" }}>
              <button
                onClick={logout}
                className="btn btn-primary"
                style={{ width: "100%", padding: "12px 24px" }}
              >
                Logout
              </button>
            </div>
          </div>

          {/* Card 4: Appearance */}
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Appearance & Notifications</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Customize your interface and alerts.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
              
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Theme</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Select your preferred mode.</div>
                </div>
                <div style={{ display: "flex", gap: 4, background: "var(--bg-secondary)", padding: 4, borderRadius: "var(--radius-sm)" }}>
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("light")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: editForm.preferences?.theme === "light" ? "var(--card-bg)" : "transparent",
                      color: editForm.preferences?.theme === "light" ? "var(--text-heading)" : "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: editForm.preferences?.theme === "light" ? "var(--shadow-xs)" : "none"
                    }}
                  >
                    Light
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("dark")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: editForm.preferences?.theme === "dark" ? "var(--card-bg)" : "transparent",
                      color: editForm.preferences?.theme === "dark" ? "var(--text-heading)" : "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: editForm.preferences?.theme === "dark" ? "var(--shadow-xs)" : "none"
                    }}
                  >
                    Dark
                  </button>
                  <button
                    type="button"
                    onClick={() => handleToggleTheme("system")}
                    style={{
                      padding: "6px 12px",
                      borderRadius: "6px",
                      border: "none",
                      background: editForm.preferences?.theme === "system" ? "var(--card-bg)" : "transparent",
                      color: editForm.preferences?.theme === "system" ? "var(--text-heading)" : "var(--text-muted)",
                      fontWeight: 600,
                      fontSize: "0.8rem",
                      cursor: "pointer",
                      boxShadow: editForm.preferences?.theme === "system" ? "var(--shadow-xs)" : "none"
                    }}
                  >
                    System
                  </button>
                </div>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Enable Notifications</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Receive general alerts.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBooleanPref("notifications")}
                  className={`toggle-btn ${editForm.preferences?.notifications ? "on" : ""}`}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", paddingBottom: 20, borderBottom: "1px solid var(--border-light)" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Enable Reminder Notifications</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Get notified before tasks are due.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBooleanPref("reminderNotifications")}
                  className={`toggle-btn ${editForm.preferences?.reminderNotifications ? "on" : ""}`}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div>
                  <div style={{ fontWeight: 600, fontSize: "0.95rem", color: "var(--text-heading)", marginBottom: 4 }}>Sound Effects</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Play sounds on task completion.</div>
                </div>
                <button
                  type="button"
                  onClick={() => handleToggleBooleanPref("soundEffects")}
                  className={`toggle-btn ${editForm.preferences?.soundEffects ? "on" : ""}`}
                >
                  <div className="toggle-knob" />
                </button>
              </div>

            </div>
          </div>

          {/* Card 5: Academic Journey */}
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Academic Journey</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 32 }}>Track your overall progress.</p>

            <div style={{ textAlign: "center", marginBottom: 32 }}>
              <div style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600, textTransform: "uppercase", letterSpacing: "1px", marginBottom: 8 }}>Current Semester</div>
              <div style={{ fontSize: "2.5rem", fontWeight: 800, color: "var(--primary)", lineHeight: 1 }}>{currentSem} <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: 600 }}>of {totalSem}</span></div>
            </div>

            <div style={{ marginBottom: 24 }}>
              <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
                <span style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)" }}>Graduation Progress</span>
                <span style={{ fontSize: "0.85rem", fontWeight: 700, color: "var(--primary)" }}>{progressPercent}%</span>
              </div>
              <div style={{ width: "100%", height: 10, background: "var(--bg-secondary)", borderRadius: 5, overflow: "hidden" }}>
                <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--primary)", borderRadius: 5, transition: "width 0.5s ease" }}></div>
              </div>
            </div>

            <div style={{ marginTop: "auto", padding: 20, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)", textAlign: "center" }}>
              <div style={{ fontSize: "0.8rem", color: "var(--text-muted)", marginBottom: 4 }}>Expected Graduation Year</div>
              <div style={{ fontSize: "1.2rem", fontWeight: 700, color: "var(--text-heading)" }}>
                {new Date().getFullYear() + Math.ceil((totalSem - currentSem) / 2)}
              </div>
            </div>
          </div>

          {/* Card 6: Data Management */}
          <div className="card" style={{ padding: 32, display: "flex", flexDirection: "column", height: "fit-content" }}>
            <h2 style={{ fontSize: "1.1rem", fontWeight: 700, marginBottom: 4, color: "var(--text-heading)" }}>Data Management</h2>
            <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", marginBottom: 24 }}>Control your personal data and files.</p>

            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <button onClick={() => showToast("Downloading timetable...", "success")} className="btn" style={{ background: "var(--bg-secondary)", color: "var(--text-heading)", border: "1px solid var(--border-light)", padding: "12px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Download Timetable</span>
                <span style={{ color: "var(--text-muted)" }}>📅</span>
              </button>

              <button onClick={() => showToast("Downloading habits...", "success")} className="btn" style={{ background: "var(--bg-secondary)", color: "var(--text-heading)", border: "1px solid var(--border-light)", padding: "12px", textAlign: "left", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: 600, fontSize: "0.9rem" }}>Download Habit History</span>
                <span style={{ color: "var(--text-muted)" }}>📊</span>
              </button>
            </div>
          </div>



        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
