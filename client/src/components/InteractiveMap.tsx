import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Destination, Activity } from '../types/travel';
import { escapeHtml } from '../lib/sanitize';
import { loadWorldGeo, isVisited, VISITED_STYLE } from '../lib/worldGeo';

interface InteractiveMapProps {
  destinations?: Destination[];
  activities?: Activity[];
  center?: [number, number];
  zoom?: number;
  onSelectDestination?: (dest: Destination) => void;
  height?: string;
  visitedCountries?: string[];
}

const InteractiveMapImpl: React.FC<InteractiveMapProps> = ({
  destinations = [],
  activities = [],
  center = [20, 0],
  zoom = 2,
  onSelectDestination,
  height = '500px',
  visitedCountries
}) => {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const leafletInstance = useRef<L.Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    // Clean up previous map if exists
    if (leafletInstance.current) {
      leafletInstance.current.remove();
      leafletInstance.current = null;
    }

    // Initialize map
    const map = L.map(mapRef.current, {
      center: center as L.LatLngTuple,
      zoom,
      zoomControl: true,
      scrollWheelZoom: true
    });

    leafletInstance.current = map;

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      maxZoom: 18,
    }).addTo(map);

    // Shade the signed-in user's visited countries beneath the pins.
    let cancelled = false;
    if (visitedCountries && visitedCountries.length > 0) {
      loadWorldGeo()
        .then(geo => {
          if (cancelled) return;
          L.geoJSON(geo, {
            filter: feature => isVisited(String(feature.properties?.name ?? ''), visitedCountries),
            style: VISITED_STYLE,
            interactive: false
          }).addTo(map);
        })
        .catch(() => { /* overlay is decorative; the map still works without it */ });
    }

    // Color helper for pins
    const getCategoryColor = (cat: string) => {
      switch (cat) {
        case 'Museum': return '#a855f7';
        case 'Nature': return '#10b981';
        case 'Food':
        case 'Restaurant': return '#f59e0b';
        case 'Hotel': return '#6366f1';
        case 'Beach': return '#06b6d4';
        case 'Mountain': return '#64748b';
        default: return '#0284c7';
      }
    };

    // Render Destination Pins
    if (destinations.length > 0) {
      const destBounds = L.latLngBounds([]);

      destinations.forEach((dest) => {
        destBounds.extend([dest.lat, dest.lng]);

        const pinHtml = `
          <div class="w-8 h-8 rounded-full bg-white dark:bg-slate-900 shadow-lg border-2 border-sky-500 flex items-center justify-center text-base hover:scale-110 transition-transform cursor-pointer">
            ${escapeHtml(dest.flag)}
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-destination-marker',
          iconSize: [32, 32],
          iconAnchor: [16, 16]
        });

        const marker = L.marker([dest.lat, dest.lng], { icon: customIcon }).addTo(map);

        const popupContent = document.createElement('div');
        popupContent.className = 'p-2 max-w-xs text-slate-800 font-sans';
        popupContent.innerHTML = `
          <div class="font-bold text-sm flex items-center gap-1.5 mb-1">
            <span>${escapeHtml(dest.flag)}</span> <span>${escapeHtml(dest.city)}, ${escapeHtml(dest.country)}</span>
          </div>
          <p class="text-xs text-slate-600 line-clamp-2 mb-2">${escapeHtml(dest.description)}</p>
          <div class="text-[11px] font-semibold text-sky-600 mb-2">Avg daily: $${Number(dest.avgDailyCostUSD)} / day</div>
          <button id="pop-plan-${escapeHtml(dest.id)}" class="w-full py-1 bg-sky-500 hover:bg-sky-600 text-white rounded text-xs font-bold transition-colors cursor-pointer">
            Plan Trip
          </button>
        `;

        marker.bindPopup(popupContent);

        // The in-popup "Plan Trip" button lives in HTML injected via
        // innerHTML, so it has no React event handler — Leaflet re-creates
        // this DOM each time the popup opens, meaning a handler bound once
        // at marker-creation time would target a stale (removed) node.
        // Binding on the 'popupopen' event guarantees we attach to the node
        // that's actually in the document right now.
        marker.on('popupopen', () => {
          const btn = document.getElementById(`pop-plan-${dest.id}`);
          btn?.addEventListener('click', () => onSelectDestination?.(dest), { once: true });
        });

        // Clicking the pin itself also selects the destination (previous
        // behavior), independent of the popup button.
        marker.on('click', () => {
          onSelectDestination?.(dest);
        });
      });

      if (destBounds.isValid() && destinations.length > 1) {
        map.fitBounds(destBounds, { padding: [40, 40] });
      } else if (destinations.length === 1) {
        map.setView([destinations[0].lat, destinations[0].lng], 5);
      }
    }

    // Render Activity Pins for Itinerary View
    if (activities.length > 0) {
      const bounds = L.latLngBounds([]);

      activities.forEach((act, index) => {
        if (!act.lat || !act.lng) return;

        bounds.extend([act.lat, act.lng]);
        const color = getCategoryColor(act.category);

        const pinHtml = `
          <div class="w-7 h-7 rounded-full text-white font-bold text-xs flex items-center justify-center shadow-md border-2 border-white" style="background-color: ${color}">
            ${index + 1}
          </div>
        `;

        const customIcon = L.divIcon({
          html: pinHtml,
          className: 'custom-activity-marker',
          iconSize: [28, 28],
          iconAnchor: [14, 14]
        });

        const marker = L.marker([act.lat, act.lng], { icon: customIcon }).addTo(map);

        marker.bindPopup(`
          <div class="p-1.5 text-slate-800">
            <span class="text-[10px] uppercase tracking-wider font-bold text-sky-600">${escapeHtml(act.timeOfDay)}</span>
            <div class="font-bold text-xs mt-0.5">${escapeHtml(act.title)}</div>
            <div class="text-[11px] text-slate-500">${escapeHtml(act.location)}</div>
            <div class="text-[11px] font-semibold text-emerald-600 mt-1">Est. Cost: $${Number(act.estimatedCost)}</div>
          </div>
        `);
      });

      if (bounds.isValid()) {
        map.fitBounds(bounds, { padding: [50, 50] });
      }
    }

    return () => {
      cancelled = true;
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [destinations, activities, center, zoom, onSelectDestination, visitedCountries]);

  return (
    <div className="relative isolate w-full rounded-2xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-md">
      <div ref={mapRef} style={{ height }} className="w-full" />
    </div>
  );
};

// Destinations/activities arrays are usually freshly-filtered/mapped on
// every parent render (new array identity even with the same contents),
// so a plain reference-equality memo wouldn't help much on its own — but it
// still protects against re-renders from unrelated parent state (e.g. a
// sibling input's value changing) that don't touch map props at all.
export const InteractiveMap = React.memo(InteractiveMapImpl);
export default InteractiveMap;
