// wraps an async controller function and forwards any rejected promise to Express error handler
// this avoids writing try/catch in every single controller
const catchAsync = (fn) => (req, res, next) => {
  fn(req, res, next).catch(next);
};

module.exports = catchAsync;
