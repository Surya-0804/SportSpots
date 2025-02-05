const passport = require('passport');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const User = require('../models/user'); // Mongoose model

// Serialize user for the session
passport.serializeUser((user, done) => {
  done(null, user.id); // Using Mongoose's _id
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await User.findById(id); // Using Mongoose's findById
    done(null, user);
  } catch (error) {
    done(error);
  }
});

// Local Strategy Configuration
passport.use(
  new LocalStrategy(
    {
      usernameField: 'email',
      passwordField: 'password',
    },
    async (email, password, done) => {
      try {
        // Find user by email using Mongoose query
        const user = await User.findOne({ email });

        console.log('Login attempt for email:', email);

        if (!user) {
          console.log('No user found with email:', email);
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        // Compare passwords
        const isMatch = await bcrypt.compare(password, user.password);
        console.log('Password match result:', isMatch);

        if (!isMatch) {
          return done(null, false, { message: 'Incorrect email or password.' });
        }

        return done(null, user);
      } catch (error) {
        console.error('Authentication error:', error);
        return done(error);
      }
    }
  )
);

module.exports = passport;
