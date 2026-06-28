const mongoose = require('mongoose');

const habitSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required']
  },
  category: {
    type: String,
    default: 'Personal'
  },
  history: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  notes: {
    type: String,
    default: ''
  }
}, {
  timestamps: true,
  minimize: false
});

module.exports = mongoose.models.Habit || mongoose.model('Habit', habitSchema);
