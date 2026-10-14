import React, { useState } from 'react';
import { Sparkles, Calendar, Users, DollarSign, Layers, Check, Search, MapPin, Loader2 } from 'lucide-react';
import { TravelCategory, TravelSeason, CompanionStyle, GenerateTripRequest } from '../types/travel';
import { DESTINATIONS } from '../data/mockData';

interface TripPlannerWizardProps {
  onGenerateTrip: (req: GenerateTripRequest) => void;
  onBrowseCommunity: () => void;
  isGenerating: boolean;
  preselectedDestination?: string;
}

const CATEGORIES: TravelCategory[] = [
  'City', 'Nature', 'Beach', 'Mountain', 'Museum', 'History',
  'Food', 'Cafe', 'Nightlife', 'Shopping', 'Photography', 'Adventure',
  'Family', 'Luxury', 'Budget', 'Hiking', 'Camping', 'Road Trip',
  'Hidden Gems', 'Romantic', 'Anime', 'Theme Park', 'Architecture', 'Festival'
];

const DURATIONS = [1, 3, 5, 7, 14, 30];
const SEASONS: TravelSeason[] = ['Spring', 'Summer', 'Autumn', 'Winter'];
const COMPANIONS: CompanionStyle[] = ['Solo', 'Couple', 'Family', 'Friends', 'Pet Friendly'];

export const TripPlannerWizard: React.FC<TripPlannerWizardProps> = ({
  onGenerateTrip,
  onBrowseCommunity,
  isGenerating,
  preselectedDestination = ''
}) => {
  const [destination, setDestination] = useState(preselectedDestination);
  const [destinationError, setDestinationError] = useState('');
  const [durationDays, setDurationDays] = useState<number>(5);
  const [season, setSeason] = useState<TravelSeason>('Spring');
  const [companionStyle, setCompanionStyle] = useState<CompanionStyle>('Solo');
  const [budgetStyle, setBudgetStyle] = useState<'Budget' | 'Moderate' | 'Luxury'>('Moderate');
  const [selectedPreferences, setSelectedPreferences] = useState<TravelCategory[]>(['City', 'Food', 'Museum']);

  const togglePreference = (cat: TravelCategory) => {
    if (selectedPreferences.includes(cat)) {
      setSelectedPreferences(selectedPreferences.filter(c => c !== cat));
    } else {
      setSelectedPreferences([...selectedPreferences, cat]);
    }
  };

  const handleGenerate = () => {
    if (!destination.trim()) {
      setDestinationError('Please enter where you want to go.');
      document.getElementById('wizard-destination-input')?.focus();
      return;
    }
    onGenerateTrip({
      destination: destination.trim(),
      durationDays,
      season,
      preferences: selectedPreferences,
      companionStyle,
      budgetStyle
    });
  };

  return (
    <div id="trip-planner-wizard" className="max-w-4xl mx-auto space-y-8 py-4 px-4 sm:px-6">
      
      {/* Header Banner */}
      <div className="text-center space-y-3">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest bg-sky-100/90 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800">
          <Sparkles className="w-3.5 h-3.5" /> AI Travel Architect
        </span>
        <h1 className="text-3xl sm:text-4xl font-black text-stone-900 dark:text-stone-100 font-serif-heading">
          Design Your Custom Journey
        </h1>
        <p className="text-sm sm:text-base text-stone-600 dark:text-stone-400 max-w-xl mx-auto leading-relaxed">
          Tailor your dates, pace, budget, and passion points. Our AI generates a personalized day-by-day itinerary in seconds.
        </p>
      </div>

      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl p-6 sm:p-8 shadow-xl space-y-8">
        
        {/* Step 1: Destination Selection */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <MapPin className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            Where do you want to go?
          </label>
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="wizard-destination-input"
              value={destination}
              onChange={(e) => { setDestination(e.target.value); setDestinationError(''); }}
              placeholder="e.g. Kyoto, Paris, Iceland, Sydney..."
              className="w-full pl-10 pr-4 py-3 rounded-2xl bg-stone-50 dark:bg-stone-800/80 border border-stone-200 dark:border-stone-700 text-stone-900 dark:text-stone-100 text-sm font-medium focus:outline-none focus:ring-2 focus:ring-sky-600/40"
            />
          </div>
          {destinationError && (
            <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{destinationError}</p>
          )}

          {/* Quick Destination Pills */}
          <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs text-stone-500">
            <span className="font-semibold text-stone-400 shrink-0">Popular:</span>
            {DESTINATIONS.slice(0, 5).map(d => (
              <button
                key={d.id}
                onClick={() => { setDestination(`${d.city}, ${d.country}`); setDestinationError(''); }}
                className="shrink-0 px-2.5 py-1 rounded-full bg-stone-100 dark:bg-stone-800 hover:bg-sky-50 dark:hover:bg-sky-950/60 text-stone-700 dark:text-stone-300 font-medium transition-colors flex items-center gap-1 cursor-pointer"
              >
                <span>{d.flag}</span> {d.city}
              </button>
            ))}
          </div>
        </div>

        {/* Step 2: Duration */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-stone-800 dark:text-stone-200 flex items-center gap-2">
            <Calendar className="w-4 h-4 text-sky-700 dark:text-sky-400" />
            Trip Duration
          </label>
          <div className="grid grid-cols-3 sm:grid-cols-6 gap-2.5">
            {DURATIONS.map(d => (
              <button
                key={d}
                onClick={() => setDurationDays(d)}
                className={`py-2.5 px-3 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                  durationDays === d
                    ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                    : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                }`}
              >
                {d} {d === 1 ? 'Day' : 'Days'}
              </button>
            ))}
          </div>
        </div>

        {/* Step 3: Season & Companion & Budget */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Season */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300">
              Travel Season
            </label>
            <div className="grid grid-cols-2 gap-2">
              {SEASONS.map(s => (
                <button
                  key={s}
                  onClick={() => setSeason(s)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    season === s
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>

          {/* Companion */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <Users className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" /> Companion
            </label>
            <div className="grid grid-cols-2 gap-2">
              {COMPANIONS.map(c => (
                <button
                  key={c}
                  onClick={() => setCompanionStyle(c)}
                  className={`py-2 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    companionStyle === c
                      ? 'bg-sky-700 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Budget */}
          <div className="space-y-2">
            <label className="block text-xs font-bold text-stone-700 dark:text-stone-300 flex items-center gap-1">
              <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Budget Tier
            </label>
            <div className="grid grid-cols-3 gap-2">
              {(['Budget', 'Moderate', 'Luxury'] as const).map(b => (
                <button
                  key={b}
                  onClick={() => setBudgetStyle(b)}
                  className={`py-2 px-2 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    budgetStyle === b
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300'
                  }`}
                >
                  {b}
                </button>
              ))}
            </div>
          </div>

        </div>

        {/* Step 4: Travel Preferences (Multi-select) */}
        <div className="space-y-3">
          <label className="block text-sm font-bold text-stone-800 dark:text-stone-200">
            Travel Style & Interests (Select multiple)
          </label>
          <div className="flex flex-wrap gap-2">
            {CATEGORIES.map(cat => {
              const isSelected = selectedPreferences.includes(cat);
              return (
                <button
                  key={cat}
                  onClick={() => togglePreference(cat)}
                  className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isSelected
                      ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3" />}
                  {cat}
                </button>
              );
            })}
          </div>
        </div>

        {/* Action Controls */}
        <div className="pt-4 border-t border-stone-200 dark:border-stone-800 flex flex-col sm:flex-row gap-4">
          <button
            id="wizard-generate-btn"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex-1 py-4 px-6 rounded-2xl text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-xl shadow-sky-700/25 transition-all flex items-center justify-center gap-2.5 disabled:opacity-50 cursor-pointer"
          >
            {isGenerating ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Architecting Itinerary with Gemini AI...
              </>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                Generate Itinerary with AI
              </>
            )}
          </button>

          <button
            id="wizard-browse-community-btn"
            onClick={onBrowseCommunity}
            className="py-4 px-6 rounded-2xl text-sm font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
          >
            <Layers className="w-5 h-5 text-sky-700 dark:text-sky-400" />
            Browse Community Plans
          </button>
        </div>

      </div>

    </div>
  );
};
