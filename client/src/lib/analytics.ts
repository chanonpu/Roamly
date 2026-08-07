import { api } from './api';

// Only the events the backend can't already see server-side. Actions that
// hit an API route (generate, fork, like, comment, ...) are logged inline
// in that route on the backend instead — see roamly-backend's routes/ai.ts
// and routes/itineraries.ts. Keeping the split this way means an event
// either has exactly one place it's logged from, not two.
export type ClientAnalyticsEvent = 'search' | 'destination_view' | 'itinerary_view' | 'page_view' | 'sign_up';

/**
 * Fire-and-forget: never throws, never blocks the UI, and doesn't retry.
 * Losing an occasional analytics event is fine; making the search box laggy
 * because a tracking call is slow is not.
 */
export function track(eventType: ClientAnalyticsEvent, metadata: Record<string, unknown> = {}): void {
  api.logAnalyticsEvent(eventType, metadata).catch(() => {
    // Intentionally silent — analytics failures shouldn't surface to the user.
  });
}
