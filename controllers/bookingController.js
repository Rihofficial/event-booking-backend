const Booking = require("../models/Booking");
const Event = require("../models/Event");
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User'); 
const generateTicket = require("../utils/generateTicket");
const sendTicketEmail = require('../utils/sendTicketEmail');
const path = require("path");
const fs = require("fs");


// Book seats for an event
const bookEvent = async (req, res) => {
  try {
    const userId = req.user._id;
    const { eventId, seats } = req.body;

    // Prevent double bookings
    const existingBooking = await Booking.findOne({
      user: userId,
      event: eventId,
    });
    if (existingBooking) {
      return res.status(400).json({ message: "You already booked this event" });
    }

    if (!eventId || !seats || seats < 1) {
      return res
        .status(400)
        .json({ message: "Event ID and valid seats are required" });
    }

    const event = await Event.findById(eventId);
    if (!event) return res.status(404).json({ message: "Event not found" });

    // 2. Prevent booking past events
    if (new Date(event.date) < new Date()) {
      return res.status(400).json({ message: "Cannot book a past event" });
    }

    if (event.availableSeats < seats) {
      // Not enough seats, add to waitlist
      event.waitlist.push({ user: userId, seatsRequested: seats });
      await event.save();

      return res.status(202).json({
        message: "Event is full. You have been added to the waitlist.",
      });
    }

    // Get user email
    const user = await User.findById(userId);

    // Send booking confirmation email
    await sendEmail(
      user.email,
      "Booking Confirmation",
      `
    <h2>Thank you for your booking!</h2>
    <p>You have booked <strong>${seats}</strong> seat(s) for the event: <strong>${
        event.title
      }</strong>.</p>
    <p>Date: ${new Date(event.date).toLocaleString()}</p>
    <p>Location: ${event.location}</p>
  `
    );

    // Create booking
    const booking = await Booking.create({
      user: userId,
      event: eventId,
      seatsBooked: seats,
    });

    // Decrease available seats
    event.availableSeats -= seats;
    await event.save();

    const ticketPath = path.join(
      __dirname,
      `../tickets/ticket-${booking._id}.pdf`
    );
    await generateTicket({
      user: req.user,
      event,
      booking,
      path: ticketPath,
    });

    // ✅ Send ticket email
      await sendTicketEmail(req.user, event, booking, ticketPath);
      res.status(201).json({
        message: "Booking successful. Ticket emailed.",
        booking,
        ticketUrl: `/tickets/ticket-${booking._id}.pdf`,
      });

    res.status(201).json({
      message: "Booking successful",
      booking,
      ticketUrl: `/tickets/ticket-${booking._id}.pdf`,
    });

    res.status(201).json(booking);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Get bookings for logged-in user
const getUserBookings = async (req, res) => {
  try {
    const bookings = await Booking.find({ user: req.user._id })
      .populate("event", "title date location")
      .sort({ createdAt: -1 });

    res.json(bookings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// Cancel a booking by ID
const cancelBooking = async (req, res) => {
  try {
    const booking = await Booking.findById(req.params.id);
    if (!booking) return res.status(404).json({ message: "Booking not found" });

    // Only user who booked can cancel
    if (booking.user.toString() !== req.user._id.toString()) {
      return res
        .status(403)
        .json({ message: "Not authorized to cancel this booking" });
    }

    // Restore seats to event
    const event = await Event.findById(booking.event);
    if (event) {
      event.availableSeats += booking.seatsBooked;
      await event.save();
    }

    // Delete booking
      await booking.deleteOne();
      
    // Free up seats
    event.availableSeats += booking.seatsBooked;
    await booking.remove();

    // Try to promote waitlist users
    let promotedUsers = [];

    for (let i = 0; i < event.waitlist.length; i++) {
      const entry = event.waitlist[i];

      if (event.availableSeats >= entry.seatsRequested) {
        // Promote from waitlist
        // const newBooking = new Booking({
        //   user: entry.user,
        //   event: event._id,
        //   seatsBooked: entry.seatsRequested,
        // });

        // await newBooking.save();
        // event.availableSeats -= entry.seatsRequested;
          // promotedUsers.push(entry.user);
          

        //  Promote from waitlist
        const nextInLine = await Booking.findOne({
          event: event._id,
          status: "waitlisted",
        }).sort({ createdAt: 1 }); 

        if (nextInLine) {
          nextInLine.status = "booked";
          await nextInLine.save();

          event.availableSeats -= nextInLine.seatsBooked;
          await event.save();

          const user = await User.findById(nextInLine.user);
          const ticketPath = path.join(
            __dirname,
            `../tickets/ticket-${nextInLine._id}.pdf`
          );
          await generateTicket({
            user,
            event,
            booking: nextInLine,
            path: ticketPath,
          });
          await sendTicketEmail(user, event, nextInLine, ticketPath);
        }

        // Remove from waitlist
        event.waitlist.splice(i, 1);
        i--; // adjust index after removal
      }
    }

      await event.save();
      

    res.json({ message: "Booking cancelled" });
  } catch (err) {
    res.status(500).json({ message: err.message });
    }
    
    
};

const getMyWaitlistBookings = async (req, res) => {
  const bookings = await Booking.find({
    user: req.user._id,
    status: "waitlisted",
  }).populate("event");

  res.json(bookings);
};
  




module.exports = {
    bookEvent,
    getUserBookings,
    cancelBooking,
    getMyWaitlistBookings,
}