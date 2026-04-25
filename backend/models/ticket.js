const mongoose = require("mongoose");

const ticketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  busId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Bus",
    required: true
  },
  seatNumber: {
    type: Number,
    required: true
  },
  bookingTime: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model("Ticket", ticketSchema);