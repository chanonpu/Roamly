import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { ArrowLeft, AlertTriangle, LogIn, Compass } from 'lucide-react';

import { Navbar } from './components/Navbar';
import { DiscoverView } from './components/DiscoverView';
import { CommunityFeed } from './components/CommunityFeed';
import { TripPlannerWizard } from './components/TripPlannerWizard';
import { ItineraryView } from './components/ItineraryView';
import { UserProfileView } from './components/UserProfileView';
import { DestinationModal } from './components/DestinationModal';
import { PackingChecklistModal } from './components/PackingChecklistModal';
import { AiTravelAssistant } from './components/AiTravelAssistant';
import { TravelWarningDialog } from './components/TravelWarningDialog';
import { DocumentationModal } from './components/DocumentationModal';
import { AuthModal } from './components/AuthModal';

import { api, setAccessToken } from './lib/api';
import { track } from './lib/analytics';
import { useAuth } from './hooks/useAuth';
import {
  Destination, TravelItinerary, UserProfile, Currency,
  GenerateTripRequest, TravelWarning, PackingItem,
} from './types/travel';
import { DESTINATIONS, INITIAL_ITINERARIES, CURRENCIES, TRAVEL_WARNINGS } from './data/mockData';

type Tab = 'discover' | 'community' | 'plan' | 'profile';

export default function App() {
  const auth = useAuth();

  // ---- Navigation / display prefs ----
  const [activeTab, setActiveTabState] = useState<Tab>('discover');
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // ---- Server-backed public data. Seeded with mock data so the first paint
  // is instant; replaced in-place once the API responds. ----
  const [destinations, setDestinations] = useState<Destination[]>(DESTINATIONS);
  const [currencies, setCurrencies] = useState<Currency[]>(CURRENCIES);
  const [itineraries, setItineraries] = useState<TravelItinerary[]>(INITIAL_ITINERARIES);
  const [apiOffline, setApiOffline] = useState(false);

  // ---- Account-scoped data — only meaningful once signed in ----
  const [currentUser, setCurrentUser] = useState<UserProfile | null>(null);
  const [myItineraries, setMyItineraries] = useState<TravelItinerary[]>([]);
  const [savedItineraries, setSavedItineraries] = useState<TravelItinerary[]>([]);

  // ---- Selection / modal state ----
  const [selectedItinerary, setSelectedItineraryState] = useState<TravelItinerary | null>(null);
  const [selectedDestination, setSelectedDestinationState] = useState<Destination | null>(null);
  const [packingModalItinerary, setPackingModalItinerary] = useState<TravelItinerary | null>(null);
  const [isAiChatOpen, setIsAiChatOpen] = useState(false);
  const [isDocsOpen, setIsDocsOpen] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const [activeWarning, setActiveWarning] = useState<TravelWarning | null>(null);
  const [pendingDestination, setPendingDestination] = useState<Destination | null>(null);

  const [wizardPreselectedDestination, setWizardPreselectedDestination] = useState('');
  const [communityInitialSearch, setCommunityInitialSearch] = useState<string | undefined>(undefined);
  const [isGenerating, setIsGenerating] = useState(false);
  const [actionError, setActionError] = useState('');

  // ---- Keep the API client's Authorization header in sync with the
  // current Supabase session ----
  useEffect(() => {
    setAccessToken(auth.accessToken);
  }, [auth.accessToken]);

  // ---- Public data load (always, regardless of auth) ----
  useEffect(() => {
    let cancelled = false;
    Promise.allSettled([api.getDestinations(), api.getCurrencies(), api.getItineraries()])
      .then(([destRes, currRes, itinRes]) => {
        if (cancelled) return;
        let anySucceeded = false;
        if (destRes.status === 'fulfilled') { setDestinations(destRes.value); anySucceeded = true; }
        if (currRes.status === 'fulfilled') { setCurrencies(currRes.value); anySucceeded = true; }
        if (itinRes.status === 'fulfilled') { setItineraries(itinRes.value); anySucceeded = true; }
        setApiOffline(!anySucceeded);
      });
    return () => { cancelled = true; };
  }, []);

  // ---- Account data load — re-runs whenever sign-in state changes ----
  useEffect(() => {
    if (auth.loading) return; // wait for Supabase to resolve the initial session

    if (!auth.isSignedIn) {
      setCurrentUser(null);
      setMyItineraries([]);
      setSavedItineraries([]);
      return;
    }

    let cancelled = false;
    Promise.allSettled([api.getCurrentUser(), api.getMyItineraries(), api.getSavedItineraries()])
      .then(([userRes, mineRes, savedRes]) => {
        if (cancelled) return;
        if (userRes.status === 'fulfilled') setCurrentUser(userRes.value);
        if (mineRes.status === 'fulfilled') setMyItineraries(mineRes.value);
        if (savedRes.status === 'fulfilled') setSavedItineraries(savedRes.value);
      });
    return () => { cancelled = true; };
  }, [auth.isSignedIn, auth.loading]);

  // ---- Dark mode ----
  useEffect(() => {
    document.documentElement.classList.toggle('dark', isDarkMode);
  }, [isDarkMode]);

  // ---- Keep every list + the currently-open views in sync after a mutation ----
  const syncItinerary = useCallback((updated: TravelItinerary) => {
    setItineraries(prev => prev.some(x => x.id === updated.id)
      ? prev.map(x => (x.id === updated.id ? updated : x))
      : [updated, ...prev]);

    setMyItineraries(prev => {
      const isMine = currentUser !== null && updated.creatorId === currentUser.id;
      if (!isMine) return prev.filter(x => x.id !== updated.id);
      return prev.some(x => x.id === updated.id)
        ? prev.map(x => (x.id === updated.id ? updated : x))
        : [updated, ...prev];
    });

    setSavedItineraries(prev => prev.map(x => (x.id === updated.id ? updated : x)));
    setSelectedItineraryState(prev => (prev && prev.id === updated.id ? updated : prev));
    setPackingModalItinerary(prev => (prev && prev.id === updated.id ? updated : prev));
  }, [currentUser]);

  const destinationsList = useMemo(
    () => destinations.map(d => ({ city: d.city, country: d.country })),
    [destinations]
  );

  const isOwnerOfSelected = !!currentUser && !!selectedItinerary && selectedItinerary.creatorId === currentUser.id;

  // ---- Navigation handlers (tracked for the future dashboard) ----
  const setActiveTab = useCallback((tab: string) => {
    setSelectedItineraryState(null);
    setActiveTabState(tab as Tab);
    track('page_view', { tab });
  }, []);

  const selectItinerary = useCallback((it: TravelItinerary | null) => {
    setSelectedItineraryState(it);
    if (it) track('itinerary_view', { itineraryId: it.id, destination: it.destination });
  }, []);

  const selectDestination = useCallback((dest: Destination | null) => {
    setSelectedDestinationState(dest);
    if (dest) track('destination_view', { destinationId: dest.id, city: dest.city, country: dest.country });
  }, []);

  const requireAuth = useCallback(() => setIsAuthModalOpen(true), []);

  // ---- Handlers ----
  const handleSearchSelectDestination = useCallback((cityName: string) => {
    const found = destinations.find(d => d.city.toLowerCase() === cityName.toLowerCase());
    if (found) selectDestination(found);
    setSearchQuery('');
  }, [destinations, selectDestination]);

  const handleStartPlanning = useCallback((destination: Destination) => {
    if (destination.hasWarning && destination.warningKey && TRAVEL_WARNINGS[destination.warningKey]) {
      setPendingDestination(destination);
      setActiveWarning(TRAVEL_WARNINGS[destination.warningKey]);
      return;
    }
    setWizardPreselectedDestination(`${destination.city}, ${destination.country}`);
    setActiveTab('plan');
  }, [setActiveTab]);

  const handleConfirmWarning = useCallback(() => {
    if (pendingDestination) {
      setWizardPreselectedDestination(`${pendingDestination.city}, ${pendingDestination.country}`);
      setActiveTab('plan');
    }
    setActiveWarning(null);
    setPendingDestination(null);
  }, [pendingDestination, setActiveTab]);

  const handleCancelWarning = useCallback(() => {
    setActiveWarning(null);
    setPendingDestination(null);
    setActiveTab('discover');
  }, [setActiveTab]);

  const handleBrowseCommunityForDest = useCallback((cityName: string) => {
    setCommunityInitialSearch(cityName);
    setActiveTab('community');
  }, [setActiveTab]);

  const handleOpenWizardWithDest = useCallback((cityName: string) => {
    setWizardPreselectedDestination(cityName);
    setActiveTab('plan');
  }, [setActiveTab]);

  const handleGenerateTrip = useCallback(async (req: GenerateTripRequest) => {
    if (!auth.isSignedIn) { requireAuth(); return; }
    setIsGenerating(true);
    setActionError('');
    try {
      const { itinerary } = await api.generateItinerary(req);
      syncItinerary(itinerary);
      selectItinerary(itinerary);
    } catch (err) {
      setActionError("Couldn't generate a trip — check that the backend is running, then try again.");
    } finally {
      setIsGenerating(false);
    }
  }, [auth.isSignedIn, requireAuth, syncItinerary, selectItinerary]);

  const handleForkItinerary = useCallback(async (it: TravelItinerary) => {
    if (!auth.isSignedIn) { requireAuth(); return; }
    try {
      const forked = await api.forkItinerary(it.id);
      syncItinerary(forked);
      selectItinerary(forked);
    } catch (err) {
      setActionError("Couldn't fork this itinerary — check that the backend is running.");
    }
  }, [auth.isSignedIn, requireAuth, syncItinerary, selectItinerary]);

  const handleDuplicateItinerary = useCallback(async (it: TravelItinerary) => {
    if (!auth.isSignedIn) { requireAuth(); return; }
    try {
      const dup = await api.duplicateItinerary(it.id);
      syncItinerary(dup);
      selectItinerary(dup);
    } catch (err) {
      setActionError("Couldn't duplicate this itinerary — check that the backend is running.");
    }
  }, [auth.isSignedIn, requireAuth, syncItinerary, selectItinerary]);

  const handleUpdatePackingList = useCallback(async (newList: PackingItem[]) => {
    if (!packingModalItinerary || !auth.isSignedIn) return;
    const optimistic = { ...packingModalItinerary, packingList: newList };
    syncItinerary(optimistic);
    try {
      const saved = await api.updatePackingList(packingModalItinerary.id, newList);
      syncItinerary(saved);
    } catch (err) {
      setActionError("Packing list changes couldn't be saved to the server.");
    }
  }, [packingModalItinerary, auth.isSignedIn, syncItinerary]);

  const handleUpdateVisitedCountries = useCallback(async (countries: string[]) => {
    if (!auth.isSignedIn) return;
    setCurrentUser(prev => (prev ? { ...prev, visitedCountries: countries } : prev));
    try {
      const saved = await api.updateCurrentUser({ visitedCountries: countries });
      setCurrentUser(saved);
    } catch (err) {
      setActionError("Couldn't save your visited-countries update to the server.");
    }
  }, [auth.isSignedIn]);

  const handleSignOut = useCallback(async () => {
    await auth.signOut();
    setActiveTabState('discover');
    setSelectedItineraryState(null);
  }, [auth]);

  const handleOpenDocs = useCallback(() => setIsDocsOpen(true), []);
  const handleOpenAiChat = useCallback(() => setIsAiChatOpen(true), []);

  return (
    <div className="min-h-screen bg-stone-50 dark:bg-stone-950 text-stone-900 dark:text-stone-100 transition-colors">
      <Navbar
        activeTab={selectedItinerary ? '' : activeTab}
        setActiveTab={setActiveTab}
        selectedCurrency={selectedCurrency}
        setSelectedCurrency={setSelectedCurrency}
        isDarkMode={isDarkMode}
        setIsDarkMode={setIsDarkMode}
        searchQuery={searchQuery}
        setSearchQuery={setSearchQuery}
        onOpenAiChat={handleOpenAiChat}
        onOpenDocs={handleOpenDocs}
        onSearchSelectDestination={handleSearchSelectDestination}
        destinationsList={destinationsList}
        currencies={currencies}
        isSignedIn={auth.isSignedIn}
        userName={currentUser?.name ?? auth.user?.email ?? 'Traveler'}
        userAvatar={currentUser?.avatar ?? ''}
        onOpenAuth={() => setIsAuthModalOpen(true)}
        onSignOut={handleSignOut}
      />

      <main>
        {apiOffline && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-3 rounded-xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-xs font-semibold text-amber-800 dark:text-amber-300 flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              Showing offline demo data — the Roamly API isn't reachable. Start it with <code className="mx-1 px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 font-mono">npm run dev</code> in <code className="px-1.5 py-0.5 rounded bg-amber-100 dark:bg-amber-900 font-mono">roamly-backend</code>.
            </div>
          </div>
        )}

        {actionError && (
          <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4">
            <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/60 border border-rose-200 dark:border-rose-800 text-xs font-semibold text-rose-800 dark:text-rose-300 flex items-center justify-between gap-2">
              <span className="flex items-center gap-2"><AlertTriangle className="w-4 h-4 shrink-0" /> {actionError}</span>
              <button onClick={() => setActionError('')} className="text-rose-600 hover:text-rose-800 cursor-pointer font-bold">✕</button>
            </div>
          </div>
        )}

        {selectedItinerary ? (
          <div>
            <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-6">
              <button
                onClick={() => selectItinerary(null)}
                className="flex items-center gap-1.5 text-xs font-bold text-sky-700 dark:text-sky-400 hover:underline cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" /> Back to {activeTab === 'plan' ? 'Trip Planner' : activeTab === 'profile' ? 'My Profile' : activeTab === 'community' ? 'Community' : 'Discover'}
              </button>
            </div>
            <ItineraryView
              itinerary={selectedItinerary}
              currency={selectedCurrency}
              onUpdateItinerary={syncItinerary}
              onForkItinerary={handleForkItinerary}
              onOpenPackingList={setPackingModalItinerary}
              onDuplicateItinerary={handleDuplicateItinerary}
              isSignedIn={auth.isSignedIn}
              isOwner={isOwnerOfSelected}
              onRequireAuth={requireAuth}
            />
          </div>
        ) : (
          <>
            {activeTab === 'discover' && (
              <DiscoverView
                destinations={destinations}
                currency={selectedCurrency}
                searchQuery={searchQuery}
                onSelectDestination={selectDestination}
                visitedCountries={auth.isSignedIn ? currentUser?.visitedCountries : undefined}
              />
            )}

            {activeTab === 'community' && (
              <CommunityFeed
                itineraries={itineraries}
                currency={selectedCurrency}
                onSelectItinerary={selectItinerary}
                onForkItinerary={handleForkItinerary}
                onOpenWizardWithDest={handleOpenWizardWithDest}
                initialSearch={communityInitialSearch}
              />
            )}

            {activeTab === 'plan' && (
              <TripPlannerWizard
                onGenerateTrip={handleGenerateTrip}
                onBrowseCommunity={() => setActiveTab('community')}
                isGenerating={isGenerating}
                preselectedDestination={wizardPreselectedDestination}
              />
            )}

            {activeTab === 'profile' && (
              auth.isSignedIn && currentUser ? (
                <UserProfileView
                  user={currentUser}
                  myItineraries={myItineraries}
                  savedItineraries={savedItineraries}
                  currency={selectedCurrency}
                  onSelectItinerary={selectItinerary}
                  onUpdateVisitedCountries={handleUpdateVisitedCountries}
                />
              ) : (
                <div className="max-w-md mx-auto py-24 px-4 text-center space-y-4">
                  <div className="w-14 h-14 mx-auto rounded-2xl bg-sky-100 dark:bg-sky-950/80 text-sky-700 dark:text-sky-400 flex items-center justify-center">
                    <Compass className="w-7 h-7" />
                  </div>
                  <h2 className="text-lg font-bold text-stone-900 dark:text-stone-100 font-serif-heading">
                    Sign in to see your profile
                  </h2>
                  <p className="text-sm text-stone-500 dark:text-stone-400">
                    Your itineraries, saved trips, and visited-countries tracker live here once you're signed in.
                  </p>
                  <button
                    onClick={() => setIsAuthModalOpen(true)}
                    className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-bold bg-sky-700 hover:bg-sky-800 text-white shadow-md shadow-sky-700/20 transition-all cursor-pointer"
                  >
                    <LogIn className="w-4 h-4" /> Sign In / Sign Up
                  </button>
                </div>
              )
            )}
          </>
        )}
      </main>

      <DestinationModal
        destination={selectedDestination}
        onClose={() => setSelectedDestinationState(null)}
        onStartPlanning={handleStartPlanning}
        onBrowseCommunityForDest={handleBrowseCommunityForDest}
      />

      <PackingChecklistModal
        isOpen={packingModalItinerary !== null}
        onClose={() => setPackingModalItinerary(null)}
        packingList={packingModalItinerary?.packingList ?? []}
        onUpdateList={handleUpdatePackingList}
        destinationName={packingModalItinerary?.destination ?? ''}
      />

      <AiTravelAssistant
        isOpen={isAiChatOpen}
        onClose={() => setIsAiChatOpen(false)}
        destinationContext={selectedItinerary?.destination || selectedDestination?.city}
      />

      <TravelWarningDialog
        warning={activeWarning}
        onConfirm={handleConfirmWarning}
        onCancel={handleCancelWarning}
      />

      <DocumentationModal isOpen={isDocsOpen} onClose={() => setIsDocsOpen(false)} />

      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onSignIn={auth.signIn}
        onSignUp={auth.signUp}
        onSignInWithGoogle={auth.signInWithGoogle}
      />
    </div>
  );
}
