const express = require("express");
const router = express.Router();

const {
  bookTicket,
  getTickets,
  getUserTickets
} = require("../controllers/ticketController");

const { protect } = require("../middleware/auth");
router.post("/", protect, bookTicket);                 // book ticket
router.get("/", getTickets);                  // admin
router.get("/user/:userId", getUserTickets);  // user tickets


module.exports = router;