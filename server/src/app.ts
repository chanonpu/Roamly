import express from 'express';
import cors from 'cors';
import { destinationsRouter } from './routes/destinations.js';
import { currenciesRouter } from './routes/currencies.js';
import { itinerariesRouter } from './routes/itineraries.js';
import { usersRouter } from './routes/users.js';
import { aiRouter } from './routes/ai.js';
import { analyticsRouter } from './routes/analytics.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandler.js';
import { isGeminiConfigured } from './services/ai.js';

export function createApp() {
  const app = express();

  app.use(cors({ origin: process.env.CORS_ORIGIN?.split(',') ?? '*' }));
  app.use(express.json({ limit: '2mb' }));

  app.get('/api/health', (_req, res) => {
    res.json({ status: 'ok', aiEnabled: isGeminiConfigured(), time: new Date().toISOString() });
  });

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
