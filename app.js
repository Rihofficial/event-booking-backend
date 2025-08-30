const express = require("express");
const cors = require("cors");
const app = express();

app.use(cors());
app.use(express.json());

// const authRoutes = require("./routes/AuthRoutes");
const authRoutes = require("./routes/authRoutes");
const eventRoutes = require("./routes/eventRoutes");
const bookingRoutes = require("./routes/bookingRoutes");
const adminRoutes = require("./routes/adminRoutes");
app.use("/api/bookings", bookingRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/tickets", express.static("tickets"));


app.get("/", (req, res) => {
  res.send("Event Booking API is running!!!!");
});

module.exports = app;
