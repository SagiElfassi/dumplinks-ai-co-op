
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
  totalCount: number;
  isLoading: boolean;
  isFetchingMore: boolean;
  hasMore: boolean;
  onCardClick: (card: CardData) => void;
  onLoadMore: () => void;
  activeCardType: CardTypeEnum | null;
  onCardTypeClick: (cardType: CardTypeEnum | null) => void;
  onUpdateCard: (card: CardData) => void;
  onShowToast: (message: string, type: ToastType) => void;
  groupBy: GroupByOption;
  onGroupByChange: (option: GroupByOption) => void;
  showFavoritesOnly: boolean;
  onToggleFavorites: () => void;
}

const cardTypeFilters = [
    { type: null, label: 'All Dumps', Icon: null },
    { type: CardTypeEnum.SHOPPING, label: 'Products', Icon: ShoppingIcon },
    { type: CardTypeEnum.RECIPE, label: 'Recipes', Icon: RecipeIcon },
    { type: CardTypeEnum.READ_LATER, label: 'Read Later', Icon: ReadLaterIcon },
    { type: CardTypeEnum.VIDEO, label: 'Videos', Icon: VideoIcon },
    { type: CardTypeEnum.RESTAURANT, label: 'Restaurants', Icon: RestaurantIcon },
    { type: CardTypeEnum.TRAVEL, label: 'Travel', Icon: TravelIcon },
    { type: CardTypeEnum.HEALTH_FITNESS, label: 'Health', Icon: HealthIcon },
    { type: CardTypeEnum.EDUCATION, label: 'Learning', Icon: EducationIcon },
    { type: CardTypeEnum.DIY_CRAFTS, label: 'DIY', Icon: DiyIcon },
    { type: CardTypeEnum.PARENTING, label: 'Parenting', Icon: ParentingIcon },
    { type: CardTypeEnum.FINANCE, label: 'Finance', Icon: FinanceIcon },
    { type: CardTypeEnum.OTHER, label: 'Other', Icon: OtherIcon },
];

const GROUP_OPTIONS: Record<GroupByOption, { label: string; icon: React.FC<React.SVGProps<SVGSVGElement>> }> = {
    none: { label: 'Grid', icon: GridIcon },
    list: { label: 'List', icon: ListIcon },
    topic: { label: 'Topic', icon: LayersIcon },
    date: { label: 'Date', icon: CalendarIcon },
};

const DROPDOWN_ORDER: GroupByOption[] = ['none', 'list', 'topic', 'date'];

export const CardGrid: React.FC<CardGridProps> = ({
  cards,
  totalCount,
  isLoading,
  isFetchingMore,
  hasMore,
  onCardClick,
  onLoadMore,
  activeCardType,
  onCardTypeClick,
  onUpdateCard,
  onShowToast,
  groupBy,
  onGroupByChange,
  showFavoritesOnly,
  onToggleFavorites
}) => {
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

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (viewMenuRef.current && !viewMenuRef.current.contains(event.target as Node)) {
        setIsViewMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const groupedCards = useMemo(() => {
    if (activeCardType) return null;
    if (groupBy === 'none' || groupBy === 'list') return null;

    if (groupBy === 'topic') {
      const groups: Partial<Record<string, CardData[]>> = {};
      cards.forEach(card => {
        if (!groups[card.cardType]) groups[card.cardType] = [];
        groups[card.cardType]!.push(card);
      });
      return groups;
    }

    if (groupBy === 'date') {
      const groups: Partial<Record<string, CardData[]>> = {};
      cards.forEach(card => {
        const date = new Date(card.date);
        const key = date.toLocaleString('default', { month: 'long', year: 'numeric' });
        if (!groups[key]) groups[key] = [];
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
        <div className="masonry-grid">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="masonry-item">
              <SkeletonCard />
            </div>
          ))}
        </div>
      );
    }

    if (groupedCards) {
      return (
        <div className="columns-1 sm:columns-2 lg:columns-3 xl:columns-5 2xl:columns-6 gap-5 space-y-5">
          {Object.entries(groupedCards).map(([groupKey, data]) => {
            const groupCards = data as CardData[];
            const count = groupCards.length;
            return (
              <div key={groupKey} className="rounded-2xl border border-zinc-200 bg-zinc-50 overflow-hidden shadow-sm break-inside-avoid mb-5">
                {groupBy === 'date' && (
                  <div className="px-4 py-2.5 text-xs font-bold text-zinc-500 uppercase tracking-wider border-b border-zinc-200">
                    {groupKey}
                  </div>
                )}
                <div className="p-2 grid grid-cols-2 gap-2">
                  {groupCards.map((card, index) => {
                    let colSpan = 'col-span-1';
                    if (count % 2 !== 0 && index === 0) colSpan = 'col-span-2';
                    return (
                      <div key={card.id} className={colSpan} onClick={() => onCardClick(card)}>
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
    }

    if (groupBy === 'list') {
      return (
        <div className="flex flex-col gap-3 max-w-4xl mx-auto">
          {cards.map((card, index) => {
            if (cards.length === index + 1) {
              return <div ref={lastElementRef} key={card.id}><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="list" /></div>;
            }
            return <div key={card.id}><Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="list" /></div>;
          })}
        </div>
      );
    }

    return (
      <div className="masonry-grid">
        {cards.map((card, index) => {
          if (cards.length === index + 1) {
            return (
              <div ref={lastElementRef} key={card.id} className="masonry-item">
                <Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="masonry" />
              </div>
            );
          }
          return (
            <div key={card.id} className="masonry-item">
              <Card card={card} onCardClick={onCardClick} onUpdateCard={onUpdateCard} onShowToast={onShowToast} layout="masonry" />
            </div>
          );
        })}
      </div>
    );
  };

  return (
    <div>
      {/* Filter chips + View controls */}
      <div className="sticky top-[73px] z-30 -mx-6 px-6 py-3 bg-white/90 backdrop-blur-xl border-b border-zinc-100 mb-6">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide items-center justify-between">
        <div className="flex gap-3 overflow-x-auto scrollbar-hide items-center flex-1 min-w-0">

          {/* View dropdown */}
          <div className="relative flex-shrink-0" ref={viewMenuRef}>
            <button
              onClick={() => setIsViewMenuOpen(!isViewMenuOpen)}
              className="flex items-center gap-2 px-4 py-2 bg-white text-zinc-800 border border-zinc-200 rounded-full font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider whitespace-nowrap hover:border-primary hover:text-primary transition-all shadow-sm"
            >
              <ActiveGroupIcon className="w-3.5 h-3.5" />
              <span>View: {GROUP_OPTIONS[groupBy].label}</span>
              <ChevronRightIcon className={`w-3 h-3 transition-transform duration-200 ${isViewMenuOpen ? 'rotate-90' : 'rotate-90'}`} />
            </button>

            {isViewMenuOpen && (
              <div className="absolute left-0 top-full mt-2 w-44 bg-white border border-zinc-200 rounded-2xl shadow-xl overflow-hidden z-50 py-1">
                {DROPDOWN_ORDER.map((option) => {
                  const OptionIcon = GROUP_OPTIONS[option].icon;
                  const isSelected = groupBy === option;
                  return (
                    <button
                      key={option}
                      onClick={() => { onGroupByChange(option); setIsViewMenuOpen(false); }}
                      className={`w-full text-left px-4 py-2.5 text-sm flex items-center gap-3 transition-colors font-['Space_Grotesk'] font-bold uppercase tracking-wider ${isSelected ? 'text-primary bg-primary/5' : 'text-zinc-600 hover:text-primary hover:bg-zinc-50'}`}
                    >
                      <OptionIcon className={`w-4 h-4 ${isSelected ? 'text-primary' : 'text-zinc-400'}`} />
                      {GROUP_OPTIONS[option].label}
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-200 flex-shrink-0" />

          {/* Favorites toggle */}
          <button
            onClick={onToggleFavorites}
            className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider border transition-all flex-shrink-0 ${showFavoritesOnly ? 'bg-red-50 border-red-300 text-red-500' : 'bg-white border-zinc-200 text-zinc-600 hover:border-primary hover:text-primary'}`}
          >
            <HeartIcon className="w-3.5 h-3.5" filled={showFavoritesOnly} />
            <span>Saved</span>
          </button>

          {/* Divider */}
          <div className="w-px h-6 bg-zinc-200 flex-shrink-0" />

          {/* Category filter chips */}
          {cardTypeFilters.map(({ type, label, Icon }) => {
            const isActive = activeCardType === type;
            return (
              <button
                key={label}
                onClick={() => onCardTypeClick(type)}
                className={`flex items-center gap-1.5 px-4 py-2 rounded-full font-['Space_Grotesk'] text-xs font-bold uppercase tracking-wider border transition-all whitespace-nowrap flex-shrink-0 ${isActive ? 'bg-primary text-white border-primary shadow-sm' : 'bg-white text-zinc-700 border-zinc-200 hover:border-primary hover:text-primary'}`}
              >
                {Icon && <Icon className="w-3 h-3" />}
                <span>{label}</span>
              </button>
            );
          })}
        </div>

        {/* Item count */}
        {!isLoading && (
          <span className="flex-shrink-0 text-xs font-bold font-['Space_Grotesk'] uppercase tracking-widest text-zinc-400 pl-4 whitespace-nowrap">
            {totalCount} {totalCount === 1 ? 'Item' : 'Items'}
          </span>
        )}
        </div>
      </div>

      {/* Main content */}
      {renderContent()}

      {isFetchingMore && (
        <div className="flex justify-center items-center py-8">
          <svg className="animate-spin h-6 w-6 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
        </div>
      )}

      {!isLoading && cards.length === 0 && (
        <div className="text-center py-24 border border-zinc-200 rounded-2xl bg-zinc-50">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-white border border-zinc-200 mb-4 shadow-sm">
            <svg className="w-8 h-8 text-zinc-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M20 13V6a2 2 0 0 0-2-2H6a2 2 0 0 0-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"></path>
            </svg>
          </div>
          <h3 className="text-xl font-bold text-zinc-700 font-['Space_Grotesk']">
            {activeCardType || showFavoritesOnly ? 'No dumps found' : 'No dumps yet'}
          </h3>
          <p className="text-zinc-400 mt-2 text-sm">
            {activeCardType || showFavoritesOnly ? 'Try adjusting your filters.' : 'Click "Dump Link" above to start your collection.'}
          </p>
        </div>
      )}
    </div>
  );
};
