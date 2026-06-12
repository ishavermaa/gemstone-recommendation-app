import { Router } from 'express';
import { login, profile, register, updateProfile } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { requireFields } from '../middleware/validationMiddleware.js';

const router = Router();

router.post('/register', requireFields('name', 'email', 'password'), register);
router.post('/login', requireFields('email', 'password'), login);
router.get('/profile', protect, profile);
router.put('/profile', protect, requireFields('name', 'email'), updateProfile);

export default router;
