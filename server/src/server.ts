import 'dotenv/config';
import { createApp } from './app.js';
import { isGeminiConfigured } from './services/ai.js';

const PORT = Number(process.env.PORT) || 4000;
const app = createApp();

app.listen(PORT, () => {
  console.log(`Roamly API listening on http://localhost:${PORT}`);
  console.log(`Gemini AI: ${isGeminiConfigured() ? 'enabled' : 'disabled (using heuristic fallbacks)'}`);
});
