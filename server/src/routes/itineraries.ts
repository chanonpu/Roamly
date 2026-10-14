import { Router } from 'express';
import { z } from 'zod';
import { store } from '../db/store.js';
import { ApiError } from '../middleware/errorHandler.js';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { requireAuth, optionalAuth, AuthedRequest } from '../middleware/auth.js';
import { writeLimiter } from '../middleware/rateLimit.js';
import { logEvent } from '../services/analytics.js';
import { Activity, DayItinerary, PackingItem, TravelItinerary } from '../types/travel.js';

export const itinerariesRouter = Router();

/** Throws 403 unless the itinerary exists and the current user owns it. */
async function requireOwnedItinerary(id: string, userId: string): Promise<TravelItinerary> {
  const it = await store.getItinerary(id);
  if (!it) throw new ApiError(404, `Itinerary "${id}" not found`);
  if (it.creatorId !== userId) throw new ApiError(403, "You don't have permission to edit this itinerary.");
  return it;
}

/** Throws 404 unless the itinerary exists and is published or owned by the
 *  caller — unpublished plans are private and must not be readable, forked,
 *  liked, etc. by anyone else. */
async function requireVisibleItinerary(id: string, userId?: string): Promise<TravelItinerary> {
  const it = await store.getItinerary(id);
  if (!it || (!it.isPublished && it.creatorId !== userId)) {
    throw new ApiError(404, `Itinerary "${id}" not found`);
  }
  return it;
}

// ---- Shared validation ----
// Only http(s) links — anything else (javascript:, data:) is an XSS vector
// once rendered as an href/src. Empty string is allowed as "no link".
const httpUrl = z.string().max(1000).refine(u => u === '' || /^https?:\/\//i.test(u), {
  message: 'must be an http(s) URL',
});

const activitySchema = z.object({
  id: z.string().max(100).optional(),
  title: z.string().max(200),
  category: z.string().max(50),
  location: z.string().max(200),
  description: z.string().max(2000),
  estimatedDuration: z.string().max(50),
  estimatedCost: z.number().min(0).max(1_000_000),
  timeOfDay: z.enum(['Morning', 'Afternoon', 'Evening']),
  googleMapsUrl: httpUrl.optional(),
  notes: z.string().max(2000).optional(),
  lat: z.number().min(-90).max(90).optional(),
  lng: z.number().min(-180).max(180).optional(),
});
const activitiesSchema = z.array(activitySchema).max(50);

const daySchema = z.object({
  dayNumber: z.number().int().min(1).max(60),
  title: z.string().max(200),
  activities: activitiesSchema,
});

const packingListSchema = z.array(z.object({
  id: z.string().max(100),
  category: z.enum(['Clothing', 'Electronics', 'Documents', 'Toiletries', 'Essentials', 'Custom']),
  item: z.string().max(100),
  packed: z.boolean(),
})).max(200);

// Owner-editable content only. Counters, comments, creator and fork fields
// are server-managed and deliberately not accepted here.
const editableFields = {
  title: z.string().min(1).max(200),
  summary: z.string().max(2000),
  coverImage: httpUrl,
  season: z.enum(['Spring', 'Summer', 'Autumn', 'Winter']),
  preferences: z.array(z.string().max(50)).max(20),
  companionStyle: z.enum(['Solo', 'Couple', 'Family', 'Friends', 'Pet Friendly']),
  estimatedCostUSD: z.number().min(0).max(10_000_000),
  transportation: z.string().max(500),
  weatherForecast: z.string().max(500),
  isPublished: z.boolean(),
  durationDays: z.number().int().min(1).max(60),
  days: z.array(daySchema).min(1).max(60),
};

const patchSchema = z.object(editableFields).partial().strict();

const createSchema = z.object({
  ...editableFields,
  destination: z.string().min(1).max(100),
  country: z.string().max(100).optional(),
  flagEmoji: z.string().max(20).optional(),
  packingList: packingListSchema.optional(),
}).partial({
  summary: true, coverImage: true, season: true, preferences: true, companionStyle: true,
  estimatedCostUSD: true, transportation: true, weatherForecast: true, isPublished: true, durationDays: true,
});

// ---- List (public — backs the Community Feed) ----
itinerariesRouter.get('/', asyncHandler(async (req, res) => {
  const { search, category, sort } = req.query as { search?: string; category?: string; sort?: string };
  res.json(await store.listItineraries({ search, category, sort }));
}));

itinerariesRouter.get('/:id', optionalAuth, asyncHandler(async (req: AuthedRequest, res) => {
  res.json(await requireVisibleItinerary(req.params.id, req.user?.id));
}));

// ---- Everything below here mutates data and requires a signed-in user ----
itinerariesRouter.use(requireAuth, writeLimiter);

itinerariesRouter.post('/', asyncHandler(async (req: AuthedRequest, res) => {
  const body = createSchema.parse(req.body);
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
    preferences: (body.preferences ?? []) as TravelItinerary['preferences'],
    companionStyle: body.companionStyle,
    estimatedCostUSD: body.estimatedCostUSD ?? 0,
    transportation: body.transportation ?? '',
    weatherForecast: body.weatherForecast ?? '',
    packingList: body.packingList ?? [],
    days: body.days as DayItinerary[],
    creatorId: req.user!.id,
    creatorName: profile?.name ?? 'Traveler',
    creatorAvatar: profile?.avatar ?? '',
    isPublished: body.isPublished ?? true,
  });
  res.status(201).json(it);
}));

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
// Both start fresh: stats and comments belong to the original, not the copy.
const FRESH_STATS = {
  likesCount: 0,
  bookmarksCount: 0,
  viewsCount: 0,
  ratingsCount: 0,
  rating: 0,
  comments: [],
} satisfies Partial<TravelItinerary>;

itinerariesRouter.post('/:id/fork', asyncHandler(async (req: AuthedRequest, res) => {
  const original = await requireVisibleItinerary(req.params.id, req.user!.id);
  const profile = await store.getUser(req.user!.id);

  const forked = await store.createItinerary({
    ...original,
    ...FRESH_STATS,
    title: `${original.title} (Forked)`,
    creatorId: req.user!.id,
    creatorName: profile?.name ?? 'Traveler',
    creatorAvatar: profile?.avatar ?? '',
    isForked: true,
    originalItineraryId: original.id,
  });
  await logEvent('fork_itinerary', { itineraryId: original.id, destination: original.destination }, req.user!.id);
  res.status(201).json(forked);
}));

itinerariesRouter.post('/:id/duplicate', asyncHandler(async (req: AuthedRequest, res) => {
  const original = await requireVisibleItinerary(req.params.id, req.user!.id);
  const profile = await store.getUser(req.user!.id);

  const dup = await store.createItinerary({
    ...original,
    ...FRESH_STATS,
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
  await requireVisibleItinerary(req.params.id, req.user!.id);
  const updated = await store.toggleLike(req.params.id, req.user!.id);
  if (!updated) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  await logEvent('like_itinerary', { itineraryId: req.params.id, likesCount: updated.likesCount }, req.user!.id);
  res.json(updated);
}));

itinerariesRouter.post('/:id/bookmark', asyncHandler(async (req: AuthedRequest, res) => {
  await requireVisibleItinerary(req.params.id, req.user!.id);
  const updated = await store.toggleBookmark(req.params.id, req.user!.id);
  if (!updated) throw new ApiError(404, `Itinerary "${req.params.id}" not found`);
  await logEvent('bookmark_itinerary', { itineraryId: req.params.id, bookmarksCount: updated.bookmarksCount }, req.user!.id);
  res.json(updated);
}));

// ---- Comments (any signed-in user) ----
const commentSchema = z.object({
  content: z.string().trim().min(1).max(2000),
  rating: z.number().int().min(1).max(5).optional(),
});
itinerariesRouter.post('/:id/comments', asyncHandler(async (req: AuthedRequest, res) => {
  const body = commentSchema.parse(req.body);
  const it = await requireVisibleItinerary(req.params.id, req.user!.id);
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
itinerariesRouter.put('/:id/packing-list', asyncHandler(async (req: AuthedRequest, res) => {
  await requireOwnedItinerary(req.params.id, req.user!.id);
  const packingList = packingListSchema.parse(req.body) as PackingItem[];
  const updated = await store.updateItinerary(req.params.id, { packingList });
  res.json(updated);
}));

// ---- Day activities (owner only): replace whole day (reorder/delete), or add one ----
itinerariesRouter.put('/:id/days/:dayNumber/activities', asyncHandler(async (req: AuthedRequest, res) => {
  const it = await requireOwnedItinerary(req.params.id, req.user!.id);
  const dayNumber = Number(req.params.dayNumber);
  const activities = activitiesSchema.parse(req.body) as Activity[];

  const days = it.days.map(d => (d.dayNumber === dayNumber ? { ...d, activities } : d));
  const updated = await store.updateItinerary(it.id, { days });
  res.json(updated);
}));

itinerariesRouter.post('/:id/days/:dayNumber/activities', asyncHandler(async (req: AuthedRequest, res) => {
  const it = await requireOwnedItinerary(req.params.id, req.user!.id);
  const dayNumber = Number(req.params.dayNumber);
  const activity = activitySchema.parse(req.body);

  const day = it.days.find(d => d.dayNumber === dayNumber);
  if (day && day.activities.length >= 50) throw new ApiError(400, 'A day can have at most 50 activities.');

  const newActivity = { ...activity, id: activity.id ?? crypto.randomUUID() } as Activity;
  const days = it.days.map(d =>
    d.dayNumber === dayNumber ? { ...d, activities: [...d.activities, newActivity] } : d
  );
  const updated = await store.updateItinerary(it.id, { days });
  res.status(201).json(updated);
}));
