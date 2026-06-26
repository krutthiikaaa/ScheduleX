import AppLayout from "../components/AppLayout";

function Attendance() {
  const attendanceData = [
    { subject: "Data Structures", attended: 28, conducted: 32, required: 75, color: "var(--success)" },
    { subject: "Operating Systems", attended: 35, conducted: 38, required: 75, color: "var(--success)" },
    { subject: "Database Systems", attended: 18, conducted: 26, required: 75, color: "var(--warning)" },
    { subject: "Linear Algebra", attended: 30, conducted: 30, required: 75, color: "var(--success)" },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Attendance Tracker</h1>
          <p style={{ color: "var(--text-muted)" }}>Monitor your class attendance and stay on track.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: 24 }}>
        {attendanceData.map((data, idx) => {
          const percentage = Math.round((data.attended / data.conducted) * 100);
          const isLow = percentage < data.required;
          return (
            <div key={idx} className="card" style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
              <h3 style={{ fontSize: "1.1rem", marginBottom: 24 }}>{data.subject}</h3>
              
              <div style={{ position: "relative", width: 120, height: 120, marginBottom: 24 }}>
                <svg width="120" height="120" viewBox="0 0 120 120">
                  <circle cx="60" cy="60" r="50" fill="none" stroke="var(--bg-secondary)" strokeWidth="12" />
                  <circle 
                    cx="60" cy="60" r="50" 
                    fill="none" 
                    stroke={isLow ? "var(--danger)" : data.color} 
                    strokeWidth="12" 
                    strokeDasharray="314" 
                    strokeDashoffset={314 - (314 * percentage) / 100}
                    strokeLinecap="round"
                    style={{ transform: "rotate(-90deg)", transformOrigin: "50% 50%", transition: "stroke-dashoffset 1s" }}
                  />
                </svg>
                <div style={{ position: "absolute", top: 0, left: 0, width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", fontWeight: "bold", color: isLow ? "var(--danger)" : "var(--text-heading)" }}>
                  {percentage}%
                </div>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, width: "100%", fontSize: "0.9rem" }}>
                <div>
                  <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Attended</div>
                  <div style={{ fontWeight: "bold" }}>{data.attended}</div>
                </div>
                <div>
                  <div style={{ color: "var(--text-muted)", marginBottom: 4 }}>Conducted</div>
                  <div style={{ fontWeight: "bold" }}>{data.conducted}</div>
                </div>
              </div>

              {isLow && (
                <div style={{ marginTop: 16, padding: "8px 12px", background: "var(--danger-light)", color: "var(--danger)", borderRadius: "var(--radius-sm)", fontSize: "0.8rem", fontWeight: "bold", width: "100%" }}>
                  Warning: Below required {data.required}%
                </div>
              )}
            </div>
          );
        })}
      </div>
    </AppLayout>
  );
}

export default Attendance;
