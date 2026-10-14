-- Roamly — Supabase schema (hybrid JSONB design)
--
-- Run this in the Supabase SQL editor (Project > SQL Editor > New query) on a
-- fresh project, then run seed.sql and avatars.sql (profile picture storage). This intentionally keeps `days`,
-- `packing_list`, and `comments` as JSONB columns on `travel_plans` rather
-- than fully normalizing into separate tables — it maps almost 1:1 onto the
-- TravelItinerary shape the frontend already expects, which keeps the
-- backend's data layer a small, honest translation instead of a big
-- assemble/disassemble layer. `db/postgres.schema.sql` has the fully
-- normalized version if you want to grow into it later.

create extension if not exists pgcrypto;

-- ---------------------------------------------------------------------------
-- profiles: one row per authenticated user, app-level fields Supabase Auth
-- doesn't store itself (auth.users holds email/password — this holds the
-- rest: display name, avatar, bio, visited countries, achievements).
-- ---------------------------------------------------------------------------
create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  name text not null default 'New Traveler',
  username text unique,
  avatar_url text default '',
  bio text not null default '',
  visited_countries jsonb not null default '[]',
  planned_countries jsonb not null default '[]',
  followers_count int not null default 0,
  following_count int not null default 0,
  achievements jsonb not null default '[]',
  created_at timestamptz not null default now()
);

-- Auto-create a profile row the moment someone signs up via Supabase Auth.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, name, username, avatar_url)
  values (
    new.id,
    coalesce(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    coalesce(new.raw_user_meta_data->>'username', split_part(new.email, '@', 1) || '_' || substr(new.id::text, 1, 6)),
    coalesce(new.raw_user_meta_data->>'avatar_url', '')
  );
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- destinations: public catalog (same shape as the old seed.ts DESTINATIONS)
-- ---------------------------------------------------------------------------
create table public.destinations (
  id text primary key,
  city text not null,
  country text not null,
  flag text,
  image text,
  timezone text,
  best_season text,
  avg_daily_cost_usd numeric(10,2),
  lat numeric(9,6),
  lng numeric(9,6),
  description text,
  has_warning boolean not null default false,
  warning_key text,
  popular_tags jsonb not null default '[]'
);

-- ---------------------------------------------------------------------------
-- travel_plans: the itinerary itself. Scalar columns for the fields that get
-- queried/sorted/filtered a lot (destination, rating, likes_count, ...),
-- JSONB for the deeply nested parts (days -> activities, packing list,
-- comments) that the frontend always reads/writes as a whole blob anyway.
-- creator_name/creator_avatar are stored directly (denormalized) so reads
-- never need a join, and so seed/demo itineraries can exist without a real
-- auth user behind them (creator_id nullable).
-- ---------------------------------------------------------------------------
create table public.travel_plans (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  destination text not null,
  country text not null default '',
  flag_emoji text not null default '🌍',
  cover_image text not null default '',
  summary text not null default '',
  duration_days int not null,
  season text not null,
  preferences jsonb not null default '[]',
  companion_style text,
  estimated_cost_usd numeric(10,2) not null default 0,
  transportation text not null default '',
  weather_forecast text not null default '',
  packing_list jsonb not null default '[]',
  days jsonb not null default '[]',
  comments jsonb not null default '[]',
  creator_id uuid references public.profiles(id) on delete set null,
  creator_name text not null default '',
  creator_avatar text not null default '',
  is_published boolean not null default true,
  is_forked boolean not null default false,
  original_itinerary_id uuid references public.travel_plans(id) on delete set null,
  likes_count int not null default 0,
  bookmarks_count int not null default 0,
  views_count int not null default 0,
  rating numeric(2,1) not null default 0,
  ratings_count int not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index idx_travel_plans_creator on public.travel_plans(creator_id);
create index idx_travel_plans_published on public.travel_plans(is_published);

create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger trg_travel_plans_updated_at
before update on public.travel_plans
for each row execute function public.set_updated_at();

-- ---------------------------------------------------------------------------
-- likes / bookmarks: join tables so "did I like this" is a real query and
-- likes_count/bookmarks_count stay accurate via the toggle functions below.
-- ---------------------------------------------------------------------------
create table public.likes (
  plan_id uuid not null references public.travel_plans(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

create table public.bookmarks (
  plan_id uuid not null references public.travel_plans(id) on delete cascade,
  user_id uuid not null references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (plan_id, user_id)
);

-- Atomic like/bookmark toggle — one round trip, no read-then-write race.
create or replace function public.toggle_like(p_plan_id uuid, p_user_id uuid)
returns public.travel_plans
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
  result public.travel_plans;
begin
  delete from public.likes where plan_id = p_plan_id and user_id = p_user_id;
  get diagnostics deleted_count = row_count;

  if deleted_count > 0 then
    update public.travel_plans set likes_count = greatest(0, likes_count - 1)
      where id = p_plan_id returning * into result;
  else
    insert into public.likes (plan_id, user_id) values (p_plan_id, p_user_id);
    update public.travel_plans set likes_count = likes_count + 1
      where id = p_plan_id returning * into result;
  end if;

  return result;
end;
$$;

create or replace function public.toggle_bookmark(p_plan_id uuid, p_user_id uuid)
returns public.travel_plans
language plpgsql
security definer
set search_path = public
as $$
declare
  deleted_count int;
  result public.travel_plans;
begin
  delete from public.bookmarks where plan_id = p_plan_id and user_id = p_user_id;
  get diagnostics deleted_count = row_count;

  if deleted_count > 0 then
    update public.travel_plans set bookmarks_count = greatest(0, bookmarks_count - 1)
      where id = p_plan_id returning * into result;
  else
    insert into public.bookmarks (plan_id, user_id) values (p_plan_id, p_user_id);
    update public.travel_plans set bookmarks_count = bookmarks_count + 1
      where id = p_plan_id returning * into result;
  end if;

  return result;
end;
$$;

-- These take the user id as an argument, so they must only be callable by the
-- API (service role) — never by anon/authenticated clients via RPC.
revoke execute on function public.toggle_like(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.toggle_bookmark(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- ---------------------------------------------------------------------------
-- Row Level Security. The Express backend talks to Supabase with the
-- service-role key (which bypasses RLS entirely) and does its own
-- authorization checks in the route handlers — see src/middleware/auth.ts
-- and the `creator_id` checks in routes/itineraries.ts. RLS here is defense
-- in depth: it's what protects the data if anything (a future admin tool,
-- a debugging session, a client-side query) ever connects with the anon key
-- directly instead of going through the API.
--
-- Clients get read-only access. There are deliberately no insert/update/
-- delete policies: all writes go through the API so its validation can't be
-- bypassed (e.g. an owner setting likes_count or forging comments via REST).
-- ---------------------------------------------------------------------------
alter table public.profiles enable row level security;
alter table public.destinations enable row level security;
alter table public.travel_plans enable row level security;
alter table public.likes enable row level security;
alter table public.bookmarks enable row level security;

create policy "Profiles are publicly readable" on public.profiles
  for select using (true);

create policy "Destinations are publicly readable" on public.destinations
  for select using (true);

create policy "Published plans are publicly readable" on public.travel_plans
  for select using (is_published = true or creator_id = auth.uid());

create policy "Likes are publicly readable" on public.likes
  for select using (true);

create policy "Bookmarks are publicly readable" on public.bookmarks
  for select using (true);

-- ---------------------------------------------------------------------------
-- analytics_events: raw event log for the future dashboard. event_type +
-- a jsonb metadata bag keeps this flexible — add new event types without a
-- migration. user_id is nullable on purpose: we want to see what anonymous
-- (not-yet-signed-in) visitors search for too, not just logged-in activity.
-- ---------------------------------------------------------------------------
create table public.analytics_events (
  id uuid primary key default gen_random_uuid(),
  event_type text not null,
  user_id uuid references public.profiles(id) on delete set null,
  metadata jsonb not null default '{}',
  created_at timestamptz not null default now()
);

create index idx_analytics_events_type_time on public.analytics_events(event_type, created_at desc);
create index idx_analytics_events_user on public.analytics_events(user_id);

alter table public.analytics_events enable row level security;
-- Deliberately no policies here. RLS with zero policies means "nobody can
-- read or write this table except the service-role key" — i.e. only the
-- Express backend can touch it, even via the anon key. Analytics data
-- shouldn't be queryable by end users at all, including the user who
-- generated it.

-- A couple of starter views so a future dashboard has somewhere to start —
-- add more as real dashboard requirements show up.
create or replace view public.analytics_search_terms as
select
  metadata->>'query' as query,
  metadata->>'context' as context,
  count(*) as search_count,
  max(created_at) as last_searched_at
from public.analytics_events
where event_type = 'search' and coalesce(metadata->>'query', '') <> ''
group by 1, 2
order by search_count desc;

create or replace view public.analytics_daily_summary as
select
  date_trunc('day', created_at) as day,
  event_type,
  count(*) as event_count,
  count(distinct user_id) as unique_users
from public.analytics_events
group by 1, 2
order by 1 desc, 2;
