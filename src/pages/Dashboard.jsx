import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";

function Dashboard() {
  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Good Morning, Jane 👋</h1>
          <p style={{ color: "var(--text-muted)" }}>{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric', year: 'numeric' })}</p>
        </div>
        <div style={{ display: "flex", gap: 12 }}>
          <button className="btn btn-secondary">Add Task</button>
          <Link to="/timetable" className="btn btn-primary">+ New Class</Link>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        <div className="card" style={{ borderLeft: "4px solid var(--primary)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Next Class</h3>
          <p style={{ fontSize: "1.2rem", fontWeight: "bold" }}>Data Structures</p>
          <p style={{ fontSize: "0.85rem", color: "var(--primary)", marginTop: 4 }}>In 45 minutes • Room A-201</p>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--warning)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Assignments Due</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>3 Pending</p>
          <p style={{ fontSize: "0.85rem", color: "var(--warning)", marginTop: 4 }}>Next due in 2 days</p>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--success)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Overall Attendance</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>85%</p>
          <p style={{ fontSize: "0.85rem", color: "var(--success)", marginTop: 4 }}>On track</p>
        </div>
        <div className="card" style={{ borderLeft: "4px solid var(--info)" }}>
          <h3 style={{ fontSize: "0.9rem", color: "var(--text-muted)", marginBottom: 8 }}>Study Streak</h3>
          <p style={{ fontSize: "1.5rem", fontWeight: "bold" }}>12 Days</p>
          <p style={{ fontSize: "0.85rem", color: "var(--info)", marginTop: 4 }}>Keep it up!</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Today's Classes</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontWeight: "bold", width: "60px" }}>09:00</div>
                <div style={{ width: "4px", height: "40px", background: "var(--primary)", borderRadius: "2px" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>Data Structures</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room A-201 • Dr. Smith</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontWeight: "bold", width: "60px" }}>11:00</div>
                <div style={{ width: "4px", height: "40px", background: "var(--info)", borderRadius: "2px" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>Operating Systems</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Room C-102 • Prof. Lee</div>
                </div>
              </div>
              <div style={{ display: "flex", alignItems: "center", gap: 16, padding: 12, background: "var(--bg)", borderRadius: "var(--radius-sm)" }}>
                <div style={{ fontWeight: "bold", width: "60px" }}>14:00</div>
                <div style={{ width: "4px", height: "40px", background: "var(--warning)", borderRadius: "2px" }}></div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold" }}>Database Systems</div>
                  <div style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Lab 3 • Dr. Patel</div>
                </div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Upcoming Exams</h2>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16 }}>
              <div style={{ padding: 16, background: "var(--danger-light)", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ color: "var(--danger)", marginBottom: 4 }}>Midterm: Data Structures</h4>
                <p style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: 4 }}>Oct 15, 2026</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Main Hall • 10:00 AM</p>
              </div>
              <div style={{ padding: 16, background: "var(--warning-light)", borderRadius: "var(--radius-sm)" }}>
                <h4 style={{ color: "var(--warning)", marginBottom: 4 }}>Quiz: Operating Systems</h4>
                <p style={{ fontSize: "0.85rem", fontWeight: "bold", marginBottom: 4 }}>Oct 18, 2026</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Room C-102 • 11:00 AM</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Recent Notes & Resources</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.2rem" }}>📄</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Chapter 4: Trees & Graphs.pdf</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Data Structures • Added 2h ago</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>View</button>
              </li>
              <li style={{ display: "flex", alignItems: "center", gap: 12 }}>
                <span style={{ fontSize: "1.2rem" }}>📊</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: "bold", fontSize: "0.9rem" }}>Process Scheduling Slides</div>
                  <div style={{ fontSize: "0.75rem", color: "var(--text-muted)" }}>Operating Systems • Added yesterday</div>
                </div>
                <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>View</button>
              </li>
            </ul>
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Study Goals (Weekly)</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Complete Assignments</span>
                <span className="text-primary">2/5 Done</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: "40%", height: "100%", background: "var(--primary)", borderRadius: "4px" }}></div>
              </div>
            </div>
            <div>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Study Hours</span>
                <span className="text-info">12/20 Hours</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: "60%", height: "100%", background: "var(--info)", borderRadius: "4px" }}></div>
              </div>
            </div>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Upcoming Events</h2>
            <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 12 }}>
              <li style={{ display: "flex", gap: 12, paddingBottom: 12, borderBottom: "1px solid var(--border-light)" }}>
                <div style={{ background: "var(--primary-light)", color: "var(--primary)", padding: "8px", borderRadius: "8px", textAlign: "center", minWidth: "45px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>OCT</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>12</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Tech Club Hackathon</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Student Center • 09:00 AM</div>
                </div>
              </li>
              <li style={{ display: "flex", gap: 12 }}>
                <div style={{ background: "var(--info-light)", color: "var(--info)", padding: "8px", borderRadius: "8px", textAlign: "center", minWidth: "45px" }}>
                  <div style={{ fontSize: "0.75rem", fontWeight: "bold" }}>OCT</div>
                  <div style={{ fontSize: "1.2rem", fontWeight: "bold" }}>14</div>
                </div>
                <div>
                  <div style={{ fontWeight: "bold", fontSize: "0.95rem" }}>Career Fair 2026</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>Main Auditorium • 10:00 AM</div>
                </div>
              </li>
            </ul>
          </div>

          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Recent Activity</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--success)" }}>✓</span>
                <div>
                  <p style={{ fontSize: "0.85rem", margin: 0 }}>Submitted assignment <strong>DB Project 1</strong></p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>2 hours ago</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <span style={{ color: "var(--primary)" }}>+</span>
                <div>
                  <p style={{ fontSize: "0.85rem", margin: 0 }}>Added note <strong>Trees & Graphs</strong></p>
                  <p style={{ fontSize: "0.75rem", color: "var(--text-muted)", margin: 0 }}>4 hours ago</p>
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