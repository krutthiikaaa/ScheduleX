import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";
import { fetchAssignments, fetchTasks, fetchCourses } from "../utils/api";

function Dashboard() {
  const [assignments, setAssignments] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    Promise.all([fetchAssignments(), fetchTasks(), fetchCourses()]).then(([assignData, taskData, courseData]) => {
      setAssignments(assignData);
      setTasks(taskData);
      setCourses(courseData);
    });
  }, []);

  const pendingAssignments = assignments.filter(a => a.status !== 'Completed').length;
  const overallAttendance = courses.length ? Math.round(courses.reduce((acc, c) => acc + (c.attendance.conducted ? c.attendance.attended/c.attendance.conducted : 1), 0) / courses.length * 100) : 100;
  
  const dailyTasks = tasks.filter(t => !t.isCompleted && t.priority === 'High');

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
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{pendingAssignments} Pending</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--success)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Overall Attendance</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{overallAttendance}%</p>
        </div>
        <div className="card hover-card" style={{ borderLeft: "4px solid var(--info)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Today's Priority Tasks</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>{dailyTasks.length} Remaining</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>Upcoming Deadlines</h2>
              <Link to="/assignments" style={{ fontSize: "0.85rem" }}>View All</Link>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              {assignments.filter(a => a.status !== 'Completed').slice(0, 3).map(ast => (
                <div key={ast._id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                  <div style={{ fontWeight: "bold", minWidth: "60px", color: "var(--danger)" }}>{new Date(ast.dueDate).toLocaleDateString(undefined, {month: 'short', day: 'numeric'})}</div>
                  <div style={{ width: "4px", height: "40px", background: "var(--danger)", borderRadius: "2px" }}></div>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontWeight: "bold" }}>{ast.title}</div>
                    <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{ast.courseId?.name || "No Course"}</div>
                  </div>
                </div>
              ))}
              {assignments.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No upcoming assignments.</p>}
            </div>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Focus Time (Weekly)</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Goal: 10 hours</span>
                <span className="text-info">4.5 Hours</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: "45%", height: "100%", background: "var(--info)", borderRadius: "4px" }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 16 }}>
              <h2 style={{ margin: 0 }}>Recent Activity</h2>
            </div>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--success)" }}>✓</span>
                <div>
                  <p style={{ fontSize: "0.85rem", margin: 0 }}>Completed 25m Focus Session</p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>Today</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Dashboard;