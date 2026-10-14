import React, { useState } from 'react';
import { X, BookOpen } from 'lucide-react';

interface DocumentationModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DocumentationModal: React.FC<DocumentationModalProps> = ({
  isOpen,
  onClose
}) => {
  const [docTab, setDocTab] = useState<'architecture' | 'schema' | 'api' | 'docker'>('architecture');

  if (!isOpen) return null;

  return (
    <div onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }} id="docs-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/70 backdrop-blur-md animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-4xl w-full max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-5 border-b border-stone-200 dark:border-stone-800 flex items-center justify-between bg-stone-50 dark:bg-stone-950">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-xl bg-sky-700 text-white">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
                Roamly Engineering Specs & System Documentation
              </h2>
              <p className="text-xs text-stone-500">
                Full-stack architecture, Database Schema, ER Diagram, REST APIs & Docker deployment
              </p>
            </div>
          </div>

          <button onClick={onClose} className="p-2 rounded-full hover:bg-stone-200 dark:hover:bg-stone-800 text-stone-500 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-2 px-6 py-3 border-b border-stone-100 dark:border-stone-800 text-xs font-bold bg-white dark:bg-stone-900">
          <button
            onClick={() => setDocTab('architecture')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${docTab === 'architecture' ? 'bg-sky-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}
          >
            Architecture & Component Hierarchy
          </button>
          <button
            onClick={() => setDocTab('schema')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${docTab === 'schema' ? 'bg-sky-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}
          >
            Database Schema & ER Diagram
          </button>
          <button
            onClick={() => setDocTab('api')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${docTab === 'api' ? 'bg-sky-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}
          >
            REST API Spec
          </button>
          <button
            onClick={() => setDocTab('docker')}
            className={`px-3 py-1.5 rounded-xl transition-colors cursor-pointer ${docTab === 'docker' ? 'bg-sky-700 text-white' : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-300'}`}
          >
            Docker & Deployment
          </button>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto space-y-6 text-xs text-stone-700 dark:text-stone-300 font-mono leading-relaxed">
          
          {docTab === 'architecture' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 font-sans">1. System Architecture & Tech Stack</h3>
              <pre className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-sky-300 border border-stone-200 dark:border-stone-800 overflow-x-auto text-[11px]">
{`+-----------------------------------------------------------------------+
|                             FRONTEND                                  |
|   React 19 + TypeScript + Vite + Tailwind CSS + Leaflet Maps          |
|   - Navbar, InteractiveMap, TripPlannerWizard, ItineraryView          |
|   - CommunityFeed, UserProfileView, AiTravelAssistant                 |
+-----------------------------------------------------------------------+
                                   |
                             REST API (/api)
                                   |
+-----------------------------------------------------------------------+
|                             BACKEND                                   |
|   Express Node.js Architecture                                        |
|   - Gemini 3.6 Flash Integration (@google/genai)                      |
|   - Route Optimizer & Travel Concierge                                |
+-----------------------------------------------------------------------+
                                   |
+-----------------------------------------------------------------------+
|                            DATABASE                                   |
|   PostgreSQL (Users, Destinations, TravelPlans, Activities, Likes)    |
+-----------------------------------------------------------------------+`}
              </pre>

              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 font-sans">2. Folder Structure</h3>
              <pre className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-emerald-300 border border-stone-200 dark:border-stone-800 overflow-x-auto text-[11px]">
{`/
├── server.ts                       # Express Backend with Gemini AI Integration
├── index.html                      # App Entry HTML & Leaflet CSS
├── src/
│   ├── main.tsx                    # React Root Mount
│   ├── App.tsx                     # Primary Application Logic & Routing
│   ├── index.css                   # Tailwind Global Styles & Glassmorphism
│   ├── types/
│   │   └── travel.ts               # Core TypeScript Interfaces & Enums
│   ├── data/
│   │   └── mockData.ts             # Curated Destinations, Warnings & Currencies
│   └── components/
│       ├── Navbar.tsx              # Navigation Header & Search Autocomplete
│       ├── InteractiveMap.tsx      # Leaflet Interactive OpenStreetMap Wrapper
│       ├── DestinationModal.tsx    # Destination Details & Weather Drawer
│       ├── TravelWarningDialog.tsx # Humorous Regional Warning Dialogs
│       ├── TripPlannerWizard.tsx   # Multi-step AI Travel Generator Wizard
│       ├── ItineraryView.tsx       # Interactive Day-by-Day Itinerary Editor
│       ├── CommunityFeed.tsx       # Social Itinerary Vault & Forking Hub
│       ├── UserProfileView.tsx     # Profile & Visited Countries Map Tracker
│       ├── AiTravelAssistant.tsx   # Floating Gemini AI Travel Concierge Chatbot
│       ├── PackingChecklistModal.tsx# Interactive Packing List Manager
│       └── DocumentationModal.tsx  # Engineering Specs & Architecture Drawer`}
              </pre>
            </div>
          )}

          {docTab === 'schema' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 font-sans">PostgreSQL Relational Schema & ER Diagram</h3>
              <pre className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-amber-300 border border-stone-200 dark:border-stone-800 overflow-x-auto text-[11px]">
{`TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    username VARCHAR(50) UNIQUE NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    avatar_url TEXT,
    bio TEXT,
    visited_countries JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE destinations (
    id VARCHAR(50) PRIMARY KEY,
    city VARCHAR(100) NOT NULL,
    country VARCHAR(100) NOT NULL,
    flag_emoji VARCHAR(10),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    timezone VARCHAR(50),
    best_season VARCHAR(50),
    avg_daily_cost_usd NUMERIC(10,2)
);

TABLE travel_plans (
    id VARCHAR(36) PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    destination_id VARCHAR(50) REFERENCES destinations(id),
    creator_id VARCHAR(36) REFERENCES users(id),
    duration_days INT NOT NULL,
    season VARCHAR(20),
    estimated_cost_usd NUMERIC(10,2),
    is_published BOOLEAN DEFAULT TRUE,
    likes_count INT DEFAULT 0,
    bookmarks_count INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

TABLE activities (
    id VARCHAR(36) PRIMARY KEY,
    plan_id VARCHAR(36) REFERENCES travel_plans(id) ON DELETE CASCADE,
    day_number INT NOT NULL,
    time_of_day VARCHAR(20), -- 'Morning', 'Afternoon', 'Evening'
    title VARCHAR(200) NOT NULL,
    category VARCHAR(50),
    location TEXT,
    description TEXT,
    estimated_duration VARCHAR(50),
    estimated_cost_usd NUMERIC(10,2),
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6)
);`}
              </pre>
            </div>
          )}

          {docTab === 'api' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 font-sans">REST API Endpoint Specification</h3>
              <div className="space-y-2 font-sans">
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-sky-700 dark:text-sky-400">POST /api/generate-itinerary</span>
                  <span className="text-[10px] text-stone-500">Generates custom AI itinerary using Gemini 3.6 Flash</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-emerald-700 dark:text-emerald-400">POST /api/ai-chat</span>
                  <span className="text-[10px] text-stone-500">AI Travel Concierge Q&A Assistant</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-purple-700 dark:text-purple-400">POST /api/optimize-route</span>
                  <span className="text-[10px] text-stone-500">Geographic route & activity reordering</span>
                </div>
                <div className="p-3 rounded-xl bg-stone-100 dark:bg-stone-800 flex items-center justify-between">
                  <span className="font-mono text-xs font-bold text-amber-700 dark:text-amber-400">POST /api/suggest-gems</span>
                  <span className="text-[10px] text-stone-500">Recommends local secret hidden spots</span>
                </div>
              </div>
            </div>
          )}

          {docTab === 'docker' && (
            <div className="space-y-4">
              <h3 className="text-sm font-bold text-sky-700 dark:text-sky-400 font-sans">Docker Container Configuration</h3>
              <pre className="p-4 rounded-xl bg-stone-100 dark:bg-stone-900 text-stone-800 dark:text-emerald-300 border border-stone-200 dark:border-stone-800 overflow-x-auto text-[11px]">
{`# Dockerfile
FROM node:20-alpine AS builder
WORKDIR /app
COPY package*.json ./
RUN npm ci
COPY . .
RUN npm run build

FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
EXPOSE 3000
CMD ["node", "dist/server.cjs"]`}
              </pre>
            </div>
          )}

        </div>

      </div>
    </div>
  );
};
