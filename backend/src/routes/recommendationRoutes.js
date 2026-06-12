import { Router } from 'express';
import {
  createRecommendation,
  deleteRecommendation,
  getRecommendation,
  getRecommendations
} from '../controllers/recommendationController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);
router.post('/', requireFields('name', 'gender', 'dateOfBirth', 'zodiacSign', 'profession', 'goal'), createRecommendation);
router.get('/', getRecommendations);
router.get('/:id', getRecommendation);
router.delete('/:id', deleteRecommendation);

export default router;
