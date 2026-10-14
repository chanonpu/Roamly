import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { store } from '../db/store.js';
import { requireAuth, optionalAuth, AuthedRequest } from '../middleware/auth.js';
import { aiLimiter, generateLimiter } from '../middleware/rateLimit.js';
import { optimizeActivityRoute } from '../utils/geo.js';
import { chatReply, generateItinerary, IMPOSSIBLE_KEYS, isGeminiConfigured, suggestHiddenGem } from '../services/ai.js';
import { logEvent } from '../services/analytics.js';
import { Activity } from '../types/travel.js';

export const aiRouter = Router();

// POST /api/generate-itinerary — requires auth: the draft it returns is
// owned by whoever calls it, so we need to know who that is.
const generateSchema = z.object({
  destination: z.string().trim().min(1).max(100),
  durationDays: z.number().int().min(1).max(30),
  season: z.enum(['Spring', 'Summer', 'Autumn', 'Winter']),
  preferences: z.array(z.string().max(50)).max(20).default([]),
  companionStyle: z.enum(['Solo', 'Couple', 'Family', 'Friends', 'Pet Friendly']).optional(),
  budgetStyle: z.enum(['Budget', 'Moderate', 'Luxury']).optional(),
});

aiRouter.post('/generate-itinerary', requireAuth, generateLimiter, asyncHandler(async (req: AuthedRequest, res) => {
  const body = generateSchema.parse(req.body);
  const [profile, destinations] = await Promise.all([store.getUser(req.user!.id), store.listDestinations()]);
  const wanted = body.destination.toLowerCase();
  // City first ("Atlantis" alone also finds "Lost City of Atlantis"); country is the fallback.
  // Impossible destinations use made-up "countries" (The Moon, Himalayas…), so a country match
  // never turns a real trip into a joke one.
  const match = destinations.find(d => {
    const city = d.city.toLowerCase();
    return wanted.includes(city) || (wanted.length >= 4 && city.includes(wanted));
  }) ?? destinations.find(d => wanted.includes(d.country.toLowerCase()));
  // Returned as an unsaved draft; the client saves it via POST /api/itineraries
  // once the user approves it.
  const itinerary = await generateItinerary(
    body as any,
    req.user!.id,
    profile?.name ?? 'Traveler',
    profile?.avatar ?? '',
    !!match?.warningKey && IMPOSSIBLE_KEYS.has(match.warningKey)
  );
  await logEvent('generate_itinerary', {
    destination: body.destination, durationDays: body.durationDays, season: body.season,
    preferences: body.preferences, budgetStyle: body.budgetStyle ?? null, companionStyle: body.companionStyle ?? null,
  }, req.user!.id);
  res.status(201).json({ itinerary, usedAi: isGeminiConfigured() });
}));

// POST /api/ai-chat — public (optionalAuth), so people can try the
// concierge before signing up; we still log who asked if they're signed in.
const chatSchema = z.object({
  message: z.string().trim().min(1).max(1000),
  destinationContext: z.string().max(200).optional(),
});
aiRouter.post('/ai-chat', optionalAuth, aiLimiter, asyncHandler(async (req: AuthedRequest, res) => {
  const body = chatSchema.parse(req.body);
  const reply = await chatReply(body.message, body.destinationContext);
  await logEvent('ai_chat_message', { destinationContext: body.destinationContext ?? null }, req.user?.id ?? null);
  res.json({ reply, usedAi: isGeminiConfigured() });
}));

// POST /api/optimize-route — public, stateless geometry, no AI required.
const optimizeSchema = z.object({
  activities: z.array(z.record(z.string(), z.any())).max(100),
  destination: z.string().max(100).optional(),
});
aiRouter.post('/optimize-route', optionalAuth, aiLimiter, asyncHandler(async (req: AuthedRequest, res) => {
  const body = optimizeSchema.parse(req.body);
  const { ordered, totalKm } = optimizeActivityRoute(body.activities as Activity[]);
  await logEvent('optimize_route', {
    destination: body.destination ?? null, activityCount: body.activities.length, estimatedTravelKm: totalKm,
  }, req.user?.id ?? null);
  res.json({ optimizedActivities: ordered, estimatedTravelKm: totalKm });
}));

// POST /api/suggest-gems — public
const gemsSchema = z.object({ destination: z.string().trim().min(1).max(100) });
aiRouter.post('/suggest-gems', optionalAuth, aiLimiter, asyncHandler(async (req: AuthedRequest, res) => {
  const body = gemsSchema.parse(req.body);
  const gem = await suggestHiddenGem(body.destination);
  await logEvent('suggest_gem', { destination: body.destination }, req.user?.id ?? null);
  res.json({ gems: [gem], usedAi: isGeminiConfigured() });
}));
