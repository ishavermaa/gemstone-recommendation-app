import express from 'express';
import {
  getUserWishlists,
  getWishlist,
  createWishlist,
  updateWishlist,
  deleteWishlist,
  addGemstoneToWishlist,
  removeGemstoneFromWishlist,
} from '../controllers/wishlistController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get all user's wishlists
router.get('/', authenticate, getUserWishlists);

// Get single wishlist
router.get('/:wishlistId', authenticate, getWishlist);

// Create wishlist
router.post('/', authenticate, createWishlist);

// Update wishlist
router.put('/:wishlistId', authenticate, updateWishlist);

// Delete wishlist
router.delete('/:wishlistId', authenticate, deleteWishlist);

// Add gemstone to wishlist
router.post('/:wishlistId/add-gemstone', authenticate, addGemstoneToWishlist);

// Remove gemstone from wishlist
router.post('/:wishlistId/remove-gemstone', authenticate, removeGemstoneFromWishlist);

export default router;
