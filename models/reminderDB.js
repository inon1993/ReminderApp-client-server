const mongoose = require("mongoose");

const remindersSchema = new mongoose.Schema({
  title: String,
  body: String,
  date: String,
  time: String,
  color: String,
  username: String,
});

const Reminder = mongoose.model("Reminder", remindersSchema);

module.exports = Reminder;
