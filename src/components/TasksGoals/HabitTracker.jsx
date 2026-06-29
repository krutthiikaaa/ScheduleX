import React, { useState } from 'react';
import { useTasksGoals } from '../../context/TasksGoalsContext';
import HabitRow from './HabitRow';

const HabitTracker = () => {
  const { 
    habits, addHabit, 
    monthName = "June", year = 2026, daysInMonth = 30, selectedMonth,
    prevMonth, nextMonth, isCurrentOrFutureMonth 
  } = useTasksGoals();

  const [showAddModal, setShowAddModal] = useState(false);
  const [newTitle, setNewTitle] = useState('');
  const [newCategory, setNewCategory] = useState('Personal');

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  const now = new Date();
  const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentMonth = selectedMonth === currentMonthKey;
  const todayDay = now.getDate();

  const handleCreateHabit = (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    addHabit({ title: newTitle.trim(), category: newCategory });
    setNewTitle('');
    setShowAddModal(false);
  };

  const gridCols = `240px repeat(${daysInMonth}, minmax(32px, 1fr))`;

  return (
    <div className="card" style={{ padding: 24, position: 'relative' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20, flexWrap: 'wrap', gap: 16 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <span style={{ fontSize: '1.1rem', fontWeight: 700, color: '#D65A31', backgroundColor: 'rgba(214, 90, 49, 0.12)', padding: '6px 16px', borderRadius: '20px' }}>
            {monthName} {year}
          </span>
          <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)', fontWeight: 500 }}>
            {daysInMonth} Days {isCurrentMonth && <span style={{ color: '#D65A31', fontWeight: 700, marginLeft: 6 }}>• Today is Day {todayDay}</span>}
          </span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Month Navigation */}
          <div style={{ display: 'flex', alignItems: 'center', gap: 6, background: 'var(--bg-secondary)', padding: '4px 6px', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
            <button 
              onClick={prevMonth}
              className="btn" 
              style={{ padding: '4px 10px', fontSize: '0.85rem', background: 'var(--card-bg)', color: 'var(--text-heading)', borderRadius: '6px', border: '1px solid var(--border-light)', cursor: 'pointer', fontWeight: 600 }}
              title="Previous Month"
            >
              ◀ Prev
            </button>
            <span style={{ fontWeight: 700, padding: '0 8px', minWidth: '110px', textAlign: 'center', color: 'var(--text-heading)', fontSize: '0.9rem' }}>
              {monthName} {year}
            </span>
            <button 
              onClick={nextMonth}
              disabled={isCurrentOrFutureMonth}
              className="btn" 
              style={{ 
                padding: '4px 10px', 
                fontSize: '0.85rem', 
                background: isCurrentOrFutureMonth ? 'var(--bg-secondary)' : 'var(--card-bg)', 
                color: 'var(--text-heading)',
                borderRadius: '6px', 
                border: '1px solid var(--border-light)',
                cursor: isCurrentOrFutureMonth ? 'not-allowed' : 'pointer',
                opacity: isCurrentOrFutureMonth ? 0.4 : 1,
                fontWeight: 600
              }}
              title={isCurrentOrFutureMonth ? "Cannot access next month in this month itself" : "Next Month"}
            >
              Next ▶
            </button>
          </div>

          <button onClick={() => setShowAddModal(true)} className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 16px' }}>+ Add Habit</button>
        </div>
      </div>
      
      <div className="habit-tracker-grid">
        {/* Weeks Banner Row */}
        <div className="habit-header-row" style={{ gridTemplateColumns: gridCols, marginBottom: 4 }}>
          <div style={{ textAlign: 'left', paddingLeft: 8, color: 'var(--text-heading)' }}>Weeks of Month</div>
          <div className="week-1" style={{ gridColumn: 'span 7', padding: '6px 0', borderRadius: '4px', color: '#B85D34', fontSize: '0.8rem' }}>Week 1 (Days 1-7)</div>
          <div className="week-2" style={{ gridColumn: 'span 7', padding: '6px 0', borderRadius: '4px', color: '#A06E50', fontSize: '0.8rem' }}>Week 2 (Days 8-14)</div>
          <div className="week-3" style={{ gridColumn: 'span 7', padding: '6px 0', borderRadius: '4px', color: '#687B52', fontSize: '0.8rem' }}>Week 3 (Days 15-21)</div>
          <div className="week-4" style={{ gridColumn: `span ${daysInMonth - 21}`, padding: '6px 0', borderRadius: '4px', color: '#8C775B', fontSize: '0.8rem' }}>Week 4 (Days 22-{daysInMonth})</div>
        </div>

        {/* Days Header Row */}
        <div className="habit-header-row" style={{ gridTemplateColumns: gridCols }}>
          <div style={{ textAlign: 'left', paddingLeft: 8 }}>Habit</div>
          {days.map((day, index) => {
             let weekClass = '';
             if (index < 7) weekClass = 'week-1';
             else if (index < 14) weekClass = 'week-2';
             else if (index < 21) weekClass = 'week-3';
             else weekClass = 'week-4';
             
             const isTodayDay = isCurrentMonth && day === todayDay;

             return (
               <div 
                 key={day} 
                 className={isTodayDay ? '' : weekClass} 
                 style={{ 
                   padding: isTodayDay ? '6px 0' : '4px 0', 
                   borderRadius: '6px',
                   backgroundColor: isTodayDay ? '#D65A31' : undefined,
                   color: isTodayDay ? 'var(--card-bg)' : undefined,
                   fontWeight: isTodayDay ? '800' : undefined,
                   boxShadow: isTodayDay ? '0 4px 14px rgba(214, 90, 49, 0.45)' : undefined,
                   transform: isTodayDay ? 'scale(1.15) translateY(-2px)' : undefined,
                   position: 'relative',
                   zIndex: isTodayDay ? 3 : 1
                 }}
                 title={isTodayDay ? "TODAY" : `Day ${day}`}
               >
                 {day}
               </div>
             );
          })}
        </div>
        
        {habits.map(habit => (
          <HabitRow key={habit.id} habit={habit} />
        ))}
      </div>

      {showAddModal && (
        <div className="modern-modal-backdrop">
          <div className="modern-modal-card">
            <div className="modern-modal-header">
              <div>
                <h2 className="modern-modal-title">Add New Habit</h2>
                <div className="modern-modal-subtitle">Start tracking a new daily habit</div>
              </div>
              <button type="button" className="modern-close-btn" onClick={() => setShowAddModal(false)}>×</button>
            </div>

            <form onSubmit={handleCreateHabit} style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
              <div className="modern-form-group">
                <label className="modern-label">Habit Title</label>
                <input 
                  type="text" 
                  className="modern-input" 
                  placeholder="e.g. Drink 2L Water"
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
                  <option value="Health">Health</option>
                  <option value="Study">Study</option>
                  <option value="Coding">Coding</option>
                  <option value="Reading">Reading</option>
                  <option value="Fitness">Fitness</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>

              <div className="modern-modal-actions" style={{ justifyContent: 'flex-end' }}>
                <div style={{ display: 'flex', gap: 12 }}>
                  <button type="button" className="modern-btn-cancel" onClick={() => setShowAddModal(false)}>Cancel</button>
                  <button type="submit" className="modern-btn-save">Create Habit</button>
                </div>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default HabitTracker;
