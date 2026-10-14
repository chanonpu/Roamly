import type { FeatureCollection } from 'geojson';

// Natural Earth 110m country outlines (properties: { name }), served from
// client/public so it stays out of the JS bundle and is only fetched by maps.
let worldGeoPromise: Promise<FeatureCollection> | null = null;

export function loadWorldGeo(): Promise<FeatureCollection> {
  if (!worldGeoPromise) {
    worldGeoPromise = fetch(`${import.meta.env.BASE_URL}countries.geo.json`)
      .then(res => {
        if (!res.ok) throw new Error(`Failed to load country shapes (${res.status})`);
        return res.json() as Promise<FeatureCollection>;
      })
      .catch(err => {
        worldGeoPromise = null; // allow a retry on next mount
        throw err;
      });
  }
  return worldGeoPromise;
}

// Natural Earth abbreviates some names; map them to what users type.
const NAME_ALIASES: Record<string, string> = {
  'United States of America': 'United States',
  'Dem. Rep. Congo': 'Democratic Republic of the Congo',
  'Dominican Rep.': 'Dominican Republic',
  'Central African Rep.': 'Central African Republic',
  'Eq. Guinea': 'Equatorial Guinea',
  'Bosnia and Herz.': 'Bosnia and Herzegovina',
  'S. Sudan': 'South Sudan',
  'W. Sahara': 'Western Sahara',
  'Solomon Is.': 'Solomon Islands',
  'Falkland Is.': 'Falkland Islands',
  'N. Cyprus': 'Northern Cyprus',
  'Fr. S. Antarctic Lands': 'French Southern Territories',
};

export function canonicalCountryName(geoName: string): string {
  return NAME_ALIASES[geoName] ?? geoName;
}

export function isVisited(geoName: string, visited: string[]): boolean {
  const name = canonicalCountryName(geoName).toLowerCase();
  return visited.some(v => v.trim().toLowerCase() === name);
}

export const VISITED_STYLE = { color: '#047857', weight: 1, fillColor: '#059669', fillOpacity: 0.55 };
export const UNVISITED_STYLE = { color: '#a8a29e', weight: 0.6, fillColor: '#ffffff', fillOpacity: 0.05 };
