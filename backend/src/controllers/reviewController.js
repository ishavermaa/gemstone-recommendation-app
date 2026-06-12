import Review from '../models/Review.js';
import Gemstone from '../models/Gemstone.js';
import { asyncHandler } from '../utils/asyncHandler.js';

// Get all reviews for a gemstone
export const getGemstoneReviews = asyncHandler(async (req, res) => {
  const { gemstoneId } = req.params;
  const reviews = await Review.find({ gemstone: gemstoneId })
    .populate('user', 'name profileImage')
    .sort('-createdAt');
  res.json(reviews);
});

// Get reviews by user
export const getUserReviews = asyncHandler(async (req, res) => {
  const { userId } = req.params;
  const reviews = await Review.find({ user: userId })
    .populate('gemstone', 'name image')
    .sort('-createdAt');
  res.json(reviews);
});

// Add a review
export const createReview = asyncHandler(async (req, res) => {
  const { gemstoneId, rating, comment } = req.body;
  const userId = req.user.id;

  // Check if review already exists
  const existingReview = await Review.findOne({ user: userId, gemstone: gemstoneId });
  if (existingReview) {
    return res.status(400).json({ message: 'You have already reviewed this gemstone' });
  }

  const review = new Review({
    user: userId,
    gemstone: gemstoneId,
    rating,
    comment,
  });

  await review.save();
  await review.populate('user', 'name profileImage');

  // Update gemstone rating
  await updateGemstoneRating(gemstoneId);

  res.status(201).json(review);
});

// Update a review
export const updateReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id;

  let review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Check authorization
  if (review.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized to update this review' });
  }

  review.rating = rating;
  review.comment = comment;
  await review.save();
  await review.populate('user', 'name profileImage');

  // Update gemstone rating
  await updateGemstoneRating(review.gemstone);

  res.json(review);
});

// Delete a review
export const deleteReview = asyncHandler(async (req, res) => {
  const { reviewId } = req.params;
  const userId = req.user.id;

  const review = await Review.findById(reviewId);
  if (!review) {
    return res.status(404).json({ message: 'Review not found' });
  }

  // Check authorization
  if (review.user.toString() !== userId) {
    return res.status(403).json({ message: 'Unauthorized to delete this review' });
  }

  const gemstoneId = review.gemstone;
  await Review.findByIdAndDelete(reviewId);

  // Update gemstone rating
  await updateGemstoneRating(gemstoneId);

  res.json({ message: 'Review deleted successfully' });
});

// Helper function to update gemstone rating
async function updateGemstoneRating(gemstoneId) {
  const reviews = await Review.find({ gemstone: gemstoneId });
  if (reviews.length === 0) {
    await Gemstone.findByIdAndUpdate(gemstoneId, {
      averageRating: 0,
      totalReviews: 0,
    });
  } else {
    const averageRating =
      reviews.reduce((sum, review) => sum + review.rating, 0) / reviews.length;
    await Gemstone.findByIdAndUpdate(gemstoneId, {
      averageRating: Math.round(averageRating * 10) / 10,
      totalReviews: reviews.length,
    });
  }
}
