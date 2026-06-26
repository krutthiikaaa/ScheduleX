import AppLayout from "../components/AppLayout";

function CGPATracker() {
  const semesters = [
    { name: "Semester 1", sgpa: 3.8, credits: 20 },
    { name: "Semester 2", sgpa: 3.9, credits: 22 },
    { name: "Semester 3", sgpa: 3.7, credits: 21 },
    { name: "Semester 4", sgpa: 4.0, credits: 18 },
  ];

  const totalCredits = semesters.reduce((acc, curr) => acc + curr.credits, 0);
  const cgpa = (semesters.reduce((acc, curr) => acc + curr.sgpa * curr.credits, 0) / totalCredits).toFixed(2);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>CGPA Tracker</h1>
          <p style={{ color: "var(--text-muted)" }}>Monitor your academic performance over time.</p>
        </div>
        <button className="btn btn-primary">+ Add Semester Data</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24, marginBottom: 24 }}>
        <div className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", textAlign: "center", background: "linear-gradient(135deg, var(--primary), var(--primary-hover))", color: "#FFF", border: "none" }}>
          <h3 style={{ fontSize: "1.2rem", marginBottom: 8, color: "rgba(255, 255, 255, 0.8)" }}>Current CGPA</h3>
          <div style={{ fontSize: "4rem", fontWeight: "900", marginBottom: 8 }}>{cgpa}</div>
          <p style={{ fontSize: "0.9rem", color: "rgba(255, 255, 255, 0.8)" }}>Total Credits Earned: {totalCredits}</p>
        </div>

        <div className="card">
          <h2 style={{ marginBottom: 20 }}>Semester Breakdown</h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
            {semesters.map((sem, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <div style={{ width: 100, fontWeight: "bold" }}>{sem.name}</div>
                <div style={{ flex: 1, height: 12, background: "var(--bg-secondary)", borderRadius: 6, position: "relative" }}>
                  <div style={{ width: `${(sem.sgpa / 4) * 100}%`, height: "100%", background: "var(--primary)", borderRadius: 6 }}></div>
                </div>
                <div style={{ width: 40, fontWeight: "bold", textAlign: "right" }}>{sem.sgpa}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default CGPATracker;
