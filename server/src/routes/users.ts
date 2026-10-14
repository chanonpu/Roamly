import { Router } from 'express';
import { z } from 'zod';
import { store } from '../db/store.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimit.js';

export const usersRouter = Router();

usersRouter.use(requireAuth);

usersRouter.get('/me', asyncHandler(async (req: AuthedRequest, res) => {
  const user = await store.getUser(req.user!.id);
  // The DB trigger creates a profile row on signup, so this should always
  // exist — but if it somehow doesn't (e.g. a user created before the
  // trigger existed), fail with a clear message rather than a raw 500.
  if (!user) throw new ApiError(404, 'No profile found for this account yet.');
  res.json(user);
}));

const updateUserSchema = z.object({
  name: z.string().trim().min(1).max(60).optional(),
  username: z.string().regex(/^[a-zA-Z0-9_]{3,30}$/, '3–30 letters, numbers or underscores').optional(),
  // http(s) only — rendered as an <img src>, so no javascript:/data: URLs.
  avatar: z.string().max(500).refine(u => u === '' || /^https?:\/\//i.test(u), 'must be an http(s) URL').optional(),
  bio: z.string().max(500).optional(),
  visitedCountries: z.array(z.string().max(60)).max(250).optional(),
  plannedCountries: z.array(z.string().max(60)).max(250).optional(),
});

usersRouter.patch('/me', writeLimiter, asyncHandler(async (req: AuthedRequest, res) => {
  const patch = updateUserSchema.parse(req.body);
  const updated = await store.updateUser(req.user!.id, patch);
  if (!updated) throw new ApiError(404, 'No profile found for this account yet.');
  res.json(updated);
}));

usersRouter.get('/me/itineraries', asyncHandler(async (req: AuthedRequest, res) => {
  res.json(await store.listMyItineraries(req.user!.id));
}));

usersRouter.get('/me/saved', asyncHandler(async (req: AuthedRequest, res) => {
  res.json(await store.getBookmarkedItineraries(req.user!.id));
}));
