
import React from 'react';
import type { CardData } from '../types';
import { 
  ShoppingIcon, 
  RecipeIcon, 
  ReadLaterIcon, 
  VideoIcon, 
  TravelIcon, 
  RestaurantIcon, 
  HealthIcon,
  EducationIcon,
  DiyIcon,
  ParentingIcon,
  FinanceIcon,
  OtherIcon,
  ShareIcon,
  HeartIcon
} from './icons/MiniIcons';
import { CardType } from '../types';
import type { ToastType } from './Toast';

interface CardProps {
  card: CardData;
  onCardClick: (card: CardData) => void;
  onUpdateCard: (card: CardData) => void;
  onShowToast: (message: string, type: ToastType) => void;
  layout?: 'fixed' | 'masonry' | 'list';
}

const CardTypeIconMap: Record<CardType, React.FC<React.SVGProps<SVGSVGElement>>> = {
  [CardType.SHOPPING]: ShoppingIcon,
  [CardType.RECIPE]: RecipeIcon,
  [CardType.READ_LATER]: ReadLaterIcon,
  [CardType.VIDEO]: VideoIcon,
  [CardType.TRAVEL]: TravelIcon,
  [CardType.RESTAURANT]: RestaurantIcon,
  [CardType.HEALTH_FITNESS]: HealthIcon,
  [CardType.EDUCATION]: EducationIcon,
  [CardType.DIY_CRAFTS]: DiyIcon,
  [CardType.PARENTING]: ParentingIcon,
  [CardType.FINANCE]: FinanceIcon,
  [CardType.OTHER]: OtherIcon,
};

export const Card: React.FC<CardProps> = ({ card, onCardClick, onUpdateCard, onShowToast, layout = 'fixed' }) => {
  const Icon = CardTypeIconMap[card.cardType] || OtherIcon;

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({
        title: card.title,
        text: card.description,
        url: card.url,
      }).catch(err => console.error('Error sharing', err));
    } else {
      navigator.clipboard.writeText(card.url).then(() => {
        onShowToast('Link copied to clipboard!', 'success');
      });
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdateCard({ ...card, isFavorite: !card.isFavorite });
    if (!card.isFavorite) {
        onShowToast('Added to favorites', 'success');
    }
  };

  if (layout === 'list') {
      return (
        <div
            onClick={() => onCardClick(card)}
            className="group relative w-full bg-white border border-zinc-100 rounded-2xl overflow-hidden cursor-pointer hover:border-primary/40 hover:shadow-md transition-all duration-200 flex h-32 md:h-36 shadow-sm"
        >
            {/* Left: Image */}
            <div className="w-32 md:w-48 h-full flex-shrink-0 relative overflow-hidden">
                 <img
                    src={card.imageUrl}
                    alt={card.title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                 />
                 {/* Type Icon Overlay */}
                 <div className="absolute top-2 left-2 bg-white/20 backdrop-blur-md p-1.5 rounded-xl text-white border border-white/30">
                    <Icon className="w-3.5 h-3.5" />
                 </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1 p-4 flex flex-col justify-between min-w-0">
                <div>
                     <div className="flex items-center justify-between mb-1">
                        <div className="flex items-center gap-2 text-xs">
                             <span className="font-black uppercase tracking-wider text-accent">{card.source}</span>
                             <span className="text-zinc-300">•</span>
                             <span className="text-zinc-400">{new Date(card.date).toLocaleDateString()}</span>
                        </div>
                        {/* Actions Row */}
                        <div className="flex items-center gap-1">
                            <button
                                onClick={handleShare}
                                className="p-1.5 text-zinc-400 hover:text-primary hover:bg-primary/5 rounded-full transition-all opacity-0 group-hover:opacity-100"
                            >
                                <ShareIcon className="w-4 h-4" />
                            </button>
                            <button
                                onClick={handleFavorite}
                                className={`p-1.5 rounded-full transition-all ${card.isFavorite ? 'text-red-500 opacity-100' : 'text-zinc-400 hover:text-red-500 hover:bg-red-50 opacity-0 group-hover:opacity-100'}`}
                            >
                                <HeartIcon className="w-4 h-4" filled={card.isFavorite} />
                            </button>
                        </div>
                     </div>
                     <h3 className="text-zinc-900 font-bold text-base leading-tight line-clamp-1 mb-1 group-hover:text-primary transition-colors">{card.title}</h3>
                     <p className="text-zinc-500 text-sm line-clamp-2 leading-relaxed">{card.description}</p>
                </div>
                {card.shoppingDetails?.price && (
                    <div className="flex items-center mt-auto">
                        <span className="text-secondary font-bold text-sm">{card.shoppingDetails.price}</span>
                    </div>
                )}
            </div>
        </div>
      );
  }

  // MASONRY / FIXED Layout (Poster Style)
  const isMasonry = layout === 'masonry';
  
  const containerClasses = isMasonry
    ? "group relative w-full rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 bg-white border border-zinc-100 hover:border-primary/50"
    : "group relative aspect-[3/4] rounded-2xl overflow-hidden cursor-pointer shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-0.5 bg-white border border-zinc-100 hover:border-primary/50";

  const imgClasses = isMasonry
    ? "w-full h-auto object-cover block transition-transform duration-700 group-hover:scale-105"
    : "absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105";

  return (
    <div 
      onClick={() => onCardClick(card)}
      className={containerClasses}
    >
      {/* Background Image */}
      <img 
        src={card.imageUrl} 
        alt={card.title} 
        className={imgClasses}
      />

      {/* Cinematic Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

      {/* Top Left: Type Icon & Price */}
      <div className="absolute top-3 left-3 flex items-center gap-2 z-10">
        <div className="bg-black/40 backdrop-blur-md p-1.5 rounded-lg text-white border border-white/10 shadow-sm">
           <Icon className="w-3.5 h-3.5" />
        </div>
        {card.shoppingDetails?.price && (
            <div className="px-2 py-1 bg-green-500/90 backdrop-blur-md text-white text-[10px] font-bold rounded-md shadow-sm">
                {card.shoppingDetails.price}
            </div>
        )}
      </div>

      {/* Top Right: Actions */}
      <div className="absolute top-3 right-3 flex gap-2 z-10">
         <button 
            onClick={handleShare}
            className="p-1.5 bg-black/40 backdrop-blur-md rounded-full text-white hover:bg-white hover:text-black transition-all opacity-0 group-hover:opacity-100"
         >
            <ShareIcon className="w-3.5 h-3.5" />
         </button>
         <button 
            onClick={handleFavorite}
            className={`p-1.5 bg-black/40 backdrop-blur-md rounded-full transition-all ${card.isFavorite ? 'text-red-500 bg-white/10 opacity-100' : 'text-white hover:bg-red-500 hover:text-white opacity-0 group-hover:opacity-100'}`}
         >
            <HeartIcon className="w-3.5 h-3.5" filled={card.isFavorite} />
         </button>
      </div>

      {/* Bottom: Title + Source */}
      <div className="absolute bottom-0 left-0 right-0 p-4 z-10">
        <h3 className="text-white font-bold text-sm leading-snug line-clamp-3 drop-shadow-md">
          {card.title}
        </h3>
        {card.source && (
          <p className="text-[10px] font-black uppercase tracking-widest mt-1 text-accent">{card.source}</p>
        )}
      </div>
    </div>
  );
};
