const StudySession = require('../models/StudySession');

// @desc    Get all study sessions
// @route   GET /api/study-sessions
// @access  Public
const getStudySessions = async (req, res) => {
  try {
    const count = await StudySession.countDocuments(req.userQuery);
    if (count === 0 && req.isDemoUser) {
      await StudySession.insertMany([
        { title: 'OS Midterm Prep', duration: 45, category: 'Exam' },
        { title: 'LeetCode Graph Practice', duration: 60, category: 'Coding' },
        { title: 'Read Research Paper', duration: 30, category: 'Reading' }
      ]);
    }
    const sessions = await StudySession.find(req.userQuery).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error(`Error fetching study sessions: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create study session
// @route   POST /api/study-sessions
// @access  Public
const createStudySession = async (req, res) => {
  try {
    const { title, duration, category } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide session title' });
    }

    const session = await StudySession.create({
      userId: req.userId,
      title,
      duration: duration || 25,
      category: category || 'General'
    });

    res.status(201).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error(`Error creating study session: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update study session
// @route   PUT /api/study-sessions/:id
// @access  Public
const updateStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndUpdate({ _id: req.params.id, ...req.userQuery }, req.body, {
      new: true,
      runValidators: true
    });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      data: session
    });
  } catch (error) {
    console.error(`Error updating study session: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete study session
// @route   DELETE /api/study-sessions/:id
// @access  Public
const deleteStudySession = async (req, res) => {
  try {
    const session = await StudySession.findOneAndDelete({ _id: req.params.id, ...req.userQuery });

    if (!session) {
      return res.status(404).json({ success: false, message: 'Session not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Session removed'
    });
  } catch (error) {
    console.error(`Error deleting study session: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getStudySessions,
  createStudySession,
  updateStudySession,
  deleteStudySession
};
