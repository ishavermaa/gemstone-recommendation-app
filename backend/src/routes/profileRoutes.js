import express from 'express';
import {
  getUserProfile,
  updateUserProfile,
  changePassword,
} from '../controllers/profileController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Get user profile
router.get('/', authenticate, getUserProfile);

// Update user profile
router.put('/', authenticate, updateUserProfile);

// Change password
router.post('/change-password', authenticate, changePassword);

export default router;
