const jwt = require("jsonwebtoken");
const User = require("../models/User");

// Protect routes (user must be logged in)
const protect = async (req, res, next) => {
  let token;

  // Check for Bearer token
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith("Bearer")
  ) {
    try {
      token = req.headers.authorization.split(" ")[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request (excluding password)
      req.user = await User.findById(decoded.id).select("-password");
      return next();
    } catch (err) {
      return res.status(401).json({ message: "Not authorized, token failed" });
    }
  }

  res.status(401).json({ message: "Not authorized, no token" });
};

// Admin-only middleware
const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    return next();
  }
  res.status(403).json({ message: "Access denied, admin only" });
};
  module.exports = { protect, admin };