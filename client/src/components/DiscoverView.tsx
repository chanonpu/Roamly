import React, { useEffect, useMemo } from 'react';
import { MapPin, DollarSign, ArrowRight, Compass } from 'lucide-react';
import { Destination, Currency } from '../types/travel';
import { LazyInteractiveMap as InteractiveMap } from './LazyInteractiveMap';
import { formatCurrency } from '../lib/format';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';

interface DiscoverViewProps {
  destinations: Destination[];
  currency: Currency;
  searchQuery: string;
  onSelectDestination: (destination: Destination) => void;
}

// Extracted + memoized so re-renders of the parent (e.g. currency swap)
// don't re-render every card unless that card's own props actually changed.
const DestinationCard = React.memo(function DestinationCard({
  destination, currency, onSelect,
}: { destination: Destination; currency: Currency; onSelect: (d: Destination) => void }) {
  return (
    <div className="group editorial-card rounded-3xl overflow-hidden cursor-pointer flex flex-col hover:shadow-xl transition-all duration-300">
      <div className="relative h-44 w-full overflow-hidden">
        <img
          src={destination.image}
          alt={destination.city}
          loading="lazy"
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-transparent to-transparent" />
        <span className="absolute top-3 left-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 backdrop-blur-md shadow-xs">
          {destination.flag} {destination.country}
        </span>
        {destination.hasWarning && (
          <span className="absolute top-3 right-3 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/90 text-white backdrop-blur-md shadow-xs">
            ⚠️ Advisory
          </span>
        )}
      </div>

      <div className="p-4 space-y-2.5 flex-1 flex flex-col justify-between">
        <div className="space-y-1.5">
          <h3 className="text-sm font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
            {destination.city}
          </h3>
          <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
            {destination.description}
          </p>
        </div>

        <div className="flex items-center justify-between pt-1 text-xs">
          <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" /> {formatCurrency(destination.avgDailyCostUSD, currency)}/day
          </span>
          <button
            onClick={() => onSelect(destination)}
            className="flex items-center gap-1 px-3 py-1.5 rounded-xl font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 hover:bg-sky-100 transition-colors cursor-pointer"
          >
            Details <ArrowRight className="w-3 h-3" />
          </button>
        </div>
      </div>
    </div>
  );
});

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations, currency, searchQuery, onSelectDestination,
}) => {
  const debouncedQuery = useDebouncedValue(searchQuery, 200);

  const filtered = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return destinations;
    return destinations.filter(d =>
      d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [destinations, debouncedQuery]);

  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q) track('search', { query: q, context: 'discover', resultsCount: filtered.length });
  }, [debouncedQuery, filtered.length]);

  return (
    <div id="discover-view-container" className="max-w-7xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      <div className="text-center space-y-2">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Compass className="w-3.5 h-3.5" /> Where To Next
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-serif-heading">
          Discover Your Next Destination
        </h1>
        <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
          Browse curated destinations on the map, then generate an AI itinerary or explore what fellow travelers have already built.
        </p>
      </div>

      <InteractiveMap destinations={filtered} onSelectDestination={onSelectDestination} height="420px" />

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8" />
          No destinations match "{debouncedQuery}". Try a different search.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          {filtered.map(dest => (
            <DestinationCard key={dest.id} destination={dest} currency={currency} onSelect={onSelectDestination} />
          ))}
        </div>
      )}
    </div>
  );
};
