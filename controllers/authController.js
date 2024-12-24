const User = require('../models/user');
const bcrypt = require('bcrypt');
const passport = require('passport');

// Render Signup Form
exports.getSignup = (req, res) => {
  res.render('signup'); // Render signup view
};

// Handle Signup Form Submission
exports.postSignup = async (req, res) => {
  try {
    const { username, email, password, role } = req.body;

    // Check if the user already exists
    const existingUser = await User.findOne({ where: { email } });
    if (existingUser) {
      req.flash('error', 'Email is already in use');
      return res.redirect('/signup');
    }

    // Hash the password using bcrypt
    // const hashedPassword = await bcrypt.hash(password, 10);
    // console.log('Raw Password:', password);
    // console.log('Hashed Password:', hashedPassword);

    // Create new user
    const newUser = await User.create({
      username,
      email,
      password, // Store hashed password
      role,
    });

    // Redirect to login after successful signup
    res.redirect('/login');
  } catch (error) {
    console.error(error);
    req.flash('error', 'Error registering user');
    res.redirect('/signup');
  }
};

// Render Login Form
exports.getLogin = (req, res) => {
  res.render('login'); // Render login view
};

// Handle Login Form Submission using Passport.js
exports.postLogin = (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) {
      return next(err);
    }
    if (!user) {
      req.flash('error', info.message || 'Login failed');
      return res.redirect('/login');
    }

    req.login(user, (err) => {
      if (err) {
        req.flash('error', 'Login failed');
        return res.redirect('/login');
      }

      // Redirect based on role
      if (user.role === 'admin') {
        return res.redirect('/admin-dashboard');
      } else if (user.role === 'player') {
        return res.redirect('/player-dashboard');
      } else {
        return res.redirect('/login');
      }
    });
  })(req, res, next);
};

// Logout
exports.logout = (req, res, next) => {
  req.logout((err) => {
    if (err) return next(err);
    res.redirect('/login');
  });
};
