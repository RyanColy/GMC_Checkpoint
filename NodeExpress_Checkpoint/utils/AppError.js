// custom error class that extends the built-in Error
// allows us to attach a statusCode and status to any error we throw
class AppError extends Error {
  constructor(message, statusCode) {
    // pass the message to the native Error constructor
    super(message);
    this.statusCode = statusCode;

    // 4xx errors are "fail" (client mistake), 5xx errors are "error" (server problem)
    this.status = `${statusCode}`.startsWith('4') ? 'fail' : 'error';

    // flag to distinguish our own errors from unexpected ones (e.g. bugs, crashes)
    this.isOperational = true;

    // capture the stack trace without including this constructor in it
    Error.captureStackTrace(this, this.constructor);
  }
}

module.exports = AppError;
