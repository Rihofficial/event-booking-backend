# 🎟️ Event Booking System (Node.js + Express)

A fully featured backend system for managing events, bookings, seat reservations, waitlists, and PDF ticket generation with email delivery.

---

## 🚀 Features

✅ User authentication (JWT)  
✅ Admin panel for event management  
✅ Event creation, update, deletion  
✅ Booking with seat count  
✅ Auto-generated PDF ticket  
✅ Email ticket to user using Nodemailer  
✅ Waitlist system with auto-promotion  
✅ RESTful API with role-based access  
✅ MongoDB (Mongoose) database  
✅ Clean error handling and middleware

---

## 🏗️ Tech Stack

- Node.js / Express.js
- MongoDB / Mongoose
- Nodemailer (with Ethereal for testing)
- PDFKit (for ticket generation)
- JWT for authentication
- Deployed via Render or Railway

---

## 📁 Project Structure
┣ 📂controllers
┣ 📂models
┣ 📂routes
┣ 📂utils
┣ 📂tickets
┣ 📄.env
┣ 📄.gitignore
┣ 📄server.js
┗ 📄README.md


---

## 🔐 Environment Variables (`.env`)

```env
PORT=5000
MONGO_URI=your_mongo_connection
JWT_SECRET=your_jwt_secret

ETHEREAL_USER=generated_ethereal_user
ETHEREAL_PASS=generated_ethereal_pass


✍️ API Endpoints
👤 Auth
POST /api/users/register

POST /api/users/login

GET /api/users/profile

🛠️ Admin
POST /api/admin/events — Create event

PUT /api/admin/events/:id — Update event

DELETE /api/admin/events/:id — Delete event

GET /api/admin/event/:eventId/waitlist — View waitlist

🎟️ Bookings
POST /api/bookings — Book or waitlist

GET /api/bookings/my — My bookings

GET /api/bookings/my-waitlist — My waitlist

DELETE /api/bookings/:id — Cancel booking

📧 Email + Tickets
PDF tickets generated with PDFKit

Tickets emailed via Nodemailer (Ethereal for dev)

Static tickets are served via /tickets
