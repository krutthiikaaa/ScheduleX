const Timetable = require('../models/Timetable');

const dayOrder = {
  'Monday': 1,
  'Tuesday': 2,
  'Wednesday': 3,
  'Thursday': 4,
  'Friday': 5,
  'Saturday': 6,
  'Sunday': 7
};

// @desc    Get all timetable events
// @route   GET /api/timetable
// @access  Public
const getTimetableEvents = async (req, res) => {
  try {
    const count = await Timetable.countDocuments(req.userQuery);
    if (count === 0 && req.isDemoUser) {
      await Timetable.insertMany([
        { subject: 'Operating Systems', day: 'Monday', startTime: '09:00', endTime: '10:30', notes: 'Room 304' },
        { subject: 'Data Structures', day: 'Monday', startTime: '11:00', endTime: '12:30', notes: 'Lab 2' },
        { subject: 'Algorithms', day: 'Tuesday', startTime: '10:00', endTime: '11:30', notes: 'Room 101' },
        { subject: 'Database Management', day: 'Wednesday', startTime: '14:00', endTime: '15:30', notes: 'Room 205' },
        { subject: 'Computer Networks', day: 'Thursday', startTime: '09:00', endTime: '10:30', notes: 'Room 304' }
      ]);
    }
    const events = await Timetable.find(req.userQuery);
    
    // Sort by Day of Week, then Start Time
    events.sort((a, b) => {
      const dayDiff = (dayOrder[a.day] || 99) - (dayOrder[b.day] || 99);
      if (dayDiff !== 0) return dayDiff;
      return a.startTime.localeCompare(b.startTime);
    });

    res.status(200).json({
      success: true,
      data: events
    });
  } catch (error) {
    console.error(`Error fetching timetable events: ${error.message}`);
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Create new timetable event
// @route   POST /api/timetable
// @access  Public
const createTimetableEvent = async (req, res) => {
  try {
    const { subject, day, startTime, endTime, notes } = req.body;

    if (!subject || !day || !startTime || !endTime) {
      return res.status(400).json({
        success: false,
        message: 'Please provide subject, day, startTime, and endTime'
      });
    }

    const newEvent = await Timetable.create({
      userId: req.userId,
      subject,
      day,
      startTime,
      endTime,
      notes: notes || ''
    });

    res.status(201).json({
      success: true,
      message: 'Class created successfully',
      data: newEvent
    });
  } catch (error) {
    console.error(`Error creating timetable event: ${error.message}`);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Update timetable event
// @route   PUT /api/timetable/:id
// @access  Public
const updateTimetableEvent = async (req, res) => {
  try {
    const { subject, day, startTime, endTime, notes } = req.body;
    let event = await Timetable.findOne({ _id: req.params.id, ...req.userQuery });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    event.subject = subject ?? event.subject;
    event.day = day ?? event.day;
    event.startTime = startTime ?? event.startTime;
    event.endTime = endTime ?? event.endTime;
    if (notes !== undefined) event.notes = notes;

    const updatedEvent = await event.save();

    res.status(200).json({
      success: true,
      message: 'Class updated successfully',
      data: updatedEvent
    });
  } catch (error) {
    console.error(`Error updating timetable event: ${error.message}`);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid ID format' });
    }
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ success: false, message: messages.join(', ') });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

// @desc    Delete timetable event
// @route   DELETE /api/timetable/:id
// @access  Public
const deleteTimetableEvent = async (req, res) => {
  try {
    const event = await Timetable.findOne({ _id: req.params.id, ...req.userQuery });

    if (!event) {
      return res.status(404).json({ success: false, message: 'Class not found' });
    }

    await event.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Class deleted successfully'
    });
  } catch (error) {
    console.error(`Error deleting timetable event: ${error.message}`);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ success: false, message: 'Invalid ID format' });
    }
    res.status(500).json({ success: false, message: 'Server Error' });
  }
};

module.exports = {
  getTimetableEvents,
  createTimetableEvent,
  updateTimetableEvent,
  deleteTimetableEvent
};
