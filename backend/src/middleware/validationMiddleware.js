export const requireFields = (...fields) => (req, _res, next) => {
  const missing = fields.filter((field) => {
    const value = req.body[field];
    return value === undefined || value === null || value === '';
  });

  if (missing.length) {
    const error = new Error(`Missing required fields: ${missing.join(', ')}`);
    error.statusCode = 400;
    return next(error);
  }

  next();
};
