import AppLayout from "../components/AppLayout";

function Exams() {
  const exams = [
    { title: "Midterm: Data Structures", date: "Oct 15, 2026", time: "10:00 AM", venue: "Main Hall", status: "Upcoming", syllabus: "Chapters 1-5" },
    { title: "Quiz: Operating Systems", date: "Oct 18, 2026", time: "11:00 AM", venue: "Room C-102", status: "Upcoming", syllabus: "Process Scheduling" },
    { title: "Final: Database Systems", date: "Nov 20, 2026", time: "09:00 AM", venue: "Exam Hall A", status: "Scheduled", syllabus: "Full Syllabus" },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Exam Planner</h1>
          <p style={{ color: "var(--text-muted)" }}>Keep track of your exams and syllabus.</p>
        </div>
        <button className="btn btn-primary">+ Add Exam</button>
      </div>

      <div className="card">
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Exam</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Date & Time</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Venue</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Syllabus</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {exams.map((exam, idx) => (
              <tr key={idx} style={{ borderBottom: "1px solid var(--border-light)" }}>
                <td style={{ padding: 16, fontWeight: "bold", color: "var(--danger)" }}>{exam.title}</td>
                <td style={{ padding: 16 }}>
                  <div>{exam.date}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{exam.time}</div>
                </td>
                <td style={{ padding: 16 }}>{exam.venue}</td>
                <td style={{ padding: 16, color: "var(--text-muted)" }}>{exam.syllabus}</td>
                <td style={{ padding: 16 }}>
                  <button className="btn btn-secondary" style={{ padding: "6px 12px", fontSize: "0.8rem" }}>Revise</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppLayout>
  );
}

export default Exams;
