import { Router } from 'express';
import { z } from 'zod';
import { store } from '../db/store.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';

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
  name: z.string().optional(),
  username: z.string().optional(),
  avatar: z.string().optional(),
  bio: z.string().optional(),
  visitedCountries: z.array(z.string()).optional(),
  plannedCountries: z.array(z.string()).optional(),
});

usersRouter.patch('/me', asyncHandler(async (req: AuthedRequest, res) => {
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
