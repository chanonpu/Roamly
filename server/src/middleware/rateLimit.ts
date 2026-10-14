// Named import: Vercel's builder mis-types this package's default import (see app.ts).
import { rateLimit, ipKeyGenerator } from 'express-rate-limit';
import { AuthedRequest } from './auth.js';

/**
 * Signed-in callers are limited per account, anonymous ones per IP. Per-route
 * limiters must be mounted *after* requireAuth/optionalAuth so req.user is set.
 *
 * Uses the default in-memory store: on Vercel each serverless instance keeps
 * its own counters, so this stops bursts but isn't a global cap. Swap in a
 * shared store (e.g. Redis/Upstash) with the same options for a hard limit.
 */
function limiter(windowMs: number, limit: number, message: string) {
  return rateLimit({
    windowMs,
    limit,
    standardHeaders: 'draft-7',
    legacyHeaders: false,
    keyGenerator: (req) => (req as AuthedRequest).user?.id ?? ipKeyGenerator(req.ip ?? ''),
    message: { error: message },
  });
}

const MINUTE = 60 * 1000;

export const apiLimiter = limiter(15 * MINUTE, 300, 'Too many requests — please slow down and try again shortly.');
export const generateLimiter = limiter(60 * MINUTE, 10, "You've generated a lot of trips this hour — please try again later.");
export const aiLimiter = limiter(MINUTE, 20, 'Too many AI requests — please wait a minute and try again.');
export const writeLimiter = limiter(MINUTE, 60, 'Too many changes in a short time — please wait a moment.');
export const analyticsLimiter = limiter(MINUTE, 60, 'Too many events.');
