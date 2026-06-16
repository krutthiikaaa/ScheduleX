import Sidebar from "../components/Sidebar";

function ViewTimetable() {
  return (
    <div className="container">
      <Sidebar />
      <div className="main">
        <h2>View Timetable</h2>
        <table>
          <thead>
            <tr>
              <th>Day</th>
              <th>Subject</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Monday</td>
              <td>Math</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ViewTimetable;