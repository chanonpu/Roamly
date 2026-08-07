import {
  Activity, DayItinerary, GenerateTripRequest, PackingItem,
  TimeOfDay, TravelCategory, TravelItinerary,
} from '../types/travel.js';
import { DESTINATIONS } from '../db/seed.js';
import { makeId } from '../utils/id.js';

const TIME_SLOTS: TimeOfDay[] = ['Morning', 'Afternoon', 'Evening'];

const BUDGET_MULTIPLIER: Record<NonNullable<GenerateTripRequest['budgetStyle']>, number> = {
  Budget: 0.6,
  Moderate: 1,
  Luxury: 2.1,
};

const ACTIVITY_TEMPLATES: Record<string, string[]> = {
  City: ['Explore the {dest} downtown core', 'Wander the historic {dest} old town', 'Self-guided walking tour of {dest}'],
  Nature: ['Hike the trails outside {dest}', 'Sunrise viewpoint near {dest}', 'Botanical gardens of {dest}'],
  Beach: ['Relax on the {dest} coastline', 'Sunset beach walk in {dest}', 'Snorkeling excursion near {dest}'],
  Mountain: ['Cable car ride above {dest}', 'Alpine viewpoint hike near {dest}', 'Mountain village exploration near {dest}'],
  Museum: ['Flagship art museum of {dest}', 'History museum & archives, {dest}', 'Local heritage gallery in {dest}'],
  History: ['Guided history walk through {dest}', 'Ancient landmark tour in {dest}', 'Old quarter heritage sites, {dest}'],
  Food: ['Street food crawl in {dest}', 'Local market tasting tour, {dest}', 'Signature regional dinner in {dest}'],
  Cafe: ['Third-wave coffee crawl in {dest}', 'Cozy cafe brunch in {dest}'],
  Nightlife: ['Rooftop bars of {dest}', 'Live music venue in {dest}'],
  Shopping: ['Boutique shopping district of {dest}', 'Local artisan market in {dest}'],
  Photography: ['Golden-hour photo walk, {dest}', 'Iconic skyline viewpoint of {dest}'],
  Adventure: ['Adrenaline day trip near {dest}', 'Guided outdoor adventure, {dest}'],
  Family: ['Family-friendly park day in {dest}', 'Interactive science/kids museum, {dest}'],
  Luxury: ['Private guided tour of {dest}', 'Fine dining experience in {dest}'],
  Budget: ['Free walking tour of {dest}', 'Public park picnic in {dest}'],
  Hiking: ['Day hike near {dest}', 'Scenic ridge trail outside {dest}'],
  Camping: ['Overnight camp excursion near {dest}', 'Stargazing campsite near {dest}'],
  'Road Trip': ['Scenic drive from {dest}', 'Countryside loop drive near {dest}'],
  'Hidden Gems': ['Off-the-beaten-path spot near {dest}', 'Local-favorite hideaway in {dest}'],
  Romantic: ['Sunset viewpoint for two, {dest}', 'Candlelit dinner cruise, {dest}'],
  Anime: ['Pop-culture district crawl, {dest}', 'Collectibles & arcade run in {dest}'],
  'Theme Park': ['Theme park day in {dest}'],
  Architecture: ['Architecture walking tour of {dest}', 'Iconic landmark building tour, {dest}'],
  Festival: ['Local festival grounds, {dest}'],
};

function pick<T>(arr: T[], seed: number): T {
  return arr[seed % arr.length];
}

/** Deterministic-ish, dependency-free itinerary generator. Used whenever
 *  GEMINI_API_KEY isn't configured, or if the Gemini call fails/parses badly. */
export function generateHeuristicItinerary(req: GenerateTripRequest, userId: string, userName: string, userAvatar: string): TravelItinerary {
  const match = DESTINATIONS.find(d =>
    req.destination.toLowerCase().includes(d.city.toLowerCase().split(' ')[0].toLowerCase()) ||
    d.city.toLowerCase().includes(req.destination.toLowerCase().split(',')[0].trim().toLowerCase())
  );

  const destCity = match?.city ?? req.destination.split(',')[0].trim();
  const destCountry = match?.country ?? '';
  const flag = match?.flag ?? '🌍';
  const baseLat = match?.lat ?? 0;
  const baseLng = match?.lng ?? 0;
  const dailyCost = match?.avgDailyCostUSD ?? 130;
  const multiplier = BUDGET_MULTIPLIER[req.budgetStyle ?? 'Moderate'];

  const prefs = req.preferences.length > 0 ? req.preferences : (['City', 'Food', 'Museum'] as TravelCategory[]);

  const days: DayItinerary[] = Array.from({ length: req.durationDays }, (_, dayIdx) => {
    const activities: Activity[] = TIME_SLOTS.map((slot, slotIdx) => {
      const cat = pick(prefs, dayIdx * 3 + slotIdx);
      const templates = ACTIVITY_TEMPLATES[cat] ?? ACTIVITY_TEMPLATES.City;
      const title = pick(templates, dayIdx + slotIdx).replace(/\{dest\}/g, destCity);
      const baseCost = Math.round(((dailyCost / 3) * multiplier) * (0.6 + ((dayIdx + slotIdx) % 3) * 0.25));

      return {
        id: makeId('act'),
        title,
        category: cat,
        location: destCity,
        description: `Enjoy ${title.toLowerCase()} — a highlight suited to your ${(req.companionStyle ?? 'travel').toLowerCase()} trip style.`,
        estimatedDuration: slot === 'Morning' ? '2.5 hrs' : slot === 'Afternoon' ? '3 hrs' : '2 hrs',
        estimatedCost: baseCost,
        timeOfDay: slot,
        lat: baseLat + (Math.random() - 0.5) * 0.06,
        lng: baseLng + (Math.random() - 0.5) * 0.06,
      };
    });

    return {
      dayNumber: dayIdx + 1,
      title: dayIdx === 0 ? `Arrival & First Impressions of ${destCity}` : `${destCity} — Day ${dayIdx + 1} Highlights`,
      activities,
    };
  });

  const estimatedCostUSD = Math.round(days.reduce((sum, d) => sum + d.activities.reduce((s, a) => s + a.estimatedCost, 0), 0) + 120 * multiplier);

  const packingList: PackingItem[] = [
    { id: makeId('p'), category: 'Essentials', item: 'Passport & travel documents', packed: false },
    { id: makeId('p'), category: 'Electronics', item: 'Phone charger & portable battery', packed: false },
    { id: makeId('p'), category: 'Clothing', item: 'Comfortable walking shoes', packed: false },
    { id: makeId('p'), category: 'Documents', item: 'Travel insurance printout', packed: false },
    { id: makeId('p'), category: 'Toiletries', item: 'Basic toiletry kit', packed: false },
  ];

  return {
    id: makeId('it'),
    title: `${req.durationDays} Days in ${destCity}: ${prefs.slice(0, 2).join(' & ')} Adventure`,
    destination: destCity,
    country: destCountry,
    flagEmoji: flag,
    coverImage: match?.image ?? 'https://images.unsplash.com/photo-1488646953014-85cb44e25828?auto=format&fit=crop&w=1200&q=80',
    summary: `An AI-drafted ${req.durationDays}-day ${req.season.toLowerCase()} itinerary for ${destCity}, tailored around ${prefs.slice(0, 3).join(', ').toLowerCase()} for ${(req.companionStyle ?? 'Solo').toLowerCase()} travel.`,
    durationDays: req.durationDays,
    season: req.season,
    preferences: prefs,
    companionStyle: req.companionStyle,
    estimatedCostUSD,
    transportation: 'Local transit pass + walking',
    weatherForecast: `Typical ${req.season} conditions for ${destCity}`,
    packingList,
    days,
    creatorId: userId,
    creatorName: userName,
    creatorAvatar: userAvatar,
    likesCount: 0,
    bookmarksCount: 0,
    viewsCount: 0,
    rating: 0,
    ratingsCount: 0,
    isPublished: true,
    comments: [],
    updatedAt: 'Just now',
  };
}
