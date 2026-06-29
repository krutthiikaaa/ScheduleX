const bcrypt = require('bcryptjs');
const User = require('../models/User');
const FocusSession = require('../models/FocusSession');
const StudySession = require('../models/StudySession');
const Assignment = require('../models/Assignment');
const Task = require('../models/Task');
const Goal = require('../models/Goal');
const Habit = require('../models/Habit');

exports.getProfile = async (req, res) => {
  try {
    const user = req.user;
    const isDemo = req.isDemoUser;
    
    // Aggregate statistics
    const focusSessions = await FocusSession.find(req.userQuery || {});
    const studySessions = await StudySession.find(req.userQuery || {});
    const assignments = await Assignment.find(req.userQuery || {});

    const totalFocusMinutes = focusSessions.reduce((acc, curr) => acc + (curr.durationMinutes || 0), 0);
    const totalStudyMinutes = studySessions.reduce((acc, curr) => acc + (curr.duration || 0), 0);
    const calculatedHours = Math.round((totalFocusMinutes + totalStudyMinutes) / 60);
    const totalHours = isDemo ? Math.max(calculatedHours, 14) : calculatedHours;

    const actualCompletedAsg = assignments.filter(a => a.status === 'Completed' || a.completed === true).length;
    const completedAssignments = isDemo ? (actualCompletedAsg || 8) : actualCompletedAsg;
    const pomodoroCount = isDemo ? (focusSessions.length || 18) : focusSessions.length;

    res.json({
      success: true,
      data: {
        user: {
          id: user._id,
          fullName: user.fullName,
          email: user.email,
          preferences: user.preferences || { theme: 'light', notifications: true }
        },
        stats: {
          studyStreak: isDemo ? 12 : 0,
          totalStudyHours: totalHours,
          completedAssignments: completedAssignments,
          pomodoroSessions: pomodoroCount,
          weeklyProductivity: isDemo ? 88 : 0
        }
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.updateProfile = async (req, res) => {
  try {
    const { fullName, email, preferences } = req.body;
    const user = req.user;

    if (fullName) user.fullName = fullName;
    if (email && email !== user.email) {
      const existing = await User.findOne({ email });
      if (existing && existing._id.toString() !== user._id.toString()) {
        return res.status(400).json({ success: false, error: 'Email is already in use by another account.' });
      }
      user.email = email;
    }
    if (preferences) {
      user.preferences = {
        theme: preferences.theme || user.preferences?.theme || 'light',
        notifications: preferences.notifications !== undefined ? preferences.notifications : (user.preferences?.notifications !== undefined ? user.preferences.notifications : true)
      };
    }

    await user.save();

    res.json({
      success: true,
      message: 'Profile updated successfully',
      data: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        preferences: user.preferences
      }
    });
  } catch (err) {
    res.status(400).json({ success: false, error: err.message });
  }
};

exports.changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    if (!currentPassword || !newPassword) {
      return res.status(400).json({ success: false, error: 'Please provide both current and new passwords.' });
    }
    if (newPassword.length < 6) {
      return res.status(400).json({ success: false, error: 'New password must be at least 6 characters long.' });
    }

    const user = req.user;
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.status(400).json({ success: false, error: 'Incorrect current password.' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: 'Password changed successfully.' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const user = req.user;
    const defaultPass = 'password123';
    const hashedPassword = await bcrypt.hash(defaultPass, 10);
    user.password = hashedPassword;
    await user.save();

    res.json({ success: true, message: `Password has been reset to: ${defaultPass}` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};

exports.exportUserData = async (req, res) => {
  try {
    const user = req.user;
    const assignments = await Assignment.find();
    const tasks = await Task.find();
    const focusSessions = await FocusSession.find();
    const studySessions = await StudySession.find();
    const goals = await Goal.find();
    const habits = await Habit.find();

    const exportPayload = {
      user: {
        id: user._id,
        fullName: user.fullName,
        email: user.email,
        university: user.university,
        semester: user.semester,
        cgpa: user.cgpa,
        preferences: user.preferences,
        createdAt: user.createdAt
      },
      data: {
        assignments,
        tasks,
        focusSessions,
        studySessions,
        goals,
        habits
      },
      exportedAt: new Date().toISOString()
    };

    res.json({ success: true, data: exportPayload });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
};
