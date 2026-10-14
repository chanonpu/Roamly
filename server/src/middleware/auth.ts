import { NextFunction, Request, Response } from 'express';
import { supabaseAdmin } from '../lib/supabase.js';
import { ApiError } from './errorHandler.js';

export interface AuthedRequest extends Request {
  user?: { id: string; email: string | null };
}

/**
 * Expects `Authorization: Bearer <supabase-access-token>`. The frontend gets
 * that token from `supabase.auth.getSession()` after the user signs in with
 * `@supabase/supabase-js` directly (Supabase Auth issues the token; this
 * backend never sees a password, only verifies the token Supabase already
 * signed). Attaches `req.user = { id, email }` on success.
 */
export async function requireAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;

  if (!token) {
    return next(new ApiError(401, 'Sign in required — missing Authorization header.'));
  }

  // Async middleware isn't covered by asyncHandler, so a thrown error (e.g.
  // Supabase unreachable) must be caught here or the request would hang.
  try {
    const { data, error } = await supabaseAdmin.auth.getUser(token);
    if (error || !data.user) {
      return next(new ApiError(401, 'Sign in required — your session has expired or is invalid.'));
    }
    req.user = { id: data.user.id, email: data.user.email ?? null };
  } catch {
    return next(new ApiError(401, 'Sign in required — could not verify your session.'));
  }
  next();
}

/** Same idea as requireAuth, but never rejects — attaches req.user if a
 *  valid token is present, otherwise just continues as anonymous. Used for
 *  routes that work for both signed-in and anonymous visitors (analytics
 *  events, for instance — we still want to know what logged-out people
 *  search for). */
export async function optionalAuth(req: AuthedRequest, _res: Response, next: NextFunction) {
  const header = req.headers.authorization;
  const token = header?.startsWith('Bearer ') ? header.slice('Bearer '.length) : null;
  if (!token) return next();

  try {
    const { data } = await supabaseAdmin.auth.getUser(token);
    if (data?.user) {
      req.user = { id: data.user.id, email: data.user.email ?? null };
    }
  } catch {
    /* verification failed — continue as anonymous */
  }
  next();
}
