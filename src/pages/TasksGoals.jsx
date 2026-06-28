import React from 'react';
import AppLayout from "../components/AppLayout";
import HabitTracker from "../components/TasksGoals/HabitTracker";
import HabitProgressDashboard from "../components/TasksGoals/HabitProgressDashboard";
import "../components/TasksGoals/TasksGoals.css";

function TasksGoalsPage() {
  return (
    <AppLayout>
      <div className="tasks-goals-container" style={{ animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <HabitTracker />
          <HabitProgressDashboard />
        </div>
      </div>
    </AppLayout>
  );
}

export default TasksGoalsPage;
