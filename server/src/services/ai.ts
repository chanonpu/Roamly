import { Activity, GenerateTripRequest, TimeOfDay, TravelItinerary } from '../types/travel.js';
import { generateHeuristicItinerary } from './itineraryGenerator.js';
import { makeId } from '../utils/id.js';

const GEMINI_API_KEY = process.env.GEMINI_API_KEY?.trim();
const GEMINI_MODEL = process.env.GEMINI_MODEL || 'gemini-2.5-flash';

let genAiClient: any = null;
let genAiInitAttempted = false;

/** Lazily construct the @google/genai client. Returns null (never throws)
 *  if the package isn't installed or no API key is configured, so every
 *  caller can safely fall back to heuristics. */
async function getGenAiClient(): Promise<any | null> {
  if (!GEMINI_API_KEY) return null;
  if (genAiClient || genAiInitAttempted) return genAiClient;
  genAiInitAttempted = true;
  try {
    const mod = await import('@google/genai');
    const GoogleGenAI = (mod as any).GoogleGenAI;
    genAiClient = new GoogleGenAI({ apiKey: GEMINI_API_KEY });
  } catch (err) {
    console.warn('[ai] @google/genai unavailable, using heuristic fallbacks only.', (err as Error).message);
    genAiClient = null;
  }
  return genAiClient;
}

async function generateJson<T>(prompt: string, fallback: () => T): Promise<T> {
  const client = await getGenAiClient();
  if (!client) return fallback();

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
      config: { responseMimeType: 'application/json' },
    });
    const text: string = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    const cleaned = text.replace(/```json|```/g, '').trim();
    return JSON.parse(cleaned) as T;
  } catch (err) {
    console.warn('[ai] Gemini generation failed, falling back to heuristic.', (err as Error).message);
    return fallback();
  }
}

async function generateText(prompt: string, fallback: () => string): Promise<string> {
  const client = await getGenAiClient();
  if (!client) return fallback();

  try {
    const response = await client.models.generateContent({
      model: GEMINI_MODEL,
      contents: prompt,
    });
    const text: string = response.text ?? response.candidates?.[0]?.content?.parts?.[0]?.text ?? '';
    return text.trim() || fallback();
  } catch (err) {
    console.warn('[ai] Gemini chat failed, falling back to heuristic.', (err as Error).message);
    return fallback();
  }
}

export const isGeminiConfigured = () => Boolean(GEMINI_API_KEY);

// ---------------------------------------------------------------------------
// Itinerary generation
// ---------------------------------------------------------------------------
export async function generateItinerary(
  req: GenerateTripRequest,
  userId: string,
  userName: string,
  userAvatar: string
): Promise<TravelItinerary> {
  const fallback = () => generateHeuristicItinerary(req, userId, userName, userAvatar);
  if (!isGeminiConfigured()) return fallback();

  const prompt = `You are a travel planning assistant. Produce a JSON object (no markdown, no commentary) matching this TypeScript shape:
{
  "summary": string,
  "estimatedCostUSD": number,
  "transportation": string,
  "weatherForecast": string,
  "days": [{ "title": string, "activities": [{ "title": string, "category": string, "location": string, "description": string, "estimatedDuration": string, "estimatedCost": number, "timeOfDay": "Morning"|"Afternoon"|"Evening" }] }]
}
Trip request: destination="${req.destination}", durationDays=${req.durationDays}, season="${req.season}", preferences=${JSON.stringify(req.preferences)}, companionStyle="${req.companionStyle ?? 'Solo'}", budgetStyle="${req.budgetStyle ?? 'Moderate'}".
Produce exactly ${req.durationDays} days, each with exactly 3 activities (one per time of day). Keep descriptions to one sentence.`;

  type GeminiItineraryShape = {
    summary: string;
    estimatedCostUSD: number;
    transportation: string;
    weatherForecast: string;
    days: { title: string; activities: Omit<Activity, 'id'>[] }[];
  };

  const raw = await generateJson<GeminiItineraryShape | null>(prompt, () => null);
  if (!raw || !Array.isArray(raw.days) || raw.days.length === 0) return fallback();

  try {
    const base = fallback(); // use heuristic for cover image / flag / coords / packing list scaffolding
    return {
      ...base,
      summary: raw.summary ?? base.summary,
      estimatedCostUSD: raw.estimatedCostUSD ?? base.estimatedCostUSD,
      transportation: raw.transportation ?? base.transportation,
      weatherForecast: raw.weatherForecast ?? base.weatherForecast,
      days: raw.days.map((d, i) => ({
        dayNumber: i + 1,
        title: d.title,
        activities: (d.activities ?? []).map((a, j) => ({
          ...a,
          id: makeId('act'),
          lat: base.days[i]?.activities[j]?.lat,
          lng: base.days[i]?.activities[j]?.lng,
        })) as Activity[],
      })),
    };
  } catch {
    return fallback();
  }
}

// ---------------------------------------------------------------------------
// AI chat concierge
// ---------------------------------------------------------------------------
const CHAT_KEYWORDS: { match: RegExp; reply: (dest: string) => string }[] = [
  { match: /tip|etiquette|custom/i, reply: (d) => `In ${d}, a good rule of thumb is to observe how locals behave before you act — tipping norms, greetings, and dress codes vary a lot by neighborhood and venue type there.` },
  { match: /transit|metro|subway|bus|train/i, reply: (d) => `For getting around ${d}, look into a rechargeable transit card — it's almost always cheaper than single tickets and works across buses, trains, and metro lines.` },
  { match: /food|eat|restaurant|cuisine/i, reply: (d) => `${d} has fantastic food scenes away from the main tourist strips — try walking two or three streets back from the main attractions for better prices and more authentic spots.` },
  { match: /weather|climate|pack/i, reply: (d) => `Weather in ${d} can shift during the day, so layering is your friend. Check a short-range forecast the night before so you can adjust your packing list.` },
  { match: /safe|safety|scam/i, reply: (d) => `${d} is generally welcoming to travelers — the usual precautions apply: keep valuables secure in crowds, use official taxis or ride-share apps, and keep a digital copy of your documents.` },
  { match: /currency|money|cash|card/i, reply: (d) => `In ${d}, it's smart to carry a small amount of local cash for markets and small vendors, while using a card with no foreign transaction fees for everything else.` },
  { match: /visa|entry|passport/i, reply: (d) => `Entry requirements for ${d} depend on your nationality — check your destination country's official immigration site close to your travel dates, since rules can change.` },
  { match: /hidden|secret|gem|off.the.beaten/i, reply: (d) => `Ask locally-run cafes or your accommodation host for their personal favorite spot in ${d} — that's usually where the best hidden gems in any city come from.` },
];

export async function chatReply(message: string, destinationContext?: string): Promise<string> {
  const dest = destinationContext || 'your destination';
  const fallback = () => {
    const hit = CHAT_KEYWORDS.find(k => k.match.test(message));
    if (hit) return hit.reply(dest);
    return `Great question about ${dest}! I'd recommend checking recent traveler reviews for specifics, but generally: plan your must-see stops early in the day to beat crowds, and leave some unstructured time to wander — that's often where the best moments happen.`;
  };

  if (!isGeminiConfigured()) return fallback();

  const prompt = `You are Roamly's friendly AI travel concierge. Destination context: "${dest}". Traveler asks: "${message}". Reply in 2-4 concise, helpful sentences, plain text only (no markdown).`;
  return generateText(prompt, fallback);
}

// ---------------------------------------------------------------------------
// Hidden gem suggestion
// ---------------------------------------------------------------------------
const GEM_TEMPLATES = [
  { title: 'A family-run noodle counter tucked off the main strip', timeOfDay: 'Afternoon' as TimeOfDay, category: 'Food' },
  { title: 'A quiet rooftop with a view locals actually use', timeOfDay: 'Evening' as TimeOfDay, category: 'Photography' },
  { title: 'A pocket park most guidebooks skip entirely', timeOfDay: 'Morning' as TimeOfDay, category: 'Nature' },
  { title: 'A tiny vinyl / record shop with a cult following', timeOfDay: 'Afternoon' as TimeOfDay, category: 'Shopping' },
  { title: 'A neighborhood bakery that sells out by 10am', timeOfDay: 'Morning' as TimeOfDay, category: 'Cafe' },
];

interface GemSuggestion {
  title: string;
  description: string;
  location?: string;
  estimatedCost?: number;
  timeOfDay?: TimeOfDay;
}

export async function suggestHiddenGem(destination: string): Promise<GemSuggestion> {
  const fallback = (): GemSuggestion => {
    const t = GEM_TEMPLATES[Math.floor(Math.random() * GEM_TEMPLATES.length)];
    return {
      title: `${t.title} in ${destination}`,
      description: `A local favorite in ${destination} that rarely makes the top-10 lists — ask a local barista or shopkeeper to point you to the current best one nearby.`,
      location: destination,
      estimatedCost: 5 + Math.round(Math.random() * 20),
      timeOfDay: t.timeOfDay,
    };
  };

  if (!isGeminiConfigured()) return fallback();

  const prompt = `Suggest one lesser-known "hidden gem" activity in ${destination} for a traveler. Return JSON only: { "title": string, "description": string (1 sentence), "location": string, "estimatedCost": number (USD), "timeOfDay": "Morning"|"Afternoon"|"Evening" }.`;
  return generateJson<GemSuggestion>(prompt, fallback);
}
