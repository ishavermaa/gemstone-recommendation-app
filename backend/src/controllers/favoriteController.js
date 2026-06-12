import Favorite from '../models/Favorite.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const addFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndUpdate(
    { userId: req.user._id, gemstoneId: req.body.gemstoneId },
    { userId: req.user._id, gemstoneId: req.body.gemstoneId },
    { new: true, upsert: true, runValidators: true }
  ).populate('gemstoneId');

  res.status(201).json({ favorite });
});

export const getFavorites = asyncHandler(async (req, res) => {
  const favorites = await Favorite.find({ userId: req.user._id }).populate('gemstoneId').sort({ createdAt: -1 });
  res.json({ favorites });
});

export const removeFavorite = asyncHandler(async (req, res) => {
  const favorite = await Favorite.findOneAndDelete({ _id: req.params.id, userId: req.user._id });
  if (!favorite) {
    const error = new Error('Favorite not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: 'Favorite removed' });
});
