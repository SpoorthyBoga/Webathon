const mongoose = require("mongoose");

const badgeSchema = new mongoose.Schema({
  title: String,
  description: String,
  awardedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }]
});

module.exports = mongoose.model("Badge", badgeSchema);
