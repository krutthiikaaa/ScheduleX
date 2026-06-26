import { useState, useEffect, useRef } from "react";
import AppLayout from "../components/AppLayout";
import { fetchTasks, createFocusSession } from "../utils/api";

function FocusMode() {
  const [tasks, setTasks] = useState([]);
  
  const [subject, setSubject] = useState("");
  const [selectedTask, setSelectedTask] = useState("");
  const [duration, setDuration] = useState(25); // Minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [sessionCount, setSessionCount] = useState(0);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const timerRef = useRef(null);

  useEffect(() => {
    fetchTasks().then(setTasks);
  }, []);

  useEffect(() => {
    if (isActive && timeLeft > 0) {
      timerRef.current = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (isActive && timeLeft === 0) {
      clearInterval(timerRef.current);
      handleSessionComplete();
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, timeLeft]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    setSessionCount(prev => prev + 1);
    setShowCompletion(true);
    await createFocusSession({
      durationMinutes: duration,
      subject: subject || undefined,
      taskId: selectedTask || undefined
    });
  };

  const toggleTimer = () => setIsActive(!isActive);
  const resetTimer = () => {
    setIsActive(false);
    setTimeLeft(duration * 60);
  };
  
  const setPreset = (mins) => {
    setDuration(mins);
    setTimeLeft(mins * 60);
    setIsActive(false);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: "2rem", marginBottom: 4 }}>Focus Mode</h1>
          <p style={{ color: "var(--text-muted)" }}>Distraction-free Pomodoro timer.</p>
        </div>
      </div>

      <div style={{ display: "flex", gap: 32, alignItems: "flex-start" }}>
        <div className="card" style={{ flex: 2, display: "flex", flexDirection: "column", alignItems: "center", padding: "64px 32px", textAlign: "center" }}>
          <div style={{ display: "flex", gap: 12, marginBottom: 32 }}>
            <button className={`btn ${duration === 25 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPreset(25)}>25/5</button>
            <button className={`btn ${duration === 50 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPreset(50)}>50/10</button>
            <button className={`btn ${duration === 90 ? 'btn-primary' : 'btn-secondary'}`} onClick={() => setPreset(90)}>90 Min</button>
          </div>

          <div style={{ fontSize: "6rem", fontWeight: "900", color: "var(--primary)", lineHeight: 1, marginBottom: 32, fontVariantNumeric: "tabular-nums" }}>
            {formatTime(timeLeft)}
          </div>

          <div style={{ display: "flex", gap: 16 }}>
            <button className="btn btn-primary" style={{ padding: "12px 32px", fontSize: "1.2rem" }} onClick={toggleTimer}>
              {isActive ? "Pause" : "Start"}
            </button>
            <button className="btn btn-secondary" style={{ padding: "12px 32px", fontSize: "1.2rem" }} onClick={resetTimer}>
              Reset
            </button>
          </div>
        </div>

        <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 24 }}>
          <div className="card">
            <h3 style={{ marginBottom: 16 }}>Session Details</h3>
            <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>Subject</label>
                <input className="form-input" placeholder="Optional Subject" value={subject} onChange={e => setSubject(e.target.value)} />
              </div>
              <div>
                <label style={{ display: "block", marginBottom: 8, fontSize: "0.85rem", color: "var(--text-muted)" }}>Link to Task</label>
                <select className="form-input form-select" value={selectedTask} onChange={e => setSelectedTask(e.target.value)}>
                  <option value="">None</option>
                  {tasks.filter(t => !t.isCompleted).map(t => <option key={t._id} value={t._id}>{t.title}</option>)}
                </select>
              </div>
            </div>
          </div>

          <div className="card bg-info">
            <h3 style={{ marginBottom: 8 }}>Today's Progress</h3>
            <p style={{ fontSize: "2rem", fontWeight: "bold" }}>{sessionCount} <span style={{ fontSize: "1rem", fontWeight: "normal", color: "var(--text-muted)" }}>Sessions</span></p>
            <p style={{ fontSize: "0.85rem" }}>Total focus time: {sessionCount * duration} minutes.</p>
          </div>
        </div>
      </div>

      {showCompletion && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: 400, textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}>🎉</div>
            <h2 style={{ marginBottom: 8 }}>Session Completed!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Great job focusing for {duration} minutes.</p>
            
            <div style={{ display: "flex", flexDirection: "column", gap: 12 }}>
              <button className="btn btn-primary" onClick={() => { setShowCompletion(false); setPreset(5); setIsActive(true); }}>Take a Break (5m)</button>
              {selectedTask && <button className="btn btn-secondary">Mark Task Complete</button>}
              <button className="btn btn-secondary" onClick={() => { setShowCompletion(false); resetTimer(); }} style={{ background: "transparent" }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default FocusMode;
