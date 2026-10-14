import { supabaseAdmin } from '../lib/supabase.js';
import { Destination, TravelItinerary, UserProfile, Currency } from '../types/travel.js';
import {
  rowToDestination, rowToItinerary, rowToProfile,
  profilePatchToRow, itineraryPatchToRow, itineraryToInsertRow,
} from './mappers.js';

// Currencies are truly static reference data (exchange rates nobody in this
// app edits) — no table needed, just served from memory.
const CURRENCIES: Currency[] = [
  { code: 'USD', symbol: '$', name: 'US Dollar', rateToUSD: 1.0 },
  { code: 'EUR', symbol: '€', name: 'Euro', rateToUSD: 0.92 },
  { code: 'GBP', symbol: '£', name: 'British Pound', rateToUSD: 0.78 },
  { code: 'JPY', symbol: '¥', name: 'Japanese Yen', rateToUSD: 154.5 },
  { code: 'AUD', symbol: 'A$', name: 'Australian Dollar', rateToUSD: 1.52 },
  { code: 'CAD', symbol: 'C$', name: 'Canadian Dollar', rateToUSD: 1.37 },
  { code: 'CHF', symbol: 'CHF', name: 'Swiss Franc', rateToUSD: 0.89 },
  { code: 'SGD', symbol: 'S$', name: 'Singapore Dollar', rateToUSD: 1.34 },
  { code: 'INR', symbol: '₹', name: 'Indian Rupee', rateToUSD: 83.5 },
];

function must<T>(value: T | null | undefined, message: string): T {
  if (value === null || value === undefined) throw new Error(message);
  return value;
}

class SupabaseStore {
  // ---- Destinations ----
  async listDestinations(): Promise<Destination[]> {
    const { data, error } = await supabaseAdmin.from('destinations').select('*').order('city');
    if (error) throw error;
    return (data ?? []).map(rowToDestination);
  }

  async getDestination(id: string): Promise<Destination | undefined> {
    const { data, error } = await supabaseAdmin.from('destinations').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToDestination(data) : undefined;
  }

  // ---- Currencies ----
  listCurrencies(): Currency[] {
    return CURRENCIES;
  }

  // ---- Profiles (users) ----
  async getUser(id: string): Promise<UserProfile | undefined> {
    const { data, error } = await supabaseAdmin.from('profiles').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToProfile(data) : undefined;
  }

  async updateUser(id: string, patch: Partial<UserProfile>): Promise<UserProfile | undefined> {
    const row = profilePatchToRow(patch);
    const { data, error } = await supabaseAdmin.from('profiles').update(row).eq('id', id).select('*').maybeSingle();
    if (error) throw error;
    // Plans store a copy of the creator's name and avatar; keep the user's own plans current.
    const planPatch: Record<string, string> = {};
    if (patch.name !== undefined) planPatch.creator_name = data?.name ?? patch.name;
    if (patch.avatar !== undefined) planPatch.creator_avatar = patch.avatar;
    if (data && Object.keys(planPatch).length > 0) {
      const { error: planError } = await supabaseAdmin
        .from('travel_plans').update(planPatch).eq('creator_id', id);
      if (planError) throw planError;
    }
    return data ? rowToProfile(data) : undefined;
  }

  // ---- Itineraries ----
  async listItineraries(params?: { search?: string; category?: string; sort?: string }): Promise<TravelItinerary[]> {
    let query = supabaseAdmin.from('travel_plans').select('*').eq('is_published', true);

    // Strip PostgREST filter syntax (commas/parens split and nest `.or()`
    // conditions; `*`/`%` are wildcards) so search can't inject filters.
    const search = params?.search?.replace(/[,()*%\\]/g, ' ').trim().slice(0, 100);
    if (search) {
      const q = `%${search}%`;
      query = query.or(`title.ilike.${q},destination.ilike.${q},country.ilike.${q}`);
    }
    if (params?.category && params.category !== 'All') {
      query = query.contains('preferences', [params.category]);
    }

    if (params?.sort === 'rating') query = query.order('rating', { ascending: false });
    else if (params?.sort === 'views') query = query.order('views_count', { ascending: false });
    else if (params?.sort === 'recent') query = query.order('created_at', { ascending: false });
    else query = query.order('likes_count', { ascending: false });

    const { data, error } = await query.limit(100);
    if (error) throw error;
    return (data ?? []).map(rowToItinerary);
  }

  async getItinerary(id: string): Promise<TravelItinerary | undefined> {
    const { data, error } = await supabaseAdmin.from('travel_plans').select('*').eq('id', id).maybeSingle();
    if (error) throw error;
    return data ? rowToItinerary(data) : undefined;
  }

  async createItinerary(it: Partial<TravelItinerary>): Promise<TravelItinerary> {
    const row = itineraryToInsertRow(it);
    const { data, error } = await supabaseAdmin.from('travel_plans').insert(row).select('*').single();
    if (error) throw error;
    return rowToItinerary(must(data, 'Insert returned no row'));
  }

  async updateItinerary(id: string, patch: Record<string, unknown>): Promise<TravelItinerary | undefined> {
    const row = itineraryPatchToRow(patch);
    const { data, error } = await supabaseAdmin.from('travel_plans').update(row).eq('id', id).select('*').maybeSingle();
    if (error) throw error;
    return data ? rowToItinerary(data) : undefined;
  }

  async deleteItinerary(id: string): Promise<boolean> {
    const { error, count } = await supabaseAdmin.from('travel_plans').delete({ count: 'exact' }).eq('id', id);
    if (error) throw error;
    return (count ?? 0) > 0;
  }

  async toggleLike(itineraryId: string, userId: string): Promise<TravelItinerary | undefined> {
    const { data, error } = await supabaseAdmin.rpc('toggle_like', { p_plan_id: itineraryId, p_user_id: userId });
    if (error) throw error;
    return data ? rowToItinerary(data) : undefined;
  }

  async toggleBookmark(itineraryId: string, userId: string): Promise<TravelItinerary | undefined> {
    const { data, error } = await supabaseAdmin.rpc('toggle_bookmark', { p_plan_id: itineraryId, p_user_id: userId });
    if (error) throw error;
    return data ? rowToItinerary(data) : undefined;
  }

  async getBookmarkedItineraries(userId: string): Promise<TravelItinerary[]> {
    const { data: bookmarkRows, error: bookmarkError } = await supabaseAdmin
      .from('bookmarks').select('plan_id').eq('user_id', userId);
    if (bookmarkError) throw bookmarkError;

    const planIds = (bookmarkRows ?? []).map(r => r.plan_id);
    if (planIds.length === 0) return [];

    const { data, error } = await supabaseAdmin.from('travel_plans').select('*').in('id', planIds);
    if (error) throw error;
    return (data ?? []).map(rowToItinerary);
  }

  async listMyItineraries(userId: string): Promise<TravelItinerary[]> {
    const { data, error } = await supabaseAdmin
      .from('travel_plans').select('*').eq('creator_id', userId).order('created_at', { ascending: false });
    if (error) throw error;
    return (data ?? []).map(rowToItinerary);
  }
}

export const store = new SupabaseStore();
