# Roamly Frontend

A complete Vite + React 19 + TypeScript + Tailwind v4 project, wired up to `roamly-backend`
(Express + Supabase) with real authentication. This is a full scaffold — `npm install && npm run
dev` and it runs — not just a `src/` folder to drop into something else.

Built and verified in a real environment: `npm install`, `tsc -b`, and `vite build` all run clean
end to end (confirmed the CSS compiles correctly, the lazy-loaded map code-splits into its own
chunk, and there are zero type errors) — see the "verified" note at the bottom for exactly what
that did and didn't cover.

## Setup

```bash
npm install
cp .env.example .env
```

Fill in `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` — same Supabase project as the backend,
but the **Publishable / anon** key here, not the secret one. See `roamly-backend/README.md` for
setting up that project (schema, seed data, keys).

```bash
# In one terminal — the backend
cd roamly-backend && npm install && npm run dev   # http://localhost:4000

# In another — this project
npm run dev                                        # http://localhost:5173
```

The app works even if the backend isn't running yet — it boots with mock data for public
browsing and shows a small banner telling you the API isn't reachable. Signing in and anything
account-specific (My Profile, generating/forking/liking trips) does need the backend + a real
Supabase project, though — those aren't mockable the same way.

## Stack choices, and why

- **Tailwind v4**, not v3 — the original components already used v4-only utilities (`shadow-xs`,
  the expanded shadow scale), so this scaffold matches that rather than downgrading. Uses the
  `@tailwindcss/vite` plugin (zero-config, no separate PostCSS setup needed) and CSS-first
  theming (`src/index.css`'s `@theme` block) instead of a `tailwind.config.js`.
- **Class-based dark mode** (`@custom-variant dark (&:where(.dark, .dark *));` in `index.css`) —
  matches `App.tsx` toggling a `.dark` class on `<html>`, rather than v4's OS-preference default.
- **React 19** — matches what the app's own in-app documentation modal (`DocumentationModal.tsx`)
  states as the intended stack.
- **Inter + Playfair Display** (Google Fonts, linked in `index.html`) power `font-sans` /
  `font-serif-heading` — the components already reference `font-serif-heading` throughout for
  headings; this scaffold is what actually defines it.
- `leaflet/dist/leaflet.css` is imported once in `main.tsx`. The map markers use custom
  `L.divIcon`s everywhere rather than Leaflet's default pin image, which sidesteps the classic
  "broken marker icon" issue that default Leaflet icons hit under bundlers.

## New files (didn't exist in the original provided components)

- **`src/App.tsx`** — the top-level orchestrator: loads data on mount, owns navigation and auth
  state, passes the right callbacks (fork, duplicate, like, generate, sign-in gating, etc.) down
  to each component.
- **`src/components/DiscoverView.tsx`** — the "Discover" tab (map + destination grid) had no
  component in the originally-provided files; `Navbar` already had a `discover` tab with nothing
  to show. Built to match the existing editorial/stone/sky visual style.
- **`src/lib/api.ts`** — typed client for every backend endpoint, attaches the Supabase session
  token automatically.
- **`src/lib/format.ts`** — currency formatter, pulled out of being copy-pasted inline in
  `ItineraryView` and `CommunityFeed`.
- **`src/hooks/useDebouncedValue.ts`** — debounce hook used by the three search inputs.
- **`src/components/LazyInteractiveMap.tsx`** — code-splits Leaflet (~150KB) into its own chunk,
  confirmed via a real build (`dist/assets/InteractiveMap-*.js` is separate from the main bundle).
- **`src/lib/supabaseClient.ts`** / **`src/hooks/useAuth.ts`** / **`src/components/AuthModal.tsx`**
  — real authentication, talking to Supabase Auth directly (not proxied through the Express API).
- **`src/lib/analytics.ts`** — fire-and-forget event tracking for the future dashboard.

## Authentication

`useAuth()` wraps `supabase.auth`'s session state; `App.tsx` is the only place that reads it
directly — everything else gets plain `isSignedIn` / `isOwner` booleans.

- **`ItineraryView.tsx`** takes `isSignedIn`, `isOwner`, `onRequireAuth` props. The backend only
  lets an itinerary's creator edit it, so the UI hides those controls for everyone else (instead
  of showing buttons that would just 403) and shows a "fork it to edit your own copy" hint.
  Liking/bookmarking/commenting only require being signed in, not ownership — doing those while
  signed out opens `AuthModal` instead of failing silently.
- **`Navbar.tsx`** shows **Sign In** when signed out, or the real avatar + sign-out icon when
  signed in.
- **Profile tab** prompts sign-in instead of rendering `UserProfileView` when no one's signed in.
- Generating/forking/duplicating all check `isSignedIn` first and open `AuthModal` if not.

## Analytics

`src/lib/analytics.ts` exports `track(eventType, metadata)` — fire-and-forget, never blocks the
UI. Wired into the three search inputs (Navbar, Discover, Community — each logs once the
debounced query settles, with result counts and context), plus destination/itinerary card opens
and tab navigation in `App.tsx`. Actions that already hit the backend (generate, fork, duplicate,
like, bookmark, comment, optimize-route, suggest-gems, sign-up) are logged server-side in
`roamly-backend` instead, so each event has exactly one place it's logged from — see that
backend's README for the dashboard-ready SQL views this feeds.

## Real bugs fixed

1. **`ItineraryView.tsx` — state mutation.** `moveActivity`, `deleteActivity`, and
   `handleAddActivity` shallow-copied `itinerary.days` but then wrote directly onto
   `updatedDays[i].activities` — since the shallow copy shares the same day *objects* as the
   original array, this was mutating the parent's state in place. Fixed by mapping to new day
   objects instead: `days.map((d, i) => i === idx ? { ...d, activities: next } : d)`.
2. **`InteractiveMap.tsx` — dead button.** The "Plan Trip" button inside a destination's popup was
   injected via `innerHTML` with an `id`, but nothing attached a click listener to it. Fixed by
   binding on Leaflet's `popupopen` event (fires each time that DOM node is re-created).

## Performance work

- `React.memo` on `ActivityCard`, `ItineraryCard`, `DestinationCard`, and `InteractiveMap` itself.
- `useMemo` for filtered/sorted lists (CommunityFeed, DiscoverView).
- `useCallback` for the currency formatter and mutation handlers, so the memoization above
  actually holds (a new function identity every render defeats `React.memo`).
- Debounced search (Navbar, CommunityFeed, DiscoverView) — the input stays instant, only the
  filtering work is delayed.
- `LazyInteractiveMap` code-splits Leaflet via `React.lazy` + `Suspense` — verified in the actual
  build output, not just in theory.
- Optimistic UI + background persistence in `ItineraryView`: activity edits update the screen
  immediately and save in the background, with a small banner if the save fails.

## Not touched

`TripPlannerWizard.tsx`, `UserProfileView.tsx`, `DestinationModal.tsx`,
`PackingChecklistModal.tsx`, `TravelWarningDialog.tsx`, `DocumentationModal.tsx` didn't need
functional changes — they already used the callback-props pattern cleanly, so `App.tsx` wires
them straight to the API. `mockData.ts` and `types/travel.ts` are unchanged and now serve as the
offline-fallback seed data.

## What "verified" actually means here

`npm install`, `npx tsc -b`, and `npx vite build` all ran successfully in a real sandboxed
environment, and I inspected the compiled CSS output directly to confirm the custom theme
(`font-serif-heading`, `.editorial-card`, `.glass-panel`, `shadow-xs`, dark-mode variant, the
spin animation) all compiled to the expected CSS. What that *doesn't* cover: I can't reach
supabase.co or open a real browser from here, so actually signing up, generating a trip, and
clicking through the UI against a live Supabase project is untested. If something looks visually
off on first run, it's far more likely a Tailwind/content edge case than a logic bug — let me
know and I'll dig in.
