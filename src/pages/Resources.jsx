import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchResources, createResource, deleteResource, fetchCourses } from "../utils/api";

function Resources() {
  const [resources, setResources] = useState([]);
  const [courses, setCourses] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newRes, setNewRes] = useState({ title: "", type: "PDF", courseId: "", url: "" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const [resData, courseData] = await Promise.all([fetchResources(), fetchCourses()]);
    setResources(resData);
    setCourses(courseData);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newRes.title || !newRes.courseId) return;
    await createResource(newRes);
    setShowModal(false);
    setNewRes({ title: "", type: "PDF", courseId: "", url: "" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteResource(id);
    loadData();
  };

  const filtered = resources.filter(r => filter === "All" || r.type.includes(filter));

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Resources</h1>
          <p style={{ color: "var(--text-muted)" }}>Unified library for notes, books, and links.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Resource</button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 24 }}>
          <input type="text" placeholder="Search resources..." className="form-input" style={{ maxWidth: 300 }} />
          <select className="form-input form-select" style={{ maxWidth: 200 }} value={filter} onChange={e => setFilter(e.target.value)}>
            <option value="All">All Types</option>
            <option value="PDF">PDFs & Docs</option>
            <option value="Link">Web Links</option>
            <option value="Video">Videos</option>
          </select>
        </div>

        <ul style={{ listStyle: "none", padding: 0, margin: 0, display: "flex", flexDirection: "column", gap: 16 }}>
          {filtered.map((res) => (
            <li key={res._id} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", transition: "all 0.2s" }} className="hover-card">
              <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
                <div style={{ width: 48, height: 48, background: "var(--bg-secondary)", borderRadius: 8, display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem" }}>
                  {res.type === "PDF" ? "📚" : res.type === "Video" ? "🎥" : "🔗"}
                </div>
                <div>
                  <h3 style={{ fontSize: "1.1rem", marginBottom: 4 }}>{res.title}</h3>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{res.courseId?.name || "General"} • {res.type}</p>
                </div>
              </div>
              <div style={{ display: "flex", gap: 12 }}>
                <a href={res.url} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: "8px 16px" }}>Open</a>
                <button className="icon-btn" style={{ width: 36, height: 36 }} onClick={() => handleDelete(res._id)}>🗑️</button>
              </div>
            </li>
          ))}
          {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>No resources found.</p>}
        </ul>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400 }}>
            <h2 style={{ marginBottom: 24 }}>Add Resource</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="form-input" placeholder="Resource Title" value={newRes.title} onChange={e => setNewRes({...newRes, title: e.target.value})} required />
              
              <select className="form-input form-select" value={newRes.courseId} onChange={e => setNewRes({...newRes, courseId: e.target.value})} required>
                <option value="">Select Course</option>
                {courses.map(c => <option key={c._id} value={c._id}>{c.name}</option>)}
              </select>

              <select className="form-input form-select" value={newRes.type} onChange={e => setNewRes({...newRes, type: e.target.value})}>
                <option value="PDF">Document / PDF</option>
                <option value="Link">Web Link</option>
                <option value="Video">Video Link</option>
              </select>

              <input className="form-input" placeholder="URL or Drive Link" value={newRes.url} onChange={e => setNewRes({...newRes, url: e.target.value})} required />

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Resource</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Resources;
