import React from 'react';
import { X, Sparkles, Calendar, DollarSign, CloudSun, Clock, Tag, Layers } from 'lucide-react';
import { Destination } from '../types/travel';

interface DestinationModalProps {
  destination: Destination | null;
  onClose: () => void;
  onStartPlanning: (destination: Destination) => void;
  onBrowseCommunityForDest: (cityName: string) => void;
}

export const DestinationModal: React.FC<DestinationModalProps> = ({
  destination,
  onClose,
  onStartPlanning,
  onBrowseCommunityForDest
}) => {
  if (!destination) return null;

  return (
    <div onMouseDown={e => { if (e.target === e.currentTarget) onClose(); }} id="destination-detail-modal" className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-3xl max-w-xl w-full shadow-2xl overflow-hidden relative">
        
        {/* Cover Image & Close Button */}
        <div className="relative h-56 w-full">
          <img
            src={destination.image}
            alt={destination.city}
            className="w-full h-full object-cover"
            referrerPolicy="no-referrer"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
          
          <button
            id="modal-close-btn"
            onClick={onClose}
            className="absolute top-3 right-3 p-2 rounded-full bg-stone-900/60 hover:bg-stone-900 text-white backdrop-blur-md transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="absolute bottom-4 left-6 right-6 text-white">
            <div className="flex items-center gap-2 mb-1">
              <span className="text-2xl">{destination.flag}</span>
              <span className="text-xs uppercase tracking-wider font-semibold bg-sky-700/80 backdrop-blur-md px-2.5 py-0.5 rounded-full">
                {destination.country}
              </span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-serif-heading">
              {destination.city}
            </h2>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-6 space-y-5">
          <p className="text-sm text-stone-600 dark:text-stone-300 leading-relaxed">
            {destination.description}
          </p>

          {/* Quick Info Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                <Clock className="w-3.5 h-3.5 text-sky-600" /> Timezone
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                {destination.timezone}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                <Calendar className="w-3.5 h-3.5 text-emerald-600" /> Best Season
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-100 truncate">
                {destination.bestSeason}
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                <DollarSign className="w-3.5 h-3.5 text-amber-600" /> Avg Daily
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                ${destination.avgDailyCostUSD} / day
              </div>
            </div>

            <div className="p-3 rounded-xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/60 dark:border-stone-800">
              <div className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400 mb-1">
                <CloudSun className="w-3.5 h-3.5 text-sky-500" /> Climate
              </div>
              <div className="text-xs font-semibold text-stone-800 dark:text-stone-100">
                22°C Clear
              </div>
            </div>
          </div>

          {/* Tags */}
          <div className="space-y-1.5">
            <span className="text-xs font-semibold text-stone-400 flex items-center gap-1">
              <Tag className="w-3 h-3" /> Popular Travel Tags
            </span>
            <div className="flex flex-wrap gap-1.5">
              {destination.popularTags.map((tag, i) => (
                <span key={i} className="px-2.5 py-1 text-[11px] font-medium rounded-full bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-2 flex flex-col sm:flex-row gap-3">
            <button
              id="plan-with-ai-btn"
              onClick={() => {
                onClose();
                onStartPlanning(destination);
              }}
              className="flex-1 py-3 px-4 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Sparkles className="w-4 h-4" />
              Generate Trip with AI
            </button>

            <button
              id="browse-community-btn"
              onClick={() => {
                onClose();
                onBrowseCommunityForDest(destination.city);
              }}
              className="py-3 px-4 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 text-stone-800 dark:text-stone-200 transition-all flex items-center justify-center gap-2 cursor-pointer"
            >
              <Layers className="w-4 h-4" />
              Browse Community Plans
            </button>
          </div>

        </div>

      </div>
    </div>
  );
};
