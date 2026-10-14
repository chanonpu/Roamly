import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import { destinationsRouter } from './routes/destinations.js';
import { currenciesRouter } from './routes/currencies.js';
import { itinerariesRouter } from './routes/itineraries.js';
import { usersRouter } from './routes/users.js';
import { aiRouter } from './routes/ai.js';
import { analyticsRouter } from './routes/analytics.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { isGeminiConfigured } from './services/ai.js';
import { apiLimiter } from './middleware/rateLimit.js';

export function createApp() {
  const app = express();

  // Behind Vercel's proxy: makes req.ip the real client IP for rate limiting.
  app.set('trust proxy', 1);
  app.disable('x-powered-by');
  app.use(helmet());
  app.use(cors({
    origin: process.env.CORS_ORIGIN?.split(',') ?? '*',
    // Lets the client read rate-limit info cross-origin (shown on 429s).
    exposedHeaders: ['Retry-After', 'RateLimit', 'RateLimit-Policy'],
  }));
  app.use(express.json({ limit: '256kb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', aiEnabled: isGeminiConfigured(), time: new Date().toISOString() });
  });

  app.use('/api', apiLimiter);
  app.use('/api/destinations', destinationsRouter);
  app.use('/api/currencies', currenciesRouter);
  app.use('/api/itineraries', itinerariesRouter);
  app.use('/api/users', usersRouter);
  app.use('/api', aiRouter); // /api/generate-itinerary, /api/ai-chat, /api/optimize-route, /api/suggest-gems
  app.use('/api/analytics', analyticsRouter);

  app.use(notFoundHandler);
  app.use(errorHandler);

  return app;
}
