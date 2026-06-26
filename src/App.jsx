import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Courses from "./pages/Courses";
import Assignments from "./pages/Assignments";
import Resources from "./pages/Resources";
import TasksGoals from "./pages/TasksGoals";
import FocusMode from "./pages/FocusMode";
import CalendarView from "./pages/CalendarView";
import Analytics from "./pages/Analytics";
import Settings from "./pages/Settings";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          
          <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
          <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
          <Route path="/courses" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/courses/:courseId" element={<ProtectedRoute><Courses /></ProtectedRoute>} />
          <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
          <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
          <Route path="/tasks" element={<ProtectedRoute><TasksGoals /></ProtectedRoute>} />
          <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
          <Route path="/calendar" element={<ProtectedRoute><CalendarView /></ProtectedRoute>} />
          <Route path="/analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
          <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;