import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitCell = ({ dayIndex, checked, habitId, color }) => {
  const { toggleHabitDay } = useTasksGoals();

  const getWeekClass = () => {
    if (dayIndex < 7) return 'week-1';
    if (dayIndex < 14) return 'week-2';
    if (dayIndex < 21) return 'week-3';
    return 'week-4';
  };

  const handleToggle = () => {
    toggleHabitDay(habitId, dayIndex);
  };

  return (
    <div 
      className={`habit-cell ${getWeekClass()} ${checked ? 'checked' : ''}`}
      style={{
        background: checked ? color : '',
        border: checked ? `1px solid ${color}` : '1px solid var(--border-light)'
      }}
      onClick={handleToggle}
    >
      {checked && <span style={{ color: 'white', fontSize: '10px' }}>✓</span>}
    </div>
  );
};

export default HabitCell;
