const errorHandler = (err, req, res, next) => {
  const status = err.status || 500;
  const message = err.message || "Internal server error";

  console.error(`[ERROR] ${status} — ${message}`, err.stack);

  res.status(status).json({ message });
};

module.exports = errorHandler;
