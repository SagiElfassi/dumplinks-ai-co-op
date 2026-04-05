import React, { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { Header } from './components/Header';
import { LinkInputForm } from './components/LinkInputForm';
import { CardGrid } from './components/CardGrid';
import { processLink, processSearchQuery } from './services/geminiService';
import type { CardData, SearchFilters, CardType, User, GroupByOption } from './types';
import { CardModal } from './components/CardModal';
import { MOCK_CARDS } from './constants';
import * as authService from './services/authService';
import { LandingPage } from './components/LandingPage';
import { ProfileModal } from './components/ProfileModal';
import { ConfirmDeleteModal } from './components/ConfirmDeleteModal';
import { PlusIcon } from './components/icons/MiniIcons';
import { Toast } from './components/Toast';
import type { ToastType } from './components/Toast';

const CARDS_PER_PAGE = 8;
const STORAGE_KEY = 'dumplinks_cards_v1';

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  useEffect(() => {
    authService.getCurrentUser().then(setCurrentUser);
  }, []);

  const [allCards, setAllCards] = useState<CardData[]>(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try { return JSON.parse(saved); } catch { /* ignore */ }
    }
    return [];
  });

  const [visibleCardCount, setVisibleCardCount] = useState(CARDS_PER_PAGE);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [isFetchingMore, setIsFetchingMore] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [activeCardType, setActiveCardType] = useState<CardType | null>(null);
  const [smartFilters, setSmartFilters] = useState<SearchFilters | null>(null);
  const [activeSearchQuery, setActiveSearchQuery] = useState<string | null>(null);
  const [selectedCard, setSelectedCard] = useState<CardData | null>(null);
  const [groupBy, setGroupBy] = useState<GroupByOption>('none');
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isConfirmDeleteModalOpen, setIsConfirmDeleteModalOpen] = useState(false);
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const [showFab, setShowFab] = useState(false);

  const [toast, setToast] = useState<{ message: string; type: ToastType; isVisible: boolean }>({
    message: '', type: 'info', isVisible: false,
  });

  const inputSectionRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (currentUser && allCards.length === 0) {
      const hasLoadedBefore = localStorage.getItem('dumplinks_has_loaded');
      if (!hasLoadedBefore) {
        setAllCards(MOCK_CARDS);
        localStorage.setItem('dumplinks_has_loaded', 'true');
      }
    }
  }, [currentUser]);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(allCards));
    }
  }, [allCards, currentUser]);

  const showToast = useCallback((message: string, type: ToastType = 'success') => {
    setToast({ message, type, isVisible: true });
  }, []);

  const closeToast = () => setToast(prev => ({ ...prev, isVisible: false }));

  useEffect(() => {
    const handleScroll = () => setShowFab(window.scrollY > 300);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        handleCloseModal();
        setIsProfileModalOpen(false);
        setIsConfirmDeleteModalOpen(false);
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
    localStorage.removeItem(STORAGE_KEY);
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
      localStorage.removeItem(STORAGE_KEY);
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
      const newCard: CardData = { ...newCardData, id: Date.now().toString(), date: new Date().toISOString() };
      setAllCards(prev => [newCard, ...prev]);
      showToast('Link dumped successfully!', 'success');
    } catch {
      setError('Failed to process the link. Please try a different URL.');
      showToast('Failed to process link', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFabClick = () => {
    inputSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    setTimeout(() => {
      const input = inputSectionRef.current?.querySelector('input');
      input?.focus();
    }, 500);
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
      const filters = await processSearchQuery(query);
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
    setError(null);
    setVisibleCardCount(CARDS_PER_PAGE);
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

  const handleUpdateCard = (updatedCard: CardData) => {
    setAllCards(allCards.map(card => card.id === updatedCard.id ? updatedCard : card));
    setSelectedCard(prev => prev?.id === updatedCard.id ? updatedCard : prev);
  };

  const handleDeleteCard = (cardId: string) => {
    setAllCards(allCards.filter(card => card.id !== cardId));
    setSelectedCard(null);
    showToast('Memory deleted', 'info');
  };

  if (!currentUser) {
    return <LandingPage onLogin={handleLogin} onRegister={handleRegister} />;
  }

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 relative overflow-x-hidden">
      <div className="fixed inset-0 pointer-events-none z-0">
        <div className="absolute top-0 left-0 w-96 h-96 bg-primary-900/20 rounded-full filter blur-3xl animate-blob"></div>
        <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-purple/20 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-accent-blue/10 rounded-full filter blur-3xl animate-blob" style={{ animationDelay: '4s' }}></div>
      </div>

      <Header
        user={currentUser}
        onLogout={handleLogout}
        onManageAccount={() => setIsProfileModalOpen(true)}
        onDeleteAccount={() => setIsConfirmDeleteModalOpen(true)}
      />

      <main className="container mx-auto p-4 md:p-8 relative z-10">
        <div ref={inputSectionRef} className="pt-6 pb-1 md:pt-8 md:pb-2 text-center max-w-3xl mx-auto relative">
          <div className="relative z-20">
            <LinkInputForm onSubmit={handleAddLink} isLoading={isLoading} isEmpty={allCards.length === 0} />
          </div>
          {error && (
            <div className="mt-4">
              <p className="text-red-400 bg-red-900/20 border border-red-500/20 rounded-lg py-2 px-4 inline-block">{error}</p>
            </div>
          )}
        </div>

        <div className="mt-0 min-h-[600px]">
          <CardGrid
            cards={visibleCards}
            isLoading={isLoading && allCards.length === 0}
            isSearching={isSearching}
            onSearch={handleSearch}
            onClearSearch={clearSearch}
            activeSearchQuery={activeSearchQuery}
            onCardClick={handleCardClick}
            onLoadMore={handleLoadMore}
            isFetchingMore={isFetchingMore}
            hasMore={isEndlessScrollActive && hasMoreCards}
            activeCardType={activeCardType}
            onCardTypeClick={handleCardTypeClick}
            onUpdateCard={handleUpdateCard}
            onShowToast={showToast}
            searchInputRef={searchInputRef}
            groupBy={groupBy}
            onGroupByChange={setGroupBy}
            showFavoritesOnly={showFavoritesOnly}
            onToggleFavorites={handleToggleFavorites}
          />
        </div>
      </main>

      <button
        onClick={handleFabClick}
        className={`fixed bottom-6 right-6 z-50 w-14 h-14 bg-primary-600 rounded-full shadow-2xl flex items-center justify-center text-white transition-all duration-300 hover:bg-primary-500 hover:scale-110 active:scale-95 ${showFab ? 'translate-y-0 opacity-100' : 'translate-y-20 opacity-0 pointer-events-none'}`}
      >
        <PlusIcon className="w-8 h-8" />
      </button>

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
