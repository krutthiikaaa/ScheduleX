import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchTasks, createTask, updateTask, deleteTask } from "../utils/api";

function TasksGoals() {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [newTask, setNewTask] = useState({ title: "", category: "Academic", priority: "Medium" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await fetchTasks();
    setTasks(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newTask.title) return;
    await createTask(newTask);
    setShowModal(false);
    setNewTask({ title: "", category: "Academic", priority: "Medium" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteTask(id);
    loadData();
  };

  const toggleTask = async (task) => {
    await updateTask(task._id, { isCompleted: !task.isCompleted });
    loadData();
  };

  const filtered = tasks.filter(t => filter === "All" || t.category === filter);
  const progress = tasks.length ? Math.round((tasks.filter(t => t.isCompleted).length / tasks.length) * 100) : 0;

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Tasks & Goals</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your daily goals and long-term tasks.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Task</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 2fr", gap: 24 }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h2 style={{ marginBottom: 16 }}>Progress</h2>
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
                <span>Overall Completion</span>
                <span style={{ fontWeight: "bold" }}>{progress}%</span>
              </div>
              <div style={{ width: "100%", height: "8px", background: "var(--bg-secondary)", borderRadius: "4px" }}>
                <div style={{ width: `${progress}%`, height: "100%", background: "var(--primary)", borderRadius: "4px", transition: 'width 0.3s' }}></div>
              </div>
            </div>
          </div>
        </div>

        <div className="card">
          <div style={{ display: "flex", gap: 16, marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
            {["All", "Academic", "Placement", "Personal", "Projects"].map(f => (
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

          <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
            {filtered.map((task) => (
              <div key={task._id} style={{ display: "flex", alignItems: "center", gap: 16, padding: 16, border: "1px solid var(--border)", borderRadius: "var(--radius-sm)", opacity: task.isCompleted ? 0.6 : 1, transition: 'all 0.2s' }}>
                <input type="checkbox" checked={task.isCompleted} onChange={() => toggleTask(task)} style={{ width: 20, height: 20, accentColor: "var(--primary)" }} />
                <div style={{ flex: 1, textDecoration: task.isCompleted ? "line-through" : "none" }}>
                  <div style={{ fontWeight: "bold" }}>{task.title}</div>
                  <div style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>{task.category}</div>
                </div>
                <div style={{ padding: "4px 12px", borderRadius: "12px", fontSize: "0.75rem", background: task.priority === "High" ? "var(--danger-light)" : task.priority === "Medium" ? "var(--warning-light)" : "var(--info-light)", color: task.priority === "High" ? "var(--danger)" : task.priority === "Medium" ? "var(--warning)" : "var(--info)" }}>
                  {task.priority} Priority
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32, border: "none" }} onClick={() => handleDelete(task._id)}>🗑️</button>
              </div>
            ))}
            {filtered.length === 0 && <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 20 }}>No tasks found.</p>}
          </div>
        </div>
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400 }}>
            <h2 style={{ marginBottom: 24 }}>New Task</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="form-input" placeholder="Task Title" value={newTask.title} onChange={e => setNewTask({...newTask, title: e.target.value})} required />
              
              <select className="form-input form-select" value={newTask.category} onChange={e => setNewTask({...newTask, category: e.target.value})}>
                <option value="Academic">Academic</option>
                <option value="Personal">Personal</option>
                <option value="Placement">Placement</option>
                <option value="Projects">Projects</option>
              </select>

              <select className="form-input form-select" value={newTask.priority} onChange={e => setNewTask({...newTask, priority: e.target.value})}>
                <option value="High">High</option>
                <option value="Medium">Medium</option>
                <option value="Low">Low</option>
              </select>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default TasksGoals;
