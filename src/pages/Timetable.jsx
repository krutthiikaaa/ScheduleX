import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchTimetableEvents, createTimetableEvent, deleteTimetableEvent } from "../utils/api";

function Timetable() {
  const [events, setEvents] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newEvent, setNewEvent] = useState({ subject: "", day: "Mon", startTime: "09:00", endTime: "10:30", venue: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const evtData = await fetchTimetableEvents();
    setEvents(evtData);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newEvent.subject) return;
    await createTimetableEvent(newEvent);
    setShowModal(false);
    setNewEvent({ subject: "", day: "Mon", startTime: "09:00", endTime: "10:30", venue: "" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteTimetableEvent(id);
    loadData();
  };

  const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const times = ['08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00'];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Timetable</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your weekly class schedule.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Class</button>
      </div>

      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <table style={{ width: "100%", borderCollapse: "collapse", tableLayout: "fixed" }}>
          <thead>
            <tr>
              <th style={{ width: 80, borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-light)", padding: 16, background: "var(--bg-secondary)" }}>Time</th>
              {days.map(d => (
                <th key={d} style={{ borderBottom: "1px solid var(--border)", borderRight: "1px solid var(--border-light)", padding: 16, background: "var(--bg-secondary)" }}>{d}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {times.map((t, idx) => (
              <tr key={t}>
                <td style={{ borderBottom: "1px solid var(--border-light)", borderRight: "1px solid var(--border-light)", padding: 16, textAlign: "center", color: "var(--text-muted)", fontSize: "0.85rem" }}>
                  {t}
                </td>
                {days.map(d => {
                  const dayEvents = events.filter(e => e.day === d && parseInt(e.startTime) === parseInt(t));
                  return (
                    <td key={d} style={{ borderBottom: "1px solid var(--border-light)", borderRight: "1px solid var(--border-light)", padding: 4, verticalAlign: 'top', height: 100 }}>
                      {dayEvents.map(evt => (
                        <div key={evt._id} style={{ background: "var(--primary)", color: "#FFF", padding: 8, borderRadius: "var(--radius-sm)", fontSize: "0.8rem", position: "relative", marginBottom: 4 }}>
                          <div style={{ fontWeight: "bold", marginBottom: 4 }}>{evt.subject || "Class"}</div>
                          <div>{evt.startTime} - {evt.endTime}</div>
                          <div>{evt.venue}</div>
                          <button style={{ position: "absolute", top: 4, right: 4, background: "none", border: "none", color: "#FFF", cursor: "pointer", fontSize: "0.8rem" }} onClick={() => handleDelete(evt._id)}>✕</button>
                        </div>
                      ))}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400 }}>
            <h2 style={{ marginBottom: 24 }}>Add Class</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="form-input" placeholder="Subject Name (e.g. Data Structures)" value={newEvent.subject} onChange={e => setNewEvent({...newEvent, subject: e.target.value})} required />

              <select className="form-input form-select" value={newEvent.day} onChange={e => setNewEvent({...newEvent, day: e.target.value})}>
                {days.map(d => <option key={d} value={d}>{d}</option>)}
              </select>

              <div style={{ display: "flex", gap: 12 }}>
                <input type="time" className="form-input" value={newEvent.startTime} onChange={e => setNewEvent({...newEvent, startTime: e.target.value})} required />
                <input type="time" className="form-input" value={newEvent.endTime} onChange={e => setNewEvent({...newEvent, endTime: e.target.value})} required />
              </div>

              <input className="form-input" placeholder="Venue / Room" value={newEvent.venue} onChange={e => setNewEvent({...newEvent, venue: e.target.value})} />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Class</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Timetable;
