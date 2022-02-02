const mongoose = require("mongoose");

const remindersSchema = new mongoose.Schema({
  title: String,
  body: String,
});

const Reminder = mongoose.model("Reminder", remindersSchema);

module.exports = Reminder;
