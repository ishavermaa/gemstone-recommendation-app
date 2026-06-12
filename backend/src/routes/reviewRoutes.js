import express from 'express';
import {
  getGemstoneReviews,
  getUserReviews,
  createReview,
  updateReview,
  deleteReview,
} from '../controllers/reviewController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all reviews for a gemstone
router.get('/gemstone/:gemstoneId', getGemstoneReviews);

// Get user's reviews
router.get('/user/:userId', authenticate, getUserReviews);

// Create a review
router.post('/', authenticate, createReview);

// Update a review
router.put('/:reviewId', authenticate, updateReview);

// Delete a review
router.delete('/:reviewId', authenticate, deleteReview);

export default router;
