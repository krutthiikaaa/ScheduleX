import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitStatistics = () => {
  const { habits } = useTasksGoals();
  
  // Mock calculations
  const totalChecks = habits.reduce((acc, habit) => acc + habit.days.filter(d => d).length, 0);
  const totalPossible = habits.length * 31;
  const completionRate = Math.round((totalChecks / totalPossible) * 100) || 0;
  
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 16, marginBottom: 24 }}>
      <div className="stat-card" style={{ borderTop: '4px solid var(--primary)' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> Current Streak</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>12 Days</div>
      </div>
      
      <div className="stat-card" style={{ borderTop: '4px solid var(--info)' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> Completion Rate</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{completionRate}%</div>
      </div>
      
      <div className="stat-card" style={{ borderTop: '4px solid var(--success)' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> Habits Completed</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>{totalChecks} / {totalPossible}</div>
      </div>
      
      <div className="stat-card" style={{ borderTop: '4px solid var(--warning)' }}>
        <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}> Today's Progress</div>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold' }}>4 / {habits.length}</div>
      </div>
    </div>
  );
};

export default HabitStatistics;
