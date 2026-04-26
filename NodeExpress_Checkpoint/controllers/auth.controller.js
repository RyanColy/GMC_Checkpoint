const jwt = require('jsonwebtoken');
const User = require('../models/User');
const AppError = require('../utils/AppError');
const catchAsync = require('../utils/catchAsync');

// create a signed JWT containing the user's id
const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });

// send the JWT as an HTTP-only cookie so JavaScript cannot access it
// secure: true is only enabled in production to allow testing over HTTP locally
const sendTokenCookie = (res, token) => {
  res.cookie('jwt', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
  });
};

// POST /auth/signup — create a new user and send back a JWT cookie
exports.signup = catchAsync(async (req, res, next) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return next(new AppError('Please provide name, email and password.', 400));

  // check if email is already taken
  const existing = await User.findOne({ email });
  if (existing) return next(new AppError('Email already in use.', 400));

  // password is hashed inside User.create
  const user = await User.create({ name, email, password });
  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.status(201).json({
    status: 'success',
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// POST /auth/login — verify credentials and send back a JWT cookie
exports.login = catchAsync(async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password)
    return next(new AppError('Please provide email and password.', 400));

  // findOneWithPassword includes the hashed password and a comparePassword method
  const user = await User.findOneWithPassword({ email });
  if (!user || !(await user.comparePassword(password)))
    return next(new AppError('Invalid email or password.', 401));

  const token = signToken(user._id);
  sendTokenCookie(res, token);

  res.status(200).json({
    status: 'success',
    user: { id: user._id, name: user.name, email: user.email },
  });
});

// GET /auth/logout — overwrite the cookie with an expired one to log the user out
exports.logout = (req, res) => {
  res.cookie('jwt', '', { httpOnly: true, expires: new Date(0) });
  res.status(200).json({ status: 'success', message: 'Logged out' });
};

// GET /auth/google/callback — called by Passport after Google verifies the user
// req.user is already set by the Passport strategy at this point
exports.googleCallback = catchAsync(async (req, res, next) => {
  const token = signToken(req.user._id);
  sendTokenCookie(res, token);
  res.status(200).json({
    status: 'success',
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
});
