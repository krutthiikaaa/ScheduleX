import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } from "../utils/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  
  const [newAssignment, setNewAssignment] = useState({
    title: "", subject: "", dueDate: "", priority: "Medium", status: "Pending", description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const assigns = await fetchAssignments();
    setAssignments(assigns);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.subject) return;
    await createAssignment(newAssignment);
    setShowModal(false);
    setNewAssignment({ title: "", subject: "", dueDate: "", priority: "Medium", status: "Pending", description: "" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteAssignment(id);
    loadData();
  };

  const toggleStatus = async (assignment) => {
    const newStatus = assignment.status === 'Completed' ? 'Pending' : 'Completed';
    await updateAssignment(assignment._id, { status: newStatus });
    loadData();
  };

  const filtered = assignments.filter(a => filter === "All" || a.status === filter);

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Assignments</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your coursework deadlines.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ New Assignment</button>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
          {["All", "Pending", "In Progress", "Completed"].map(f => (
            <span 
              key={f} 
              onClick={() => setFilter(f)}
              style={{ 
                cursor: "pointer", 
                fontWeight: filter === f ? "bold" : "normal", 
                color: filter === f ? "var(--text-heading)" : "var(--text-muted)",
                borderBottom: filter === f ? "2px solid var(--primary)" : "none", 
                paddingBottom: 14 
              }}
            >
              {f}
            </span>
          ))}
        </div>

        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ borderBottom: "1px solid var(--border)", textAlign: "left" }}>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Done</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Title</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Subject</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Due Date</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Priority</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ast) => (
              <tr key={ast._id} style={{ borderBottom: "1px solid var(--border-light)", opacity: ast.status === 'Completed' ? 0.6 : 1 }}>
                <td style={{ padding: 16 }}>
                  <input type="checkbox" checked={ast.status === 'Completed'} onChange={() => toggleStatus(ast)} style={{ width: 18, height: 18 }} />
                </td>
                <td style={{ padding: 16, fontWeight: "bold" }}>{ast.title}</td>
                <td style={{ padding: 16, color: "var(--text-muted)" }}>{ast.subject || 'Unknown'}</td>
                <td style={{ padding: 16 }}>{ast.dueDate ? new Date(ast.dueDate).toLocaleDateString() : 'N/A'}</td>
                <td style={{ padding: 16 }}>
                  <span style={{ padding: "4px 8px", borderRadius: "12px", fontSize: "0.75rem", background: ast.priority === "High" ? "var(--danger-light)" : "var(--warning-light)", color: ast.priority === "High" ? "var(--danger)" : "var(--warning)" }}>
                    {ast.priority}
                  </span>
                </td>
                <td style={{ padding: 16, display: 'flex', gap: 8 }}>
                  <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleDelete(ast._id)}>🗑️</button>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan="6" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>No assignments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 500 }}>
            <h2 style={{ marginBottom: 24 }}>New Assignment</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="form-input" placeholder="Title" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} required />
              
              <input className="form-input" placeholder="Subject Name (e.g. Database Systems)" value={newAssignment.subject} onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})} required />

              <input className="form-input" type="date" value={newAssignment.dueDate} onChange={e => setNewAssignment({...newAssignment, dueDate: e.target.value})} />
              
              <select className="form-input form-select" value={newAssignment.priority} onChange={e => setNewAssignment({...newAssignment, priority: e.target.value})}>
                <option value="High">High Priority</option>
                <option value="Medium">Medium Priority</option>
                <option value="Low">Low Priority</option>
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Assignment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Assignments;
