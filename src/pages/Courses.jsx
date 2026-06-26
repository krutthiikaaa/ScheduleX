import { useState, useEffect } from "react";
import AppLayout from "../components/AppLayout";
import { fetchCourses, createCourse, deleteCourse } from "../utils/api";

function Courses() {
  const [courses, setCourses] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newCourse, setNewCourse] = useState({ name: "", code: "", credits: 3, faculty: "", color: "#D65A31" });

  useEffect(() => { loadData(); }, []);

  const loadData = async () => {
    const data = await fetchCourses();
    setCourses(data);
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!newCourse.name) return;
    await createCourse(newCourse);
    setShowModal(false);
    setNewCourse({ name: "", code: "", credits: 3, faculty: "", color: "#D65A31" });
    loadData();
  };

  const handleDelete = async (id) => {
    await deleteCourse(id);
    loadData();
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>My Courses</h1>
          <p style={{ color: "var(--text-muted)" }}>Manage your courses, assignments, and grades.</p>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>+ Add Course</button>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(300px, 1fr))", gap: 24 }}>
        {courses.map((course) => {
          return (
            <div key={course._id} className="card hover-card" style={{ borderTop: `4px solid ${course.color}` }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: 16 }}>
                <div>
                  <h2 style={{ fontSize: "1.2rem", marginBottom: 4 }}>{course.name}</h2>
                  <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>{course.code} • {course.credits} Credits</p>
                </div>
                <button className="icon-btn" style={{ width: 32, height: 32 }} onClick={() => handleDelete(course._id)}>🗑️</button>
              </div>
              
              <div style={{ marginBottom: 16, display: "flex", alignItems: "center", gap: 8 }}>
                <div style={{ width: 32, height: 32, borderRadius: "50%", background: "var(--bg-secondary)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "0.8rem" }}>👨‍🏫</div>
                <span style={{ fontSize: "0.9rem" }}>{course.faculty || "TBA"}</span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12 }}>
                <button className="btn btn-secondary" style={{ padding: "8px", fontSize: "0.8rem", gridColumn: "span 2" }}>Open Workspace</button>
              </div>
            </div>
          );
        })}
        {courses.length === 0 && <p style={{ color: 'var(--text-muted)' }}>No courses added yet.</p>}
      </div>

      {showModal && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400 }}>
            <h2 style={{ marginBottom: 24 }}>Add Course</h2>
            <form onSubmit={handleCreate} style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <input className="form-input" placeholder="Course Name" value={newCourse.name} onChange={e => setNewCourse({...newCourse, name: e.target.value})} required />
              <input className="form-input" placeholder="Course Code" value={newCourse.code} onChange={e => setNewCourse({...newCourse, code: e.target.value})} required />
              <input className="form-input" placeholder="Faculty Name" value={newCourse.faculty} onChange={e => setNewCourse({...newCourse, faculty: e.target.value})} />
              
              <div style={{ display: 'flex', gap: 12 }}>
                <input className="form-input" type="number" placeholder="Credits" value={newCourse.credits} onChange={e => setNewCourse({...newCourse, credits: Number(e.target.value)})} />
                <input type="color" className="form-input" style={{ width: 60, padding: 4 }} value={newCourse.color} onChange={e => setNewCourse({...newCourse, color: e.target.value})} />
              </div>

              <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Save Course</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default Courses;
