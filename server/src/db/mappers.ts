import { Destination, TravelItinerary, UserProfile } from '../types/travel.js';
import { timeAgo } from '../utils/timeAgo.js';

// ---------------------------------------------------------------------------
// destinations
// ---------------------------------------------------------------------------
export function rowToDestination(row: any): Destination {
  return {
    id: row.id,
    city: row.city,
    country: row.country,
    flag: row.flag,
    image: row.image,
    timezone: row.timezone,
    bestSeason: row.best_season,
    avgDailyCostUSD: Number(row.avg_daily_cost_usd),
    lat: Number(row.lat),
    lng: Number(row.lng),
    description: row.description,
    hasWarning: row.has_warning ?? undefined,
    warningKey: row.warning_key ?? undefined,
    popularTags: row.popular_tags ?? [],
  };
}

// ---------------------------------------------------------------------------
// profiles -> UserProfile
// ---------------------------------------------------------------------------
export function rowToProfile(row: any): UserProfile {
  return {
    id: row.id,
    name: row.name,
    username: row.username ?? '',
    avatar: row.avatar_url ?? '',
    bio: row.bio ?? '',
    visitedCountries: row.visited_countries ?? [],
    plannedCountries: row.planned_countries ?? [],
    followersCount: row.followers_count ?? 0,
    followingCount: row.following_count ?? 0,
    achievements: row.achievements ?? [],
  };
}

const PROFILE_PATCH_MAP: Record<string, string> = {
  name: 'name',
  username: 'username',
  avatar: 'avatar_url',
  bio: 'bio',
  visitedCountries: 'visited_countries',
  plannedCountries: 'planned_countries',
};

export function profilePatchToRow(patch: Partial<UserProfile>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const column = PROFILE_PATCH_MAP[key];
    if (column) row[column] = value;
  }
  return row;
}

// ---------------------------------------------------------------------------
// travel_plans -> TravelItinerary
// ---------------------------------------------------------------------------
export function rowToItinerary(row: any): TravelItinerary {
  return {
    id: row.id,
    title: row.title,
    destination: row.destination,
    country: row.country ?? '',
    flagEmoji: row.flag_emoji ?? '🌍',
    coverImage: row.cover_image ?? '',
    summary: row.summary ?? '',
    durationDays: row.duration_days,
    season: row.season,
    preferences: row.preferences ?? [],
    companionStyle: row.companion_style ?? undefined,
    estimatedCostUSD: Number(row.estimated_cost_usd ?? 0),
    transportation: row.transportation ?? '',
    weatherForecast: row.weather_forecast ?? '',
    packingList: row.packing_list ?? [],
    days: row.days ?? [],
    creatorId: row.creator_id ?? '',
    creatorName: row.creator_name ?? '',
    creatorAvatar: row.creator_avatar ?? '',
    likesCount: row.likes_count ?? 0,
    bookmarksCount: row.bookmarks_count ?? 0,
    viewsCount: row.views_count ?? 0,
    rating: Number(row.rating ?? 0),
    ratingsCount: row.ratings_count ?? 0,
    isPublished: row.is_published ?? true,
    isForked: row.is_forked ?? undefined,
    originalItineraryId: row.original_itinerary_id ?? undefined,
    comments: row.comments ?? [],
    updatedAt: row.updated_at ? timeAgo(row.updated_at) : 'Just now',
  };
}

// Fields the generic PATCH /api/itineraries/:id endpoint is allowed to
// write. Deliberately excludes id/creatorId (ownership shouldn't change
// via a data patch) and updatedAt (the DB trigger sets that from real time).
const ITINERARY_PATCH_MAP: Record<string, string> = {
  title: 'title',
  destination: 'destination',
  country: 'country',
  flagEmoji: 'flag_emoji',
  coverImage: 'cover_image',
  summary: 'summary',
  durationDays: 'duration_days',
  season: 'season',
  preferences: 'preferences',
  companionStyle: 'companion_style',
  estimatedCostUSD: 'estimated_cost_usd',
  transportation: 'transportation',
  weatherForecast: 'weather_forecast',
  packingList: 'packing_list',
  days: 'days',
  comments: 'comments',
  creatorName: 'creator_name',
  creatorAvatar: 'creator_avatar',
  isPublished: 'is_published',
  isForked: 'is_forked',
  originalItineraryId: 'original_itinerary_id',
  likesCount: 'likes_count',
  bookmarksCount: 'bookmarks_count',
  viewsCount: 'views_count',
  rating: 'rating',
  ratingsCount: 'ratings_count',
};

export function itineraryPatchToRow(patch: Record<string, unknown>): Record<string, unknown> {
  const row: Record<string, unknown> = {};
  for (const [key, value] of Object.entries(patch)) {
    const column = ITINERARY_PATCH_MAP[key];
    if (column) row[column] = value;
  }
  return row;
}

/** Builds an insert row from a full (or nearly-full) TravelItinerary-shaped
 *  object, deliberately dropping `id` and `updatedAt` — the DB assigns a
 *  real uuid and a real timestamp, rather than trusting a client-generated
 *  `it_xxxxx` string or a hardcoded "Just now". */
export function itineraryToInsertRow(it: Partial<TravelItinerary>): Record<string, unknown> {
  const row = itineraryPatchToRow(it as Record<string, unknown>);
  if (it.creatorId) row.creator_id = it.creatorId;
  return row;
}
