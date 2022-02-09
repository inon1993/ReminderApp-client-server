const mongoose = require("mongoose");
const passportLocalMongoose = require('passport-local-mongoose');

const usersSchema = new mongoose.Schema({
  fname: String,
  lname: String,
  email: String,
  username: String,
  password: String,
});

usersSchema.plugin(passportLocalMongoose);

const User = mongoose.model("User", usersSchema);

module.exports = User;