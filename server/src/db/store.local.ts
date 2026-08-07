import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { TravelItinerary, Destination, UserProfile, Currency } from '../types/travel.js';
import { DESTINATIONS, INITIAL_ITINERARIES, CURRENT_USER, CURRENCIES } from './seed.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DB_FILE = process.env.DB_FILE
  ? path.resolve(process.cwd(), process.env.DB_FILE)
  : path.resolve(__dirname, '../data/db.json');

interface DbShape {
  destinations: Destination[];
  itineraries: TravelItinerary[];
  users: Record<string, UserProfile>;
  currencies: Currency[];
  likedBy: Record<string, string[]>; // itineraryId -> userIds who liked it
  bookmarkedBy: Record<string, string[]>; // itineraryId -> userIds who bookmarked it
}

/**
 * Very small "database": everything lives in memory and is mirrored to a
 * JSON file on disk so data survives a server restart. This is intentionally
 * simple for a draft/demo backend — swap `db/store.ts` for a real Postgres
 * repository (see db/postgres.schema.sql) when you're ready for production.
 */
class Store {
  private data: DbShape;
  private writeTimer: NodeJS.Timeout | null = null;

  constructor() {
    this.data = this.load();
  }

  private load(): DbShape {
    if (fs.existsSync(DB_FILE)) {
      try {
        const raw = fs.readFileSync(DB_FILE, 'utf-8');
        const parsed = JSON.parse(raw) as DbShape;
        if (parsed.destinations && parsed.itineraries && parsed.users) {
          return parsed;
        }
      } catch (err) {
        console.warn('[store] Failed to read db.json, reseeding.', err);
      }
    }
    return {
      destinations: DESTINATIONS,
      itineraries: INITIAL_ITINERARIES,
      users: { [CURRENT_USER.id]: CURRENT_USER },
      currencies: CURRENCIES,
      likedBy: {},
      bookmarkedBy: {},
    };
  }

  /** Debounced write so rapid mutations (drag reorder, typing) don't thrash disk I/O. */
  private persist() {
    if (this.writeTimer) clearTimeout(this.writeTimer);
    this.writeTimer = setTimeout(() => {
      try {
        fs.mkdirSync(path.dirname(DB_FILE), { recursive: true });
        fs.writeFileSync(DB_FILE, JSON.stringify(this.data, null, 2), 'utf-8');
      } catch (err) {
        console.error('[store] Failed to persist db.json', err);
      }
    }, 150);
  }

  // ---- Destinations ----
  listDestinations(): Destination[] {
    return this.data.destinations;
  }
  getDestination(id: string): Destination | undefined {
    return this.data.destinations.find(d => d.id === id);
  }

  // ---- Currencies ----
  listCurrencies(): Currency[] {
    return this.data.currencies;
  }

  // ---- Users ----
  getUser(id: string): UserProfile | undefined {
    return this.data.users[id];
  }
  updateUser(id: string, patch: Partial<UserProfile>): UserProfile | undefined {
    const existing = this.data.users[id];
    if (!existing) return undefined;
    this.data.users[id] = { ...existing, ...patch };
    this.persist();
    return this.data.users[id];
  }

  // ---- Itineraries ----
  listItineraries(): TravelItinerary[] {
    return this.data.itineraries;
  }
  getItinerary(id: string): TravelItinerary | undefined {
    return this.data.itineraries.find(it => it.id === id);
  }
  createItinerary(it: TravelItinerary): TravelItinerary {
    this.data.itineraries.unshift(it);
    this.persist();
    return it;
  }
  updateItinerary(id: string, patch: Partial<TravelItinerary>): TravelItinerary | undefined {
    const idx = this.data.itineraries.findIndex(it => it.id === id);
    if (idx === -1) return undefined;
    this.data.itineraries[idx] = { ...this.data.itineraries[idx], ...patch, updatedAt: 'Just now' };
    this.persist();
    return this.data.itineraries[idx];
  }
  deleteItinerary(id: string): boolean {
    const before = this.data.itineraries.length;
    this.data.itineraries = this.data.itineraries.filter(it => it.id !== id);
    this.persist();
    return this.data.itineraries.length < before;
  }

  toggleLike(itineraryId: string, userId: string): TravelItinerary | undefined {
    const it = this.getItinerary(itineraryId);
    if (!it) return undefined;
    const likers = this.data.likedBy[itineraryId] ?? [];
    const alreadyLiked = likers.includes(userId);
    this.data.likedBy[itineraryId] = alreadyLiked
      ? likers.filter(u => u !== userId)
      : [...likers, userId];
    it.likesCount = Math.max(0, it.likesCount + (alreadyLiked ? -1 : 1));
    this.persist();
    return it;
  }

  toggleBookmark(itineraryId: string, userId: string): TravelItinerary | undefined {
    const it = this.getItinerary(itineraryId);
    if (!it) return undefined;
    const savers = this.data.bookmarkedBy[itineraryId] ?? [];
    const alreadySaved = savers.includes(userId);
    this.data.bookmarkedBy[itineraryId] = alreadySaved
      ? savers.filter(u => u !== userId)
      : [...savers, userId];
    it.bookmarksCount = Math.max(0, it.bookmarksCount + (alreadySaved ? -1 : 1));
    this.persist();
    return it;
  }

  getBookmarkedItineraries(userId: string): TravelItinerary[] {
    // bookmarkedBy is keyed by itineraryId -> userIds, so invert the lookup:
    const savedIds = Object.entries(this.data.bookmarkedBy)
      .filter(([, userIds]) => userIds.includes(userId))
      .map(([itineraryId]) => itineraryId);
    return this.data.itineraries.filter(it => savedIds.includes(it.id));
  }
}

export const store = new Store();
