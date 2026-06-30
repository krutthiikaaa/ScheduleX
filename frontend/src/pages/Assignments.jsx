import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchAssignments, createAssignment, updateAssignment, deleteAssignment } from "../utils/api";

function Assignments() {
  const [assignments, setAssignments] = useState([]);
  const [filter, setFilter] = useState("All Assignments");
  const [showModal, setShowModal] = useState(false);
  
  const getPresetDate = (daysToAdd) => {
    const d = new Date();
    d.setDate(d.getDate() + daysToAdd);
    return d.toISOString().split('T')[0];
  };

  const [newAssignment, setNewAssignment] = useState({
    title: "", subject: "", dueDate: getPresetDate(1), priority: "Medium", status: "Pending", description: ""
  });

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    const assigns = await fetchAssignments();
    setAssignments(assigns);
  };

  const openNewModal = () => {
    setNewAssignment({
      title: "", subject: "", dueDate: getPresetDate(1), priority: "Medium", status: "Pending", description: ""
    });
    setShowModal(true);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newAssignment.title || !newAssignment.subject) return;
    await createAssignment(newAssignment);
    setShowModal(false);
    setNewAssignment({ title: "", subject: "", dueDate: getPresetDate(1), priority: "Medium", status: "Pending", description: "" });
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

  const isOverdue = (ast) => {
    return ast.status !== 'Completed';
  };

  const totalCount = assignments.length;
  const completedCount = assignments.filter(a => a.status === 'Completed').length;
  const overdueCount = assignments.filter(a => a.status !== 'Completed').length;
  const progressPercent = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;

  const filtered = assignments.filter(a => {
    if (filter === "Overdue") return isOverdue(a);
    if (filter === "Completed") return a.status === "Completed";
    return a.status !== "Completed";
  });

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "flex-end", marginBottom: 24 }}>
        <button className="btn btn-primary" onClick={openNewModal}>+ New Assignment</button>
      </div>

      {/* KPI Cards Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))", gap: 16, marginBottom: 24 }}>
        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", justify: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Total Assignments</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1 }}>{String(totalCount).padStart(2, '0')}</div>
          </div>
          <div style={{ width: "100%", height: 6, background: "var(--bg-secondary)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: "100%", height: "100%", background: "var(--primary)", borderRadius: 3 }}></div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", justify: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Overdue</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1 }}>{String(overdueCount).padStart(2, '0')}</div>
          </div>
          <div style={{ width: "100%", height: 6, background: "var(--bg-secondary)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: `${totalCount > 0 ? (overdueCount / totalCount) * 100 : 0}%`, height: "100%", background: "var(--danger, #c62828)", borderRadius: 3 }}></div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", justify: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Completed</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1 }}>{String(completedCount).padStart(2, '0')}</div>
          </div>
          <div style={{ width: "100%", height: 6, background: "var(--bg-secondary)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: `${totalCount > 0 ? (completedCount / totalCount) * 100 : 0}%`, height: "100%", background: "#2e7d32", borderRadius: 3 }}></div>
          </div>
        </div>

        <div className="card" style={{ padding: "20px", display: "flex", flexDirection: "column", justify: "space-between" }}>
          <div>
            <div style={{ fontSize: "0.85rem", fontWeight: 600, color: "var(--text-muted)", marginBottom: 8 }}>Study Progress</div>
            <div style={{ fontSize: "2.2rem", fontWeight: 800, color: "var(--text-heading)", lineHeight: 1 }}>{progressPercent}%</div>
          </div>
          <div style={{ width: "100%", height: 6, background: "var(--bg-secondary)", borderRadius: 3, marginTop: 16, overflow: "hidden" }}>
            <div style={{ width: `${progressPercent}%`, height: "100%", background: "var(--primary)", borderRadius: 3 }}></div>
          </div>
        </div>
      </div>

      <div className="card">
        <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
          {["All Assignments", "Overdue", "Completed"].map(f => (
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
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Status</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Title</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Subject</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Due Date</th>
              <th style={{ padding: 12, color: "var(--text-muted)", fontWeight: "normal" }}>Priority</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((ast) => {
              const formatDisplayDate = (dateStr) => {
                if (!dateStr) return 'No due date';
                const parts = dateStr.split('-');
                if (parts.length === 3) {
                  const d = new Date(parts[0], parts[1] - 1, parts[2]);
                  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
                }
                return new Date(dateStr).toLocaleDateString();
              };

              return (
                <tr key={ast._id} style={{ borderBottom: "1px solid var(--border-light)" }}>
                  <td style={{ padding: 16 }}>
                    <label style={{ display: "inline-flex", alignItems: "center", gap: 8, cursor: "pointer", userSelect: "none" }}>
                      <input
                        type="checkbox"
                        checked={ast.status === 'Completed'}
                        onChange={() => toggleStatus(ast)}
                        style={{ width: 18, height: 18, accentColor: "var(--primary)", cursor: "pointer" }}
                      />
                      <span style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        fontSize: "0.8rem",
                        fontWeight: 600,
                        padding: "4px 10px",
                        borderRadius: "12px",
                        background: ast.status === 'Completed' ? "#e8f5e9" : "var(--danger-light, #ffebee)",
                        color: ast.status === 'Completed' ? "#2e7d32" : "var(--danger, #c62828)"
                      }}>
                        {ast.status !== 'Completed' && <span style={{ width: 6, height: 6, borderRadius: "50%", background: "var(--danger, #c62828)" }}></span>}
                        {ast.status === 'Completed' ? "Completed" : "Overdue"}
                      </span>
                    </label>
                  </td>
                  <td style={{ padding: 16, fontWeight: "bold" }}>{ast.title}</td>
                  <td style={{ padding: 16, color: "var(--text-muted)" }}>{ast.subject || 'Unknown'}</td>
                  <td style={{ padding: 16, fontWeight: 500 }}>{formatDisplayDate(ast.dueDate)}</td>
                  <td style={{ padding: 16 }}>
                    <span style={{ padding: "4px 10px", borderRadius: "12px", fontSize: "0.75rem", fontWeight: 600, background: ast.priority === "High" ? "var(--danger-light, #ffebee)" : ast.priority === "Low" ? "#e3f2fd" : "var(--warning-light, #fff8e1)", color: ast.priority === "High" ? "var(--danger, #c62828)" : ast.priority === "Low" ? "#1565c0" : "var(--warning, #f57f17)" }}>
                      {ast.priority}
                    </span>
                  </td>
                </tr>
              );
            })}
            {filtered.length === 0 && (
              <tr><td colSpan="5" style={{ padding: 32, textAlign: "center", color: "var(--text-muted)" }}>No assignments found.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 500 }}>
            <h2 style={{ marginBottom: 24 }}>New Assignment</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 18 }}>
              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: 6 }}>Assignment Title</label>
                <input className="form-input" placeholder="e.g. Leetcode 103 problem" value={newAssignment.title} onChange={e => setNewAssignment({...newAssignment, title: e.target.value})} required autoFocus />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: 6 }}>Subject / Course</label>
                <input className="form-input" placeholder="e.g. DSA" value={newAssignment.subject} onChange={e => setNewAssignment({...newAssignment, subject: e.target.value})} required />
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: 8 }}> Due Date</label>
                
                {/* Quick preset buttons */}
                <div style={{ display: "flex", gap: 8, marginBottom: 12, flexWrap: "wrap" }}>
                  {[
                    { label: "Today", days: 0 },
                    { label: "Tomorrow", days: 1 },
                    { label: "In 3 Days", days: 3 },
                    { label: "Next Week", days: 7 }
                  ].map(preset => {
                    const val = getPresetDate(preset.days);
                    const isSelected = newAssignment.dueDate === val;
                    return (
                      <button
                        key={preset.label}
                        type="button"
                        onClick={() => setNewAssignment({ ...newAssignment, dueDate: val })}
                        style={{
                          padding: "6px 14px",
                          borderRadius: "var(--radius-btn)",
                          border: isSelected ? "1px solid var(--primary)" : "1px solid var(--border)",
                          background: isSelected ? "var(--primary-light)" : "var(--bg-secondary)",
                          color: isSelected ? "var(--primary)" : "var(--text-heading)",
                          fontSize: "0.8rem",
                          fontWeight: isSelected ? 600 : 500,
                          cursor: "pointer",
                          transition: "all 0.15s ease"
                        }}
                      >
                        {preset.label}
                      </button>
                    );
                  })}
                </div>

                {/* Custom date dropdowns */}
                {(() => {
                  const now = new Date();
                  const todayYear = now.getFullYear();
                  const todayMonth = now.getMonth() + 1;
                  const todayDay = now.getDate();

                  const parts = (newAssignment.dueDate || getPresetDate(1)).split('-');
                  const curYear = parseInt(parts[0], 10) || todayYear;
                  const curMonth = parseInt(parts[1], 10) || todayMonth;
                  const curDay = parseInt(parts[2], 10) || todayDay;
                  const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
                  const maxDays = new Date(curYear, curMonth, 0).getDate() || 31;

                  const startDay = (curYear === todayYear && curMonth === todayMonth) ? todayDay : 1;
                  const daysList = Array.from({ length: Math.max(0, maxDays - startDay + 1) }, (_, i) => startDay + i);

                  const availableMonths = months
                    .map((mName, idx) => ({ name: mName, val: idx + 1 }))
                    .filter(m => curYear > todayYear || m.val >= todayMonth);
                  const availableYears = [todayYear, todayYear + 1, todayYear + 2];

                  const updateDate = (m, d, y) => {
                    const minD = (y === todayYear && m === todayMonth) ? todayDay : 1;
                    const maxD = new Date(y, m, 0).getDate();
                    const validD = Math.max(minD, Math.min(d, maxD));
                    const fmt = `${y}-${String(m).padStart(2, '0')}-${String(validD).padStart(2, '0')}`;
                    setNewAssignment({ ...newAssignment, dueDate: fmt });
                  };

                  return (
                    <div style={{ display: "flex", gap: 8 }}>
                      <select
                        className="form-input form-select"
                        style={{ flex: 1.5, fontWeight: 500 }}
                        value={curMonth}
                        onChange={e => updateDate(parseInt(e.target.value, 10), curDay, curYear)}
                      >
                        {availableMonths.map(m => <option key={m.val} value={m.val}>{m.name}</option>)}
                      </select>
                      <select
                        className="form-input form-select"
                        style={{ flex: 1, fontWeight: 500 }}
                        value={curDay}
                        onChange={e => updateDate(curMonth, parseInt(e.target.value, 10), curYear)}
                      >
                        {daysList.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                      <select
                        className="form-input form-select"
                        style={{ flex: 1.2, fontWeight: 500 }}
                        value={curYear}
                        onChange={e => updateDate(curMonth, curDay, parseInt(e.target.value, 10))}
                      >
                        {availableYears.map(y => <option key={y} value={y}>{y}</option>)}
                      </select>
                    </div>
                  );
                })()}
              </div>

              <div>
                <label style={{ display: "block", fontSize: "0.85rem", fontWeight: 600, color: "var(--text-heading)", marginBottom: 6 }}> Priority Level</label>
                <select className="form-input form-select" style={{ fontWeight: 500 }} value={newAssignment.priority} onChange={e => setNewAssignment({...newAssignment, priority: e.target.value})}>
                  <option value="High">High Priority</option>
                  <option value="Medium">Medium Priority</option>
                  <option value="Low">Low Priority</option>
                </select>
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 12 }}>
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
