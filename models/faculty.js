const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  empid: { type: String, unique: true },
  department: String,

});

module.exports = mongoose.model("faculty", userSchema);