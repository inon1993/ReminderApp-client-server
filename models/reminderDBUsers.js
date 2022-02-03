const mongoose = require("mongoose");

const usersSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String,
});

const User = mongoose.model("User", usersSchema);

module.exports = User;