const express = require("express");
const router = express.Router();

const {
  createBus,
  getBuses,
  getBusById,
  updateBus,
  deleteBus
} = require("../controllers/busController");
const { protect, admin } = require("../middleware/auth");
// Routes
router.post("/", protect, admin, createBus);      // Add bus
router.get("/", getBuses);         // Get all buses
router.get("/:id", getBusById);    // Get one bus
router.put("/:id", protect, admin, updateBus);     // Update bus
router.delete("/:id", protect, admin, deleteBus);  // Delete bus





module.exports = router;