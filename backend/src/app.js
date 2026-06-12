import cors from 'cors';
import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes.js';
import gemstoneRoutes from './routes/gemstoneRoutes.js';
import recommendationRoutes from './routes/recommendationRoutes.js';
import favoriteRoutes from './routes/favoriteRoutes.js';
import adminRoutes from './routes/adminRoutes.js';
import reviewRoutes from './routes/reviewRoutes.js';
import wishlistRoutes from './routes/wishlistRoutes.js';
import profileRoutes from './routes/profileRoutes.js';
import passwordResetRoutes from './routes/passwordResetRoutes.js';
import { errorHandler, notFound } from './middleware/errorMiddleware.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: process.env.CLIENT_URL || 'http://localhost:5174',
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    allowedHeaders: ['Content-Type', 'Authorization'],
  })
);
app.use(express.json({ limit: '1mb' }));
app.use(morgan(process.env.NODE_ENV === 'production' ? 'combined' : 'dev'));
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500 }));

app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', service: 'gemstone-api' });
});

app.use('/api/auth', authRoutes);
app.use('/api/gemstones', gemstoneRoutes);
app.use('/api/recommendations', recommendationRoutes);
app.use('/api/favorites', favoriteRoutes);
app.use('/api/reviews', reviewRoutes);
app.use('/api/wishlists', wishlistRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/admin', adminRoutes);

app.use(notFound);
app.use(errorHandler);

export default app;
