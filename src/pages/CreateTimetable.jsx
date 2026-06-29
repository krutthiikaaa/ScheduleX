import AppLayout from "../components/AppLayout";
import { useState } from "react";
import { useNavigate } from "react-router-dom";

function CreateTimetable() {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => { setLoading(false); navigate("/view"); }, 1000);
  };

  return (
    <AppLayout>

      <div className="card create-form">
        <h2 style={{ marginBottom: 24 }}>Schedule Details</h2>
        <form onSubmit={handleGenerate}>
          <div className="form-group">
            <label htmlFor="create-title">Schedule Title</label>
            <input id="create-title" className="form-input" placeholder="e.g. CS Department — Spring 2027" />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="create-subject">Subject</label>
              <input id="create-subject" className="form-input" placeholder="e.g. Data Structures" />
            </div>
            <div className="form-group">
              <label htmlFor="create-teacher">Teacher</label>
              <input id="create-teacher" className="form-input" placeholder="e.g. Dr. Smith" />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group">
              <label htmlFor="create-day">Day</label>
              <select id="create-day" className="form-input form-select">
                <option value="">Select day</option>
                <option>Monday</option><option>Tuesday</option><option>Wednesday</option>
                <option>Thursday</option><option>Friday</option>
              </select>
            </div>
            <div className="form-group">
              <label htmlFor="create-time">Time Slot</label>
              <select id="create-time" className="form-input form-select">
                <option value="">Select time</option>
                <option>00:00 – 01:00</option><option>08:00 – 09:00</option><option>09:00 – 10:00</option>
                <option>10:00 – 11:00</option><option>11:00 – 12:00</option>
                <option>14:00 – 15:00</option><option>15:00 – 16:00</option>
              </select>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="create-room">Room</label>
            <input id="create-room" className="form-input" placeholder="e.g. A-201" />
          </div>

          <div className="form-group">
            <label htmlFor="create-category">Category</label>
            <select id="create-category" className="form-input form-select">
              <option value="">Select category</option>
              <option>Computer Science</option><option>Mathematics</option>
              <option>Physics</option><option>Engineering</option>
            </select>
          </div>

          <div style={{ display: "flex", gap: 12, marginTop: 16 }}>
            <button id="create-submit" className="btn btn-primary" type="submit" disabled={loading}>
              {loading ? <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} /> : "Generate Schedule"}
            </button>
            <button type="button" className="btn btn-secondary" onClick={() => navigate(-1)}>Cancel</button>
          </div>
        </form>
      </div>
    </AppLayout>
  );
}

export default CreateTimetable;