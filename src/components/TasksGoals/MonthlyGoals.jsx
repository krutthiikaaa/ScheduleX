import React, { useState } from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const MonthlyGoals = () => {
  const { monthlyGoals = [], addMonthlyGoal } = useTasksGoals();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newDeadline, setNewDeadline] = useState('End of Month');
  const [newPriority, setNewPriority] = useState('Medium');

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addMonthlyGoal({ title: newTitle.trim(), deadline: newDeadline, priority: newPriority });
    setNewTitle('');
    setShowModal(false);
  };

  return (
    <div className="card" style={{ padding: 24, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Monthly Goals</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>+ Add Monthly Goal</button>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
        {monthlyGoals.map(goal => (
          <div key={goal.id} className="goal-card" style={{ padding: 16, background: 'var(--bg-secondary)', borderRadius: 8, border: '1px solid var(--border-light)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h4 style={{ margin: '0 0 4px 0', fontSize: '1rem' }}>{goal.title}</h4>
                <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Deadline: {goal.deadline}</div>
              </div>
              <span style={{ padding: '4px 8px', borderRadius: '12px', fontSize: '0.75rem', background: goal.priority === 'High' ? 'var(--danger-light, rgba(239, 68, 68, 0.1))' : 'var(--warning-light, rgba(245, 158, 11, 0.1))', color: goal.priority === 'High' ? 'var(--danger, #ef4444)' : 'var(--warning, #f59e0b)', fontWeight: 600 }}>
                {goal.priority}
              </span>
            </div>
            
            <div style={{ marginTop: 12 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', marginBottom: 4 }}>
                <span>Progress</span>
                <span style={{ fontWeight: 'bold', color: goal.progress === 100 ? 'var(--success, #10b981)' : 'inherit' }}>{goal.progress || 0}%</span>
              </div>
              <div className="progress-bar">
                <div className="progress-fill" style={{ width: `${goal.progress || 0}%`, background: goal.progress === 100 ? 'var(--success, #10b981)' : 'var(--primary)' }}></div>
              </div>
            </div>
          </div>
        ))}
        {monthlyGoals.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No monthly goals added yet.</p>}
      </div>

      {showModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card">
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Add Monthly Goal</h2>
                <div className="modern-modal-subtitle">Set a milestone for this month</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="modern-form-group">
                <label className="modern-label">Goal Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Publish Research Paper"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Deadline</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. July 31"
                  value={newDeadline}
                  onChange={e => setNewDeadline(e.target.value)}
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Priority</label>
                <select 
                  className="modern-input" 
                  value={newPriority}
                  onChange={e => setNewPriority(e.target.value)}
                >
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
              </div>

              <div className="modern-modal-actions" style={{ justifyContent: 'flex-end' }}>
                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="modern-btn-cancel" onClick={() => setShowModal(false)}>Cancel</button>
                  <button type="submit" className="modern-btn-save">Add Goal</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default MonthlyGoals;
