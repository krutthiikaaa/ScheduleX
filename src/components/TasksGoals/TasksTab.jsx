import React, { useState } from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';
import TaskCard from './TaskCard';

const TasksTab = () => {
  const { tasks = [], addTask } = useTasksGoals();
  const [filter, setFilter] = useState('All');
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Academic');
  
  const categories = ['All', 'Academic', 'Study', 'Coding', 'Personal'];
  const filteredTasks = tasks.filter(t => filter === 'All' || t.category === filter);
  
  const progress = tasks.length ? Math.round((tasks.filter(t => t.status === 'Completed').length / tasks.length) * 100) : 0;

  const handleCreateTask = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addTask({ title: newTitle.trim(), category: newCategory, priority: 'Medium' });
    setNewTitle('');
    setShowModal(false);
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 2.5fr', gap: 24, animation: 'fadeIn 0.3s ease', position: 'relative' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 24 }}>
        <div className="card" style={{ padding: 24 }}>
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
      
      <div className="card" style={{ padding: 24 }}>
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
          <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '6px 16px', fontSize: '0.9rem' }}>+ Add Task</button>
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

      {showModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card">
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Add New Task</h2>
                <div className="modern-modal-subtitle">Create a task to track your work</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateTask} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="modern-form-group">
                <label className="modern-label">Task Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Finish OS Homework"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Category</label>
                <select 
                  className="modern-input" 
                  value={newCategory}
                  onChange={e => setNewCategory(e.target.value)}
                >
                  <option value="Academic">Academic</option>
                  <option value="Study">Study</option>
                  <option value="Coding">Coding</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="modern-modal-actions" style={{ justifyContent: 'flex-end' }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="modern-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="modern-btn-save">Add Task</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TasksTab;
