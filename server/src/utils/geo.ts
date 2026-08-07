import { Activity } from '../types/travel.js';

const EARTH_RADIUS_KM = 6371;
const toRad = (deg: number) => (deg * Math.PI) / 180;

export function haversineKm(a: { lat: number; lng: number }, b: { lat: number; lng: number }): number {
  const dLat = toRad(b.lat - a.lat);
  const dLng = toRad(b.lng - a.lng);
  const lat1 = toRad(a.lat);
  const lat2 = toRad(b.lat);

  const h =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLng / 2) ** 2;
  return 2 * EARTH_RADIUS_KM * Math.asin(Math.sqrt(h));
}

/**
 * Greedy nearest-neighbor route ordering. Not a true TSP solver, but for a
 * single day's worth of activities (typically 2-6 stops) it produces a
 * tight, sensible loop in linear-ish time and is easy to reason about.
 * Activities missing lat/lng are left in place at the end, in their
 * original relative order, since we can't place them geographically.
 */
export function optimizeActivityRoute(activities: Activity[]): { ordered: Activity[]; totalKm: number } {
  const withCoords = activities.filter(a => typeof a.lat === 'number' && typeof a.lng === 'number');
  const withoutCoords = activities.filter(a => !(typeof a.lat === 'number' && typeof a.lng === 'number'));

  if (withCoords.length <= 1) {
    return { ordered: [...withCoords, ...withoutCoords], totalKm: 0 };
  }

  const remaining = [...withCoords];
  const ordered: Activity[] = [remaining.shift()!];
  let totalKm = 0;

  while (remaining.length > 0) {
    const current = ordered[ordered.length - 1];
    let nearestIdx = 0;
    let nearestDist = Infinity;

    for (let i = 0; i < remaining.length; i++) {
      const dist = haversineKm(
        { lat: current.lat!, lng: current.lng! },
        { lat: remaining[i].lat!, lng: remaining[i].lng! }
      );
      if (dist < nearestDist) {
        nearestDist = dist;
        nearestIdx = i;
      }
    }

    totalKm += nearestDist;
    const [next] = remaining.splice(nearestIdx, 1);
    ordered.push(next);
  }

  return { ordered: [...ordered, ...withoutCoords], totalKm: Math.round(totalKm * 10) / 10 };
}
