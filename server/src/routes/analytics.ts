import { Router } from 'express';
import { z } from 'zod';
import { asyncHandler } from '../middleware/asyncHandler.js';
import { optionalAuth, AuthedRequest } from '../middleware/auth.js';
import { logEvent, AnalyticsEventType } from '../services/analytics.js';

export const analyticsRouter = Router();

const CLIENT_EVENT_TYPES = [
  'search', 'destination_view', 'itinerary_view', 'page_view', 'sign_up',
] as const satisfies readonly AnalyticsEventType[];

const eventSchema = z.object({
  eventType: z.enum(CLIENT_EVENT_TYPES),
  // Bounded so this can't become a way to stuff arbitrary large payloads
  // into the table — plenty of room for query/context/counts/ids.
  metadata: z.record(z.string(), z.any()).refine(
    (m) => JSON.stringify(m).length <= 4000,
    { message: 'metadata is too large' }
  ).default({}),
});

// Public + optionalAuth: we want to log anonymous (not-yet-signed-in)
// activity too — that's a lot of the point of tracking search behavior.
analyticsRouter.post('/events', optionalAuth, asyncHandler(async (req: AuthedRequest, res) => {
  const body = eventSchema.parse(req.body);
  await logEvent(body.eventType, body.metadata, req.user?.id ?? null);
  res.status(204).send();
}));
