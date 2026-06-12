import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import { signToken } from '../utils/token.js';

const publicUser = (user) => ({
  id: user._id,
  name: user.name,
  email: user.email,
  role: user.role,
  age: user.age,
  dateOfBirth: user.dateOfBirth,
  profileImage: user.profileImage,
  createdAt: user.createdAt
});

export const register = asyncHandler(async (req, res) => {
  const { name, email, password, confirmPassword, age, dateOfBirth, role } = req.body;

  // Validation
  if (!name || !email || !password || !confirmPassword) {
    const error = new Error('All fields are required');
    error.statusCode = 400;
    throw error;
  }

  if (password !== confirmPassword) {
    const error = new Error('Passwords do not match');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  const exists = await User.findOne({ email });
  if (exists) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.create({
    name,
    email,
    password,
    age,
    dateOfBirth,
    role: role || 'user', // Default to 'user' if not specified
    profileImage: null,
  });

  res.status(201).json({ user: publicUser(user), token: signToken(user) });
});

export const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email }).select('+password');

  if (!user || !(await user.matchPassword(password))) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  res.json({ user: publicUser(user), token: signToken(user) });
});

export const profile = asyncHandler(async (req, res) => {
  res.json({ user: publicUser(req.user) });
});

export const updateProfile = asyncHandler(async (req, res) => {
  const { name, email } = req.body;
  const nextEmail = String(email || '').toLowerCase().trim();

  const existing = await User.findOne({ email: nextEmail, _id: { $ne: req.user._id } });
  if (existing) {
    const error = new Error('Email is already registered');
    error.statusCode = 409;
    throw error;
  }

  const user = await User.findById(req.user._id);
  user.name = name;
  user.email = nextEmail;
  await user.save();

  res.json({ user: publicUser(user) });
});
