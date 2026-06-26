import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchAssignments, fetchStudySessions } from "../utils/api";

function CalendarView() {
  const [events, setEvents] = useState([]);
  
  useEffect(() => {
    Promise.all([fetchAssignments(), fetchStudySessions()]).then(([assigns, studies]) => {
      const allEvents = [
        ...assigns.map(a => ({ id: a._id, title: a.title, date: new Date(a.dueDate), type: 'Assignment', color: 'var(--danger)' })),
        ...studies.map(s => ({ id: s._id, title: s.topic, date: new Date(s.date), type: 'Study', color: 'var(--info)' }))
      ];
      setEvents(allEvents.filter(e => !isNaN(e.date.getTime())));
    });
  }, []);

  // Basic calendar logic for current month
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();
  
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDay = new Date(currentYear, currentMonth, 1).getDay();
  
  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const blanks = Array.from({ length: firstDay === 0 ? 6 : firstDay - 1 }, (_, i) => i); // Assuming Monday start

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Unified Calendar</h1>
          <p style={{ color: "var(--text-muted)" }}>View all your classes, assignments, and study sessions.</p>
        </div>
      </div>

      <div className="card">
        <h2 style={{ marginBottom: 24, textAlign: "center" }}>
          {today.toLocaleString('default', { month: 'long' })} {currentYear}
        </h2>
        
        <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 1, background: "var(--border-light)", border: "1px solid var(--border-light)", borderRadius: "var(--radius-sm)", overflow: "hidden" }}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <div key={d} style={{ background: "var(--bg-secondary)", padding: 12, textAlign: "center", fontWeight: "bold", fontSize: "0.9rem" }}>{d}</div>
          ))}
          
          {blanks.map(b => <div key={`b-${b}`} style={{ background: "#FFF", minHeight: 120 }}></div>)}
          
          {days.map(d => {
            const dayEvents = events.filter(e => e.date.getDate() === d && e.date.getMonth() === currentMonth && e.date.getFullYear() === currentYear);
            return (
              <div key={d} style={{ background: "#FFF", minHeight: 120, padding: 8, position: "relative" }}>
                <span style={{ fontWeight: d === today.getDate() ? "bold" : "normal", color: d === today.getDate() ? "var(--primary)" : "inherit" }}>{d}</span>
                <div style={{ display: "flex", flexDirection: "column", gap: 4, marginTop: 8 }}>
                  {dayEvents.map(e => (
                    <div key={e.id} style={{ background: e.color, color: "#FFF", fontSize: "0.7rem", padding: "4px 6px", borderRadius: 4, whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis", cursor: "pointer" }}>
                      {e.title}
                    </div>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppLayout>
  );
}

export default CalendarView;
