const PDFDocument = require("pdfkit");
const QRCode = require("qrcode");
const fs = require("fs");

const generateTicket = async ({ user, event, booking, path }) => {
  return new Promise(async (resolve, reject) => {
    try {
      const doc = new PDFDocument();
      const stream = fs.createWriteStream(path);
      doc.pipe(stream);

      // Title
      doc.fontSize(24).text("🎟 Event Ticket", { align: "center" });
      doc.moveDown();

      // User info
      doc.fontSize(14).text(`👤 Name: ${user.name}`);
      doc.text(`📧 Email: ${user.email}`);
      doc.moveDown();

      // Event info
      doc.text(`📅 Event: ${event.title}`);
      doc.text(`🕒 Date: ${new Date(event.date).toLocaleString()}`);
      doc.text(`🎫 Seats: ${booking.seatsBooked}`);
      doc.text(`🔖 Booking ID: ${booking._id}`);
      doc.moveDown();

      // QR Code
      const qrData = `Booking ID: ${booking._id}\nUser: ${user.email}`;
      const qrImage = await QRCode.toDataURL(qrData);
      const qrBase64 = qrImage.split(",")[1];
      doc.image(Buffer.from(qrBase64, "base64"), { width: 120 });

      doc.end();

      stream.on("finish", () => {
        resolve();
      });
    } catch (err) {
      reject(err);
    }
  });
};

module.exports = generateTicket;
