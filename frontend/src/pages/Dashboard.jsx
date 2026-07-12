import { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import { Link } from "react-router-dom";
import { fetchDashboard, fetchAssignments, fetchFocusSessions, fetchResources, fetchProfile } from "../services/api";
import { useTasksGoals } from "../context/TasksGoalsContext";
import { useAuth } from "../context/AuthContext";

function Dashboard() {
  const { user } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [focusSessions, setFocusSessions] = useState([]);
  const [resources, setResources] = useState([]);
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    studyStreak: 0,
    totalStudyHours: 0,
    completedAssignments: 0,
    pomodoroSessions: 0,
    weeklyProductivity: 0
  });

  const { habits } = useTasksGoals();

  // Reminders State
  const [reminders, setReminders] = useState(() => {
    const saved = localStorage.getItem("dashboard_reminders");
    if (!saved) return [];
    try {
      const parsed = JSON.parse(saved);
      const now = Date.now();
      return parsed.filter(item => {
        const timeDiff = now - new Date(item.createdAt).getTime();
        return timeDiff < 24 * 60 * 60 * 1000;
      });
    } catch (e) {
      return [];
    }
  });

  const [showAddInput, setShowAddInput] = useState(false);
  const [reminderText, setReminderText] = useState("");

  useEffect(() => {
    Promise.all([fetchAssignments(), fetchFocusSessions(), fetchResources()])
      .then(([assignData, focusData, resData]) => {
        setAssignments(assignData || []);
        setFocusSessions(focusData || []);
        setResources(resData || []);
      })
      .catch(() => {
        setAssignments([]);
        setFocusSessions([]);
        setResources([]);
      });

    fetchDashboard()
      .then(data => {
        if (data) {
          setDashboard(data);
        } else {
          throw new Error("Empty dashboard data");
        }
      })
      .catch(err => {
        console.error("Dashboard load error, using clean fallback:", err);
        setDashboard({
          userName: user?.name || user?.fullName || "Student",
          studyStreak: 0,
          pendingAssignments: 0,
          remainingTasks: 0,
          pomodoroMinutesToday: 0,
          upcomingDeadlines: [],
          weeklyFocus: { goalHours: 10, completedHours: 0 },
          weeklyGoals: {
            studyHoursCompleted: 0, studyHoursGoal: 10,
            assignmentCompleted: 0, assignmentGoal: 5,
            taskCompleted: 0, taskGoal: 5
          },
          recentResources: [],
          recentActivity: []
        });
      })
      .finally(() => {
        setLoading(false);
      });

    fetchProfile()
      .then(data => {
        if (data && data.stats) setStats(data.stats);
      })
      .catch(() => {});
  }, [user]);

  // Save reminders to localStorage
  useEffect(() => {
    localStorage.setItem("dashboard_reminders", JSON.stringify(reminders));
  }, [reminders]);

  // Real-time automatic dissolution of expired reminders
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setReminders(prev => prev.filter(item => {
        const timeDiff = now - new Date(item.createdAt).getTime();
        return timeDiff < 24 * 60 * 60 * 1000;
      }));
    }, 30000);
    return () => clearInterval(interval);
  }, []);

  const handleAddReminder = (e) => {
    e.preventDefault();
    if (!reminderText.trim()) return;
    const newReminder = {
      id: Math.random().toString(36).substr(2, 9),
      text: reminderText.trim(),
      createdAt: new Date().toISOString()
    };
    setReminders(prev => [newReminder, ...prev]);
    setReminderText("");
    setShowAddInput(false);
  };

  const handleDeleteReminder = (id) => {
    setReminders(prev => prev.filter(item => item.id !== id));
  };

  const formatReminderTime = (dateStr) => {
    const d = new Date(dateStr);
    return d.toLocaleString('en-US', { 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  const today = new Date().toDateString();
  const dayIndex = new Date().getDate() - 1;
  const recentCompletedHabits = habits.filter(h => h.days && h.days[dayIndex]).slice(-3);
  
  const pendingAssignments = assignments.filter(a => a.status !== "Completed");
  const overdueCount = pendingAssignments.length;

  if (loading) {
    return <AppLayout><div style={{ padding: 48, textAlign: "center", color: "var(--text-muted)", fontWeight: 600 }}>Loading workspace...</div></AppLayout>;
  }

  const kpiLabelStyle = {
    fontSize: "0.7rem", 
    color: "var(--text-muted)", 
    fontWeight: 700, 
    letterSpacing: "0.05em", 
    textTransform: "uppercase", 
    marginBottom: 6
  };

  const kpiValueStyle = {
    fontSize: "1.65rem", 
    fontWeight: 800, 
    color: "var(--text-heading)", 
    lineHeight: 1.1
  };

  // Determine greeting based on local time
  const getGreeting = () => {
    const hrs = new Date().getHours();
    if (hrs < 12) return "Good Morning";
    if (hrs < 17) return "Good Afternoon";
    return "Good Evening";
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", gap: 32, maxWidth: 1360, width: "100%", margin: "0 auto", paddingBottom: 60 }}>
        
        {/* Modern Welcome Banner Card */}
        <div style={{
          background: "linear-gradient(135deg, var(--primary) 0%, #E26E4A 100%)",
          borderRadius: "28px",
          padding: "36px 40px",
          color: "#FFF",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          flexWrap: "wrap",
          gap: 24,
          boxShadow: "0 12px 32px rgba(214, 90, 49, 0.2)"
        }}>
          <div>
            <h1 style={{ color: "#FFF", fontSize: "2.2rem", fontWeight: 800, marginBottom: 8, letterSpacing: "-0.5px" }}>
              {getGreeting()}, {user?.fullName || dashboard?.userName || "User"}
            </h1>
            <p style={{ color: "rgba(255, 255, 255, 0.9)", margin: 0, fontSize: "1rem", fontWeight: 500 }}>
              You have <strong style={{ color: "#FFE8E1" }}>{overdueCount} pending assignment{overdueCount !== 1 ? 's' : ''}</strong> and <strong style={{ color: "#FFE8E1" }}>{reminders.length} active reminder{reminders.length !== 1 ? 's' : ''}</strong>.
            </p>
          </div>
          <div style={{ display: "flex", gap: 14 }}>
            <Link to="/focus" className="btn" style={{ background: "rgba(255, 255, 255, 0.15)", color: "#FFF", border: "1px solid rgba(255, 255, 255, 0.25)", padding: "12px 24px", borderRadius: "14px", fontWeight: 700, fontSize: "0.9rem", transition: "background 0.2s" }} onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.25)"} onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255, 255, 255, 0.15)"}>
              Pomodoro
            </Link>
            <Link to="/habits" className="btn" style={{ background: "#FFF", color: "var(--primary)", padding: "12px 24px", borderRadius: "14px", fontWeight: 700, fontSize: "0.9rem", boxShadow: "0 4px 12px rgba(0,0,0,0.05)" }}>
              Habits
            </Link>
          </div>
        </div>

        {/* Unified KPI Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, minmax(0, 1fr))", gap: 16 }}>
          <div className="card" style={{ padding: "18px 20px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
            <div style={kpiLabelStyle}>STUDY STREAK</div>
            <div style={{ ...kpiValueStyle, color: "var(--primary)" }}>
              {dashboard?.studyStreak ?? stats.studyStreak ?? 0} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>Days</span>
            </div>
          </div>

          <div className="card" style={{ padding: "18px 20px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
            <div style={kpiLabelStyle}>TOTAL STUDY HOURS</div>
            <div style={kpiValueStyle}>
              {dashboard?.weeklyFocus?.completedHours ?? stats.totalStudyHours ?? 0} <span style={{ fontSize: "0.85rem", color: "var(--text-muted)", fontWeight: 600 }}>hrs</span>
            </div>
          </div>

          <div className="card" style={{ padding: "18px 20px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
            <div style={kpiLabelStyle}>PENDING ASSIGNMENTS</div>
            <div style={{ ...kpiValueStyle, color: overdueCount > 0 ? "var(--danger)" : "var(--success)" }}>
              {overdueCount}
            </div>
          </div>

          <div className="card" style={{ padding: "18px 20px", borderRadius: "20px", border: "1px solid var(--border-light)" }}>
            <div style={kpiLabelStyle}>POMODORO SESSIONS</div>
            <div style={kpiValueStyle}>
              {(dashboard?.pomodoroMinutesToday ? Math.round(dashboard.pomodoroMinutesToday / 25) : stats.pomodoroSessions) ?? 0}
            </div>
          </div>
        </div>

        {/* Reorganized 2-Column Main Section */}
        <div style={{ display: "grid", gridTemplateColumns: "1.65fr 1fr", gap: 32, alignItems: "start" }}>
          
          {/* Left Column (Academic Focus) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Upcoming Deadlines Card */}
            <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>Upcoming Deadlines</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Assignments and deliverables due soon</p>
                </div>
                <Link to="/assignments" className="btn btn-secondary" style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>View All</Link>
              </div>
              
              <div style={{ overflowX: "auto" }}>
                <table style={{ width: "100%", borderCollapse: "collapse", textAlign: "left" }}>
                  <thead>
                    <tr style={{ borderBottom: "1px solid var(--border)", color: "var(--text-muted)", fontSize: "0.72rem", fontWeight: 800, letterSpacing: "0.06em" }}>
                      <th style={{ paddingBottom: 12 }}>ASSIGNMENT</th>
                      <th style={{ paddingBottom: 12 }}>SUBJECT</th>
                      <th style={{ paddingBottom: 12 }}>TIME LEFT</th>
                      <th style={{ paddingBottom: 12, textAlign: "right" }}>PRIORITY</th>
                    </tr>
                  </thead>
                  <tbody>
                    {dashboard?.upcomingDeadlines?.slice(0, 4).map((ast, idx) => (
                      <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)", transition: "background 0.2s" }}>
                        <td style={{ padding: "14px 0", fontWeight: 700, fontSize: "0.95rem", color: "var(--text-heading)" }}>{ast?.title}</td>
                        <td style={{ padding: "14px 0" }}>
                          <span style={{ padding: "4px 8px", background: "var(--bg-secondary)", borderRadius: "8px", fontSize: "0.8rem", fontWeight: 600, color: "var(--text-muted)" }}>
                            {ast?.course}
                          </span>
                        </td>
                        <td style={{ padding: "14px 0", color: "var(--danger)", fontSize: "0.88rem", fontWeight: 700 }}>{ast?.timeLeft}</td>
                        <td style={{ padding: "14px 0", textAlign: "right" }}>
                          <span style={{ 
                            padding: "4px 10px", 
                            borderRadius: "99px", 
                            fontSize: "0.75rem", 
                            fontWeight: 700, 
                            background: ast?.priority === "High" ? "var(--danger-light)" : "var(--warning-light)", 
                            color: ast?.priority === "High" ? "var(--danger)" : "var(--warning)" 
                          }}>
                            {ast?.priority}
                          </span>
                        </td>
                      </tr>
                    ))}
                    {(!dashboard?.upcomingDeadlines || dashboard.upcomingDeadlines.length === 0) && (
                      <tr>
                        <td colSpan="4" style={{ padding: "32px 0", textAlign: "center", color: "var(--text-muted)", fontSize: "0.9rem" }}>
                          No upcoming deadlines.
                        </td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Recent Completed Habits Card */}
            <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.3rem", fontWeight: 800 }}>Completed Habits Today</h2>
                  <p style={{ margin: "4px 0 0", fontSize: "0.85rem", color: "var(--text-muted)" }}>Track routines established today</p>
                </div>
                <Link to="/habits" className="btn btn-secondary" style={{ padding: "8px 16px", borderRadius: "12px", fontSize: "0.8rem", fontWeight: 700 }}>View Habits</Link>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {recentCompletedHabits.map((h, i) => (
                  <div key={`h-${i}`} style={{ display: 'flex', alignItems: 'center', gap: 14, padding: "14px 16px", background: 'var(--bg-secondary)', borderRadius: '14px', border: "1px solid var(--border-light)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.92rem', color: "var(--text-heading)" }}>{h.title}</div>
                      <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)', fontWeight: 500, marginTop: 2 }}>Routine completed today</div>
                    </div>
                  </div>
                ))}
                {recentCompletedHabits.length === 0 && (
                  <div style={{ 
                    padding: "36px 24px", 
                    textAlign: "center", 
                    background: "var(--bg-secondary)", 
                    borderRadius: "16px",
                    border: "1px dashed var(--border)"
                  }}>
                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.88rem", fontWeight: 500 }}>No habits completed yet today.</p>
                  </div>
                )}
              </div>
            </div>

          </div>

          {/* Right Column (Goals & Actions) */}
          <div style={{ display: "flex", flexDirection: "column", gap: 32 }}>
            
            {/* Quick Reminders Box */}
            <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
                <div>
                  <h2 style={{ margin: 0, fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)" }}>Reminders</h2>
                  <p style={{ margin: "2px 0 0", fontSize: "0.78rem", color: "var(--text-muted)" }}>Expires in 24 hours</p>
                </div>
                <button 
                  onClick={() => setShowAddInput(!showAddInput)} 
                  className="btn btn-primary" 
                  style={{ padding: "6px 14px", fontSize: "0.78rem", borderRadius: "12px", background: "var(--primary)", border: "none", color: "#FFF", fontWeight: 700, cursor: "pointer" }}
                >
                  {showAddInput ? "Cancel" : "+ Add"}
                </button>
              </div>

              {showAddInput && (
                <form onSubmit={handleAddReminder} style={{ display: 'flex', gap: 8, marginBottom: 20 }}>
                  <input 
                    type="text" 
                    value={reminderText} 
                    onChange={(e) => setReminderText(e.target.value)} 
                    placeholder="e.g. math at 9 am"
                    style={{ flex: 1, padding: "10px 14px", borderRadius: "12px", border: "1px solid var(--border)", background: "var(--bg-secondary)", color: "var(--text-heading)", outline: "none", fontSize: "0.85rem", fontWeight: 600 }}
                    autoFocus
                  />
                  <button type="submit" style={{ padding: "10px 16px", fontSize: "0.85rem", borderRadius: "12px", background: "var(--text-heading)", color: "var(--card-bg)", border: "none", fontWeight: 700, cursor: "pointer" }}>Save</button>
                </form>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {reminders.map((item) => (
                  <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: "14px 16px", background: 'var(--bg-secondary)', borderRadius: '14px', border: "1px solid var(--border-light)" }}>
                    <div>
                      <div style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-heading)', lineHeight: 1.3 }}>{item.text}</div>
                      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: 4 }}>
                        {formatReminderTime(item.createdAt)}
                      </div>
                    </div>
                    <button 
                      onClick={() => handleDeleteReminder(item.id)}
                      style={{ background: "transparent", border: "none", color: "var(--text-muted)", cursor: "pointer", fontSize: "1.1rem", padding: "4px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "50%", transition: "color 0.2s" }}
                      onMouseEnter={(e) => e.currentTarget.style.color = "var(--danger)"}
                      onMouseLeave={(e) => e.currentTarget.style.color = "var(--text-muted)"}
                      title="Delete Reminder"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {reminders.length === 0 && (
                  <div style={{ 
                    padding: "24px 16px", 
                    textAlign: "center", 
                    background: "var(--bg-secondary)", 
                    borderRadius: "16px",
                    border: "1px dashed var(--border)"
                  }}>
                    <p style={{ color: "var(--text-muted)", margin: 0, fontSize: "0.8rem", fontWeight: 500 }}>No active reminders.</p>
                  </div>
                )}
              </div>
            </div>

            {/* Focus Time Card */}
            <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)" }}>
              <h2 style={{ margin: 0, marginBottom: 16, fontSize: "1.1rem", fontWeight: 800 }}>Focus Time (Weekly)</h2>
              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Completed</span>
                  <span style={{ color: "var(--info)", fontWeight: 700 }}>{dashboard?.weeklyFocus?.completedHours ?? 0} Hours</span>
                </div>
                <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px", overflow: "hidden" }}>
                  <div style={{ width: `${Math.min(((dashboard?.weeklyFocus?.completedHours ?? 0) / 20) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
                </div>
              </div>
            </div>

            {/* Weekly Activity Card */}
            <div className="card" style={{ padding: "32px", borderRadius: "24px", border: "1px solid var(--border-light)" }}>
              <h2 style={{ margin: 0, marginBottom: 18, fontSize: "1.1rem", fontWeight: 800 }}>Weekly Activity</h2>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Study Hours</span>
                  <span style={{ color: "var(--success)", fontWeight: 700 }}>{dashboard?.weeklyGoals?.studyHoursCompleted ?? 0} hrs</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                  <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.studyHoursCompleted ?? 0) / 20) * 100, 100)}%`, height: "100%", background: "var(--success)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
                </div>
              </div>
              
              <div style={{ marginBottom: 16 }}>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Assignments Completed</span>
                  <span style={{ color: "var(--warning)", fontWeight: 700 }}>{dashboard?.weeklyGoals?.assignmentCompleted ?? 0}</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                  <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.assignmentCompleted ?? 0) / 10) * 100, 100)}%`, height: "100%", background: "var(--warning)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
                </div>
              </div>

              <div>
                <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                  <span style={{ color: "var(--text-muted)", fontWeight: 500 }}>Tasks Completed</span>
                  <span style={{ color: "var(--primary)", fontWeight: 700 }}>{dashboard?.weeklyGoals?.taskCompleted ?? 0}</span>
                </div>
                <div style={{ width: "100%", height: "6px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                  <div style={{ width: `${Math.min(((dashboard?.weeklyGoals?.taskCompleted ?? 0) / 15) * 100, 100)}%`, height: "100%", background: "var(--primary)", borderRadius: "4px", transition: "width 0.5s ease" }}></div>
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