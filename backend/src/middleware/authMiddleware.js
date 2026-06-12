import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const protect = asyncHandler(async (req, _res, next) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;

  if (!token) {
    const error = new Error('Authentication token required');
    error.statusCode = 401;
    throw error;
  }

  const decoded = jwt.verify(token, process.env.JWT_SECRET);
  const user = await User.findById(decoded.id).select('-password');

  if (!user) {
    const error = new Error('User no longer exists');
    error.statusCode = 401;
    throw error;
  }

  req.user = user;
  next();
});

// Alias for protect
export const authenticate = protect;

export const authorize = (...roles) => (req, _res, next) => {
  if (!roles.includes(req.user.role)) {
    const error = new Error('Insufficient permissions');
    error.statusCode = 403;
    return next(error);
  }

  next();
};
