const Event = require('../models/event');
const User = require('../models/user');

exports.postCreateEvent = async (req, res) => {
  try {
    // Check if user is authenticated
    if (!req.user) {
      req.flash('error', 'You must be logged in to create an event');
      return res.redirect('/login');
    }

    const { name, description, date, location, capacity } = req.body;

    // Validate input
    if (!name || !description || !date || !location || !capacity) {
      req.flash('error', 'All fields are required');
      return res.redirect('/create-event', { messages: {} });
    }

    const newEvent = new Event({
      name,
      description,
      date: new Date(date),
      location,
      capacity: parseInt(capacity),
      createdBy: req.user._id,
      participants: [],
    });

    await newEvent.save();
    req.flash('success', 'Event created successfully');
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Error creating event:', error);
    req.flash('error', 'Error creating event');
    res.redirect('/create-event');
  }
};
// Admin Controllers
exports.getAdminDashboard = async (req, res) => {
  try {
    const events = await Event.find({}).sort({ date: 'asc' });

    res.render('adminDashboard', {
      events,
      user: req.user,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};

exports.getCreateEvent = (req, res) => {
  res.render('createEvent', {
    user: req.user,
  });
};

// exports.postCreateEvent = async (req, res) => {
//   try {
//     const { name, description, date, location, capacity } = req.body;

//     const newEvent = new Event({
//       name,
//       description,
//       date,
//       location,
//       capacity: parseInt(capacity),
//       createdBy: req.user._id,
//       participants: [], // Initialize empty participants array
//     });

//     await newEvent.save();
//     req.flash('success', 'Event created successfully');
//     res.redirect('/admin-dashboard');
//   } catch (error) {
//     console.error('Error creating event:', error);
//     req.flash('error', 'Error creating event');
//     res.redirect('/create-event');
//   }
// };

exports.getEditEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin-dashboard');
    }
    res.render('editEvent', {
      event,
      user: req.user,
    });
  } catch (error) {
    console.error('Error fetching event:', error);
    req.flash('error', 'Error loading event');
    res.redirect('/admin-dashboard');
  }
};

exports.postEditEvent = async (req, res) => {
  try {
    const { name, description, date, location, capacity } = req.body;

    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/admin-dashboard');
    }

    // Check if new capacity is less than current participants
    if (parseInt(capacity) < event.participants.length) {
      req.flash(
        'error',
        'New capacity cannot be less than current number of participants'
      );
      return res.redirect(`/edit-event/${req.params.id}`);
    }

    await Event.findByIdAndUpdate(req.params.id, {
      name,
      description,
      date,
      location,
      capacity: parseInt(capacity),
    });

    req.flash('success', 'Event updated successfully');
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Error updating event:', error);
    req.flash('error', 'Error updating event');
    res.redirect('/admin-dashboard');
  }
};

exports.deleteEvent = async (req, res) => {
  try {
    await Event.findByIdAndDelete(req.params.id);
    req.flash('success', 'Event deleted successfully');
    res.redirect('/admin-dashboard');
  } catch (error) {
    console.error('Error deleting event:', error);
    req.flash('error', 'Error deleting event');
    res.redirect('/admin-dashboard');
  }
};

// Player Controllers
exports.getPlayerDashboard = async (req, res) => {
  try {
    // Find all events
    const allEvents = await Event.find({
      date: { $gte: new Date() }, // Only show upcoming events
    }).sort({ date: 'asc' });

    // Separate events into joined and available
    const joinedEvents = allEvents.filter((event) =>
      event.participants.includes(req.user._id)
    );

    const availableEvents = allEvents.filter(
      (event) =>
        !event.participants.includes(req.user._id) &&
        event.participants.length < event.capacity
    );

    res.render('playerDashboard', {
      joinedEvents,
      availableEvents,
      user: req.user,
    });
  } catch (error) {
    console.error('Error fetching events:', error);
    req.flash('error', 'Error loading dashboard');
    res.redirect('/');
  }
};

exports.joinEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/player-dashboard');
    }

    // Check if player is already registered
    if (event.participants.includes(req.user._id)) {
      req.flash('error', 'You are already registered for this event');
      return res.redirect('/player-dashboard');
    }

    // Check if event is full
    if (event.participants.length >= event.capacity) {
      req.flash('error', 'Event is full');
      return res.redirect('/player-dashboard');
    }

    // Add player to participants
    event.participants.push(req.user._id);
    await event.save();

    req.flash('success', 'Successfully joined the event');
    res.redirect('/player-dashboard');
  } catch (error) {
    console.error('Error joining event:', error);
    req.flash('error', 'Error joining event');
    res.redirect('/player-dashboard');
  }
};
exports.leaveEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) {
      req.flash('error', 'Event not found');
      return res.redirect('/player-dashboard');
    }

    // Check if the user is in the participants list
    const participantIndex = event.participants.indexOf(req.user._id);
    if (participantIndex === -1) {
      req.flash('error', 'You are not part of this event');
      return res.redirect('/player-dashboard');
    }

    // Remove player from participants list
    event.participants.splice(participantIndex, 1);
    await event.save();

    req.flash('success', 'You have successfully left the event');
    res.redirect('/player-dashboard');
  } catch (error) {
    console.error('Error leaving event:', error);
    req.flash('error', 'Error leaving event');
    res.redirect('/player-dashboard');
  }
};
