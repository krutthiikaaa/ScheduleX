import { createContext, useState, useContext, useEffect } from "react";

const TasksGoalsContext = createContext();

export const useTasksGoals = () => useContext(TasksGoalsContext);

const initialHabits = [
  { id: "1", title: "Wake Up Early", category: "Health", color: "#D65A31", icon: "", days: Array(31).fill(false).fill(true, 0, 5).fill(false, 5, 6).fill(true, 6, 12), notes: "Felt great this week." },
  { id: "2", title: "Read 20 Pages", category: "Reading", color: "#BFAF9E", icon: "", days: Array(31).fill(false).fill(true, 0, 3).fill(false, 3, 5).fill(true, 5, 10), notes: "" },
  { id: "3", title: "DSA Practice", category: "Coding", color: "#70798A", icon: "", days: Array(31).fill(false).map((_, i) => i % 2 === 0), notes: "Completed Binary Search problems." },
  { id: "4", title: "Exercise", category: "Fitness", color: "#D65A31", icon: "", days: Array(31).fill(false).fill(true, 0, 10), notes: "Running 5k" },
  { id: "5", title: "Drink Water", category: "Health", color: "#BFAF9E", icon: "", days: Array(31).fill(true), notes: "" },
  { id: "6", title: "Journal", category: "Personal", color: "#70798A", icon: "", days: Array(31).fill(false).fill(true, 0, 4), notes: "" },
  { id: "7", title: "Revise Notes", category: "Study", color: "#D65A31", icon: "", days: Array(31).fill(false).fill(true, 0, 6), notes: "" },
  { id: "8", title: "Sleep Before 11 PM", category: "Health", color: "#BFAF9E", icon: "", days: Array(31).fill(false).fill(true, 0, 8), notes: "" }
];

export const TasksGoalsProvider = ({ children }) => {
  const [habits, setHabits] = useState(initialHabits);

  useEffect(() => {
    const validColors = ["#D65A31", "#BFAF9E", "#70798A"];
    const needsUpdate = habits.some(h => !validColors.includes(h.color));
    
    if (needsUpdate) {
      setHabits(prev => prev.map((h, i) => ({
        ...h,
        color: validColors[i % validColors.length]
      })));
    }
  }, [habits]);

  const toggleHabitDay = (habitId, dayIndex) => {
    setHabits(habits.map(h => {
      if (h.id === habitId) {
        const newDays = [...h.days];
        newDays[dayIndex] = !newDays[dayIndex];
        return { ...h, days: newDays };
      }
      return h;
    }));
  };

  const addHabit = (habit) => {
    const sequence = ["#D65A31", "#BFAF9E", "#70798A"];
    const nextColor = sequence[habits.length % sequence.length];
    const newHabit = { 
      ...habit, 
      id: Date.now().toString(), 
      days: Array(31).fill(false), 
      notes: "",
      color: habit.color || nextColor
    };
    setHabits([...habits, newHabit]);
  };
  
  const updateHabit = (id, data) => setHabits(habits.map(h => h.id === id ? { ...h, ...data } : h));
  
  const deleteHabit = (id) => setHabits(habits.filter(h => h.id !== id));

  const reorderHabits = (newHabitsList) => setHabits(newHabitsList);

  return (
    <TasksGoalsContext.Provider value={{
      habits, toggleHabitDay, addHabit, updateHabit, deleteHabit, reorderHabits
    }}>
      {children}
    </TasksGoalsContext.Provider>
  );
};
