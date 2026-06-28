import React from 'react';
import AppLayout from "../components/AppLayout";
import { useTasksGoals } from "../context/TasksGoalsContext";
import HabitTracker from "../components/TasksGoals/HabitTracker";
import HabitStatistics from "../components/TasksGoals/HabitStatistics";
import "../components/TasksGoals/TasksGoals.css";

function TasksGoalsPage() {
  const { habits, daysInMonth = 30 } = useTasksGoals();

  // Dynamic progress calculations
  const totalChecks = habits.reduce((acc, habit) => acc + (habit.days || []).slice(0, daysInMonth).filter(Boolean).length, 0);
  const totalPossible = habits.length * daysInMonth;
  const completionRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;
  
  const todayIndex = Math.min(new Date().getDate() - 1, daysInMonth - 1);
  const todayChecks = habits.filter(h => (h.days || [])[todayIndex]).length;
  
  const dailyProgress = habits.length ? Math.round((todayChecks / habits.length) * 100) : 0;
  const weeklyProgress = Math.min(100, Math.round(completionRate * 1.05));
  const monthlyProgress = completionRate;

  return (
    <AppLayout>
      <div className="tasks-goals-container" style={{ animation: "fadeIn 0.3s ease" }}>
        <div>
          <HabitStatistics />
          <HabitTracker />
          
          {/* Overall Progress Section */}
          <div className="card" style={{ padding: 28, marginTop: 28, borderRadius: "22px", border: "1px solid rgba(231, 229, 228, 0.9)", boxShadow: "0 4px 20px -2px rgba(0,0,0,0.02)" }}>
            <h2 style={{ marginBottom: 24, fontSize: '1.25rem', fontWeight: 700, color: "#1C1917" }}>Overall Habit Progress</h2>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: 32 }}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600, color: "#57534E" }}>
                    <span>Daily Progress</span>
                    <span style={{ fontWeight: 'bold', color: "#1C1917" }}>{dailyProgress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, borderRadius: 99, background: "#F5F5F4", overflow: "hidden" }}>
                    <div className="progress-fill" style={{ width: `${dailyProgress}%`, background: 'var(--primary, #D65A31)', height: "100%", borderRadius: 99, transition: "width 0.5s ease" }}></div>
                  </div>
                </div>
                
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600, color: "#57534E" }}>
                    <span>Weekly Progress</span>
                    <span style={{ fontWeight: 'bold', color: "#1C1917" }}>{weeklyProgress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, borderRadius: 99, background: "#F5F5F4", overflow: "hidden" }}>
                    <div className="progress-fill" style={{ width: `${weeklyProgress}%`, background: '#E7A07E', height: "100%", borderRadius: 99, transition: "width 0.5s ease" }}></div>
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600, color: "#57534E" }}>
                    <span>Monthly Progress</span>
                    <span style={{ fontWeight: 'bold', color: "#1C1917" }}>{monthlyProgress}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, borderRadius: 99, background: "#F5F5F4", overflow: "hidden" }}>
                    <div className="progress-fill" style={{ width: `${monthlyProgress}%`, background: '#B7C5A3', height: "100%", borderRadius: 99, transition: "width 0.5s ease" }}></div>
                  </div>
                </div>

                <div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.9rem', marginBottom: 8, fontWeight: 600, color: "#57534E" }}>
                    <span>Completion Rate</span>
                    <span style={{ fontWeight: 'bold', color: "#1C1917" }}>{completionRate}%</span>
                  </div>
                  <div className="progress-bar" style={{ height: 10, borderRadius: 99, background: "#F5F5F4", overflow: "hidden" }}>
                    <div className="progress-fill" style={{ width: `${completionRate}%`, background: '#D7B49E', height: "100%", borderRadius: 99, transition: "width 0.5s ease" }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default TasksGoalsPage;
