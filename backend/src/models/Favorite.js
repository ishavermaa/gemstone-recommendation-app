import mongoose from 'mongoose';

const favoriteSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gemstoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone', required: true }
  },
  { timestamps: true }
);

favoriteSchema.index({ userId: 1, gemstoneId: 1 }, { unique: true });

export default mongoose.model('Favorite', favoriteSchema);
