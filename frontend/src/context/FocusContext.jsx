import React, { createContext, useState, useContext, useEffect, useRef } from "react";
import { createFocusSession } from "../services/api";

const FocusContext = createContext();

export const useFocus = () => useContext(FocusContext);

export const FocusProvider = ({ children }) => {
  const [duration, setDuration] = useState(() => {
    return Number(localStorage.getItem("focus_duration")) || 25;
  });
  
  const [timeLeft, setTimeLeft] = useState(() => {
    const savedEndTime = localStorage.getItem("focus_end_time");
    if (savedEndTime) {
      const remaining = Math.round((Number(savedEndTime) - Date.now()) / 1000);
      if (remaining > 0) return remaining;
    }
    return Number(localStorage.getItem("focus_time_left")) || 25 * 60;
  });

  const [isActive, setIsActive] = useState(() => {
    const active = localStorage.getItem("focus_is_active") === "true";
    const savedEndTime = localStorage.getItem("focus_end_time");
    if (active && savedEndTime) {
      return Number(savedEndTime) > Date.now();
    }
    return active;
  });

  const [showCompletion, setShowCompletion] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    localStorage.setItem("focus_duration", duration);
  }, [duration]);

  useEffect(() => {
    localStorage.setItem("focus_time_left", timeLeft);
  }, [timeLeft]);

  useEffect(() => {
    localStorage.setItem("focus_is_active", isActive);
    if (isActive) {
      if (!localStorage.getItem("focus_end_time")) {
        localStorage.setItem("focus_end_time", Date.now() + timeLeft * 1000);
      }
    } else {
      localStorage.removeItem("focus_end_time");
    }
  }, [isActive]);

  const handleSessionComplete = async () => {
    setIsActive(false);
    localStorage.removeItem("focus_end_time");
    localStorage.setItem("focus_is_active", "false");
    setTimeLeft(0);
    setShowCompletion(true);
    try {
      await createFocusSession({
        durationMinutes: duration,
        subject: "Pomodoro Focus",
        taskId: ""
      });
    } catch (e) {
      console.error("Failed to log focus session:", e);
    }
  };

  useEffect(() => {
    if (isActive) {
      timerRef.current = setInterval(() => {
        const savedEndTime = localStorage.getItem("focus_end_time");
        if (savedEndTime) {
          const remaining = Math.round((Number(savedEndTime) - Date.now()) / 1000);
          if (remaining <= 0) {
            clearInterval(timerRef.current);
            handleSessionComplete();
          } else {
            setTimeLeft(remaining);
          }
        } else {
          setTimeLeft((prev) => {
            if (prev <= 1) {
              clearInterval(timerRef.current);
              handleSessionComplete();
              return 0;
            }
            return prev - 1;
          });
        }
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isActive, duration]);

  const toggleTimer = () => {
    if (!isActive) {
      if (timeLeft <= 0) {
        setTimeLeft(duration * 60);
        localStorage.setItem("focus_end_time", Date.now() + duration * 60 * 1000);
      } else {
        localStorage.setItem("focus_end_time", Date.now() + timeLeft * 1000);
      }
      setIsActive(true);
    } else {
      localStorage.removeItem("focus_end_time");
      setIsActive(false);
    }
  };

  const resetTimer = () => {
    setIsActive(false);
    localStorage.removeItem("focus_end_time");
    localStorage.setItem("focus_is_active", "false");
    setTimeLeft(duration * 60);
  };

  const setPreset = (mins) => {
    setIsActive(false);
    localStorage.removeItem("focus_end_time");
    localStorage.setItem("focus_is_active", "false");
    setDuration(mins);
    setTimeLeft(mins * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <FocusContext.Provider value={{
      duration,
      timeLeft,
      isActive,
      setIsActive,
      showCompletion,
      setShowCompletion,
      toggleTimer,
      resetTimer,
      setPreset,
      formatTime
    }}>
      {children}
    </FocusContext.Provider>
  );
};
