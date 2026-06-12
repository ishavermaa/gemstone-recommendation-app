import { Router } from 'express';
import {
  createGemstone,
  deleteGemstone,
  getGemstone,
  getGemstones,
  updateGemstone
} from '../controllers/gemstoneController.js';
import { authorize, protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validationMiddleware.js';

const router = Router();

router.get('/', getGemstones);
router.get('/:id', getGemstone);
router.post('/', protect, authorize('admin'), requireFields('name', 'image', 'description', 'color', 'planet', 'wearingInstructions'), createGemstone);
router.put('/:id', protect, authorize('admin'), updateGemstone);
router.delete('/:id', protect, authorize('admin'), deleteGemstone);

export default router;
