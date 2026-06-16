import Sidebar from "../components/Sidebar";

function CreateTimetable() {
  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="card">
          <h2>Create Timetable</h2>
          <input placeholder="Subject" />
          <input placeholder="Teacher" />
          <button>Generate</button>
        </div>
      </div>
    </div>
  );
}

export default CreateTimetable;