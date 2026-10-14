import React, { useRef, useState } from 'react';
import { 
  Award, Layers, Globe, CheckCircle2, Camera, Loader2, Pencil
} from 'lucide-react';
import { UserProfile, TravelItinerary, Currency } from '../types/travel';
import { CURRENT_USER } from '../data/mockData';
import { LazyCountryTrackerMap } from './LazyCountryTrackerMap';
import { avatarSrc } from '../lib/avatar';
import { BIO_MAX, NAME_MAX, validateName } from '../lib/authValidation';

interface UserProfileViewProps {
  user: UserProfile;
  myItineraries: TravelItinerary[];
  savedItineraries: TravelItinerary[];
  currency: Currency;
  onSelectItinerary: (it: TravelItinerary) => void;
  onUpdateVisitedCountries: (countries: string[]) => void;
  onUploadAvatar: (file: File) => Promise<void>;
  onUpdateProfile: (patch: { name: string; bio: string }) => Promise<void>;
}

const ALL_POPULAR_COUNTRIES = [
  'Japan', 'France', 'Italy', 'Iceland', 'United States', 'Spain', 'Germany', 
  'Thailand', 'Vietnam', 'Canada', 'Switzerland', 'Australia', 'Peru', 'Norway', 
  'Egypt', 'United Kingdom', 'Brazil', 'Mexico', 'Greece', 'South Korea', 'Singapore'
];

const INPUT_CLASS = 'w-full px-3 py-2 rounded-xl border border-stone-200 dark:border-stone-700 bg-stone-50 dark:bg-stone-800 text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-sky-500/40';

export const UserProfileView: React.FC<UserProfileViewProps> = ({
  user = CURRENT_USER,
  myItineraries,
  currency,
  onSelectItinerary,
  onUpdateVisitedCountries,
  onUploadAvatar,
  onUpdateProfile
}) => {
  const [activeTab, setActiveTab] = useState<'trips' | 'tracker' | 'achievements'>('trips');
  const [visited, setVisited] = useState<string[]>(user.visitedCountries || []);
  const [newCountryInput, setNewCountryInput] = useState<string>('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploadingAvatar, setIsUploadingAvatar] = useState(false);
  const [avatarError, setAvatarError] = useState('');

  const [isEditingProfile, setIsEditingProfile] = useState(false);
  const [draftName, setDraftName] = useState('');
  const [draftBio, setDraftBio] = useState('');
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileError, setProfileError] = useState('');

  const startEditingProfile = () => {
    setDraftName(user.name);
    setDraftBio(user.bio ?? '');
    setProfileError('');
    setIsEditingProfile(true);
  };

  const handleSaveProfile = async () => {
    const nameError = validateName(draftName);
    if (nameError) { setProfileError(nameError); return; }
    setIsSavingProfile(true);
    setProfileError('');
    try {
      await onUpdateProfile({ name: draftName.trim(), bio: draftBio.trim() });
      setIsEditingProfile(false);
    } catch (err) {
      setProfileError(err instanceof Error ? err.message : "Couldn't save your profile.");
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAvatarFile = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    e.target.value = ''; // allow re-picking the same file
    if (!file) return;
    setIsUploadingAvatar(true);
    setAvatarError('');
    try {
      await onUploadAvatar(file);
    } catch (err) {
      setAvatarError(err instanceof Error ? err.message : 'Upload failed.');
    } finally {
      setIsUploadingAvatar(false);
    }
  };

  const toggleVisitedCountry = (country: string) => {
    let next: string[];
    if (visited.includes(country)) {
      next = visited.filter(c => c !== country);
    } else {
      next = [...visited, country];
    }
    setVisited(next);
    onUpdateVisitedCountries(next);
  };

  const handleAddCustomCountry = () => {
    if (!newCountryInput.trim() || visited.includes(newCountryInput.trim())) return;
    const next = [...visited, newCountryInput.trim()];
    setVisited(next);
    onUpdateVisitedCountries(next);
    setNewCountryInput('');
  };

  const totalWorldCountries = 195;
  const visitedPercentage = ((visited.length / totalWorldCountries) * 100).toFixed(1);

  return (
    <div id="user-profile-container" className="max-w-6xl mx-auto py-6 px-4 sm:px-6 space-y-8">
      
      {/* Profile Header Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
        
        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-6 text-center sm:text-left">
          <div className="flex flex-col items-center gap-1.5 shrink-0">
            <div className="relative">
              <img
                src={avatarSrc(user.avatar)}
                alt={user.name}
                className={`w-24 h-24 sm:w-28 sm:h-28 rounded-full object-cover ring-4 ring-sky-700/30 shadow-lg transition-opacity ${isUploadingAvatar ? 'opacity-50' : ''}`}
                referrerPolicy="no-referrer"
              />
              {isUploadingAvatar && (
                <Loader2 className="absolute inset-0 m-auto w-7 h-7 animate-spin text-sky-700" />
              )}
              <button
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploadingAvatar}
                title="Change profile picture"
                aria-label="Change profile picture"
                className="absolute bottom-0 right-0 p-2 rounded-full bg-sky-700 hover:bg-sky-800 text-white shadow-md ring-2 ring-white dark:ring-stone-900 transition-colors cursor-pointer disabled:opacity-60"
              >
                <Camera className="w-4 h-4" />
              </button>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleAvatarFile}
                className="hidden"
              />
            </div>
            {avatarError && (
              <p className="max-w-[10rem] text-center text-[11px] font-semibold text-rose-600 dark:text-rose-400">{avatarError}</p>
            )}
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex-1 min-w-0">
                {isEditingProfile ? (
                  <input
                    type="text"
                    value={draftName}
                    onChange={e => setDraftName(e.target.value)}
                    maxLength={NAME_MAX}
                    placeholder="Your name"
                    aria-label="Name"
                    className={`${INPUT_CLASS} text-lg font-bold max-w-sm`}
                  />
                ) : (
                  <h1 className="text-2xl sm:text-3xl font-black text-stone-900 dark:text-stone-100 font-serif-heading">
                    {user.name}
                  </h1>
                )}
                <p className="text-xs font-semibold text-sky-700 dark:text-sky-400">
                  @{user.username}
                </p>
              </div>

              <div className="flex items-center justify-center sm:justify-start gap-4 text-xs font-bold text-stone-700 dark:text-stone-300">
                <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                  <span className="text-sky-700 dark:text-sky-400">{user.followersCount}</span> Followers
                </div>
                <div className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800">
                  <span className="text-sky-700 dark:text-sky-400">{user.followingCount}</span> Following
                </div>
                {!isEditingProfile && (
                  <button
                    onClick={startEditingProfile}
                    className="px-3 py-1.5 rounded-xl bg-stone-100 dark:bg-stone-800 hover:bg-stone-200 dark:hover:bg-stone-700 flex items-center gap-1.5 cursor-pointer transition-colors"
                  >
                    <Pencil className="w-3.5 h-3.5" /> Edit Profile
                  </button>
                )}
              </div>
            </div>

            {isEditingProfile ? (
              <div className="space-y-2 max-w-2xl">
                <textarea
                  value={draftBio}
                  onChange={e => setDraftBio(e.target.value)}
                  maxLength={BIO_MAX}
                  rows={3}
                  placeholder="Tell other travelers about yourself"
                  aria-label="Bio"
                  className={`${INPUT_CLASS} text-xs sm:text-sm resize-none`}
                />
                <div className="flex items-center gap-2 text-xs">
                  <button
                    onClick={handleSaveProfile}
                    disabled={isSavingProfile}
                    className="px-4 py-2 rounded-xl font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 flex items-center gap-1.5 cursor-pointer disabled:opacity-60"
                  >
                    {isSavingProfile && <Loader2 className="w-3.5 h-3.5 animate-spin" />} Save
                  </button>
                  <button
                    onClick={() => setIsEditingProfile(false)}
                    disabled={isSavingProfile}
                    className="px-4 py-2 rounded-xl font-bold bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200 dark:hover:bg-stone-700 cursor-pointer disabled:opacity-60"
                  >
                    Cancel
                  </button>
                  <span className="ml-auto text-stone-400">{draftBio.length}/{BIO_MAX}</span>
                </div>
                {profileError && (
                  <p className="text-xs font-semibold text-rose-600 dark:text-rose-400">{profileError}</p>
                )}
              </div>
            ) : (
              <p className="text-xs sm:text-sm text-stone-600 dark:text-stone-300 leading-relaxed max-w-2xl">
                {user.bio || <span className="italic text-stone-400">No bio yet.</span>}
              </p>
            )}

            {/* Quick Country Stats pill */}
            <div className="pt-2 flex flex-wrap items-center justify-center sm:justify-start gap-2 text-xs">
              <span className="px-3 py-1 rounded-full font-bold bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 flex items-center gap-1.5">
                <Globe className="w-3.5 h-3.5" /> {visited.length} Countries Visited ({visitedPercentage}% of Earth)
              </span>

              <span className="px-3 py-1 rounded-full font-bold bg-sky-100 dark:bg-sky-950/80 text-sky-800 dark:text-sky-300 border border-sky-200 dark:border-sky-800 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5" /> {myItineraries.length} Custom Itineraries
              </span>
            </div>

          </div>
        </div>

        {/* Tab Navigation */}
        <div className="flex items-center gap-2 border-t border-stone-100 dark:border-stone-800 pt-4">
          <button
            id="profile-tab-trips"
            onClick={() => setActiveTab('trips')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'trips'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5" /> My Itineraries ({myItineraries.length})
          </button>

          <button
            id="profile-tab-tracker"
            onClick={() => setActiveTab('tracker')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'tracker'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Globe className="w-3.5 h-3.5" /> Visited Country Tracker
          </button>

          <button
            id="profile-tab-achievements"
            onClick={() => setActiveTab('achievements')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'achievements'
                ? 'bg-sky-700 text-white shadow-md shadow-sky-700/20'
                : 'bg-stone-100 dark:bg-stone-800 text-stone-700 dark:text-stone-300 hover:bg-stone-200'
            }`}
          >
            <Award className="w-3.5 h-3.5" /> Achievements ({user.achievements.length})
          </button>
        </div>

      </div>

      {/* Tab Content */}
      {activeTab === 'trips' && (
        <div className="space-y-4">
          <h3 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
            Your Active & Saved Trips
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {myItineraries.map(it => (
              <div
                key={it.id}
                onClick={() => onSelectItinerary(it)}
                className="group editorial-card rounded-3xl overflow-hidden cursor-pointer p-4 space-y-3 hover:shadow-lg transition-all"
              >
                <img
                  src={it.coverImage}
                  alt={it.title}
                  className="w-full h-36 object-cover rounded-2xl group-hover:scale-105 transition-transform"
                  referrerPolicy="no-referrer"
                />
                <div className="space-y-1">
                  <div className="flex items-center justify-between text-xs font-bold text-sky-700 dark:text-sky-400">
                    <span>{it.flagEmoji} {it.destination}</span>
                    <span>{it.durationDays} Days</span>
                  </div>
                  <h4 className="text-sm font-bold text-stone-900 dark:text-stone-100 line-clamp-1 font-serif-heading">
                    {it.title}
                  </h4>
                  <p className="text-xs text-stone-500 dark:text-stone-400 line-clamp-2 leading-relaxed">
                    {it.summary}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'tracker' && (
        <div className="p-6 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-xl space-y-6">
          
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-stone-900 dark:text-stone-100 font-serif-heading flex items-center gap-2">
              <Globe className="w-5 h-5 text-emerald-600" /> Interactive Visited Countries Tracker
            </h3>
            <p className="text-xs text-stone-500 dark:text-stone-400">
              Click a country on the map or a chip below to mark it as visited. Your globe stats update dynamically!
            </p>

            {/* Progress Bar */}
            <div className="w-full bg-stone-100 dark:bg-stone-800 h-3 rounded-full overflow-hidden mt-3">
              <div
                className="bg-gradient-to-r from-emerald-600 to-sky-600 h-full transition-all duration-500 rounded-full"
                style={{ width: `${Math.min(100, Number(visitedPercentage) * 5)}%` }}
              />
            </div>
          </div>

          <LazyCountryTrackerMap visited={visited} onToggleCountry={toggleVisitedCountry} height="420px" />

          {/* Add Custom Country Input */}
          <div className="flex items-center gap-2 max-w-md">
            <input
              type="text"
              value={newCountryInput}
              onChange={e => setNewCountryInput(e.target.value)}
              maxLength={60}
              onKeyDown={e => { if (e.key === 'Enter') handleAddCustomCountry(); }}
              placeholder="Add another country name..."
              className="flex-1 px-3 py-2 rounded-xl bg-stone-50 dark:bg-stone-800 border border-stone-200 dark:border-stone-700 text-xs text-stone-900 dark:text-stone-100 focus:outline-none focus:ring-2 focus:ring-emerald-500/40"
            />
            <button
              onClick={handleAddCustomCountry}
              className="px-4 py-2 rounded-xl text-xs font-bold bg-emerald-700 text-white shadow-md hover:bg-emerald-800 transition-colors cursor-pointer"
            >
              Add
            </button>
          </div>

          {/* Country Selection Chips */}
          <div className="flex flex-wrap gap-2">
            {ALL_POPULAR_COUNTRIES.map(c => {
              const isChecked = visited.includes(c);
              return (
                <button
                  key={c}
                  onClick={() => toggleVisitedCountry(c)}
                  className={`px-3.5 py-2 rounded-2xl text-xs font-bold transition-all flex items-center gap-2 cursor-pointer ${
                    isChecked
                      ? 'bg-emerald-700 text-white shadow-md shadow-emerald-700/20'
                      : 'bg-stone-100 dark:bg-stone-800 text-stone-600 dark:text-stone-400 hover:bg-stone-200 dark:hover:bg-stone-700'
                  }`}
                >
                  <CheckCircle2 className={`w-4 h-4 ${isChecked ? 'text-white' : 'text-stone-300'}`} />
                  {c}
                </button>
              );
            })}
          </div>

        </div>
      )}

      {activeTab === 'achievements' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {user.achievements.map(ach => (
            <div
              key={ach.id}
              className="p-5 rounded-3xl bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 shadow-md flex items-center gap-4"
            >
              <div className="w-14 h-14 rounded-2xl bg-amber-100 dark:bg-amber-950/80 border border-amber-300/80 dark:border-amber-800 flex items-center justify-center text-3xl shadow-inner shrink-0">
                {ach.icon}
              </div>
              <div className="space-y-1">
                <h4 className="text-base font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
                  {ach.title}
                </h4>
                <p className="text-xs text-stone-500 dark:text-stone-400">
                  {ach.description}
                </p>
                {ach.unlockedAt && (
                  <span className="text-[10px] font-semibold text-emerald-700 dark:text-emerald-400 block pt-1">
                    Unlocked on {ach.unlockedAt}
                  </span>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
};
