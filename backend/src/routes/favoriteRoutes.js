import { Router } from 'express';
import { addFavorite, getFavorites, removeFavorite } from '../controllers/favoriteController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validationMiddleware.js';

const router = Router();

router.use(protect);
router.post('/', requireFields('gemstoneId'), addFavorite);
router.get('/', getFavorites);
router.delete('/:id', removeFavorite);

export default router;
