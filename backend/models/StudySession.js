const mongoose = require('mongoose');

const studySessionSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Session title is required']
  },
  duration: {
    type: Number,
    default: 25
  },
  category: {
    type: String,
    default: 'General'
  },
  completed: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('StudySession', studySessionSchema);
