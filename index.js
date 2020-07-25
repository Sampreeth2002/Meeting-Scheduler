var express = require("express");
var app = express();
var bodyParser = require("body-parser");
var mongoose = require("mongoose");
var methodOverride = require("method-override");
var nodemailer = require("nodemailer");
var passport = require("passport");
var LocalStrategy = require("passport-local");
var Schedule = require("./models/meeting.js");
var User = require("./models/user");

//ROUTES
var meetingRoutes = require("./routes/meetings");
var mailRoutes = require("./routes/mail");
var indexRoutes = require("./routes/index");

//APP CONFIG
mongoose.connect("mongodb://localhost/meeting_schedular");
app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(__dirname + "public"));

//PASSPORT CONFIG
app.use(
  require("express-session")({
    secret: "This is meeting",
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function (req, res, next) {
  res.locals.currentUser = req.user;
  next();
});

//NODEMAILER CONFIG
let transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "sampreeth0203@gmail.com",
    pass: "sam@2002",
  },
});

//REST ROUTES
app.use(indexRoutes);
app.use(meetingRoutes);
app.use(mailRoutes);

app.listen("3000", () => {
  console.log("SERVER AS STARTED!!");
});
