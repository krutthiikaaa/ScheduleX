import React, { useState } from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';
import TaskCard from './TaskCard';

const TasksTab = () => {
  const { tasks } = useTasksGoals();
  const [filter, setFilter] = useState('All');
  
  const categories = ['All', 'Academic', 'Study', 'Coding', 'Personal'];
  const filteredTasks = tasks.filter(t => filter === 'All' || t.category === filter);
  
  const progress = tasks.length ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0;

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 24, animation: 'fadeIn 0.3s ease' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card">
          <h2 style={{ marginBottom: 16 }}>Task Progress</h2>
          <div style={{ marginBottom: 16 }}>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "0.85rem", marginBottom: 8 }}>
              <span>Overall Completion</span>
              <span style={{ fontWeight: "bold" }}>{progress}%</span>
            </div>
            <div className="progress-bar">
              <div className="progress-fill" style={{ width: `${progress}%`, background: 'var(--primary)' }}></div>
            </div>
          </div>
          
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <span>{tasks.filter(t => t.status === 'Completed').length} Completed</span>
            <span>{tasks.filter(t => t.status !== 'Completed').length} Pending</span>
          </div>
        </div>
      </div>
      
      <div className="card">
        <div style={{ display: "flex", justifyContent: 'space-between', alignItems: 'center', marginBottom: 24, borderBottom: "1px solid var(--border-light)", paddingBottom: 16 }}>
          <div style={{ display: 'flex', gap: 16 }}>
            {categories.map(f => (
              <span 
                key={f} 
                onClick={() => setFilter(f)}
                style={{ 
                  cursor: "pointer", 
                  fontWeight: filter === f ? "bold" : "normal", 
                  color: filter === f ? "var(--primary)" : "var(--text-muted)",
                  transition: 'all 0.2s ease'
                }}
              >
                {f}
              </span>
            ))}
          </div>
          <button className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>+ Add Task</button>
        </div>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {filteredTasks.length > 0 ? (
            filteredTasks.map(task => (
              <TaskCard key={task.id} task={task} />
            ))
          ) : (
            <p style={{ textAlign: 'center', color: 'var(--text-muted)', padding: 32 }}>No tasks found for this category.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default TasksTab;
