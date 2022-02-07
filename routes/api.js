const express = require("express");
const { send } = require("express/lib/response");
const { Mongoose } = require("mongoose");
const router = express.Router();
const Reminder = require("../models/reminderDB");
const User = require("../models/reminderDBUsers");

router.get("/", (req, res) => {
  Reminder.find({})
    .then((data) => {
      // console.log('Data: ', data);
      res.json(data);
    })
    .catch((err) => {
      console.log("Error: ", err);
    });
});

router.post("/save", (req, res) => {
  console.log("Body: ", req.body);

  const data = req.body;

  const newReminder = new Reminder(data);

  newReminder.save((err) => {
    if (err) {
      res.status(500).json({ msg: "Sorry, internal server errors." });
    } else {
      res.json({
        msg: "We received your data!",
      });
    }
  });
});

router.delete("/delete", (req, res) => {
  const data = req.body.id;

  Reminder.findByIdAndRemove(data, (err) => {
    if (!err) {
      res.send("wrks");
    } else {
      console.log(err);
    }
  });
});

////////// SIGN UP //////////////////

router.post("/signup", (req, res) => {
  console.log("Body: ", req.body);

  const data = req.body;

  User.findOne({ username: data.username }, (err, foundUser) => {
    if (!foundUser) {
      const newUser = new User(data);

      newUser.save((err) => {
        if (err) {
          res.status(500).json({ msg: "Sorry, internal server errors." });
        } else {
          res.json({
            msg: "We received your data!",
          });
        }
      });
    }
    if (foundUser) {
      console.log("username exist");
      res.json({ msg: "Username already exists" });
    }
    if (err) {
      res.status(500).json({ msg: "An error!!!!!!" });
    }
  });
});

module.exports = router;
