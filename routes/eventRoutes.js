// routes/eventRoutes.js
const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { isAuthenticated, isAdmin } = require('../middleware/auth');

// Admin Routes - Add isAdmin middleware
router.get('/admin-dashboard', isAdmin, eventController.getAdminDashboard);
router.get('/create-event', isAdmin, eventController.getCreateEvent);
router.post('/create-event', isAdmin, eventController.postCreateEvent);
router.get('/edit-event/:id', isAdmin, eventController.getEditEvent);
router.post('/edit-event/:id', isAdmin, eventController.postEditEvent);
router.get('/delete-event/:id', isAdmin, eventController.deleteEvent);

// Player Routes - Add isAuthenticated middleware
router.get(
  '/player-dashboard',
  isAuthenticated,
  eventController.getPlayerDashboard
);
router.post('/join-event/:id', isAuthenticated, eventController.joinEvent);
// Leave event route
router.post('/leave-event/:id', eventController.leaveEvent);

module.exports = router;
