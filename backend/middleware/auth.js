const jwt = require('jsonwebtoken');
const User = require('../models/User');

const auth = async (req, res, next) => {
  try {
    let token = req.header('Authorization');
    if (token && token.startsWith('Bearer ')) {
      token = token.slice(7, token.length).trim();
    } else if (!token) {
      token = req.header('x-auth-token');
    }

    if (!token || token === 'null' || token === 'undefined') {
      return res.status(401).json({ error: 'Not authorized, no token provided' });
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret123');
      const user = await User.findById(decoded.id);
      if (!user) {
        return res.status(401).json({ error: 'Not authorized, user not found' });
      }

      req.user = user;
      req.userId = user._id;

      if (user.email === 'jane.doe@example.com') {
        req.isDemoUser = true;
        req.userQuery = { $or: [{ userId: user._id }, { userId: { $exists: false } }, { userId: null }] };
      } else {
        req.isDemoUser = false;
        req.userQuery = { userId: user._id };
      }

      next();
    } catch (err) {
      return res.status(401).json({ error: 'Not authorized, token failed or expired' });
    }
  } catch (err) {
    res.status(500).json({ error: 'Server Auth Error' });
  }
};

module.exports = auth;
