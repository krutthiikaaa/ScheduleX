const mongoose = require('mongoose');

const focusSessionSchema = new mongoose.Schema({
  durationMinutes: {
    type: Number,
    required: [true, 'Duration is required']
  },
  subject: {
    type: String,
    default: ''
  },
  taskId: {
    type: String,
    default: ''
  },
  completedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('FocusSession', focusSessionSchema);
