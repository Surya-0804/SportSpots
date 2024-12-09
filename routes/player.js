const express = require("express");
const { Event } = require("../models");
const router = express.Router();

// Player dashboard
router.get("/dashboard", async (req, res) => {
  const events = await Event.findAll();
  res.render("player/dashboard", { events });
});

// Join event
router.post("/join-event/:id", async (req, res) => {
  const eventId = req.params.id;
  // Logic to add player to event (e.g., store in a pivot table or similar)
  res.redirect("/player/dashboard");
});

module.exports = router;
