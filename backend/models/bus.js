const mongoose = require("mongoose");

const busSchema = new mongoose.Schema({
  company: {
    type: String,
    required: true
  },
  plateNumber: {
    type: String,
    required: true,
    unique: true
  },
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  departureTime: {
    type: Date,
    required: true
  },
  totalSeats: {
    type: Number,
    required: true
  },
  availableSeats: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ["on time", "delayed", "departed"],
    default: "on time"
  }
}, { timestamps: true });

module.exports = mongoose.model("Bus", busSchema);