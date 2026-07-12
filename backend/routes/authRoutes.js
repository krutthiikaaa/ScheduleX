const express = require('express');
const router = express.Router();
const passport = require('passport');
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/auth');

router.post('/register', authController.register);
router.post('/login', authController.login);
router.post('/logout', authController.logout);
router.get('/me', authMiddleware, authController.getMe);

// Google OAuth routes
router.get('/google', (req, res, next) => {
  const mode = req.query.mode || 'login';
  passport.authenticate('google', { scope: ['profile', 'email'], state: mode })(req, res, next);
});
router.get('/google/callback', (req, res, next) => {
  passport.authenticate('google', { session: false }, (err, user, info) => {
    const clientUrl = process.env.CLIENT_URL || 'http://localhost:5173';
    if (err || !user) {
      const reason = (err && err.message) || (info && info.message) || 'oauth_failed';
      if (reason.includes('No account found') || reason.includes('account_not_found')) {
        return res.redirect(`${clientUrl}/login?error=account_not_found`);
      }
      return res.redirect(`${clientUrl}/login?error=oauth_failed`);
    }
    req.user = user;
    authController.googleCallback(req, res);
  })(req, res, next);
});

module.exports = router;
