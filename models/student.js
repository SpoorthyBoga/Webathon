const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  rollno: { type: String, unique: true },
  role: { type: String, enum: ['student', 'faculty', 'organizer', 'management'], required: true },
  qrCode: String,
  registeredEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  attendedEvents: [{ type: mongoose.Schema.Types.ObjectId, ref: "Event" }],
  badges: [{ type: mongoose.Schema.Types.ObjectId, ref: "Badge" }],
  certificates: [{ type: mongoose.Schema.Types.ObjectId, ref: "Certificate" }],
  interests: [String],
  followingOrganizers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("student", userSchema);
