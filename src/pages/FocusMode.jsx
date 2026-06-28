import { useState, useEffect, useRef } from "react";
import AppLayout from "../components/AppLayout";
import { fetchFocusSessions, createFocusSession } from "../utils/api";

function FocusMode() {
  const [duration, setDuration] = useState(25); // Minutes
  const [timeLeft, setTimeLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  
  const timerRef = useRef(null);

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
    setShowCompletion(true);
    await createFocusSession({
      durationMinutes: duration,
      subject: "Pomodoro Focus",
      taskId: ""
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

  const progressRatio = timeLeft / (duration * 60);
  const strokeDashoffset = 1445 * (1 - progressRatio);

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", height: "calc(100vh - 80px)", overflow: "hidden" }}>
        
        {/* Huge Circular Animated Progress Ring (520x520) */}
        <div style={{ position: "relative", width: 520, height: 520, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 40 }}>
          <svg width="520" height="520" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
            {/* Track Circle */}
            <circle cx="260" cy="260" r="230" stroke="var(--border)" strokeWidth="6" fill="transparent" opacity="0.3" />
            {/* Animated Moving Progress Circle */}
            <circle 
              cx="260" 
              cy="260" 
              r="230" 
              stroke="var(--primary)" 
              strokeWidth="10" 
              strokeLinecap="round"
              fill="transparent" 
              strokeDasharray="1445"
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
            />
          </svg>

          {/* Center Timer Overlay */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ fontSize: "8.5rem", fontWeight: 800, color: "var(--text-heading)", letterSpacing: "-3px", textShadow: "0 0 40px rgba(245, 101, 34, 0.4)", fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: 24 }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ display: "flex", gap: 24, alignItems: "center" }}>
              <span onClick={() => setPreset(25)} style={{ cursor: "pointer", fontSize: "1rem", fontWeight: duration === 25 ? 700 : 500, color: duration === 25 ? "var(--primary)" : "var(--text-muted)", letterSpacing: "2px" }}>25M</span>
              <span style={{ color: "var(--border)", opacity: 0.5 }}>|</span>
              <span onClick={() => setPreset(50)} style={{ cursor: "pointer", fontSize: "1rem", fontWeight: duration === 50 ? 700 : 500, color: duration === 50 ? "var(--primary)" : "var(--text-muted)", letterSpacing: "2px" }}>50M</span>
              <span style={{ color: "var(--border)", opacity: 0.5 }}>|</span>
              <span onClick={() => setPreset(90)} style={{ cursor: "pointer", fontSize: "1rem", fontWeight: duration === 90 ? 700 : 500, color: duration === 90 ? "var(--primary)" : "var(--text-muted)", letterSpacing: "2px" }}>90M</span>
            </div>
          </div>
        </div>

        {/* Start & Reset Control Buttons */}
        <div style={{ display: "flex", gap: 48, justifyContent: "center", marginBottom: 32 }}>
          <div onClick={toggleTimer} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid", borderColor: isActive ? "var(--primary)" : "var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", color: isActive ? "var(--primary)" : "var(--text-heading)", background: isActive ? "var(--primary-light)" : "transparent", transition: "all 0.2s ease", boxShadow: isActive ? "0 0 25px rgba(245, 101, 34, 0.25)" : "none" }}>
              {isActive ? "" : "▷"}
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "2px", color: "var(--text-heading)" }}>{isActive ? "PAUSE" : "START"}</span>
          </div>

          <div onClick={resetTimer} style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 10, cursor: "pointer", userSelect: "none" }}>
            <div style={{ width: 72, height: 72, borderRadius: "50%", border: "1px solid var(--border)", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.6rem", color: "var(--text-heading)", transition: "all 0.2s ease" }}>
              ↻
            </div>
            <span style={{ fontSize: "0.8rem", fontWeight: 700, letterSpacing: "2px", color: "var(--text-muted)" }}>RESET</span>
          </div>
        </div>

        {/* Subtle Bottom Watermark */}
        <div style={{ textAlign: "center", fontSize: "0.75rem", fontWeight: 600, letterSpacing: "2px", color: "var(--text-muted)", opacity: 0.5 }}>
           SCHEDULEX FOCUS
        </div>
      </div>

      {showCompletion && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.8)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 100 }}>
          <div className="card animate-scale-in" style={{ width: 400, textAlign: "center", padding: 32 }}>
            <div style={{ fontSize: "4rem", marginBottom: 16 }}></div>
            <h2 style={{ marginBottom: 8 }}>Session Completed!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24 }}>Great job focusing for {duration} minutes. Your session has been saved to your MongoDB study log!</p>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button className="btn btn-primary" onClick={() => { setShowCompletion(false); setPreset(5); setIsActive(true); }}>Take a Break (5m)</button>
              <button className="btn btn-secondary" onClick={() => { setShowCompletion(false); resetTimer(); }}>Close</button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default FocusMode;
