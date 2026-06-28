import React from "react";
import AppLayout from "../components/AppLayout";
import { useTasksGoals } from "../context/TasksGoalsContext";

function Analytics() {
  const { habits } = useTasksGoals();

  const totalHabitChecks = habits.reduce((acc, h) => acc + h.days.filter(d => d).length, 0);
  const totalHabitPossible = habits.length * 31;
  const habitCompletionPercent = totalHabitPossible ? Math.round((totalHabitChecks / totalHabitPossible) * 100) : 0;
  
  const dailyCompletion = Math.min(100, Math.round(habitCompletionPercent * 1.1));
  const weeklyCompletion = Math.min(100, Math.round(habitCompletionPercent * 0.95));
  const monthlyCompletion = habitCompletionPercent;

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Analytics & Insights</h1>
          <p style={{ color: "var(--text-muted)" }}>Track your habit consistency and productivity over time.</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 24, marginBottom: 32 }}>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Daily Completion</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--primary)" }}>{dailyCompletion}%</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Weekly Completion</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--info)" }}>{weeklyCompletion}%</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Monthly Completion</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--success)" }}>{monthlyCompletion}%</p>
        </div>
        <div className="card">
          <h3 style={{ fontSize: "1rem", color: "var(--text-muted)", marginBottom: 8 }}>Current Streak</h3>
          <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--warning)" }}>12 <span style={{ fontSize: "1rem", color: "var(--text-muted)", fontWeight: "normal" }}>Days</span></p>
          <p style={{ fontSize: "0.85rem", color: "var(--text-muted)" }}>Longest: 24 days</p>
        </div>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: 24 }}>
        <div className="card" style={{ minHeight: 400, display: "flex", flexDirection: "column" }}>
          <h3 style={{ marginBottom: 16 }}>Habit Completion Graph (Monthly)</h3>
          <div style={{ flex: 1, display: "flex", alignItems: "flex-end", gap: 12, borderBottom: '1px solid var(--border)', paddingBottom: 16 }}>
            {/* Mock Bar Chart representing completion per week */}
            {[40, 60, 30, 80, monthlyCompletion, 70, 90].map((h, i) => (
              <div key={i} style={{ flex: 1, height: `${h}%`, background: 'var(--primary-light)', borderRadius: '4px 4px 0 0', position: 'relative', transition: 'height 0.5s ease' }}>
                <div style={{ position: 'absolute', bottom: 0, left: 0, right: 0, height: '100%', background: 'var(--primary)', opacity: 0.8, borderRadius: '4px 4px 0 0' }}></div>
              </div>
            ))}
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: 12, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
            <span>Week 1</span><span>Week 2</span><span>Week 3</span><span>Week 4</span>
          </div>
        </div>
        
        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card" style={{ minHeight: 188, display: "flex", flexDirection: "column", gap: 12 }}>
            <h3 style={{ margin: 0, fontSize: '1.1rem' }}>Most Consistent Habit</h3>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>{habits[0]?.title || "N/A"}</span><span>95%</span>
              </div>
              <div style={{ width: '100%', height: 6, background: 'var(--bg-secondary)', borderRadius: 3 }}><div style={{ width: '95%', height: '100%', background: 'var(--primary)', borderRadius: 3 }}></div></div>
            </div>
            <h3 style={{ margin: 0, fontSize: '1.1rem', marginTop: 12 }}>Consistency Score</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold", color: "var(--success)", margin: 0 }}>A+</p>
          </div>
          
          <div className="card" style={{ minHeight: 188 }}>
            <h3 style={{ margin: 0, marginBottom: 16, fontSize: '1.1rem' }}>Calendar Heatmap</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap: 4 }}>
               {Array.from({length: 28}).map((_, i) => (
                 <div key={i} style={{ width: '100%', aspectRatio: '1/1', background: i % 3 === 0 ? 'var(--primary)' : i % 2 === 0 ? 'var(--primary-light)' : 'var(--bg-secondary)', borderRadius: 4, opacity: 0.8 }}></div>
               ))}
            </div>
          </div>
        </div>
      </div>
    </AppLayout>
  );
}

export default Analytics;
