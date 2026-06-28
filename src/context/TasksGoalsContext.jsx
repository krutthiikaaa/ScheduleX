import { createContext, useState, useContext, useEffect } from "react";
import { 
  fetchHabits, createHabit, updateHabitApi, deleteHabitApi
} from "../utils/api";

const TasksGoalsContext = createContext();

export const useTasksGoals = () => useContext(TasksGoalsContext);

export const TasksGoalsProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [rawHabits, setRawHabits] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const habitsData = await fetchHabits();

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const formattedHabits = (habitsData || []).map(h => ({
          ...h,
          id: h._id || h.id,
          history: h.history && Object.keys(h.history).length > 0 ? h.history : { [currentMonthKey]: Array(31).fill(false) }
        }));
        setRawHabits(formattedHabits);
      } catch (err) {
        console.error("Error loading habits data:", err);
      }
    };
    loadData();
  }, []);

  const [yearStr, monthStr] = selectedMonth.split('-');
  const year = parseInt(yearStr, 10);
  const monthIndex = parseInt(monthStr, 10) - 1;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const monthName = new Date(year, monthIndex, 1).toLocaleString('default', { month: 'long' });

  const now = new Date();
  const actualCurrentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  const isCurrentOrFutureMonth = selectedMonth >= actualCurrentMonthKey;

  const prevMonth = () => {
    const d = new Date(year, monthIndex - 1, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const nextMonth = () => {
    if (isCurrentOrFutureMonth) return;
    const d = new Date(year, monthIndex + 1, 1);
    setSelectedMonth(`${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}`);
  };

  const habits = rawHabits.map(h => {
    const monthDays = h.history?.[selectedMonth] || h.days || Array(31).fill(false);
    return {
      ...h,
      days: monthDays
    };
  });

  const toggleHabitDay = async (habitId, dayIndex) => {
    let updatedHistory = null;
    const updatedRaw = rawHabits.map(h => {
      if (h.id === habitId || h._id === habitId) {
        const currentDays = h.history?.[selectedMonth] ? [...h.history[selectedMonth]] : Array(31).fill(false);
        currentDays[dayIndex] = !currentDays[dayIndex];
        updatedHistory = {
          ...(h.history || {}),
          [selectedMonth]: currentDays
        };
        return {
          ...h,
          days: currentDays,
          history: updatedHistory
        };
      }
      return h;
    });
    setRawHabits(updatedRaw);

    if (updatedHistory) {
      try {
        await updateHabitApi(habitId, { history: updatedHistory });
      } catch (err) {
        console.error("Error updating habit history:", err);
      }
    }
  };

  const addHabit = async (habitData) => {
    const emptyDays = Array(31).fill(false);
    const newHabitObj = {
      ...habitData,
      history: { [selectedMonth]: emptyDays },
      notes: habitData.notes || ""
    };
    try {
      const saved = await createHabit(newHabitObj);
      const formatted = { ...saved, id: saved._id || saved.id || Date.now().toString() };
      setRawHabits(prev => [...prev, formatted]);
    } catch (err) {
      console.error("Error creating habit:", err);
    }
  };

  const updateHabit = async (id, data) => {
    setRawHabits(prev => prev.map(h => (h.id === id || h._id === id) ? { ...h, ...data } : h));
    try {
      await updateHabitApi(id, data);
    } catch (err) {
      console.error("Error updating habit:", err);
    }
  };

  const deleteHabit = async (id) => {
    setRawHabits(prev => prev.filter(h => h.id !== id && h._id !== id));
    try {
      await deleteHabitApi(id);
    } catch (err) {
      console.error("Error deleting habit:", err);
    }
  };

  const reorderHabits = (newHabitsList) => setRawHabits(newHabitsList);

  return (
    <TasksGoalsContext.Provider value={{
      habits, toggleHabitDay, addHabit, updateHabit, deleteHabit, reorderHabits,
      selectedMonth, setSelectedMonth, monthName, year, daysInMonth, prevMonth, nextMonth, isCurrentOrFutureMonth
    }}>
      {children}
    </TasksGoalsContext.Provider>
  );
};
