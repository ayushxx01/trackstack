# Trackstack — Internship Application CRM API

A backend REST API that helps students and job seekers track and manage internship applications in one place. Built to solve the real problem of losing track of where you applied, what stage you're at, and who you've reached out to.

---

## The Problem

When applying to multiple internships simultaneously, it becomes difficult to track:
- Which companies you applied to
- What stage each application is at
- Upcoming deadlines
- Who you cold emailed and whether they replied

Trackstack solves this with a structured backend API that acts as a personal CRM for job seekers.

---

## Tech Stack

| Technology | Purpose |
|---|---|
| Node.js + Express | Server and routing |
| MongoDB + Mongoose | Primary database |
| Redis | Dashboard stats caching |
| JWT | Stateless authentication |
| Zod | Request validation |
| bcrypt | Password hashing |
| express-rate-limit | Brute force protection |

---

## Architecture Overview

```
Client Request
      ↓
Rate Limiter (auth routes only)
      ↓
JWT Middleware (protected routes)
      ↓
Zod Validation
      ↓
Controller (business logic)
      ↓
Mongoose (schema validation + DB)
      ↓
MongoDB
```

Redis sits as a caching layer specifically for the dashboard aggregation endpoint.

---

## Features

### Authentication
- Register and login with JWT
- Passwords hashed with bcrypt
- Rate limiting on auth routes (10 requests per 15 minutes) to prevent brute force
- Token-based stateless auth — no sessions

### Application Tracking
- Full CRUD on internship applications
- Status workflow enforced via enum validation
- Ownership validation — users can only access their own data
- Bulk delete via `$in` operator

### Application Status Flow
```
Applied → Under Review → OA Scheduled → Interview Scheduled → Offer Received → Accepted
                                      ↘ Rejected
```

### Filtering and Search
- Filter applications by status
- Search applications by company name (case-insensitive regex)
- Paginated results with configurable page size
- Upcoming deadlines with user-defined time window

### Dashboard Analytics
- Total applications count
- Breakdown by status using MongoDB aggregation pipeline
- Breakdown by location
- Results cached in Redis with 5 minute TTL

### Cold Mail Tracker
- Track HR contacts and employees you've cold emailed
- Link contacts to specific applications
- Filter by company or replied status
- Paginated contacts list

---

## API Endpoints

### Auth
```
POST   /api/users/register        Register new user
POST   /api/users/login           Login, returns JWT
GET    /api/users/                Get current user (protected)
```

### Applications
```
POST   /api/applications/                    Create application
GET    /api/applications/                    Get all (filter: ?status= ?companyName= ?page= ?limit=)
GET    /api/applications/upcoming            Upcoming deadlines (?days=7)
GET    /api/applications/:id                 Get single application
PUT    /api/applications/:id                 Update application
PUT    /api/applications/:id/status          Update status only
DELETE /api/applications/bulk               Bulk delete (?ids=[])
DELETE /api/applications/:id                Delete application
```

### Dashboard
```
GET    /api/getStats/stats                   Aggregated dashboard stats (Redis cached)
```

### Cold Mail Contacts
```
POST   /api/coldMails/:applicationId         Add contact to application
GET    /api/coldMails/                       All contacts (filter: ?company= ?replied= ?page= ?limit=)
GET    /api/coldMails/:id                    Single contact
PUT    /api/coldMails/:id                    Update contact
PATCH  /api/coldMails/:id/status             Toggle replied status
DELETE /api/coldMails/:id                    Delete contact
```

---

## Key Design Decisions

### Why MongoDB over SQL
The data is document-oriented — each application is a self-contained object with optional fields like `notes`, `jobLink`, and `location`. No complex joins are needed. MongoDB's flexible schema allowed iteration on the model without migrations.

### JWT Authentication — Stateless
The server generates a signed token on login containing user ID and email. No sessions are stored server-side. Every protected request verifies the token signature. The tradeoff is tokens cannot be invalidated early — mitigated by short expiry times.

### Two Validation Layers
Zod validates at the entry point — rejecting malformed requests before any DB operations run, with specific per-field error messages. Mongoose schema validation acts as a final safety net before the DB write. Both exist independently and serve different purposes.

### Redis Caching — Dashboard Only
The dashboard aggregation pipeline scans and groups all user documents on every request — an expensive operation. The applications list was not cached because it changes after every user action and needs to be real time. Dashboard stats are acceptable with a 5 minute TTL since slight staleness doesn't affect UX.

### Ownership Validation Pattern
Every query that accesses a specific document uses both `_id` and `userId`:
```js
Model.findOne({ _id: req.params.id, userId: req.user.id })
```
This ensures users can never access or modify another user's data even if they know the document ID.

### Route Ordering
Specific routes are always registered before parameter routes:
```js
router.get('/upcoming', upcomingDeadlines)  // registered first
router.get('/:id', getApplication)          // registered after
```
Express matches routes top-to-bottom. Without this order, `upcoming` gets matched as an `:id` param.

---

## Database Indexes

Indexes were added on fields that appear in query conditions or sort operations:

| Field | Reason |
|---|---|
| `userId` | Every query scopes to this |
| `status` | Filter queries |
| `companyName` | Search queries |
| `deadlineDate` | Upcoming deadlines sort |
| `email` (User) | Login lookup — unique |

---

## Folder Structure

```
trackstack/
├── config/
│   ├── dbConnection.js
│   └── redisClient.js
├── constants/
├── controllers/
│   ├── appController.js
│   ├── coldMailController.js
│   ├── dashboardController.js
│   └── userController.js
├── middleware/
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   ├── validate.js
│   └── validateToken.js
├── models/
│   ├── appModel.js
│   ├── coldMailModel.js
│   └── userSchema.js
├── routes/
│   ├── appRoutes.js
│   ├── authRoutes.js
│   ├── dashRoute.js
│   └── mailRoutes.js
├── validators/
│   ├── appValidator.js
│   ├── authValidator.js
│   └── mailValidator.js
├── .env
├── .gitignore
├── package.json
└── server.js
```

---

## Setup

### Prerequisites
- Node.js
- MongoDB Atlas account
- Redis (local: `brew install redis && brew services start redis`)

### Installation

```bash
git clone https://github.com/ayushxx01/trackstack
cd trackstack
npm install
```

### Environment Variables

Create a `.env` file:
```
PORT=2005
MONGO_URI=your_mongodb_connection_string
ACCESS_TOKEN_SECRET=your_jwt_secret
REDIS_URL=redis://localhost:6379
CACHE_TTL=300
```

### Run

```bash
npm start
```

---

## Future Improvements

- Email reminders before deadlines (BullMQ + Nodemailer)
- Bulk delete for cold mail contacts
- Replace regex search with MongoDB Atlas Search for scale
- Frontend dashboard (React + TypeScript)
- Calendar integration for interview scheduling
- Refresh token rotation for better JWT security
- Unit tests for controllers

---

## What I Learned

This project pushed beyond basic CRUD into real backend patterns:

- **Aggregation pipelines** for transforming data into analytics
- **Redis caching** with TTL for expensive repeated operations
- **Schema-level validation** vs entry-point validation and why both matter
- **Dynamic query building** for flexible filtering
- **Route ordering** and how Express matches paths
- **Ownership validation** as a security pattern, not just authentication
- **Index strategy** — only indexing fields that appear in queries
- The difference between `req.params`, `req.query`, and `req.body` and when each applies
