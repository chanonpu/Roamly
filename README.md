# 🧭 Roamly

An editorial-style travel planner: browse destinations, generate AI-assisted day-by-day
itineraries, fork and remix trips other travelers have published, and track where you've been.

Built as two projects that share one Supabase database:

```
roamly/
├── roamly-frontend/   React 19 + TypeScript + Vite + Tailwind v4
└── roamly-backend/    Express + TypeScript, backed by Supabase (Postgres + Auth)
```

## Features

- **Discover** — a map + grid of curated destinations, each with a details drawer and (for a
  handful of, let's say, *adventurous* picks) a tongue-in-cheek travel advisory dialog.
- **AI Trip Planner** — generates a full day-by-day itinerary from destination, duration,
  season, travel style, and budget. Uses Gemini if you configure a key; falls back to a fast
  deterministic generator if you don't, so the feature always works.
- **Community Feed** — browse itineraries other travelers have published, fork one into your own
  editable copy, like, bookmark, and leave reviews.
- **Itinerary editor** — reorder, add, or remove activities per day; an AI route optimizer
  reorders a day's stops by real geographic distance (no AI model required — plain nearest-
  neighbor routing over lat/lng); an AI "hidden gems" suggester adds a local pick to your day.
- **Packing checklist**, **AI travel concierge chat**, and a **profile** with a visited-countries
  tracker and unlockable achievements.
- **Real accounts** — email/password auth via Supabase, with ownership enforced server-side (only
  you can edit your own itineraries; anyone signed in can like/bookmark/comment).
- **Analytics groundwork** — search queries, page views, and every itinerary action are logged to
  a Postgres table with a couple of starter SQL views, ready for a dashboard later.
- Dark mode, multi-currency display, and offline-friendly (falls back to seed data if the API
  isn't reachable, rather than showing a blank screen).

## Tech stack

| | |
|---|---|
| Frontend | React 19, TypeScript, Vite, Tailwind CSS v4, Leaflet |
| Backend | Express, TypeScript, Zod |
| Database & Auth | Supabase (Postgres, Row Level Security, Supabase Auth) |
| AI | Google Gemini (optional — heuristic fallback if unset) |
| Deployment | Vercel (both projects deploy there; see each README) |

## Architecture

```
┌─────────────────────┐        ┌──────────────────────┐        ┌───────────────────────┐
│   roamly-frontend    │  REST  │    roamly-backend     │  HTTPS │       Supabase         │
│  React + Vite (5173) │───────▶│  Express API (4000)   │───────▶│  Postgres + RLS +      │
│                       │        │  requireAuth/optional  │        │  Auth + storage        │
└──────────┬────────────┘        │  Auth middleware       │        └───────────┬────────────┘
           │                     └────────────────────────┘                    │
           │            Supabase session tokens issued directly                │
           └─────────────────────────────────────────────────────────────────▶┘
                              (sign up / sign in / sign out)
```

The frontend talks to Supabase Auth **directly** to sign users in (that's what issues the session
token), then sends that token to the Express API on every request. The backend verifies the token
and does the actual reads/writes against Postgres using a service-role key that bypasses Row
Level Security — RLS policies in `supabase/schema.sql` are the second line of defense, not the
only one, for exactly this reason. Full detail in `roamly-backend/README.md`'s "Auth model"
section.

## Getting started

**1. Set up Supabase** (one-time, ~5 minutes)

Create a free project at [supabase.com](https://supabase.com), then in the SQL Editor run, in
order: `roamly-backend/supabase/schema.sql`, then `roamly-backend/supabase/seed.sql`. Grab your
Project URL, **Publishable** key, and **Secret** key from Project Settings → API.

**2. Backend**

```bash
cd roamly-backend
npm install
cp .env.example .env   # fill in SUPABASE_URL + SUPABASE_SERVICE_ROLE_KEY (the Secret key)
npm run dev             # http://localhost:4000
```

**3. Frontend** (separate terminal)

```bash
cd roamly-frontend
npm install
cp .env.example .env   # fill in VITE_SUPABASE_URL + VITE_SUPABASE_ANON_KEY (the Publishable key)
npm run dev             # http://localhost:5173
```

Open `http://localhost:5173`. Browsing works immediately; sign up to unlock generating trips,
forking, liking, and your profile. Each project's own README has the full detail — env var
reference, endpoint list, deployment steps, and the design decisions behind them.

## Environment variables at a glance

| Variable | Where | Notes |
|---|---|---|
| `SUPABASE_URL` | backend | Project URL |
| `SUPABASE_SERVICE_ROLE_KEY` | backend | **Secret** key — server-only, bypasses RLS |
| `GEMINI_API_KEY` | backend | Optional — AI features work without it |
| `CORS_ORIGIN` | backend | Your frontend's origin |
| `VITE_API_URL` | frontend | Leave unset if same-origin; set for local dev split ports |
| `VITE_SUPABASE_URL` | frontend | Same Project URL as the backend |
| `VITE_SUPABASE_ANON_KEY` | frontend | **Publishable** key — safe for the browser |

## Deploying

Both projects deploy to Vercel. `roamly-backend` ships as serverless functions
(`api/index.ts` + `vercel.json`); `roamly-backend/README.md` covers function timeouts and why it
uses `@supabase/supabase-js` over a raw Postgres connection (serverless connection-pool limits).
Deploy the frontend as a standard Vite project and point its env vars at the deployed backend's
URL and the same Supabase project.

## Project structure

```
roamly-backend/
├── api/index.ts              # Vercel serverless entry (wraps the Express app)
├── src/
│   ├── app.ts, server.ts     # Express app + local dev entrypoint
│   ├── routes/                # itineraries, users, ai, destinations, currencies, analytics
│   ├── middleware/auth.ts     # requireAuth / optionalAuth (verifies Supabase JWTs)
│   ├── db/store.ts            # Supabase-backed data layer (routes only ever call this)
│   ├── db/mappers.ts          # snake_case DB rows ⇄ camelCase API shapes
│   ├── services/ai.ts         # Gemini integration + heuristic fallback
│   └── utils/geo.ts           # real nearest-neighbor route optimizer
└── supabase/schema.sql        # run this in Supabase's SQL editor to set everything up

roamly-frontend/
├── src/
│   ├── App.tsx                 # top-level orchestrator — data loading, auth, navigation
│   ├── components/              # views (Discover, Community, ItineraryView, ...) + modals
│   ├── lib/api.ts                # typed backend client
│   ├── lib/supabaseClient.ts     # Supabase Auth client
│   ├── hooks/useAuth.ts          # session state
│   └── lib/analytics.ts          # event tracking for the future dashboard
```

## Known limitations / what's next

- **No dashboard UI yet** — `analytics_events` and its starter views
  (`analytics_search_terms`, `analytics_daily_summary`) are ready to query, but there's no
  visualization layer built on top of them yet.
- **Hybrid JSONB schema, not fully normalized** — an itinerary's days/activities/comments live as
  JSONB columns rather than separate tables, traded off deliberately for a much smaller backend
  instead of a full relational model. `roamly-backend/src/db/postgres.schema.sql` has the fully
  normalized alternative if this ever needs to grow into it.
- **Single-project, no license file yet** — add one (MIT is a common default for a project like
  this) before treating this as open source.
