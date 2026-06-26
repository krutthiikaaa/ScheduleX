import AppLayout from "../components/AppLayout";

function Resources() {
  const resources = [
    { title: "Introduction to Algorithms, 3rd Edition", type: "Book PDF", subject: "Data Structures", addedBy: "Dr. Smith" },
    { title: "Stanford OS Course Repo", type: "GitHub Link", subject: "Operating Systems", addedBy: "Prof. Lee" },
    { title: "Database Systems: Complete Guide", type: "Google Drive", subject: "Database Systems", addedBy: "Dr. Patel" },
  ];

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Resource Library</h1>
          <p style={{ color: "var(--text-muted)" }}>Books, links, and reference materials.</p>
        </div>
        <button className="btn btn-primary">+ Add Resource</button>
      </div>

      <div className="card">
        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {resources.map((res, idx) => (
            <li key={idx} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)" }}>
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, background: "var(--bg-secondary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  {res.type.includes("PDF") ? "📚" : res.type.includes("GitHub") ? "🐙" : "🔗"}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>{res.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{res.subject} • {res.type} • Added by {res.addedBy}</p>
                </div>
              </div>
              <button className="btn btn-secondary">Access</button>
            </li>
          ))}
        </ul>
      </div>
    </AppLayout>
  );
}

export default Resources;
