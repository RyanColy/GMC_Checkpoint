const express = require('express');
const helmet = require('helmet');
const mongoSanitize = require('express-mongo-sanitize');
const xss = require('xss-clean');
const cookieParser = require('cookie-parser');
const passport = require('./config/passport');

const app = express();

// helmet sets secure HTTP headers (e.g. X-Frame-Options, Content-Security-Policy)
app.use(helmet());

// parse incoming JSON request bodies
app.use(express.json());

// parse cookies so we can read the JWT from req.cookies.jwt
app.use(cookieParser());

// remove any MongoDB operators ($ or .) from req.body, req.params, req.query to prevent injection attacks
// must run after express.json() so the body is already parsed
app.use(mongoSanitize());

// sanitize user input against XSS attacks (strips HTML tags and script injections)
// must run after express.json() for the same reason
app.use(xss());

// initialize Passport without persistent sessions (we use JWT cookies instead)
app.use(passport.initialize());

// auth routes: /auth/signup, /auth/login, /auth/logout, /auth/google
app.use('/auth', require('./routes/auth.routes'));

// task routes: /tasks (POST, GET, DELETE) — all protected by verifyToken
app.use('/tasks', require('./routes/task.routes'));

// global error handler — must be registered last so it catches errors from all routes
app.use(require('./middleware/errorHandler'));

module.exports = app;
