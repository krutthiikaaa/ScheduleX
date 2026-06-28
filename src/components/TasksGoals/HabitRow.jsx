import React, { useState } from 'react';
import HabitCell from './HabitCell';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitRow = ({ habit }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [editedTitle, setEditedTitle] = useState(habit.title || "");
  const [editedCategory, setEditedCategory] = useState(habit.category || "Personal");
  const { updateHabit, deleteHabit, daysInMonth = 30, selectedMonth } = useTasksGoals();

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const todayIndex = now.getDate() - 1;

  const handleSaveEdit = (e) => {
    e.preventDefault();
    if (!editedTitle.trim()) return;
    updateHabit(habit.id, { title: editedTitle.trim(), category: editedCategory });
    setShowEditModal(false);
  };

  const handleDelete = () => {
    if (window.confirm(`Are you sure you want to delete "${habit.title}"?`)) {
      deleteHabit(habit.id);
      setShowEditModal(false);
    }
  };

  return (
    <>
      <div className="habit-row" style={{ gridTemplateColumns: `240px repeat(${daysInMonth}, minmax(32px, 1fr))` }}>
        <div className="habit-info" style={{ display: 'flex', alignItems: 'center', paddingRight: 12 }}>
          <span 
            onClick={() => {
              setEditedTitle(habit.title || "");
              setEditedCategory(habit.category || "Personal");
              setShowEditModal(true);
            }}
            title="Click to edit title or delete habit"
            style={{ 
              color: '#1C1917', 
              fontWeight: '700', 
              cursor: 'pointer',
              borderBottom: '1.5px dashed rgba(28, 25, 23, 0.25)',
              paddingBottom: 2,
              transition: 'all 0.2s ease'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--primary, #D65A31)';
              e.currentTarget.style.borderBottomColor = 'var(--primary, #D65A31)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = '#1C1917';
              e.currentTarget.style.borderBottomColor = 'rgba(28, 25, 23, 0.25)';
            }}
          >
            {habit.title}
          </span>
        </div>
        {(habit.days || []).slice(0, daysInMonth).map((checked, index) => (
          <HabitCell 
            key={index} 
            dayIndex={index} 
            checked={checked} 
            habitId={habit.id} 
            isToday={isCurrentMonth && index === todayIndex}
          />
        ))}
      </div>

      {showEditModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card">
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Edit Habit</h2>
                <div className="modern-modal-subtitle">Update habit details or remove it from tracker</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowEditModal(false)}>×</button>
            </div>

            <form onSubmit={handleSaveEdit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="modern-form-group">
                <label className="modern-label">Habit Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Exercise"
                  value={editedTitle}
                  onChange={e => setEditedTitle(e.target.value)}
                  autoFocus
                />
              </div>

              <div className="modern-form-group">
                <label className="modern-label">Category</label>
                <select 
                  className="modern-input" 
                  value={editedCategory}
                  onChange={e => setEditedCategory(e.target.value)}
                >
                  <option value="Health">Health</option>
                  <option value="Study">Study</option>
                  <option value="Coding">Coding</option>
                  <option value="Reading">Reading</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="modern-modal-actions">
                <button 
                  type="button" 
                  className="modern-btn-delete"
                  onClick={handleDelete}
                >
                  Delete
                </button>

                <div style={{ display: "flex", gap: 12 }}>
                  <button type="button" className="modern-btn-cancel" onClick={() => setShowEditModal(false)}>Cancel</button>
                  <button type="submit" className="modern-btn-save">Save Changes</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitRow;
