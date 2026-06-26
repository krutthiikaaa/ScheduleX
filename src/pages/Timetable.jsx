import AppLayout from "../components/AppLayout";

function Timetable() {
  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Timetable</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your weekly classes and schedule.</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-secondary">Export</button>
          <button className="btn btn-primary">+ Add Class</button>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div style={{ display: "flex", gap: 8 }}>
            <button className="btn btn-primary">Weekly</button>
            <button className="btn btn-secondary">Daily</button>
          </div>
          <h3 style={{ fontSize: "1.2rem", margin: 0 }}>Fall Semester 2026</h3>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "60px repeat(5, 1fr)", gap: 1, background: "var(--border)", border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          {/* Header */}
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Time</div>
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Monday</div>
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Tuesday</div>
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Wednesday</div>
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Thursday</div>
          <div style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold" }}>Friday</div>

          {/* Rows */}
          {["09:00", "10:00", "11:00", "12:00", "13:00", "14:00", "15:00"].map((time, idx) => (
            <div key={time} style={{ display: "contents" }}>
              <div style={{ background: "var(--bg-secondary)", padding: "16px 8px", textAlign: "center", fontSize: "0.8rem", color: "var(--text-muted)" }}>{time}</div>
              {/* Monday */}
              <div style={{ background: "#FFF", position: "relative" }}>
                {time === "09:00" && (
                  <div style={{ position: "absolute", top: 4, left: 4, right: 4, height: "90%", background: "var(--primary-light)", borderLeft: "4px solid var(--primary)", borderRadius: "4px", padding: 8, fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: "bold", color: "var(--primary)" }}>Data Structures</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>A-201</div>
                  </div>
                )}
              </div>
              {/* Tuesday */}
              <div style={{ background: "#FFF", position: "relative" }}>
                {time === "10:00" && (
                  <div style={{ position: "absolute", top: 4, left: 4, right: 4, height: "190%", zIndex: 1, background: "var(--info-light)", borderLeft: "4px solid var(--info)", borderRadius: "4px", padding: 8, fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: "bold", color: "var(--info)" }}>Lab: Operating Systems</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Lab 3</div>
                  </div>
                )}
              </div>
              {/* Wednesday */}
              <div style={{ background: "#FFF", position: "relative" }}></div>
              {/* Thursday */}
              <div style={{ background: "#FFF", position: "relative" }}>
                {time === "14:00" && (
                  <div style={{ position: "absolute", top: 4, left: 4, right: 4, height: "90%", background: "var(--warning-light)", borderLeft: "4px solid var(--warning)", borderRadius: "4px", padding: 8, fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: "bold", color: "var(--warning)" }}>Database Systems</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>Lab 3</div>
                  </div>
                )}
              </div>
              {/* Friday */}
              <div style={{ background: "#FFF", position: "relative" }}>
                {time === "09:00" && (
                  <div style={{ position: "absolute", top: 4, left: 4, right: 4, height: "90%", background: "var(--primary-light)", borderLeft: "4px solid var(--primary)", borderRadius: "4px", padding: 8, fontSize: "0.8rem" }}>
                    <div style={{ fontWeight: "bold", color: "var(--primary)" }}>Data Structures</div>
                    <div style={{ color: "var(--text-muted)", fontSize: "0.7rem" }}>A-201</div>
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Timetable;
