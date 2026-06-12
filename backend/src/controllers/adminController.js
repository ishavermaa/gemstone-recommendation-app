import Favorite from '../models/Favorite.js';
import Gemstone from '../models/Gemstone.js';
import Recommendation from '../models/Recommendation.js';
import User from '../models/User.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const getUsers = asyncHandler(async (_req, res) => {
  const users = await User.find().select('-password').sort({ createdAt: -1 });
  res.json({ users });
});

export const getAnalytics = asyncHandler(async (_req, res) => {
  const [totalUsers, totalRecommendations, totalGemstones, totalFavorites] = await Promise.all([
    User.countDocuments(),
    Recommendation.countDocuments(),
    Gemstone.countDocuments(),
    Favorite.countDocuments()
  ]);

  const mostRecommended = await Recommendation.aggregate([
    { $group: { _id: '$gemstoneId', count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 5 },
    { $lookup: { from: 'gemstones', localField: '_id', foreignField: '_id', as: 'gemstone' } },
    { $unwind: '$gemstone' },
    { $project: { name: '$gemstone.name', count: 1 } }
  ]);

  const goals = await Recommendation.aggregate([
    { $group: { _id: '$goal', value: { $sum: 1 } } },
    { $project: { name: '$_id', value: 1, _id: 0 } }
  ]);

  const monthlyGrowth = await Recommendation.aggregate([
    {
      $group: {
        _id: { year: { $year: '$createdAt' }, month: { $month: '$createdAt' } },
        recommendations: { $sum: 1 }
      }
    },
    { $sort: { '_id.year': 1, '_id.month': 1 } },
    { $project: { month: { $concat: [{ $toString: '$_id.year' }, '-', { $toString: '$_id.month' }] }, recommendations: 1, _id: 0 } }
  ]);

  res.json({
    totals: { totalUsers, totalRecommendations, totalGemstones, totalFavorites },
    mostRecommended,
    goals,
    monthlyGrowth
  });
});
