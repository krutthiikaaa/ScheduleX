const mongoose = require('mongoose');

const timetableSchema = new mongoose.Schema({
  subject: {
    type: String,
    required: [true, 'Subject is required']
  },
  day: {
    type: String,
    required: [true, 'Day is required'],
    enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']
  },
  startTime: {
    type: String,
    required: [true, 'Start Time is required']
  },
  endTime: {
    type: String,
    required: [true, 'End Time is required']
  },
  notes: {
    type: String,
    default: ''
  },
  date: {
    type: String,
    default: ''
  },
  isRecurring: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Timetable || mongoose.model('Timetable', timetableSchema);
