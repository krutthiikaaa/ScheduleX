import React from 'react';
import AppLayout from "../components/AppLayout";
import { useTasksGoals } from "../context/TasksGoalsContext";
import HabitRow from "../components/TasksGoals/HabitRow";
import "../components/TasksGoals/TasksGoals.css";

function HabitTracker() {
  const { habits } = useTasksGoals();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const totalChecks = habits.reduce((acc, habit) => acc + habit.days.filter(d => d).length, 0);
  const totalPossible = habits.length * 31;
  const completionRate = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;
  
  const todayIndex = new Date().getDate() - 1;
  const todayChecks = habits.filter(h => h.days[todayIndex]).length;
  
  // Mock Progress values
  const dailyProgress = Math.min(100, Math.round((todayChecks / habits.length) * 100));
  const weeklyProgress = Math.min(100, Math.round(completionRate * 1.1));
  const monthlyProgress = completionRate;

  return (
    <AppLayout>
      <div className="tasks-goals-container" style={{ animation: "fadeIn 0.3s ease" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <div>
            <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Daily Habit Tracker</h1>
            <p style={{ color: "var(--text-muted)" }}>Build consistency and track your daily habits.</p>
          </div>
          <button className="btn btn-primary" style={{ padding: "8px 16px" }}>+ Add Habit</button>
        </div>

        {/* Statistics Cards */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
          <div className="stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🔥 Current Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 Days</div>
          </div>
          
          <div className="stat-card" style={{ borderTop: '4px solid var(--info)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>📈 Completion Percentage</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completionRate}%</div>
          </div>
          
          <div className="stat-card" style={{ borderTop: '4px solid var(--success)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>✅ Habits Completed Today</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{todayChecks} / {habits.length}</div>
          </div>
          
          <div className="stat-card" style={{ borderTop: '4px solid var(--warning)' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>🏆 Longest Streak</div>
            <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>24 Days</div>
          </div>
        </div>

        {/* Unified Tracker Grid */}
        <div className="card" style={{ padding: 24, overflowX: 'auto' }}>
          <div className="habit-tracker-grid" style={{ minWidth: 900 }}>
            <div className="habit-header-row">
              <div style={{ textAlign: 'left', paddingLeft: 8 }}>Habit</div>
              {days.map((day, index) => {
                 let weekClass = '';
                 if (index < 7) weekClass = 'week-1';
                 else if (index < 14) weekClass = 'week-2';
                 else if (index < 21) weekClass = 'week-3';
                 else weekClass = 'week-4';
                 
                 return (
                   <div key={day} className={weekClass} style={{ padding: '4px 0', borderRadius: '4px' }}>
                     {day}
                   </div>
                 );
              })}
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginTop: 8 }}>
              {habits.map(habit => (
                <HabitRow key={habit.id} habit={habit} />
              ))}
            </div>
          </div>
          
          <div style={{ display: 'flex', gap: 16, marginTop: 24, fontSize: '0.8rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-1" style={{ width: 16, height: 16 }}></div> Week 1</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-2" style={{ width: 16, height: 16 }}></div> Week 2</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-3" style={{ width: 16, height: 16 }}></div> Week 3</div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-4" style={{ width: 16, height: 16 }}></div> Week 4</div>
          </div>
        </div>

        {/* Progress Bars Section */}
        <div className="card" style={{ padding: 24, marginTop: 24 }}>
          <h2 style={{ marginBottom: 24, fontSize: '1.2rem' }}>Overall Progress</h2>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 32 }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Daily Progress</span>
                  <span style={{ fontWeight: 'bold' }}>{dailyProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${dailyProgress}%`, background: 'var(--primary)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Weekly Progress</span>
                  <span style={{ fontWeight: 'bold' }}>{weeklyProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${weeklyProgress}%`, background: 'var(--info)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Monthly Progress</span>
                  <span style={{ fontWeight: 'bold' }}>{monthlyProgress}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${monthlyProgress}%`, background: 'var(--success)' }}></div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Completion %</span>
                  <span style={{ fontWeight: 'bold' }}>{completionRate}%</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `${completionRate}%`, background: 'var(--warning)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Current Streak</span>
                  <span style={{ fontWeight: 'bold' }}>12 / 30 Days</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `40%`, background: 'var(--danger)' }}></div>
                </div>
              </div>
              
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 8 }}>
                  <span>Longest Streak</span>
                  <span style={{ fontWeight: 'bold' }}>24 / 30 Days</span>
                </div>
                <div className="progress-bar">
                  <div className="progress-fill" style={{ width: `80%`, background: 'var(--primary)' }}></div>
                </div>
              </div>
            </div>
          </div>
        </div>

      </div>
    </AppLayout>
  );
}

export default HabitTracker;
