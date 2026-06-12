import { Router } from 'express';
import { getAnalytics, getUsers } from '../controllers/adminController.js';
import {
  getAllGemstones,
  getGemstoneDetail,
  createGemstone,
  updateGemstone,
  deleteGemstone,
} from '../controllers/adminGemstoneController.js';
import {
  getUserAnalytics,
  getRecommendationAnalytics,
  getGemstoneAnalytics,
  getDashboardStats,
} from '../controllers/analyticsController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';

const router = Router();

router.use(protect, authorize('admin'));

// Original routes
router.get('/users', getUsers);
router.get('/analytics', getAnalytics);

// Gemstone management routes (Admin only)
router.get('/gemstones', getAllGemstones);
router.get('/gemstones/:gemstoneId', getGemstoneDetail);
router.post('/gemstones', createGemstone);
router.put('/gemstones/:gemstoneId', updateGemstone);
router.delete('/gemstones/:gemstoneId', deleteGemstone);

// Advanced analytics routes (Admin only)
router.get('/analytics/users', getUserAnalytics);
router.get('/analytics/recommendations', getRecommendationAnalytics);
router.get('/analytics/gemstones', getGemstoneAnalytics);
router.get('/analytics/dashboard', getDashboardStats);

export default router;
