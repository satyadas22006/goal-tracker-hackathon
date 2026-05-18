const mongoose = require("mongoose");

const goalSchema = new mongoose.Schema({

  title: {
    type: String,
    required: true
  },

  description: {
    type: String
  },

  thrustArea: {
    type: String,
    required: true
  },

  uom: {
    type: String,
    enum: ["numeric", "percentage", "timeline", "zero"],
    required: true
  },

  target: {
    type: Number,
    required: true
  },

  actualAchievement: {
    type: Number,
    default: 0
  },

  weightage: {
    type: Number,
    required: true,
    min: 10
  },

  progress: {
    type: Number,
    default: 0
  },

  checkInStatus: {
    type: String,
    enum: ["not-started", "on-track", "completed"],
    default: "not-started"
  },

  managerComment: {
    type: String,
    default: ""
  },

  status: {
    type: String,
    enum: ["pending", "approved", "completed"],
    default: "pending"
  },

  employeeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User"
  }

}, {
  timestamps: true
});

module.exports = mongoose.model("Goal", goalSchema);