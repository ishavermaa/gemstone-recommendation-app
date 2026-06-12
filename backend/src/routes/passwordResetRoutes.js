import express from 'express';
import {
  requestPasswordReset,
  resetPassword,
  verifyResetToken,
} from '../controllers/passwordResetController.js';

const router = express.Router();

// Request password reset
router.post('/request', requestPasswordReset);

// Verify reset token
router.get('/verify', verifyResetToken);

// Reset password
router.post('/reset', resetPassword);

export default router;
