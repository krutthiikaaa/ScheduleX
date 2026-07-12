const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const validateRegisterInput = ({ name, email, password, confirmPassword }) => {
  const errors = [];

  if (!name || !name.trim()) {
    errors.push('Name is required');
  }

  if (!email || !email.trim()) {
    errors.push('Email is required');
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errors.push('Please provide a valid email address');
    }
  }

  if (!password) {
    errors.push('Password is required');
  } else if (password.length < 6) {
    errors.push('Password must be at least 6 characters long');
  }

  if (password !== confirmPassword) {
    errors.push('Passwords do not match');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const comparePassword = async (password, hash) => {
  if (!password || !hash) return false;
  return await bcrypt.compare(password, hash);
};

const generateToken = (user) => {
  const payload = {
    id: user._id,
    email: user.email,
    authProvider: user.authProvider
  };
  const secret = process.env.JWT_SECRET || 'secret123';
  return jwt.sign(payload, secret, { expiresIn: '7d' });
};

const formatUserResponse = (user) => {
  return {
    id: user._id,
    name: user.name || user.fullName,
    fullName: user.fullName || user.name,
    email: user.email,
    avatar: user.avatar,
    authProvider: user.authProvider,
    preferences: user.preferences,
    createdAt: user.createdAt
  };
};

module.exports = {
  validateRegisterInput,
  hashPassword,
  comparePassword,
  generateToken,
  formatUserResponse
};
