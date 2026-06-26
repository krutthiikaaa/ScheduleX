import Sidebar from "../components/Sidebar";

function ViewTimetable() {
  const timetableData = [
    { day: "Monday", subject: "Data Structures", teacher: "Dr. Smith", time: "09:00 – 10:00", room: "A-201" },
    { day: "Monday", subject: "Linear Algebra", teacher: "Prof. Chen", time: "10:00 – 11:00", room: "B-105" },
    { day: "Tuesday", subject: "Operating Systems", teacher: "Dr. Patel", time: "09:00 – 10:00", room: "C-302" },
    { day: "Wednesday", subject: "Database Systems", teacher: "Prof. Lee", time: "11:00 – 12:00", room: "A-201" },
    { day: "Thursday", subject: "Computer Networks", teacher: "Dr. Garcia", time: "14:00 – 15:00", room: "D-110" },
    { day: "Friday", subject: "Software Engineering", teacher: "Prof. Kim", time: "09:00 – 10:00", room: "B-105" },
  ];

  const dayColors = {
    Monday: "terracotta",
    Tuesday: "sage",
    Wednesday: "clay",
    Thursday: "brown",
    Friday: "terracotta",
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>View Timetable</h1>
          <p>CS Department — Fall 2026</p>
        </div>

        <div className="table-wrapper">
          <table>
            <thead>
              <tr>
                <th>Day</th>
                <th>Time</th>
                <th>Subject</th>
                <th>Teacher</th>
                <th>Room</th>
              </tr>
            </thead>
            <tbody>
              {timetableData.map((row, i) => (
                <tr key={i}>
                  <td>
                    <span className={`schedule-tag ${dayColors[row.day] || "terracotta"}`}>
                      {row.day}
                    </span>
                  </td>
                  <td style={{ fontWeight: 500, color: "var(--text-heading)" }}>{row.time}</td>
                  <td style={{ fontWeight: 600, color: "var(--text-heading)" }}>{row.subject}</td>
                  <td>{row.teacher}</td>
                  <td>
                    <span style={{
                      display: "inline-block",
                      padding: "3px 10px",
                      background: "var(--bg-secondary)",
                      borderRadius: "var(--radius-full)",
                      fontSize: "0.8rem",
                      fontWeight: 500,
                      color: "var(--text-body)",
                    }}>
                      {row.room}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default ViewTimetable;