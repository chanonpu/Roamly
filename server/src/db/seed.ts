import { Destination, TravelItinerary, UserProfile, Currency } from '../types/travel.js';

export const CURRENCIES: Currency[] = [
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

export const DESTINATIONS: Destination[] = [
  {
    id: 'tokyo-japan', city: 'Tokyo', country: 'Japan', flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Tokyo (GMT+9)', bestSeason: 'Spring (Cherry Blossoms) & Autumn', avgDailyCostUSD: 140,
    lat: 35.6762, lng: 139.6503,
    description: 'A mesmerizing fusion of futuristic skyscrapers, serene ancient temples, neon nightlife, and world-class culinary art.',
    popularTags: ['City', 'Food', 'Anime', 'Shopping', 'Museum', 'Architecture'],
  },
  {
    id: 'kyoto-japan', city: 'Kyoto', country: 'Japan', flag: '🇯🇵',
    image: 'https://images.unsplash.com/photo-1493976040374-85c8e12f0c0e?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Tokyo (GMT+9)', bestSeason: 'Autumn (Foliage) & Spring', avgDailyCostUSD: 120,
    lat: 35.0116, lng: 135.7681,
    description: 'Japan\u2019s cultural heart filled with thousands of classical Buddhist temples, gardens, imperial palaces, Shinto shrines, and traditional wooden houses.',
    popularTags: ['History', 'Photography', 'Nature', 'Romantic', 'Hidden Gems'],
  },
  {
    id: 'paris-france', city: 'Paris', country: 'France', flag: '🇫🇷',
    image: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Europe/Paris (GMT+2)', bestSeason: 'Spring & Autumn', avgDailyCostUSD: 180,
    lat: 48.8566, lng: 2.3522,
    description: 'The City of Light, famed for iconic monuments, legendary art galleries, cozy sidewalk cafes, haute cuisine, and timeless romance.',
    popularTags: ['Museum', 'Romantic', 'Architecture', 'Food', 'Cafe', 'Shopping', 'Luxury'],
  },
  {
    id: 'reykjavik-iceland', city: 'Reykjavik & Golden Circle', country: 'Iceland', flag: '🇮🇸',
    image: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Atlantic/Reykjavik (GMT+0)', bestSeason: 'Summer (Midnight Sun) & Winter (Northern Lights)', avgDailyCostUSD: 210,
    lat: 64.1466, lng: -21.9426,
    description: 'A land of volcanic wonders, thermal lagoons, roaring waterfalls, dramatic fjords, and ethereal Northern Lights displays.',
    popularTags: ['Nature', 'Mountain', 'Adventure', 'Photography', 'Road Trip', 'Camping'],
  },
  {
    id: 'sydney-australia', city: 'Sydney', country: 'Australia', flag: '🇦🇺',
    image: 'https://images.unsplash.com/photo-1506973035872-a4ec16b8e8d9?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Australia/Sydney (GMT+10)', bestSeason: 'Spring & Summer (Sept - Feb)', avgDailyCostUSD: 165,
    lat: -33.8688, lng: 151.2093,
    description: 'Dynamic harbor city famous for the Opera House, sun-kissed beaches, coastal walks, and vibrant coffee culture.',
    hasWarning: true, warningKey: 'australia',
    popularTags: ['Beach', 'City', 'Nature', 'Cafe', 'Photography', 'Adventure'],
  },
  {
    id: 'zurich-switzerland', city: 'Zurich & Interlaken', country: 'Switzerland', flag: '🇨🇭',
    image: 'https://images.unsplash.com/photo-1530122037265-a5f1f91d3b99?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Europe/Zurich (GMT+2)', bestSeason: 'Summer (Hiking) & Winter (Skiing)', avgDailyCostUSD: 280,
    lat: 47.3769, lng: 8.5417,
    description: 'Breathtaking Alpine panoramas, crystal-clear mountain lakes, luxury watchmaking, gourmet chocolate, and scenic mountain trains.',
    hasWarning: true, warningKey: 'switzerland',
    popularTags: ['Mountain', 'Nature', 'Luxury', 'Hiking', 'Photography', 'Romantic'],
  },
  {
    id: 'rome-italy', city: 'Rome', country: 'Italy', flag: '🇮🇹',
    image: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Europe/Rome (GMT+2)', bestSeason: 'Spring & Autumn', avgDailyCostUSD: 150,
    lat: 41.9028, lng: 12.4964,
    description: 'An open-air living museum packed with ancient Roman ruins, Renaissance masterpieces, bustling piazzas, and mouthwatering pasta.',
    popularTags: ['History', 'Food', 'Architecture', 'Museum', 'Romantic'],
  },
  {
    id: 'pyongyang-nk', city: 'Pyongyang', country: 'North Korea', flag: '🇰🇵',
    image: 'https://images.unsplash.com/photo-1541872703-74c5e44368f9?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Pyongyang (GMT+9)', bestSeason: 'Autumn', avgDailyCostUSD: 250,
    lat: 39.0392, lng: 125.7625,
    description: 'A tightly controlled capital city featuring monumental socialist classicism architecture and guided state tours.',
    hasWarning: true, warningKey: 'north_korea',
    popularTags: ['History', 'Hidden Gems', 'Architecture'],
  },
  {
    id: 'antarctica-base', city: 'McMurdo & Peninsula', country: 'Antarctica', flag: '🇦🇶',
    image: 'https://images.unsplash.com/photo-1517411032315-54ef2cb783bb?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Antarctica/McMurdo (GMT+12)', bestSeason: 'Austral Summer (Nov - Mar)', avgDailyCostUSD: 850,
    lat: -77.846, lng: 166.676,
    description: 'The ultimate white wilderness on Earth. Towering blue icebergs, polar wildlife expeditions, and pristine silence.',
    hasWarning: true, warningKey: 'antarctica',
    popularTags: ['Adventure', 'Nature', 'Photography', 'Camping'],
  },
  {
    id: 'mars-olympus', city: 'Olympus Mons Sector', country: 'Mars', flag: '🚀',
    image: 'https://images.unsplash.com/photo-1614728894747-a83421e2b9c9?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Mars/UTC-Sol', bestSeason: 'Dust Storm Free Sol Season', avgDailyCostUSD: 50000,
    lat: 18.65, lng: -133.8,
    description: 'Home to the largest volcano in the Solar System. Red dust, low gravity, sub-zero air, and spectacular extraterrestrial sunsets.',
    hasWarning: true, warningKey: 'mars',
    popularTags: ['Adventure', 'Mountain', 'Photography', 'Hidden Gems'],
  },
  {
    id: 'bangkok-thailand', city: 'Bangkok', country: 'Thailand', flag: '🇹🇭',
    image: 'https://images.unsplash.com/photo-1563492065599-3520f775eeed?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Bangkok (GMT+7)', bestSeason: 'Cool Season (Nov - Feb)', avgDailyCostUSD: 60,
    lat: 13.7563, lng: 100.5018,
    description: 'Glittering golden temples, legendary street food, floating markets, rooftop bars, and a riverside energy that never sleeps.',
    popularTags: ['Food', 'City', 'History', 'Nightlife', 'Shopping', 'Budget'],
  },
  {
    id: 'singapore-singapore', city: 'Singapore', country: 'Singapore', flag: '🇸🇬',
    image: 'https://images.unsplash.com/photo-1525625293386-3f8f99389edd?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Singapore (GMT+8)', bestSeason: 'Year-round (Feb - Apr driest)', avgDailyCostUSD: 170,
    lat: 1.2834, lng: 103.8607,
    description: 'A spotless garden city of futuristic skylines, supertree groves, world-famous hawker food, and family-friendly island resorts.',
    popularTags: ['City', 'Food', 'Family', 'Architecture', 'Theme Park', 'Shopping'],
  },
  {
    id: 'london-uk', city: 'London', country: 'United Kingdom', flag: '🇬🇧',
    image: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Europe/London (GMT+1)', bestSeason: 'Late Spring & Summer (May - Sept)', avgDailyCostUSD: 200,
    lat: 51.5072, lng: -0.1276,
    description: 'Royal palaces, world-class free museums, historic pubs, West End theatre, and leafy parks along the River Thames.',
    popularTags: ['History', 'Museum', 'City', 'Shopping', 'Architecture', 'Nightlife'],
  },
  {
    id: 'newyork-usa', city: 'New York City', country: 'United States', flag: '🇺🇸',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=1200&q=80',
    timezone: 'America/New_York (GMT-4)', bestSeason: 'Autumn & Late Spring', avgDailyCostUSD: 250,
    lat: 40.7128, lng: -74.006,
    description: 'The city that never sleeps: iconic skyscrapers, Broadway shows, Central Park, legendary pizza, and neighborhoods with endless character.',
    popularTags: ['City', 'Food', 'Museum', 'Shopping', 'Nightlife', 'Architecture'],
  },
  {
    id: 'bali-indonesia', city: 'Bali', country: 'Indonesia', flag: '🇮🇩',
    image: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Makassar (GMT+8)', bestSeason: 'Dry Season (Apr - Oct)', avgDailyCostUSD: 80,
    lat: -8.4095, lng: 115.1889,
    description: 'Emerald rice terraces, cliffside temples, surf beaches, jungle yoga retreats, and spectacular Indian Ocean sunsets.',
    popularTags: ['Beach', 'Nature', 'Romantic', 'Adventure', 'Photography', 'Budget'],
  },
  {
    id: 'barcelona-spain', city: 'Barcelona', country: 'Spain', flag: '🇪🇸',
    image: 'https://images.unsplash.com/photo-1583422409516-2895a77efded?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Europe/Madrid (GMT+2)', bestSeason: 'Late Spring & Early Autumn', avgDailyCostUSD: 150,
    lat: 41.3874, lng: 2.1686,
    description: 'Gaudí’s surreal architecture, Gothic alleys, late-night tapas, Mediterranean beaches, and a buzzing Catalan street life.',
    popularTags: ['Architecture', 'Food', 'Beach', 'Nightlife', 'History', 'City'],
  },
  {
    id: 'seoul-southkorea', city: 'Seoul', country: 'South Korea', flag: '🇰🇷',
    image: 'https://images.unsplash.com/photo-1538485399081-7191377e8241?auto=format&fit=crop&w=1200&q=80',
    timezone: 'Asia/Seoul (GMT+9)', bestSeason: 'Spring & Autumn', avgDailyCostUSD: 120,
    lat: 37.5665, lng: 126.978,
    description: 'Joseon-era palaces beside neon shopping districts, sizzling Korean BBQ, K-pop culture, and bustling night markets.',
    popularTags: ['City', 'Food', 'History', 'Shopping', 'Nightlife', 'Cafe'],
  },
];

export const CURRENT_USER: UserProfile = {
  id: 'user_me',
  name: 'Alex Rover',
  username: 'alexrover',
  avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=200&q=80',
  bio: 'Digital nomad, photographer, and espresso enthusiast. 24 countries and counting! \ud83c\udf0d\ud83d\udcf7',
  visitedCountries: ['Japan', 'France', 'Italy', 'Iceland', 'United States', 'Spain', 'Germany', 'Thailand', 'Vietnam', 'Canada'],
  plannedCountries: ['Switzerland', 'Australia', 'Peru', 'Norway', 'Egypt'],
  followersCount: 384,
  followingCount: 192,
  achievements: [
    { id: 'ach_1', title: 'Globe Trotter', description: 'Visited 10 or more different countries across 3 continents.', icon: '🌍', unlockedAt: '2025-04-12' },
    { id: 'ach_2', title: 'AI Master Planner', description: 'Generated 5 custom itineraries using Roamly AI.', icon: '🤖', unlockedAt: '2026-01-10' },
    { id: 'ach_3', title: 'Fork Conqueror', description: 'Forked and tailored 3 community travel plans.', icon: '🍴', unlockedAt: '2026-03-22' },
    { id: 'ach_4', title: 'Social Voyager', description: 'Gained over 100 likes on published itineraries.', icon: '⭐', unlockedAt: '2026-05-18' },
  ],
};

// Every plan has one entry in `days` per durationDays. The frontend's
// mockData.ts (offline fallback) mirrors DESTINATIONS and INITIAL_ITINERARIES.
export const INITIAL_ITINERARIES: TravelItinerary[] = [
  {
    id: 'tokyo-7day-ultimate',
    title: '7 Days in Tokyo: Neon Lights, Temples & Culinary Delights',
    destination: 'Tokyo', country: 'Japan', flagEmoji: '🇯🇵',
    coverImage: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1200&q=80',
    summary: 'Experience Tokyo\u2019s duality\u2014from the tranquil Meiji Shrine and Senso-ji Temple to the vibrant electronic districts of Akihabara and Michelin-starred ramen joints.',
    durationDays: 7, season: 'Spring',
    preferences: ['City', 'Food', 'Anime', 'Shopping', 'History'],
    companionStyle: 'Friends', estimatedCostUSD: 1450,
    transportation: 'Pasmo/Suica Card + JR Yamanote Subway Line',
    weatherForecast: 'Mild Spring 18°C (64°F), clear skies with cherry blossoms in bloom',
    creatorId: 'user_kenji', creatorName: 'Kenji Takahashi',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likesCount: 342, bookmarksCount: 189, viewsCount: 4200, rating: 4.9, ratingsCount: 58,
    isPublished: true, updatedAt: '2 days ago',
    packingList: [
      { id: 'p1', category: 'Essentials', item: 'Passport & Japan Rail Pass voucher', packed: true },
      { id: 'p2', category: 'Electronics', item: 'Portable Power Bank (10,000mAh)', packed: true },
      { id: 'p3', category: 'Clothing', item: 'Comfortable Walking Shoes (15k steps/day)', packed: true },
      { id: 'p4', category: 'Documents', item: 'Suica/Pasmo Card on Apple Wallet', packed: false },
      { id: 'p5', category: 'Toiletries', item: 'Compact Folding Umbrella', packed: false },
    ],
    comments: [
      { id: 'c1', userId: 'user_maya', userName: 'Maya Lin', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', content: 'Followed this itinerary last week! The ramen recommendation in Shinjuku was mind-blowing.', rating: 5, createdAt: '3 days ago' },
      { id: 'c2', userId: 'user_david', userName: 'David Miller', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', content: 'Pro tip: book the TeamLab Planets tickets at least 3 weeks in advance. Awesome guide!', rating: 5, createdAt: '5 days ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Arrival & Shibuya Crossing Spectacle',
        activities: [
          { id: 'act_1_1', title: 'Hotel Check-in & Rest in Shinjuku', category: 'Hotel', location: 'Shinjuku, Tokyo', description: 'Settle into your hotel, get fresh, and pick up your pocket Wi-Fi router.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 35.6938, lng: 139.7034, googleMapsUrl: 'https://maps.google.com/?q=Shinjuku+Tokyo' },
          { id: 'act_1_2', title: 'Meiji Jingu Shrine & Harajuku Takeshita Street', category: 'History', location: 'Shibuya City, Tokyo', description: 'Stroll through serene forest paths to the majestic Shinto shrine, then walk down vibrant Takeshita Street for quirky street food.', estimatedDuration: '3 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 35.6764, lng: 139.6993, googleMapsUrl: 'https://maps.google.com/?q=Meiji+Jingu' },
          { id: 'act_1_3', title: 'Shibuya Scramble Crossing & Shibuya Sky Sunset', category: 'City', location: 'Shibuya, Tokyo', description: 'Cross the busiest intersection on earth and head up to Shibuya Sky open-air observation deck for a panoramic 360° night view.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: 35.6595, lng: 139.7004, googleMapsUrl: 'https://maps.google.com/?q=Shibuya+Sky' },
        ],
      },
      {
        dayNumber: 2, title: 'Historic Asakusa & Futuristic Odaiba',
        activities: [
          { id: 'act_2_1', title: 'Senso-ji Temple & Nakamise Shopping Street', category: 'Museum', location: 'Asakusa, Tokyo', description: 'Explore Tokyo\u2019s oldest Buddhist temple, smell the incense, and try traditional matcha snacks.', estimatedDuration: '2.5 hrs', estimatedCost: 10, timeOfDay: 'Morning', lat: 35.7148, lng: 139.7967, googleMapsUrl: 'https://maps.google.com/?q=Sensoji+Temple' },
          { id: 'act_2_2', title: 'Tokyo Skytree Observation & Lunch', category: 'City', location: 'Sumida, Tokyo', description: 'Ascend Japan\u2019s tallest structure and enjoy a delicious tonkatsu lunch at Solamachi Mall.', estimatedDuration: '2 hrs', estimatedCost: 35, timeOfDay: 'Afternoon', lat: 35.7101, lng: 139.8107, googleMapsUrl: 'https://maps.google.com/?q=Tokyo+Skytree' },
          { id: 'act_2_3', title: 'TeamLab Planets Digital Art Museum', category: 'Museum', location: 'Toyosu, Tokyo', description: 'Walk through water and immersive light projection rooms in this iconic world-class digital art sanctuary.', estimatedDuration: '2 hrs', estimatedCost: 32, timeOfDay: 'Evening', lat: 35.6491, lng: 139.7898, googleMapsUrl: 'https://maps.google.com/?q=TeamLab+Planets' },
        ],
      },
      {
        dayNumber: 3, title: 'Ueno Museums & Akihabara Electric Town',
        activities: [
          { id: 'act_3_1', title: 'Ueno Park & Tokyo National Museum', category: 'Museum', location: 'Ueno, Tokyo', description: 'Wander the leafy park and see samurai armor, katana, and ukiyo-e prints in Japan’s oldest museum.', estimatedDuration: '3 hrs', estimatedCost: 8, timeOfDay: 'Morning', lat: 35.7188, lng: 139.7765, googleMapsUrl: 'https://maps.google.com/?q=Tokyo+National+Museum' },
          { id: 'act_3_2', title: 'Ameyoko Market Street Food Lunch', category: 'Food', location: 'Ueno, Tokyo', description: 'Graze on grilled seafood skewers, fresh fruit, and takoyaki along this lively post-war market alley.', estimatedDuration: '1.5 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 35.7101, lng: 139.7745, googleMapsUrl: 'https://maps.google.com/?q=Ameyoko+Market' },
          { id: 'act_3_3', title: 'Akihabara Anime Shops & Retro Arcades', category: 'Anime', location: 'Akihabara, Tokyo', description: 'Dive into multi-story manga stores, capsule-toy walls, and retro game arcades under glowing neon signs.', estimatedDuration: '3 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 35.6984, lng: 139.7731, googleMapsUrl: 'https://maps.google.com/?q=Akihabara' },
        ],
      },
      {
        dayNumber: 4, title: 'Tsukiji Breakfast, Ginza Glamour & Tokyo Tower',
        activities: [
          { id: 'act_4_1', title: 'Tsukiji Outer Market Sushi Breakfast', category: 'Food', location: 'Tsukiji, Tokyo', description: 'Start early with ultra-fresh sushi, tamagoyaki omelette, and matcha at the legendary outer market stalls.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: 35.6655, lng: 139.7707, googleMapsUrl: 'https://maps.google.com/?q=Tsukiji+Outer+Market' },
          { id: 'act_4_2', title: 'Ginza Flagship Stores & Kabuki-za', category: 'Shopping', location: 'Ginza, Tokyo', description: 'Browse luxury flagships and the Itoya stationery tower, then catch a single act of kabuki theatre.', estimatedDuration: '3.5 hrs', estimatedCost: 25, timeOfDay: 'Afternoon', lat: 35.6717, lng: 139.7650, googleMapsUrl: 'https://maps.google.com/?q=Ginza+Tokyo' },
          { id: 'act_4_3', title: 'Tokyo Tower Night Views & Zojo-ji Temple', category: 'City', location: 'Minato, Tokyo', description: 'See the illuminated orange tower rise behind the ancient Zojo-ji temple gate, then ride up for city lights.', estimatedDuration: '2 hrs', estimatedCost: 12, timeOfDay: 'Evening', lat: 35.6586, lng: 139.7454, googleMapsUrl: 'https://maps.google.com/?q=Tokyo+Tower' },
        ],
      },
      {
        dayNumber: 5, title: 'Hakone Day Trip: Hot Springs & Mt. Fuji Views',
        activities: [
          { id: 'act_5_1', title: 'Romancecar Train to Hakone & Lake Ashi Cruise', category: 'Nature', location: 'Hakone, Kanagawa', description: 'Ride the scenic express from Shinjuku, then sail Lake Ashi on a pirate ship with Mt. Fuji on clear days.', estimatedDuration: '3 hrs', estimatedCost: 55, timeOfDay: 'Morning', lat: 35.2048, lng: 139.0246, googleMapsUrl: 'https://maps.google.com/?q=Lake+Ashi' },
          { id: 'act_5_2', title: 'Owakudani Volcanic Valley Ropeway', category: 'Adventure', location: 'Hakone, Kanagawa', description: 'Glide over steaming sulfur vents and taste the famous black eggs said to add seven years to your life.', estimatedDuration: '2 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: 35.2443, lng: 139.0197, googleMapsUrl: 'https://maps.google.com/?q=Owakudani' },
          { id: 'act_5_3', title: 'Onsen Soak at Tenzan Tohji-kyo', category: 'Nature', location: 'Yumoto, Hakone', description: 'Unwind in open-air hot spring pools set in the forest before the train back to Tokyo.', estimatedDuration: '2 hrs', estimatedCost: 15, timeOfDay: 'Evening', lat: 35.2269, lng: 139.0920, googleMapsUrl: 'https://maps.google.com/?q=Tenzan+Tohji-kyo' },
        ],
      },
      {
        dayNumber: 6, title: 'Ghibli Magic & Shimokitazawa Vintage',
        activities: [
          { id: 'act_6_1', title: 'Ghibli Museum, Mitaka', category: 'Anime', location: 'Mitaka, Tokyo', description: 'Step into Hayao Miyazaki’s whimsical world with exclusive short films and the rooftop Laputa robot.', estimatedDuration: '2.5 hrs', estimatedCost: 8, timeOfDay: 'Morning', lat: 35.6962, lng: 139.5704, googleMapsUrl: 'https://maps.google.com/?q=Ghibli+Museum' },
          { id: 'act_6_2', title: 'Inokashira Park Boat Ride', category: 'Nature', location: 'Kichijoji, Tokyo', description: 'Paddle a swan boat across the pond and grab yakitori at the famous Iseya stall nearby.', estimatedDuration: '1.5 hrs', estimatedCost: 12, timeOfDay: 'Afternoon', lat: 35.6997, lng: 139.5728, googleMapsUrl: 'https://maps.google.com/?q=Inokashira+Park' },
          { id: 'act_6_3', title: 'Shimokitazawa Thrift Shops & Live Music Bars', category: 'Nightlife', location: 'Shimokitazawa, Tokyo', description: 'Hunt for vintage jackets and vinyl, then catch an indie gig in a tiny basement live house.', estimatedDuration: '3 hrs', estimatedCost: 35, timeOfDay: 'Evening', lat: 35.6614, lng: 139.6680, googleMapsUrl: 'https://maps.google.com/?q=Shimokitazawa' },
        ],
      },
      {
        dayNumber: 7, title: 'Imperial Gardens & Golden Gai Farewell',
        activities: [
          { id: 'act_7_1', title: 'Imperial Palace East Gardens', category: 'History', location: 'Chiyoda, Tokyo', description: 'Walk among stone walls and moats of the former Edo Castle, now a peaceful public garden.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 35.6852, lng: 139.7528, googleMapsUrl: 'https://maps.google.com/?q=Imperial+Palace+East+Gardens' },
          { id: 'act_7_2', title: 'Shinjuku Gyoen National Garden', category: 'Nature', location: 'Shinjuku, Tokyo', description: 'Picnic beneath cherry trees in a garden blending Japanese, French, and English landscape styles.', estimatedDuration: '2 hrs', estimatedCost: 4, timeOfDay: 'Afternoon', lat: 35.6852, lng: 139.7100, googleMapsUrl: 'https://maps.google.com/?q=Shinjuku+Gyoen' },
          { id: 'act_7_3', title: 'Omoide Yokocho & Golden Gai Bar Hop', category: 'Nightlife', location: 'Shinjuku, Tokyo', description: 'Toast your final night in smoky yakitori alleys and pocket-sized bars seating just six guests.', estimatedDuration: '3 hrs', estimatedCost: 50, timeOfDay: 'Evening', lat: 35.6938, lng: 139.7036, googleMapsUrl: 'https://maps.google.com/?q=Golden+Gai' },
        ],
      },
    ],
  },
  {
    id: 'paris-5day-romantic',
    title: '5 Days in Paris: Art, Gastronomy & Seine River Romance',
    destination: 'Paris', country: 'France', flagEmoji: '🇫🇷',
    coverImage: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?auto=format&fit=crop&w=1200&q=80',
    summary: 'Soak in the timeless elegance of Paris with Louvre museum passes, Montmartre artists plazas, freshly baked croissants, and an evening sunset cruise along the Seine.',
    durationDays: 5, season: 'Spring',
    preferences: ['Museum', 'Romantic', 'Architecture', 'Food', 'Cafe'],
    companionStyle: 'Couple', estimatedCostUSD: 1650,
    transportation: 'Paris Metro Day Pass & Walking',
    weatherForecast: 'Mild & Sunny 16°C (61°F) with light breeze',
    creatorId: 'user_sophie', creatorName: 'Sophie Laurent',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    likesCount: 512, bookmarksCount: 310, viewsCount: 6800, rating: 4.95, ratingsCount: 84,
    isPublished: true, updatedAt: '1 day ago',
    packingList: [
      { id: 'pp1', category: 'Clothing', item: 'Stylish Trench Coat & Scarf', packed: true },
      { id: 'pp2', category: 'Essentials', item: 'Museum Pass 4-day ticket', packed: true },
      { id: 'pp3', category: 'Clothing', item: 'Comfortable Leather Walking Shoes', packed: false },
    ],
    comments: [
      { id: 'cp1', userId: 'user_alex', userName: 'Alex Rivers', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', content: 'The sunset spot near Sacré-Cœur was unforgettable! Thanks Sophie.', rating: 5, createdAt: '4 days ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Monuments of Light & Eiffel Tower Sparkle',
        activities: [
          { id: 'pact_1', title: 'Louvre Museum Masterpieces Tour', category: 'Museum', location: '1st Arrondissement, Paris', description: 'Marvel at the Mona Lisa, Venus de Milo, and Winged Victory of Samothrace in the world\u2019s largest art museum.', estimatedDuration: '3 hrs', estimatedCost: 22, timeOfDay: 'Morning', lat: 48.8606, lng: 2.3376, googleMapsUrl: 'https://maps.google.com/?q=Louvre+Museum' },
          { id: 'pact_2', title: 'Tuileries Garden Picnic & Cafe de Flore Lunch', category: 'Cafe', location: 'Saint-Germain-des-Pr\u00e9s, Paris', description: 'Enjoy fresh baguette, brie cheese, and macaroons in Tuileries before sipping coffee at classic Parisian cafes.', estimatedDuration: '2.5 hrs', estimatedCost: 35, timeOfDay: 'Afternoon', lat: 48.8634, lng: 2.3275, googleMapsUrl: 'https://maps.google.com/?q=Tuileries+Garden' },
          { id: 'pact_3', title: 'Trocad\u00e9ro View & Eiffel Tower Light Show', category: 'Romantic', location: '7th Arrondissement, Paris', description: 'Watch the Eiffel Tower light up in sparkling diamonds at the turn of every hour.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Evening', lat: 48.8584, lng: 2.2945, googleMapsUrl: 'https://maps.google.com/?q=Eiffel+Tower' },
        ],
      },
      {
        dayNumber: 2, title: 'Montmartre Artists & Sacr\u00e9-C\u0153ur Sunset',
        activities: [
          { id: 'pact_4', title: 'Boulangerie Breakfast & Rue Cler Market', category: 'Food', location: '7th Arrondissement, Paris', description: 'Grab warm croissants and pain au chocolat, then browse cheese, fruit, and flower stalls on a classic market street.', estimatedDuration: '1.5 hrs', estimatedCost: 15, timeOfDay: 'Morning', lat: 48.8565, lng: 2.3060, googleMapsUrl: 'https://maps.google.com/?q=Rue+Cler' },
          { id: 'pact_5', title: 'Place du Tertre Painters & Montmartre Lanes', category: 'Hidden Gems', location: 'Montmartre, Paris', description: 'Watch portrait artists at work and wander cobbled lanes past the Moulin de la Galette windmill.', estimatedDuration: '3 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: 48.8865, lng: 2.3408, googleMapsUrl: 'https://maps.google.com/?q=Place+du+Tertre' },
          { id: 'pact_6', title: 'Sacr\u00e9-C\u0153ur Steps Sunset & Bistro Dinner', category: 'Romantic', location: 'Montmartre, Paris', description: 'Watch the city turn gold from the basilica steps, then share coq au vin in a candlelit bistro.', estimatedDuration: '3 hrs', estimatedCost: 70, timeOfDay: 'Evening', lat: 48.8867, lng: 2.3431, googleMapsUrl: 'https://maps.google.com/?q=Sacre+Coeur' },
        ],
      },
      {
        dayNumber: 3, title: 'Impressionists & a Seine River Cruise',
        activities: [
          { id: 'pact_7', title: 'Mus\u00e9e d\u2019Orsay Impressionist Galleries', category: 'Museum', location: '7th Arrondissement, Paris', description: 'See Monet, Renoir, and Van Gogh inside a grand Beaux-Arts railway station with a giant clock window.', estimatedDuration: '3 hrs', estimatedCost: 18, timeOfDay: 'Morning', lat: 48.8600, lng: 2.3266, googleMapsUrl: 'https://maps.google.com/?q=Musee+d+Orsay' },
          { id: 'pact_8', title: 'Saint-Germain Caf\u00e9s & Luxembourg Gardens', category: 'Cafe', location: '6th Arrondissement, Paris', description: 'Linger over caf\u00e9 cr\u00e8me at Les Deux Magots, then stroll among fountains and green chairs in the Luxembourg Gardens.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: 48.8462, lng: 2.3372, googleMapsUrl: 'https://maps.google.com/?q=Jardin+du+Luxembourg' },
          { id: 'pact_9', title: 'Seine Sunset Cruise', category: 'Romantic', location: 'Pont Neuf, Paris', description: 'Glide past Notre-Dame, the Louvre, and the Eiffel Tower as the bridges light up at dusk.', estimatedDuration: '1.5 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: 48.8577, lng: 2.3410, googleMapsUrl: 'https://maps.google.com/?q=Vedettes+du+Pont+Neuf' },
        ],
      },
      {
        dayNumber: 4, title: 'Versailles Day Trip',
        activities: [
          { id: 'pact_10', title: 'Palace of Versailles & Hall of Mirrors', category: 'History', location: 'Versailles, France', description: 'Tour the opulent royal apartments and the dazzling Hall of Mirrors where the WWI treaty was signed.', estimatedDuration: '3 hrs', estimatedCost: 21, timeOfDay: 'Morning', lat: 48.8049, lng: 2.1204, googleMapsUrl: 'https://maps.google.com/?q=Palace+of+Versailles' },
          { id: 'pact_11', title: 'Versailles Gardens by Bike & Marie Antoinette\u2019s Hamlet', category: 'Nature', location: 'Versailles, France', description: 'Rent bikes to cruise the Grand Canal and discover the queen\u2019s storybook rustic village.', estimatedDuration: '3 hrs', estimatedCost: 25, timeOfDay: 'Afternoon', lat: 48.8159, lng: 2.1092, googleMapsUrl: 'https://maps.google.com/?q=Hameau+de+la+Reine' },
          { id: 'pact_12', title: 'Dinner in Le Marais', category: 'Food', location: 'Le Marais, Paris', description: 'Back in the city, enjoy falafel on Rue des Rosiers or a natural-wine bistro in this historic quarter.', estimatedDuration: '2 hrs', estimatedCost: 45, timeOfDay: 'Evening', lat: 48.8575, lng: 2.3592, googleMapsUrl: 'https://maps.google.com/?q=Le+Marais' },
        ],
      },
      {
        dayNumber: 5, title: '\u00cele de la Cit\u00e9 & Farewell Views',
        activities: [
          { id: 'pact_13', title: 'Sainte-Chapelle Stained Glass', category: 'Architecture', location: '\u00cele de la Cit\u00e9, Paris', description: 'Be bathed in color from 1,113 stained-glass panels in this Gothic jewel box chapel.', estimatedDuration: '1.5 hrs', estimatedCost: 13, timeOfDay: 'Morning', lat: 48.8554, lng: 2.3450, googleMapsUrl: 'https://maps.google.com/?q=Sainte-Chapelle' },
          { id: 'pact_14', title: 'Shakespeare and Company & Latin Quarter', category: 'Hidden Gems', location: '5th Arrondissement, Paris', description: 'Browse the legendary English bookshop facing Notre-Dame and lunch on crepes in the Latin Quarter.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: 48.8526, lng: 2.3471, googleMapsUrl: 'https://maps.google.com/?q=Shakespeare+and+Company' },
          { id: 'pact_15', title: 'Arc de Triomphe Rooftop & Champs-\u00c9lys\u00e9es', category: 'City', location: '8th Arrondissement, Paris', description: 'Climb to the rooftop for a starburst view of avenues, then stroll the illuminated Champs-\u00c9lys\u00e9es.', estimatedDuration: '2 hrs', estimatedCost: 16, timeOfDay: 'Evening', lat: 48.8738, lng: 2.2950, googleMapsUrl: 'https://maps.google.com/?q=Arc+de+Triomphe' },
        ],
      },
    ],
  },
  {
    id: 'iceland-7day-ringroad',
    title: '7 Days Iceland Ring Road: Waterfalls, Glaciers & Northern Lights',
    destination: 'Reykjavik & Golden Circle', country: 'Iceland', flagEmoji: '🇮🇸',
    coverImage: 'https://images.unsplash.com/photo-1504893524553-b855bce32c67?auto=format&fit=crop&w=1200&q=80',
    summary: 'Embark on an epic road trip past dramatic geysers, black sand beaches, iceberg lagoons, thermal springs, and volcanic craters.',
    durationDays: 7, season: 'Autumn',
    preferences: ['Nature', 'Mountain', 'Adventure', 'Road Trip', 'Photography'],
    companionStyle: 'Solo', estimatedCostUSD: 1890,
    transportation: '4x4 Camper Van / Car Rental',
    weatherForecast: 'Crisp Autumn 6°C (43°F), occasional rain & clear night skies for Aurora',
    creatorId: 'user_erik', creatorName: 'Erik Lindqvist',
    creatorAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80',
    likesCount: 620, bookmarksCount: 410, viewsCount: 8900, rating: 4.98, ratingsCount: 112,
    isPublished: true, updatedAt: '3 days ago',
    packingList: [
      { id: 'ip1', category: 'Clothing', item: 'Thermal Base Layers & Waterproof Jacket', packed: true },
      { id: 'ip2', category: 'Electronics', item: 'Camera Tripod for Northern Lights long exposure', packed: true },
      { id: 'ip3', category: 'Toiletries', item: 'Quick-dry towel for thermal hot springs', packed: true },
    ],
    comments: [],
    days: [
      {
        dayNumber: 1, title: 'Golden Circle Exploration & Blue Lagoon Soak',
        activities: [
          { id: 'iact_1', title: 'Thingvellir National Park Tectonic Rift', category: 'Nature', location: 'Golden Circle, Iceland', description: 'Walk between the North American and Eurasian tectonic plates in a UNESCO World Heritage valley.', estimatedDuration: '2.5 hrs', estimatedCost: 10, timeOfDay: 'Morning', lat: 64.2559, lng: -21.1299, googleMapsUrl: 'https://maps.google.com/?q=Thingvellir+National+Park' },
          { id: 'iact_2', title: 'Gullfoss Waterfall & Strokkur Geysir', category: 'Adventure', location: 'Haukadalur, Iceland', description: 'Witness boiling water erupting 30 meters into the sky every 8 minutes at Geysir, followed by roaring Gullfoss cascades.', estimatedDuration: '2.5 hrs', estimatedCost: 0, timeOfDay: 'Afternoon', lat: 64.3271, lng: -20.1199, googleMapsUrl: 'https://maps.google.com/?q=Gullfoss' },
          { id: 'iact_3', title: 'Geothermal Bathing at Blue Lagoon', category: 'Nature', location: 'Grindavik, Iceland', description: 'Relax in mineral-rich milky blue waters surrounded by black lava fields.', estimatedDuration: '3 hrs', estimatedCost: 85, timeOfDay: 'Evening', lat: 63.8804, lng: -22.4495, googleMapsUrl: 'https://maps.google.com/?q=Blue+Lagoon+Iceland' },
        ],
      },
      {
        dayNumber: 2, title: 'South Coast Waterfalls & Black Sand Beach',
        activities: [
          { id: 'iact_4', title: 'Seljalandsfoss Walk-Behind Waterfall', category: 'Nature', location: 'South Coast, Iceland', description: 'Follow the path behind a 60-meter curtain of falling water — bring your rain jacket.', estimatedDuration: '1.5 hrs', estimatedCost: 5, timeOfDay: 'Morning', lat: 63.6156, lng: -19.9886, googleMapsUrl: 'https://maps.google.com/?q=Seljalandsfoss' },
          { id: 'iact_5', title: 'Skógafoss & Sólheimajökull Glacier Hike', category: 'Hiking', location: 'Skógar, Iceland', description: 'Climb the stairs beside thundering Skógafoss, then strap on crampons for a guided glacier walk.', estimatedDuration: '4 hrs', estimatedCost: 110, timeOfDay: 'Afternoon', lat: 63.5321, lng: -19.5114, googleMapsUrl: 'https://maps.google.com/?q=Skogafoss' },
          { id: 'iact_6', title: 'Reynisfjara Black Sand Beach at Dusk', category: 'Photography', location: 'Vík, Iceland', description: 'Photograph basalt columns and sea stacks — keep well back from the powerful sneaker waves.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Evening', lat: 63.4045, lng: -19.0450, googleMapsUrl: 'https://maps.google.com/?q=Reynisfjara' },
        ],
      },
      {
        dayNumber: 3, title: 'Glacier Lagoon & Diamond Beach',
        activities: [
          { id: 'iact_7', title: 'Fjaðrárgljúfur Canyon Rim Trail', category: 'Hiking', location: 'Kirkjubæjarklaustur, Iceland', description: 'Walk the mossy rim of a serpentine canyon carved by glacial meltwater.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 63.7714, lng: -18.1717, googleMapsUrl: 'https://maps.google.com/?q=Fjadrargljufur' },
          { id: 'iact_8', title: 'Jökulsárlón Glacier Lagoon Amphibian Boat', category: 'Adventure', location: 'Vatnajökull, Iceland', description: 'Cruise among floating blue icebergs and spot seals lounging on the floes.', estimatedDuration: '2 hrs', estimatedCost: 75, timeOfDay: 'Afternoon', lat: 64.0784, lng: -16.2306, googleMapsUrl: 'https://maps.google.com/?q=Jokulsarlon' },
          { id: 'iact_9', title: 'Diamond Beach Ice Sculptures', category: 'Photography', location: 'Breiðamerkursandur, Iceland', description: 'Shoot glittering ice chunks washed up on jet-black sand as the sun goes down.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Evening', lat: 64.0443, lng: -16.1777, googleMapsUrl: 'https://maps.google.com/?q=Diamond+Beach+Iceland' },
        ],
      },
      {
        dayNumber: 4, title: 'Eastfjords Scenic Drive',
        activities: [
          { id: 'iact_10', title: 'Vestrahorn Mountain & Stokksnes Viking Village', category: 'Photography', location: 'Höfn, Iceland', description: 'Capture jagged peaks reflected in black dunes beside a replica Viking film set.', estimatedDuration: '2 hrs', estimatedCost: 9, timeOfDay: 'Morning', lat: 64.2545, lng: -14.9988, googleMapsUrl: 'https://maps.google.com/?q=Vestrahorn' },
          { id: 'iact_11', title: 'Eastfjords Coastal Road Trip', category: 'Road Trip', location: 'Eastfjords, Iceland', description: 'Wind past tiny fishing villages, reindeer herds, and dramatic fjord cliffs on Route 1.', estimatedDuration: '4 hrs', estimatedCost: 40, timeOfDay: 'Afternoon', lat: 65.0200, lng: -14.2167, googleMapsUrl: 'https://maps.google.com/?q=Eastfjords+Iceland' },
          { id: 'iact_12', title: 'Seyðisfjörður Rainbow Street & Fish Dinner', category: 'Hidden Gems', location: 'Seyðisfjörður, Iceland', description: 'Stroll the rainbow-painted lane to the blue church and dine on Arctic char in a cozy harbor town.', estimatedDuration: '2 hrs', estimatedCost: 45, timeOfDay: 'Evening', lat: 65.2600, lng: -14.0100, googleMapsUrl: 'https://maps.google.com/?q=Seydisfjordur' },
        ],
      },
      {
        dayNumber: 5, title: 'Lake Mývatn Geothermal Wonders',
        activities: [
          { id: 'iact_13', title: 'Dettifoss — Europe’s Most Powerful Waterfall', category: 'Nature', location: 'Vatnajökull National Park, Iceland', description: 'Feel the spray of 500 cubic meters of glacial water per second thundering into a canyon.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 65.8147, lng: -16.3846, googleMapsUrl: 'https://maps.google.com/?q=Dettifoss' },
          { id: 'iact_14', title: 'Hverir Mud Pots & Krafla Crater', category: 'Adventure', location: 'Mývatn, Iceland', description: 'Walk among bubbling mud pools and hissing fumaroles, then hike the rim of the Viti crater lake.', estimatedDuration: '2.5 hrs', estimatedCost: 0, timeOfDay: 'Afternoon', lat: 65.6413, lng: -16.8087, googleMapsUrl: 'https://maps.google.com/?q=Hverir' },
          { id: 'iact_15', title: 'Mývatn Nature Baths & Aurora Watch', category: 'Nature', location: 'Mývatn, Iceland', description: 'Soak in the quieter northern lagoon, then head out to dark skies for Northern Lights.', estimatedDuration: '3 hrs', estimatedCost: 55, timeOfDay: 'Evening', lat: 65.6309, lng: -16.8484, googleMapsUrl: 'https://maps.google.com/?q=Myvatn+Nature+Baths' },
        ],
      },
      {
        dayNumber: 6, title: 'Akureyri & Goðafoss',
        activities: [
          { id: 'iact_16', title: 'Goðafoss Waterfall of the Gods', category: 'Nature', location: 'Barðardalur, Iceland', description: 'See the horseshoe falls where Iceland’s pagan idols were thrown when the country adopted Christianity.', estimatedDuration: '1 hr', estimatedCost: 0, timeOfDay: 'Morning', lat: 65.6828, lng: -17.5502, googleMapsUrl: 'https://maps.google.com/?q=Godafoss' },
          { id: 'iact_17', title: 'Akureyri Whale Watching Tour', category: 'Adventure', location: 'Akureyri, Iceland', description: 'Sail Eyjafjörður fjord to spot humpback whales and dolphins in Iceland’s northern capital.', estimatedDuration: '3 hrs', estimatedCost: 95, timeOfDay: 'Afternoon', lat: 65.6835, lng: -18.0878, googleMapsUrl: 'https://maps.google.com/?q=Akureyri+Harbour' },
          { id: 'iact_18', title: 'Akureyri Botanical Garden & Local Brewery', category: 'Food', location: 'Akureyri, Iceland', description: 'Wander the world’s northernmost botanical garden, then sample craft beers brewed with glacier water.', estimatedDuration: '2.5 hrs', estimatedCost: 35, timeOfDay: 'Evening', lat: 65.6774, lng: -18.0905, googleMapsUrl: 'https://maps.google.com/?q=Akureyri+Botanical+Garden' },
        ],
      },
      {
        dayNumber: 7, title: 'Return to Reykjavik',
        activities: [
          { id: 'iact_19', title: 'Drive West via Hraunfossar Lava Falls', category: 'Road Trip', location: 'Borgarfjörður, Iceland', description: 'Break the drive south at turquoise rivulets streaming out from beneath a lava field.', estimatedDuration: '4 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: 64.7028, lng: -20.9774, googleMapsUrl: 'https://maps.google.com/?q=Hraunfossar' },
          { id: 'iact_20', title: 'Hallgrímskirkja Tower & Rainbow Street', category: 'Architecture', location: 'Reykjavik, Iceland', description: 'Ride up the iconic basalt-inspired church tower for pastel rooftop views over the capital.', estimatedDuration: '2 hrs', estimatedCost: 10, timeOfDay: 'Afternoon', lat: 64.1417, lng: -21.9266, googleMapsUrl: 'https://maps.google.com/?q=Hallgrimskirkja' },
          { id: 'iact_21', title: 'Harpa Concert Hall & Farewell Seafood Feast', category: 'Food', location: 'Reykjavik Harbour, Iceland', description: 'Admire Harpa’s glass façade glowing at night before a lobster soup dinner by the old harbor.', estimatedDuration: '2.5 hrs', estimatedCost: 60, timeOfDay: 'Evening', lat: 64.1504, lng: -21.9325, googleMapsUrl: 'https://maps.google.com/?q=Harpa+Reykjavik' },
        ],
      },
    ],
  },
  {
    id: 'bangkok-5day-streetfood',
    title: '5 Days in Bangkok: Golden Temples, Street Food & Floating Markets',
    destination: 'Bangkok', country: 'Thailand', flagEmoji: '🇹🇭',
    coverImage: 'https://images.unsplash.com/photo-1508009603885-50cf7c579365?auto=format&fit=crop&w=1200&q=80',
    summary: 'Temple-hop along the Chao Phraya, eat your way through Chinatown and Michelin-listed street stalls, haggle at Chatuchak, and toast the skyline from a rooftop bar.',
    durationDays: 5, season: 'Winter',
    preferences: ['Food', 'History', 'City', 'Nightlife', 'Budget'],
    companionStyle: 'Friends', estimatedCostUSD: 650,
    transportation: 'BTS Skytrain, Chao Phraya Express Boat & Grab',
    weatherForecast: 'Warm & Dry 31°C (88°F), low humidity in the cool season',
    creatorId: 'user_nok', creatorName: 'Nok Siriporn',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    likesCount: 455, bookmarksCount: 298, viewsCount: 5900, rating: 4.85, ratingsCount: 71,
    isPublished: true, updatedAt: '4 days ago',
    packingList: [
      { id: 'bp1', category: 'Clothing', item: 'Light scarf or sarong to cover shoulders at temples', packed: true },
      { id: 'bp2', category: 'Toiletries', item: 'Mosquito repellent & sunscreen SPF 50', packed: true },
      { id: 'bp3', category: 'Essentials', item: 'Rabbit Card for the BTS Skytrain', packed: false },
      { id: 'bp4', category: 'Clothing', item: 'Slip-on sandals (shoes come off at every temple)', packed: false },
    ],
    comments: [
      { id: 'cb1', userId: 'user_david', userName: 'David Miller', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', content: 'Yaowarat at night was the best food crawl of my life. Go hungry!', rating: 5, createdAt: '1 week ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Grand Palace & Riverside Temples',
        activities: [
          { id: 'bact_1', title: 'Grand Palace & Wat Phra Kaew', category: 'History', location: 'Phra Nakhon, Bangkok', description: 'Marvel at the dazzling royal complex and the revered Emerald Buddha — arrive at opening to beat the heat.', estimatedDuration: '2.5 hrs', estimatedCost: 15, timeOfDay: 'Morning', lat: 13.7500, lng: 100.4913, googleMapsUrl: 'https://maps.google.com/?q=Grand+Palace+Bangkok' },
          { id: 'bact_2', title: 'Wat Pho Reclining Buddha & Thai Massage', category: 'History', location: 'Phra Nakhon, Bangkok', description: 'See the 46-meter golden reclining Buddha, then get a traditional massage at the temple’s own school.', estimatedDuration: '2.5 hrs', estimatedCost: 25, timeOfDay: 'Afternoon', lat: 13.7465, lng: 100.4927, googleMapsUrl: 'https://maps.google.com/?q=Wat+Pho' },
          { id: 'bact_3', title: 'Wat Arun Sunset from the River', category: 'Photography', location: 'Bangkok Yai, Bangkok', description: 'Take the cross-river ferry and watch the porcelain-studded Temple of Dawn glow at sunset.', estimatedDuration: '2 hrs', estimatedCost: 5, timeOfDay: 'Evening', lat: 13.7437, lng: 100.4889, googleMapsUrl: 'https://maps.google.com/?q=Wat+Arun' },
        ],
      },
      {
        dayNumber: 2, title: 'Floating Market & Chinatown Food Crawl',
        activities: [
          { id: 'bact_4', title: 'Damnoen Saduak Floating Market', category: 'Food', location: 'Ratchaburi, Thailand', description: 'Ride a longtail boat through canals packed with vendors selling boat noodles and mango sticky rice.', estimatedDuration: '4 hrs', estimatedCost: 35, timeOfDay: 'Morning', lat: 13.5196, lng: 99.9590, googleMapsUrl: 'https://maps.google.com/?q=Damnoen+Saduak+Floating+Market' },
          { id: 'bact_5', title: 'Jim Thompson House Museum', category: 'Museum', location: 'Pathum Wan, Bangkok', description: 'Explore the teak-house home of the American silk tycoon who vanished mysteriously in 1967.', estimatedDuration: '1.5 hrs', estimatedCost: 6, timeOfDay: 'Afternoon', lat: 13.7493, lng: 100.5283, googleMapsUrl: 'https://maps.google.com/?q=Jim+Thompson+House' },
          { id: 'bact_6', title: 'Yaowarat Chinatown Street Food Crawl', category: 'Food', location: 'Samphanthawong, Bangkok', description: 'Slurp peppery pork noodle soup, crispy oyster omelettes, and toasted buns under neon Chinese signs.', estimatedDuration: '3 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: 13.7398, lng: 100.5101, googleMapsUrl: 'https://maps.google.com/?q=Yaowarat+Road' },
        ],
      },
      {
        dayNumber: 3, title: 'Chatuchak Weekend Market & Rooftop Views',
        activities: [
          { id: 'bact_7', title: 'Chatuchak Weekend Market', category: 'Shopping', location: 'Chatuchak, Bangkok', description: 'Get lost among 15,000 stalls selling vintage clothes, ceramics, plants, and coconut ice cream.', estimatedDuration: '3.5 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: 13.7999, lng: 100.5502, googleMapsUrl: 'https://maps.google.com/?q=Chatuchak+Weekend+Market' },
          { id: 'bact_8', title: 'Siam Paragon & MBK Mall Cool-Down', category: 'Shopping', location: 'Siam, Bangkok', description: 'Escape the afternoon heat in Bangkok’s mega-malls and their excellent food halls.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: 13.7462, lng: 100.5347, googleMapsUrl: 'https://maps.google.com/?q=Siam+Paragon' },
          { id: 'bact_9', title: 'Sky Bar at lebua State Tower', category: 'Nightlife', location: 'Bang Rak, Bangkok', description: 'Sip a cocktail 63 floors up at the open-air bar made famous by The Hangover Part II.', estimatedDuration: '2 hrs', estimatedCost: 45, timeOfDay: 'Evening', lat: 13.7215, lng: 100.5170, googleMapsUrl: 'https://maps.google.com/?q=Sky+Bar+lebua' },
        ],
      },
      {
        dayNumber: 4, title: 'Ayutthaya Ancient Capital Day Trip',
        activities: [
          { id: 'bact_10', title: 'Wat Mahathat Buddha Head in Tree Roots', category: 'History', location: 'Ayutthaya, Thailand', description: 'Find the famous sandstone Buddha head embraced by banyan roots among 14th-century ruins.', estimatedDuration: '2 hrs', estimatedCost: 3, timeOfDay: 'Morning', lat: 14.3569, lng: 100.5675, googleMapsUrl: 'https://maps.google.com/?q=Wat+Mahathat+Ayutthaya' },
          { id: 'bact_11', title: 'Cycle the Ayutthaya Historical Park', category: 'Adventure', location: 'Ayutthaya, Thailand', description: 'Rent a bicycle to roam towering prangs and temple ruins of the former Siamese capital.', estimatedDuration: '3 hrs', estimatedCost: 10, timeOfDay: 'Afternoon', lat: 14.3556, lng: 100.5587, googleMapsUrl: 'https://maps.google.com/?q=Ayutthaya+Historical+Park' },
          { id: 'bact_12', title: 'Jodd Fairs Night Market', category: 'Food', location: 'Huai Khwang, Bangkok', description: 'Back in town, try volcano pork ribs and grilled river prawns at Bangkok’s trendiest night market.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: 13.7579, lng: 100.5664, googleMapsUrl: 'https://maps.google.com/?q=Jodd+Fairs' },
        ],
      },
      {
        dayNumber: 5, title: 'Canals, Cooking Class & Farewell',
        activities: [
          { id: 'bact_13', title: 'Thonburi Canal Longtail Boat Tour', category: 'Hidden Gems', location: 'Thonburi, Bangkok', description: 'Glide past stilt houses, monitor lizards, and tiny temples on Bangkok’s old klong waterways.', estimatedDuration: '2 hrs', estimatedCost: 25, timeOfDay: 'Morning', lat: 13.7400, lng: 100.4700, googleMapsUrl: 'https://maps.google.com/?q=Khlong+Bangkok+Noi' },
          { id: 'bact_14', title: 'Thai Cooking Class with Market Tour', category: 'Food', location: 'Silom, Bangkok', description: 'Shop for herbs at a local market, then cook green curry, tom yum, and pad thai from scratch.', estimatedDuration: '3.5 hrs', estimatedCost: 40, timeOfDay: 'Afternoon', lat: 13.7262, lng: 100.5291, googleMapsUrl: 'https://maps.google.com/?q=Silom+Thai+Cooking+School' },
          { id: 'bact_15', title: 'Asiatique Riverfront & Muay Thai Show', category: 'Nightlife', location: 'Bang Kho Laem, Bangkok', description: 'Ride the giant Ferris wheel by the river and catch a thrilling Muay Thai performance.', estimatedDuration: '3 hrs', estimatedCost: 35, timeOfDay: 'Evening', lat: 13.7044, lng: 100.5030, googleMapsUrl: 'https://maps.google.com/?q=Asiatique+The+Riverfront' },
        ],
      },
    ],
  },
  {
    id: 'singapore-3day-family',
    title: '3 Days in Singapore: Supertrees, Hawkers & Sentosa Fun',
    destination: 'Singapore', country: 'Singapore', flagEmoji: '🇸🇬',
    coverImage: 'https://images.unsplash.com/photo-1565967511849-76a60a516170?auto=format&fit=crop&w=1200&q=80',
    summary: 'A compact, kid-approved city break: Gardens by the Bay light shows, hawker-center feasts, the Night Safari, and a full day of Sentosa beaches and rides.',
    durationDays: 3, season: 'Spring',
    preferences: ['Family', 'Food', 'City', 'Theme Park', 'Nature'],
    companionStyle: 'Family', estimatedCostUSD: 1100,
    transportation: 'MRT with EZ-Link card & Sentosa Express',
    weatherForecast: 'Hot & Humid 32°C (90°F), brief afternoon showers',
    creatorId: 'user_priya', creatorName: 'Priya Sharma',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    likesCount: 238, bookmarksCount: 176, viewsCount: 3100, rating: 4.8, ratingsCount: 39,
    isPublished: true, updatedAt: '6 days ago',
    packingList: [
      { id: 'sp1', category: 'Essentials', item: 'Compact umbrella for tropical downpours', packed: true },
      { id: 'sp2', category: 'Clothing', item: 'Light layer for icy air-conditioned malls', packed: true },
      { id: 'sp3', category: 'Toiletries', item: 'Kids’ sunscreen & insect repellent', packed: false },
    ],
    comments: [
      { id: 'cs1', userId: 'user_maya', userName: 'Maya Lin', userAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80', content: 'Night Safari was the highlight for our 6-year-old. Perfect pacing for kids!', rating: 5, createdAt: '2 weeks ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Marina Bay & Gardens by the Bay',
        activities: [
          { id: 'sact_1', title: 'Merlion Park & Marina Bay Waterfront', category: 'City', location: 'Marina Bay, Singapore', description: 'Snap photos with the half-lion, half-fish icon against the Marina Bay Sands skyline.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 1.2868, lng: 103.8545, googleMapsUrl: 'https://maps.google.com/?q=Merlion+Park' },
          { id: 'sact_2', title: 'Cloud Forest & Flower Dome', category: 'Nature', location: 'Gardens by the Bay, Singapore', description: 'Explore a misty indoor mountain with the world’s tallest indoor waterfall, then the cool Flower Dome.', estimatedDuration: '3 hrs', estimatedCost: 40, timeOfDay: 'Afternoon', lat: 1.2816, lng: 103.8636, googleMapsUrl: 'https://maps.google.com/?q=Cloud+Forest+Singapore' },
          { id: 'sact_3', title: 'Satay by the Bay & Garden Rhapsody Show', category: 'Food', location: 'Gardens by the Bay, Singapore', description: 'Feast on satay skewers, then lie back under the Supertrees for the free light-and-music show.', estimatedDuration: '2.5 hrs', estimatedCost: 25, timeOfDay: 'Evening', lat: 1.2823, lng: 103.8684, googleMapsUrl: 'https://maps.google.com/?q=Supertree+Grove' },
        ],
      },
      {
        dayNumber: 2, title: 'Heritage Neighborhoods & Night Safari',
        activities: [
          { id: 'sact_4', title: 'Chinatown & Buddha Tooth Relic Temple', category: 'History', location: 'Chinatown, Singapore', description: 'Wander shophouse streets and visit the ornate five-story temple housing a sacred relic.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 1.2814, lng: 103.8443, googleMapsUrl: 'https://maps.google.com/?q=Buddha+Tooth+Relic+Temple' },
          { id: 'sact_5', title: 'Maxwell Hawker Centre Lunch', category: 'Food', location: 'Chinatown, Singapore', description: 'Queue for the legendary Tian Tian Hainanese chicken rice — a full meal for under $6.', estimatedDuration: '1 hr', estimatedCost: 10, timeOfDay: 'Afternoon', lat: 1.2803, lng: 103.8448, googleMapsUrl: 'https://maps.google.com/?q=Maxwell+Food+Centre' },
          { id: 'sact_6', title: 'Night Safari Tram Ride', category: 'Family', location: 'Mandai, Singapore', description: 'Spot tigers, rhinos, and leopards on the world’s first nocturnal zoo safari.', estimatedDuration: '3 hrs', estimatedCost: 55, timeOfDay: 'Evening', lat: 1.4022, lng: 103.7880, googleMapsUrl: 'https://maps.google.com/?q=Night+Safari+Singapore' },
        ],
      },
      {
        dayNumber: 3, title: 'Sentosa Island Adventure',
        activities: [
          { id: 'sact_7', title: 'Universal Studios Singapore', category: 'Theme Park', location: 'Sentosa, Singapore', description: 'Ride the Transformers and Jurassic Park rapids in seven movie-themed zones.', estimatedDuration: '4 hrs', estimatedCost: 75, timeOfDay: 'Morning', lat: 1.2540, lng: 103.8238, googleMapsUrl: 'https://maps.google.com/?q=Universal+Studios+Singapore' },
          { id: 'sact_8', title: 'Siloso Beach & Luge Ride', category: 'Beach', location: 'Sentosa, Singapore', description: 'Race down the luge track, ride the skyline chairlift, and cool off at the beach.', estimatedDuration: '2.5 hrs', estimatedCost: 30, timeOfDay: 'Afternoon', lat: 1.2557, lng: 103.8100, googleMapsUrl: 'https://maps.google.com/?q=Siloso+Beach' },
          { id: 'sact_9', title: 'Wings of Time Night Show', category: 'Family', location: 'Sentosa, Singapore', description: 'End the trip with fireworks, lasers, and water fountains over the sea.', estimatedDuration: '1 hr', estimatedCost: 20, timeOfDay: 'Evening', lat: 1.2589, lng: 103.8133, googleMapsUrl: 'https://maps.google.com/?q=Wings+of+Time+Sentosa' },
        ],
      },
    ],
  },
  {
    id: 'london-5day-classic',
    title: '5 Days in London: Royal Sights, Free Museums & West End Nights',
    destination: 'London', country: 'United Kingdom', flagEmoji: '🇬🇧',
    coverImage: 'https://images.unsplash.com/photo-1529655683826-aba9b3e77383?auto=format&fit=crop&w=1200&q=80',
    summary: 'Changing of the Guard, the Tower’s Crown Jewels, world-class free museums, market grazing in Borough, and a West End show — London’s greatest hits for two.',
    durationDays: 5, season: 'Summer',
    preferences: ['History', 'Museum', 'City', 'Food', 'Nightlife'],
    companionStyle: 'Couple', estimatedCostUSD: 2100,
    transportation: 'Contactless Oyster pay-as-you-go on the Tube & buses',
    weatherForecast: 'Pleasant Summer 22°C (72°F), occasional showers',
    creatorId: 'user_oliver', creatorName: 'Oliver Bennett',
    creatorAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80',
    likesCount: 389, bookmarksCount: 251, viewsCount: 5200, rating: 4.88, ratingsCount: 63,
    isPublished: true, updatedAt: '1 week ago',
    packingList: [
      { id: 'lp1', category: 'Clothing', item: 'Packable rain jacket', packed: true },
      { id: 'lp2', category: 'Electronics', item: 'UK Type G plug adapter', packed: true },
      { id: 'lp3', category: 'Documents', item: 'West End & Tower of London e-tickets', packed: false },
    ],
    comments: [
      { id: 'cl1', userId: 'user_sophie', userName: 'Sophie Laurent', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', content: 'Borough Market + Sky Garden on the same day was genius. Book Sky Garden early!', rating: 5, createdAt: '5 days ago' },
      { id: 'cl2', userId: 'user_kenji', userName: 'Kenji Takahashi', userAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80', content: 'Great plan, though I swapped Day 5 for a Harry Potter studio tour.', rating: 4, createdAt: '2 weeks ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Westminster & Royal London',
        activities: [
          { id: 'lact_1', title: 'Changing of the Guard at Buckingham Palace', category: 'History', location: 'Westminster, London', description: 'Watch the King’s Guard in bearskin hats march to a military band.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 51.5014, lng: -0.1419, googleMapsUrl: 'https://maps.google.com/?q=Buckingham+Palace' },
          { id: 'lact_2', title: 'Westminster Abbey & Big Ben', category: 'Architecture', location: 'Westminster, London', description: 'Tour the coronation church of English monarchs and see the Elizabeth Tower clock across the square.', estimatedDuration: '2.5 hrs', estimatedCost: 35, timeOfDay: 'Afternoon', lat: 51.4994, lng: -0.1273, googleMapsUrl: 'https://maps.google.com/?q=Westminster+Abbey' },
          { id: 'lact_3', title: 'London Eye at Dusk & South Bank Stroll', category: 'Romantic', location: 'South Bank, London', description: 'Ride the giant observation wheel as the city lights up, then walk along the Thames.', estimatedDuration: '2 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 51.5033, lng: -0.1196, googleMapsUrl: 'https://maps.google.com/?q=London+Eye' },
        ],
      },
      {
        dayNumber: 2, title: 'Museums & Covent Garden',
        activities: [
          { id: 'lact_4', title: 'British Museum Highlights', category: 'Museum', location: 'Bloomsbury, London', description: 'See the Rosetta Stone, Egyptian mummies, and the Parthenon sculptures — all free.', estimatedDuration: '3 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 51.5194, lng: -0.1270, googleMapsUrl: 'https://maps.google.com/?q=British+Museum' },
          { id: 'lact_5', title: 'National Gallery & Trafalgar Square', category: 'Museum', location: 'Trafalgar Square, London', description: 'Admire Van Gogh’s Sunflowers and Turner seascapes overlooking Nelson’s Column.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Afternoon', lat: 51.5089, lng: -0.1283, googleMapsUrl: 'https://maps.google.com/?q=National+Gallery+London' },
          { id: 'lact_6', title: 'West End Musical in Covent Garden', category: 'Nightlife', location: 'Covent Garden, London', description: 'Catch a blockbuster musical after pre-theatre dinner in the piazza.', estimatedDuration: '3.5 hrs', estimatedCost: 95, timeOfDay: 'Evening', lat: 51.5117, lng: -0.1240, googleMapsUrl: 'https://maps.google.com/?q=Covent+Garden' },
        ],
      },
      {
        dayNumber: 3, title: 'Tower, Borough Market & Sky Garden',
        activities: [
          { id: 'lact_7', title: 'Tower of London & Crown Jewels', category: 'History', location: 'Tower Hill, London', description: 'Join a Beefeater tour of the 1,000-year-old fortress and gaze at the glittering Crown Jewels.', estimatedDuration: '3 hrs', estimatedCost: 40, timeOfDay: 'Morning', lat: 51.5081, lng: -0.0759, googleMapsUrl: 'https://maps.google.com/?q=Tower+of+London' },
          { id: 'lact_8', title: 'Borough Market Grazing Lunch', category: 'Food', location: 'Southwark, London', description: 'Cross Tower Bridge and snack on raclette, scotch eggs, and doughnuts at London’s oldest food market.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Afternoon', lat: 51.5055, lng: -0.0910, googleMapsUrl: 'https://maps.google.com/?q=Borough+Market' },
          { id: 'lact_9', title: 'Sky Garden Sunset Drinks', category: 'Romantic', location: 'City of London, London', description: 'Sip cocktails in a free rooftop jungle 35 floors above the financial district (book ahead).', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Evening', lat: 51.5113, lng: -0.0835, googleMapsUrl: 'https://maps.google.com/?q=Sky+Garden+London' },
        ],
      },
      {
        dayNumber: 4, title: 'Kensington, Hyde Park & Notting Hill',
        activities: [
          { id: 'lact_10', title: 'Natural History Museum', category: 'Museum', location: 'South Kensington, London', description: 'Stand beneath the blue whale skeleton in a cathedral-like Victorian hall.', estimatedDuration: '2.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 51.4967, lng: -0.1764, googleMapsUrl: 'https://maps.google.com/?q=Natural+History+Museum+London' },
          { id: 'lact_11', title: 'Hyde Park & Kensington Palace Gardens', category: 'Nature', location: 'Hyde Park, London', description: 'Rent a pedalo on the Serpentine and stroll to Princess Diana’s former home.', estimatedDuration: '2.5 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 51.5073, lng: -0.1657, googleMapsUrl: 'https://maps.google.com/?q=Hyde+Park' },
          { id: 'lact_12', title: 'Notting Hill Pastel Streets & Gastropub Dinner', category: 'Food', location: 'Notting Hill, London', description: 'Photograph the colorful terraces of Portobello Road, then dine on Sunday-roast-style pub classics.', estimatedDuration: '2.5 hrs', estimatedCost: 50, timeOfDay: 'Evening', lat: 51.5155, lng: -0.2050, googleMapsUrl: 'https://maps.google.com/?q=Portobello+Road' },
        ],
      },
      {
        dayNumber: 5, title: 'Greenwich & East London Vibes',
        activities: [
          { id: 'lact_13', title: 'Thames Clipper to Greenwich & Royal Observatory', category: 'History', location: 'Greenwich, London', description: 'Ride the river boat, then stand astride the Prime Meridian line at 0° longitude.', estimatedDuration: '3 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: 51.4769, lng: -0.0005, googleMapsUrl: 'https://maps.google.com/?q=Royal+Observatory+Greenwich' },
          { id: 'lact_14', title: 'Shoreditch Street Art & Brick Lane', category: 'Hidden Gems', location: 'Shoreditch, London', description: 'Hunt for Banksy-era murals and grab a salt-beef bagel from the 24-hour Brick Lane bakery.', estimatedDuration: '2.5 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 51.5219, lng: -0.0717, googleMapsUrl: 'https://maps.google.com/?q=Brick+Lane' },
          { id: 'lact_15', title: 'Farewell Dinner in Soho', category: 'Nightlife', location: 'Soho, London', description: 'Toast the trip with small plates and a cocktail in London’s liveliest late-night district.', estimatedDuration: '3 hrs', estimatedCost: 70, timeOfDay: 'Evening', lat: 51.5136, lng: -0.1365, googleMapsUrl: 'https://maps.google.com/?q=Soho+London' },
        ],
      },
    ],
  },
  {
    id: 'nyc-4day-firsttimer',
    title: '4 Days in New York City: The Ultimate First-Timer Guide',
    destination: 'New York City', country: 'United States', flagEmoji: '🇺🇸',
    coverImage: 'https://images.unsplash.com/photo-1534430480872-3498386e7856?auto=format&fit=crop&w=1200&q=80',
    summary: 'Skyline views, Central Park, the Met, Brooklyn Bridge at sunrise, dollar-slice pizza, and a Broadway show — a solo-friendly whirlwind of NYC icons.',
    durationDays: 4, season: 'Autumn',
    preferences: ['City', 'Food', 'Museum', 'Architecture', 'Nightlife'],
    companionStyle: 'Solo', estimatedCostUSD: 1500,
    transportation: 'Subway with OMNY tap-to-pay & lots of walking',
    weatherForecast: 'Crisp Autumn 16°C (61°F), sunny with fall foliage',
    creatorId: 'user_jordan', creatorName: 'Jordan Hayes',
    creatorAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80',
    likesCount: 401, bookmarksCount: 287, viewsCount: 6100, rating: 4.82, ratingsCount: 77,
    isPublished: true, updatedAt: '3 days ago',
    packingList: [
      { id: 'np1', category: 'Clothing', item: 'Broken-in sneakers (20k steps a day)', packed: true },
      { id: 'np2', category: 'Electronics', item: 'Phone with OMNY / Apple Pay set up', packed: true },
      { id: 'np3', category: 'Clothing', item: 'Light jacket for windy evenings', packed: false },
    ],
    comments: [
      { id: 'cn1', userId: 'user_erik', userName: 'Erik Lindqvist', userAvatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=200&q=80', content: 'Brooklyn Bridge at sunrise with no crowds — worth the early alarm.', rating: 5, createdAt: '1 week ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Midtown Icons & Times Square',
        activities: [
          { id: 'nact_1', title: 'Top of the Rock Observation Deck', category: 'City', location: 'Midtown, Manhattan', description: 'Get the classic skyline view with the Empire State Building framed in front of you.', estimatedDuration: '1.5 hrs', estimatedCost: 45, timeOfDay: 'Morning', lat: 40.7593, lng: -73.9794, googleMapsUrl: 'https://maps.google.com/?q=Top+of+the+Rock' },
          { id: 'nact_2', title: 'Grand Central, Bryant Park & NY Public Library', category: 'Architecture', location: 'Midtown, Manhattan', description: 'Whisper in the Whispering Gallery and admire the library’s Rose Main Reading Room.', estimatedDuration: '2.5 hrs', estimatedCost: 0, timeOfDay: 'Afternoon', lat: 40.7527, lng: -73.9772, googleMapsUrl: 'https://maps.google.com/?q=Grand+Central+Terminal' },
          { id: 'nact_3', title: 'Broadway Show & Times Square Lights', category: 'Nightlife', location: 'Theater District, Manhattan', description: 'Grab TKTS discount seats for a Broadway show, then soak in the neon chaos.', estimatedDuration: '3.5 hrs', estimatedCost: 120, timeOfDay: 'Evening', lat: 40.7580, lng: -73.9855, googleMapsUrl: 'https://maps.google.com/?q=Times+Square' },
        ],
      },
      {
        dayNumber: 2, title: 'Central Park & Museum Mile',
        activities: [
          { id: 'nact_4', title: 'Central Park Bike Loop', category: 'Nature', location: 'Central Park, Manhattan', description: 'Cycle past Bethesda Fountain, Bow Bridge, and Strawberry Fields on the 6-mile loop.', estimatedDuration: '2.5 hrs', estimatedCost: 25, timeOfDay: 'Morning', lat: 40.7736, lng: -73.9712, googleMapsUrl: 'https://maps.google.com/?q=Bethesda+Fountain' },
          { id: 'nact_5', title: 'The Metropolitan Museum of Art', category: 'Museum', location: 'Upper East Side, Manhattan', description: 'See the Temple of Dendur, armor hall, and rooftop garden views of the park.', estimatedDuration: '3 hrs', estimatedCost: 30, timeOfDay: 'Afternoon', lat: 40.7794, lng: -73.9632, googleMapsUrl: 'https://maps.google.com/?q=Metropolitan+Museum+of+Art' },
          { id: 'nact_6', title: 'Jazz Night in Harlem', category: 'Nightlife', location: 'Harlem, Manhattan', description: 'Eat soul food and catch live jazz in the neighborhood that shaped American music.', estimatedDuration: '3 hrs', estimatedCost: 55, timeOfDay: 'Evening', lat: 40.8116, lng: -73.9465, googleMapsUrl: 'https://maps.google.com/?q=Minton%27s+Playhouse' },
        ],
      },
      {
        dayNumber: 3, title: 'Lower Manhattan & Brooklyn',
        activities: [
          { id: 'nact_7', title: 'Statue of Liberty Ferry & Ellis Island', category: 'History', location: 'Liberty Island, New York', description: 'Sail to Lady Liberty and trace immigrant stories at the Ellis Island museum.', estimatedDuration: '4 hrs', estimatedCost: 25, timeOfDay: 'Morning', lat: 40.6892, lng: -74.0445, googleMapsUrl: 'https://maps.google.com/?q=Statue+of+Liberty' },
          { id: 'nact_8', title: '9/11 Memorial & One World Observatory', category: 'History', location: 'Financial District, Manhattan', description: 'Pay respects at the reflecting pools, then ride to the top of the Western Hemisphere’s tallest building.', estimatedDuration: '2.5 hrs', estimatedCost: 45, timeOfDay: 'Afternoon', lat: 40.7115, lng: -74.0134, googleMapsUrl: 'https://maps.google.com/?q=9/11+Memorial' },
          { id: 'nact_9', title: 'Brooklyn Bridge Walk & DUMBO Pizza', category: 'Food', location: 'DUMBO, Brooklyn', description: 'Walk the bridge at golden hour and end with coal-fired pizza beside the Manhattan Bridge view.', estimatedDuration: '2.5 hrs', estimatedCost: 30, timeOfDay: 'Evening', lat: 40.7033, lng: -73.9881, googleMapsUrl: 'https://maps.google.com/?q=DUMBO+Brooklyn' },
        ],
      },
      {
        dayNumber: 4, title: 'High Line, Chelsea & Village Farewell',
        activities: [
          { id: 'nact_10', title: 'The High Line Elevated Park', category: 'Nature', location: 'Chelsea, Manhattan', description: 'Stroll a former freight rail line turned garden walkway ending at Hudson Yards’ Vessel.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 40.7480, lng: -74.0048, googleMapsUrl: 'https://maps.google.com/?q=The+High+Line' },
          { id: 'nact_11', title: 'Chelsea Market Food Hall Lunch', category: 'Food', location: 'Meatpacking District, Manhattan', description: 'Graze on lobster rolls, tacos, and fresh-baked brownies in an old Nabisco factory.', estimatedDuration: '1.5 hrs', estimatedCost: 30, timeOfDay: 'Afternoon', lat: 40.7424, lng: -74.0061, googleMapsUrl: 'https://maps.google.com/?q=Chelsea+Market' },
          { id: 'nact_12', title: 'Greenwich Village Comedy Cellar', category: 'Nightlife', location: 'Greenwich Village, Manhattan', description: 'Wander Washington Square Park, then laugh at surprise drop-in sets from famous comics.', estimatedDuration: '3 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 40.7302, lng: -74.0005, googleMapsUrl: 'https://maps.google.com/?q=Comedy+Cellar' },
        ],
      },
    ],
  },
  {
    id: 'bali-6day-island',
    title: '6 Days in Bali: Rice Terraces, Temples & Beach Sunsets',
    destination: 'Bali', country: 'Indonesia', flagEmoji: '🇮🇩',
    coverImage: 'https://images.unsplash.com/photo-1555400038-63f5ba517a47?auto=format&fit=crop&w=1200&q=80',
    summary: 'Split between jungly Ubud and the southern coast: sunrise volcano treks, emerald rice terraces, sacred water temples, cliff-top Uluwatu, and lazy beach-club sunsets.',
    durationDays: 6, season: 'Summer',
    preferences: ['Nature', 'Beach', 'Romantic', 'Adventure', 'Photography'],
    companionStyle: 'Couple', estimatedCostUSD: 1250,
    transportation: 'Private driver for day trips & Gojek scooter taxis',
    weatherForecast: 'Sunny Dry Season 29°C (84°F), cool mornings in Ubud',
    creatorId: 'user_maya', creatorName: 'Maya Lin',
    creatorAvatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=80',
    likesCount: 533, bookmarksCount: 402, viewsCount: 7400, rating: 4.92, ratingsCount: 96,
    isPublished: true, updatedAt: '2 days ago',
    packingList: [
      { id: 'bap1', category: 'Clothing', item: 'Sarong for temple visits', packed: true },
      { id: 'bap2', category: 'Clothing', item: 'Headlamp & warm layer for the Mt. Batur sunrise trek', packed: true },
      { id: 'bap3', category: 'Toiletries', item: 'Reef-safe sunscreen', packed: false },
      { id: 'bap4', category: 'Essentials', item: 'Dry bag for beach & waterfall days', packed: false },
    ],
    comments: [
      { id: 'cba1', userId: 'user_sophie', userName: 'Sophie Laurent', userAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80', content: 'The Mt. Batur sunrise was magical. Pack a jacket — it’s cold at the top!', rating: 5, createdAt: '3 days ago' },
      { id: 'cba2', userId: 'user_alex', userName: 'Alex Rivers', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', content: 'Uluwatu Kecak dance at sunset is unmissable. Watch your sunglasses around the monkeys.', rating: 5, createdAt: '1 week ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Arrive in Ubud: Jungle & Monkeys',
        activities: [
          { id: 'baact_1', title: 'Check in to a Jungle Villa in Ubud', category: 'Hotel', location: 'Ubud, Bali', description: 'Settle into a villa overlooking the Ayung River valley and recover from the flight by the pool.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: -8.5069, lng: 115.2625, googleMapsUrl: 'https://maps.google.com/?q=Ubud' },
          { id: 'baact_2', title: 'Sacred Monkey Forest Sanctuary', category: 'Nature', location: 'Ubud, Bali', description: 'Walk among mossy temples and hundreds of long-tailed macaques in an ancient forest.', estimatedDuration: '1.5 hrs', estimatedCost: 6, timeOfDay: 'Afternoon', lat: -8.5188, lng: 115.2585, googleMapsUrl: 'https://maps.google.com/?q=Sacred+Monkey+Forest+Sanctuary' },
          { id: 'baact_3', title: 'Balinese Dance at Ubud Palace & Warung Dinner', category: 'Food', location: 'Ubud, Bali', description: 'Watch a Legong dance in the royal palace courtyard, then dine on babi guling (suckling pig).', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: -8.5069, lng: 115.2624, googleMapsUrl: 'https://maps.google.com/?q=Ubud+Palace' },
        ],
      },
      {
        dayNumber: 2, title: 'Rice Terraces & Water Temples',
        activities: [
          { id: 'baact_4', title: 'Tegallalang Rice Terraces & Jungle Swing', category: 'Photography', location: 'Tegallalang, Bali', description: 'Hike the sculpted green terraces early and swing out over the valley.', estimatedDuration: '2.5 hrs', estimatedCost: 25, timeOfDay: 'Morning', lat: -8.4312, lng: 115.2793, googleMapsUrl: 'https://maps.google.com/?q=Tegallalang+Rice+Terrace' },
          { id: 'baact_5', title: 'Tirta Empul Holy Spring Purification', category: 'History', location: 'Tampaksiring, Bali', description: 'Join locals in a sacred water-blessing ritual beneath carved stone spouts.', estimatedDuration: '2 hrs', estimatedCost: 5, timeOfDay: 'Afternoon', lat: -8.4153, lng: 115.3153, googleMapsUrl: 'https://maps.google.com/?q=Tirta+Empul' },
          { id: 'baact_6', title: 'Balinese Massage & Spa Ritual', category: 'Luxury', location: 'Ubud, Bali', description: 'Unwind with a two-hour flower bath and traditional massage for a fraction of Western prices.', estimatedDuration: '2 hrs', estimatedCost: 35, timeOfDay: 'Evening', lat: -8.5100, lng: 115.2630, googleMapsUrl: 'https://maps.google.com/?q=Ubud+Spa' },
        ],
      },
      {
        dayNumber: 3, title: 'Mt. Batur Sunrise Trek',
        activities: [
          { id: 'baact_7', title: 'Mount Batur Sunrise Volcano Hike', category: 'Hiking', location: 'Kintamani, Bali', description: 'Start at 4am to summit an active volcano and watch the sun rise over Lake Batur and Mt. Agung.', estimatedDuration: '5 hrs', estimatedCost: 45, timeOfDay: 'Morning', lat: -8.2421, lng: 115.3751, googleMapsUrl: 'https://maps.google.com/?q=Mount+Batur' },
          { id: 'baact_8', title: 'Natural Hot Springs & Coffee Plantation', category: 'Nature', location: 'Kintamani, Bali', description: 'Soak tired legs in lakeside hot springs and taste Bali coffee at a plantation.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Afternoon', lat: -8.2560, lng: 115.4000, googleMapsUrl: 'https://maps.google.com/?q=Batur+Natural+Hot+Spring' },
          { id: 'baact_9', title: 'Early Night with Room-Service Nasi Goreng', category: 'Food', location: 'Ubud, Bali', description: 'Recharge after the 3am start with a quiet dinner at the villa.', estimatedDuration: '1.5 hrs', estimatedCost: 10, timeOfDay: 'Evening', lat: -8.5069, lng: 115.2625, googleMapsUrl: 'https://maps.google.com/?q=Ubud' },
        ],
      },
      {
        dayNumber: 4, title: 'Waterfalls & Move to the Coast',
        activities: [
          { id: 'baact_10', title: 'Tibumana & Tukad Cepung Waterfalls', category: 'Nature', location: 'Bangli, Bali', description: 'Swim beneath a jungle waterfall, then see light beams pour into a hidden cave fall.', estimatedDuration: '3 hrs', estimatedCost: 5, timeOfDay: 'Morning', lat: -8.4430, lng: 115.3655, googleMapsUrl: 'https://maps.google.com/?q=Tukad+Cepung+Waterfall' },
          { id: 'baact_11', title: 'Transfer to Seminyak Beach Hotel', category: 'Hotel', location: 'Seminyak, Bali', description: 'Drive south to the coast and check in near the beach boutiques.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Afternoon', lat: -8.6913, lng: 115.1682, googleMapsUrl: 'https://maps.google.com/?q=Seminyak' },
          { id: 'baact_12', title: 'Tanah Lot Temple Sunset', category: 'Photography', location: 'Tabanan, Bali', description: 'Watch the sun sink behind a sea temple perched on a rock in the crashing surf.', estimatedDuration: '2.5 hrs', estimatedCost: 5, timeOfDay: 'Evening', lat: -8.6212, lng: 115.0868, googleMapsUrl: 'https://maps.google.com/?q=Tanah+Lot' },
        ],
      },
      {
        dayNumber: 5, title: 'Uluwatu Cliffs & Kecak Fire Dance',
        activities: [
          { id: 'baact_13', title: 'Surf Lesson at Kuta Beach', category: 'Beach', location: 'Kuta, Bali', description: 'Catch your first waves on gentle beach breaks with a local instructor.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: -8.7180, lng: 115.1686, googleMapsUrl: 'https://maps.google.com/?q=Kuta+Beach' },
          { id: 'baact_14', title: 'Padang Padang & Suluban Hidden Beaches', category: 'Beach', location: 'Uluwatu, Bali', description: 'Climb down through rock crevices to tiny coves with turquoise water.', estimatedDuration: '3 hrs', estimatedCost: 3, timeOfDay: 'Afternoon', lat: -8.8106, lng: 115.1032, googleMapsUrl: 'https://maps.google.com/?q=Padang+Padang+Beach' },
          { id: 'baact_15', title: 'Uluwatu Temple Kecak Fire Dance', category: 'Festival', location: 'Uluwatu, Bali', description: 'Watch a hypnotic chanting fire dance on a cliff 70 meters above the ocean at sunset.', estimatedDuration: '2 hrs', estimatedCost: 15, timeOfDay: 'Evening', lat: -8.8291, lng: 115.0849, googleMapsUrl: 'https://maps.google.com/?q=Uluwatu+Temple' },
        ],
      },
      {
        dayNumber: 6, title: 'Beach Club Farewell',
        activities: [
          { id: 'baact_16', title: 'Yoga Class & Smoothie Bowl Brunch', category: 'Cafe', location: 'Canggu, Bali', description: 'Stretch out at an open-air shala, then refuel at one of Canggu’s famous brunch cafés.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Morning', lat: -8.6478, lng: 115.1385, googleMapsUrl: 'https://maps.google.com/?q=Canggu' },
          { id: 'baact_17', title: 'Seminyak Boutiques & Beach Walk', category: 'Shopping', location: 'Seminyak, Bali', description: 'Shop for linen, rattan bags, and silver jewelry along Jalan Kayu Aya.', estimatedDuration: '2.5 hrs', estimatedCost: 40, timeOfDay: 'Afternoon', lat: -8.6845, lng: 115.1610, googleMapsUrl: 'https://maps.google.com/?q=Jalan+Kayu+Aya' },
          { id: 'baact_18', title: 'Sunset Cocktails at Potato Head Beach Club', category: 'Nightlife', location: 'Seminyak, Bali', description: 'Toast your trip poolside as fire-red skies fade over the Indian Ocean.', estimatedDuration: '3 hrs', estimatedCost: 50, timeOfDay: 'Evening', lat: -8.6795, lng: 115.1530, googleMapsUrl: 'https://maps.google.com/?q=Potato+Head+Beach+Club' },
        ],
      },
    ],
  },
  {
    id: 'barcelona-4day-gaudi',
    title: '4 Days in Barcelona: Gaudí, Tapas & Mediterranean Beaches',
    destination: 'Barcelona', country: 'Spain', flagEmoji: '🇪🇸',
    coverImage: 'https://images.unsplash.com/photo-1523531294919-4bcd7c65e216?auto=format&fit=crop&w=1200&q=80',
    summary: 'Sagrada Família and Park Güell, Gothic Quarter alleys, La Boqueria market, late-night tapas crawls in El Born, and a beach day in Barceloneta.',
    durationDays: 4, season: 'Spring',
    preferences: ['Architecture', 'Food', 'Beach', 'Nightlife', 'History'],
    companionStyle: 'Friends', estimatedCostUSD: 980,
    transportation: 'Hola Barcelona metro pass & walking',
    weatherForecast: 'Sunny Spring 21°C (70°F), warm Mediterranean afternoons',
    creatorId: 'user_lucia', creatorName: 'Lucía Fernández',
    creatorAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=200&q=80',
    likesCount: 367, bookmarksCount: 224, viewsCount: 4800, rating: 4.87, ratingsCount: 58,
    isPublished: true, updatedAt: '5 days ago',
    packingList: [
      { id: 'brp1', category: 'Documents', item: 'Timed Sagrada Família & Park Güell tickets', packed: true },
      { id: 'brp2', category: 'Essentials', item: 'Anti-theft crossbody bag (pickpockets on Las Ramblas)', packed: true },
      { id: 'brp3', category: 'Clothing', item: 'Swimsuit & beach towel', packed: false },
    ],
    comments: [
      { id: 'cbr1', userId: 'user_oliver', userName: 'Oliver Bennett', userAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=200&q=80', content: 'Bunkers del Carmel at sunset with a bottle of cava = best evening of our trip.', rating: 5, createdAt: '6 days ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Gothic Quarter & La Rambla',
        activities: [
          { id: 'bract_1', title: 'Barcelona Cathedral & Gothic Quarter Walk', category: 'History', location: 'Barri Gòtic, Barcelona', description: 'Get lost in medieval lanes, Roman wall fragments, and the cathedral’s rooftop terrace.', estimatedDuration: '2.5 hrs', estimatedCost: 15, timeOfDay: 'Morning', lat: 41.3840, lng: 2.1762, googleMapsUrl: 'https://maps.google.com/?q=Barcelona+Cathedral' },
          { id: 'bract_2', title: 'La Boqueria Market Lunch', category: 'Food', location: 'La Rambla, Barcelona', description: 'Grab jamón cones, fresh juices, and garlic prawns at a counter bar in the famous market.', estimatedDuration: '1.5 hrs', estimatedCost: 25, timeOfDay: 'Afternoon', lat: 41.3817, lng: 2.1716, googleMapsUrl: 'https://maps.google.com/?q=La+Boqueria' },
          { id: 'bract_3', title: 'El Born Tapas Crawl', category: 'Nightlife', location: 'El Born, Barcelona', description: 'Hop between vermouth bars and pintxos counters near the Santa Maria del Mar basilica.', estimatedDuration: '3 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 41.3850, lng: 2.1820, googleMapsUrl: 'https://maps.google.com/?q=El+Born+Barcelona' },
        ],
      },
      {
        dayNumber: 2, title: 'Gaudí Masterpieces',
        activities: [
          { id: 'bract_4', title: 'Sagrada Família Basilica', category: 'Architecture', location: 'Eixample, Barcelona', description: 'Stand inside Gaudí’s forest of stone columns as rainbow light floods through the stained glass.', estimatedDuration: '2 hrs', estimatedCost: 30, timeOfDay: 'Morning', lat: 41.4036, lng: 2.1744, googleMapsUrl: 'https://maps.google.com/?q=Sagrada+Familia' },
          { id: 'bract_5', title: 'Casa Batlló & Passeig de Gràcia', category: 'Architecture', location: 'Eixample, Barcelona', description: 'Tour the dragon-roofed house and stroll past La Pedrera on Barcelona’s grandest boulevard.', estimatedDuration: '2.5 hrs', estimatedCost: 35, timeOfDay: 'Afternoon', lat: 41.3916, lng: 2.1650, googleMapsUrl: 'https://maps.google.com/?q=Casa+Batllo' },
          { id: 'bract_6', title: 'Bunkers del Carmel Sunset', category: 'Photography', location: 'El Carmel, Barcelona', description: 'Climb to old anti-aircraft bunkers for a 360° sunset view over the whole city and sea.', estimatedDuration: '2 hrs', estimatedCost: 0, timeOfDay: 'Evening', lat: 41.4192, lng: 2.1617, googleMapsUrl: 'https://maps.google.com/?q=Bunkers+del+Carmel' },
        ],
      },
      {
        dayNumber: 3, title: 'Park Güell & Barceloneta Beach',
        activities: [
          { id: 'bract_7', title: 'Park Güell Mosaic Terraces', category: 'Architecture', location: 'Gràcia, Barcelona', description: 'See the mosaic salamander and gingerbread-style gatehouses on Gaudí’s hilltop park.', estimatedDuration: '2 hrs', estimatedCost: 13, timeOfDay: 'Morning', lat: 41.4145, lng: 2.1527, googleMapsUrl: 'https://maps.google.com/?q=Park+Guell' },
          { id: 'bract_8', title: 'Barceloneta Beach Afternoon', category: 'Beach', location: 'Barceloneta, Barcelona', description: 'Swim, sunbathe, and grab a mojito from a beachside chiringuito.', estimatedDuration: '3 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 41.3784, lng: 2.1925, googleMapsUrl: 'https://maps.google.com/?q=Barceloneta+Beach' },
          { id: 'bract_9', title: 'Seafood Paella by the Port', category: 'Food', location: 'Port Vell, Barcelona', description: 'Share a sizzling pan of seafood paella and a pitcher of sangria overlooking the yachts.', estimatedDuration: '2 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 41.3800, lng: 2.1850, googleMapsUrl: 'https://maps.google.com/?q=Port+Vell' },
        ],
      },
      {
        dayNumber: 4, title: 'Montjuïc & Magic Fountain',
        activities: [
          { id: 'bract_10', title: 'Montjuïc Cable Car & Castle', category: 'History', location: 'Montjuïc, Barcelona', description: 'Ride the cable car up to a hilltop fortress with sweeping harbor views.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Morning', lat: 41.3634, lng: 2.1658, googleMapsUrl: 'https://maps.google.com/?q=Montjuic+Castle' },
          { id: 'bract_11', title: 'Picasso Museum', category: 'Museum', location: 'El Born, Barcelona', description: 'Trace Picasso’s early years through 4,000 works in five connected medieval palaces.', estimatedDuration: '2 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 41.3852, lng: 2.1810, googleMapsUrl: 'https://maps.google.com/?q=Museu+Picasso' },
          { id: 'bract_12', title: 'Magic Fountain Show & Late Dinner', category: 'Nightlife', location: 'Plaça d’Espanya, Barcelona', description: 'Watch the musical light-and-water show, then dine Spanish-style after 10pm.', estimatedDuration: '3 hrs', estimatedCost: 35, timeOfDay: 'Evening', lat: 41.3712, lng: 2.1517, googleMapsUrl: 'https://maps.google.com/?q=Magic+Fountain+of+Montjuic' },
        ],
      },
    ],
  },
  {
    id: 'seoul-5day-kculture',
    title: '5 Days in Seoul: Palaces, K-Culture & Night Markets',
    destination: 'Seoul', country: 'South Korea', flagEmoji: '🇰🇷',
    coverImage: 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?auto=format&fit=crop&w=1200&q=80',
    summary: 'Wear a hanbok to Gyeongbokgung, sizzle Korean BBQ, shop Myeongdong skincare, peer into North Korea at the DMZ, and graze through Gwangjang Market after dark.',
    durationDays: 5, season: 'Autumn',
    preferences: ['City', 'Food', 'History', 'Shopping', 'Nightlife'],
    companionStyle: 'Solo', estimatedCostUSD: 1050,
    transportation: 'Seoul Metro with T-money card',
    weatherForecast: 'Crisp Autumn 17°C (63°F), clear skies & red maple leaves',
    creatorId: 'user_minji', creatorName: 'Kim Min-ji',
    creatorAvatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=200&q=80',
    likesCount: 478, bookmarksCount: 335, viewsCount: 6600, rating: 4.9, ratingsCount: 82,
    isPublished: true, updatedAt: '1 day ago',
    packingList: [
      { id: 'sep1', category: 'Essentials', item: 'T-money transit card', packed: true },
      { id: 'sep2', category: 'Electronics', item: 'Naver Map & Papago translator downloaded', packed: true },
      { id: 'sep3', category: 'Documents', item: 'Passport for the DMZ tour (mandatory)', packed: false },
      { id: 'sep4', category: 'Essentials', item: 'Extra suitcase space for Korean skincare', packed: false },
    ],
    comments: [
      { id: 'cse1', userId: 'user_jordan', userName: 'Jordan Hayes', userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=200&q=80', content: 'Wearing a hanbok got me into the palace free — great tip!', rating: 5, createdAt: '4 days ago' },
    ],
    days: [
      {
        dayNumber: 1, title: 'Royal Palaces & Bukchon Hanok Village',
        activities: [
          { id: 'seact_1', title: 'Gyeongbokgung Palace in a Rented Hanbok', category: 'History', location: 'Jongno, Seoul', description: 'Rent traditional dress (free palace entry!) and watch the royal guard changing ceremony.', estimatedDuration: '3 hrs', estimatedCost: 20, timeOfDay: 'Morning', lat: 37.5796, lng: 126.9770, googleMapsUrl: 'https://maps.google.com/?q=Gyeongbokgung+Palace' },
          { id: 'seact_2', title: 'Bukchon Hanok Village & Insadong Tea House', category: 'Hidden Gems', location: 'Jongno, Seoul', description: 'Walk hillside lanes of tiled-roof homes, then sip jujube tea in an Insadong tea house.', estimatedDuration: '2.5 hrs', estimatedCost: 12, timeOfDay: 'Afternoon', lat: 37.5826, lng: 126.9831, googleMapsUrl: 'https://maps.google.com/?q=Bukchon+Hanok+Village' },
          { id: 'seact_3', title: 'Gwangjang Market Night Food', category: 'Food', location: 'Jongno, Seoul', description: 'Eat crispy bindaetteok mung-bean pancakes and live octopus at Seoul’s oldest market.', estimatedDuration: '2 hrs', estimatedCost: 18, timeOfDay: 'Evening', lat: 37.5701, lng: 126.9996, googleMapsUrl: 'https://maps.google.com/?q=Gwangjang+Market' },
        ],
      },
      {
        dayNumber: 2, title: 'Myeongdong, N Seoul Tower & K-BBQ',
        activities: [
          { id: 'seact_4', title: 'Changdeokgung Secret Garden Tour', category: 'Nature', location: 'Jongno, Seoul', description: 'Join a guided tour of the UNESCO-listed royal garden with lotus ponds and pavilions.', estimatedDuration: '2 hrs', estimatedCost: 8, timeOfDay: 'Morning', lat: 37.5794, lng: 126.9910, googleMapsUrl: 'https://maps.google.com/?q=Changdeokgung' },
          { id: 'seact_5', title: 'Myeongdong Skincare Shopping & Street Snacks', category: 'Shopping', location: 'Jung-gu, Seoul', description: 'Stock up on sheet masks and snack on egg bread and tornado potatoes.', estimatedDuration: '2.5 hrs', estimatedCost: 40, timeOfDay: 'Afternoon', lat: 37.5636, lng: 126.9827, googleMapsUrl: 'https://maps.google.com/?q=Myeongdong' },
          { id: 'seact_6', title: 'N Seoul Tower & Korean BBQ Dinner', category: 'City', location: 'Namsan, Seoul', description: 'Ride the cable car up Namsan for city lights, then grill samgyeopsal pork belly at your table.', estimatedDuration: '3 hrs', estimatedCost: 45, timeOfDay: 'Evening', lat: 37.5512, lng: 126.9882, googleMapsUrl: 'https://maps.google.com/?q=N+Seoul+Tower' },
        ],
      },
      {
        dayNumber: 3, title: 'DMZ Tour & Hongdae Nightlife',
        activities: [
          { id: 'seact_7', title: 'DMZ & Third Infiltration Tunnel Tour', category: 'History', location: 'Paju, Gyeonggi-do', description: 'Look across into North Korea from Dora Observatory and walk a secret invasion tunnel.', estimatedDuration: '5 hrs', estimatedCost: 70, timeOfDay: 'Morning', lat: 37.9165, lng: 126.6990, googleMapsUrl: 'https://maps.google.com/?q=Third+Tunnel+of+Aggression' },
          { id: 'seact_8', title: 'Hongdae Indie Cafés & Street Buskers', category: 'Cafe', location: 'Mapo-gu, Seoul', description: 'Recover in a quirky themed café and watch K-pop dance crews perform in the street.', estimatedDuration: '2 hrs', estimatedCost: 15, timeOfDay: 'Afternoon', lat: 37.5563, lng: 126.9236, googleMapsUrl: 'https://maps.google.com/?q=Hongdae' },
          { id: 'seact_9', title: 'Hongdae Clubs & Noraebang Karaoke', category: 'Nightlife', location: 'Mapo-gu, Seoul', description: 'Belt out K-pop in a private karaoke room, then hit the university district’s clubs.', estimatedDuration: '4 hrs', estimatedCost: 40, timeOfDay: 'Evening', lat: 37.5550, lng: 126.9220, googleMapsUrl: 'https://maps.google.com/?q=Hongdae+Club+Street' },
        ],
      },
      {
        dayNumber: 4, title: 'Gangnam Glamour & Han River',
        activities: [
          { id: 'seact_10', title: 'Starfield Library at COEX Mall', category: 'Architecture', location: 'Gangnam, Seoul', description: 'Snap photos beneath 13-meter towering bookshelves in this Instagram-famous library.', estimatedDuration: '1.5 hrs', estimatedCost: 0, timeOfDay: 'Morning', lat: 37.5100, lng: 127.0600, googleMapsUrl: 'https://maps.google.com/?q=Starfield+Library' },
          { id: 'seact_11', title: 'Lotte World Tower Seoul Sky', category: 'City', location: 'Songpa-gu, Seoul', description: 'Step onto the glass floor 500 meters up the world’s sixth-tallest building.', estimatedDuration: '2 hrs', estimatedCost: 25, timeOfDay: 'Afternoon', lat: 37.5126, lng: 127.1025, googleMapsUrl: 'https://maps.google.com/?q=Lotte+World+Tower' },
          { id: 'seact_12', title: 'Han River Picnic & Banpo Rainbow Fountain', category: 'Romantic', location: 'Banpo Hangang Park, Seoul', description: 'Order fried chicken delivered to the riverbank and watch the bridge’s rainbow fountain show.', estimatedDuration: '2.5 hrs', estimatedCost: 20, timeOfDay: 'Evening', lat: 37.5100, lng: 126.9960, googleMapsUrl: 'https://maps.google.com/?q=Banpo+Bridge+Rainbow+Fountain' },
        ],
      },
      {
        dayNumber: 5, title: 'Ikseon-dong & Farewell Feast',
        activities: [
          { id: 'seact_13', title: 'Ikseon-dong Hanok Café Alleys', category: 'Cafe', location: 'Jongno, Seoul', description: 'Brunch in century-old hanok houses converted into trendy bakeries and boutiques.', estimatedDuration: '2 hrs', estimatedCost: 18, timeOfDay: 'Morning', lat: 37.5744, lng: 126.9897, googleMapsUrl: 'https://maps.google.com/?q=Ikseon-dong' },
          { id: 'seact_14', title: 'Dongdaemun Design Plaza', category: 'Architecture', location: 'Jung-gu, Seoul', description: 'Explore Zaha Hadid’s futuristic silver-curved landmark and its design exhibitions.', estimatedDuration: '2 hrs', estimatedCost: 10, timeOfDay: 'Afternoon', lat: 37.5665, lng: 127.0092, googleMapsUrl: 'https://maps.google.com/?q=Dongdaemun+Design+Plaza' },
          { id: 'seact_15', title: 'Cheonggyecheon Stream Walk & Hanjeongsik Dinner', category: 'Food', location: 'Jung-gu, Seoul', description: 'Stroll the lantern-lit urban stream, then feast on a 20-dish royal-style set dinner.', estimatedDuration: '3 hrs', estimatedCost: 55, timeOfDay: 'Evening', lat: 37.5691, lng: 126.9786, googleMapsUrl: 'https://maps.google.com/?q=Cheonggyecheon' },
        ],
      },
    ],
  },
];
