import dotenv from 'dotenv';
import { connectDB } from '../config/db.js';
import Gemstone from '../models/Gemstone.js';
import User from '../models/User.js';
import { defaultGemstones } from '../data/gemstones.js';

dotenv.config();

const seed = async () => {
  await connectDB();
  await Gemstone.deleteMany();
  await Gemstone.insertMany(defaultGemstones);

  const adminEmail = 'admin@gemstone.local';
  const existingAdmin = await User.findOne({ email: adminEmail });
  if (!existingAdmin) {
    await User.create({
      name: 'Admin',
      email: adminEmail,
      password: 'Admin123!',
      role: 'admin'
    });
  }

  console.log('Seed complete');
  process.exit(0);
};

seed().catch((error) => {
  console.error(error);
  process.exit(1);
});
