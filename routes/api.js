const express = require("express");
const { send } = require("express/lib/response");
const { Mongoose } = require("mongoose");
const passport = require("passport");
const router = express.Router();
const Reminder = require("../models/reminderDB");
const User = require("../models/reminderDBUsers");
const sgMail = require("@sendgrid/mail");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

router.get("/", (req, res) => {
  Reminder.find({ username: req.query.username })
    .then((data) => {
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
      const API_KEY =
        "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";
      sgMail.setApiKey(API_KEY);
      User.findOne({ username: data.username }, (err, foundUser) => {
        if (!err) {
          console.log(foundUser);
          const date = new Date(data.date);
          console.log("ddd " + date);
          const time = data.time;
          const dateTime = `${date} ${time}`;
          const dt = new Date(dateTime);
          console.log("dt" + dt);
          const unixTimeStamp = Math.floor(dt.getTime() / 1000);
          console.log(unixTimeStamp);
          const message = {
            to: foundUser.email,
            from: {
              name: "ReminderApp",
              email: "inon1993@gmail.com",
            },
            subject: data.title,
            text: data.body,
            send_at: unixTimeStamp,
          };
          sgMail
            .send(message)
            .then((response) => {
              console.log(message);
              console.log("Email sent...");
            })
            .catch((error) => console.log(error.message));
        }
      });

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
      User.register(
        {
          fname: data.fname,
          lname: data.lname,
          email: data.email,
          username: data.username,
        },
        data.password,
        (err, user) => {
          if (err) {
            console.log(err);
            res.status(500).json({ msg: "Something went wrong in server." });
          } else {
            passport.authenticate("local")(req, res, () => {
              res.json({
                fname: req.user.fname,
                lname: req.user.lname,
                email: req.user.email,
                username: req.user.username,
                msg: "Successfully saved user.",
              });
            });
          }
        }
      );
    }
    // const newUser = new User(data);

    // newUser.save((err) => {
    //   if (err) {
    //     res.status(500).json({ msg: "Sorry, internal server errors." });
    //   } else {
    //     res.json({
    //       msg: "We received your data!",
    //     });
    //   }
    // });

    if (foundUser) {
      console.log("username exist");
      res.json({ msg: "Username already exists" });
    }
    if (err) {
      res.status(500).json({ msg: "An error!!!!!!" });
    }
  });
});

router.post("/login", (req, res) => {
  console.log(req.body);

  const user = new User({
    username: req.body.username,
    password: req.body.password,
  });

  req.login(user, (err) => {
    if (err) {
      console.log(err);
    } else {
      passport.authenticate("local")(req, res, () => {
        // console.log(res);
        console.log("Login successfully!!");
        User.findOne({ username: user.username }, (err, loginUser) => {
          if (!err) {
            res.json({
              fname: loginUser.fname,
              lname: loginUser.lname,
              email: loginUser.email,
              username: loginUser.username,
              msg: "Login was successfull",
            });
          } else {
            console.log(err);
          }
        });
      });
    }
  });
});

router.get("/auth", (req, res) => {
  if (req.isAuthenticated()) {
    res.json({
      fname: req.user.fname,
      lname: req.user.lname,
      email: req.user.email,
      username: req.user.username,
      msg: "User is authenticated.",
    });
  }
});

router.get("/logout", (req, res) => {
  req.logout();
  res.json({ msg: "Logout is successfull." });
});

module.exports = router;
