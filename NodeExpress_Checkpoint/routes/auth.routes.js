const express = require('express');
const router = express.Router();
const passport = require('../config/passport');
const rateLimit = require('express-rate-limit');
const { signup, login, logout, googleCallback } = require('../controllers/auth.controller');

// limit login attempts to 10 per 15 minutes per IP to prevent brute-force attacks
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { status: 'fail', message: 'Too many login attempts. Try again later.' },
});

router.post('/signup', signup);
router.post('/login', loginLimiter, login);
router.get('/logout', logout);

// redirect the user to Google's OAuth consent screen
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));

// Google redirects here after the user grants permission
// Passport verifies the code and calls the strategy callback (findOrCreate user)
// then googleCallback sends the JWT cookie
router.get(
  '/google/callback',
  passport.authenticate('google', { failureRedirect: '/auth/login', session: false }),
  googleCallback
);

module.exports = router;
