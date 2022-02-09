const express = require("express");
const { send } = require("express/lib/response");
const { Mongoose } = require("mongoose");
const passport = require("passport");
const router = express.Router();
const Reminder = require("../models/reminderDB");
const User = require("../models/reminderDBUsers");

passport.use(User.createStrategy());

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

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

      User.register({fname: data.fname, lname: data.lname, email: data.email, username: data.username}, data.password, (err, user) => {
        if(err) {
          console.log(err);
          res.status(500).json({msg: 'Something went wrong in server.'})
        } else {
          passport.authenticate('local')(req, res, () => {
            res.json({msg: 'Successfully saved user.'})
          })
        }
      })
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

router.post('/login', (req, res) => {
  console.log(req.body);

  const user = new User({
    username: req.body.username,
    password: req.body.password
  });

  req.login(user, (err) => {
    if(err) {
      console.log(err);
    } else {
      passport.authenticate('local')(req, res, () => {
        console.log('Login successfully!!');
        res.json({msg: 'Login was successfull'});
      });
    }
  });
});

router.get('/auth', (req, res) => {
  if(req.isAuthenticated()) {
    res.json({msg: 'User is authenticated.'})
  }
});

router.get('/logout', (req, res) => {
  req.logout();
  res.json({msg: 'Logout is successfull.'});
});

module.exports = router;
