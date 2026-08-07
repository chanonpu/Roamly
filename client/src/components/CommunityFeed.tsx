import React, { useEffect, useMemo, useState } from 'react';
import {
  Search, Filter, Heart, Star, GitFork, Eye,
  Layers
} from 'lucide-react';
import { TravelItinerary, TravelCategory, Currency } from '../types/travel';
import { formatCurrency } from '../lib/format';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';

interface CommunityFeedProps {
  itineraries: TravelItinerary[];
  currency: Currency;
  onSelectItinerary: (itinerary: TravelItinerary) => void;
  onForkItinerary: (itinerary: TravelItinerary) => void;
  onOpenWizardWithDest: (destinationName: string) => void;
  /** Optional — lets a caller (e.g. "Browse Community Plans" from a
   *  destination's detail modal) land here pre-filtered to that city. */
  initialSearch?: string;
}

const ItineraryCard = React.memo(function ItineraryCard({
  it, currency, onSelectItinerary, onForkItinerary,
}: {
  it: TravelItinerary;
  currency: Currency;
  onSelectItinerary: (it: TravelItinerary) => void;
  onForkItinerary: (it: TravelItinerary) => void;
}) {
  return (
    <div className="group editorial-card rounded-3xl overflow-hidden cursor-pointer flex flex-col justify-between hover:shadow-xl transition-all duration-300">
      <div className="relative h-48 w-full overflow-hidden">
        <img
          src={it.coverImage}
          alt={it.title}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />

        <div className="absolute top-3 left-3 right-3 flex items-center justify-between">
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 backdrop-blur-md shadow-xs">
            {it.flagEmoji} {it.destination}
          </span>
          <span className="px-2.5 py-1 rounded-full text-[11px] font-bold bg-sky-700/90 text-white backdrop-blur-md shadow-xs">
            {it.durationDays} Days
          </span>
        </div>

        <div className="absolute bottom-3 left-3 right-3 flex items-center justify-between text-white text-xs">
          <div className="flex items-center gap-1.5 font-bold">
            <Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
            <span>{it.rating}</span>
            <span className="text-stone-300 font-normal">({it.ratingsCount})</span>
          </div>
          <div className="font-bold text-emerald-400">
            Est: {formatCurrency(it.estimatedCostUSD, currency)}
          </div>
        </div>
      </div>

      <div className="p-5 space-y-3 flex-1 flex flex-col justify-between">
        <div className="space-y-2">
          <h3
            onClick={() => onSelectItinerary(it)}
            className="text-base font-bold text-stone-900 dark:text-stone-100 group-hover:text-sky-700 dark:group-hover:text-sky-400 transition-colors cursor-pointer line-clamp-2 font-serif-heading"
          >
            {it.title}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {it.summary}
          </p>
        </div>

        <div className="pt-3 border-t border-stone-100 dark:border-stone-800 flex items-center justify-between text-xs">
          <div className="flex items-center gap-2">
            <img src={it.creatorAvatar} alt={it.creatorName} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
            <span className="font-semibold text-stone-700 dark:text-stone-300">{it.creatorName}</span>
          </div>
          <div className="flex items-center gap-3 text-stone-400 font-medium">
            <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-500" /> {it.likesCount}</span>
            <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {it.viewsCount}</span>
          </div>
        </div>

        <div className="pt-2 flex items-center gap-2">
          <button
            id={`view-plan-${it.id}`}
            onClick={() => onSelectItinerary(it)}
            className="flex-1 py-2 px-3 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 hover:bg-sky-100 transition-colors text-center cursor-pointer"
          >
            View Itinerary
          </button>
          <button
            id={`fork-plan-${it.id}`}
            onClick={() => onForkItinerary(it)}
            className="py-2 px-3 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all flex items-center gap-1 cursor-pointer"
            title="Fork into your editable trips"
          >
            <GitFork className="w-3.5 h-3.5" /> Fork
          </button>
        </div>
      </div>
    </div>
  );
});

export const CommunityFeed: React.FC<CommunityFeedProps> = ({
  itineraries,
  currency,
  onSelectItinerary,
  onForkItinerary,
  initialSearch,
}) => {
  const [searchTerm, setSearchTerm] = useState(initialSearch ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [sortBy, setSortBy] = useState<'likes' | 'rating' | 'views' | 'recent'>('likes');
  const debouncedSearch = useDebouncedValue(searchTerm, 200);

  // If the parent hands us a fresh initialSearch (e.g. clicking "Browse
  // Community Plans" for a different destination on a later visit), reflect it.
  useEffect(() => {
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialSearch]);

  const sorted = useMemo(() => {
    const q = debouncedSearch.toLowerCase();
    const filtered = itineraries.filter(it => {
      const matchesSearch = !q ||
        it.title.toLowerCase().includes(q) ||
        it.destination.toLowerCase().includes(q) ||
        it.country.toLowerCase().includes(q);
      const matchesCategory = selectedCategory === 'All' || it.preferences.includes(selectedCategory as TravelCategory);
      return matchesSearch && matchesCategory;
    });

    return [...filtered].sort((a, b) => {
      if (sortBy === 'likes') return b.likesCount - a.likesCount;
      if (sortBy === 'rating') return b.rating - a.rating;
      if (sortBy === 'views') return b.viewsCount - a.viewsCount;
      return 0;
    });
  }, [itineraries, debouncedSearch, selectedCategory, sortBy]);

  useEffect(() => {
    const q = debouncedSearch.trim();
    if (q) track('search', { query: q, context: 'community', category: selectedCategory, sort: sortBy, resultsCount: sorted.length });
  }, [debouncedSearch, selectedCategory, sortBy, sorted.length]);

  return (
    <div id="community-feed-container" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">

      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Layers className="w-3.5 h-3.5" /> Community Travel Vault
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-serif-heading">
          Explore Proven Itineraries & Fork Your Own
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
          Discover hand-crafted travel routes created by fellow globe trotters. Fork any plan into your personal workspace and customize every detail.
        </p>
      </div>

      <div className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-4">
        <div className="flex flex-col md:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="feed-search-input"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Tokyo, Paris, Iceland, road trips, anime..."
              className="w-full pl-10 pr-4 py-2.5 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-xs font-medium text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sky-600/40"
            />
          </div>

          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-stone-400 shrink-0">Sort:</span>
            <select
              id="feed-sort-select"
              value={sortBy}
              onChange={e => setSortBy(e.target.value as any)}
              className="py-2.5 px-3 rounded-2xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs font-semibold text-stone-800 dark:text-stone-200 focus:outline-none cursor-pointer"
            >
              <option value="likes">🔥 Most Liked</option>
              <option value="rating">⭐ Highest Rated</option>
              <option value="views">👁️ Most Viewed</option>
              <option value="recent">🕒 Recently Published</option>
            </select>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-stone-100 dark:border-stone-800 text-xs">
          <span className="font-bold text-stone-400 flex items-center gap-1 shrink-0">
            <Filter className="w-3.5 h-3.5" /> Style:
          </span>
          {['All', 'City', 'Nature', 'Museum', 'Food', 'Romantic', 'Adventure', 'Anime'].map(cat => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1 rounded-full font-semibold transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'bg-sky-700 text-white shadow-xs'
                  : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {sorted.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm">
          No itineraries match your filters yet — try a different search or category.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sorted.map(it => (
            <ItineraryCard key={it.id} it={it} currency={currency} onSelectItinerary={onSelectItinerary} onForkItinerary={onForkItinerary} />
          ))}
        </div>
      )}
    </div>
  );
};
