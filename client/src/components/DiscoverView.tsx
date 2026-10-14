import React, { useEffect, useMemo, useState } from 'react';
import { MapPin, DollarSign, Compass, Search } from 'lucide-react';
import { Destination, Currency } from '../types/travel';
import { LazyInteractiveMap as InteractiveMap } from './LazyInteractiveMap';
import { formatCurrency } from '../lib/format';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';
import { WILD_CARD_KEYS } from '../data/mockData';

interface DiscoverViewProps {
  destinations: Destination[];
  currency: Currency;
  onSelectDestination: (destination: Destination) => void;
  visitedCountries?: string[];
}

// Extracted + memoized so re-renders of the parent (e.g. currency swap)
// don't re-render every card unless that card's own props actually changed.
const DestinationCard = React.memo(function DestinationCard({
  destination, currency, onSelect,
}: { destination: Destination; currency: Currency; onSelect: (d: Destination) => void }) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={() => onSelect(destination)}
      onKeyDown={e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); onSelect(destination); } }}
      className="group editorial-card rounded-3xl overflow-hidden cursor-pointer flex flex-col hover:shadow-xl transition-all duration-300"
    >
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

        <div className="flex items-center pt-1 text-xs">
          <span className="flex items-center gap-1 font-bold text-emerald-700 dark:text-emerald-400">
            <DollarSign className="w-3.5 h-3.5" /> {formatCurrency(destination.avgDailyCostUSD, currency)}/day
          </span>
        </div>
      </div>
    </div>
  );
});

export const DiscoverView: React.FC<DiscoverViewProps> = ({
  destinations, currency, onSelectDestination, visitedCountries,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
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

  const [regular, wildCards] = useMemo(() => {
    const isWild = (d: Destination) => !!d.warningKey && WILD_CARD_KEYS.has(d.warningKey);
    return [filtered.filter(d => !isWild(d)), filtered.filter(isWild)];
  }, [filtered]);

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

      <div className="space-y-2">
        <div className="relative max-w-xl mx-auto mb-4" id="discover-search-container">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="discover-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              placeholder="Search Tokyo, Paris, Iceland, Sydney..."
              className="w-full pl-10 pr-4 py-2.5 text-sm rounded-full bg-white dark:bg-stone-900 border border-stone-300/80 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-600/40 transition-all shadow-sm"
            />
          </div>

          {showSearchDropdown && debouncedQuery.trim() && filtered.length > 0 && (
            <div id="search-autocomplete-dropdown" className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-[1100] overflow-hidden py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Destinations</div>
              {filtered.map((d, i) => (
                <button
                  key={d.id}
                  id={`search-item-${i}`}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-sky-50 dark:hover:bg-stone-800 flex items-center justify-between transition-colors"
                  onClick={() => {
                    onSelectDestination(d);
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                >
                  <span className="flex items-center gap-2 text-stone-700 dark:text-stone-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" /> {d.city}
                  </span>
                  <span className="text-xs text-stone-400">{d.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <InteractiveMap destinations={filtered} onSelectDestination={onSelectDestination} visitedCountries={visitedCountries} height="420px" />
        {visitedCountries && visitedCountries.length > 0 && (
          <p className="flex items-center gap-1.5 text-xs font-semibold text-stone-500 dark:text-stone-400">
            <span className="inline-block w-3 h-3 rounded-sm bg-emerald-600/60 border border-emerald-700" />
            Countries you've visited ({visitedCountries.length})
          </p>
        )}
      </div>

      {filtered.length === 0 ? (
        <div className="text-center py-16 text-stone-400 text-sm flex flex-col items-center gap-2">
          <MapPin className="w-8 h-8" />
          No destinations match "{debouncedQuery}". Try a different search.
        </div>
      ) : (
        <>
          {regular.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
              {regular.map(dest => (
                <DestinationCard key={dest.id} destination={dest} currency={currency} onSelect={onSelectDestination} />
              ))}
            </div>
          )}

          {wildCards.length > 0 && (
            <section id="wild-card-destinations" className="space-y-4 pt-4">
              <div className="text-center space-y-1.5">
                <h2 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif-heading">
                  🃏 Wild Card Destinations
                </h2>
                <p className="text-sm text-stone-600 dark:text-stone-400 max-w-xl mx-auto">
                  For travelers who find "off the beaten path" a little too beaten.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                {wildCards.map(dest => (
                  <DestinationCard key={dest.id} destination={dest} currency={currency} onSelect={onSelectDestination} />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
};
