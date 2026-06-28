import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';
import HabitRow from './HabitRow';

const HabitTracker = () => {
  const { habits } = useTasksGoals();
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  return (
    <div className="card" style={{ padding: 24 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 24 }}>
        <h2>Monthly Habit Tracker</h2>
        <button className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>+ Add Habit</button>
      </div>
      
      <div className="habit-tracker-grid">
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
        
        {habits.map(habit => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>
      
      <div style={{ display: 'flex', gap: 16, marginTop: 16, fontSize: '0.8rem', color: 'var(--text-muted)', justifyContent: 'flex-end' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-1" style={{ width: 16, height: 16 }}></div> Week 1</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-2" style={{ width: 16, height: 16 }}></div> Week 2</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-3" style={{ width: 16, height: 16 }}></div> Week 3</div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 4 }}><div className="habit-cell week-4" style={{ width: 16, height: 16 }}></div> Week 4</div>
      </div>
    </div>
  );
};

export default HabitTracker;
