const mongoose = require("mongoose");

const certificateSchema = new mongoose.Schema({
  name: String,
  issuedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  event: { type: mongoose.Schema.Types.ObjectId, ref: "Event" },
  issueDate: Date,
  fileUrl: String
});

module.exports = mongoose.model("Certificate", certificateSchema);
