// middleware/auth.js
exports.isAuthenticated = (req, res, next) => {
  if (req.isAuthenticated()) {
    return next();
  }
  req.flash('error', 'Please log in first');
  res.redirect('/login');
};

exports.isAdmin = (req, res, next) => {
  if (req.isAuthenticated() && req.user.role === 'admin') {
    return next();
  }
  req.flash('error', 'Admin access required');
  res.redirect('/login');
};
