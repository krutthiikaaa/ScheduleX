import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";
import { fetchAssignments, fetchTasks, fetchFocusSessions, fetchResources } from "../utils/api";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [resources, setResources] = useState([]);
  
  useEffect(() => {
    Promise.all([fetchAssignments(), fetchTasks(), fetchFocusSessions(), fetchResources()]).then(([assignData, taskData, focusData, resData]) => {
      setAssignments(assignData);
      setTasks(taskData);
      setFocusSessions(focusData);
      setResources(resData);
    });
  }, []);

  const pendingAssignments = assignments.filter(a => a.status !== 'Completed');
  const completedAssignments = assignments.filter(a => a.status === 'Completed');
  
  const today = new Date().toDateString();
  const todaysFocusMins = focusSessions.filter(s => new Date(s.date).toDateString() === today).reduce((acc, curr) => acc + curr.durationMinutes, 0);
  const totalWeeklyFocusMins = focusSessions.reduce((acc, curr) => acc + curr.durationMinutes, 0); // Simplified weekly
  
  const dailyTasks = tasks.filter(t => !t.isCompleted && t.priority === 'High');
  const weeklyTasks = tasks.filter(t => t.category === 'Academic'); // Using academic tasks as proxy for goals
  const completedWeeklyTasks = weeklyTasks.filter(t => t.isCompleted);

  // Generate Recent Activity
  const activities = [
    ...resources.map(r => ({ id: `r-${r._id}`, date: new Date(r.createdAt || Date.now()), text: `Uploaded a resource: ${r.title}`, icon: '📄', color: 'var(--info)' })),
    ...focusSessions.map(s => ({ id: `s-${s._id}`, date: new Date(s.date || Date.now()), text: `Completed a ${s.durationMinutes}m Pomodoro session`, icon: '🍅', color: 'var(--primary)' })),
    ...completedAssignments.map(a => ({ id: `a-${a._id}`, date: new Date(a.updatedAt || a.dueDate), text: `Finished an assignment: ${a.title}`, icon: '✅', color: 'var(--success)' })),
    ...tasks.filter(t => t.isCompleted).map(t => ({ id: `t-${t._id}`, date: new Date(t.updatedAt || Date.now()), text: `Completed a task: ${t.title}`, icon: '🎯', color: 'var(--warning)' }))
  ].sort((a, b) => b.date - a.date).slice(0, 5);

  const calculateDaysLeft = (dueDate) => {
    if (!dueDate) return "No date";
    const diff = new Date(dueDate) - new Date();
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (days < 0) return "Overdue";
    if (days === 0) return "Due today";
    return `${days} days left`;
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Good Morning, Jane 👋</h1>
          <p style={{ color: "var(--text-muted)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/focus" className="btn btn-secondary">🍅 Focus Mode</Link>
          <Link to="/tasks" className="btn btn-primary">+ Add Task</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Study Streak 🔥</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>12 Days</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--warning)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Assignments Due</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{pendingAssignments.length} Pending</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--success)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Today's Priority Tasks</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{dailyTasks.length} Remaining</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--info)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Pomodoro Sessions</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{todaysFocusMins} Mins Today</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "65% 1fr", gap: 24 }}>
        {/* Left Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Upcoming Deadlines</h2>
              <Link to="/assignments" className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>View All</Link>
            </div>
            
            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Assignment</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Subject</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Time Left</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Priority</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Status</th>
                </tr>
              </thead>
              <tbody>
                {pendingAssignments.slice(0, 4).map(ast => (
                  <tr key={ast._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 0", fontWeight: "bold", fontSize: "0.95rem" }}>{ast.title}</td>
                    <td style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{ast.subject || "General"}</td>
                    <td style={{ padding: "12px 0", color: "var(--danger)", fontSize: "0.9rem", fontWeight: 600 }}>{calculateDaysLeft(ast.dueDate)}</td>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", background: ast.priority === "High" ? "var(--danger-light)" : "var(--warning-light)", color: ast.priority === "High" ? "var(--danger)" : "var(--warning)" }}>
                        {ast.priority}
                      </span>
                    </td>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{ast.status}</span>
                    </td>
                  </tr>
                ))}
                {pendingAssignments.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>No upcoming deadlines!</td></tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Recent Resources</h2>
              <Link to="/resources" className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>View All</Link>
            </div>

            <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
              <thead>
                <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Name</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Subject</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Type</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}>Opened</th>
                  <th style={{ paddingBottom: 12, fontWeight: 500 }}></th>
                </tr>
              </thead>
              <tbody>
                {resources.slice(0, 4).map(res => (
                  <tr key={res._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 0", fontWeight: 600, fontSize: "0.95rem" }}>{res.title}</td>
                    <td style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{res.subject || "General"}</td>
                    <td style={{ padding: "12px 0" }}>
                       <span style={{ padding: "4px 8px", borderRadius: "6px", fontSize: "0.75rem", background: "var(--bg-secondary)", color: "var(--text-muted)" }}>{res.type}</span>
                    </td>
                    <td style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                      {new Date(res.createdAt || Date.now()).toLocaleDateString()}
                    </td>
                    <td style={{ padding: "12px 0", textAlign: "right" }}>
                      <a href={res.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem", textDecoration: "none" }}>Open</a>
                    </td>
                  </tr>
                ))}
                {resources.length === 0 && (
                  <tr><td colSpan="5" style={{ padding: 24, textAlign: "center", color: "var(--text-muted)" }}>No recent resources found.</td></tr>
                )}
              </tbody>
            </table>
          </div>

        </div>

        {/* Right Column */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div className="card">
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.1rem" }}>Focus Time (Weekly)</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Goal: 10 hours</span>
                <span style={{ color: "var(--info)", fontWeight: 600 }}>{(totalWeeklyFocusMins / 60).toFixed(1)} Hours</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${Math.min((totalWeeklyFocusMins / 600) * 100, 100)}%`, height: "100%", background: "var(--info)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.1rem" }}>Weekly Goals</h2>
            
            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Study Hours</span>
                <span style={{ fontWeight: 600 }}>{(totalWeeklyFocusMins / 60).toFixed(1)} / 10h</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "3px" }}>
                <div style={{ width: `${Math.min((totalWeeklyFocusMins / 600) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "3px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>

            <div style={{ marginBottom: 20 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Assignment Completion</span>
                <span style={{ fontWeight: 600 }}>{completedAssignments.length} / {assignments.length || 1}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "3px" }}>
                <div style={{ width: `${assignments.length ? (completedAssignments.length / assignments.length) * 100 : 0}%`, height: "100%", background: "var(--warning)", borderRadius: "3px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Task Progress</span>
                <span style={{ fontWeight: 600 }}>{completedWeeklyTasks.length} / {weeklyTasks.length || 1}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "3px" }}>
                <div style={{ width: `${weeklyTasks.length ? (completedWeeklyTasks.length / weeklyTasks.length) * 100 : 0}%`, height: "100%", background: "var(--success)", borderRadius: "3px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: "1.1rem" }}>Recent Activity</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              {activities.length > 0 ? activities.map(act => (
                <div key={act.id} style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.9rem" }}>
                    {act.icon}
                  </div>
                  <div>
                    <p style={{ fontSize: "0.85rem", margin: 0, fontWeight: 500 }}>{act.text}</p>
                    <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>{act.date.toLocaleDateString()}</p>
                  </div>
                </div>
              )) : (
                <p style={{ color: "var(--text-muted)", fontSize: "0.85rem", textAlign: "center" }}>No recent activity.</p>
              )}
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;