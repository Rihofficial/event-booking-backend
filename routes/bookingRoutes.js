const express = require("express");
const router = express.Router();
const {
  bookEvent,
  getUserBookings,
    cancelBooking,
  getMyWaitlistBookings,
} = require("../controllers/bookingController");
const { protect } = require("../middleware/AuthMiddleware");
const { bookingLimiter } = require("../middleware/rateLimiters");



// Book an event (logged in user)
router.post("/", protect, bookEvent);

// Get all bookings for logged-in user
router.get("/", protect, getUserBookings);

// Cancel a booking by ID
router.delete("/:id", protect, cancelBooking);

router.post("/book", protect, bookingLimiter, bookEvent);

router.get("/my-waitlist", protect, getMyWaitlistBookings);


module.exports = router;
