const mongoose = require('mongoose');

const goalSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  type: {
    type: String,
    enum: ['Weekly', 'Monthly'],
    required: true
  },
  week: {
    type: Number,
    default: 1
  },
  completed: {
    type: Boolean,
    default: false
  },
  priority: {
    type: String,
    enum: ['High', 'Medium', 'Low'],
    default: 'Medium'
  },
  deadline: {
    type: String,
    default: ''
  },
  progress: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Goal || mongoose.model('Goal', goalSchema);
