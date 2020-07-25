var express = require("express");
var router = express.Router();
var Schedule = require("../models/meeting");

router.get("/", (req, res) => {
  res.redirect("/register");
});

router.get("/meeting", isLoggedIn, (req, res) => {
  console.log(req.user);
  if (req.isAuthenticated()) {
    Schedule.find({}, function (err, meetings) {
      if (err) {
        console.log("ERROR!");
      } else {
        console.log(meetings);
        if (
          meetings.some((meeting) => meeting.author.id.equals(req.user._id))
        ) {
          res.render("landing", {
            meetings: meetings.filter((meeting) =>
              meeting.author.id.equals(req.user._id)
            ),
          });
        } else {
          res.render("new");
        }
      }
    });
  } else {
    console.log("You need to be Logged in");
  }
});

router.get("/history", isLoggedIn, (req, res) => {
  if (req.isAuthenticated()) {
    Schedule.find({}, function (err, meetings) {
      if (err) {
        console.log("ERROR!");
      } else {
        console.log(meetings);
        if (
          meetings.some((meeting) => meeting.author.id.equals(req.user._id))
        ) {
          res.render("history", {
            meetings: meetings.filter((meeting) =>
              meeting.author.id.equals(req.user._id)
            ),
          });
        } else {
          res.render("new");
        }
      }
    });
  } else {
    console.log("You need to be Logged in");
  }
});

router.get("/meeting/new", isLoggedIn, (req, res) => {
  res.render("form/new.ejs");
});

router.post("/meeting", isLoggedIn, (req, res) => {
  var author = {
    id: req.user._id,
    username: req.user.username,
  };

  req.body.meeting.author = author;
  console.log(req.body.meeting);
  Schedule.create(req.body.meeting, function (err, newmeeting) {
    if (err) {
      res.render("new");
      console.log(err);
    } else {
      res.redirect("/meeting");
    }
  });
});

router.get("/meeting/:id", isLoggedIn, function (req, res) {
  Schedule.findById(req.params.id, function (err, foundmeeting) {
    if (err) {
      res.render("/blogs");
    } else {
      res.render("show", { meeting: foundmeeting });
    }
  });
});

router.get("/meeting/:id/edit", isLoggedIn, (req, res) => {
  Schedule.findById(req.params.id, function (err, foundmeeting) {
    if (err) {
      res.render("/blogs");
    } else {
      res.render("edit", { meeting: foundmeeting });
    }
  });
});

router.put("/meeting/:id", isLoggedIn, (req, res) => {
  Schedule.findByIdAndUpdate(
    req.params.id,
    req.body.meeting,
    (err, updatedMeeting) => {
      if (err) {
        console.log(err);
      } else {
        res.redirect("/meeting/" + req.params.id);
      }
    }
  );
});

router.delete("/meeting/:id", isLoggedIn, (req, res) => {
  Schedule.findByIdAndRemove(req.params.id, function (err) {
    if (err) {
      res.redirect("/meeting");
    } else {
      res.redirect("/meeting");
    }
  });
});

function isLoggedIn(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    res.redirect("/login");
  }
}

function checkCampgroundOwnership(req, res, next) {
  if (req.isAuthenticated()) {
    Schedule.find({}, function (err, meetings) {
      if (err) {
        res.redirect("back");
      } else {
        console.log(meetings);
        if (
          meetings.some((meeting) => meeting.author.id.equals(req.user._id))
        ) {
          next();
        } else {
          res.redirect("back");
        }
      }
    });
  } else {
    console.log("You need to be Logged in");
  }
}

module.exports = router;
