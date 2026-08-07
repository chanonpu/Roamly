// One-off generator: converts src/db/seed.ts (destinations + sample
// itineraries) into supabase/seed.sql. Run with: npx tsx scripts/gen-seed-sql.ts
import { DESTINATIONS, INITIAL_ITINERARIES } from '../src/db/seed.js';
import fs from 'node:fs';
import path from 'node:path';

function sqlStr(v: unknown): string {
  if (v === undefined || v === null) return 'null';
  return `'${String(v).replace(/'/g, "''")}'`;
}
function sqlJson(v: unknown): string {
  return `'${JSON.stringify(v).replace(/'/g, "''")}'::jsonb`;
}
function sqlBool(v: unknown): string {
  return v ? 'true' : 'false';
}
function sqlNum(v: number | undefined | null): string {
  return v === undefined || v === null ? 'null' : String(v);
}

let out = `-- Generated from src/db/seed.ts — run after schema.sql.\n\n`;

out += `insert into public.destinations\n  (id, city, country, flag, image, timezone, best_season, avg_daily_cost_usd, lat, lng, description, has_warning, warning_key, popular_tags)\nvalues\n`;
out += DESTINATIONS.map(d => `  (${sqlStr(d.id)}, ${sqlStr(d.city)}, ${sqlStr(d.country)}, ${sqlStr(d.flag)}, ${sqlStr(d.image)}, ${sqlStr(d.timezone)}, ${sqlStr(d.bestSeason)}, ${sqlNum(d.avgDailyCostUSD)}, ${sqlNum(d.lat)}, ${sqlNum(d.lng)}, ${sqlStr(d.description)}, ${sqlBool(d.hasWarning)}, ${sqlStr(d.warningKey)}, ${sqlJson(d.popularTags)})`).join(',\n');
out += `\non conflict (id) do nothing;\n\n`;

out += `-- Sample community itineraries (no owning user — these are seed/demo\n-- content; forking or duplicating one creates a real row owned by whoever\n-- forks it).\n`;
out += `insert into public.travel_plans\n  (title, destination, country, flag_emoji, cover_image, summary, duration_days, season, preferences, companion_style, estimated_cost_usd, transportation, weather_forecast, packing_list, days, comments, creator_id, creator_name, creator_avatar, is_published, likes_count, bookmarks_count, views_count, rating, ratings_count)\nvalues\n`;
out += INITIAL_ITINERARIES.map(it => `  (${sqlStr(it.title)}, ${sqlStr(it.destination)}, ${sqlStr(it.country)}, ${sqlStr(it.flagEmoji)}, ${sqlStr(it.coverImage)}, ${sqlStr(it.summary)}, ${sqlNum(it.durationDays)}, ${sqlStr(it.season)}, ${sqlJson(it.preferences)}, ${sqlStr(it.companionStyle)}, ${sqlNum(it.estimatedCostUSD)}, ${sqlStr(it.transportation)}, ${sqlStr(it.weatherForecast)}, ${sqlJson(it.packingList)}, ${sqlJson(it.days)}, ${sqlJson(it.comments)}, null, ${sqlStr(it.creatorName)}, ${sqlStr(it.creatorAvatar)}, true, ${sqlNum(it.likesCount)}, ${sqlNum(it.bookmarksCount)}, ${sqlNum(it.viewsCount)}, ${sqlNum(it.rating)}, ${sqlNum(it.ratingsCount)})`).join(',\n');
out += `;\n`;

const outPath = path.resolve('supabase/seed.sql');
fs.writeFileSync(outPath, out, 'utf-8');
console.log('Wrote', outPath, `(${out.length} bytes)`);
