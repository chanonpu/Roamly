import { createClient, SupabaseClient } from '@supabase/supabase-js';

const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error(
    'Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY. Copy .env.example to .env and fill in ' +
    'your project values from Supabase > Project Settings > API.'
  );
}

// Service-role key = full access, bypasses Row Level Security. This is safe
// ONLY because it's used exclusively on the server, never sent to the
// browser. Every route that mutates data is responsible for checking the
// authenticated user actually owns what they're editing (see
// middleware/auth.ts + the creator_id checks in routes/itineraries.ts) —
// RLS in supabase/schema.sql is a second line of defense, not the only one,
// specifically because this client bypasses it.
export const supabaseAdmin: SupabaseClient = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
  auth: { autoRefreshToken: false, persistSession: false },
});
