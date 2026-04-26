// centralized error-handling middleware
// Express recognizes it as an error handler because it has 4 parameters (err, req, res, next)
const errorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.status = err.status || 'error';

  // JWT was tampered with or malformed
  if (err.name === 'JsonWebTokenError') {
    err.statusCode = 401;
    err.status = 'fail';
    err.message = 'Invalid token';
  }

  // JWT was valid but has expired
  if (err.name === 'TokenExpiredError') {
    err.statusCode = 401;
    err.status = 'fail';
    err.message = 'Token expired, please log in again';
  }

  res.status(err.statusCode).json({
    status: err.status,
    message: err.message,
  });
};

module.exports = errorHandler;
