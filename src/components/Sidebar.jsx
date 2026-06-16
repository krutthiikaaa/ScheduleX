import { Link } from "react-router-dom";

function Sidebar() {
  return (
    <div className="sidebar">
      <h2>TimeTable</h2>
      <Link to="/dashboard">Dashboard</Link>
      <Link to="/create">Create</Link>
      <Link to="/view">View</Link>
    </div>
  );
}

export default Sidebar;