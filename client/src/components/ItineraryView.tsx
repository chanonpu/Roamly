import React, { useCallback, useMemo, useState } from 'react';
import {
  Sparkles, Calendar, DollarSign, MapPin, Share2, Heart, Bookmark,
  GitFork, Trash2, Plus, ArrowUp, ArrowDown, Map as MapIcon,
  List, Bus, CheckSquare, MessageSquare, Star, Eye, Copy,
  Printer, Check, Wand2, Compass, Clock, Loader2, AlertTriangle
} from 'lucide-react';
import { TravelItinerary, Activity, TimeOfDay, TravelCategory, Currency } from '../types/travel';
import { LazyInteractiveMap as InteractiveMap } from './LazyInteractiveMap';
import { api } from '../lib/api';
import { formatCurrency } from '../lib/format';
import { safeUrl } from '../lib/sanitize';
import { avatarSrc } from '../lib/avatar';

interface ItineraryViewProps {
  itinerary: TravelItinerary;
  currency: Currency;
  onUpdateItinerary: (updated: TravelItinerary) => void;
  onForkItinerary: (itinerary: TravelItinerary) => void;
  onOpenPackingList: (itinerary: TravelItinerary) => void;
  onDuplicateItinerary: (itinerary: TravelItinerary) => void;
  /** Whether anyone is signed in at all — liking, bookmarking, and
   *  commenting only require being signed in, not owning the itinerary. */
  isSignedIn: boolean;
  /** Whether the signed-in user is this itinerary's creator — editing
   *  (activities, packing list, AI actions) is owner-only on the backend,
   *  so the UI hides those controls for everyone else rather than letting
   *  people click things that will 403. */
  isOwner: boolean;
  /** Called when a signed-out visitor tries to do something that needs an
   *  account (like, bookmark, comment) — opens the sign-in modal. */
  onRequireAuth: () => void;
}

// Extracted + memoized: the activity list can get long, and none of these
// cards need to re-render just because e.g. the comment textarea changed.
const ActivityCard = React.memo(function ActivityCard({
  activity, isFirst, isLast, formatCost, editable, onMoveUp, onMoveDown, onDelete,
}: {
  activity: Activity;
  isFirst: boolean;
  isLast: boolean;
  formatCost: (usd: number) => string;
  editable: boolean;
  onMoveUp: () => void;
  onMoveDown: () => void;
  onDelete: () => void;
}) {
  return (
    <div className="p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xs hover:shadow-md transition-shadow space-y-2 relative group">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3">
          <span className={`mt-0.5 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider ${
            activity.timeOfDay === 'Morning'
              ? 'bg-amber-100 dark:bg-amber-950 text-amber-800 dark:text-amber-300'
              : activity.timeOfDay === 'Afternoon'
              ? 'bg-sky-100 dark:bg-sky-950 text-sky-800 dark:text-sky-300'
              : 'bg-indigo-100 dark:bg-indigo-950 text-indigo-800 dark:text-indigo-300'
          }`}>
            {activity.timeOfDay}
          </span>

          <div>
            <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 flex items-center gap-2 font-serif-heading">
              {activity.title}
              <span className="text-[11px] font-normal px-2 py-0.5 rounded-full bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 font-sans">
                {activity.category}
              </span>
            </h4>
            <div className="text-xs text-stone-500 dark:text-stone-400 flex items-center gap-2 mt-0.5">
              <span className="flex items-center gap-1"><MapPin className="w-3 h-3 text-sky-700 dark:text-sky-400" /> {activity.location}</span>
              <span>•</span>
              <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {activity.estimatedDuration}</span>
              <span>•</span>
              <span className="font-semibold text-emerald-700 dark:text-emerald-400">{formatCost(activity.estimatedCost)}</span>
            </div>
          </div>
        </div>

        {editable && (
          <div className="flex items-center gap-1">
            <button onClick={onMoveUp} disabled={isFirst} className="p-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer" title="Move Up">
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <button onClick={onMoveDown} disabled={isLast} className="p-1 rounded bg-stone-100 dark:bg-stone-800 text-stone-500 hover:text-stone-800 disabled:opacity-30 cursor-pointer" title="Move Down">
              <ArrowDown className="w-3.5 h-3.5" />
            </button>
            <button onClick={onDelete} className="p-1 rounded bg-rose-50 dark:bg-rose-950 text-rose-500 hover:bg-rose-100 transition-colors cursor-pointer" title="Delete Activity">
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        )}
      </div>

      <p className="text-xs text-stone-600 dark:text-stone-300 pl-1 border-l-2 border-sky-600 leading-relaxed">
        {activity.description}
      </p>

      {safeUrl(activity.googleMapsUrl) && (
        <a href={safeUrl(activity.googleMapsUrl)} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-1 text-[11px] font-semibold text-sky-700 dark:text-sky-400 hover:underline pt-1">
          <Compass className="w-3 h-3" /> View in Google Maps
        </a>
      )}
    </div>
  );
});

export const ItineraryView: React.FC<ItineraryViewProps> = ({
  itinerary,
  currency,
  onUpdateItinerary,
  onForkItinerary,
  onOpenPackingList,
  onDuplicateItinerary,
  isSignedIn,
  isOwner,
  onRequireAuth
}) => {
  const [activeView, setActiveView] = useState<'timeline' | 'map'>('timeline');
  const [selectedDayIndex, setSelectedDayIndex] = useState<number>(0);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isBookmarked, setIsBookmarked] = useState<boolean>(false);
  const [copiedLink, setCopiedLink] = useState<boolean>(false);

  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [addDayIndex, setAddDayIndex] = useState<number>(0);

  const [aiOptimizing, setAiOptimizing] = useState<boolean>(false);
  const [aiMessage, setAiMessage] = useState<string>('');
  const [isSaving, setIsSaving] = useState<boolean>(false);
  const [syncError, setSyncError] = useState<string>('');

  const [newCommentText, setNewCommentText] = useState<string>('');
  const [newCommentRating, setNewCommentRating] = useState<number>(5);

  const [newActTitle, setNewActTitle] = useState('');
  const [newActCat] = useState<TravelCategory>('City');
  const [newActLocation, setNewActLocation] = useState('');
  const [newActDesc, setNewActDesc] = useState('');
  const [newActDuration] = useState('2 hours');
  const [newActCost, setNewActCost] = useState(20);
  const [newActTimeOfDay, setNewActTimeOfDay] = useState<TimeOfDay>('Morning');

  // Pure formatter, only changes identity when currency actually changes —
  // keeps ActivityCard's memo effective instead of "new function every render".
  const formatCost = useCallback((usd: number) => formatCurrency(usd, currency), [currency]);

  /** Applies an optimistic update immediately for a snappy UI, fires the
   *  matching API call in the background, then reconciles with whatever the
   *  server returns (authoritative ids/timestamps). On failure the local
   *  edit is left in place (nothing is lost) but a small banner explains
   *  the save didn't reach the backend. */
  const persistChange = useCallback(async (
    optimisticNext: TravelItinerary,
    apiCall: () => Promise<TravelItinerary>
  ) => {
    onUpdateItinerary(optimisticNext);
    setIsSaving(true);
    setSyncError('');
    try {
      const saved = await apiCall();
      onUpdateItinerary(saved);
    } catch (err) {
      setSyncError("Saved locally, but couldn't reach the backend to persist this change.");
    } finally {
      setIsSaving(false);
    }
  }, [onUpdateItinerary]);

  const moveActivity = (dayIdx: number, actIdx: number, direction: 'up' | 'down') => {
    const day = itinerary.days[dayIdx];
    const nextActivities = [...day.activities];
    const newIdx = direction === 'up' ? actIdx - 1 : actIdx + 1;
    if (newIdx < 0 || newIdx >= nextActivities.length) return;

    const [moved] = nextActivities.splice(actIdx, 1);
    nextActivities.splice(newIdx, 0, moved);

    const nextDays = itinerary.days.map((d, i) => (i === dayIdx ? { ...d, activities: nextActivities } : d));
    persistChange(
      { ...itinerary, days: nextDays, updatedAt: 'Just now' },
      () => api.replaceDayActivities(itinerary.id, day.dayNumber, nextActivities)
    );
  };

  const deleteActivity = (dayIdx: number, actIdx: number) => {
    const day = itinerary.days[dayIdx];
    const nextActivities = day.activities.filter((_, i) => i !== actIdx);
    const nextDays = itinerary.days.map((d, i) => (i === dayIdx ? { ...d, activities: nextActivities } : d));
    persistChange(
      { ...itinerary, days: nextDays, updatedAt: 'Just now' },
      () => api.replaceDayActivities(itinerary.id, day.dayNumber, nextActivities)
    );
  };

  const handleAddActivity = () => {
    if (!newActTitle.trim()) return;
    const day = itinerary.days[addDayIndex];

    const newActivity: Activity = {
      id: `act_custom_${Date.now()}`,
      title: newActTitle,
      category: newActCat,
      location: newActLocation || itinerary.destination,
      description: newActDesc || 'Custom activity added by traveler.',
      estimatedDuration: newActDuration,
      estimatedCost: newActCost,
      timeOfDay: newActTimeOfDay,
      lat: 35.6762 + (Math.random() - 0.5) * 0.05,
      lng: 139.6503 + (Math.random() - 0.5) * 0.05
    };

    const nextActivities = [...day.activities, newActivity];
    const nextDays = itinerary.days.map((d, i) => (i === addDayIndex ? { ...d, activities: nextActivities } : d));

    persistChange(
      { ...itinerary, days: nextDays, updatedAt: 'Just now' },
      () => api.addActivity(itinerary.id, day.dayNumber, newActivity)
    );

    setIsAddModalOpen(false);
    setNewActTitle('');
    setNewActDesc('');
  };

  const handleAiOptimizeRoute = async () => {
    setAiOptimizing(true);
    setAiMessage('');
    const day = itinerary.days[selectedDayIndex];
    try {
      const { optimizedActivities, estimatedTravelKm } = await api.optimizeRoute(day.activities, itinerary.destination);
      const nextDays = itinerary.days.map((d, i) => (i === selectedDayIndex ? { ...d, activities: optimizedActivities } : d));
      await persistChange(
        { ...itinerary, days: nextDays },
        () => api.replaceDayActivities(itinerary.id, day.dayNumber, optimizedActivities)
      );
      setAiMessage(`✨ Route optimized! ~${estimatedTravelKm} km of travel across Day ${selectedDayIndex + 1}.`);
    } catch (e) {
      setAiMessage("Couldn't reach the route optimizer — check that the backend is running.");
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleAiSuggestGems = async () => {
    setAiOptimizing(true);
    setAiMessage('');
    const day = itinerary.days[selectedDayIndex];
    try {
      const { gems } = await api.suggestGems(itinerary.destination);
      const gem = gems[0];
      if (!gem) return;

      const newAct: Activity = {
        id: `gem_${Date.now()}`,
        title: `💎 ${gem.title}`,
        category: 'Hidden Gems',
        location: gem.location || itinerary.destination,
        description: gem.description || '',
        estimatedDuration: '1.5 hrs',
        estimatedCost: gem.estimatedCost ?? 10,
        timeOfDay: (gem.timeOfDay as TimeOfDay) || 'Afternoon'
      };

      const nextActivities = [...day.activities, newAct];
      const nextDays = itinerary.days.map((d, i) => (i === selectedDayIndex ? { ...d, activities: nextActivities } : d));

      await persistChange(
        { ...itinerary, days: nextDays },
        () => api.replaceDayActivities(itinerary.id, day.dayNumber, nextActivities)
      );
      setAiMessage(`💎 Added local hidden gem: "${gem.title}" to Day ${selectedDayIndex + 1}!`);
    } catch (e) {
      setAiMessage("Couldn't fetch a hidden gem suggestion — check that the backend is running.");
    } finally {
      setAiOptimizing(false);
    }
  };

  const handleAddComment = async () => {
    if (!newCommentText.trim()) return;
    if (!isSignedIn) { onRequireAuth(); return; }
    const content = newCommentText.trim();
    const rating = newCommentRating;
    setNewCommentText('');
    setSyncError('');

    try {
      const updated = await api.addComment(itinerary.id, content, rating);
      onUpdateItinerary(updated);
    } catch (e) {
      setNewCommentText(content); // don't lose what they typed
      setSyncError("Couldn't post your review — check that the backend is running.");
    }
  };

  const currentDay = itinerary.days[selectedDayIndex] || itinerary.days[0];
  const allActivities = useMemo(() => itinerary.days.flatMap(d => d.activities), [itinerary.days]);

  return (
    <div id="itinerary-view-container" className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">

      {/* Cover Header Hero Card */}
      <div className="relative rounded-3xl overflow-hidden border border-stone-200 dark:border-stone-800 shadow-xl bg-stone-100 dark:bg-stone-900 text-white">
        <img
          src={itinerary.coverImage}
          alt={itinerary.title}
          className="w-full h-80 sm:h-96 object-cover"
          referrerPolicy="no-referrer"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-stone-950/90 via-stone-950/40 to-black/20" />

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/90 dark:bg-stone-900/90 text-stone-800 dark:text-stone-100 backdrop-blur-md shadow-md flex items-center gap-1.5">
              <span>{itinerary.flagEmoji}</span> {itinerary.destination}
            </span>
            <span className="px-3 py-1 rounded-full text-xs font-semibold bg-sky-700/80 text-white backdrop-blur-md shadow-md">
              {itinerary.durationDays} Days ({itinerary.season})
            </span>
            {isSaving && (
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-stone-900/60 text-white backdrop-blur-md shadow-md flex items-center gap-1.5">
                <Loader2 className="w-3 h-3 animate-spin" /> Saving...
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              id="like-btn"
              onClick={() => {
                if (!isSignedIn) { onRequireAuth(); return; }
                setIsLiked(!isLiked);
                api.likeItinerary(itinerary.id).then(onUpdateItinerary).catch(() => {});
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isLiked ? 'bg-rose-500 text-white' : 'bg-stone-900/60 hover:bg-stone-900 text-white'
              }`}
            >
              <Heart className="w-4 h-4 fill-current" />
            </button>

            <button
              id="bookmark-btn"
              onClick={() => {
                if (!isSignedIn) { onRequireAuth(); return; }
                setIsBookmarked(!isBookmarked);
                api.bookmarkItinerary(itinerary.id).then(onUpdateItinerary).catch(() => {});
              }}
              className={`p-2.5 rounded-full backdrop-blur-md transition-all cursor-pointer ${
                isBookmarked ? 'bg-amber-500 text-white' : 'bg-stone-900/60 hover:bg-stone-900 text-white'
              }`}
            >
              <Bookmark className="w-4 h-4 fill-current" />
            </button>
          </div>
        </div>

        <div className="absolute bottom-6 left-6 right-6 space-y-3">
          <div className="flex items-center gap-3">
            <img
              src={avatarSrc(itinerary.creatorAvatar)}
              alt={itinerary.creatorName}
              className="w-9 h-9 rounded-full object-cover ring-2 ring-sky-400"
              referrerPolicy="no-referrer"
            />
            <div className="text-xs">
              <div className="font-bold text-white">{itinerary.creatorName}</div>
              <div className="text-stone-300">Updated {itinerary.updatedAt}</div>
            </div>
          </div>

          <h1 className="text-2xl sm:text-4xl font-black leading-tight font-serif-heading">
            {itinerary.title}
          </h1>

          <p className="text-xs sm:text-sm text-stone-200 line-clamp-2 max-w-3xl leading-relaxed">
            {itinerary.summary}
          </p>

          <div className="pt-2 flex flex-wrap items-center justify-between gap-4 border-t border-white/20 text-xs">
            <div className="flex flex-wrap items-center gap-4">
              <div className="flex items-center gap-1.5 font-bold text-emerald-400">
                <DollarSign className="w-4 h-4" /> Total Est: {formatCost(itinerary.estimatedCostUSD)}
              </div>
              <div className="flex items-center gap-1.5 text-stone-200">
                <Bus className="w-4 h-4 text-sky-400" /> {itinerary.transportation}
              </div>
            </div>

            <div className="flex items-center gap-4 text-stone-300">
              <span className="flex items-center gap-1"><Eye className="w-3.5 h-3.5" /> {itinerary.viewsCount}</span>
              <span className="flex items-center gap-1"><Heart className="w-3.5 h-3.5 text-rose-400" /> {itinerary.likesCount}</span>
              <span className="flex items-center gap-1"><Star className="w-3.5 h-3.5 text-amber-400 fill-amber-400" /> {itinerary.rating} ({itinerary.ratingsCount})</span>
            </div>
          </div>
        </div>
      </div>

      {syncError && (
        <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 shrink-0" /> {syncError}
        </div>
      )}

      {/* Action Toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 p-4 rounded-2xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md">
        <div className="flex items-center gap-1 bg-stone-100 dark:bg-stone-800 p-1 rounded-xl">
          <button
            id="view-mode-timeline"
            onClick={() => setActiveView('timeline')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'timeline'
                ? 'bg-white dark:bg-stone-900 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <List className="w-4 h-4" /> Timeline
          </button>

          <button
            id="view-mode-map"
            onClick={() => setActiveView('map')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              activeView === 'map'
                ? 'bg-white dark:bg-stone-900 text-sky-700 dark:text-sky-400 shadow-xs'
                : 'text-stone-600 dark:text-stone-400'
            }`}
          >
            <MapIcon className="w-4 h-4" /> Map Pins
          </button>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {isOwner ? (
            <>
              <button
                id="ai-optimize-route-btn"
                onClick={handleAiOptimizeRoute}
                disabled={aiOptimizing}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-sky-50 dark:bg-sky-950/60 text-sky-700 dark:text-sky-400 border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                {aiOptimizing ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5 text-sky-700 dark:text-sky-400" />} AI Optimize Route
              </button>

              <button
                id="ai-suggest-gems-btn"
                onClick={handleAiSuggestGems}
                disabled={aiOptimizing}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-amber-50 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition-colors flex items-center gap-1.5 cursor-pointer disabled:opacity-50"
              >
                <Sparkles className="w-3.5 h-3.5 text-amber-600" /> AI Suggest Hidden Gems
              </button>

              <button
                id="packing-list-btn"
                onClick={() => onOpenPackingList(itinerary)}
                className="px-3 py-1.5 rounded-xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 cursor-pointer"
              >
                <CheckSquare className="w-3.5 h-3.5 text-emerald-600" /> Packing Checklist ({itinerary.packingList.filter(p => p.packed).length}/{itinerary.packingList.length})
              </button>
            </>
          ) : (
            <span className="text-xs text-stone-400 font-medium italic">
              Viewing {itinerary.creatorName}'s itinerary — fork it to edit your own copy
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          <button
            id="fork-itinerary-btn"
            onClick={() => onForkItinerary(itinerary)}
            className="px-3.5 py-2 rounded-xl text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all flex items-center gap-1.5 cursor-pointer"
          >
            <GitFork className="w-3.5 h-3.5" /> Fork / Customize
          </button>

          <button
            id="duplicate-btn"
            onClick={() => onDuplicateItinerary(itinerary)}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Duplicate Itinerary"
          >
            <Copy className="w-4 h-4" />
          </button>

          <button
            id="share-btn"
            onClick={() => {
              navigator.clipboard.writeText(window.location.href);
              setCopiedLink(true);
              setTimeout(() => setCopiedLink(false), 2000);
            }}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Copy Share Link"
          >
            {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
          </button>

          <button
            id="print-btn"
            onClick={() => window.print()}
            className="p-2 rounded-xl bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 transition-colors cursor-pointer"
            title="Print / Export PDF"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {aiMessage && (
        <div className="p-3 rounded-xl bg-sky-50 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800 text-xs font-semibold text-sky-800 dark:text-sky-300 animate-fade-in">
          {aiMessage}
        </div>
      )}

      {activeView === 'map' ? (
        <div className="space-y-4">
          <InteractiveMap activities={allActivities} height="520px" />
        </div>
      ) : (
        <div className="space-y-6">
          <div className="flex items-center gap-2 overflow-x-auto pb-2 border-b border-stone-200 dark:border-stone-800">
            {itinerary.days.map((day, idx) => (
              <button
                key={day.dayNumber}
                id={`day-tab-${idx}`}
                onClick={() => setSelectedDayIndex(idx)}
                className={`shrink-0 px-4 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                  selectedDayIndex === idx
                    ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                    : 'bg-white dark:bg-stone-900 text-stone-700 dark:text-stone-300 border border-stone-200 dark:border-stone-800 hover:bg-stone-50'
                }`}
              >
                <Calendar className="w-3.5 h-3.5" />
                Day {day.dayNumber}: {day.title}
              </button>
            ))}

            {isOwner && (
              <button
                id="add-custom-activity-trigger"
                onClick={() => {
                  setAddDayIndex(selectedDayIndex);
                  setIsAddModalOpen(true);
                }}
                className="shrink-0 px-3 py-2 rounded-2xl text-xs font-bold bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition-colors flex items-center gap-1.5 ml-auto cursor-pointer"
              >
                <Plus className="w-4 h-4" /> Add Activity
              </button>
            )}
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
                Day {currentDay.dayNumber}: {currentDay.title}
              </h3>
              <span className="text-xs text-stone-400 font-semibold">
                {currentDay.activities.length} activities scheduled
              </span>
            </div>

            <div className="space-y-3">
              {currentDay.activities.map((act, actIdx) => (
                <ActivityCard
                  key={act.id || actIdx}
                  activity={act}
                  isFirst={actIdx === 0}
                  isLast={actIdx === currentDay.activities.length - 1}
                  formatCost={formatCost}
                  editable={isOwner}
                  onMoveUp={() => moveActivity(selectedDayIndex, actIdx, 'up')}
                  onMoveDown={() => moveActivity(selectedDayIndex, actIdx, 'down')}
                  onDelete={() => deleteActivity(selectedDayIndex, actIdx)}
                />
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Add Custom Activity Modal */}
      {isAddModalOpen && (
        <div onMouseDown={e => { if (e.target === e.currentTarget) setIsAddModalOpen(false); }} className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm animate-fade-in">
          <div className="bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
              Add Activity to Day {addDayIndex + 1}
            </h3>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Activity Title</label>
                <input
                  type="text"
                  value={newActTitle}
                  onChange={e => setNewActTitle(e.target.value)}
                  maxLength={200}
                  placeholder="e.g. Sunset Cafe & Jazz Lounge"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Time of Day</label>
                  <select
                    value={newActTimeOfDay}
                    onChange={e => setNewActTimeOfDay(e.target.value as TimeOfDay)}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 cursor-pointer"
                  >
                    <option value="Morning">Morning</option>
                    <option value="Afternoon">Afternoon</option>
                    <option value="Evening">Evening</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Cost (USD)</label>
                  <input
                    type="number"
                    value={newActCost}
                    onChange={e => setNewActCost(Number(e.target.value))}
                    min={0}
                    className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Location</label>
                <input
                  type="text"
                  value={newActLocation}
                  onChange={e => setNewActLocation(e.target.value)}
                  maxLength={200}
                  placeholder="Specific street or spot name"
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>

              <div>
                <label className="block font-bold text-stone-700 dark:text-stone-300 mb-1">Description</label>
                <textarea
                  value={newActDesc}
                  onChange={e => setNewActDesc(e.target.value)}
                  maxLength={2000}
                  placeholder="Notes, tips, or what to expect..."
                  rows={2}
                  className="w-full p-2.5 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100"
                />
              </div>
            </div>

            <div className="flex justify-end gap-2 pt-2">
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="px-4 py-2 rounded-xl text-xs font-semibold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={handleAddActivity}
                className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-700 text-white shadow-md shadow-sky-700/20 cursor-pointer"
              >
                Add Activity
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Community Comments & Ratings Section */}
      <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-lg space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif-heading flex items-center gap-2">
            <MessageSquare className="w-5 h-5 text-sky-700 dark:text-sky-400" /> Traveler Reviews & Discussion ({itinerary.comments.length})
          </h3>
          <div className="flex items-center gap-1 text-sm font-bold text-amber-500">
            <Star className="w-4 h-4 fill-amber-500" /> {itinerary.rating} / 5.0
          </div>
        </div>

        <div className="space-y-3 p-4 rounded-2xl bg-stone-50 dark:bg-stone-800/60 border border-stone-200/80 dark:border-stone-800">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-stone-700 dark:text-stone-300">Rate this itinerary:</span>
            <div className="flex items-center gap-1">
              {[1, 2, 3, 4, 5].map(star => (
                <button key={star} onClick={() => setNewCommentRating(star)} className="p-0.5 focus:outline-none cursor-pointer">
                  <Star className={`w-4 h-4 ${star <= newCommentRating ? 'text-amber-400 fill-amber-400' : 'text-stone-300'}`} />
                </button>
              ))}
            </div>
          </div>

          <textarea
            value={newCommentText}
            onChange={e => setNewCommentText(e.target.value)}
            maxLength={2000}
            placeholder="Share your feedback, tips, or questions about this itinerary..."
            rows={2}
            className="w-full p-3 rounded-xl border border-stone-200 dark:border-stone-700 bg-white dark:bg-stone-900 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sky-600/40"
          />

          <div className="flex justify-end">
            <button
              id="submit-comment-btn"
              onClick={handleAddComment}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-sky-700 text-white shadow-md shadow-sky-700/20 hover:bg-sky-800 transition-colors cursor-pointer"
            >
              Post Review
            </button>
          </div>
        </div>

        <div className="space-y-3">
          {itinerary.comments.map(c => (
            <div key={c.id} className="p-3.5 rounded-xl bg-stone-50/80 dark:bg-stone-800/40 border border-stone-200/60 dark:border-stone-800/60 space-y-1.5">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <img src={avatarSrc(c.userAvatar)} alt={c.userName} className="w-6 h-6 rounded-full object-cover" referrerPolicy="no-referrer" />
                  <span className="text-xs font-bold text-stone-800 dark:text-stone-200">{c.userName}</span>
                </div>
                <div className="flex items-center gap-2">
                  {c.rating && (
                    <div className="flex items-center text-amber-400">
                      <Star className="w-3 h-3 fill-amber-400" />
                      <span className="text-[11px] font-bold ml-1">{c.rating}</span>
                    </div>
                  )}
                  <span className="text-[10px] text-stone-400">{c.createdAt}</span>
                </div>
              </div>
              <p className="text-xs text-stone-600 dark:text-stone-300 pl-8 leading-relaxed">
                {c.content}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
