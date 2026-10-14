-- Run once in the Supabase SQL editor on an existing database (fresh setups
-- get the same result from schema.sql).
--
-- 1. toggle_like / toggle_bookmark are SECURITY DEFINER and take the user id
--    as an argument. Supabase exposes public functions to the anon and
--    authenticated roles by default, so anyone with the public anon key could
--    like/bookmark on behalf of any user. Only the API (service role) calls them.
revoke execute on function public.toggle_like(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.toggle_bookmark(uuid, uuid) from public, anon, authenticated;
revoke execute on function public.handle_new_user() from public, anon, authenticated;

-- 2. All writes go through the API (service role, which bypasses RLS). These
--    policies only let clients bypass the API's validation via Supabase REST,
--    e.g. an owner setting likes_count/rating/comments on their own plan.
drop policy if exists "Users can update their own profile" on public.profiles;
drop policy if exists "Users can create their own plans" on public.travel_plans;
drop policy if exists "Users can update their own plans" on public.travel_plans;
drop policy if exists "Users can delete their own plans" on public.travel_plans;
drop policy if exists "Users manage their own likes" on public.likes;
drop policy if exists "Users manage their own bookmarks" on public.bookmarks;
