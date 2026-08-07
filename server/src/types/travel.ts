// Mirrors the frontend's src/types/travel.ts so response bodies drop
// straight into existing components with no shape translation.

export type TravelCategory =
  | 'City' | 'Nature' | 'Beach' | 'Mountain' | 'Museum' | 'History'
  | 'Food' | 'Cafe' | 'Nightlife' | 'Shopping' | 'Photography' | 'Adventure'
  | 'Family' | 'Luxury' | 'Budget' | 'Hiking' | 'Camping' | 'Road Trip'
  | 'Hidden Gems' | 'Romantic' | 'Anime' | 'Theme Park' | 'Architecture' | 'Festival';

export type CompanionStyle = 'Solo' | 'Couple' | 'Family' | 'Friends' | 'Pet Friendly';
export type TravelSeason = 'Spring' | 'Summer' | 'Autumn' | 'Winter';
export type TimeOfDay = 'Morning' | 'Afternoon' | 'Evening';

export interface Activity {
  id: string;
  title: string;
  category: TravelCategory | 'Hotel' | 'Restaurant';
  location: string;
  description: string;
  estimatedDuration: string;
  estimatedCost: number;
  googleMapsUrl?: string;
  notes?: string;
  lat?: number;
  lng?: number;
  timeOfDay: TimeOfDay;
}

export interface DayItinerary {
  dayNumber: number;
  title: string;
  activities: Activity[];
}

export interface PackingItem {
  id: string;
  category: 'Clothing' | 'Electronics' | 'Documents' | 'Toiletries' | 'Essentials' | 'Custom';
  item: string;
  packed: boolean;
}

export interface Comment {
  id: string;
  userId: string;
  userName: string;
  userAvatar: string;
  content: string;
  rating?: number;
  createdAt: string;
}

export interface TravelItinerary {
  id: string;
  title: string;
  destination: string;
  country: string;
  flagEmoji: string;
  coverImage: string;
  summary: string;
  durationDays: number;
  season: TravelSeason;
  preferences: TravelCategory[];
  companionStyle?: CompanionStyle;
  estimatedCostUSD: number;
  transportation: string;
  weatherForecast: string;
  packingList: PackingItem[];
  days: DayItinerary[];
  creatorId: string;
  creatorName: string;
  creatorAvatar: string;
  likesCount: number;
  bookmarksCount: number;
  viewsCount: number;
  rating: number;
  ratingsCount: number;
  isPublished: boolean;
  isForked?: boolean;
  originalItineraryId?: string;
  comments: Comment[];
  updatedAt: string;
}

export interface Destination {
  id: string;
  city: string;
  country: string;
  flag: string;
  image: string;
  timezone: string;
  bestSeason: string;
  avgDailyCostUSD: number;
  lat: number;
  lng: number;
  description: string;
  hasWarning?: boolean;
  warningKey?: 'north_korea' | 'australia' | 'switzerland' | 'antarctica' | 'mars';
  popularTags: TravelCategory[];
}

export interface UserProfile {
  id: string;
  name: string;
  username: string;
  avatar: string;
  bio: string;
  visitedCountries: string[];
  plannedCountries: string[];
  followersCount: number;
  followingCount: number;
  achievements: {
    id: string;
    title: string;
    description: string;
    icon: string;
    unlockedAt?: string;
  }[];
}

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rateToUSD: number;
}

export interface GenerateTripRequest {
  destination: string;
  durationDays: number;
  season: TravelSeason;
  timeOfDay?: TimeOfDay[];
  preferences: TravelCategory[];
  companionStyle?: CompanionStyle;
  budgetStyle?: 'Budget' | 'Moderate' | 'Luxury';
}
