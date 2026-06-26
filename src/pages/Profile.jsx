import AppLayout from "../components/AppLayout";

function Profile() {
  return (
    <AppLayout>
      <div className="page-header">
        <h1>Profile</h1>
        <p>Your personal information and activity</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        {/* Profile Card */}
        <div className="card" style={{ textAlign: "center" }}>
          <div className="profile-avatar-lg">JD</div>
          <h2 style={{ marginTop: 16, marginBottom: 2 }}>Jane Doe</h2>
          <p style={{ color: "var(--text-muted)", fontSize: "0.9rem" }}>jane@university.edu</p>
          <p style={{ marginTop: 8 }}>
            <span className="schedule-tag sage">Student</span>
          </p>
          <div className="profile-stats-row">
            <div><strong>12</strong><span>Schedules</span></div>
            <div><strong>87%</strong><span>Productivity</span></div>
            <div><strong>42h</strong><span>This Week</span></div>
          </div>
          <button className="btn btn-secondary" style={{ width: "100%", marginTop: 16 }}>Edit Profile</button>
        </div>

        {/* Details */}
        <div>
          <div className="card" style={{ marginBottom: 20 }}>
            <h2 style={{ marginBottom: 20 }}>Personal Information</h2>
            <div className="form-row">
              <div className="form-group">
                <label htmlFor="profile-fname">First Name</label>
                <input id="profile-fname" className="form-input" defaultValue="Jane" />
              </div>
              <div className="form-group">
                <label htmlFor="profile-lname">Last Name</label>
                <input id="profile-lname" className="form-input" defaultValue="Doe" />
              </div>
            </div>
            <div className="form-group">
              <label htmlFor="profile-email">Email</label>
              <input id="profile-email" className="form-input" defaultValue="jane@university.edu" />
            </div>
            <div className="form-group">
              <label htmlFor="profile-dept">Department</label>
              <input id="profile-dept" className="form-input" defaultValue="Computer Science" />
            </div>
            <button className="btn btn-primary" style={{ marginTop: 8 }}>Update Profile</button>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Recent Activity</h2>
            <div className="activity-list">
              {[
                { action: "Created", item: "CS Department — Spring 2027", time: "2 hours ago", icon: "✏️" },
                { action: "Updated", item: "Math Department — Fall 2026", time: "1 day ago", icon: "📝" },
                { action: "Completed", item: "Weekly Study Goal", time: "2 days ago", icon: "✅" },
                { action: "Viewed", item: "Physics Lab Schedule", time: "3 days ago", icon: "👁️" },
              ].map((a, i) => (
                <div className="activity-item" key={i}>
                  <span className="activity-icon">{a.icon}</span>
                  <div className="activity-info">
                    <span><strong>{a.action}</strong> {a.item}</span>
                    <span className="activity-time">{a.time}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
