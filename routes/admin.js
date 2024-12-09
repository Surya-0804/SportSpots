const express = require("express");
const { Event } = require("../models");
const { ensureAdmin } = require("../middlewares/auth");
const router = express.Router();

// Admin dashboard
router.get("/dashboard", ensureAdmin, async (req, res) => {
  const events = await Event.findAll();
  res.render("admin/dashboard", { events });
});

// Create event
router.post("/create-event", ensureAdmin, async (req, res) => {
  const { name, date, description } = req.body;
  await Event.create({ name, date, description });
  res.redirect("/admin/dashboard");
});

// Edit event
router.get("/edit-event/:id", ensureAdmin, async (req, res) => {
  const event = await Event.findByPk(req.params.id);
  res.render("admin/editEvent", { event });
});

// Update event
router.post("/edit-event/:id", ensureAdmin, async (req, res) => {
  const { name, date, description } = req.body;
  await Event.update(
    { name, date, description },
    { where: { id: req.params.id } }
  );
  res.redirect("/admin/dashboard");
});

// Delete event
router.post("/delete-event/:id", ensureAdmin, async (req, res) => {
  await Event.destroy({ where: { id: req.params.id } });
  res.redirect("/admin/dashboard");
});

module.exports = router;
