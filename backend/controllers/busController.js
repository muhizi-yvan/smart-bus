const Bus = require("../models/bus");

// ➕ Create Bus (Admin)
exports.createBus = async (req, res) => {
  try {
    let {
      company,
      plateNumber,
      from,
      to,
      departureTime,
      totalSeats
    } = req.body;

    // ✅ Convert totalSeats to number (IMPORTANT)
    totalSeats = Number(totalSeats);

    // ✅ Basic validation
    if (!company || !from || !to || !departureTime || !totalSeats) {
      return res.status(400).json({
        message: "All fields are required"
      });
    }

    if (totalSeats <= 0) {
      return res.status(400).json({
        message: "Total seats must be greater than 0"
      });
    }

    // ✅ Create bus
    const bus = await Bus.create({
      company,
      plateNumber,
      from,
      to,
      departureTime,
      totalSeats,
      availableSeats: totalSeats
    });

    res.status(201).json({
      message: "Bus created successfully",
      bus
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get All Buses (User)
exports.getBuses = async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📥 Get Single Bus
exports.getBusById = async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);
    if (!bus) return res.status(404).json({ message: "Bus not found" });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ✏️ Update Bus (Admin)
exports.updateBus = async (req, res) => {
  try {
    const bus = await Bus.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ❌ Delete Bus (Admin)
exports.deleteBus = async (req, res) => {
  try {
    await Bus.findByIdAndDelete(req.params.id);
    res.json({ message: "Bus deleted" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};