import User from '../models/User.js';
import PasswordReset from '../models/PasswordReset.js';
import { asyncHandler } from '../utils/asyncHandler.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

// Create reusable email transporter
const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

// Request password reset
export const requestPasswordReset = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    return res.status(400).json({ message: 'Email is required' });
  }

  const user = await User.findOne({ email });
  if (!user) {
    // Don't reveal if email exists
    return res.json({ message: 'If an account exists with this email, a reset link will be sent' });
  }

  // Generate reset token
  const { token, tokenHash } = PasswordReset.generateResetToken();

  // Create password reset record
  const expiresAt = new Date(Date.now() + 1 * 60 * 60 * 1000); // 1 hour

  const passwordReset = new PasswordReset({
    user: user._id,
    token,
    tokenHash,
    expiresAt,
  });

  await passwordReset.save();

  // Send email
  const resetUrl = `${process.env.FRONTEND_URL}/reset-password?token=${token}`;

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_USER,
      to: user.email,
      subject: 'Password Reset Request',
      html: `
        <h2>Password Reset Request</h2>
        <p>You requested a password reset. Click the link below to reset your password.</p>
        <p>This link expires in 1 hour.</p>
        <a href="${resetUrl}" style="padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
        <p>If you didn't request this, please ignore this email.</p>
      `,
    });
  } catch (error) {
    console.error('Email send error:', error);
    // Don't fail the request if email fails
  }

  res.json({ message: 'If an account exists with this email, a reset link will be sent' });
});

// Verify reset token and reset password
export const resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword, confirmPassword } = req.body;

  if (!token || !newPassword || !confirmPassword) {
    return res.status(400).json({ message: 'All fields are required' });
  }

  if (newPassword !== confirmPassword) {
    return res.status(400).json({ message: 'Passwords do not match' });
  }

  if (newPassword.length < 6) {
    return res.status(400).json({ message: 'Password must be at least 6 characters' });
  }

  // Hash the token to verify
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find reset record
  const resetRecord = await PasswordReset.findOne({
    tokenHash,
    used: false,
    expiresAt: { $gt: Date.now() },
  });

  if (!resetRecord) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  // Update user password
  const user = await User.findById(resetRecord.user);
  if (!user) {
    return res.status(404).json({ message: 'User not found' });
  }

  user.password = newPassword;
  await user.save();

  // Mark reset token as used
  resetRecord.used = true;
  await resetRecord.save();

  res.json({ message: 'Password reset successfully' });
});

// Verify reset token
export const verifyResetToken = asyncHandler(async (req, res) => {
  const { token } = req.query;

  if (!token) {
    return res.status(400).json({ message: 'Token is required' });
  }

  // Hash the token to verify
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');

  // Find reset record
  const resetRecord = await PasswordReset.findOne({
    tokenHash,
    used: false,
    expiresAt: { $gt: Date.now() },
  });

  if (!resetRecord) {
    return res.status(400).json({ message: 'Invalid or expired reset token' });
  }

  res.json({ message: 'Token is valid' });
});
