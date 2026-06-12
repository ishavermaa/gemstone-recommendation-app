import User from '../models/User.js';
import Recommendation from '../models/Recommendation.js';
import Gemstone from '../models/Gemstone.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get user analytics
export const getUserAnalytics = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();

  // New users this month
  const startOfMonth = new Date(new Date().getFullYear(), new Date().getMonth(), 1);
  const newUsersThisMonth = await User.countDocuments({
    createdAt: { $gte: startOfMonth },
  });

  // Active users (with recommendations or favorites in last 7 days)
  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
  const activeUsers = await Recommendation.distinct('userId', {
    createdAt: { $gte: sevenDaysAgo },
  });

  res.json({
    totalUsers,
    newUsersThisMonth,
    activeUsers: activeUsers.length,
  });
});

// Get recommendation analytics
export const getRecommendationAnalytics = asyncHandler(async (req, res) => {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  const lastWeek = new Date(today);
  lastWeek.setDate(lastWeek.getDate() - 7);

  const lastMonth = new Date(today);
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  // Daily recommendations
  const dailyRecommendations = await Recommendation.countDocuments({
    createdAt: { $gte: today },
  });

  // Weekly recommendations
  const weeklyRecommendations = await Recommendation.countDocuments({
    createdAt: { $gte: lastWeek },
  });

  // Monthly recommendations
  const monthlyRecommendations = await Recommendation.countDocuments({
    createdAt: { $gte: lastMonth },
  });

  // Recommendations by day for chart
  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const nextDate = new Date(date);
    nextDate.setDate(nextDate.getDate() + 1);

    const count = await Recommendation.countDocuments({
      createdAt: { $gte: date, $lt: nextDate },
    });

    dailyTrend.push({
      date: date.toISOString().split('T')[0],
      count,
    });
  }

  res.json({
    dailyRecommendations,
    weeklyRecommendations,
    monthlyRecommendations,
    dailyTrend,
  });
});

// Get gemstone analytics
export const getGemstoneAnalytics = asyncHandler(async (req, res) => {
  // Most recommended gemstones
  const mostRecommended = await Recommendation.aggregate([
    {
      $group: {
        _id: '$gemstoneId',
        count: { $sum: 1 },
      },
    },
    { $sort: { count: -1 } },
    { $limit: 5 },
    {
      $lookup: {
        from: 'gemstones',
        localField: '_id',
        foreignField: '_id',
        as: 'gemstone',
      },
    },
  ]);

  // Highest rated gemstones
  const highestRated = await Gemstone.find()
    .sort('-averageRating')
    .limit(5)
    .select('name averageRating totalReviews');

  res.json({
    mostRecommended: mostRecommended.map((item) => ({
      gemstone: item.gemstone[0],
      recommendationCount: item.count,
    })),
    highestRated,
  });
});

// Get overall dashboard stats
export const getDashboardStats = asyncHandler(async (req, res) => {
  const totalUsers = await User.countDocuments();
  const totalRecommendations = await Recommendation.countDocuments();
  const totalGemstones = await Gemstone.countDocuments();
  const adminCount = await User.countDocuments({ role: 'admin' });

  res.json({
    totalUsers,
    totalRecommendations,
    totalGemstones,
    adminCount,
  });
});
