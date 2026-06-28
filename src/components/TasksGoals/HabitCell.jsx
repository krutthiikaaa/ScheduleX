import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitCell = ({ dayIndex, checked, habitId, color }) => {
  const { toggleHabitDay } = useTasksGoals();

  const handleToggle = () => {
    toggleHabitDay(habitId, dayIndex);
  };

  return (
    <div 
      className={`habit-cell ${checked ? 'checked' : ''}`}
      style={{
        backgroundColor: checked ? color : '#FFFFFF'
      }}
      onClick={handleToggle}
    >
    </div>
  );
};

export default HabitCell;
