import Sidebar from "../components/Sidebar";

function Dashboard() {
  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <div className="card">
          <h2>Dashboard</h2>
          <p>Total Timetables: 5</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;