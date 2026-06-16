import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CreateTimetable from "./pages/CreateTimetable";
import ViewTimetable from "./pages/ViewTimetable";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/create" element={<CreateTimetable />} />
        <Route path="/view" element={<ViewTimetable />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;