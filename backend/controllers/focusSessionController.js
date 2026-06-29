const FocusSession = require('../models/FocusSession');

// @desc    Get all focus sessions
// @route   GET /api/focus-sessions
// @access  Public
const getFocusSessions = async (req, res) => {
  try {
    const count = await FocusSession.countDocuments(req.userQuery);
    if (count === 0 && req.isDemoUser) {
      await FocusSession.insertMany([
        { durationMinutes: 25, subject: 'Operating Systems', completedAt: new Date(Date.now() - 3600000) },
        { durationMinutes: 50, subject: 'Algorithms', completedAt: new Date(Date.now() - 86400000) },
        { durationMinutes: 25, subject: 'Data Structures', completedAt: new Date(Date.now() - 172800000) }
      ]);
    }
    const sessions = await FocusSession.find(req.userQuery).sort({ completedAt: -1 });
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error(`Error fetching focus sessions: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new focus session
// @route   POST /api/focus-sessions
// @access  Public
const createFocusSession = async (req, res) => {
  try {
    const { durationMinutes, subject, taskId } = req.body;

    if (!durationMinutes) {
      return res.status(400).json({ success: false, message: 'Please provide durationMinutes' });
    }

    const session = await FocusSession.create({
      userId: req.userId,
      durationMinutes,
      subject: subject || '',
      taskId: taskId || ''
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error(`Error creating focus session: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getFocusSessions,
  createFocusSession
};
