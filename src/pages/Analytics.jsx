import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchAssignments, fetchTasks, fetchFocusSessions } from "../utils/api";

function Analytics() {
  const [stats, setStats] = useState({ assignmentsDone: 0, tasksDone: 0, focusMins: 0, totalFocusSessions: 0 });

  useEffect(() => {
    Promise.all([fetchAssignments(), fetchTasks(), fetchFocusSessions()]).then(([assigns, tasksData, focusData]) => {
      setStats({
        assignmentsDone: assigns.filter(a => a.status === 'Completed').length,
        tasksDone: tasksData.filter(t => t.isCompleted).length,
        focusMins: focusData.reduce((acc, curr) => acc + curr.durationMinutes, 0),
        totalFocusSessions: focusData.length
      });
    });
  }, []);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Analytics</h1>
          <p style={{ color: "var(--text-muted)" }}>Track your academic and productivity progress over time.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Study Hours</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{(stats.focusMins / 60).toFixed(1)} <span style={{ fontSize: "1rem", color: "var(--text-muted)" }}>hrs</span></p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Pomodoros</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.totalFocusSessions}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Assignments Done</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.assignmentsDone}</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Tasks Completed</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{stats.tasksDone}</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card" style={{ minHeight: 400, display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p style={{ color: "var(--text-muted)" }}>[Weekly Productivity Bar Chart Placeholder]</p>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ minHeight: 188, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>[Course Progress Pie Chart]</p>
          </div>
          <div className="card" style={{ minHeight: 188, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <p style={{ color: "var(--text-muted)" }}>[Heatmap Placeholder]</p>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Analytics;
