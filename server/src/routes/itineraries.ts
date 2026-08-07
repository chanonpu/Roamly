import { Router } from 'express';
import { z } from 'zod';
import { store } from '../db/store.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, AuthedRequest } from '../middleware/auth.js';
import { logEvent } from '../services/analytics.js';
import { Activity, PackingItem, TravelItinerary } from '../types/travel.js';

export const itinerariesRouter = Router();

/** Throws 403 unless the itinerary exists and the current user owns it. */
async function requireOwnedItinerary(id: string, userId: string): Promise<TravelItinerary> {
  const it = await store.getItinerary(id);
  if (!it) throw new ApiError(404, `Itinerary "${id}" not found`);
  if (it.creatorId !== userId) throw new ApiError(403, "You don't have permission to edit this itinerary.");
  return it;
}

// ---- List (public — backs the Community Feed) ----
itinerariesRouter.get('/', asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query as { search?: string; category?: string; sort?: string };
  res.json(await store.listItineraries({ search, category, sort }));
}));

itinerariesRouter.get('/:id', asyncHandler(async (req, res) => {
  const it = await store.getItinerary(req.params.id);
  if (!it) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  res.json(it);
}));

// ---- Everything below here mutates data and requires a signed-in user ----
itinerariesRouter.use(requireAuth);

itinerariesRouter.post('/', asyncHandler(async (req: AuthedRequest, res) => {
  const body = req.body as Partial<TravelItinerary>;
  if (!body.title || !body.destination || !body.days) {
    throw new ApiError(400, 'title, destination, and days are required');
  }
  const profile = await store.getUser(req.user!.id);
  const it = await store.createItinerary({
    title: body.title,
    destination: body.destination,
    country: body.country ?? '',
    flagEmoji: body.flagEmoji ?? '🌍',
    coverImage: body.coverImage ?? '',
    summary: body.summary ?? '',
    durationDays: body.durationDays ?? body.days.length,
    season: body.season ?? 'Spring',
    preferences: body.preferences ?? [],
    companionStyle: body.companionStyle,
    estimatedCostUSD: body.estimatedCostUSD ?? 0,
    transportation: body.transportation ?? '',
    weatherForecast: body.weatherForecast ?? '',
    packingList: body.packingList ?? [],
    days: body.days,
    creatorId: req.user!.id,
    creatorName: profile?.name ?? 'Traveler',
    creatorAvatar: profile?.avatar ?? '',
    isPublished: body.isPublished ?? true,
  });
  res.status(201).json(it);
}));

const patchSchema = z.record(z.string(), z.any());
itinerariesRouter.patch('/:id', asyncHandler(async (req: AuthedRequest, res) => {
  await requireOwnedItinerary(req.params.id, req.user!.id);
  const patch = patchSchema.parse(req.body);
  const updated = await store.updateItinerary(req.params.id, patch);
  res.json(updated);
}));

itinerariesRouter.delete('/:id', asyncHandler(async (req: AuthedRequest, res) => {
  await requireOwnedItinerary(req.params.id, req.user!.id);
  await store.deleteItinerary(req.params.id);
  res.status(204).send();
}));

// ---- Fork / duplicate: copy into "my" itineraries, editable and independent ----
itinerariesRouter.post('/:id/fork', asyncHandler(async (req: AuthedRequest, res) => {
  const original = await store.getItinerary(req.params.id);
  if (!original) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  const profile = await store.getUser(req.user!.id);

  const forked = await store.createItinerary({
    ...original,
    title: `${original.title} (Forked)`,
    creatorId: req.user!.id,
    creatorName: profile?.name ?? 'Traveler',
    creatorAvatar: profile?.avatar ?? '',
    likesCount: 0,
    bookmarksCount: 0,
    viewsCount: 0,
    ratingsCount: 0,
    rating: 0,
    isForked: true,
    originalItineraryId: original.id,
    comments: [],
  });
  await logEvent('fork_itinerary', { itineraryId: original.id, destination: original.destination }, req.user!.id);
  res.status(201).json(forked);
}));

itinerariesRouter.post('/:id/duplicate', asyncHandler(async (req: AuthedRequest, res) => {
  const original = await store.getItinerary(req.params.id);
  if (!original) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  const profile = await store.getUser(req.user!.id);

  const dup = await store.createItinerary({
    ...original,
    title: `${original.title} (Copy)`,
    creatorId: req.user!.id,
    creatorName: profile?.name ?? 'Traveler',
    creatorAvatar: profile?.avatar ?? '',
  });
  await logEvent('duplicate_itinerary', { itineraryId: original.id, destination: original.destination }, req.user!.id);
  res.status(201).json(dup);
}));

// ---- Likes / bookmarks (any signed-in user, not just the owner) ----
itinerariesRouter.post('/:id/like', asyncHandler(async (req: AuthedRequest, res) => {
  const updated = await store.toggleLike(req.params.id, req.user!.id);
  if (!updated) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  await logEvent('like_itinerary', { itineraryId: req.params.id, likesCount: updated.likesCount }, req.user!.id);
  res.json(updated);
}));

itinerariesRouter.post('/:id/bookmark', asyncHandler(async (req: AuthedRequest, res) => {
  const updated = await store.toggleBookmark(req.params.id, req.user!.id);
  if (!updated) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  await logEvent('bookmark_itinerary', { itineraryId: req.params.id, bookmarksCount: updated.bookmarksCount }, req.user!.id);
  res.json(updated);
}));

// ---- Comments (any signed-in user) ----
const commentSchema = z.object({
  content: z.string().min(1),
  rating: z.number().min(1).max(5).optional(),
});
itinerariesRouter.post('/:id/comments', asyncHandler(async (req: AuthedRequest, res) => {
  const body = commentSchema.parse(req.body);
  const it = await store.getItinerary(req.params.id);
  if (!it) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  const profile = await store.getUser(req.user!.id);

  const comment = {
    id: crypto.randomUUID(),
    userId: req.user!.id,
    userName: profile?.name ?? 'Traveler',
    userAvatar: profile?.avatar ?? '',
    content: body.content,
    rating: body.rating,
    createdAt: 'Just now',
  };
  const updated = await store.updateItinerary(it.id, { comments: [comment, ...it.comments] });
  await logEvent('add_comment', { itineraryId: it.id, rating: body.rating ?? null }, req.user!.id);
  res.status(201).json(updated);
}));

// ---- Packing list (owner only) ----
const packingListSchema = z.array(z.object({
  id: z.string(),
  category: z.enum(['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Essentials', 'Custom']),
  item: z.string(),
  packed: z.boolean(),
}));
itinerariesRouter.put('/:id/packing-list', asyncHandler(async (req: AuthedRequest, res) => {
  await requireOwnedItinerary(req.params.id, req.user!.id);
  const packingList = packingListSchema.parse(req.body) as PackingItem[];
  const updated = await store.updateItinerary(req.params.id, { packingList });
  res.json(updated);
}));

// ---- Day activities (owner only): replace whole day (reorder/delete), or add one ----
const activitySchema = z.object({
  id: z.string().optional(),
  title: z.string(),
  category: z.string(),
  location: z.string(),
  description: z.string(),
  estimatedDuration: z.string(),
  estimatedCost: z.number(),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening']),
  googleMapsUrl: z.string().optional(),
  notes: z.string().optional(),
  lat: z.number().optional(),
  lng: z.number().optional(),
});

itinerariesRouter.put('/:id/days/:dayNumber/activities', asyncHandler(async (req: AuthedRequest, res) => {
  const it = await requireOwnedItinerary(req.params.id, req.user!.id);
  const dayNumber = Number(req.params.dayNumber);
  const activities = z.array(activitySchema).parse(req.body) as Activity[];

  const days = it.days.map(d => (d.dayNumber === dayNumber ? { ...d, activities } : d));
  const updated = await store.updateItinerary(it.id, { days });
  res.json(updated);
}));

itinerariesRouter.post('/:id/days/:dayNumber/activities', asyncHandler(async (req: AuthedRequest, res) => {
  const it = await requireOwnedItinerary(req.params.id, req.user!.id);
  const dayNumber = Number(req.params.dayNumber);
  const activity = activitySchema.parse(req.body);

  const newActivity = { ...activity, id: activity.id ?? crypto.randomUUID() } as Activity;
  const days = it.days.map(d =>
    d.dayNumber === dayNumber ? { ...d, activities: [...d.activities, newActivity] } : d
  );
  const updated = await store.updateItinerary(it.id, { days });
  res.status(201).json(updated);
}));
