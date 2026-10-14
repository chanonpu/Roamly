import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';

// Keeps Leaflet out of the Profile chunk until the tracker tab is opened.
const CountryTrackerMap = lazy(() =>
  import('./CountryTrackerMap').then(mod => ({ default: mod.CountryTrackerMap }))
);

interface LazyCountryTrackerMapProps {
  visited: string[];
  onToggleCountry: (country: string) => void;
  height?: string;
}

export const LazyCountryTrackerMap: React.FC<LazyCountryTrackerMapProps> = (props) => (
  <Suspense
    fallback={
      <div
        style={{ height: props.height ?? '420px' }}
        className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 text-xs gap-2"
      >
        <Loader2 className="w-4 h-4 animate-spin" /> Loading map...
      </div>
    }
  >
    <CountryTrackerMap {...props} />
  </Suspense>
);
