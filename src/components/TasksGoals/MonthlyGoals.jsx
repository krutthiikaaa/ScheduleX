import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const MonthlyGoals = () => {
  const { monthlyGoals } = useTasksGoals();

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Monthly Goals</h2>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>+ Add Monthly Goal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {monthlyGoals.map(goal => (
          <div key={goal.id} className="goal-card">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{goal.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {goal.deadline}</div>
              </div>
              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', background: goal.priority === 'High' ? 'var(--danger-light)' : 'var(--warning-light)', color: goal.priority === 'High' ? 'var(--danger)' : 'var(--warning)' }}>
                {goal.priority}
              </span>
            </div>
            
            <div style={{ marginTop: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Progress</span>
                <span style={{ fontWeight: 'bold', color: goal.progress === 100 ? 'var(--success)' : 'inherit' }}>{goal.progress}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${goal.progress}%`, background: goal.progress === 100 ? 'var(--success)' : 'var(--primary)' }}></div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MonthlyGoals;
