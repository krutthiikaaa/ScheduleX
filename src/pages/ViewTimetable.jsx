import AppLayout from "../components/AppLayout";
import { Link } from "react-router-dom";

function ViewTimetable() {
  const timetableData = [
    { day: "Monday", subject: "Data Structures", teacher: "Dr. Smith", time: "09:00 – 10:00", room: "A-201" },
    { day: "Monday", subject: "Linear Algebra", teacher: "Prof. Chen", time: "10:00 – 11:00", room: "B-105" },
    { day: "Tuesday", subject: "Operating Systems", teacher: "Dr. Patel", time: "09:00 – 10:00", room: "C-302" },
    { day: "Wednesday", subject: "Database Systems", teacher: "Prof. Lee", time: "11:00 – 12:00", room: "A-201" },
    { day: "Thursday", subject: "Computer Networks", teacher: "Dr. Garcia", time: "14:00 – 15:00", room: "D-110" },
    { day: "Friday", subject: "Software Engineering", teacher: "Prof. Kim", time: "09:00 – 10:00", room: "B-105" },
  ];

  const dayColors = { Monday: "terracotta", Tuesday: "sage", Wednesday: "clay", Thursday: "brown", Friday: "terracotta" };

  return (
    <AppLayout>
      <div className="page-header" style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1>Schedules</h1>
          <p>CS Department — Fall 2026</p>
        </div>
        <div style={{ display: "flex", gap: 10 }}>
          <Link to="/create" className="btn btn-primary">+ New Schedule</Link>
        </div>
      </div>

      <div className="table-wrapper">
        <table>
          <thead>
            <tr><th>Day</th><th>Time</th><th>Subject</th><th>Teacher</th><th>Room</th><th>Actions</th></tr>
          </thead>
          <tbody>
            {timetableData.map((row, i) => (
              <tr key={i}>
                <td><span className={`schedule-tag ${dayColors[row.day] || "terracotta"}`}>{row.day}</span></td>
                <td style={{ fontWeight: 500, color: "var(--text-heading)" }}>{row.time}</td>
                <td style={{ fontWeight: 600, color: "var(--text-heading)" }}>{row.subject}</td>
                <td>{row.teacher}</td>
                <td><span className="room-badge">{row.room}</span></td>
                <td>
                  <div style={{ display: "flex", gap: 6 }}>
                    <button className="table-action-btn" title="View">️</button>
                    <button className="table-action-btn" title="Edit">️</button>
                    <button className="table-action-btn delete" title="Delete">️</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

export default ViewTimetable;