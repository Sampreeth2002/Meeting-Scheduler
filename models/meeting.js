var mongoose = require("mongoose");

var meetingSchema = new mongoose.Schema({
  name: String,
  title: String,
  message: String,
  date: Date,
  num: Number,
  email: [{ recipientName: String, emailId: String }],
  created: { type: Date, default: Date.now },
  author: {
    id: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    username: String,
  },
});

module.exports = mongoose.model("schedule", meetingSchema);
