const Booking = require("../models/Booking");
const Event = require("../models/Event");
const User = require("../models/User");

const viewEventBookings = async (req, res) => {
  const { eventId } = req.params;

  try {
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: "Event not found" });
    }

    const bookings = await Booking.find({ event: eventId }).populate(
      "user",
      "name email"
    );

    res.json({
      event: event.title,
      totalBookings: bookings.length,
      bookings: bookings.map((b) => ({
        user: b.user.name,
        email: b.user.email,
        seatsBooked: b.seatsBooked,
        bookingDate: b.createdAt,
      })),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};




const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const totalEvents = await Event.countDocuments();
    const totalBookings = await Booking.countDocuments();

    // Most booked event
    const eventStats = await Booking.aggregate([
      { $group: { _id: "$event", total: { $sum: "$seatsBooked" } } },
      { $sort: { total: -1 } },
      { $limit: 1 },
    ]);

    let mostBookedEvent = null;
    if (eventStats.length > 0) {
      mostBookedEvent = await Event.findById(eventStats[0]._id).select("title");
      mostBookedEvent = {
        title: mostBookedEvent.title,
        totalSeatsBooked: eventStats[0].total,
      };
    }

    // Most active users
    const topUsers = await Booking.aggregate([
      {
        $group: {
          _id: "$user",
          totalSeats: { $sum: "$seatsBooked" },
          totalBookings: { $sum: 1 },
        },
      },
      { $sort: { totalBookings: -1 } },
      { $limit: 5 },
    ]);

    const topUserDetails = await Promise.all(
      topUsers.map(async (user) => {
        const userInfo = await User.findById(user._id).select("name email");
        return {
          name: userInfo?.name,
          email: userInfo?.email,
          totalSeats: user.totalSeats,
          totalBookings: user.totalBookings,
        };
      })
    );

    res.json({
      totalUsers,
      totalEvents,
      totalBookings,
      mostBookedEvent,
      topUsers: topUserDetails,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const getEventWaitlist = async (req, res) => {
  const bookings = await Booking.find({
    event: req.params.eventId,
    status: "waitlisted",
  }).populate("user");

  res.json(bookings);
};
  

module.exports = {
  viewEventBookings,
    getDashboardStats,
  getEventWaitlist,
};