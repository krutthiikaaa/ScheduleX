const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/User');

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || 'placeholder_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'placeholder_client_secret',
      callbackURL: '/auth/google/callback',
      proxy: true,
      passReqToCallback: true
    },
    async (req, accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails && profile.emails[0] ? profile.emails[0].value.toLowerCase() : null;
        if (!email) {
          return done(new Error('No email found from Google account'), null);
        }

        // 1. Check if user already exists by googleId
        let user = await User.findOne({ googleId: profile.id });
        if (user) {
          return done(null, user);
        }

        // 2. Check if user already exists by email (Account Linking rule)
        user = await User.findOne({ email });
        if (user) {
          user.googleId = profile.id;
          if (user.authProvider === 'manual') {
            user.authProvider = 'google';
          }
          if (profile.photos && profile.photos[0] && profile.photos[0].value) {
            user.avatar = profile.photos[0].value;
          }
          await user.save();
          return done(null, user);
        }

        // 3. If no user found and mode is 'login' (from Sign-In page), reject login and do NOT create an account
        const mode = req.query.state || 'login';
        if (mode === 'login') {
          return done(new Error('No account found with this Google email. Please sign up first.'), null);
        }

        // 4. Else if mode is 'register' (from Sign-Up page), create new user
        const avatar = profile.photos && profile.photos[0] ? profile.photos[0].value : 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=256&h=256&q=80';
        user = await User.create({
          name: profile.displayName || email.split('@')[0],
          fullName: profile.displayName || email.split('@')[0],
          email,
          googleId: profile.id,
          avatar,
          authProvider: 'google',
          password: null
        });

        return done(null, user);
      } catch (err) {
        return done(err, null);
      }
    }
  )
);

module.exports = passport;
