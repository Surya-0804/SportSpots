const express = require('express');
const { Event } = require('../models');
const { events } = require('../models/event');
const event = require('../models/event');
const router = express.Router();

// Admin Dashboard
router.get('/admin-dashboard', async (req, res) => {
  // Check if user is admin before rendering
  const events = (await Event.find({ createdBy: req.user._id })) || [];
  const username = req.user.username;
  if (req.user && req.user.role === 'admin') {
    res.render('adminDashboard', { events, messages: {}, user: username }); // Render admin dashboard view
  } else {
    res.redirect('/login');
  }
});

// Player Dashboard
router.get('/player-dashboard', async (req, res) => {
  // Check if user is player before rendering
  const events = await Event.find();
  const joinedEvents =
    events.filter((event) => event.participants.includes(req.user._id)) || [];
  // console.log(joinedEvents);
  const username = req.user.username;
  if (req.user && req.user.role === 'player') {
    res.render('playerDashboard', {
      events,
      joinedEvents,
      messages: {},
      user: username,
    }); // Render player dashboard view
  } else {
    res.redirect('/login');
  }
});

module.exports = router;
