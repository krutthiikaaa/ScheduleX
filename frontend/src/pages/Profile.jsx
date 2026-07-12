import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import { fetchProfile, updateProfileApi, changePasswordApi } from "../services/api";
import { useAuth } from "../context/AuthContext";


const ToggleSwitch = ({ checked, onChange }) => (
  <div
    onClick={onChange}
    style={{
      width: 52,
      height: 28,
      borderRadius: 14,
      background: checked ? "#E85D2A" : "var(--border, #D1D5DB)",
      position: "relative",
      cursor: "pointer",
      transition: "background 0.2s ease",
      flexShrink: 0
    }}
  >
    <div
      style={{
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: "#FFFFFF",
        position: "absolute",
        top: 3,
        left: checked ? 27 : 3,
        transition: "left 0.2s ease",
        boxShadow: "0 2px 4px rgba(0,0,0,0.2)"
      }}
    />
  </div>
);

function Profile() {
  const { user: authUser, updateUser, logout } = useAuth();
  
  const [loading, setLoading] = useState(true);
  
  const [user, setUser] = useState({
    fullName: authUser?.fullName || "Jane Doe",
    email: authUser?.email || "jane.doe@university.edu",
    preferences: { 
      theme: "light", 
      notifications: true,
      dailyStudyGoal: 4,
      pomodoroDuration: 25,
      shortBreakDuration: 5,
      longBreakDuration: 15,
      profileVisibility: "Public",
      showOnlineStatus: true,
      dataSharing: false,
      searchability: true,
      weekStartsOn: "Monday"
    }
  });

  // Edit Profile Form State & Toggle
  const [editForm, setEditForm] = useState({ ...user });
  const [isEditing, setIsEditing] = useState(false);
  const [saveLoading, setSaveLoading] = useState(false);

  // Password Form State
  const [passwordForm, setPasswordForm] = useState({ currentPassword: "", newPassword: "" });
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
        const defaultPrefs = {
          theme: "light",
          notifications: true,
          dailyStudyGoal: 4,
          pomodoroDuration: 25,
          shortBreakDuration: 5,
          longBreakDuration: 15,
          profileVisibility: "Public",
          showOnlineStatus: true,
          dataSharing: false,
          searchability: true,
          weekStartsOn: "Monday"
        };
        const loadedUser = {
          ...user,
          ...data.user,
          preferences: {
            ...defaultPrefs,
            ...user.preferences,
            ...(data.user.preferences || {})
          }
        };
        setUser(loadedUser);
        setEditForm(loadedUser);
        if (updateUser) updateUser(loadedUser);
      }
    } catch (err) {
      console.error("Error fetching profile:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleEditToggleOrSave = async (e) => {
    if (e) e.preventDefault();
    if (!isEditing) {
      setIsEditing(true);
      showToast("Editing enabled. Modify your information below.", "success");
      return;
    }

    setSaveLoading(true);
    try {
      const updatedUser = await updateProfileApi(editForm);
      const mergedUser = { ...editForm, ...updatedUser };
      setUser(mergedUser);
      setEditForm(mergedUser);
      if (updateUser) updateUser(mergedUser);
      setIsEditing(false);
      showToast("Profile updated successfully", "success");
    } catch (err) {
      showToast(err.message || "Failed to update profile", "error");
    } finally {
      setSaveLoading(false);
    }
  };

  const handleToggleOrSelectChange = (key, value, toastMsg) => {
    const updatedPrefs = { ...editForm.preferences, [key]: value };
    const updatedForm = { ...editForm, preferences: updatedPrefs };
    setEditForm(updatedForm);
    setUser(updatedForm);
    updateProfileApi({ preferences: updatedPrefs }).catch(err => console.error(err));
    if (toastMsg) {
      showToast(toastMsg, "success");
    }
  };

  const handleChangePassword = async (e) => {
    if (e) e.preventDefault();
    if (!passwordForm.newPassword) {
      showToast("Please enter a new password", "error");
      return;
    }
    setPasswordLoading(true);
    try {
      await changePasswordApi({
        currentPassword: passwordForm.currentPassword || "password",
        newPassword: passwordForm.newPassword
      });
      showToast("Password updated successfully", "success");
      setPasswordForm({ currentPassword: "", newPassword: "" });
    } catch (err) {
      showToast(err.message || "Failed to update password", "error");
    } finally {
      setPasswordLoading(false);
    }
  };

  const getInitials = (name) => {
    if (!name) return "JD";
    const parts = name.trim().split(" ");
    if (parts.length >= 2) return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    return name.slice(0, 2).toUpperCase();
  };

  if (loading) {
    return (
      <AppLayout>
        <div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontSize: "1.2rem" }}>Loading profile...</div>
      </AppLayout>
    );
  }

  const getInputStyle = (editable) => ({
    width: "100%",
    padding: "16px 20px",
    background: editable ? "var(--card-bg)" : "var(--bg-secondary)",
    border: editable ? "2px solid #E85D2A" : "1px solid var(--border)",
    borderRadius: "12px",
    fontSize: "1.05rem",
    fontWeight: 600,
    color: "var(--text-heading)",
    boxSizing: "border-box",
    outline: "none",
    transition: "all 0.2s ease",
    opacity: 1
  });

  const labelStyle = {
    display: "block",
    fontSize: "0.8rem",
    fontWeight: 700,
    color: "var(--text-muted)",
    letterSpacing: "0.06em",
    textTransform: "uppercase",
    marginBottom: "10px"
  };

  return (
    <AppLayout>
      {/* Toast Notification */}
      {toast.show && (
        <div style={{
          position: "fixed",
          top: 24,
          right: 24,
          zIndex: 9999,
          padding: "16px 28px",
          borderRadius: "18px",
          background: toast.type === "error" ? "var(--danger)" : "#1A1817",
          color: "#FFF",
          fontWeight: 700,
          fontSize: "1rem",
          boxShadow: "0 16px 36px rgba(0,0,0,0.25)",
          animation: "fadeInUp 0.2s ease-out"
        }}>
          {toast.message}
        </div>
      )}

      {/* Full-width container with generous margins to properly fill desktop screen */}
      <div style={{ maxWidth: 1500, width: "100%", margin: "0 auto", padding: "10px 20px 80px 10px" }}>
        
        {/* Top Profile Banner */}
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 52, flexWrap: "wrap", gap: 32 }}>
          <div style={{ display: "flex", gap: 32, alignItems: "center", flexWrap: "wrap" }}>
            
            {/* Enlarged Orange Avatar */}
            <div style={{
              width: 130,
              height: 130,
              borderRadius: 30,
              background: "#E85D2A",
              color: "#FFF",
              fontSize: "3.2rem",
              fontWeight: 800,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              boxShadow: "0 12px 30px rgba(232, 93, 42, 0.3)"
            }}>
              {getInitials(editForm.fullName)}
            </div>

            {/* Enlarged Name & Subtitle Details */}
            <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, flexWrap: "wrap" }}>
                <h1 style={{ fontSize: "2.6rem", fontWeight: 800, color: "var(--text-heading)", margin: 0 }}>
                  {editForm.fullName || "Jane Doe"}
                </h1>
                <span style={{
                  background: "rgba(232, 93, 42, 0.12)",
                  color: "#E85D2A",
                  fontSize: "0.85rem",
                  fontWeight: 700,
                  padding: "6px 16px",
                  borderRadius: 14
                }}>Pro Student</span>
              </div>
              <div style={{ fontSize: "1.1rem", color: "var(--text-muted)", fontWeight: 500 }}>
                {editForm.email || "jane.doe@university.edu"}
              </div>
              <div style={{ fontSize: "0.95rem", color: "var(--text-muted)", fontWeight: 500, marginTop: 4 }}>
                Member since Aug 2023
              </div>
            </div>
          </div>

          <button 
            type="button"
            onClick={handleEditToggleOrSave}
            disabled={saveLoading}
            style={{
              background: isEditing ? "#16A34A" : "#E85D2A",
              color: "#FFF",
              padding: "16px 36px",
              borderRadius: 28,
              border: "none",
              fontWeight: 700,
              fontSize: "1.05rem",
              cursor: "pointer",
              boxShadow: isEditing ? "0 8px 20px rgba(22, 163, 74, 0.3)" : "0 8px 20px rgba(232, 93, 42, 0.3)",
              transition: "all 0.2s ease"
            }}
          >
            {saveLoading ? "Saving..." : isEditing ? "Save Profile" : "Edit Profile"}
          </button>
        </div>

        {/* 2-Column Main Layout Grid fitting wide desktop screen */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(460px, 1fr))", gap: 40 }}>
          
          {/* Left Column (Personal Information + Privacy) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            
            {/* Personal Information */}
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 20px 0" }}>Personal Information</h2>
              <div className="card" style={{ padding: "32px 36px", borderRadius: 24 }}>
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
                  <div>
                    <label style={labelStyle}>FULL NAME</label>
                    <input 
                      type="text" 
                      value={editForm.fullName || ""} 
                      readOnly={!isEditing}
                      onChange={(e) => setEditForm({ ...editForm, fullName: e.target.value })}
                      style={getInputStyle(isEditing)}
                    />
                  </div>
                  <div>
                    <label style={labelStyle}>EMAIL ADDRESS</label>
                    <input 
                      type="email" 
                      value={editForm.email || ""} 
                      readOnly={!isEditing}
                      onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                      style={getInputStyle(isEditing)}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Privacy */}
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 20px 0" }}>Privacy</h2>
              <div className="card" style={{ padding: "12px 36px", borderRadius: 24 }}>
                
                {/* Profile Visibility */}
                <div style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)", marginBottom: 4 }}>Profile Visibility</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Control who can see your profile</div>
                  </div>
                  <select
                    value={editForm.preferences?.profileVisibility || "Public"}
                    onChange={(e) => handleToggleOrSelectChange("profileVisibility", e.target.value, `Profile visibility set to ${e.target.value}`)}
                    style={{ background: "transparent", border: "none", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", cursor: "pointer", outline: "none" }}
                  >
                    <option value="Public">Public</option>
                    <option value="Private">Private</option>
                    <option value="Friends">Friends Only</option>
                  </select>
                </div>

                {/* Show Online Status */}
                <div style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)", marginBottom: 4 }}>Show Online Status</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Let others see when you are active</div>
                  </div>
                  <ToggleSwitch 
                    checked={editForm.preferences?.showOnlineStatus !== false} 
                    onChange={() => handleToggleOrSelectChange("showOnlineStatus", !(editForm.preferences?.showOnlineStatus !== false), !(editForm.preferences?.showOnlineStatus !== false) ? "Online status enabled" : "Online status hidden")} 
                  />
                </div>

                {/* Data Sharing */}
                <div style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)", marginBottom: 4 }}>Data Sharing</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Share usage data to improve the app experience</div>
                  </div>
                  <ToggleSwitch 
                    checked={!!editForm.preferences?.dataSharing} 
                    onChange={() => handleToggleOrSelectChange("dataSharing", !editForm.preferences?.dataSharing, !editForm.preferences?.dataSharing ? "Data sharing enabled" : "Data sharing disabled")} 
                  />
                </div>

                {/* Searchability */}
                <div style={{ padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)", marginBottom: 4 }}>Searchability</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Allow others to find me by email</div>
                  </div>
                  <ToggleSwitch 
                    checked={editForm.preferences?.searchability !== false} 
                    onChange={() => handleToggleOrSelectChange("searchability", !(editForm.preferences?.searchability !== false), !(editForm.preferences?.searchability !== false) ? "Email searchability enabled" : "Email searchability disabled")} 
                  />
                </div>

              </div>
            </div>

          </div>

          {/* Right Column (Preferences + Security) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 40 }}>
            
            {/* Preferences */}
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 20px 0" }}>Preferences</h2>
              <div className="card" style={{ padding: "12px 36px", borderRadius: 24 }}>
                
                {/* Dark Mode */}
                <div style={{ padding: "24px 0", borderBottom: "1px solid var(--border-light)", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)", marginBottom: 4 }}>Dark Mode</div>
                    <div style={{ fontSize: "0.9rem", color: "var(--text-muted)" }}>Reduce eye strain at night</div>
                  </div>
                  <ToggleSwitch 
                    checked={editForm.preferences?.theme === "dark"} 
                    onChange={() => handleToggleOrSelectChange("theme", editForm.preferences?.theme === "dark" ? "light" : "dark", editForm.preferences?.theme === "dark" ? "Switched to Light Mode" : "Switched to Dark Mode")} 
                  />
                </div>

                {/* Week Starts On */}
                <div style={{ padding: "24px 0", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div style={{ fontWeight: 700, fontSize: "1.1rem", color: "var(--text-heading)" }}>Week Starts On</div>
                  <select
                    value={editForm.preferences?.weekStartsOn || "Monday"}
                    onChange={(e) => handleToggleOrSelectChange("weekStartsOn", e.target.value, `Calendar week starts on ${e.target.value}`)}
                    style={{ background: "transparent", border: "none", fontSize: "1.05rem", fontWeight: 700, color: "var(--text-heading)", cursor: "pointer", outline: "none" }}
                  >
                    <option value="Monday">Monday</option>
                    <option value="Sunday">Sunday</option>
                  </select>
                </div>

              </div>
            </div>

            {/* Security */}
            <div>
              <h2 style={{ fontSize: "1.4rem", fontWeight: 800, color: "var(--text-heading)", margin: "0 0 20px 0" }}>Security</h2>
              <div className="card" style={{ padding: "32px 36px", borderRadius: 24 }}>
                <form onSubmit={handleChangePassword}>
                  <div style={{ marginBottom: 20 }}>
                    <label style={labelStyle}>CURRENT PASSWORD</label>
                    <input 
                      type="password" 
                      placeholder="********"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      style={getInputStyle(true)}
                    />
                  </div>
                  <div style={{ marginBottom: 24 }}>
                    <label style={labelStyle}>NEW PASSWORD</label>
                    <input 
                      type="password" 
                      placeholder="Minimum 8 characters"
                      value={passwordForm.newPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                      style={getInputStyle(true)}
                    />
                  </div>
                  <button 
                    type="submit"
                    disabled={passwordLoading}
                    style={{
                      width: "100%",
                      padding: "16px",
                      background: "var(--bg-secondary)",
                      border: "1px solid var(--border)",
                      color: "var(--text-heading)",
                      borderRadius: 14,
                      fontWeight: 700,
                      fontSize: "1.05rem",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {passwordLoading ? "Updating..." : "Update Password"}
                  </button>
                </form>

                <div style={{ margin: "28px 0", borderBottom: "1px solid var(--border-light)" }} />

                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm("Are you sure you want to sign out from all devices?")) {
                      logout();
                    }
                  }}
                  style={{
                    background: "transparent",
                    border: "none",
                    color: "var(--danger, #DC2626)",
                    fontWeight: 700,
                    fontSize: "1rem",
                    cursor: "pointer",
                    padding: 0,
                    textAlign: "left"
                  }}
                >
                  Logout from all devices
                </button>
              </div>
            </div>

          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default Profile;
