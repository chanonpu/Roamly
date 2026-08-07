# Roamly API

Express + TypeScript backend for the Roamly travel planner frontend, backed by Supabase
(Postgres + Auth) and deployable to Vercel as serverless functions.

## Setup

1. **Create a Supabase project** at [supabase.com](https://supabase.com) (free tier is fine to start).
2. **Run the schema.** Project dashboard → SQL Editor → New query → paste and run
   `supabase/schema.sql`, then `supabase/seed.sql` (seeds the destination catalog + a few sample
   community itineraries).
3. **Get your keys.** Project Settings → API: you need the Project URL, and the
   `service_role` key (⚠️ secret — server-only, never expose it to a browser).
4. **Configure env vars:**
   ```bash
   npm install
   cp .env.example .env   # fill in SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY
   npm run dev             # http://localhost:4000
   ```
5. (Optional) In Supabase → Authentication → Providers → Email, turn off "Confirm email" while
   you're developing locally, or sign-up won't return a usable session until the user clicks a
   confirmation link.

Point your frontend at this with `VITE_API_URL=http://localhost:4000` (see the frontend's
`.env.example`) and its own `VITE_SUPABASE_URL` / `VITE_SUPABASE_ANON_KEY` (the frontend talks to
Supabase Auth directly to sign in/up — this backend only ever verifies the token it's handed).

## Auth model

There's no `/api/login` route here — Supabase Auth issues sessions directly to the frontend via
`@supabase/supabase-js`. This backend's job is just to **verify** the access token on every
request that needs to know who's asking:

- `requireAuth` (`src/middleware/auth.ts`) — rejects with 401 if the `Authorization: Bearer
  <token>` header is missing or invalid. Used on all itinerary-mutating routes and `/api/users/*`.
- `optionalAuth` — attaches `req.user` if a valid token is present, but never rejects. Used on
  the AI routes (people can try the concierge before signing up) and analytics.

A Postgres trigger (`handle_new_user` in `schema.sql`) creates a `profiles` row automatically the
moment someone signs up — the backend never has to.

## AI features

`POST /api/generate-itinerary`, `/api/ai-chat`, and `/api/suggest-gems` use Google's Gemini API if
you set `GEMINI_API_KEY` in `.env`. **Without a key, they work anyway** — each falls back to a
fast, deterministic heuristic generator, so the app is fully functional with zero external
dependencies beyond Supabase itself.

`POST /api/optimize-route` never needs AI — it's a real nearest-neighbor route optimizer over
each activity's lat/lng (haversine distance).

## Analytics

`POST /api/analytics/events` logs client-observed events (search queries, page views, destination/
itinerary card opens) that the backend has no other way to see — see `src/lib/analytics.ts` on the
frontend for what calls this. Everything else (generate/fork/duplicate/like/bookmark/comment/
optimize/suggest) is logged server-side, inline in the route that already handles it, so it can't
drift out of sync with what actually happened.

Everything lands in one `analytics_events` table (`event_type` + a flexible `metadata` jsonb bag)
with two starter views for a future dashboard to build on:

- `analytics_search_terms` — search queries ranked by frequency, with context (navbar / discover
  / community) and last-searched time.
- `analytics_daily_summary` — event counts and unique users per day, per event type.

RLS on `analytics_events` has zero policies on purpose — only the service-role key (i.e. only this
backend) can read or write it, not even via a user's own anon-key session. Query it directly in
the Supabase SQL editor, or point a BI tool at the Postgres connection once you're ready to build
the actual dashboard UI.

## Deploying to Vercel

```bash
npm i -g vercel   # if you don't have it
vercel             # first deploy — follow the prompts
```

`api/index.ts` exports the same Express app used for local dev (Express apps are valid Node
request handlers, so no separate serverless framework is needed) and `vercel.json` rewrites all
`/api/*` traffic to it. In the Vercel project's Environment Variables, set `SUPABASE_URL`,
`SUPABASE_SERVICE_ROLE_KEY`, `CORS_ORIGIN` (your deployed frontend's origin), and optionally
`GEMINI_API_KEY`.

A few things worth knowing before you deploy:
- **Function timeout**: the free Hobby tier caps around 10 seconds by default; `vercel.json` here
  requests `maxDuration: 30` for the AI routes' sake — check your plan's actual ceiling in the
  Vercel dashboard, since limits do change.
- **No persistent local state**: this is exactly why the data layer needed to move to Supabase in
  the first place — Vercel functions are stateless between invocations.
- This backend uses `@supabase/supabase-js` (HTTP to PostgREST) rather than a raw Postgres driver
  specifically because that sidesteps connection-pool exhaustion under serverless concurrency — if
  you ever add direct `pg`/Prisma access, route it through Supabase's pooler (port 6543,
  transaction mode), not the direct connection (port 5432).

## Endpoints

| Method | Path | Auth | Notes |
|---|---|---|---|
| GET | `/api/health` | — | liveness + whether Gemini is configured |
| GET | `/api/destinations` / `/:id` | — | seeded destination catalog |
| GET | `/api/currencies` | — | exchange rate table |
| GET | `/api/itineraries` | — | `?search=&category=&sort=likes\|rating\|views\|recent`, published only |
| GET | `/api/itineraries/:id` | — | |
| POST | `/api/itineraries` | required | create manually |
| PATCH | `/api/itineraries/:id` | required, owner only | partial update |
| DELETE | `/api/itineraries/:id` | required, owner only | |
| POST | `/api/itineraries/:id/fork` | required | copies into your account |
| POST | `/api/itineraries/:id/duplicate` | required | |
| POST | `/api/itineraries/:id/like` | required | toggles |
| POST | `/api/itineraries/:id/bookmark` | required | toggles |
| POST | `/api/itineraries/:id/comments` | required | `{ content, rating? }` |
| PUT | `/api/itineraries/:id/packing-list` | required, owner only | replaces the whole list |
| PUT/POST | `/api/itineraries/:id/days/:dayNumber/activities` | required, owner only | replace / append |
| GET/PATCH | `/api/users/me` | required | |
| GET | `/api/users/me/itineraries` / `/me/saved` | required | |
| POST | `/api/generate-itinerary` | required | AI Trip Planner Wizard |
| POST | `/api/ai-chat` | optional | AI concierge chat |
| POST | `/api/optimize-route` | optional | geometric route optimizer |
| POST | `/api/suggest-gems` | optional | hidden gem suggestion |
| POST | `/api/analytics/events` | optional | `{ eventType, metadata }` |

## Running without Supabase

The original zero-setup, file-backed store is preserved (unused) at `src/db/store.local.ts` for
reference. It's not wired to anything by default anymore — `src/db/store.ts` (Supabase) is now
the real data layer, and `postgres.schema.sql` still documents the fully-normalized alternative
schema if you outgrow the hybrid-JSONB design in `supabase/schema.sql`.
