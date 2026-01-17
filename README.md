📌 Event Booking System — Backend

Node.js | Express.js | MongoDB | JWT | PDF Tickets | Email Notifications

A full-featured backend system for managing events, bookings, seat reservations, waitlists, secure authentication, and PDF ticket delivery via email — built with scalability and real-world workflows in mind.

🧠 Overview

This project implements a backend API for an Event Booking System, designed to handle:

✔ Secure user authentication and role-based access
✔ Admin event management (create/update/delete)
✔ Bookings with seat capacity control
✔ Waitlist logic with auto-promotion
✔ PDF ticket generation
✔ Email delivery of tickets
✔ Structured RESTful API design

It’s intended for use with a frontend app (e.g., React) consuming the APIs and a MongoDB database storing application data.

🚀 Features
🔐 Authentication & Authorization

JWT-based auth with access tokens

Password hashing

Protected routes with role-based access control

🎟 Booking Workflows

User can book seats for events

Automatically joins waitlist when event is full

Cancel bookings and free seats

Users can view their bookings and waitlist

✉ Email + PDF Tickets

PDF ticket generation using PDFKit

Automated email sending via Nodemailer (Ethereal or real SMTP)

Tickets available via unique URLs

🗃 API Endpoints

Organized RESTful structure (see API Docs below)

🧩 Tech Stack
Layer	Technology
Server	Node.js, Express.js
Database	MongoDB (Mongoose ODM)
Authentication	JWT
Emails	Nodemailer
PDF Generation	PDFKit
Deployment	Render / Railway or any Node server
Testing	Postman / Insomnia
📁 Project Structure
event-booking-backend/
├ controllers/
├ middleware/
├ models/
├ routes/
├ utils/
├ tickets/
├ .env
├ server.js
└ README.md

🔧 Getting Started (Local Setup)
Prerequisites

✔ Install Node.js & npm
✔ MongoDB connection URI

Installation

Clone the repo

git clone https://github.com/Rihofficial/event-booking-backend.git
cd event-booking-backend


Install dependencies

npm install


Create .env file
Add environment variables:

PORT=5000
MONGO_URI=<your_mongo_connection_string>
JWT_SECRET=<your_jwt_secret>
ETHEREAL_USER=<ethereal_username>
ETHEREAL_PASS=<ethereal_password>


Run the server

npm start

📜 API Documentation

Here are the key endpoints organized by group:

🛠 Authentication
Method	Path	Description
POST	/api/users/register	Register new user
POST	/api/users/login	Login & receive JWT
GET	/api/users/profile	Get logged-in user profile
🔐 Admin — Event Management
Method	Path	Description
POST	/api/admin/events	Create event
PUT	/api/admin/events/:id	Update event
DELETE	/api/admin/events/:id	Delete event
GET	/api/admin/event/:eventId/waitlist	Get event waitlist
📆 Bookings
Method	Path	Description
POST	/api/bookings	Book a seat / join waitlist
GET	/api/bookings/my	Get user bookings
GET	/api/bookings/my-waitlist	Get user waitlist
DELETE	/api/bookings/:id	Cancel a booking
📩 Email Tickets

✔ Tickets are generated and served via static links
✔ Emails are sent on booking confirmation

🧪 How It Works (High-Level Architecture)

Authentication

Users register and login

JWT tokens control access

Admin routes protected based on role

Booking Logic

When booking, check seat availability

If full, add to waitlist

On cancellation, auto-promote waitlist entry

PDF & Email

On success, generate ticket PDF

Email ticket to user using Nodemailer

This reflects common patterns in backend systems: authentication guards, role checks, business logic decoupled from routing, and email + file system integration.

🧠 What You’ll Learn

✔ Designing RESTful backend APIs
✔ Implementing secure authentication flows
✔ Managing business logic (booking, waitlists)
✔ Integrating email delivery & document generation
✔ Structuring a scalable Node.js project

⭐ Why This Project Matters

This is not a simple CRUD app — it demonstrates real backend responsibilities:

✔ Auth, roles, and security
✔ Complex workflows (waitlist, seat allocation)
✔ Integrated email and third-party logic
✔ Modern API structure that production teams care about

📌 Next Improvements

✔ Add automated tests (unit/integration)
✔ Use role permissions stored in DB
✔ Enhance email delivery with providers (SendGrid, SES)
✔ Add Swagger for API documentation

