const Ticket = require("../models/Ticket");
const Bus = require("../models/bus");

// 🎫 Book Ticket
exports.bookTicket = async (req, res) => {
  try {
    const { busId, seatNumber } = req.body;
    const userId = req.user.id;

    const bus = await Bus.findById(busId);
    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    if (seatNumber < 1 || seatNumber > bus.totalSeats) {
      return res.status(400).json({ message: "Invalid seat number" });
    }

    const existingSeat = await Ticket.findOne({ busId, seatNumber });
    if (existingSeat) {
      return res.status(400).json({ message: "Seat already booked" });
    }

    if (bus.availableSeats <= 0) {
      return res.status(400).json({ message: "No seats available" });
    }

    const ticket = await Ticket.create({
      userId,
      busId,
      seatNumber
    });

    bus.availableSeats -= 1;
    await bus.save();

    res.status(201).json({
      message: "Booking successful",
      ticket
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get all tickets (ADMIN)
exports.getTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find()
      .populate("userId", "name email")
      .populate("busId", "company from to departureTime");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 👤 Get tickets for one user
exports.getUserTickets = async (req, res) => {
  try {
    const tickets = await Ticket.find({ userId: req.params.userId })
      .populate("busId");

    res.json(tickets);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};