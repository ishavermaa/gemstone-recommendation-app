import mongoose from 'mongoose';

const gemstoneSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    image: { type: String, required: true },
    gallery: [{ type: String }],
    description: { type: String, required: true },
    benefits: [{ type: String, required: true }],
    color: { type: String, required: true },
    planet: { type: String, required: true },
    recommendedFor: [{ type: String }],
    recommendedGoals: [{ type: String }],
    wearingInstructions: { type: String, required: true },
    suggestedMetal: { type: String, default: 'Silver' },
    suggestedDay: { type: String, default: 'Friday' },
    averageRating: { type: Number, default: 0 },
    totalReviews: { type: Number, default: 0 },
  },
  { timestamps: true }
);

gemstoneSchema.index({ name: 'text', description: 'text', benefits: 'text' });

export default mongoose.model('Gemstone', gemstoneSchema);
