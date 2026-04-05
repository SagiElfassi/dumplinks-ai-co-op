
import React, { useRef, useCallback, useMemo, useState, useEffect } from 'react';
import type { CardData, GroupByOption } from '../types';
import { Card } from './Card';
import { SkeletonCard } from './skeletons/SkeletonCard';
import { 
  ReadLaterIcon, 
  OtherIcon, 
  TravelIcon, 
  ShoppingIcon, 
  RecipeIcon, 
  VideoIcon, 
  RestaurantIcon,
  HealthIcon,
  EducationIcon, 
  DiyIcon, 
  ParentingIcon, 
  FinanceIcon,
  LayersIcon,
  CalendarIcon,
  ChevronRightIcon,
  HeartIcon
} from './icons/MiniIcons';
import { GridIcon } from './icons/GridIcon';
import { ListIcon } from './icons/ListIcon';
import { CardType as CardTypeEnum } from '../types';
import type { ToastType } from './Toast';

interface CardGridProps {
  cards: CardData[];
  isLoading: boolean;
  isSearching: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onSearch: (query: string) => void;
  onClearSearch: () => void;
  onCardClick: (card: CardData) => void;
  onLoadMore: () => void;
  activeSearchQuery: string | null;
  activeCardType: CardTypeEnum | null;
  onCardTypeClick: (cardType: CardTypeEnum | null) => void;
  onUpdateCard: (card: CardData) => void;
  onShowToast: (message: string, type: ToastType) => void;
  searchInputRef: React.RefObject<HTMLInputElement | null>;
  groupBy: GroupByOption;
  onGroupByChange: (option: GroupByOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

const cardTypeFilters = [
    { type: null, label: 'All', Icon: null },
    { type: CardTypeEnum.SHOPPING, label: 'Shopping', Icon: ShoppingIcon },
    { type: CardTypeEnum.RECIPE, label: 'Recipe', Icon: RecipeIcon },
    { type: CardTypeEnum.READ_LATER, label: 'Read Later', Icon: ReadLaterIcon },
    { type: CardTypeEnum.VIDEO, label: 'Video', Icon: VideoIcon },
    { type: CardTypeEnum.RESTAURANT, label: 'Restaurant', Icon: RestaurantIcon },
    { type: CardTypeEnum.TRAVEL, label: 'Travel', Icon: TravelIcon },
    { type: CardTypeEnum.HEALTH_FITNESS, label: 'Health', Icon: HealthIcon },
    { type: CardTypeEnum.EDUCATION, label: 'Learning', Icon: EducationIcon },
    { type: CardTypeEnum.DIY_CRAFTS, label: 'DIY', Icon: DiyIcon },
    { type: CardTypeEnum.PARENTING, label: 'Parenting', Icon: ParentingIcon },
    { type: CardTypeEnum.FINANCE, label: 'Finance', Icon: FinanceIcon },
    { type: CardTypeEnum.OTHER, label: 'Other', Icon: OtherIcon },
];

const GROUP_STYLES: Record<CardTypeEnum, { bg: string; border: string }> = {
    [CardTypeEnum.SHOPPING]: { bg: 'bg-blue-900/10', border: 'border-blue-500/20' },
    [CardTypeEnum.RECIPE]: { bg: 'bg-emerald-900/10', border: 'border-emerald-500/20' },
    [CardTypeEnum.READ_LATER]: { bg: 'bg-purple-900/10', border: 'border-purple-500/20' },
    [CardTypeEnum.VIDEO]: { bg: 'bg-rose-900/10', border: 'border-rose-500/20' },
    [CardTypeEnum.RESTAURANT]: { bg: 'bg-orange-900/10', border: 'border-orange-500/20' },
    [CardTypeEnum.TRAVEL]: { bg: 'bg-cyan-900/10', border: 'border-cyan-500/20' },
    [CardTypeEnum.HEALTH_FITNESS]: { bg: 'bg-teal-900/10', border: 'border-teal-500/20' },
    [CardTypeEnum.EDUCATION]: { bg: 'bg-indigo-900/10', border: 'border-indigo-500/20' },
    [CardTypeEnum.DIY_CRAFTS]: { bg: 'bg-amber-900/10', border: 'border-amber-500/20' },
    [CardTypeEnum.PARENTING]: { bg: 'bg-pink-900/10', border: 'border-pink-500/20' },
    [CardTypeEnum.FINANCE]: { bg: 'bg-green-900/10', border: 'border-green-500/20' },
    [CardTypeEnum.OTHER]: { bg: 'bg-gray-800/30', border: 'border-gray-700/30' }
};

const FILTER_BUTTON_STYLES: Record<string, { active: string; inactive: string }> = {
  [CardTypeEnum.SHOPPING]: { active: 'bg-blue-600 border-blue-500 text-white shadow-lg shadow-blue-900/50', inactive: 'bg-blue-900/5 border-blue-500/30 text-blue-400 hover:bg-blue-900/20 hover:border-blue-500/50' },
  [CardTypeEnum.RECIPE]: { active: 'bg-emerald-600 border-emerald-500 text-white shadow-lg shadow-emerald-900/50', inactive: 'bg-emerald-900/5 border-emerald-500/30 text-emerald-400 hover:bg-emerald-900/20 hover:border-emerald-500/50' },
  [CardTypeEnum.READ_LATER]: { active: 'bg-purple-600 border-purple-500 text-white shadow-lg shadow-purple-900/50', inactive: 'bg-purple-900/5 border-purple-500/30 text-purple-400 hover:bg-purple-900/20 hover:border-purple-500/50' },
  [CardTypeEnum.VIDEO]: { active: 'bg-rose-600 border-rose-500 text-white shadow-lg shadow-rose-900/50', inactive: 'bg-rose-900/5 border-rose-500/30 text-rose-400 hover:bg-rose-900/20 hover:border-rose-500/50' },
  [CardTypeEnum.RESTAURANT]: { active: 'bg-orange-600 border-orange-500 text-white shadow-lg shadow-orange-900/50', inactive: 'bg-orange-900/5 border-orange-500/30 text-orange-400 hover:bg-orange-900/20 hover:border-orange-500/50' },
  [CardTypeEnum.TRAVEL]: { active: 'bg-cyan-600 border-cyan-500 text-white shadow-lg shadow-cyan-900/50', inactive: 'bg-cyan-900/5 border-cyan-500/30 text-cyan-400 hover:bg-cyan-900/20 hover:border-cyan-500/50' },
  [CardTypeEnum.HEALTH_FITNESS]: { active: 'bg-teal-600 border-teal-500 text-white shadow-lg shadow-teal-900/50', inactive: 'bg-teal-900/5 border-teal-500/30 text-teal-400 hover:bg-teal-900/20 hover:border-teal-500/50' },
  [CardTypeEnum.EDUCATION]: { active: 'bg-indigo-600 border-indigo-500 text-white shadow-lg shadow-indigo-900/50', inactive: 'bg-indigo-900/5 border-indigo-500/30 text-indigo-400 hover:bg-indigo-900/20 hover:border-indigo-500/50' },
  [CardTypeEnum.DIY_CRAFTS]: { active: 'bg-amber-600 border-amber-500 text-white shadow-lg shadow-amber-900/50', inactive: 'bg-amber-900/5 border-amber-500/30 text-amber-400 hover:bg-amber-900/20 hover:border-amber-500/50' },
  [CardTypeEnum.PARENTING]: { active: 'bg-pink-600 border-pink-500 text-white shadow-lg shadow-pink-900/50', inactive: 'bg-pink-900/5 border-pink-500/30 text-pink-400 hover:bg-pink-900/20 hover:border-pink-500/50' },
  [CardTypeEnum.FINANCE]: { active: 'bg-green-600 border-green-500 text-white shadow-lg shadow-green-900/50', inactive: 'bg-green-900/5 border-green-500/30 text-green-400 hover:bg-green-900/20 hover:border-green-500/50' },
  [CardTypeEnum.OTHER]: { active: 'bg-gray-600 border-gray-500 text-white shadow-lg shadow-gray-900/50', inactive: 'bg-gray-800/50 border-gray-600/30 text-gray-400 hover:bg-gray-800 hover:border-gray-500/50' },
  'ALL': { active: 'bg-primary-600 border-primary-500 text-white shadow-lg shadow-primary-900/50', inactive: 'bg-gray-800/50 border-white/5 text-gray-400 hover:bg-gray-700 hover:text-gray-200' },
};

const GROUP_OPTIONS: Record<GroupByOption, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    none: { label: 'Grid', icon: GridIcon },
    list: { label: 'List', icon: ListIcon },
    topic: { label: 'Topic', icon: LayersIcon },
    date: { label: 'Date', icon: CalendarIcon },
};

// Define the order explicitly for the dropdown
const DROPDOWN_ORDER: GroupByOption[] = ['none', 'list', 'topic', 'date'];

export const CardGrid: React.FC<CardGridProps> = ({ 
  cards, 
  isLoading, 
  isSearching,
  isFetchingMore,
  hasMore,
  onSearch,
  onClearSearch,
  onCardClick,
  onLoadMore,
  activeSearchQuery,
  activeCardType,
  onCardTypeClick,
  onUpdateCard,
  onShowToast,
  searchInputRef,
  groupBy,
  onGroupByChange,
  showFavoritesOnly,
  onToggleFavorites
}) => {
  
  const [searchQuery, setSearchQuery] = React.useState('');
  const [isViewMenuOpen, setIsViewMenuOpen] = useState(false);
  const viewMenuRef = useRef<HTMLDivElement>(null);

  const observer = useRef<IntersectionObserver | null>(null);
  const lastElementRef = useCallback((node: HTMLDivElement | null) => {
    if (isFetchingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        onLoadMore();
      }
    });
    if (node) observer.current.observe(node);
  }, [isFetchingMore, hasMore, onLoadMore]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSearch(searchQuery);
  }

  // Click outside to close view menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
            setIsViewMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Group cards Logic
  const groupedCards = useMemo(() => {
      // If filtering by type, we don't group by topic (it would be redundant)
      if (activeCardType) return null;
      if (groupBy === 'none' || groupBy === 'list') return null;

      if (groupBy === 'topic') {
        const groups: Partial<Record<string, CardData[]>> = {};
        cards.forEach(card => {
            if (!groups[card.cardType]) {
                groups[card.cardType] = [];
            }
            groups[card.cardType]!.push(card);
        });
        return groups;
      }

      if (groupBy === 'date') {
         const groups: Partial<Record<string, CardData[]>> = {};
         cards.forEach(card => {
             const date = new Date(card.date);
             const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
             if (!groups[key]) {
                 groups[key] = [];
             }
             groups[key]!.push(card);
         });
         return groups;
      }

      return null;
  }, [cards, activeCardType, groupBy]);
  
  const ActiveGroupIcon = GROUP_OPTIONS[groupBy].icon;

  const renderContent = () => {
    if (isLoading && cards.length === 0) {
        return (
            <div className="columns-2 md:columns-3 lg:columns-4 gap-6 space-y-6">
                {Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)}
           </div>
        );
    }

    if (groupedCards) {
         /* --- GROUPED VIEW (Masonry Layout of Boxes) --- */
         return (
            <div className="columns-1 md:columns-2 lg:columns-3 xl:columns-4 gap-4 space-y-4">
              {Object.entries(groupedCards).map(([groupKey, data]) => {
                  const groupCards = data as CardData[];
                  
                  // Style based on grouping mode
                  let style = { bg: 'bg-gray-800/30', border: 'border-gray-700/30' };
                  if (groupBy === 'topic') {
                       const type = groupKey as CardTypeEnum;
                       style = GROUP_STYLES[type] || GROUP_STYLES[CardTypeEnum.OTHER];
                  } else {
                      // Date styling (Neutral but distinct)
                      style = { bg: 'bg-gray-800/40', border: 'border-white/10' };
                  }

                  const count = groupCards.length;

                  return (
                      <div key={groupKey} className={`rounded-xl border ${style.border} ${style.bg} overflow-hidden shadow-lg break-inside-avoid mb-4 relative`}>
                          {groupBy === 'date' && (
                              <div className="px-3 py-2 text-xs font-bold text-gray-400 uppercase tracking-wider border-b border-white/5 bg-black/20">
                                  {groupKey}
                              </div>
                          )}
                          <div className="p-1.5 grid grid-cols-2 gap-1.5">
                              {groupCards.map((card, index) => {
                                  let colSpan = 'col-span-1';
                                  let rowSpan = 'row-span-1';

                                  if (count % 2 !== 0 && index === 0) {
                                      colSpan = 'col-span-2';
                                      rowSpan = 'row-span-2'; 
                                  }

                                  return (
                                      <div key={card.id} className={`${colSpan} ${rowSpan}`} onClick={() => onCardClick(card)}>
                                           {/* Inner Dashboard Cards maintain fixed aspect ratio for neat mosaic */}
                                           <Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="fixed" />
                                      </div>
                                  );
                              })}
                          </div>
                      </div>
                  );
              })}
          </div>
         );
    } else if (groupBy === 'list') {
        /* --- LIST VIEW (Vertical Stack) --- */
        return (
            <div className="flex flex-col gap-3 max-w-4xl mx-auto">
                {cards.map((card, index) => {
                     if (cards.length === index + 1) {
                         return <div ref={lastElementRef} key={card.id}><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="list" /></div>
                     }
                     return <div key={card.id}><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="list" /></div>;
                })}
            </div>
        );
    } else {
        /* --- FLAT GRID VIEW (Filtered or No Grouping) --- */
        /* Using Masonry layout with variable height cards */
        return (
            <div className="columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3 md:gap-4 space-y-3 md:space-y-4">
                {cards.map((card, index) => {
                    if (cards.length === index + 1) {
                        return <div ref={lastElementRef} key={card.id} className="break-inside-avoid mb-3"><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="masonry" /></div>
                    }
                    return <div key={card.id} className="break-inside-avoid mb-3"><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="masonry" /></div>;
                })}
            </div>
        );
    }
  };

  return (
    <div>
      {/* --- STICKY Search & Filter Bar --- */}
      <div className="sticky top-0 md:top-0 z-30 -mx-4 px-4 md:-mx-8 md:px-8 py-4 mb-6 bg-gray-900/5 backdrop-blur-xl transition-all duration-200 supports-[backdrop-filter]:bg-gray-900/5">
        <div className="container mx-auto flex flex-col items-center gap-4">
            
            {/* Wrapped Filters (No Horizontal Scroll) */}
            <div className="w-full flex flex-wrap justify-center gap-2">
                {cardTypeFilters.map(({ type, label, Icon }) => {
                    const isActive = activeCardType === type;
                    const baseClasses = 'px-3 py-1.5 text-xs font-medium rounded-full transition-all duration-200 flex items-center gap-1.5 border';
                    
                    const styles = type ? FILTER_BUTTON_STYLES[type] : FILTER_BUTTON_STYLES['ALL'];
                    const interactiveClasses = `cursor-pointer ${isActive ? styles.active : styles.inactive}`;

                    return (
                    <button
                        key={label}
                        onClick={() => onCardTypeClick(type)}
                        className={`${baseClasses} ${interactiveClasses}`}
                    >
                        {Icon && <Icon className="w-3 h-3" />}
                        <span>{label}</span>
                    </button>
                    );
                })}
            </div>

            {/* Centered, Wide Search Input with View Options and Favorites to the LEFT */}
            <div className="w-full max-w-2xl flex gap-2 h-12">
                
                {/* View/Group Options Dropdown (LEFT) */}
                <div className="relative flex-shrink-0 h-full" ref={viewMenuRef}>
                    <button
                        onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
                        className={`h-full px-4 rounded-xl border flex items-center gap-2 transition-all duration-200 whitespace-nowrap min-w-[140px] justify-between ${isViewMenuOpen ? 'bg-gray-800 border-primary-500/50 text-white' : 'bg-gray-800/50 border-gray-700/50 text-gray-300 hover:bg-gray-800/80'}`}
                        title="Grouping Options"
                    >
                        <div className="flex items-center gap-2">
                            <ActiveGroupIcon className="w-4 h-4 text-primary-400" />
                            <span className="text-sm font-semibold text-gray-200">{GROUP_OPTIONS[groupBy].label}</span>
                        </div>
                        <ChevronRightIcon className={`w-4 h-4 text-gray-500 transition-transform duration-200 ${isViewMenuOpen ? 'rotate-90' : 'rotate-90'}`} />
                    </button>

                    {isViewMenuOpen && (
                        <div className="absolute left-0 top-full mt-2 w-48 bg-gray-900 border border-gray-700 rounded-xl shadow-xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-100">
                             <div className="p-1.5 space-y-0.5">
                                {DROPDOWN_ORDER.map((option) => {
                                    const OptionIcon = GROUP_OPTIONS[option].icon;
                                    const isSelected = groupBy === option;
                                    return (
                                        <button 
                                            key={option}
                                            onClick={() => { onGroupByChange(option); setIsViewMenuOpen(false); }} 
                                            className={`w-full text-left px-3 py-2.5 rounded-lg text-sm flex items-center justify-between transition-colors ${isSelected ? 'bg-primary-600/10 text-primary-400 font-medium' : 'text-gray-300 hover:bg-gray-800'}`}
                                        >
                                            <div className="flex items-center gap-3">
                                                <OptionIcon className={`w-4 h-4 ${isSelected ? 'text-primary-400' : 'text-gray-500'}`} />
                                                {GROUP_OPTIONS[option].label}
                                            </div>
                                            {isSelected && <div className="w-1.5 h-1.5 rounded-full bg-primary-500"></div>}
                                        </button>
                                    );
                                })}
                             </div>
                        </div>
                    )}
                </div>

                {/* Favorites Filter (MIDDLE) */}
                <button
                    onClick={onToggleFavorites}
                    className={`h-full px-4 rounded-xl border flex items-center justify-center gap-2 transition-all duration-200 min-w-[50px] ${showFavoritesOnly ? 'bg-red-500/10 border-red-500/50 text-red-500 shadow-[0_0_15px_rgba(239,68,68,0.3)]' : 'bg-gray-800/50 border-gray-700/50 text-gray-400 hover:bg-gray-800/80 hover:text-red-400'}`}
                    title={showFavoritesOnly ? "Show All" : "Show Favorites Only"}
                >
                    <HeartIcon className="w-5 h-5" filled={showFavoritesOnly} />
                </button>

                {/* Search Form (RIGHT) */}
                <form onSubmit={handleSearchSubmit} className="relative flex-grow h-full">
                     <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                         <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path></svg>
                     </div>
                    <input
                    ref={searchInputRef}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="What are you looking for today? (Ctrl+K)"
                    className="w-full h-full pl-11 pr-4 bg-gray-800/50 border border-gray-700/50 text-base text-gray-200 rounded-xl focus:ring-2 focus:ring-primary-500/50 focus:border-primary-500 focus:bg-gray-800/80 transition-all duration-200 placeholder-gray-500 shadow-inner backdrop-blur-sm"
                    disabled={isSearching}
                    />
                </form>

            </div>

        </div>
        
         {activeSearchQuery && (
          <div className="mt-2 text-xs flex justify-center items-center gap-2 animate-in fade-in slide-in-from-top-2">
              <span className="text-gray-400">Results for: <span className="font-semibold text-white">"{activeSearchQuery}"</span></span>
              <button onClick={() => { setSearchQuery(''); onClearSearch(); }} className="text-primary-400 hover:text-primary-300 hover:underline">Clear</button>
          </div>
        )}
      </div>
      
      {/* --- Main Content Area --- */}
      {renderContent()}

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8 col-span-full">
            <svg className="animate-spin h-6 w-6 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
        </div>
      )}

      {!isLoading && cards.length === 0 && (
        <div className="text-center col-span-full py-24 bg-gray-900/30 rounded-2xl border border-white/5">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-800 mb-4">
             <svg className="w-8 h-8 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path></svg>
          </div>
          <h3 className="text-xl font-semibold text-gray-300">No memories found!</h3>
          <p className="text-gray-500 mt-2">{ activeSearchQuery || activeCardType || showFavoritesOnly ? 'Try adjusting your search or filters.' : 'Paste a link above to start your collection.'}</p>
        </div>
      )}
    </div>
  );
};
