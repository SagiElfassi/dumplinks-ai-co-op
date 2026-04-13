import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { CardGrid } from './components/CardGrid';
import { processLink, parseSearchQuery, getCards, addCard, updateCard, deleteCard } from './services/dataService';
import type { CardData, SearchFilters, CardType, User, GroupByOption } from './types';
import { CardModal } from './components/CardModal';
import * as authService from './services/authService';
import { LandingPage } from './components/LandingPage';
import { ProfileModal } from './components/ProfileModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';
import { AddLinkModal } from './components/AddLinkModal';

const CARDS_PER_PAGE = 8;

function getGreeting(name?: string): string {
  const hour = new Date().getHours();
  const timeOfDay = hour < 12 ? 'morning' : hour < 17 ? 'afternoon' : 'evening';
  const firstName = name?.split(' ')[0] || name || 'there';
  return `Good ${timeOfDay}, ${firstName}`;
}

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
  }, []);

  const [allCards, setAllCards] = useState<CardData[]>([]);
  const [visibleCardCount, setVisibleCardCount] = useState(CARDS_PER_PAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [smartFilters, setSmartFilters] = useState<SearchFilters | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [isAddLinkOpen, setIsAddLinkOpen] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'info', isVisible: false,
  });

  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser) {
      getCards().then(setAllCards).catch(() => showToast('Failed to load cards', 'error'));
    }
  }, [currentUser]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const closeToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
        setIsProfileModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
        setIsAddLinkOpen(false);
      }
      if ((event.metaKey || event.ctrlKey) && event.key === 'k') {
        event.preventDefault();
        searchInputRef.current?.focus();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  const handleLogin = (user: User) => setCurrentUser(user);
  const handleRegister = (user: User) => setCurrentUser(user);

  const handleLogout = () => {
    authService.logout();
    setCurrentUser(null);
    setAllCards([]);
  };

  const handleProfileSave = async (updatedData: Partial<User>) => {
    setIsSavingProfile(true);
    try {
      const updatedUser = await authService.updateUser(updatedData);
      setCurrentUser(updatedUser);
      setIsProfileModalOpen(false);
      showToast('Profile updated successfully', 'success');
    } catch {
      showToast('Failed to update profile', 'error');
    } finally {
      setIsSavingProfile(false);
    }
  };

  const handleAccountDelete = async () => {
    setIsDeletingAccount(true);
    try {
      await authService.deleteAccount();
      setIsConfirmDeleteModalOpen(false);
      handleLogout();
    } catch {
      showToast('Failed to delete account', 'error');
    } finally {
      setIsDeletingAccount(false);
    }
  };

  const handleAddLink = async (url: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const newCardData = await processLink(url);
      const saved = await addCard({ ...newCardData, id: Date.now().toString(), date: new Date().toISOString() });
      setAllCards(prev => [saved, ...prev]);
      setIsAddLinkOpen(false);
      showToast('Link dumped successfully!', 'success');
    } catch {
      setError('Failed to process the link. Please try a different URL.');
      showToast('Failed to process link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const parsePrice = (priceStr?: string): number | null => {
    if (!priceStr) return null;
    const num = parseFloat(priceStr.replace(/[^0-9.]/g, ''));
    return isNaN(num) ? null : num;
  };

  const filteredCards = useMemo(() => {
    let filtered = allCards;

    if (smartFilters) {
      filtered = filtered.filter(card => {
        const { cardTypes, intents, tags, searchTerm, dateRange, priceRange, rating } = smartFilters;
        if (cardTypes?.length && !cardTypes.includes(card.cardType)) return false;
        if (intents?.length && !intents.includes(card.intent)) return false;
        if (tags?.length && !tags.some(t => card.tags.includes(t))) return false;
        if (searchTerm) {
          const term = searchTerm.toLowerCase();
          if (!card.title.toLowerCase().includes(term) && !card.description.toLowerCase().includes(term) && !card.tags.some(t => t.toLowerCase().includes(term))) return false;
        }
        if (dateRange) {
          const cardDate = new Date(card.date);
          if (dateRange.start && cardDate < new Date(dateRange.start)) return false;
          if (dateRange.end && cardDate > new Date(dateRange.end)) return false;
        }
        if (priceRange && card.shoppingDetails) {
          const price = parsePrice(card.shoppingDetails.price);
          if (price === null) return false;
          if (priceRange.min && price < priceRange.min) return false;
          if (priceRange.max && price > priceRange.max) return false;
        }
        if (rating?.min) {
          const cardRating = card.shoppingDetails?.rating ?? card.travelDetails?.rating ?? card.restaurantDetails?.rating;
          if (!cardRating || cardRating < rating.min) return false;
        }
        return true;
      });
    } else if (activeCardType) {
      filtered = filtered.filter(card => card.cardType === activeCardType);
    }

    if (showFavoritesOnly) filtered = filtered.filter(card => card.isFavorite);

    return [...filtered].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  }, [allCards, smartFilters, activeCardType, showFavoritesOnly]);

  const visibleCards = useMemo(() => {
    if (!activeCardType && !smartFilters && !showFavoritesOnly) return filteredCards;
    return filteredCards.slice(0, visibleCardCount);
  }, [filteredCards, visibleCardCount, activeCardType, smartFilters, showFavoritesOnly]);

  const hasMoreCards = visibleCards.length < filteredCards.length;
  const isEndlessScrollActive = !!activeCardType || !!smartFilters || showFavoritesOnly;

  const handleLoadMore = () => {
    if (isFetchingMore || !hasMoreCards || !isEndlessScrollActive) return;
    setIsFetchingMore(true);
    setTimeout(() => { setVisibleCardCount(prev => prev + CARDS_PER_PAGE); setIsFetchingMore(false); }, 1000);
  };

  const handleSearch = async (query: string) => {
    if (!query.trim()) return;
    setIsSearching(true);
    setError(null);
    setActiveSearchQuery(query);
    setActiveCardType(null);
    setShowFavoritesOnly(false);
    try {
      const filters = await parseSearchQuery(query);
      setSmartFilters(filters);
    } catch {
      setError("Sorry, I couldn't process that search.");
      setSmartFilters(null);
      setActiveSearchQuery(null);
      showToast('Search failed', 'error');
    } finally {
      setIsSearching(false);
    }
  };

  const clearSearch = () => {
    setSmartFilters(null);
    setActiveSearchQuery(null);
    setSearchQuery('');
    setError(null);
    setVisibleCardCount(CARDS_PER_PAGE);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    handleSearch(searchQuery);
  };

  const handleCardTypeClick = (cardType: CardType | null) => {
    clearSearch();
    setActiveCardType(prev => prev === cardType ? null : cardType);
    setVisibleCardCount(CARDS_PER_PAGE);
  };

  const handleToggleFavorites = () => {
    setShowFavoritesOnly(prev => !prev);
    setVisibleCardCount(CARDS_PER_PAGE);
  };

  const handleCardClick = (card: CardData) => setSelectedCard(card);
  const handleCloseModal = () => setSelectedCard(null);

  const handleUpdateCard = async (updatedCard: CardData) => {
    try {
      const saved = await updateCard(updatedCard);
      setAllCards(allCards.map(card => card.id === saved.id ? saved : card));
      setSelectedCard(prev => prev?.id === saved.id ? saved : prev);
    } catch {
      showToast('Failed to update card', 'error');
    }
  };

  const handleDeleteCard = async (cardId: string) => {
    try {
      await deleteCard(cardId);
      setAllCards(allCards.filter(card => card.id !== cardId));
      setSelectedCard(null);
      showToast('Memory deleted', 'info');
    } catch {
      showToast('Failed to delete card', 'error');
    }
  };

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-white text-zinc-900">
      <Header
        user={currentUser}
        onLogout={handleLogout}
        onManageAccount={() => setIsProfileModalOpen(true)}
        onDeleteAccount={() => setIsConfirmDeleteModalOpen(true)}
      />

      <main className="pt-20 px-6 pb-20 max-w-[1920px] mx-auto">
        {/* Greeting */}
        <div className="pt-8 mb-8">
          <h1 className="text-3xl font-bold font-['Space_Grotesk'] text-zinc-900">
            {getGreeting(currentUser.name)}
          </h1>
        </div>

        {/* Search + Dump Link Row */}
        <div className="mb-10 flex flex-col md:flex-row items-stretch gap-4">
          {/* AI Search bar */}
          <form onSubmit={handleSearchSubmit} className="relative flex-grow group">
            <svg
              xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor"
              className="absolute left-5 top-1/2 -translate-y-1/2 w-5 h-5 text-primary pointer-events-none"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
            <input
              ref={searchInputRef}
              type="text"
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              placeholder='Search your brain with AI (e.g., "dinner ideas")...'
              className="w-full bg-white border border-zinc-200 pl-14 pr-24 py-5 rounded-2xl text-base font-medium focus:ring-4 focus:ring-primary/10 focus:border-primary placeholder-zinc-400 outline-none transition-all shadow-sm hover:shadow-md"
              disabled={isSearching}
            />
            <div className="absolute right-5 top-1/2 -translate-y-1/2 flex items-center gap-2">
              {isSearching ? (
                <svg className="animate-spin h-4 w-4 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
              ) : (
                <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-widest px-2 py-1 bg-zinc-100 rounded-md">
                  Cmd+K
                </span>
              )}
            </div>
          </form>

          {/* Dump Link button */}
          <button
            onClick={() => setIsAddLinkOpen(prev => !prev)}
            className="flex items-center justify-center gap-2 bg-gradient-to-r from-secondary via-secondary to-primary text-white px-8 py-5 rounded-2xl font-['Space_Grotesk'] font-bold tracking-wider shadow-[0_10px_30px_-5px_rgba(118,200,147,0.4)] hover:shadow-[0_15px_40px_-5px_rgba(147,129,255,0.4)] transition-all duration-300 hover:-translate-y-0.5 active:scale-95 whitespace-nowrap"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2.5} stroke="currentColor" className="w-5 h-5">
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
            </svg>
            <span className="text-sm uppercase">Dump Link</span>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-4 h-4 opacity-80">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
            </svg>
          </button>
        </div>

        {/* Active search results indicator */}
        {activeSearchQuery && (
          <div className="mb-4 flex items-center gap-2 text-sm">
            <span className="text-zinc-500">Results for: <span className="font-semibold text-zinc-800">"{activeSearchQuery}"</span></span>
            <button onClick={clearSearch} className="text-primary hover:underline font-medium">Clear</button>
          </div>
        )}

        {error && (
          <div className="mb-4">
            <p className="text-red-600 bg-red-50 border border-red-200 rounded-xl py-2 px-4 inline-block text-sm">{error}</p>
          </div>
        )}


        {/* Card Grid with filter chips */}
        <CardGrid
          cards={visibleCards}
          totalCount={filteredCards.length}
          isLoading={isLoading && allCards.length === 0}
          isFetchingMore={isFetchingMore}
          hasMore={isEndlessScrollActive && hasMoreCards}
          onCardClick={handleCardClick}
          onLoadMore={handleLoadMore}
          activeCardType={activeCardType}
          onCardTypeClick={handleCardTypeClick}
          onUpdateCard={handleUpdateCard}
          onShowToast={showToast}
          groupBy={groupBy}
          onGroupByChange={setGroupBy}
          showFavoritesOnly={showFavoritesOnly}
          onToggleFavorites={handleToggleFavorites}
        />
      </main>

      {isAddLinkOpen && (
        <AddLinkModal
          onSubmit={handleAddLink}
          onClose={() => setIsAddLinkOpen(false)}
          isLoading={isLoading}
        />
      )}

      <Toast message={toast.message} type={toast.type} isVisible={toast.isVisible} onClose={closeToast} />

      {selectedCard && (
        <CardModal card={selectedCard} onClose={handleCloseModal} onUpdate={handleUpdateCard} onDelete={handleDeleteCard} onShowToast={showToast} />
      )}
      {isProfileModalOpen && (
        <ProfileModal user={currentUser} onClose={() => setIsProfileModalOpen(false)} onSave={handleProfileSave} isSaving={isSavingProfile} />
      )}
      {isConfirmDeleteModalOpen && (
        <ConfirmDeleteModal onClose={() => setIsConfirmDeleteModalOpen(false)} onConfirm={handleAccountDelete} isDeleting={isDeletingAccount} />
      )}
    </div>
  );
};

export default App;
