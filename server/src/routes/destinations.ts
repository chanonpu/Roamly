import { Router } from 'express';
import { store } from '../db/store.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';

export const destinationsRouter = Router();

destinationsRouter.get('/', asyncHandler(async (_req, res) => {
  res.json(await store.listDestinations());
}));

destinationsRouter.get('/:id', asyncHandler(async (req, res) => {
  const dest = await store.getDestination(req.params.id);
  if (!dest) throw new ApiError(404, `Destination "${req.params.id}" not found`);
  res.json(dest);
}));
