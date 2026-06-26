import AppLayout from "../components/AppLayout";

function Subjects() {
  const subjects = [
    { name: "Data Structures", code: "CS201", credits: 4, faculty: "Dr. Smith", attendance: 85, color: "var(--primary)" },
    { name: "Operating Systems", code: "CS202", credits: 4, faculty: "Prof. Lee", attendance: 92, color: "var(--info)" },
    { name: "Database Systems", code: "CS203", credits: 3, faculty: "Dr. Patel", attendance: 78, color: "var(--warning)" },
    { name: "Linear Algebra", code: "MA201", credits: 3, faculty: "Prof. Chen", attendance: 100, color: "var(--success)" },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Subjects Workspace</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your courses, materials, and grades.</p>
        </div>
        <button className="btn btn-primary">+ Add Subject</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {subjects.map((sub, idx) => (
          <div key={idx} className="card" style={{ borderTop: `4px solid ${sub.color}` }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
              <div>
                <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>{sub.name}</h2>
                <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{sub.code} • {sub.credits} Credits</p>
              </div>
              <button className="icon-btn" style={{ width: 32, height: 32 }}>⋮</button>
            </div>
            
            <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
              <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>👨‍🏫</div>
              <span style={{ fontSize: "0.9rem" }}>{sub.faculty}</span>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.8rem", marginBottom: 4 }}>
                <span style={{ color: "var(--text-muted)" }}>Attendance</span>
                <span style={{ fontWeight: "bold" }}>{sub.attendance}%</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "3px" }}>
                <div style={{ width: `${sub.attendance}%`, height: "100%", background: sub.attendance < 80 ? "var(--warning)" : "var(--success)", borderRadius: "3px" }}></div>
              </div>
            </div>

            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
              <button className="btn btn-secondary" style={{ padding: "8px", fontSize: "0.8rem" }}>Assignments</button>
              <button className="btn btn-secondary" style={{ padding: "8px", fontSize: "0.8rem" }}>Notes</button>
              <button className="btn btn-secondary" style={{ padding: "8px", fontSize: "0.8rem", gridColumn: "span 2" }}>Open Workspace</button>
            </div>
          </div>
        ))}
      </div>
    </AppLayout>
  );
}

export default Subjects;
