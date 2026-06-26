import AppLayout from "../components/AppLayout";

function TasksGoals() {
  const tasks = [
    { title: "Finish OS Assignment", category: "Academic", priority: "High", done: false },
    { title: "Prepare for DB Quiz", category: "Academic", priority: "High", done: false },
    { title: "Update Resume", category: "Placement", priority: "Medium", done: true },
    { title: "Read Chapter 4", category: "Academic", priority: "Low", done: false },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Tasks & Goals</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your daily goals and long-term tasks.</p>
        </div>
        <button className="btn btn-primary">+ Add Task</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Progress</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Daily Goal</span>
                <span style={{ fontWeight: "bold" }}>60%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: "60%", height: "100%", background: "var(--primary)", borderRadius: "4px" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Weekly Goal</span>
                <span style={{ fontWeight: "bold" }}>40%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: "40%", height: "100%", background: "var(--info)", borderRadius: "4px" }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
            <span style={{ fontWeight: "bold", borderBottom: "2px solid var(--primary)", paddingBottom: 14 }}>All Tasks</span>
            <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Academic</span>
            <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Placement</span>
            <span style={{ color: "var(--text-muted)", cursor: "pointer" }}>Personal</span>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {tasks.map((task, idx) => (
              <div key={idx} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", opacity: task.done ? 0.6 : 1 }}>
                <input type="checkbox" checked={task.done} style={{ width: 20, height: 20, accentColor: "var(--primary)" }} readOnly />
                <div style={{ flex: 1, textDecoration: task.done ? "line-through" : "none" }}>
                  <div style={{ fontWeight: "bold" }}>{task.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{task.category}</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", background: task.priority === "High" ? "var(--danger-light)" : task.priority === "Medium" ? "var(--warning-light)" : "var(--info-light)", color: task.priority === "High" ? "var(--danger)" : task.priority === "Medium" ? "var(--warning)" : "var(--info)" }}>
                  {task.priority} Priority
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32, border: "none" }}>🗑️</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default TasksGoals;
