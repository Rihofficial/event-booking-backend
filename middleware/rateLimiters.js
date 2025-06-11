const rateLimit = require("express-rate-limit");

//  Limit bookings: max 5 per minute
const bookingLimiter = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 5,
  message: "Too many bookings from this user, please try again later.",
});

//  Limit login: max 10 per 10 mins per IP
const loginLimiter = rateLimit({
  windowMs: 10 * 60 * 1000, // 10 minutes
  max: 10,
  message: "Too many login attempts, please try again in 10 minutes.",
});

module.exports = {bookingLimiter, loginLimiter};
