import React, { Suspense, lazy } from 'react';
import { Loader2 } from 'lucide-react';
import { Destination, Activity } from '../types/travel';

// Leaflet (~150KB) and its CSS are only needed on the two screens that show
// a map (Discover's destination map, Itinerary's "Map Pins" view). Splitting
// it into its own chunk means everyone else — Community Feed, Profile,
// Trip Planner — never downloads or parses it.
const InteractiveMap = lazy(() =>
  import('./InteractiveMap').then(mod => ({ default: mod.InteractiveMap }))
);

interface LazyInteractiveMapProps {
  destinations?: Destination[];
  activities?: Activity[];
  center?: [number, number];
  zoom?: number;
  onSelectDestination?: (dest: Destination) => void;
  height?: string;
}

function MapSkeleton({ height = '500px' }: { height?: string }) {
  return (
    <div
      style={{ height }}
      className="w-full rounded-2xl border border-stone-200 dark:border-stone-800 bg-stone-100 dark:bg-stone-900 flex items-center justify-center text-stone-400 text-xs gap-2"
    >
      <Loader2 className="w-4 h-4 animate-spin" /> Loading map...
    </div>
  );
}

export const LazyInteractiveMap: React.FC<LazyInteractiveMapProps> = (props) => (
  <Suspense fallback={<MapSkeleton height={props.height} />}>
    <InteractiveMap {...props} />
  </Suspense>
);
