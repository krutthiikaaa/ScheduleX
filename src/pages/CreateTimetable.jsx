import Sidebar from "../components/Sidebar";
import { useState } from "react";

function CreateTimetable() {
  const [loading, setLoading] = useState(false);

  const handleGenerate = (e) => {
    e.preventDefault();
    setLoading(true);
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <div className="app-layout">
      <Sidebar />
      <main className="main-content">
        <div className="page-header">
          <h1>Create Timetable</h1>
          <p>Set up a new schedule in a few simple steps</p>
        </div>

        <div className="card create-form">
          <h2 style={{ marginBottom: 24 }}>Schedule Details</h2>
          <form onSubmit={handleGenerate}>
            <div className="form-group">
              <label htmlFor="create-title">Schedule Title</label>
              <input
                id="create-title"
                className="form-input"
                placeholder="e.g. CS Department — Spring 2027"
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="create-subject">Subject</label>
                <input
                  id="create-subject"
                  className="form-input"
                  placeholder="e.g. Data Structures"
                />
              </div>

              <div className="form-group">
                <label htmlFor="create-teacher">Teacher</label>
                <input
                  id="create-teacher"
                  className="form-input"
                  placeholder="e.g. Dr. Smith"
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="create-day">Day</label>
                <select id="create-day" className="form-input form-select">
                  <option value="">Select day</option>
                  <option>Monday</option>
                  <option>Tuesday</option>
                  <option>Wednesday</option>
                  <option>Thursday</option>
                  <option>Friday</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="create-time">Time Slot</label>
                <select id="create-time" className="form-input form-select">
                  <option value="">Select time</option>
                  <option>08:00 – 09:00</option>
                  <option>09:00 – 10:00</option>
                  <option>10:00 – 11:00</option>
                  <option>11:00 – 12:00</option>
                  <option>14:00 – 15:00</option>
                  <option>15:00 – 16:00</option>
                </select>
              </div>
            </div>

            <button
              id="create-submit"
              className="btn btn-primary"
              type="submit"
              disabled={loading}
              style={{ marginTop: 12 }}
            >
              {loading ? (
                <span className="loading-spinner" style={{ width: 20, height: 20, borderWidth: 2 }} />
              ) : (
                "Generate Schedule"
              )}
            </button>
          </form>
        </div>
      </main>
    </div>
  );
}

export default CreateTimetable;