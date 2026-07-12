import React, { useState, useEffect } from "react";
import AppLayout from "../layouts/AppLayout";
import { useFocus } from "../context/FocusContext";

function FocusMode() {
  const {
    duration,
    timeLeft,
    isActive,
    showCompletion,
    setShowCompletion,
    toggleTimer,
    resetTimer,
    setPreset,
    formatTime
  } = useFocus();

  const [activeMode, setActiveMode] = useState("focus"); // "focus", "short", "long"
  const [doneCount, setDoneCount] = useState(() => {
    return Number(localStorage.getItem("focus_sessions_done")) || 0;
  });

  useEffect(() => {
    localStorage.setItem("focus_sessions_done", doneCount);
  }, [doneCount]);

  // Increment completed sessions count when context completes a session
  useEffect(() => {
    if (showCompletion && activeMode.startsWith("focus")) {
      setDoneCount(prev => prev + 1);
    }
  }, [showCompletion]);

  // Mode Selection Handlers
  const handleModeChange = (mode) => {
    setActiveMode(mode);
    if (mode === "focus") {
      setPreset(25);
    } else if (mode === "focus60") {
      setPreset(60);
    } else if (mode === "focus90") {
      setPreset(90);
    } else if (mode === "short") {
      setPreset(5);
    } else if (mode === "long") {
      setPreset(15);
    }
  };

  const progressRatio = duration > 0 ? timeLeft / (duration * 60) : 0;
  const strokeDashoffset = 1351 * (1 - progressRatio); // SVG circumference for r=215 is ~1350.8

  // Style helper for tabs
  const tabStyle = (mode) => {
    const isSelected = mode === "focus" ? activeMode.startsWith("focus") : activeMode === mode;
    return {
      padding: "12px 30px",
      borderRadius: "14px",
      fontSize: "0.96rem",
      fontWeight: 700,
      cursor: "pointer",
      border: "none",
      background: isSelected ? "var(--primary)" : "transparent",
      color: isSelected ? "#FFF" : "var(--text-muted)",
      boxShadow: isSelected ? "0 8px 24px rgba(214, 90, 49, 0.2)" : "none",
      transition: "all 0.2s cubic-bezier(0.16, 1, 0.3, 1)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center"
    };
  };

  return (
    <AppLayout>
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "flex-start", minHeight: "calc(100vh - 100px)", padding: "32px 0", boxSizing: "border-box" }}>
        
        {/* Tab Selection Row (Directly on background, no surrounding wrapper) */}
        <div style={{ display: "flex", gap: 24, marginBottom: 28, justifyContent: "center" }}>
          
          {/* Focus Tab */}
          <button onClick={() => handleModeChange("focus")} style={tabStyle("focus")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"></path>
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"></path>
            </svg>
            Focus
          </button>

          {/* Short Break Tab */}
          <button onClick={() => handleModeChange("short")} style={tabStyle("short")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="2" x2="6" y2="4"></line>
              <line x1="10" y1="2" x2="10" y2="4"></line>
              <line x1="14" y1="2" x2="14" y2="4"></line>
            </svg>
            Short Break
          </button>

          {/* Long Break Tab */}
          <button onClick={() => handleModeChange("long")} style={tabStyle("long")}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ marginRight: 8 }}>
              <path d="M18 8h1a4 4 0 0 1 0 8h-1"></path>
              <path d="M2 8h16v9a4 4 0 0 1-4 4H6a4 4 0 0 1-4-4V8z"></path>
              <line x1="6" y1="2" x2="6" y2="4"></line>
              <line x1="10" y1="2" x2="10" y2="4"></line>
              <line x1="14" y1="2" x2="14" y2="4"></line>
            </svg>
            Long Break
          </button>
        </div>

        {/* Circular Progress Ring (Balanced size to 450px) */}
        <div style={{ position: "relative", width: 450, height: 450, display: "flex", alignItems: "center", justifyContent: "center", marginBottom: 32 }}>
          <svg width="450" height="450" style={{ transform: "rotate(-90deg)", position: "absolute", top: 0, left: 0 }}>
            {/* Track Circle */}
            <circle cx="225" cy="225" r="215" stroke="var(--border)" strokeWidth="6" fill="transparent" opacity="0.3" />
            {/* Animated Moving Progress Circle */}
            <circle 
              cx="225" 
              cy="225" 
              r="215" 
              stroke="var(--primary)" 
              strokeWidth="9" 
              strokeLinecap="round"
              fill="transparent" 
              strokeDasharray="1351"
              strokeDashoffset={strokeDashoffset}
              style={{ transition: "stroke-dashoffset 1s linear, stroke 0.3s ease" }}
            />
          </svg>

          {/* Center Timer Overlay */}
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", zIndex: 2 }}>
            <div style={{ fontSize: "6.2rem", fontWeight: 800, color: "var(--primary)", letterSpacing: "-2px", fontVariantNumeric: "tabular-nums", lineHeight: 1, marginBottom: 10 }}>
              {formatTime(timeLeft)}
            </div>
            <div style={{ fontSize: "0.82rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.18em", textTransform: "uppercase", marginBottom: 16 }}>
              {activeMode === "focus" ? "25m Focus" : activeMode === "focus60" ? "60m Focus" : activeMode === "focus90" ? "90m Focus" : activeMode === "short" ? "Short Break" : "Long Break"}
            </div>

            {/* Quick Timer Presets Inside Focus Circle */}
            <div style={{ display: "flex", gap: 8, alignItems: "center", justifyContent: "center" }}>
              {[
                { label: "25m", mode: "focus", mins: 25 },
                { label: "60m", mode: "focus60", mins: 60 },
                { label: "90m", mode: "focus90", mins: 90 }
              ].map(p => {
                const isSelected = activeMode === p.mode || (activeMode.startsWith("focus") && duration === p.mins);
                return (
                  <button
                    key={p.label}
                    type="button"
                    onClick={() => handleModeChange(p.mode)}
                    style={{
                      padding: "5px 14px",
                      borderRadius: "16px",
                      fontSize: "0.78rem",
                      fontWeight: 700,
                      border: isSelected ? "1.5px solid var(--primary)" : "1px solid var(--border)",
                      background: isSelected ? "var(--primary)" : "var(--bg-secondary)",
                      color: isSelected ? "#fff" : "var(--text-muted)",
                      cursor: "pointer",
                      transition: "all 0.2s ease"
                    }}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Control Buttons Row */}
        <div style={{ display: "flex", gap: 32, alignItems: "center", justifyContent: "center" }}>
          
          {/* Reset Button */}
          <button 
            onClick={resetTimer} 
            title="Reset Timer"
            style={{ 
              width: 62, 
              height: 62, 
              borderRadius: "50%", 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border)", 
              fontSize: "1.3rem", 
              color: "var(--text-heading)",
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "rotate(-45deg)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "rotate(0)"}
          >
            ↻
          </button>

          {/* Play/Pause Button */}
          <button 
            onClick={toggleTimer} 
            style={{ 
              width: 86, 
              height: 86, 
              borderRadius: "50%", 
              background: "var(--primary)", 
              color: "#FFF", 
              border: "none", 
              fontSize: "2rem", 
              cursor: "pointer", 
              display: "flex", 
              alignItems: "center", 
              justifyContent: "center", 
              boxShadow: "0 8px 24px rgba(214, 90, 49, 0.35)",
              transition: "transform 0.2s"
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
            onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
          >
            {isActive ? "||" : "▷"}
          </button>

          {/* Done Sessions Count Button */}
          <button 
            onClick={() => {
              if (window.confirm("Do you want to reset completed sessions?")) {
                setDoneCount(0);
              }
            }}
            title="Sessions completed today. Click to reset."
            style={{ 
              width: 62, 
              height: 62, 
              borderRadius: "50%", 
              background: "var(--bg-secondary)", 
              border: "1px solid var(--border)", 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              cursor: "pointer",
              lineHeight: 1.1
            }}
          >
            <span style={{ fontSize: "1.2rem", fontWeight: 800, color: "var(--text-heading)" }}>
              {doneCount}
            </span>
            <span style={{ fontSize: "0.58rem", fontWeight: 800, color: "var(--text-muted)", letterSpacing: "0.5px" }}>
              DONE
            </span>
          </button>

        </div>

      </div>

      {/* Completion Modal */}
      {showCompletion && (
        <div style={{ position: "fixed", top: 0, left: 0, right: 0, bottom: 0, background: "rgba(0,0,0,0.7)", display: "flex", alignItems: "center", justifyContent: "center", zIndex: 1000 }}>
          <div className="card animate-scale-in" style={{ width: 400, textAlign: "center", padding: 32, borderRadius: "24px" }}>
            <h2 style={{ marginBottom: 8, fontWeight: 800 }}>Session Completed!</h2>
            <p style={{ color: "var(--text-muted)", marginBottom: 24, fontSize: "0.9rem", fontWeight: 500 }}>
              Great job focusing. Your study session has been logged!
            </p>
            
            <div style={{ display: "flex", gap: 12, justifyContent: "center" }}>
              <button 
                className="btn btn-primary" 
                onClick={() => { 
                  setShowCompletion(false); 
                  handleModeChange("short");
                  toggleTimer(); 
                }}
                style={{ borderRadius: "12px", fontWeight: 700 }}
              >
                Take a Break (5m)
              </button>
              <button 
                className="btn btn-secondary" 
                onClick={() => { 
                  setShowCompletion(false); 
                  resetTimer(); 
                }}
                style={{ borderRadius: "12px", fontWeight: 700 }}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </AppLayout>
  );
}

export default FocusMode;
