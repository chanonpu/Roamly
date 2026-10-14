# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Overview

Roamly is a travel planner: AI/heuristic itinerary generation, an interactive destination map, and a community feed of shareable itineraries (like, bookmark, comment, fork). Two independent npm projects live side by side with no root package.json or workspace tooling:

- `client/` — Vite + React 19 + TypeScript + Tailwind v4 SPA
- `server/` — Express + TypeScript API (ESM, `NodeNext` module resolution), backed by Supabase, deployable to Vercel

## Commands

Run each from its own directory. There is no test suite or linter configured; `typecheck` is the main correctness check.

```bash
# server/ (http://localhost:4000)
npm run dev        # tsx watch src/server.ts
npm run typecheck  # tsc --noEmit
npm run build      # tsc -> dist/
npm run gen-seed   # regenerate supabase/seed.sql from src/db/seed.ts

# client/ (http://localhost:5173)
npm run dev
npm run typecheck  # tsc -b --noEmit
npm run build      # tsc -b && vite build
```

Env: copy `.env.example` to `.env` in each project. The server needs `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` (secret, server-only); the client needs `VITE_SUPABASE_URL` + `VITE_SUPABASE_ANON_KEY` (public anon key) and `VITE_API_URL=http://localhost:4000` for local dev (unset = same-origin `/api`). Database setup is manual: run `server/supabase/schema.sql`, `seed.sql`, then `avatars.sql` in the Supabase SQL editor. Auth emails (sign-up confirmation, password reset) need custom SMTP configured in the Supabase dashboard — see README.

## Architecture

**Auth split.** The client signs users in directly against Supabase Auth (`client/src/lib/supabaseClient.ts`, `hooks/useAuth.ts`) — there is no login route on the API. `App.tsx` pushes the session token into `lib/api.ts` via `setAccessToken()`, which attaches it as a Bearer header. The server only *verifies* tokens: `requireAuth` (401 if missing/invalid; itinerary mutations, `/api/users/*`) vs `optionalAuth` (AI routes, analytics). Itinerary edit/delete is owner-only. A Postgres trigger (`handle_new_user`) creates `profiles` rows on sign-up. `App.tsx` is the only component that reads auth state; children get plain `isSignedIn` / `isOwner` / `onRequireAuth` props. Password reset is client-only: `resetPasswordForEmail` → the email link fires `PASSWORD_RECOVERY` in `useAuth` → `ResetPasswordModal` calls `updateUser`. Sign-up/reset validation lives in `lib/authValidation.ts` (length-only rules, no character restrictions; never apply new rules to sign-in, or older accounts get locked out).

**Data layer.** All routes use `server/src/db/store.ts` (`SupabaseStore`, via `@supabase/supabase-js` with the service-role key — chosen over a raw `pg` driver to avoid connection exhaustion on serverless). `db/mappers.ts` converts snake_case rows ↔ camelCase domain types; add mappings there when touching columns. Currencies are a static in-memory table, not a DB table. The following are legacy/unused: `db/store.local.ts` (JSON-file store), `db/postgres.schema.sql` (old reference schema). The live schema is `server/supabase/schema.sql`. `db/seed.ts` is the source of truth for seed data; `supabase/seed.sql` is generated from it and is safe to re-run on a live DB (destinations upsert; seed plans have no fixed id and are matched by `title` + `creator_id is null`, refreshing content but not likes/views — so renaming a seed plan's title inserts a new row). `client/src/data/mockData.ts` mirrors the `DESTINATIONS` and `INITIAL_ITINERARIES` arrays verbatim — copy them over when seed data changes. Plans denormalize `creator_name`/`creator_avatar`; `store.updateUser` rewrites them on the user's own plans when name/avatar change (comment author fields inside the `comments` JSONB are not synced).

**Types are duplicated, not shared.** `client/src/types/travel.ts` and `server/src/types/travel.ts` are separate copies that have already diverged — update both when changing the API shape.

**AI with fallback.** `server/src/services/ai.ts` lazily loads `@google/genai` (an *optional* dependency) and uses Gemini only if `GEMINI_API_KEY` is set. Every AI call tries `GEMINI_MODEL` (default `gemini-flash-latest`), then `GEMINI_FALLBACK_MODEL` (default `gemini-flash-lite-latest`), so with no key or if both fail it returns output from `services/itineraryGenerator.ts` heuristics. Pinned model versions get retired (`gemini-2.5-flash` now 404s), so prefer the `-latest` aliases. Joke destinations: `warningKey` drives the funny advisory (`TRAVEL_WARNINGS` in `client/src/data/mockData.ts`, random variant + optional double-check); `WILD_CARD_KEYS` (client) puts them in Discover's Wild Card section, and `IMPOSSIBLE_KEYS` (`services/ai.ts`) makes Gemini write a tongue-in-cheek plan. Impossible destinations use made-up "countries" (The Moon, Himalayas…) so the route's country fallback never turns a real trip into a joke one; their photos are self-hosted in `client/public/destinations/`. `/api/generate-itinerary` does not save: it returns an unsaved draft that `App.tsx` shows with Save/Discard, and Save posts it to `POST /api/itineraries`. `/api/optimize-route` never uses AI (nearest-neighbor over lat/lng, `utils/geo.ts`). Request bodies are validated with zod in routes; `ZodError` is turned into a 400 by `middleware/errorHandler.ts`.

**Client offline fallback.** `App.tsx` seeds state from `client/src/data/mockData.ts` so the app renders public data even when the API is unreachable (showing a banner); account-specific features require the backend. Itinerary edits in `ItineraryView` are optimistic with background persistence. Leaflet is code-split via `LazyInteractiveMap` / `LazyCountryTrackerMap` (`React.lazy`); map markers use custom `L.divIcon`s. Visited-country shading (profile tracker + Discover overlay) uses `client/public/countries.geo.json` (Natural Earth 110m, fetched at runtime by `lib/worldGeo.ts`, which aliases NE names like "United States of America" → "United States"); `visitedCountries` are stored as country names, and tiny countries (e.g. Singapore) have no shape at this resolution.

**Profile pictures.** Uploaded straight from the browser to the public Supabase Storage bucket `avatars` at `{user_id}/avatar.webp` (resized to 256×256 client-side, overwritten on each upload, URL cache-busted with `?v=`), then saved via `PATCH /api/users/me`. Storage RLS in `supabase/avatars.sql` limits writes to the user's own folder. Users without a picture have an empty `avatar_url`; always render avatars through `avatarSrc()` from `lib/avatar.ts`, which falls back to `public/default-avatar.svg`.

**Analytics — one logging location per event.** Client-only events (searches, card opens, tab nav) go through `client/src/lib/analytics.ts` `track()` → `POST /api/analytics/events`. Actions that already hit the API (generate, fork, duplicate, like, bookmark, comment, optimize, suggest, sign-up) are logged server-side inside their routes — don't also track them on the client. Events land in `analytics_events` (no RLS policies; service-role only), with views `analytics_search_terms` and `analytics_daily_summary`.

**Deployment.** `server/api/index.ts` exports the same `createApp()` Express app as `src/server.ts`; `vercel.json` rewrites `/api/*` to it (with `maxDuration: 30` for AI routes). Set `CORS_ORIGIN` to the frontend origin in production.

## Styling conventions

Tailwind v4 with CSS-first config: theme tokens live in the `@theme` block of `client/src/index.css` (no `tailwind.config.js`). Dark mode is class-based (`.dark` on `<html>`, toggled in `App.tsx`). Headings use `font-serif-heading` (Playfair Display); body uses Inter. Use `React.memo` + `useCallback`/`useMemo` consistently with the existing cards — memoized children rely on stable callback identities. Modals close on backdrop click via `onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }}` on the overlay (mousedown, so drag-selecting inside a modal doesn't close it) — keep new modals consistent.
