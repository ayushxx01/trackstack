# Internship Application CRM API

A full-stack internship/job application tracking system designed to help students and job seekers manage all their applications in one place.

This project is being built as:

### Backend:
Node.js + Express.js + MongoDB

### Frontend (Planned):
React.js dashboard interface

The backend API is currently implemented and functional (base), while the React frontend will be integrated next.

---

# Product Goal

Applying to multiple internships becomes difficult to track over time.

Users often forget:
- where they applied
- application deadlines
- interview progress
- company responses

This system acts as a personal Candidate Relationship Manager (CRM) to solve that.

---

# Core Features

## Authentication System
- User Registration
- User Login
- JWT Authentication
- Protected Routes

## Application Tracking
- Create application records
- Fetch all user applications
- Update applications
- Delete applications
- User-specific application isolation

---

# Tech Stack

## Backend
- Node.js
- Express.js
- MongoDB
- Mongoose
- JWT
- bcrypt
- express-async-handler

## Frontend (Upcoming)
- React.js
- Axios
- React Router
- Dashboard UI Components

---

# Project Structure

```bash
project/
│
├── controllers/
│   ├── userController.js
│   ├── appController.js
│
├── middleware/
│   ├── validateToken.js
│   ├── errorHandler.js
│
├── models/
│   ├── userModel.js
│   ├── appModel.js
│
├── routes/
│   ├── userRoutes.js
│   ├── appRoutes.js
│
├── config/
│   ├── dbConnection.js
│
├── constants/
│   ├── constants.js
│
├── server.js
├── package.json
└── .env
