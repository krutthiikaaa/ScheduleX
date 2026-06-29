import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { useTasksGoals } from '../../context/TasksGoalsContext';

const HabitProgressDashboard = () => {
  const { habits, daysInMonth = 30 } = useTasksGoals();

  const data = useMemo(() => {
    if (!habits || habits.length === 0) return [];
    const chartData = [];
    for (let i = 0; i < daysInMonth; i++) {
      const checkedCount = habits.filter(h => h.days && h.days[i]).length;
      const percentage = Math.round((checkedCount / habits.length) * 100);
      chartData.push({
        day: i + 1,
        completion: percentage,
        checked: checkedCount,
        total: habits.length
      });
    }
    return chartData;
  }, [habits, daysInMonth]);

  // Statistics calculations
  const totalChecks = data.reduce((sum, d) => sum + d.checked, 0);
  const totalPossible = habits.length * daysInMonth;
  const overallCompletion = totalPossible ? Math.round((totalChecks / totalPossible) * 100) : 0;
  
  const todayIndex = Math.min(new Date().getDate() - 1, daysInMonth - 1);
  const todayCompletion = data[todayIndex]?.completion || 0;

  // Streak calculations
  let currentStreak = 0;
  let longestStreak = 0;
  let tempStreak = 0;

  data.forEach((d, i) => {
    if (d.completion > 0) { 
      tempStreak++;
      if (tempStreak > longestStreak) longestStreak = tempStreak;
      if (i <= todayIndex) currentStreak = tempStreak;
    } else {
      if (i <= todayIndex) currentStreak = 0;
      tempStreak = 0;
    }
  });

  const missedHabits = totalPossible - totalChecks;
  const bestDay = [...data].sort((a, b) => b.completion - a.completion)[0]?.day || 1;
  const consistencyScore = Math.round((overallCompletion + (currentStreak / daysInMonth * 100)) / 2) || 0;

  // Weekly breakdown
  const weeks = [
    { label: 'Week 1', start: 0, end: 7 },
    { label: 'Week 2', start: 7, end: 14 },
    { label: 'Week 3', start: 14, end: 21 },
    { label: 'Week 4', start: 21, end: daysInMonth }
  ];

  const weeklyData = weeks.map(w => {
    const weekDays = data.slice(w.start, w.end);
    const weekChecks = weekDays.reduce((sum, d) => sum + d.checked, 0);
    const weekPossible = habits.length * (w.end - w.start);
    const weekCompletion = weekPossible ? Math.round((weekChecks / weekPossible) * 100) : 0;
    return { ...w, checks: weekChecks, completion: weekCompletion };
  });

  const mostConsistentWeek = [...weeklyData].sort((a, b) => b.completion - a.completion)[0]?.label || 'Week 1';

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div style={{ background: "var(--card-bg)", padding: '12px', borderRadius: '8px', boxShadow: '0 4px 12px rgba(0,0,0,0.1)', border: '1px solid var(--border-light)' }}>
          <p style={{ margin: '0 0 8px 0', fontWeight: 'bold' }}>Day {label}</p>
          <p style={{ margin: '0', color: '#D65A31', fontWeight: 600 }}>Completion: {payload[0].value}%</p>
          <p style={{ margin: '4px 0 0 0', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            {payload[0].payload.checked} of {payload[0].payload.total} habits
          </p>
        </div>
      );
    }
    return null;
  };

  if (!habits || habits.length === 0) {
    return null;
  }

  return (
    <div className="card" style={{ padding: 32, marginBottom: 24, animation: 'fadeIn 0.5s ease', boxShadow: '0 8px 24px rgba(0,0,0,0.04)' }}>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 32 }}>
        
        {/* Top Section: Chart & Key Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 32, alignItems: 'stretch' }}>
          
          {/* Left Side: Area Chart */}
          <div style={{ flex: '1 1 500px', minHeight: 320, display: 'flex', flexDirection: 'column' }}>
            <h3 style={{ marginBottom: 24, fontSize: '1.25rem', color: 'var(--text-main)', fontWeight: 600 }}>Monthly Progress Dashboard</h3>
            <div style={{ flex: 1, width: '100%' }}>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                  <defs>
                    <linearGradient id="colorCompletion" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#D65A31" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#D65A31" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="var(--border-light)" />
                  <XAxis 
                    dataKey="day" 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }} 
                    dy={10}
                  />
                  <YAxis 
                    axisLine={false} 
                    tickLine={false} 
                    tick={{ fill: 'var(--text-muted)', fontSize: 12 }}
                    domain={[0, 100]}
                    tickFormatter={value => `${value}%`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <Area 
                    type="monotone" 
                    dataKey="completion" 
                    stroke="#D65A31" 
                    strokeWidth={3}
                    fillOpacity={1} 
                    fill="url(#colorCompletion)" 
                    activeDot={{ r: 6, fill: '#D65A31', stroke: '#fff', strokeWidth: 2 }}
                    animationDuration={1500}
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Right Side: Key Statistics */}
          <div style={{ flex: '0 0 320px', display: 'flex', flexDirection: 'column', gap: 20 }}>
            <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '24px 20px', borderRadius: 16, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.95rem', color: 'var(--text-muted)', marginBottom: 8, fontWeight: 500 }}>Current Streak 🔥</div>
              <div style={{ fontSize: '2.5rem', fontWeight: 'bold', color: '#D65A31', lineHeight: 1 }}>{currentStreak} <span style={{ fontSize: '1rem', color: 'var(--text-muted)', fontWeight: 'normal' }}>days</span></div>
            </div>
            
            <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 16, border: '1px solid var(--border-light)' }}>
              <div style={{ fontSize: '0.9rem', color: 'var(--text-muted)', marginBottom: 4, fontWeight: 500 }}>Longest Streak</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{longestStreak} days</div>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
              <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 16, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Overall %</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{overallCompletion}%</div>
              </div>
              <div className="stat-card" style={{ background: 'var(--bg-secondary)', padding: '16px', borderRadius: 16, border: '1px solid var(--border-light)' }}>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Today %</div>
                <div style={{ fontSize: '1.25rem', fontWeight: 'bold', color: 'var(--text-main)' }}>{todayCompletion}%</div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom: Monthly Summary */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(120px, 1fr))', gap: 16, paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
          <div className="summary-stat" style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Completed Habits</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>{totalChecks}</div>
          </div>
          <div className="summary-stat" style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Missed Habits</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>{missedHabits}</div>
          </div>
          <div className="summary-stat" style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Best Day</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>Day {bestDay}</div>
          </div>
          <div className="summary-stat" style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Most Consistent</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: 'var(--text-main)' }}>{mostConsistentWeek}</div>
          </div>
          <div className="summary-stat" style={{ padding: '8px 0' }}>
            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', marginBottom: 4 }}>Consistency Score</div>
            <div style={{ fontSize: '1.15rem', fontWeight: 600, color: '#D65A31' }}>{consistencyScore}</div>
          </div>
        </div>

        {/* Weekly Breakdown */}
        <div style={{ paddingTop: 24, borderTop: '1px solid var(--border-light)' }}>
          <h4 style={{ marginBottom: 20, fontSize: '1.1rem', color: 'var(--text-main)', fontWeight: 600 }}>Weekly Breakdown</h4>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 20 }}>
            {weeklyData.map((week, idx) => (
              <div key={idx} style={{ background: 'var(--bg-secondary)', padding: '20px', borderRadius: 16, display: 'flex', flexDirection: 'column', gap: 12, border: '1px solid var(--border-light)' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontWeight: 600, fontSize: '0.95rem', color: 'var(--text-main)' }}>{week.label}</span>
                  <span style={{ fontSize: '0.95rem', color: '#D65A31', fontWeight: 600 }}>{week.completion}%</span>
                </div>
                <div style={{ height: 8, background: 'var(--border-light)', borderRadius: 4, overflow: 'hidden' }}>
                  <div style={{ height: '100%', width: `${week.completion}%`, background: '#D65A31', borderRadius: 4, transition: 'width 1s ease-in-out' }}></div>
                </div>
                <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                  {week.checks} habits completed
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
};

export default HabitProgressDashboard;
