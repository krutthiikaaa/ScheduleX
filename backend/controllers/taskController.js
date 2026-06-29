const Task = require('../models/Task');

// @desc    Get all tasks
// @route   GET /api/tasks
// @access  Public
const getTasks = async (req, res) => {
  try {
    const count = await Task.countDocuments();
    if (count === 0) {
      await Task.insertMany([
        { title: 'Review Operating Systems notes', category: 'Academic', priority: 'High', isCompleted: true },
        { title: 'Submit DBMS assignment', category: 'Academic', priority: 'High', isCompleted: false },
        { title: 'Practice 5 LeetCode DP questions', category: 'Coding', priority: 'Medium', isCompleted: false },
        { title: 'Read Chapter 4 of Clean Code', category: 'Reading', priority: 'Low', isCompleted: false }
      ]);
    }
    const tasks = await Task.find().sort({ createdAt: -1 });
    res.status(200).json({
      success: true,
      data: tasks
    });
  } catch (error) {
    console.error(`Error fetching tasks: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new task
// @route   POST /api/tasks
// @access  Public
const createTask = async (req, res) => {
  try {
    const { title, category, priority, isCompleted } = req.body;

    if (!title) {
      return res.status(400).json({ success: false, message: 'Please provide task title' });
    }

    const task = await Task.create({
      title,
      category: category || 'Academic',
      priority: priority || 'Medium',
      isCompleted: isCompleted || false
    });

    res.status(201).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(`Error creating task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update task
// @route   PUT /api/tasks/:id
// @access  Public
const updateTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      data: task
    });
  } catch (error) {
    console.error(`Error updating task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete task
// @route   DELETE /api/tasks/:id
// @access  Public
const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);

    if (!task) {
      return res.status(404).json({ success: false, message: 'Task not found' });
    }

    res.status(200).json({
      success: true,
      message: 'Task removed'
    });
  } catch (error) {
    console.error(`Error deleting task: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getTasks,
  createTask,
  updateTask,
  deleteTask
};
