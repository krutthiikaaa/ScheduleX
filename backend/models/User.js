const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  fullName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  university: { type: String, default: 'State Technical University' },
  semester: { type: String, default: 'Semester 5' },
  cgpa: { type: Number, default: 3.85 },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
