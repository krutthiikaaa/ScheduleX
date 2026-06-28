import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";
import { fetchDashboard, fetchAssignments, fetchFocusSessions, fetchResources } from "../utils/api";
import { useTasksGoals } from "../context/TasksGoalsContext";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [resources, setResources] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);

  const { habits } = useTasksGoals();

  useEffect(() => {
    Promise.all([fetchAssignments(), fetchFocusSessions(), fetchResources()]).then(([assignData, focusData, resData]) => {
      setAssignments(assignData);
      setFocusSessions(focusData);
      setResources(resData);
    });
    fetchDashboard().then(data => {
      setDashboard(data);
      setLoading(false);
    });
  }, []);

  const today = new Date().toDateString();
  const dayIndex = new Date().getDate() - 1; // 0-30 for habit days
  
  const todayHabitsCompleted = habits.filter(h => h.days[dayIndex]).length;
  const recentCompletedHabits = habits.filter(h => h.days[dayIndex]).slice(-3);
  
  const totalChecks = habits.reduce((acc, h) => acc + h.days.filter(d => d).length, 0);
  const totalPossible = habits.length * 31;
  const completionRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;

  if (loading) {
    return <AppLayout><div style={{ padding: 48, textAlign: "center" }}>Loading...</div></AppLayout>;
  }

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Good Morning, {dashboard?.userName ?? "User"} </h1>
          <p style={{ color: "var(--text-muted)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <Link to="/focus" className="btn btn-secondary"> Focus Mode</Link>
          <Link to="/habits" className="btn btn-primary">+ Track Habits</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Habit Streak </h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>12 Days</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--warning)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Today's Habits</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{todayHabitsCompleted} / {habits.length}</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--success)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Completion Rate</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{completionRate}%</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--info)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Weekly Progress</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{Math.round(completionRate * 0.9)}%</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "65% 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0, fontSize: "1.2rem" }}>Recent Completed Habits</h2>
              <Link to="/habits" className="btn btn-secondary" style={{ padding: "4px 12px", fontSize: "0.8rem" }}>View All</Link>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {recentCompletedHabits.map((h, i) => (
                <div key={`h-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: 12, background: 'var(--bg-secondary)', borderRadius: 'var(--radius-sm)' }}>
                  <span style={{ fontSize: '1.2rem' }}>{h.icon}</span>
                  <div>
                    <div style={{ fontWeight: 'bold', fontSize: '0.9rem' }}>{h.title}</div>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Habit completed today</div>
                  </div>
                </div>
              ))}
              {recentCompletedHabits.length === 0 && (
                 <p style={{ textAlign: "center", color: "var(--text-muted)", padding: 24 }}>No habits completed today.</p>
              )}
            </div>
          </div>

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
                </tr>
              </thead>
              <tbody>
                {dashboard?.upcomingDeadlines?.slice(0, 4).map((ast, idx) => (
                  <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                    <td style={{ padding: "12px 0", fontWeight: "bold", fontSize: "0.95rem" }}>{ast?.title}</td>
                    <td style={{ padding: "12px 0", color: "var(--text-muted)", fontSize: "0.9rem" }}>{ast?.course}</td>
                    <td style={{ padding: "12px 0", color: "var(--danger)", fontSize: "0.9rem", fontWeight: 600 }}>{ast?.timeLeft}</td>
                    <td style={{ padding: "12px 0" }}>
                      <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", background: ast?.priority === "High" ? "var(--danger-light)" : "var(--warning-light)", color: ast?.priority === "High" ? "var(--danger)" : "var(--warning)" }}>
                        {ast?.priority}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          
          <div className="card">
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.1rem" }}>Focus Time (Weekly)</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Goal: {dashboard?.weeklyFocus?.goalHours ?? 10} hours</span>
                <span style={{ color: "var(--info)", fontWeight: 600 }}>{dashboard?.weeklyFocus?.completedHours ?? 0} Hours</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${Math.min(((dashboard?.weeklyFocus?.completedHours ?? 0) / (dashboard?.weeklyFocus?.goalHours || 10)) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.1rem" }}>Weekly Goals</h2>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Study ({dashboard?.weeklyGoals?.studyHoursGoal || 15} hrs)</span>
                <span style={{ color: "var(--success)", fontWeight: 600 }}>{dashboard?.weeklyGoals?.studyHoursCompleted || 8}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.studyHoursCompleted || 8) / (dashboard?.weeklyGoals?.studyHoursGoal || 15)) * 100, 100)}%`, height: "100%", background: "var(--success)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
            
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Assignments ({dashboard?.weeklyGoals?.assignmentGoal || 5})</span>
                <span style={{ color: "var(--warning)", fontWeight: 600 }}>{dashboard?.weeklyGoals?.assignmentCompleted || 2}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.assignmentCompleted || 2) / (dashboard?.weeklyGoals?.assignmentGoal || 5)) * 100, 100)}%`, height: "100%", background: "var(--warning)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>

            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span style={{ color: "var(--text-muted)" }}>Tasks ({dashboard?.weeklyGoals?.taskGoal || 10})</span>
                <span style={{ color: "var(--primary)", fontWeight: 600 }}>{dashboard?.weeklyGoals?.taskCompleted || 6}</span>
              </div>
              <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.taskCompleted || 6) / (dashboard?.weeklyGoals?.taskGoal || 10)) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;