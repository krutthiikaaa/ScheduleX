import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitCell = ({ dayIndex, checked, habitId }) => {
  const { toggleHabitDay } = useTasksGoals();

  const getWeekColor = () => {
    if (dayIndex < 7) return '#E7A07E';
    if (dayIndex < 14) return '#D7B49E';
    if (dayIndex < 21) return '#B7C5A3';
    return '#E5D5BE';
  };

  const handleToggle = () => {
    toggleHabitDay(habitId, dayIndex);
  };

  return (
    <div 
      className={`habit-cell ${checked ? 'checked' : ''}`}
      style={{
        backgroundColor: checked ? getWeekColor() : '#FFFFFF'
      }}
      onClick={handleToggle}
    >
    </div>
  );
};

export default HabitCell;
