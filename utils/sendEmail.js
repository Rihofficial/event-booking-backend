const nodemailer = require("nodemailer");

const sendEmail = async (to, subject, html) => {
  // Ethereal test account
  const testAccount = await nodemailer.createTestAccount();

  const transporter = nodemailer.createTransport({
    host: "smtp.ethereal.email",
    port: 587,
    auth: {
      user: process.env.ETHEREAL_USER,
      pass: process.env.ETHEREAL_PASS,
    },
  });

  const info = await transporter.sendMail({
    from: `"Event Booking System" <no-reply@eventbooker.com>`,
    to,
    subject,
    html,
  });

  console.log("📬 Message sent: %s", info.messageId);
  console.log("🔗 Preview URL: %s", nodemailer.getTestMessageUrl(info));
};

module.exports = sendEmail;
