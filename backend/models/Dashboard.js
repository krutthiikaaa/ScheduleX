const mongoose = require('mongoose');

// Subschema for Upcoming Deadlines items
const deadlineSchema = new mongoose.Schema({
  title: { type: String, required: true },
  course: { type: String, required: true },
  timeLeft: { type: String, required: true },
  priority: { type: String, required: true },
  status: { type: String, required: true }
}, { _id: false });

// Subschema for Recent Resources items
const resourceSchema = new mongoose.Schema({
  name: { type: String, required: true },
  course: { type: String, required: true },
  type: { type: String, required: true },
  openedAt: { type: String, required: true }
}, { _id: false });

// Subschema for Recent Activity items
const activitySchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  createdAt: { type: String, required: true }
}, { _id: false });

// Main Dashboard Schema definition
const dashboardSchema = new mongoose.Schema({
  // User greeting info
  userName: { type: String, required: true },

  // Dashboard Statistics overview
  studyStreak: { type: Number, default: 0 },
  pendingAssignments: { type: Number, default: 0 },
  remainingTasks: { type: Number, default: 0 },
  pomodoroMinutesToday: { type: Number, default: 0 },

  // Upcoming Deadlines list
  upcomingDeadlines: [deadlineSchema],

  // Weekly Focus time metrics
  weeklyFocus: {
    goalHours: { type: Number, default: 0 },
    completedHours: { type: Number, default: 0 }
  },

  // Weekly Goals tracking
  weeklyGoals: {
    studyHoursCompleted: { type: Number, default: 0 },
    studyHoursGoal: { type: Number, default: 0 },
    assignmentCompleted: { type: Number, default: 0 },
    assignmentGoal: { type: Number, default: 0 },
    taskCompleted: { type: Number, default: 0 },
    taskGoal: { type: Number, default: 0 }
  },

  // Recent Resources list
  recentResources: [resourceSchema],

  // Recent Activity history
  recentActivity: [activitySchema]
}, {
  timestamps: true // Automatically manages createdAt and updatedAt timestamps
});

module.exports = mongoose.models.Dashboard || mongoose.model('Dashboard', dashboardSchema);
