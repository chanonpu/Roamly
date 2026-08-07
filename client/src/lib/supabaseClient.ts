import { createClient } from '@supabase/supabase-js';

const url = (import.meta as any).env?.VITE_SUPABASE_URL;
const anonKey = (import.meta as any).env?.VITE_SUPABASE_ANON_KEY;

if (!url || !anonKey) {
  // Fails loudly at startup rather than producing confusing "fetch failed"
  // errors deep inside a sign-in click handler.
  console.error(
    'Missing VITE_SUPABASE_URL / VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in ' +
    'your project values from Supabase > Project Settings > API.'
  );
}

// The anon key is safe to ship to the browser by design — it's what Supabase
// Auth uses to issue sessions, and every table it can otherwise reach is
// governed by the RLS policies in supabase/schema.sql, not by keeping this
// key secret.
export const supabase = createClient(url ?? '', anonKey ?? '');
