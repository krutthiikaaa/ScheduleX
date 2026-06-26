import AppLayout from "../components/AppLayout";

function Notes() {
  const notes = [
    { title: "Chapter 4: Trees & Graphs", subject: "Data Structures", type: "PDF", size: "2.4 MB", date: "Today" },
    { title: "Process Scheduling Algorithms", subject: "Operating Systems", type: "PowerPoint", size: "5.1 MB", date: "Yesterday" },
    { title: "Normalization Forms 1-3", subject: "Database Systems", type: "Markdown", size: "12 KB", date: "Oct 5" },
    { title: "Eigenvalues and Eigenvectors", subject: "Linear Algebra", type: "Word", size: "1.2 MB", date: "Oct 2" },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Notes Manager</h1>
          <p style={{ color: "var(--text-muted)" }}>Organize your study materials and lecture notes.</p>
        </div>
        <button className="btn btn-primary">+ Upload Note</button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <input type="text" placeholder="Search notes..." className="form-input" style={{ maxWidth: 300 }} />
          <select className="form-input form-select" style={{ maxWidth: 200 }}>
            <option>All Subjects</option>
            <option>Data Structures</option>
            <option>Operating Systems</option>
          </select>
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(250px, 1fr))", gap: 20 }}>
          {notes.map((note, idx) => (
            <div key={idx} style={{ padding: 20, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", transition: "all 0.2s" }} className="hover-card">
              <div style={{ fontSize: "2rem", marginBottom: 12 }}>
                {note.type === "PDF" ? "📕" : note.type === "PowerPoint" ? "🟧" : note.type === "Word" ? "📘" : "📝"}
              </div>
              <h3 style={{ fontSize: "1rem", marginBottom: 4 }}>{note.title}</h3>
              <p style={{ fontSize: "0.85rem", color: "var(--primary)", marginBottom: 12 }}>{note.subject}</p>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.75rem", color: "var(--text-muted)" }}>
                <span>{note.size}</span>
                <span>{note.date}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </AppLayout>
  );
}

export default Notes;
