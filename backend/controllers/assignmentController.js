const Assignment = require('../models/Assignment');

// @desc    Get all assignments
// @route   GET /api/assignments
// @access  Public
const getAssignments = async (req, res) => {
  try {
    const count = await Assignment.countDocuments(req.userQuery);
    if (count === 0 && req.isDemoUser) {
      await Assignment.insertMany([
        { title: 'Project Phase 1', subject: 'Data Structures', dueDate: 'Tomorrow', priority: 'High', status: 'Pending', description: 'Complete the graph implementation' },
        { title: 'Lab Report 4', subject: 'Operating Systems', dueDate: 'In 3 Days', priority: 'Medium', status: 'In Progress', description: 'Memory management simulation' },
        { title: 'Problem Set 2', subject: 'Algorithms', dueDate: 'Next Week', priority: 'High', status: 'Pending', description: 'Dynamic programming problems' }
      ]);
    }
    const assignments = await Assignment.find(req.userQuery).sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: assignments
    });
  } catch (error) {
    console.error(`Error fetching assignments: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new assignment
// @route   POST /api/assignments
// @access  Public
const createAssignment = async (req, res) => {
  try {
    const { title, subject, dueDate, priority, status, description } = req.body;

    if (!title || !subject) {
      return res.status(400).json({ success: false, message: 'Please provide title and subject' });
    }

    const assignment = await Assignment.create({
      userId: req.userId,
      title,
      subject,
      dueDate: dueDate || '',
      priority: priority || 'Medium',
      status: status || 'Pending',
      description: description || ''
    });

    res.status(201).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error(`Error creating assignment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update assignment
// @route   PUT /api/assignments/:id
// @access  Public
const updateAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndUpdate({ _id: req.params.id, ...req.userQuery }, req.body, {
      new: true,
      runValidators: true
    });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      data: assignment
    });
  } catch (error) {
    console.error(`Error updating assignment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete assignment
// @route   DELETE /api/assignments/:id
// @access  Public
const deleteAssignment = async (req, res) => {
  try {
    const assignment = await Assignment.findOneAndDelete({ _id: req.params.id, ...req.userQuery });

    if (!assignment) {
      return res.status(404).json({ success: false, message: 'Assignment not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Assignment removed'
    });
  } catch (error) {
    console.error(`Error deleting assignment: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getAssignments,
  createAssignment,
  updateAssignment,
  deleteAssignment
};
