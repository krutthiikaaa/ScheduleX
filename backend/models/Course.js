const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Course name is required']
  },
  code: {
    type: String,
    default: ''
  },
  instructor: {
    type: String,
    default: ''
  },
  credits: {
    type: Number,
    default: 3
  },
  color: {
    type: String,
    default: '#4a6cf7'
  }
}, {
  timestamps: true
});

module.exports = mongoose.models.Course || mongoose.model('Course', courseSchema);
