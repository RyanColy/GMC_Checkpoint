const jwt = require('jsonwebtoken');
const AppError = require('../utils/AppError');
const User = require('../models/User');
const catchAsync = require('../utils/catchAsync');

// middleware that protects private routes
// reads the JWT from the HTTP-only cookie, verifies it, and attaches the user to req.user
const verifyToken = catchAsync(async (req, res, next) => {
  const token = req.cookies.jwt;

  // no cookie means the user is not logged in
  if (!token) return next(new AppError('Not authenticated. Please log in.', 401));

  // jwt.verify throws if the token is invalid or expired — caught by catchAsync
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // make sure the user still exists in the database (e.g. account not deleted)
  const user = await User.findById(decoded.id);
  if (!user) return next(new AppError('User no longer exists.', 401));

  // attach user to the request so controllers can use it
  req.user = user;
  next();
});

module.exports = verifyToken;
