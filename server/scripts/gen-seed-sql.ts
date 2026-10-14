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
out += `\non conflict (id) do update set\n  city = excluded.city, country = excluded.country, flag = excluded.flag, image = excluded.image,\n  timezone = excluded.timezone, best_season = excluded.best_season, avg_daily_cost_usd = excluded.avg_daily_cost_usd,\n  lat = excluded.lat, lng = excluded.lng, description = excluded.description, has_warning = excluded.has_warning,\n  warning_key = excluded.warning_key, popular_tags = excluded.popular_tags;\n\n`;

out += `-- Sample community itineraries (no owning user — these are seed/demo\n-- content; forking or duplicating one creates a real row owned by whoever\n-- forks it). Seed rows have generated ids, so each is matched by title +\n-- creator_id is null: existing rows get their content refreshed (likes,\n-- bookmarks, views and ratings are left alone) and missing rows are inserted.\n-- Safe to re-run.\n\n`;
for (const it of INITIAL_ITINERARIES) {
  const match = `title = ${sqlStr(it.title)} and creator_id is null`;
  const content: [string, string][] = [
    ['destination', sqlStr(it.destination)], ['country', sqlStr(it.country)], ['flag_emoji', sqlStr(it.flagEmoji)],
    ['cover_image', sqlStr(it.coverImage)], ['summary', sqlStr(it.summary)], ['duration_days', sqlNum(it.durationDays)],
    ['season', sqlStr(it.season)], ['preferences', sqlJson(it.preferences)], ['companion_style', sqlStr(it.companionStyle)],
    ['estimated_cost_usd', sqlNum(it.estimatedCostUSD)], ['transportation', sqlStr(it.transportation)],
    ['weather_forecast', sqlStr(it.weatherForecast)], ['packing_list', sqlJson(it.packingList)], ['days', sqlJson(it.days)],
    ['comments', sqlJson(it.comments)], ['creator_name', sqlStr(it.creatorName)], ['creator_avatar', sqlStr(it.creatorAvatar)],
  ];
  const counters: [string, string][] = [
    ['is_published', 'true'], ['likes_count', sqlNum(it.likesCount)], ['bookmarks_count', sqlNum(it.bookmarksCount)],
    ['views_count', sqlNum(it.viewsCount)], ['rating', sqlNum(it.rating)], ['ratings_count', sqlNum(it.ratingsCount)],
  ];
  const cols = ['title', ...content.map(([c]) => c), 'creator_id', ...counters.map(([c]) => c)];
  const vals = [sqlStr(it.title), ...content.map(([, v]) => v), 'null', ...counters.map(([, v]) => v)];
  out += `-- ${it.title}\n`;
  out += `update public.travel_plans set\n  ${content.map(([c, v]) => `${c} = ${v}`).join(',\n  ')}\nwhere ${match};\n`;
  out += `insert into public.travel_plans\n  (${cols.join(', ')})\nselect\n  ${vals.join(',\n  ')}\nwhere not exists (select 1 from public.travel_plans where ${match});\n\n`;
}

const outPath = path.resolve('supabase/seed.sql');
fs.writeFileSync(outPath, out, 'utf-8');
console.log('Wrote', outPath, `(${out.length} bytes)`);
