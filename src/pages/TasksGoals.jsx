import React, { useState } from 'react';
import AppLayout from "../components/AppLayout";
import { useTasksGoals } from "../context/TasksGoalsContext";
import HabitTracker from "../components/TasksGoals/HabitTracker";
import HabitStatistics from "../components/TasksGoals/HabitStatistics";
import TasksTab from "../components/TasksGoals/TasksTab";
import WeeklyGoals from "../components/TasksGoals/WeeklyGoals";
import MonthlyGoals from "../components/TasksGoals/MonthlyGoals";
import "../components/TasksGoals/TasksGoals.css";

function TasksGoalsPage() {
  const [activeTab, setActiveTab] = useState('habits');
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
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 20 }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Productivity Workspace</h1>
            <p style={{ color: "var(--text-muted)" }}>Manage your habits, tasks, and short/long term goals seamlessly.</p>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="tabs" style={{ display: 'flex', gap: 16, borderBottom: '1px solid var(--border-light)', marginBottom: 24 }}>
          <div 
            className={`tab ${activeTab === 'habits' ? 'active' : ''}`}
            onClick={() => setActiveTab('habits')}
            style={{ padding: '12px 24px', cursor: 'pointer', fontWeight: 600, borderBottom: activeTab === 'habits' ? '2px solid var(--primary)' : 'none', color: activeTab === 'habits' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Habit Tracker
          </div>
          <div 
            className={`tab ${activeTab === 'tasks' ? 'active' : ''}`}
            onClick={() => setActiveTab('tasks')}
            style={{ padding: '12px 24px', cursor: 'pointer', fontWeight: 600, borderBottom: activeTab === 'tasks' ? '2px solid var(--primary)' : 'none', color: activeTab === 'tasks' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Tasks
          </div>
          <div 
            className={`tab ${activeTab === 'weekly' ? 'active' : ''}`}
            onClick={() => setActiveTab('weekly')}
            style={{ padding: '12px 24px', cursor: 'pointer', fontWeight: 600, borderBottom: activeTab === 'weekly' ? '2px solid var(--primary)' : 'none', color: activeTab === 'weekly' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Weekly Goals
          </div>
          <div 
            className={`tab ${activeTab === 'monthly' ? 'active' : ''}`}
            onClick={() => setActiveTab('monthly')}
            style={{ padding: '12px 24px', cursor: 'pointer', fontWeight: 600, borderBottom: activeTab === 'monthly' ? '2px solid var(--primary)' : 'none', color: activeTab === 'monthly' ? 'var(--primary)' : 'var(--text-muted)' }}
          >
            Monthly Goals
          </div>
        </div>

        {activeTab === 'habits' && (
          <div>
            <HabitStatistics />
            <HabitTracker />
            
            {/* Overall Progress Section */}
            <div className="card" style={{ padding: 24, marginTop: 24 }}>
              <h2 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Overall Habit Progress</h2>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                      <span>Daily Progress</span>
                      <span style={{ fontWeight: 'bold' }}>{dailyProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${dailyProgress}%`, background: '#E7A07E' }}></div>
                    </div>
                  </div>
                  
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                      <span>Weekly Progress</span>
                      <span style={{ fontWeight: 'bold' }}>{weeklyProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${weeklyProgress}%`, background: '#D7B49E' }}></div>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                      <span>Monthly Progress</span>
                      <span style={{ fontWeight: 'bold' }}>{monthlyProgress}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${monthlyProgress}%`, background: '#B7C5A3' }}></div>
                    </div>
                  </div>

                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                      <span>Completion %</span>
                      <span style={{ fontWeight: 'bold' }}>{completionRate}%</span>
                    </div>
                    <div className="progress-bar">
                      <div className="progress-fill" style={{ width: `${completionRate}%`, background: '#E5D5BE' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'tasks' && <TasksTab />}
        {activeTab === 'weekly' && <WeeklyGoals />}
        {activeTab === 'monthly' && <MonthlyGoals />}

      </div>
    </AppLayout>
  );
}

export default TasksGoalsPage;
