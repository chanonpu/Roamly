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

// NOTE: kept intentionally small — days/activities/comments copied from the
// frontend's mockData.ts. Trimmed slightly (fewer days per trip) since this
// is seed/demo data, not the full dataset; add more via POST /api/itineraries
// or the AI generator once the server is running.
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
    ],
  },
];
