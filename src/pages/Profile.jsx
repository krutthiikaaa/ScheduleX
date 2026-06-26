import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchFocusSessions } from "../utils/api";

function Profile() {
  const [focusStats, setFocusStats] = useState({ count: 0, minutes: 0 });

  useEffect(() => {
    fetchFocusSessions().then(data => {
      const minutes = data.reduce((acc, curr) => acc + curr.durationMinutes, 0);
      setFocusStats({ count: data.length, minutes });
    });
  }, []);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Student Profile</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your academic information and settings.</p>
        </div>
        <button className="btn btn-secondary">Edit Profile</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
          <div style={{ width: 120, height: 120, borderRadius: "50%", background: "var(--primary)", color: "#FFF", fontSize: "3rem", display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 16, fontWeight: "bold" }}>JD</div>
          <h2>Jane Doe</h2>
          <p style={{ color: "var(--text-muted)", marginBottom: 16 }}>B.Sc. Computer Science • Semester 5</p>
          <div style={{ width: "100%", padding: 16, background: "var(--bg-secondary)", borderRadius: "var(--radius-sm)" }}>
            <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 4 }}>University</h3>
            <p style={{ fontWeight: "bold" }}>State Technical University</p>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ background: "linear-gradient(135deg, var(--primary), var(--primary-hover))", color: "#FFF", border: "none" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div>
                <h3 style={{ fontSize: "1.2rem", color: "rgba(255,255,255,0.8)", marginBottom: 8 }}>Cumulative GPA</h3>
                <div style={{ fontSize: "4rem", fontWeight: "900", lineHeight: 1 }}>3.85</div>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "0.9rem", color: "rgba(255,255,255,0.8)" }}>Credits Earned</p>
                <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>81 / 120</p>
              </div>
            </div>
          </div>

          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 24 }}>
            <div className="card">
              <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Study Streak 🔥</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>12 Days</p>
              <p style={{ fontSize: "0.85rem", color: "var(--success)" }}>Longest: 18 Days</p>
            </div>
            <div className="card">
              <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Focus Mode 🍅</h3>
              <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{focusStats.count} Sessions</p>
              <p style={{ fontSize: "0.85rem", color: "var(--info)" }}>Total: {focusStats.minutes} mins</p>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Profile;
