const Dashboard = require('../models/Dashboard');
const Assignment = require('../models/Assignment');
const Task = require('../models/Task');
const FocusSession = require('../models/FocusSession');

/**
 * @desc    Retrieve Dashboard Data
 * @route   GET /api/dashboard
 * @access  Public
 */
const getDashboardData = async (req, res) => {
  try {
    let dashboard = await Dashboard.findOne(req.userQuery);

    if (!dashboard) {
      if (req.isDemoUser) {
        dashboard = await Dashboard.create({
          userId: req.userId,
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
      } else {
        dashboard = await Dashboard.create({
          userId: req.userId,
          userName: req.user ? (req.user.fullName || req.user.name || "Student") : "Student",
          studyStreak: 0,
          pendingAssignments: 0,
          remainingTasks: 0,
          pomodoroMinutesToday: 0,
          upcomingDeadlines: [],
          weeklyFocus: { goalHours: 0, completedHours: 0 },
          weeklyGoals: {
            studyHoursCompleted: 0, studyHoursGoal: 0,
            assignmentCompleted: 0, assignmentGoal: 0,
            taskCompleted: 0, taskGoal: 0
          },
          recentResources: [],
          recentActivity: []
        });
      }
    }

    const dashData = dashboard.toObject ? dashboard.toObject() : { ...dashboard._doc };
    if (req.user && (req.user.fullName || req.user.name)) {
      dashData.userName = req.user.fullName || req.user.name;
    }

    // Dynamically calculate real stats for non-demo users
    if (!req.isDemoUser) {
      try {
        const StudySession = require('../models/StudySession');
        const pendingAsg = await Assignment.countDocuments({ ...req.userQuery, status: { $ne: 'Completed' } });
        const completedAsg = await Assignment.countDocuments({ ...req.userQuery, status: 'Completed' });
        const pendingTsk = await Task.countDocuments({ ...req.userQuery, isCompleted: false });
        const completedTsk = await Task.countDocuments({ ...req.userQuery, isCompleted: true });
        const focusList = await FocusSession.find(req.userQuery);
        const studyList = await StudySession.find(req.userQuery);

        const totalPomodoro = focusList.reduce((sum, s) => sum + (s.durationMinutes || 0), 0);
        const totalStudyMins = studyList.reduce((sum, s) => sum + (s.duration || 0), 0);
        const totalStudyHours = Math.round((totalPomodoro + totalStudyMins) / 60 * 10) / 10;

        dashData.pendingAssignments = pendingAsg;
        dashData.remainingTasks = pendingTsk;
        dashData.pomodoroMinutesToday = totalPomodoro;

        dashData.weeklyFocus = {
          goalHours: 0,
          completedHours: totalStudyHours
        };
        dashData.weeklyGoals = {
          studyHoursCompleted: totalStudyHours,
          studyHoursGoal: 0,
          assignmentCompleted: completedAsg,
          assignmentGoal: 0,
          taskCompleted: completedTsk,
          taskGoal: 0
        };

        const pendingAssignmentsList = await Assignment.find({ ...req.userQuery, status: { $ne: 'Completed' } }).limit(3);
        if (pendingAssignmentsList.length > 0) {
          dashData.upcomingDeadlines = pendingAssignmentsList.map(a => ({
            title: a.title,
            course: a.subject,
            timeLeft: a.dueDate || "Upcoming",
            priority: a.priority,
            status: a.status
          }));
        } else {
          dashData.upcomingDeadlines = [];
        }
      } catch (calcErr) {
        console.error("Non-demo dynamic calculation fallback:", calcErr.message);
      }
    }

    return res.status(200).json({
      success: true,
      data: dashData
    });
  } catch (error) {
    console.error(`Error retrieving dashboard data, returning safe fallback: ${error.message}`);
    return res.status(200).json({
      success: true,
      data: {
        userName: req.user ? (req.user.fullName || req.user.name || "Student") : "Student",
        studyStreak: 0,
        pendingAssignments: 0,
        remainingTasks: 0,
        pomodoroMinutesToday: 0,
        upcomingDeadlines: [],
        weeklyFocus: { goalHours: 0, completedHours: 0 },
        weeklyGoals: {
          studyHoursCompleted: 0, studyHoursGoal: 0,
          assignmentCompleted: 0, assignmentGoal: 0,
          taskCompleted: 0, taskGoal: 0
        },
        recentResources: [],
        recentActivity: []
      }
    });
  }
};

module.exports = {
  getDashboardData
};
