const mongoose = require("mongoose");

const venueSchema = new mongoose.Schema({
  name: String,
  location: String,
  available: Boolean,
  bookedSlots: [{ date: Date, time: String }]
});

module.exports = mongoose.model("Venue", venueSchema);
