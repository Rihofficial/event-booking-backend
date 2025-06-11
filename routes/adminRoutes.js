const express = require("express");
const router = express.Router();

// Only for admins
const { viewEventBookings } = require("../controllers/adminController");
const { protect, admin } = require("../middleware/AuthMiddleware");
const { getDashboardStats } = require("../controllers/adminController");
const { getEventWaitlist } = require("../controllers/adminController");


router.get("/events/:eventId/bookings", protect, admin, viewEventBookings);
router.get("/dashboard", protect, admin, getDashboardStats);
router.get("/event/:eventId/waitlist", protect, admin, getEventWaitlist);


module.exports = router;
