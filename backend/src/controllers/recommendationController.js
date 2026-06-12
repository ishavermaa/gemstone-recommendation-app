import Gemstone from '../models/Gemstone.js';
import Recommendation from '../models/Recommendation.js';
import { buildRecommendation } from '../services/recommendationService.js';
import { asyncHandler } from '../utils/asyncHandler.js';

export const createRecommendation = asyncHandler(async (req, res) => {
  const gemstones = await Gemstone.find();
  const result = buildRecommendation(req.body, gemstones);

  const recommendation = await Recommendation.create({
    userId: req.user._id,
    gemstoneId: result.gemstone._id,
    goal: req.body.goal,
    matchScore: result.matchScore,
    recommendationReason: result.recommendationReason,
    input: {
      name: req.body.name,
      gender: req.body.gender,
      dateOfBirth: req.body.dateOfBirth,
      zodiacSign: req.body.zodiacSign,
      profession: req.body.profession
    }
  });

  res.status(201).json({
    recommendation: {
      ...recommendation.toObject(),
      gemstoneId: result.gemstone
    }
  });
});

export const getRecommendations = asyncHandler(async (req, res) => {
  const filter = req.user.role === 'admin' ? {} : { userId: req.user._id };
  const recommendations = await Recommendation.find(filter)
    .populate('gemstoneId')
    .populate('userId', 'name email')
    .sort({ createdAt: -1 });

  res.json({ recommendations });
});

export const getRecommendation = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.userId = req.user._id;

  const recommendation = await Recommendation.findOne(filter).populate('gemstoneId');
  if (!recommendation) {
    const error = new Error('Recommendation not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ recommendation });
});

export const deleteRecommendation = asyncHandler(async (req, res) => {
  const filter = { _id: req.params.id };
  if (req.user.role !== 'admin') filter.userId = req.user._id;

  const recommendation = await Recommendation.findOneAndDelete(filter);
  if (!recommendation) {
    const error = new Error('Recommendation not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({ message: 'Recommendation deleted' });
});
