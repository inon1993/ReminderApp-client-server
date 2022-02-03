const express = require("express");
const { send } = require("express/lib/response");
const { Mongoose } = require("mongoose");
const router = express.Router();
const Reminder = require("../models/reminderDB");
const User = require('../models/reminderDBUsers');

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

  // if(data.fname.trim().length < 1) {
  //   res.send('Invalid first name.');
  //   return (console.log('Invalid first name!'))
  // };

  const newReminder = new User(data);

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

module.exports = router;
