import React, { useState } from 'react';
import HabitCell from './HabitCell';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitRow = ({ habit }) => {
  const [showNotes, setShowNotes] = useState(false);
  const [notesText, setNotesText] = useState(habit.notes || "");
  const { updateHabit } = useTasksGoals();

  const handleSaveNotes = () => {
    updateHabit(habit.id, { notes: notesText });
    setShowNotes(false);
  };

  return (
    <>
      <div className="habit-row">
        <div className="habit-info" style={{ display: 'flex', justifyContent: 'space-between', paddingRight: 12 }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: '1.2rem' }}>{habit.icon}</span>
            <span style={{ color: '#2F2A27', fontWeight: 'bold' }}>{habit.title}</span>
          </div>
          <button 
            onClick={() => setShowNotes(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', opacity: 0.6, transition: 'opacity 0.2s', fontSize: '1rem' }}
            title="Notes"
          >
            
          </button>
        </div>
        {habit.days.map((checked, index) => (
          <HabitCell 
            key={index} 
            dayIndex={index} 
            checked={checked} 
            habitId={habit.id} 
          />
        ))}
      </div>

      {showNotes && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.5)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card" style={{ width: 400, animation: 'scaleIn 0.2s ease' }}>
            <h2 style={{ marginBottom: 16 }}>{habit.title} - Notes</h2>
            <textarea 
              className="form-input" 
              style={{ minHeight: 120, width: '100%', resize: 'vertical' }}
              placeholder="Add your notes here..."
              value={notesText}
              onChange={e => setNotesText(e.target.value)}
            />
            <div style={{ display: "flex", justifyContent: "flex-end", gap: 12, marginTop: 16 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowNotes(false)}>Cancel</button>
              <button type="button" className="btn btn-primary" onClick={handleSaveNotes}>Save</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default HabitRow;
