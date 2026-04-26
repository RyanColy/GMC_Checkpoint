# Secure Task Manager API

A REST API built with Node.js and Express.js that allows users to authenticate and manage their personal tasks securely.

---

## Design Process

### 1. Project Structure

The project follows a layered architecture to separate concerns clearly:

```
├── app.js                  → Express app setup, middlewares, routes
├── server.js               → Entry point, starts the server
├── .env                    → Environment variables (never commit this)
├── models/
│   ├── User.js             → In-memory user store with password hashing
│   └── Task.js             → In-memory task store
├── controllers/
│   ├── auth.controller.js  → Signup, login, logout, Google OAuth callback
│   └── task.controller.js  → Create, read, delete tasks
├── routes/
│   ├── auth.routes.js      → Auth routes + rate limiting
│   └── task.routes.js      → Task routes (all protected)
├── middleware/
│   ├── verifyToken.js      → JWT authentication guard
│   └── errorHandler.js     → Centralized error handling
├── utils/
│   ├── AppError.js         → Custom error class
│   └── catchAsync.js       → Async error wrapper
└── config/
    └── passport.js         → Google OAuth strategy
```

---

### 2. Authentication Flow

**JWT (Email/Password)**

1. User signs up → password is hashed with bcrypt → JWT is created and sent as an HTTP-only cookie
2. User logs in → credentials are verified → new JWT sent as cookie
3. On protected routes → `verifyToken` middleware reads the cookie, verifies the JWT, and attaches `req.user`

**Google OAuth**

1. User visits `/auth/google` → redirected to Google consent screen
2. Google redirects back to `/auth/google/callback`
3. Passport verifies the response → finds or creates the user in memory → JWT sent as cookie

> JWT is stored in an **HTTP-only cookie** so it is never accessible from JavaScript, protecting against XSS attacks.

---

### 3. Security Layers

| Layer | Package | Purpose |
|---|---|---|
| Secure headers | `helmet` | Sets HTTP headers like X-Frame-Options, CSP |
| NoSQL injection | `express-mongo-sanitize` | Strips `$` and `.` from input |
| XSS | `xss-clean` | Strips HTML tags and script injections |
| Brute force | `express-rate-limit` | Max 10 login attempts per 15 minutes |
| Password storage | `bcryptjs` | Passwords are hashed with cost factor 12 |
| Token storage | HTTP-only cookie | JWT never exposed to browser JavaScript |

---

### 4. Error Handling

- `AppError` — custom class that attaches a `statusCode` and `status` to any error
- `catchAsync` — wraps every async controller so rejected promises are forwarded to the error handler automatically
- `errorHandler` — centralized middleware registered last in `app.js`, handles JWT errors and formats all error responses consistently

---

### 5. Data Storage

This API uses **in-memory storage** (plain JavaScript arrays) instead of a database. Data is stored in `models/User.js` and `models/Task.js` using arrays that live in Node.js module cache.

> Data is lost when the server restarts — this is expected for a development/demo environment.

---

## Installation

```bash
# Clone the repo and install dependencies
npm install

# Create your .env file
cp .env.example .env
# Fill in JWT_SECRET and Google OAuth credentials
```

---

## Environment Variables

Create a `.env` file at the root with the following variables:

```env
PORT=5000
JWT_SECRET=your_secret_key
JWT_EXPIRES_IN=7d
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
GOOGLE_CALLBACK_URL=http://localhost:5000/auth/google/callback
```

> Get your Google credentials at [console.cloud.google.com](https://console.cloud.google.com) → APIs & Services → Credentials → OAuth 2.0 Client ID

---

## Running the Server

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

---

## API Endpoints

### Auth

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/auth/signup` | No | Create a new account |
| POST | `/auth/login` | No | Login (rate limited: 10 req/15min) |
| GET | `/auth/logout` | No | Logout (clears cookie) |
| GET | `/auth/google` | No | Start Google OAuth flow |
| GET | `/auth/google/callback` | No | Google OAuth callback |

### Tasks (all require login)

| Method | Route | Auth | Description |
|---|---|---|---|
| POST | `/tasks` | Yes | Create a task |
| GET | `/tasks` | Yes | Get your tasks |
| DELETE | `/tasks/:id` | Yes | Delete your task |

---

## How to Test

### Option 1 — Thunder Client (VS Code extension)

1. Install **Thunder Client** from the VS Code extension marketplace
2. Start the server: `npm run dev`
3. Open Thunder Client and follow the request sequence below

### Option 2 — Postman

1. Download and open [Postman](https://www.postman.com)
2. Make sure cookies are enabled (they are by default)
3. Follow the request sequence below

---

### Test Sequence

**Step 1 — Signup**
```
POST http://localhost:5000/auth/signup
Content-Type: application/json

{
  "name": "Ryan",
  "email": "ryan@test.com",
  "password": "123456"
}
```
Expected: `201 Created` — JWT cookie is set automatically

---

**Step 2 — Login**
```
POST http://localhost:5000/auth/login
Content-Type: application/json

{
  "email": "ryan@test.com",
  "password": "123456"
}
```
Expected: `200 OK` — JWT cookie refreshed

---

**Step 3 — Create a task**
```
POST http://localhost:5000/tasks
Content-Type: application/json

{
  "title": "Buy groceries",
  "description": "Milk, eggs, bread"
}
```
Expected: `201 Created`

---

**Step 4 — Get tasks**
```
GET http://localhost:5000/tasks
```
Expected: `200 OK` — returns only your tasks

---

**Step 5 — Delete a task**
```
DELETE http://localhost:5000/tasks/<task_id>
```
Expected: `204 No Content`

---

**Step 6 — Logout**
```
GET http://localhost:5000/logout
```
Expected: `200 OK` — cookie is cleared

---

**Step 7 — Try accessing tasks after logout**
```
GET http://localhost:5000/tasks
```
Expected: `401 Not authenticated`

---

### Error Cases to Test

| Scenario | Expected |
|---|---|
| Signup with missing fields | `400 Please provide name, email and password` |
| Signup with duplicate email | `400 Email already in use` |
| Login with wrong password | `401 Invalid email or password` |
| Access `/tasks` without cookie | `401 Not authenticated` |
| Delete another user's task | `403 You are not allowed to delete this task` |
| Login 10+ times in 15 min | `429 Too many login attempts` |

---

### Google OAuth Test

Google OAuth must be tested in a **browser** (not Postman), as it requires a redirect to Google's login page.

1. Make sure your `.env` has valid Google credentials
2. Start the server: `npm run dev`
3. Open your browser and go to:
```
http://localhost:5000/auth/google
```
4. Complete the Google login flow
5. You will receive a JWT cookie and a success response
