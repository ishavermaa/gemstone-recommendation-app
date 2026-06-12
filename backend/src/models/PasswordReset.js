import mongoose from 'mongoose';
import crypto from 'crypto';

const passwordResetSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    token: {
      type: String,
      required: true,
      unique: true,
    },
    tokenHash: {
      type: String,
      required: true,
    },
    expiresAt: {
      type: Date,
      required: true,
    },
    used: {
      type: Boolean,
      default: false,
    },
    createdAt: {
      type: Date,
      default: Date.now,
      expires: 86400, // Auto-delete after 24 hours
    },
  },
  { timestamps: true }
);

// Static method to generate reset token
passwordResetSchema.statics.generateResetToken = function () {
  const token = crypto.randomBytes(32).toString('hex');
  const tokenHash = crypto.createHash('sha256').update(token).digest('hex');
  return { token, tokenHash };
};

export default mongoose.model('PasswordReset', passwordResetSchema);
