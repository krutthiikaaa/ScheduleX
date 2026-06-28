import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { TasksGoalsProvider } from "./context/TasksGoalsContext";
import { FocusProvider } from "./context/FocusContext";
import ProtectedRoute from "./components/ProtectedRoute";
import LandingPage from "./pages/LandingPage";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Timetable from "./pages/Timetable";
import Assignments from "./pages/Assignments";
import Resources from "./pages/Resources";
import HabitTracker from "./pages/TasksGoals";
import FocusMode from "./pages/FocusMode";
import Profile from "./pages/Profile";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <TasksGoalsProvider>
          <FocusProvider>
            <Routes>
              <Route path="/" element={<LandingPage />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              
              <Route path="/dashboard" element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
              <Route path="/timetable" element={<ProtectedRoute><Timetable /></ProtectedRoute>} />
              <Route path="/assignments" element={<ProtectedRoute><Assignments /></ProtectedRoute>} />
              <Route path="/resources" element={<ProtectedRoute><Resources /></ProtectedRoute>} />
              <Route path="/habits" element={<ProtectedRoute><HabitTracker /></ProtectedRoute>} />
              <Route path="/focus" element={<ProtectedRoute><FocusMode /></ProtectedRoute>} />
              <Route path="/profile" element={<ProtectedRoute><Profile /></ProtectedRoute>} />
            </Routes>
          </FocusProvider>
        </TasksGoalsProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;