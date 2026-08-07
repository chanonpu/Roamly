import 'dotenv/config';
import { createApp } from '../src/app.js';

// Express apps are valid Node request handlers ((req, res) => void), so
// Vercel's Node.js runtime can call this directly — no separate serverless
// framework needed. Every file in /api becomes a route; vercel.json rewrites
// all /api/* traffic to this one file so the whole Express app (and all its
// internal routing) runs as a single function.
const app = createApp();

export default app;
