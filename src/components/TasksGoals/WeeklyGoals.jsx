import React, { useState } from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const WeeklyGoals = () => {
  const { weeklyGoals = [], toggleWeeklyGoal, addWeeklyGoal } = useTasksGoals();
  const [showModal, setShowModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newWeek, setNewWeek] = useState(1);
  const [newPriority, setNewPriority] = useState('Medium');
  
  // Group by week
  const grouped = [1, 2, 3, 4].map(week => ({
    week,
    goals: weeklyGoals.filter(g => g.week === week)
  }));

  const handleCreateGoal = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addWeeklyGoal({ title: newTitle.trim(), week: Number(newWeek), priority: newPriority });
    setNewTitle('');
    setShowModal(false);
  };

  return (
    <div className="card" style={{ padding: 24, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <h2>Weekly Goals</h2>
        <button onClick={() => setShowModal(true)} className="btn btn-secondary" style={{ fontSize: '0.85rem' }}>+ Add Weekly Goal</button>
      </div>
      
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 24 }}>
        {grouped.map(({ week, goals }) => (
          <div key={week} style={{ background: 'var(--bg-secondary)', padding: 16, borderRadius: 'var(--radius-sm)' }}>
            <h3 style={{ fontSize: '1.1rem', marginBottom: 12 }}>Week {week}</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {goals.map(goal => (
                <div key={goal.id} className={`weekly-goal-item ${goal.completed ? 'completed' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 12px', background: '#FFFFFF', borderRadius: 6, border: '1px solid var(--border-light)' }}>
                  <div 
                    className={`checkbox-custom ${goal.completed ? 'checked' : ''}`} 
                    onClick={() => toggleWeeklyGoal(goal.id)}
                    style={{ width: 20, height: 20, borderRadius: 4, border: '2px solid var(--primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', background: goal.completed ? 'var(--primary)' : 'transparent', color: '#fff', fontWeight: 'bold', fontSize: 12 }}
                  >
                    {goal.completed && '✓'}
                  </div>
                  <div style={{ flex: 1, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span style={{ fontSize: '0.95rem', textDecoration: goal.completed ? 'line-through' : 'none', color: goal.completed ? 'var(--text-muted)' : 'inherit' }}>{goal.title}</span>
                    <span style={{ fontSize: '0.75rem', padding: '2px 8px', borderRadius: 12, background: 'rgba(0,0,0,0.05)', fontWeight: 600 }}>
                      {goal.priority}
                    </span>
                  </div>
                </div>
              ))}
              {goals.length === 0 && <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>No goals for this week.</p>}
            </div>
          </div>
        ))}
      </div>

      {showModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card">
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Add Weekly Goal</h2>
                <div className="modern-modal-subtitle">Set an achievable target for this week</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateGoal} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="modern-form-group">
                <label className="modern-label">Goal Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Complete 5 LeetCode challenges"
                  value={newTitle}
                  onChange={e => setNewTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Target Week</label>
                <select 
                  className="modern-input" 
                  value={newWeek}
                  onChange={e => setNewWeek(e.target.value)}
                >
                  <option value={1}>Week 1</option>
                  <option value={2}>Week 2</option>
                  <option value={3}>Week 3</option>
                  <option value={4}>Week 4</option>
                </select>
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

export default WeeklyGoals;
