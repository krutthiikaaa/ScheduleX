import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const WeeklyGoals = () => {
  const { weeklyGoals, toggleWeeklyGoal } = useTasksGoals();
  
  // Group by week
  const grouped = [1, 2, 3, 4].map(week => ({
    week,
    goals: weeklyGoals.filter(g => g.week === week)
  }));

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Weekly Goals</h2>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>+ Add Weekly Goal</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {grouped.map(({ week, goals }) => (
          <div key={week} style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Week {week}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goals.map(goal => (
                <div key={goal.id} className={`weekly-goal-item ${goal.completed ? 'completed' : ''}`}>
                  <div 
                    className={`checkbox-custom ${goal.completed ? 'checked' : ''}`} 
                    onClick={() => toggleWeeklyGoal(goal.id)}
                  >
                    {goal.completed && '✓'}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: 'rgba(0,0,0,0.05)' }}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
              ))}
              {goals.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No goals for this week.</p>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default WeeklyGoals;
