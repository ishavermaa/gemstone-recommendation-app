export const notFound = (req, _res, next) => {
  const error = new Error(`Route not found: ${req.originalUrl}`);
  error.statusCode = 404;
  next(error);
};

export const errorHandler = (err, _req, res, _next) => {
  const statusCode = err.statusCode || 500;
  const message = statusCode === 500 ? 'Server error' : err.message;

  res.status(statusCode).json({
    message,
    details: process.env.NODE_ENV === 'production' ? undefined : err.message
  });
};
