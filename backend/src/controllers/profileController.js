import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import Favorite from '../models/Favorite.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import bcrypt from 'bcryptjs';

// Get user profile
export const getUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Get stats
  const totalRecommendations = await Recommendation.countDocuments({ userId });
  const totalFavorites = await Favorite.countDocuments({ userId });

  const profile = {
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
    profileImage: user.profileImage,
    totalRecommendations,
    totalFavorites,
    createdAt: user.createdAt,
  };

  res.json(profile);
});

// Update user profile
export const updateUserProfile = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { name, age, dateOfBirth, email, profileImage } = req.body;

  const user = await User.findById(userId);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Check email uniqueness
  if (email && email !== user.email) {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already in use' });
    }
    user.email = email;
  }

  if (name) user.name = name;
  if (age) user.age = age;
  if (dateOfBirth) user.dateOfBirth = dateOfBirth;
  if (profileImage) user.profileImage = profileImage;

  await user.save();

  const profile = {
    id: user._id,
    name: user.name,
    email: user.email,
    age: user.age,
    dateOfBirth: user.dateOfBirth,
    role: user.role,
    profileImage: user.profileImage,
    createdAt: user.createdAt,
  };

  res.json(profile);
});

// Change password
export const changePassword = asyncHandler(async (req, res) => {
  const userId = req.user.id;
  const { currentPassword, newPassword, confirmPassword } = req.body;

  // Validation
  if (!currentPassword || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  const user = await User.findById(userId).select('+password');
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  // Verify current password
  const isPasswordValid = await user.matchPassword(currentPassword);
  if (!isPasswordValid) {
    return res.status(401).json({ message: 'Current password is incorrect' });
  }

  // Update password
  user.password = newPassword;
  await user.save();

  res.json({ message: 'Password changed successfully' });
});
