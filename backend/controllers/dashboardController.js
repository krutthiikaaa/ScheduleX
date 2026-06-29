const Dashboard = require('../models/Dashboard');

/**
 * @desc    Retrieve Dashboard Data
 * @route   GET /api/dashboard
 * @access  Public (Authentication module to be implemented in later phases)
 */
const getDashboardData = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne();

    if (!dashboard) {
      dashboard = await Dashboard.create({
        userName: "Jane Doe",
        studyStreak: 12,
        pendingAssignments: 3,
        remainingTasks: 5,
        pomodoroMinutesToday: 75,
        upcomingDeadlines: [
          { title: "Project Phase 1", course: "Data Structures", timeLeft: "Tomorrow", priority: "High", status: "Pending" },
          { title: "Lab Report 4", course: "Operating Systems", timeLeft: "3 Days", priority: "Medium", status: "Pending" },
          { title: "Problem Set 2", course: "Algorithms", timeLeft: "5 Days", priority: "High", status: "Pending" }
        ],
        weeklyFocus: { goalHours: 15, completedHours: 10 },
        weeklyGoals: {
          studyHoursCompleted: 10, studyHoursGoal: 15,
          assignmentCompleted: 4, assignmentGoal: 6,
          taskCompleted: 8, taskGoal: 10
        },
        recentResources: [
          { name: "OS Lecture Notes", course: "Operating Systems", type: "PDF", openedAt: "2 hours ago" },
          { name: "Graph Algorithms", course: "Algorithms", type: "Link", openedAt: "Yesterday" }
        ],
        recentActivity: [
          { title: "Completed Pomodoro", description: "25 mins focus on Data Structures", createdAt: "Today" },
          { title: "Submitted Assignment", description: "OS Lab Report 3", createdAt: "Yesterday" }
        ]
      });
    }

    return res.status(200).json({
      success: true,
      data: dashboard
    });
  } catch (error) {
    console.error(`Error retrieving dashboard data: ${error.message}`);
    return res.status(500).json({
      success: false,
      message: 'Server Error: Unable to retrieve dashboard data',
      error: error.message
    });
  }
};

module.exports = {
  getDashboardData
};
