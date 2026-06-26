import AppLayout from "../components/AppLayout";

function Assignments() {
  const assignments = [
    { title: "Project Phase 1", subject: "Database Systems", due: "Tomorrow", priority: "High", status: "Pending", marks: 20 },
    { title: "Process Scheduler Simulation", subject: "Operating Systems", due: "Oct 20", priority: "Medium", status: "In Progress", marks: 15 },
    { title: "Binary Search Tree Implementation", subject: "Data Structures", due: "Oct 12", priority: "High", status: "Submitted", marks: 10 },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Assignments Manager</h1>
          <p style={{ color: "var(--text-muted)" }}>Track submissions and due dates.</p>
        </div>
        <button className="btn btn-primary">+ New Assignment</button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
          <span style={{ fontWeight: "bold", borderBottom: "2px solid var(--primary)", paddingBottom: 14 }}>All</span>
          <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Pending</span>
          <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Submitted</span>
          <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Overdue</span>
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Title</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Subject</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Due Date</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Priority</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Status</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {assignments.map((ast, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: 16, fontWeight: "bold" }}>{ast.title}</td>
                <td style={{ padding: 16, color: "var(--text-muted)" }}>{ast.subject}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ color: ast.due === "Tomorrow" ? "var(--danger)" : "var(--text-body)" }}>{ast.due}</span>
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", background: ast.priority === "High" ? "var(--danger-light)" : "var(--warning-light)", color: ast.priority === "High" ? "var(--danger)" : "var(--warning)" }}>
                    {ast.priority}
                  </span>
                </td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", background: ast.status === "Submitted" ? "var(--success-light)" : "var(--bg-secondary)", color: ast.status === "Submitted" ? "var(--success)" : "var(--text-body)" }}>
                    {ast.status}
                  </span>
                </td>
                <td style={{ padding: 16 }}>
                  <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>View</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

export default Assignments;
