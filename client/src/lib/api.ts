import {
  TravelItinerary, Destination, Currency, UserProfile,
  GenerateTripRequest, Activity, PackingItem, DayItinerary,
} from '../types/travel';

// Same-origin by default (matches the app's original `fetch('/api/...')` calls).
// Set VITE_API_URL if the backend runs on a different host/port, e.g. during
// local dev with `npm run dev` on the frontend and the API on :4000.
const API_URL = (import.meta as any).env?.VITE_API_URL ?? '';

export class ApiError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
    this.name = 'ApiError';
  }
}

// Set once from App.tsx whenever the Supabase session changes (see
// useAuth's `accessToken`). Kept as simple module state rather than piping
// a token through every call site — this is a browser tab's single current
// session, not something that needs to vary per-request.
let currentAccessToken: string | null = null;
export function setAccessToken(token: string | null): void {
  currentAccessToken = token;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const headers: Record<string, string> = { 'Content-Type': 'application/json', ...(init?.headers as Record<string, string> ?? {}) };
  if (currentAccessToken) headers.Authorization = `Bearer ${currentAccessToken}`;

  const res = await fetch(`${API_URL}${path}`, { ...init, headers });

  if (!res.ok) {
    let message = `Request failed: ${res.status}`;
    try {
      const body = await res.json();
      message = body.error ?? message;
    } catch {
      /* response wasn't JSON — keep the generic message */
    }
    throw new ApiError(res.status, message);
  }

  if (res.status === 204) return undefined as T;
  return res.json() as Promise<T>;
}

const get = <T>(path: string) => request<T>(path);
const post = <T>(path: string, body?: unknown) =>
  request<T>(path, { method: 'POST', body: body !== undefined ? JSON.stringify(body) : undefined });
const patch = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PATCH', body: JSON.stringify(body) });
const put = <T>(path: string, body: unknown) =>
  request<T>(path, { method: 'PUT', body: JSON.stringify(body) });
const del = <T>(path: string) => request<T>(path, { method: 'DELETE' });

export const api = {
  health: () => get<{ status: string; aiEnabled: boolean }>('/api/health'),

  // Destinations & currencies
  getDestinations: () => get<Destination[]>('/api/destinations'),
  getDestination: (id: string) => get<Destination>(`/api/destinations/${id}`),
  getCurrencies: () => get<Currency[]>('/api/currencies'),

  // Itineraries
  getItineraries: (params?: { search?: string; category?: string; sort?: string }) => {
    const qs = params
      ? '?' + new URLSearchParams(Object.entries(params).filter(([, v]) => v) as [string, string][]).toString()
      : '';
    return get<TravelItinerary[]>(`/api/itineraries${qs}`);
  },
  getItinerary: (id: string) => get<TravelItinerary>(`/api/itineraries/${id}`),
  createItinerary: (it: Partial<TravelItinerary>) => post<TravelItinerary>('/api/itineraries', it),
  updateItinerary: (id: string, patchBody: Partial<TravelItinerary>) =>
    patch<TravelItinerary>(`/api/itineraries/${id}`, patchBody),
  deleteItinerary: (id: string) => del<void>(`/api/itineraries/${id}`),
  forkItinerary: (id: string) => post<TravelItinerary>(`/api/itineraries/${id}/fork`),
  duplicateItinerary: (id: string) => post<TravelItinerary>(`/api/itineraries/${id}/duplicate`),
  likeItinerary: (id: string) => post<TravelItinerary>(`/api/itineraries/${id}/like`),
  bookmarkItinerary: (id: string) => post<TravelItinerary>(`/api/itineraries/${id}/bookmark`),
  addComment: (id: string, content: string, rating?: number) =>
    post<TravelItinerary>(`/api/itineraries/${id}/comments`, { content, rating }),
  updatePackingList: (id: string, packingList: PackingItem[]) =>
    put<TravelItinerary>(`/api/itineraries/${id}/packing-list`, packingList),
  replaceDayActivities: (id: string, dayNumber: number, activities: Activity[]) =>
    put<TravelItinerary>(`/api/itineraries/${id}/days/${dayNumber}/activities`, activities),
  addActivity: (id: string, dayNumber: number, activity: Omit<Activity, 'id'>) =>
    post<TravelItinerary>(`/api/itineraries/${id}/days/${dayNumber}/activities`, activity),

  // Users
  getCurrentUser: () => get<UserProfile>('/api/users/me'),
  updateCurrentUser: (patchBody: Partial<UserProfile>) => patch<UserProfile>('/api/users/me', patchBody),
  getMyItineraries: () => get<TravelItinerary[]>('/api/users/me/itineraries'),
  getSavedItineraries: () => get<TravelItinerary[]>('/api/users/me/saved'),

  // AI
  generateItinerary: (req: GenerateTripRequest) =>
    post<{ itinerary: TravelItinerary; usedAi: boolean }>('/api/generate-itinerary', req),
  aiChat: (message: string, destinationContext?: string) =>
    post<{ reply: string; usedAi: boolean }>('/api/ai-chat', { message, destinationContext }),
  optimizeRoute: (activities: Activity[], destination?: string) =>
    post<{ optimizedActivities: Activity[]; estimatedTravelKm: number }>('/api/optimize-route', { activities, destination }),
  suggestGems: (destination: string) =>
    post<{ gems: Partial<Activity>[]; usedAi: boolean }>('/api/suggest-gems', { destination }),

  // Analytics — see src/lib/analytics.ts for the `track()` wrapper most
  // code should call instead of this directly.
  logAnalyticsEvent: (eventType: string, metadata: Record<string, unknown>) =>
    post<void>('/api/analytics/events', { eventType, metadata }),
};

export type { DayItinerary };
