const Event = require("../models/Event");

// Create event (admin)
const createEvent = async (req, res) => {
  try {
    const { title, description, date, location, totalSeats } = req.body;

    const event = await Event.create({
      title,
      description,
      date,
      location,
      totalSeats,
      availableSeats: totalSeats,
    });

    res.status(201).json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get all events
// const getEvents = async (req, res) => {
//   try {
//     const events = await Event.find().sort({ date: 1 });
//     res.json(events);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// };
const getEvents = async (req, res) => {
  try {
    const { title, location, startDate, endDate } = req.query;
    const filter = {};

    if (title) {
      filter.title = { $regex: title, $options: "i" }; // case-insensitive search
    }

    if (location) {
      filter.location = { $regex: location, $options: "i" };
    }

    if (startDate || endDate) {
      filter.date = {};
      if (startDate) filter.date.$gte = new Date(startDate);
      if (endDate) filter.date.$lte = new Date(endDate);
    }

    const events = await Event.find(filter).sort({ date: 1 });
    res.json(events);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
  

// Get single event
const getEventById = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });
    res.json(event);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Update event (admin)
const updateEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    const { title, description, date, location, totalSeats } = req.body;

    event.title = title || event.title;
    event.description = description || event.description;
    event.date = date || event.date;
    event.location = location || event.location;

    if (totalSeats) {
      // Adjust availableSeats based on new total
      const diff = totalSeats - event.totalSeats;
      event.availableSeats += diff;
      event.totalSeats = totalSeats;
    }

    const updated = await event.save();
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Delete event (admin)
const deleteEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ message: "Event not found" });

    await event.deleteOne();
    res.json({ message: "Event deleted" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



module.exports = {
  createEvent,
  getEvents,
  getEventById,
  updateEvent,
    deleteEvent,
  
};