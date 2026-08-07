import React, { useEffect, useMemo, useState } from 'react';
import { Compass, MapPin, Sparkles, User, Sun, Moon, Search, BookOpen, Layers, DollarSign, Bot, LogOut } from 'lucide-react';
import { Currency } from '../types/travel';
import { useDebouncedValue } from '../hooks/useDebouncedValue';
import { track } from '../lib/analytics';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  selectedCurrency: Currency;
  setSelectedCurrency: (currency: Currency) => void;
  isDarkMode: boolean;
  setIsDarkMode: (val: boolean) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onOpenAiChat: () => void;
  onOpenDocs: () => void;
  onSearchSelectDestination: (destinationName: string) => void;
  destinationsList: { city: string; country: string }[];
  currencies: Currency[];
  isSignedIn: boolean;
  userName: string;
  userAvatar: string;
  onOpenAuth: () => void;
  onSignOut: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  selectedCurrency,
  setSelectedCurrency,
  isDarkMode,
  setIsDarkMode,
  searchQuery,
  setSearchQuery,
  onOpenAiChat,
  onOpenDocs,
  onSearchSelectDestination,
  destinationsList,
  currencies,
  isSignedIn,
  userName,
  userAvatar,
  onOpenAuth,
  onSignOut
}) => {
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);

  // The input stays instantly responsive (searchQuery updates every
  // keystroke, so typing never feels laggy); only the *filtering* work is
  // debounced, since that's the part that would otherwise re-run and
  // re-render the dropdown on every single keypress.
  const debouncedQuery = useDebouncedValue(searchQuery, 150);

  const filteredSearchList = useMemo(() => {
    const q = debouncedQuery.trim().toLowerCase();
    if (!q) return [];
    return destinationsList.filter(d =>
      d.city.toLowerCase().includes(q) || d.country.toLowerCase().includes(q)
    );
  }, [destinationsList, debouncedQuery]);

  // Log the search once it's settled (debounced value), not on every
  // keystroke — this is what feeds the future dashboard's search-terms view.
  useEffect(() => {
    const q = debouncedQuery.trim();
    if (q) track('search', { query: q, context: 'navbar', resultsCount: filteredSearchList.length });
  }, [debouncedQuery, filteredSearchList.length]);

  return (
    <header id="main-header" className="sticky top-0 z-40 w-full glass-panel border-b border-stone-200/80 dark:border-stone-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">


        <div
          id="brand-logo"
          className="flex items-center gap-2.5 cursor-pointer group"
          onClick={() => setActiveTab('discover')}
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-600 via-sky-700 to-sky-900 flex items-center justify-center text-white shadow-md shadow-sky-600/20 group-hover:scale-105 transition-transform duration-200">
            <Compass className="w-6 h-6 animate-spin-slow" />
          </div>
          <div>
            <span className="text-2xl font-bold tracking-tight font-serif-heading text-stone-900 dark:text-stone-100">
              Roamly
            </span>
            <span className="hidden sm:inline-block text-[10px] font-bold uppercase tracking-widest text-sky-700 dark:text-sky-400 ml-2 px-2 py-0.5 rounded-full bg-sky-100/80 dark:bg-sky-950/80 border border-sky-200 dark:border-sky-800">
              Editorial Planner
            </span>
          </div>
        </div>

        <div className="relative flex-1 max-w-md hidden md:block" id="nav-search-container">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400" />
            <input
              type="text"
              id="global-search-input"
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setShowSearchDropdown(true);
              }}
              onFocus={() => setShowSearchDropdown(true)}
              onBlur={() => setTimeout(() => setShowSearchDropdown(false), 200)}
              placeholder="Search Tokyo, Paris, Iceland, Sydney..."
              className="w-full pl-9 pr-4 py-1.5 text-sm rounded-full bg-white/80 dark:bg-stone-900/90 border border-stone-300/80 dark:border-stone-700 text-stone-800 dark:text-stone-100 placeholder-stone-400 focus:outline-none focus:ring-2 focus:ring-sky-600/40 transition-all shadow-xs"
            />
          </div>

          {showSearchDropdown && filteredSearchList.length > 0 && (
            <div id="search-autocomplete-dropdown" className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl shadow-xl z-50 overflow-hidden py-1">
              <div className="px-3 py-1.5 text-xs font-semibold text-stone-400 uppercase tracking-wider">Destinations</div>
              {filteredSearchList.map((d, i) => (
                <button
                  key={i}
                  id={`search-item-${i}`}
                  className="w-full px-3 py-2 text-left text-sm hover:bg-sky-50 dark:hover:bg-stone-800 flex items-center justify-between transition-colors"
                  onClick={() => {
                    onSearchSelectDestination(d.city);
                    setSearchQuery('');
                    setShowSearchDropdown(false);
                  }}
                >
                  <span className="flex items-center gap-2 text-stone-700 dark:text-stone-200 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-sky-600" /> {d.city}
                  </span>
                  <span className="text-xs text-stone-400">{d.country}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        <nav className="hidden lg:flex items-center gap-1 bg-stone-200/50 dark:bg-stone-900/80 p-1 rounded-full border border-stone-300/60 dark:border-stone-800" id="desktop-nav">
          <button
            id="nav-tab-discover"
            onClick={() => setActiveTab('discover')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'discover'
                ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-400 shadow-xs border border-stone-200/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Compass className="w-3.5 h-3.5" />
            Discover
          </button>

          <button
            id="nav-tab-community"
            onClick={() => setActiveTab('community')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'community'
                ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-400 shadow-xs border border-stone-200/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            Explore Plans
          </button>

          <button
            id="nav-tab-plan"
            onClick={() => setActiveTab('plan')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-bold transition-all flex items-center gap-1.5 ${
              activeTab === 'plan'
                ? 'bg-sky-700 text-white shadow-sm'
                : 'text-sky-700 dark:text-sky-400 hover:bg-sky-100/60 dark:hover:bg-sky-950/40'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5" />
            Generate Trip
          </button>

          <button
            id="nav-tab-profile"
            onClick={() => setActiveTab('profile')}
            className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
              activeTab === 'profile'
                ? 'bg-white dark:bg-stone-800 text-sky-700 dark:text-sky-400 shadow-xs border border-stone-200/60 dark:border-stone-700'
                : 'text-stone-600 dark:text-stone-400 hover:text-stone-900 dark:hover:text-white'
            }`}
          >
            <User className="w-3.5 h-3.5" />
            My Profile
          </button>
        </nav>

        <div className="flex items-center gap-2" id="header-actions">
          <button
            id="ai-assistant-btn"
            onClick={onOpenAiChat}
            className="p-2 rounded-full text-stone-600 dark:text-stone-300 hover:text-sky-700 dark:hover:text-sky-400 hover:bg-stone-200/60 dark:hover:bg-stone-800 transition-colors relative"
            title="Ask Roamly AI Travel Concierge"
          >
            <Bot className="w-5 h-5 text-sky-600 animate-pulse" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-emerald-600"></span>
          </button>

          <div className="relative" id="currency-selector-wrapper">
            <select
              id="currency-select"
              value={selectedCurrency.code}
              onChange={(e) => {
                const found = currencies.find(c => c.code === e.target.value);
                if (found) setSelectedCurrency(found);
              }}
              className="appearance-none bg-stone-100 dark:bg-stone-800 border border-stone-300/80 dark:border-stone-700 text-xs font-semibold text-stone-700 dark:text-stone-200 py-1.5 pl-2.5 pr-6 rounded-lg cursor-pointer focus:outline-none focus:ring-1 focus:ring-sky-600"
            >
              {currencies.map((c) => (
                <option key={c.code} value={c.code}>
                  {c.symbol} {c.code}
                </option>
              ))}
            </select>
            <DollarSign className="w-3 h-3 text-stone-400 absolute right-1.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>

          <button
            id="open-docs-btn"
            onClick={onOpenDocs}
            className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-stone-800 dark:hover:text-stone-100 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title="System & API Architecture Specs"
          >
            <BookOpen className="w-4 h-4" />
          </button>

          <button
            id="dark-mode-toggle-btn"
            onClick={() => setIsDarkMode(!isDarkMode)}
            className="p-2 rounded-lg text-stone-500 dark:text-stone-400 hover:text-sky-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors"
            title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          >
            {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-stone-600" />}
          </button>

          {isSignedIn ? (
            <div className="flex items-center gap-1 pl-2 border-l border-stone-200 dark:border-stone-800">
              <div
                id="user-profile-badge"
                className="flex items-center gap-2 cursor-pointer"
                onClick={() => setActiveTab('profile')}
                title={userName}
              >
                <img
                  src={userAvatar || 'https://api.dicebear.com/7.x/initials/svg?seed=' + encodeURIComponent(userName)}
                  alt={userName}
                  className="w-8 h-8 rounded-full object-cover ring-2 ring-sky-600/30 hover:ring-sky-600 transition-all"
                  referrerPolicy="no-referrer"
                />
              </div>
              <button
                onClick={onSignOut}
                className="p-2 rounded-lg text-stone-400 hover:text-rose-600 hover:bg-stone-100 dark:hover:bg-stone-800 transition-colors cursor-pointer"
                title="Sign out"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          ) : (
            <button
              id="sign-in-btn"
              onClick={onOpenAuth}
              className="ml-1 px-3.5 py-1.5 rounded-full text-xs font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-sm transition-all cursor-pointer"
            >
              Sign In
            </button>
          )}
        </div>
      </div>

      <div className="lg:hidden flex items-center justify-around py-2 px-2 border-t border-stone-200/80 dark:border-stone-800/80 bg-white/95 dark:bg-stone-900/95" id="mobile-nav">
        <button id="mobile-tab-discover" onClick={() => setActiveTab('discover')} className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'discover' ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-stone-500'}`}>
          <Compass className="w-4 h-4" />
          Discover
        </button>

        <button id="mobile-tab-community" onClick={() => setActiveTab('community')} className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'community' ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-stone-500'}`}>
          <Layers className="w-4 h-4" />
          Plans
        </button>

        <button id="mobile-tab-plan" onClick={() => setActiveTab('plan')} className="flex flex-col items-center text-[10px] font-bold text-sky-700 dark:text-sky-400">
          <div className="p-1 rounded-full bg-sky-700 text-white">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
          Generate
        </button>

        <button id="mobile-tab-profile" onClick={() => setActiveTab('profile')} className={`flex flex-col items-center text-[10px] font-medium ${activeTab === 'profile' ? 'text-sky-700 dark:text-sky-400 font-bold' : 'text-stone-500'}`}>
          <User className="w-4 h-4" />
          Profile
        </button>
      </div>
    </header>
  );
};
