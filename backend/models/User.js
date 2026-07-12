const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  fullName: { type: String }, // alias compatibility for existing UI components
  email: { type: String, required: true, unique: true, lowercase: true, trim: true },
  password: { type: String, default: null }, // nullable for Google users
  googleId: { type: String, default: null, index: true }, // nullable for manual users
  avatar: { 
    type: String, 
    default: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80' 
  },
  authProvider: { 
    type: String, 
    enum: ['manual', 'google'], 
    default: 'manual' 
  },
  preferences: {
    theme: { type: String, default: 'light' },
    notifications: { type: Boolean, default: true }
  }
}, { timestamps: true });

// Ensure both name and fullName are kept in sync for backward/forward compatibility
userSchema.pre('save', function() {
  if (this.name && !this.fullName) {
    this.fullName = this.name;
  } else if (this.fullName && !this.name) {
    this.name = this.fullName;
  }
});

module.exports = mongoose.models.User || mongoose.model('User', userSchema);
