var express = require("express");
var router = express.Router();
var Schedule = require("../models/meeting");
var nodemailer = require("nodemailer");

let transpoter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "*****Enter your email account",
    pass: "***** Enter your password",
  },
});

router.get("/mail", isLoggedIn, (req, res) => {
  res.render("mail.ejs");
});

var reminderName = "";
router.post("/reminderName", isLoggedIn, (req, res) => {
  reminderName = req.body.meetingName;
  res.redirect("/reminder");
});

router.get("/reminder", isLoggedIn, (req, res) => {
  meetingName = reminderName;
  res.render("reminder", { meetingName: meetingName });
});

router.post("/reminder", isLoggedIn, (req, res) => {
  console.log(req.body.reminder);
  Schedule.find({ name: req.body.reminder.name }, (err, foundmeeting) => {
    // console.log(foundmeeting);
    if (err) {
      res.redirect("/meeting");
      console.log(err);
    } else {
      let mailOptions = {
        from: "***** Enter your email account",
        subject: req.body.reminder.subject,
        text: req.body.reminder.message,
      };
      console.log(foundmeeting[0].email);
      foundmeeting[0].email.forEach((userId) => {
        // console.log(userId.emailId);
        mailOptions.to = userId.emailId;
        transpoter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log("Error Occurs");
          } else {
            console.log("Email Sent!!");
          }
        });
      });
      res.redirect("/meeting");
    }
  });
});

router.post("/mail", isLoggedIn, (req, res) => {
  Schedule.find(req.body.mail, (err, foundmeeting) => {
    // console.log(foundmeeting);
    if (err) {
      res.redirect("/meeting");
      console.log(err);
    } else {
      let mailOptions = {
        from: "meetingscheduler2000@gmail.com",
        subject: foundmeeting[0].title,
        text: foundmeeting[0].message,
      };
      console.log(foundmeeting[0].email);
      foundmeeting[0].email.forEach((userId) => {
        // console.log(userId.emailId);
        mailOptions.to = userId.emailId;
        transpoter.sendMail(mailOptions, function (err, data) {
          if (err) {
            console.log("Error Occurs");
          } else {
            console.log("Email Sent!!");
          }
        });
      });
      res.redirect("/meeting");
    }
  });
});

router.post("/individualMail", isLoggedIn, (req, res) => {
  console.log(req.body.individualMail);
  var idName = req.body.individualMail["id"];
  let mailOptions = {
    from: "meetingscheduler2000@gmail.com",
    to: req.body.individualMail["email"],
    subject: req.body.individualMail["subject"],
    text: req.body.individualMail["text"],
  };

  transpoter.sendMail(mailOptions, function (err, data) {
    if (err) {
      console.log("Error Occurs");
    } else {
      console.log("Email Sent!!");
    }
  });
  res.redirect("/meeting/" + idName);
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

module.exports = router;
