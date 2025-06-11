const nodemailer = require("nodemailer");
const fs = require("fs");

const sendTicketEmail = async (user, event, booking, ticketPath) => {
  // Optional: use real SMTP config in production
  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });

  const mailOptions = {
    from: '"Event Booking" <no-reply@eventsystem.com>',
    to: user.email,
    subject: `🎫 Your Ticket for ${event.title}`,
    text: `Hi ${user.name},\n\nThank you for booking ${
      event.title
    }!\n\nAttached is your ticket.\n\nBooking ID: ${booking._id}\nSeats: ${
      booking.seatsBooked
    }\nDate: ${new Date(event.date).toLocaleString()}\n\nEnjoy!`,
    attachments: [
      {
        filename: `ticket-${booking._id}.pdf`,
        path: ticketPath,
      },
    ],
  };

  const info = await transporter.sendMail(mailOptions);
  console.log("Email sent:", info.messageId);
};

module.exports = sendTicketEmail;
