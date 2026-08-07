import { supabaseAdmin } from '../lib/supabase.js';

export type AnalyticsEventType =
  | 'search'
  | 'destination_view'
  | 'itinerary_view'
  | 'page_view'
  | 'generate_itinerary'
  | 'ai_chat_message'
  | 'optimize_route'
  | 'suggest_gem'
  | 'fork_itinerary'
  | 'duplicate_itinerary'
  | 'like_itinerary'
  | 'bookmark_itinerary'
  | 'add_comment'
  | 'sign_up';

/**
 * Best-effort event log for the future analytics dashboard. Always resolves
 * (never throws) — a logging failure should never break the request that
 * triggered it. Deliberately *awaited* by callers rather than fired in the
 * background: on Vercel, a serverless function can be frozen the instant it
 * sends its response, which would silently drop an un-awaited insert. The
 * insert itself is small and fast, so awaiting it costs very little.
 */
export async function logEvent(
  eventType: AnalyticsEventType,
  metadata: Record<string, unknown> = {},
  userId?: string | null
): Promise<void> {
  try {
    await supabaseAdmin.from('analytics_events').insert({
      event_type: eventType,
      user_id: userId ?? null,
      metadata,
    });
  } catch (err) {
    console.warn('[analytics] failed to log event', eventType, err);
  }
}
