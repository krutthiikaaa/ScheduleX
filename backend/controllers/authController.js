const User = require('../models/User');
const authService = require('../services/authService');

const register = async (req, res) => {
  try {
    const { name, email, password, confirmPassword } = req.body;

    const validation = authService.validateRegisterInput({ name, email, password, confirmPassword });
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors[0], errors: validation.errors });
    }

    const cleanEmail = email.toLowerCase().trim();
    const existingUser = await User.findOne({ email: cleanEmail });
    if (existingUser) {
      return res.status(400).json({ error: 'Email is already registered' });
    }

    const hashedPassword = await authService.hashPassword(password);
    const user = new User({
      name: name.trim(),
      fullName: name.trim(),
      email: cleanEmail,
      password: hashedPassword,
      authProvider: 'manual'
    });
    await user.save();

    const token = authService.generateToken(user);
    res.status(201).json({
      token,
      user: authService.formatUserResponse(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error during registration' });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Please provide email and password' });
    }

    const cleanEmail = email.toLowerCase().trim();
    const user = await User.findOne({ email: cleanEmail });
    if (!user) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    if (!user.password && user.authProvider === 'google') {
      return res.status(400).json({ error: 'Please sign in with Google for this account' });
    }

    const isMatch = await authService.comparePassword(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid credentials' });
    }

    const token = authService.generateToken(user);
    res.json({
      token,
      user: authService.formatUserResponse(user)
    });
  } catch (err) {
    res.status(500).json({ error: err.message || 'Server error during login' });
  }
};

const logout = async (req, res) => {
  try {
    res.json({ message: 'Logged out successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getMe = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated' });
    }
    res.json(authService.formatUserResponse(req.user));
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const googleCallback = async (req, res) => {
  try {
    if (!req.user) {
      return res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=oauth_failed`);
    }
    const token = authService.generateToken(req.user);
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    res.redirect(`${clientUrl}/login?token=${token}`);
  } catch (err) {
    res.redirect(`${process.env.CLIENT_URL || 'http://localhost:5173'}/login?error=server_error`);
  }
};

module.exports = {
  register,
  login,
  logout,
  getMe,
  googleCallback
};
