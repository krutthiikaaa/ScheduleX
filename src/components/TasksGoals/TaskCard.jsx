import React from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const TaskCard = ({ task }) => {
  const { toggleTask, deleteTask } = useTasksGoals();
  const isCompleted = task.status === 'Completed';

  return (
    <div className={`task-card ${isCompleted ? 'completed' : ''}`}>
      <div 
        className={`checkbox-custom ${isCompleted ? 'checked' : ''}`}
        onClick={() => toggleTask(task.id)}
      >
        {isCompleted && '✓'}
      </div>
      
      <div style={{ flex: 1, textDecoration: isCompleted ? 'line-through' : 'none' }}>
        <div style={{ fontWeight: 'bold', fontSize: '1.05rem', color: 'var(--text-heading)' }}>{task.title}</div>
        <div style={{ display: 'flex', gap: 12, marginTop: 4, fontSize: '0.8rem', color: 'var(--text-muted)' }}>
          <span>{task.category}</span>
          <span>•</span>
          <span>Deadline: {task.deadline}</span>
        </div>
      </div>
      
      <div style={{ 
        padding: '4px 12px', 
        borderRadius: '12px', 
        fontSize: '0.75rem', 
        background: task.priority === 'High' ? 'var(--danger-light)' : task.priority === 'Medium' ? 'var(--warning-light)' : 'var(--info-light)', 
        color: task.priority === 'High' ? 'var(--danger)' : task.priority === 'Medium' ? 'var(--warning)' : 'var(--info)' 
      }}>
        {task.priority}
      </div>
      
      <button className="icon-btn" style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1.1rem', opacity: 0.6 }} onClick={() => deleteTask(task.id)}>️</button>
    </div>
  );
};

export default TaskCard;
