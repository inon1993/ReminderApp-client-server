const express = require("express");
const { test } = require("media-typer");
const mongoose = require("mongoose");
const morgan = require("morgan");
const path = require("path");
const session = require("express-session");
const passport = require("passport");
const passportLocalMongoose = require("passport-local-mongoose");

const app = express();
const PORT = process.env.PORT || 8080;

const routes = require("./routes/api");

app.use(morgan("tiny"));

app.use(
  session({
    secret: "Our little secret.", ////////////////////need to put secret in .env file!!
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

// const MONGODB_URI = 'mongodb+srv://admin-inon:inon1050650@reminder.ccizi.mongodb.net/myFirstDatabase?retryWrites=true&w=majority'

mongoose.connect(/*MONGODB_URI ||*/ "mongodb://localhost:27017/ReminderAppDB");
mongoose.connection.on("connected", () => {
  console.log("Mongoose is connected.");
});

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/api", routes);

app.listen(PORT, console.log(`Server is starting at ${PORT}`));
