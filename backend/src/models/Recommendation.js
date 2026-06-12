import mongoose from 'mongoose';

const recommendationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    gemstoneId: { type: mongoose.Schema.Types.ObjectId, ref: 'Gemstone', required: true },
    goal: { type: String, required: true },
    matchScore: { type: Number, required: true, min: 0, max: 100 },
    recommendationReason: { type: String, required: true },
    isSaved: { type: Boolean, default: false },
    input: {
      name: String,
      gender: String,
      dateOfBirth: Date,
      zodiacSign: String,
      profession: String
    }
  },
  { timestamps: true }
);

export default mongoose.model('Recommendation', recommendationSchema);
