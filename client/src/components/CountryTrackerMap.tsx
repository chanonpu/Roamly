import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { loadWorldGeo, canonicalCountryName, isVisited, VISITED_STYLE, UNVISITED_STYLE } from '../lib/worldGeo';

interface CountryTrackerMapProps {
  visited: string[];
  onToggleCountry: (country: string) => void;
  height?: string;
}

const featureName = (feature?: GeoJSON.Feature) => String(feature?.properties?.name ?? '');

const CountryTrackerMapImpl: React.FC<CountryTrackerMapProps> = ({ visited, onToggleCountry, height = '420px' }) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const layerRef = useRef<L.GeoJSON | null>(null);
  // Read through refs so the map (created once) always sees current props.
  const visitedRef = useRef(visited);
  const onToggleRef = useRef(onToggleCountry);
  visitedRef.current = visited;
  onToggleRef.current = onToggleCountry;
  const [loadError, setLoadError] = useState(false);

  const styleFor = (feature?: GeoJSON.Feature) =>
    isVisited(featureName(feature), visitedRef.current) ? VISITED_STYLE : UNVISITED_STYLE;

  // Create the map + country layer once; toggling only restyles it.
  useEffect(() => {
    if (!mapRef.current) return;
    let cancelled = false;

    const map = L.map(mapRef.current, {
      center: [20, 0],
      zoom: 2,
      minZoom: 1,
      zoomControl: true,
      scrollWheelZoom: true,
      worldCopyJump: true
    });

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    loadWorldGeo()
      .then(geo => {
        if (cancelled) return;
        layerRef.current = L.geoJSON(geo, {
          style: styleFor,
          onEachFeature: (feature, layer) => {
            const name = canonicalCountryName(featureName(feature));
            layer.bindTooltip(name, { sticky: true });
            layer.on('click', () => onToggleRef.current(name));
          }
        }).addTo(map);
      })
      .catch(() => { if (!cancelled) setLoadError(true); });

    return () => {
      cancelled = true;
      layerRef.current = null;
      map.remove();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    layerRef.current?.setStyle(styleFor);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [visited]);

  return (
    <div className="relative isolate w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md">
      <div ref={mapRef} style={{ height }} className="w-full" />
      {loadError && (
        <div className="absolute inset-x-0 bottom-0 z-[1000] px-3 py-2 text-xs font-semibold bg-amber-50 text-amber-800 border-t border-amber-200">
          Couldn't load country outlines. Use the chips below instead.
        </div>
      )}
    </div>
  );
};

export const CountryTrackerMap = React.memo(CountryTrackerMapImpl);
export default CountryTrackerMap;
