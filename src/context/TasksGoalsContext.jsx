import { createContext, useState, useContext, useEffect } from "react";
import { 
  fetchHabits, createHabit, updateHabitApi, deleteHabitApi,
  fetchTasks, createTask, updateTask as updateTaskApi, deleteTask as deleteTaskApi,
  fetchGoals, createGoal, updateGoalApi, deleteGoalApi
} from "../utils/api";

const TasksGoalsContext = createContext();

export const useTasksGoals = () => useContext(TasksGoalsContext);

export const TasksGoalsProvider = ({ children }) => {
  const [selectedMonth, setSelectedMonth] = useState(() => {
    const now = new Date();
    return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;
  });

  const [rawHabits, setRawHabits] = useState([]);
  const [tasks, setTasks] = useState([]);
  const [goals, setGoals] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const [habitsData, tasksData, goalsData] = await Promise.all([
          fetchHabits(),
          fetchTasks(),
          fetchGoals()
        ]);

        const now = new Date();
        const currentMonthKey = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`;

        const formattedHabits = (habitsData || []).map(h => ({
          ...h,
          id: h._id || h.id,
          history: h.history && Object.keys(h.history).length > 0 ? h.history : { [currentMonthKey]: Array(31).fill(false) }
        }));
        setRawHabits(formattedHabits);

        const formattedTasks = (tasksData || []).map(t => ({
          ...t,
          id: t._id || t.id,
          status: t.isCompleted ? 'Completed' : 'Pending'
        }));
        setTasks(formattedTasks);

        const formattedGoals = (goalsData || []).map(g => ({
          ...g,
          id: g._id || g.id
        }));
        setGoals(formattedGoals);
      } catch (err) {
        console.error("Error loading tasks and goals data:", err);
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

  // --- TASKS METHODS ---
  const addTask = async (taskData) => {
    try {
      const saved = await createTask({ ...taskData, isCompleted: false });
      setTasks(prev => [...prev, { ...saved, id: saved._id || saved.id, status: 'Pending' }]);
    } catch (err) {
      console.error("Error adding task:", err);
    }
  };

  const toggleTask = async (id) => {
    const task = tasks.find(t => t.id === id || t._id === id);
    if (!task) return;
    const newStatus = task.status === 'Completed' ? 'Pending' : 'Completed';
    setTasks(prev => prev.map(t => (t.id === id || t._id === id) ? { ...t, status: newStatus } : t));
    try {
      await updateTaskApi(id, { isCompleted: newStatus === 'Completed' });
    } catch (err) {
      console.error("Error toggling task:", err);
    }
  };

  const removeTask = async (id) => {
    setTasks(prev => prev.filter(t => t.id !== id && t._id !== id));
    try {
      await deleteTaskApi(id);
    } catch (err) {
      console.error("Error removing task:", err);
    }
  };

  // --- GOALS METHODS ---
  const weeklyGoals = goals.filter(g => g.type === 'Weekly');
  const monthlyGoals = goals.filter(g => g.type === 'Monthly');

  const addWeeklyGoal = async (goalData) => {
    try {
      const saved = await createGoal({ ...goalData, type: 'Weekly', completed: false });
      setGoals(prev => [...prev, { ...saved, id: saved._id || saved.id }]);
    } catch (err) {
      console.error("Error adding weekly goal:", err);
    }
  };

  const toggleWeeklyGoal = async (id) => {
    const goal = goals.find(g => g.id === id || g._id === id);
    if (!goal) return;
    const newCompleted = !goal.completed;
    setGoals(prev => prev.map(g => (g.id === id || g._id === id) ? { ...g, completed: newCompleted } : g));
    try {
      await updateGoalApi(id, { completed: newCompleted });
    } catch (err) {
      console.error("Error toggling goal:", err);
    }
  };

  const addMonthlyGoal = async (goalData) => {
    try {
      const saved = await createGoal({ ...goalData, type: 'Monthly', progress: 0 });
      setGoals(prev => [...prev, { ...saved, id: saved._id || saved.id }]);
    } catch (err) {
      console.error("Error adding monthly goal:", err);
    }
  };

  return (
    <TasksGoalsContext.Provider value={{
      habits, toggleHabitDay, addHabit, updateHabit, deleteHabit, reorderHabits,
      selectedMonth, setSelectedMonth, monthName, year, daysInMonth, prevMonth, nextMonth, isCurrentOrFutureMonth,
      tasks, addTask, toggleTask, removeTask,
      weeklyGoals, monthlyGoals, addWeeklyGoal, toggleWeeklyGoal, addMonthlyGoal
    }}>
      {children}
    </TasksGoalsContext.Provider>
  );
};
