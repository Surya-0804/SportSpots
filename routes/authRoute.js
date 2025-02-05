const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Routes for Signup and Login
router.get('/signup', authController.getSignup); // Render Signup Form
router.post('/signup', authController.postSignup); // Handle Signup Form Submission
router.get('/login', authController.getLogin); // Render Login Form
router.post('/login', authController.postLogin); // Handle Login Form Submission
router.get('/logout', authController.logout); // Logout

module.exports = router;
