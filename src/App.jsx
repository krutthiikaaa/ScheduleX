import { BrowserRouter, Routes, Route } from "react-router-dom";
import SplashScreen from "./pages/SplashScreen";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Subjects from "./pages/Subjects";
import Assignments from "./pages/Assignments";
import Notes from "./pages/Notes";
import Resources from "./pages/Resources";
import Attendance from "./pages/Attendance";
import CGPATracker from "./pages/CGPATracker";
import Exams from "./pages/Exams";
import TasksGoals from "./pages/TasksGoals";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<SplashScreen />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/timetable" element={<Timetable />} />
        <Route path="/subjects" element={<Subjects />} />
        <Route path="/assignments" element={<Assignments />} />
        <Route path="/notes" element={<Notes />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/attendance" element={<Attendance />} />
        <Route path="/cgpa" element={<CGPATracker />} />
        <Route path="/exams" element={<Exams />} />
        <Route path="/tasks" element={<TasksGoals />} />
        <Route path="/analytics" element={<Analytics />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/profile" element={<Profile />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;