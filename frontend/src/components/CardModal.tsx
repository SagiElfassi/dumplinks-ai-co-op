
import React, { useState, useEffect } from 'react';
import type { CardData, ShoppingDetails, RecipeDetails, TravelDetails, RestaurantDetails, ReadLaterDetails, HealthFitnessDetails, EducationDetails, DiyCraftsDetails, ParentingDetails, FinanceDetails } from '../types';
import { CardType } from '../types';
import { Tag } from './common/Tag';
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
  PencilIcon, 
  CheckIcon, 
  MapPinIcon, 
  CalendarIcon, 
  UtensilsIcon, 
  ClockIcon, 
  FlameIcon, 
  GaugeIcon, 
  ChevronLeftIcon, 
  ChevronRightIcon,
  ShareIcon,
  HeartIcon
} from './icons/MiniIcons';
import type { ToastType } from './Toast';

interface CardModalProps {
  card: CardData;
  onClose: () => void;
  onUpdate: (card: CardData) => void;
  onDelete: (cardId: string) => void;
  onShowToast: (message: string, type: ToastType) => void;
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

// --- Helper Components for Styling ---
const DetailSection: React.FC<{ title: string; children: React.ReactNode; className?: string }> = ({ title, children, className = "mt-8" }) => (
    <div className={className}>
        <h4 className="text-xs font-bold text-gray-500 uppercase tracking-widest mb-3">{title}</h4>
        <div className="text-gray-300">{children}</div>
    </div>
);

const EditInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
    <input {...props} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 transition-all" />
);
const EditTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
    <textarea {...props} rows={4} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 placeholder-gray-500 transition-all" />
);
const EditSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
    <select {...props} className="w-full px-3 py-2 bg-gray-800 border border-gray-700 text-white rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all" />
);


// --- Display Components ---
const ShoppingDetailsDisplay: React.FC<{ details: ShoppingDetails }> = ({ details }) => (
    <div className="bg-gray-800/50 p-4 rounded-xl border border-white/5">
        {details.price && <p className="text-3xl font-bold text-primary-300 mb-1">{details.price}</p>}
        {details.rating && (
            <div className="flex items-center gap-2 mb-4">
                <span className="text-yellow-400">★</span>
                <p className="text-gray-300 font-medium">{details.rating} <span className="text-gray-500 text-sm">({details.reviewsCount} reviews)</span></p>
            </div>
        )}
        {details.topPositiveReview && <div className="mt-4"><p className="text-xs text-green-400 uppercase font-bold mb-1">Top Praise</p><p className="italic text-gray-400 border-l-2 border-green-500/30 pl-3 text-sm">"{details.topPositiveReview}"</p></div>}
        {details.topNegativeReview && <div className="mt-4"><p className="text-xs text-red-400 uppercase font-bold mb-1">Top Critique</p><p className="italic text-gray-400 border-l-2 border-red-500/30 pl-3 text-sm">"{details.topNegativeReview}"</p></div>}
    </div>
);

const ReadLaterDetailsDisplay: React.FC<{ details: ReadLaterDetails }> = ({ details }) => (
    <div className="bg-purple-900/10 p-5 rounded-xl border border-purple-500/20">
        <div className="flex items-center justify-between mb-4">
             {details.subject && (
                <span className="px-2.5 py-1 bg-purple-500/20 text-purple-200 rounded-lg text-xs font-bold uppercase tracking-wide border border-purple-500/30">
                    {details.subject}
                </span>
             )}
             {details.readTime && (
                 <div className="flex items-center gap-2 text-purple-300">
                     <ClockIcon className="w-4 h-4" />
                     <span className="text-sm font-medium">{details.readTime}</span>
                 </div>
             )}
        </div>
        {details.author && (
             <div className="flex items-center gap-2 pt-2 border-t border-purple-500/10">
                 <p className="text-xs text-gray-500 uppercase font-bold">Written By</p>
                 <p className="text-gray-200 font-medium">{details.author}</p>
             </div>
        )}
    </div>
);

const RecipeDetailsDisplay: React.FC<{ details: RecipeDetails }> = ({ details }) => {
    // Safety check: if ingredients or instructions are undefined, provide empty arrays
    const ingredients = details.ingredients || [];
    const instructions = details.instructions || [];

    return (
        <div className="bg-emerald-900/10 p-6 rounded-xl border border-emerald-500/20">
            <div className="flex flex-wrap items-center justify-between gap-4 mb-8 p-4 bg-gray-900/50 rounded-xl border border-white/5">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-gray-800 rounded-full text-emerald-400"><ClockIcon className="w-5 h-5" /></div>
                    <div>
                        <p className="text-xs text-gray-500 uppercase font-bold">Total Time</p>
                        <p className="text-sm font-semibold text-white">{details.totalTime || details.cookTime || 'N/A'}</p>
                    </div>
                </div>
                {details.difficulty && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-full text-amber-400"><GaugeIcon className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Difficulty</p>
                            <p className="text-sm font-semibold text-white">{details.difficulty}</p>
                        </div>
                    </div>
                )}
                {details.calories && (
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-gray-800 rounded-full text-red-400"><FlameIcon className="w-5 h-5" /></div>
                        <div>
                            <p className="text-xs text-gray-500 uppercase font-bold">Calories</p>
                            <p className="text-sm font-semibold text-white">{details.calories}</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                <div className="md:col-span-1">
                    <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4 border-b border-emerald-500/30 pb-2">Ingredients</h4>
                    {ingredients.length > 0 ? (
                        <ul className="space-y-3">
                            {ingredients.map((ing, i) => (
                                <li key={i} className="flex items-start gap-3 text-gray-300 text-sm group">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 group-hover:scale-150 transition-transform"></span>
                                    <span className="leading-relaxed">{ing}</span>
                                </li>
                            ))}
                        </ul>
                    ) : (
                        <p className="text-gray-500 italic text-sm">No ingredients found.</p>
                    )}
                </div>
                <div className="md:col-span-2">
                    <h4 className="text-emerald-400 font-bold uppercase tracking-wider text-sm mb-4 border-b border-emerald-500/30 pb-2">Instructions</h4>
                    {instructions.length > 0 ? (
                        <ol className="space-y-6">
                            {instructions.map((step, i) => (
                                <li key={i} className="flex gap-4">
                                    <span className="flex-shrink-0 w-8 h-8 rounded-full bg-emerald-900/50 text-emerald-400 font-bold flex items-center justify-center text-sm border border-emerald-500/20">{i + 1}</span>
                                    <p className="text-gray-300 text-sm leading-relaxed pt-1.5">{step}</p>
                                </li>
                            ))}
                        </ol>
                    ) : (
                        <p className="text-gray-500 italic text-sm">No instructions available.</p>
                    )}
                </div>
            </div>
        </div>
    );
};

const TravelDetailsDisplay: React.FC<{ details: TravelDetails }> = ({ details }) => {
    const mapsUrl = details.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;
    return (
        <div className="bg-cyan-900/10 p-5 rounded-xl border border-cyan-500/20 space-y-5">
             <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    {details.category && <span className="px-2.5 py-1 bg-cyan-500/20 text-cyan-200 rounded-lg text-xs font-bold uppercase tracking-wide border border-cyan-500/30">{details.category}</span>}
                    {details.ticketPrice && <span className="text-sm font-semibold text-green-400">{details.ticketPrice}</span>}
                 </div>
                 {details.rating && (
                     <div className="flex items-center gap-1.5 bg-gray-900/50 px-3 py-1 rounded-full border border-white/5">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-white font-bold">{details.rating}</span>
                     </div>
                 )}
            </div>
             <div className="space-y-3 pt-2">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-cyan-600 group-hover:text-white transition-colors">
                         <MapPinIcon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">{details.address}</p>
                        <p className="text-xs text-cyan-400 mt-0.5 font-medium">Open in Maps</p>
                    </div>
                </a>
                {details.openingHours && details.openingHours.length > 0 && (
                     <div className="flex items-start gap-3">
                         <div className="bg-gray-800 p-2 rounded-lg">
                             <ClockIcon className="w-5 h-5 text-gray-400" />
                         </div>
                         <div className="text-sm text-gray-300 space-y-0.5">
                             {details.openingHours.map((h, i) => <div key={i}>{h}</div>)}
                         </div>
                     </div>
                )}
            </div>
        </div>
    )
}

const RestaurantDetailsDisplay: React.FC<{ details: RestaurantDetails }> = ({ details }) => {
    const mapsUrl = details.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;
    return (
        <div className="bg-orange-900/10 p-5 rounded-xl border border-orange-500/20 space-y-5">
            <div className="flex items-center justify-between">
                 <div className="flex items-center gap-3">
                    {details.category && <span className="px-2.5 py-1 bg-orange-500/20 text-orange-200 rounded-lg text-xs font-bold uppercase tracking-wide border border-orange-500/30">{details.category}</span>}
                    {details.priceLevel && <span className="text-sm font-semibold text-green-400">{details.priceLevel}</span>}
                 </div>
                 {details.rating && (
                     <div className="flex items-center gap-1.5 bg-gray-900/50 px-3 py-1 rounded-full border border-white/5">
                        <span className="text-yellow-400 text-sm">★</span>
                        <span className="text-white font-bold">{details.rating}</span>
                     </div>
                 )}
            </div>
            {details.cuisine && details.cuisine.length > 0 && (
                <div className="flex items-center gap-2 flex-wrap">
                    <UtensilsIcon className="w-4 h-4 text-gray-400" />
                    {details.cuisine.map(c => (
                         <span key={c} className="text-xs text-gray-300 bg-gray-800 px-2 py-0.5 rounded border border-gray-700">{c}</span>
                    ))}
                </div>
            )}
            <div className="space-y-3 pt-2">
                <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
                    <div className="bg-gray-800 p-2 rounded-lg group-hover:bg-orange-600 group-hover:text-white transition-colors">
                         <MapPinIcon className="w-5 h-5 text-gray-400 group-hover:text-white" />
                    </div>
                    <div>
                        <p className="text-sm text-gray-300 group-hover:text-white transition-colors leading-snug">{details.address}</p>
                        <p className="text-xs text-orange-400 mt-0.5 font-medium">Open in Maps</p>
                    </div>
                </a>
                {details.openingHours && details.openingHours.length > 0 && (
                     <div className="flex items-start gap-3">
                         <div className="bg-gray-800 p-2 rounded-lg">
                             <ClockIcon className="w-5 h-5 text-gray-400" />
                         </div>
                         <div className="text-sm text-gray-300 space-y-0.5">
                             {details.openingHours.map((h, i) => <div key={i}>{h}</div>)}
                         </div>
                     </div>
                )}
                {details.reservationLink && (
                    <a href={details.reservationLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-600 to-amber-600 hover:from-orange-500 hover:to-amber-500 text-white font-bold rounded-lg shadow-lg shadow-orange-900/20 transition-all transform hover:scale-[1.02]">
                        <CalendarIcon className="w-4 h-4" />
                        Book a Table
                    </a>
                )}
            </div>
        </div>
    );
};

const HealthDetailsDisplay: React.FC<{ details: HealthFitnessDetails }> = ({ details }) => (
    <div className="bg-teal-900/10 p-5 rounded-xl border border-teal-500/20">
        <div className="flex flex-wrap gap-4 mb-4">
            {details.activityType && <span className="px-3 py-1 bg-teal-500/20 text-teal-200 rounded-lg text-sm font-bold">{details.activityType}</span>}
            {details.duration && <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm flex items-center gap-2"><ClockIcon className="w-4 h-4"/> {details.duration}</span>}
            {details.difficulty && <span className="px-3 py-1 bg-gray-800 text-gray-300 rounded-lg text-sm">{details.difficulty}</span>}
        </div>
        {details.equipmentNeeded && details.equipmentNeeded.length > 0 && (
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Equipment</p>
                <div className="flex flex-wrap gap-2">
                    {details.equipmentNeeded.map(eq => <span key={eq} className="text-xs bg-gray-800 px-2 py-1 rounded text-gray-400">{eq}</span>)}
                </div>
            </div>
        )}
    </div>
);

const EducationDetailsDisplay: React.FC<{ details: EducationDetails }> = ({ details }) => (
    <div className="bg-indigo-900/10 p-5 rounded-xl border border-indigo-500/20">
        <div className="flex justify-between items-start mb-4">
            <div>
                {details.topic && <p className="text-lg font-bold text-indigo-300">{details.topic}</p>}
                {details.provider && <p className="text-sm text-gray-400">by {details.provider}</p>}
            </div>
            {details.level && <span className="px-2 py-0.5 bg-indigo-500/20 text-indigo-200 text-xs rounded border border-indigo-500/30">{details.level}</span>}
        </div>
        <div className="flex gap-4 text-sm text-gray-300">
             {details.duration && <span>⏱ {details.duration}</span>}
             {details.certification && <span>📜 Certificate</span>}
        </div>
    </div>
);

const DiyDetailsDisplay: React.FC<{ details: DiyCraftsDetails }> = ({ details }) => (
    <div className="bg-amber-900/10 p-5 rounded-xl border border-amber-500/20">
        <div className="flex gap-3 mb-4">
             {details.projectType && <span className="font-bold text-amber-400">{details.projectType}</span>}
             {details.estimatedTime && <span className="text-gray-400">• {details.estimatedTime}</span>}
        </div>
        {details.materials && details.materials.length > 0 && (
            <div>
                <p className="text-xs text-gray-500 uppercase font-bold mb-2">Materials Needed</p>
                <ul className="list-disc list-inside text-gray-300 text-sm">
                    {details.materials.map((m, i) => <li key={i}>{m}</li>)}
                </ul>
            </div>
        )}
    </div>
);

const ParentingDetailsDisplay: React.FC<{ details: ParentingDetails }> = ({ details }) => (
    <div className="bg-pink-900/10 p-5 rounded-xl border border-pink-500/20">
        <div className="flex gap-3 mb-3">
            {details.activityType && <span className="font-bold text-pink-300">{details.activityType}</span>}
            {details.ageGroup && <span className="px-2 py-0.5 bg-pink-500/20 text-pink-200 rounded text-xs border border-pink-500/30 self-center">{details.ageGroup}</span>}
        </div>
         {details.itemsNeeded && details.itemsNeeded.length > 0 && (
            <p className="text-sm text-gray-400">Needs: {details.itemsNeeded.join(', ')}</p>
        )}
    </div>
);

const FinanceDetailsDisplay: React.FC<{ details: FinanceDetails }> = ({ details }) => (
    <div className="bg-green-900/10 p-5 rounded-xl border border-green-500/20">
        <div className="flex justify-between items-center mb-3">
            {details.category && <span className="text-green-400 font-bold uppercase text-sm tracking-wide">{details.category}</span>}
            {details.savings && <span className="bg-green-600 text-white px-2 py-1 rounded text-sm font-bold">{details.savings}</span>}
        </div>
        {details.promoCode && (
            <div className="bg-gray-800/80 p-3 rounded border border-dashed border-gray-600 text-center">
                <p className="text-xs text-gray-500 uppercase">Promo Code</p>
                <p className="text-xl font-mono text-white tracking-widest">{details.promoCode}</p>
            </div>
        )}
        {details.expiryDate && <p className="text-xs text-gray-500 mt-2 text-right">Expires: {details.expiryDate}</p>}
    </div>
);


export const CardModal: React.FC<CardModalProps> = ({ card, onClose, onUpdate, onDelete, onShowToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCard, setEditableCard] = useState<CardData>({...card});
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  // Construct gallery from current editable state so preview updates live
  const gallery = [editableCard.imageUrl, ...(Array.isArray(editableCard.additionalImages) ? editableCard.additionalImages : [])].filter(Boolean);
  const hasMultipleImages = gallery.length > 1;

  useEffect(() => {
    setEditableCard({...card});
    setIsEditing(false);
    setCurrentImageIndex(0);
  }, [card]);
  
  const IconComponent = CardTypeIconMap[editableCard.cardType] || OtherIcon;

  const handleNextImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (gallery.length > 0) {
          setCurrentImageIndex((prev) => (prev + 1) % gallery.length);
      }
  }

  const handlePrevImage = (e: React.MouseEvent) => {
      e.stopPropagation();
      if (gallery.length > 0) {
          setCurrentImageIndex((prev) => (prev - 1 + gallery.length) % gallery.length);
      }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableCard(prev => ({ ...prev, [name]: value }));
  };

  // Specific handler for Note to allow auto-save when not in global edit mode
  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const value = e.target.value;
      setEditableCard(prev => ({ ...prev, userNote: value }));
  };

  const handleNoteBlur = () => {
      // Only auto-save if we are NOT in the main edit mode
      // AND the value has actually changed from the prop
      if (!isEditing && editableCard.userNote !== card.userNote) {
          // Construct the full object to save, using current prop values for other fields to be safe
          const updated = { ...card, userNote: editableCard.userNote };
          onUpdate(updated);
      }
  };
  
  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const [detailType, field] = name.split('.'); 
    
    let finalValue: any = value;
    if (type === 'checkbox') {
        finalValue = (e.target as HTMLInputElement).checked;
    }

    setEditableCard(prev => ({
      ...prev,
      [detailType]: {
        ...(prev as any)[detailType],
        [field]: finalValue,
      }
    }));
  };
  
  const handleSave = () => {
    const finalCard = {
        ...editableCard,
        tags: Array.isArray(editableCard.tags) ? editableCard.tags : (editableCard.tags as any).split(',').map((t: string) => t.trim()).filter(Boolean),
        // Process additional images from potentially newline-separated string
        additionalImages: Array.isArray(editableCard.additionalImages) 
            ? editableCard.additionalImages 
            : (editableCard.additionalImages as any)?.split('\n').map((url: string) => url.trim()).filter(Boolean) || [],
        recipeDetails: editableCard.recipeDetails ? {
            ...editableCard.recipeDetails,
            ingredients: Array.isArray(editableCard.recipeDetails.ingredients) ? editableCard.recipeDetails.ingredients : (editableCard.recipeDetails.ingredients as any)?.split('\n').map((c: string) => c.trim()).filter(Boolean),
            instructions: Array.isArray(editableCard.recipeDetails.instructions) ? editableCard.recipeDetails.instructions : (editableCard.recipeDetails.instructions as any)?.split('\n').map((c: string) => c.trim()).filter(Boolean)
        } : undefined,
        restaurantDetails: editableCard.restaurantDetails ? {
            ...editableCard.restaurantDetails,
            cuisine: Array.isArray(editableCard.restaurantDetails.cuisine) ? editableCard.restaurantDetails.cuisine : (editableCard.restaurantDetails.cuisine as any)?.split(',').map((c: string) => c.trim()).filter(Boolean),
            openingHours: Array.isArray(editableCard.restaurantDetails.openingHours) ? editableCard.restaurantDetails.openingHours : (editableCard.restaurantDetails.openingHours as any)?.split(',').map((c: string) => c.trim()).filter(Boolean)
        } : undefined,
        travelDetails: editableCard.travelDetails ? {
             ...editableCard.travelDetails,
             openingHours: Array.isArray(editableCard.travelDetails.openingHours) ? editableCard.travelDetails.openingHours : (editableCard.travelDetails.openingHours as any)?.split(',').map((c: string) => c.trim()).filter(Boolean)
        } : undefined,
        healthFitnessDetails: editableCard.healthFitnessDetails ? {
            ...editableCard.healthFitnessDetails,
            equipmentNeeded: Array.isArray(editableCard.healthFitnessDetails.equipmentNeeded) ? editableCard.healthFitnessDetails.equipmentNeeded : (editableCard.healthFitnessDetails.equipmentNeeded as any)?.split(',').map((c: string) => c.trim()).filter(Boolean)
        } : undefined,
        diyCraftsDetails: editableCard.diyCraftsDetails ? {
            ...editableCard.diyCraftsDetails,
            materials: Array.isArray(editableCard.diyCraftsDetails.materials) ? editableCard.diyCraftsDetails.materials : (editableCard.diyCraftsDetails.materials as any)?.split('\n').map((c: string) => c.trim()).filter(Boolean)
        } : undefined,
        parentingDetails: editableCard.parentingDetails ? {
            ...editableCard.parentingDetails,
            itemsNeeded: Array.isArray(editableCard.parentingDetails.itemsNeeded) ? editableCard.parentingDetails.itemsNeeded : (editableCard.parentingDetails.itemsNeeded as any)?.split(',').map((c: string) => c.trim()).filter(Boolean)
        } : undefined
    }
    onUpdate(finalCard);
    setIsEditing(false);
    onShowToast('Changes saved successfully', 'success');
  }

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this memory?")) {
        onDelete(card.id);
    }
  }

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
    onUpdate({ ...card, isFavorite: !card.isFavorite });
    if (!card.isFavorite) {
        onShowToast('Added to favorites', 'success');
    }
  };

  const renderDetails = () => {
    switch (card.cardType) {
        case CardType.SHOPPING: return card.shoppingDetails && <ShoppingDetailsDisplay details={card.shoppingDetails} />;
        case CardType.RECIPE: return card.recipeDetails && <RecipeDetailsDisplay details={card.recipeDetails} />;
        case CardType.READ_LATER: return card.readLaterDetails && <ReadLaterDetailsDisplay details={card.readLaterDetails} />;
        case CardType.TRAVEL: return card.travelDetails && <TravelDetailsDisplay details={card.travelDetails} />;
        case CardType.RESTAURANT: return card.restaurantDetails && <RestaurantDetailsDisplay details={card.restaurantDetails} />;
        case CardType.HEALTH_FITNESS: return card.healthFitnessDetails && <HealthDetailsDisplay details={card.healthFitnessDetails} />;
        case CardType.EDUCATION: return card.educationDetails && <EducationDetailsDisplay details={card.educationDetails} />;
        case CardType.DIY_CRAFTS: return card.diyCraftsDetails && <DiyDetailsDisplay details={card.diyCraftsDetails} />;
        case CardType.PARENTING: return card.parentingDetails && <ParentingDetailsDisplay details={card.parentingDetails} />;
        case CardType.FINANCE: return card.financeDetails && <FinanceDetailsDisplay details={card.financeDetails} />;
        default: return null;
    }
  }

  const renderEditDetails = () => {
      switch (editableCard.cardType) {
          case CardType.SHOPPING:
            return (
                <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                    <EditInput name="shoppingDetails.price" value={editableCard.shoppingDetails?.price || ''} onChange={handleDetailsChange} placeholder="Price"/>
                    <EditInput name="shoppingDetails.rating" type="number" value={editableCard.shoppingDetails?.rating || ''} onChange={handleDetailsChange} placeholder="Rating"/>
                </div>
            );
          case CardType.RECIPE:
            return (
                 <div className="space-y-3 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                    <div className="grid grid-cols-2 gap-3">
                        <EditInput name="recipeDetails.prepTime" value={editableCard.recipeDetails?.prepTime || ''} onChange={handleDetailsChange} placeholder="Prep Time"/>
                        <EditInput name="recipeDetails.cookTime" value={editableCard.recipeDetails?.cookTime || ''} onChange={handleDetailsChange} placeholder="Cook Time"/>
                    </div>
                    <EditTextArea name="recipeDetails.ingredients" value={Array.isArray(editableCard.recipeDetails?.ingredients) ? editableCard.recipeDetails?.ingredients.join('\n') : editableCard.recipeDetails?.ingredients || ''} onChange={handleDetailsChange} placeholder="Ingredients (one per line)"/>
                 </div>
            );
          case CardType.READ_LATER:
            return (
                <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                    <EditInput name="readLaterDetails.author" value={editableCard.readLaterDetails?.author || ''} onChange={handleDetailsChange} placeholder="Author"/>
                    <EditInput name="readLaterDetails.readTime" value={editableCard.readLaterDetails?.readTime || ''} onChange={handleDetailsChange} placeholder="Read Time"/>
                </div>
            );
           case CardType.RESTAURANT:
             return (
                 <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                    <EditInput name="restaurantDetails.category" value={editableCard.restaurantDetails?.category || ''} onChange={handleDetailsChange} placeholder="Category"/>
                    <EditInput name="restaurantDetails.address" value={editableCard.restaurantDetails?.address || ''} onChange={handleDetailsChange} placeholder="Address"/>
                 </div>
             );
           case CardType.HEALTH_FITNESS:
               return (
                   <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                       <EditInput name="healthFitnessDetails.activityType" value={editableCard.healthFitnessDetails?.activityType || ''} onChange={handleDetailsChange} placeholder="Activity Type (Yoga, Run...)"/>
                       <EditInput name="healthFitnessDetails.duration" value={editableCard.healthFitnessDetails?.duration || ''} onChange={handleDetailsChange} placeholder="Duration"/>
                       <EditInput name="healthFitnessDetails.difficulty" value={editableCard.healthFitnessDetails?.difficulty || ''} onChange={handleDetailsChange} placeholder="Difficulty"/>
                       <EditInput name="healthFitnessDetails.equipmentNeeded" value={Array.isArray(editableCard.healthFitnessDetails?.equipmentNeeded) ? editableCard.healthFitnessDetails?.equipmentNeeded.join(', ') : editableCard.healthFitnessDetails?.equipmentNeeded || ''} onChange={handleDetailsChange} placeholder="Equipment (comma separated)"/>
                   </div>
               );
            case CardType.EDUCATION:
                return (
                    <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                        <EditInput name="educationDetails.topic" value={editableCard.educationDetails?.topic || ''} onChange={handleDetailsChange} placeholder="Topic"/>
                        <EditInput name="educationDetails.provider" value={editableCard.educationDetails?.provider || ''} onChange={handleDetailsChange} placeholder="Provider (Coursera, etc)"/>
                        <EditInput name="educationDetails.level" value={editableCard.educationDetails?.level || ''} onChange={handleDetailsChange} placeholder="Level"/>
                    </div>
                );
            case CardType.DIY_CRAFTS:
                return (
                    <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                         <EditInput name="diyCraftsDetails.projectType" value={editableCard.diyCraftsDetails?.projectType || ''} onChange={handleDetailsChange} placeholder="Project Type"/>
                         <EditInput name="diyCraftsDetails.estimatedTime" value={editableCard.diyCraftsDetails?.estimatedTime || ''} onChange={handleDetailsChange} placeholder="Est. Time"/>
                         <EditTextArea name="diyCraftsDetails.materials" value={Array.isArray(editableCard.diyCraftsDetails?.materials) ? editableCard.diyCraftsDetails?.materials.join('\n') : editableCard.diyCraftsDetails?.materials || ''} onChange={handleDetailsChange} placeholder="Materials (one per line)"/>
                    </div>
                );
            case CardType.PARENTING:
                return (
                    <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                        <EditInput name="parentingDetails.activityType" value={editableCard.parentingDetails?.activityType || ''} onChange={handleDetailsChange} placeholder="Activity Type"/>
                        <EditInput name="parentingDetails.ageGroup" value={editableCard.parentingDetails?.ageGroup || ''} onChange={handleDetailsChange} placeholder="Age Group"/>
                    </div>
                );
            case CardType.FINANCE:
                return (
                    <div className="space-y-2 bg-gray-800/30 p-4 rounded-lg border border-dashed border-gray-700">
                        <EditInput name="financeDetails.category" value={editableCard.financeDetails?.category || ''} onChange={handleDetailsChange} placeholder="Category"/>
                        <EditInput name="financeDetails.savings" value={editableCard.financeDetails?.savings || ''} onChange={handleDetailsChange} placeholder="Savings / Deal"/>
                        <EditInput name="financeDetails.promoCode" value={editableCard.financeDetails?.promoCode || ''} onChange={handleDetailsChange} placeholder="Promo Code"/>
                    </div>
                );
          default:
            return null;
      }
  }

  return (
    <div 
        className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        onClick={onClose}
    >
      <div 
          className="bg-gray-900 rounded-2xl shadow-2xl border border-gray-800 max-w-4xl w-full max-h-[90vh] flex flex-col md:flex-row overflow-hidden"
          onClick={(e) => e.stopPropagation()}
      >
        {/* --- LEFT COLUMN: IMAGE CAROUSEL --- */}
        <div className="w-full md:w-5/12 flex-shrink-0 relative bg-gray-950 group">
              <img 
                src={gallery[currentImageIndex] || editableCard.imageUrl} 
                alt={editableCard.title} 
                className="w-full h-64 md:h-full object-cover opacity-90 transition-opacity duration-300" 
              />
               <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent md:bg-gradient-to-r"></div>
               
               {/* Carousel Navigation */}
               {hasMultipleImages && (
                   <>
                       <button 
                         onClick={handlePrevImage}
                         className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                       >
                           <ChevronLeftIcon className="w-6 h-6" />
                       </button>
                       <button 
                         onClick={handleNextImage}
                         className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/50 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/70"
                       >
                           <ChevronRightIcon className="w-6 h-6" />
                       </button>
                       {/* Dots Indicator */}
                       <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
                           {gallery.map((_, idx) => (
                               <div 
                                 key={idx} 
                                 className={`w-2 h-2 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-110' : 'bg-white/40'}`}
                               />
                           ))}
                       </div>
                   </>
               )}
        </div>

        {/* --- RIGHT COLUMN: CONTENT --- */}
        <div className="p-6 md:p-10 flex-grow overflow-y-auto min-h-0 custom-scrollbar">
            <div className="flex items-start justify-between gap-4 mb-6">
              { isEditing ? (
                 <div className="flex-grow space-y-3">
                     <EditInput name="title" value={editableCard.title} onChange={handleInputChange} placeholder="Title" className="text-lg font-bold" />
                     <EditInput name="source" value={editableCard.source} onChange={handleInputChange} placeholder="Source" />
                 </div>
              ) : (
                <div>
                    <div className="flex items-center gap-2 mb-3">
                        <div className="bg-gray-800 p-1.5 rounded-lg">
                             <IconComponent className="w-4 h-4 text-primary-400" />
                        </div>
                        <p className="text-xs text-primary-400 font-bold uppercase tracking-wider">{editableCard.source}</p>
                        <span className="text-gray-600">•</span>
                        <p className="text-xs text-gray-500 font-medium uppercase tracking-wider">{new Date(editableCard.date).toLocaleDateString()}</p>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-bold text-white leading-tight">{editableCard.title}</h2>
                </div>
              )}
              <div className="flex items-center gap-2 flex-shrink-0 -mt-1">
                    {isEditing ? (
                        <>
                            <button onClick={handleDelete} className="text-red-400 hover:text-red-300 bg-red-900/20 hover:bg-red-900/40 transition-colors p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                            </button>
                            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                            <button onClick={handleSave} className="bg-primary-600 hover:bg-primary-500 text-white p-2 rounded-full shadow-lg shadow-primary-900/50">
                                <CheckIcon className="w-5 h-5" />
                            </button>
                        </>
                    ) : (
                       <>
                           <button onClick={handleShare} className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 transition-colors p-2 rounded-full">
                                <ShareIcon className="w-5 h-5" />
                            </button>
                             <button onClick={handleFavorite} className={`transition-colors p-2 rounded-full ${card.isFavorite ? 'text-red-500 bg-red-900/20 hover:bg-red-900/30' : 'text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700'}`}>
                                <HeartIcon className="w-5 h-5" filled={card.isFavorite} />
                            </button>
                            <button onClick={() => setIsEditing(true)} className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 transition-colors p-2 rounded-full">
                               <PencilIcon className="w-5 h-5" />
                            </button>
                            <button onClick={onClose} className="text-gray-400 hover:text-white bg-gray-800/50 hover:bg-gray-700 transition-colors p-2 rounded-full">
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                            </button>
                       </>
                    )}
              </div>
            </div>

            <div className="space-y-6">
                <DetailSection title="Summary" className="mt-0">
                    {isEditing ? (
                        <EditTextArea name="description" value={editableCard.description} onChange={handleInputChange} placeholder="Description" className="h-32" />
                    ) : (
                        <p className="text-gray-300 leading-relaxed text-lg">{editableCard.description}</p>
                    )}
                </DetailSection>

                {isEditing && (
                    <DetailSection title="Media">
                        <div className="space-y-3">
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Cover Image</label>
                                <EditInput name="imageUrl" value={editableCard.imageUrl} onChange={handleInputChange} placeholder="https://..." />
                            </div>
                            <div>
                                <label className="text-xs text-gray-500 uppercase font-bold mb-1 block">Gallery (One URL per line)</label>
                                <EditTextArea 
                                    name="additionalImages" 
                                    value={Array.isArray(editableCard.additionalImages) ? editableCard.additionalImages.join('\n') : editableCard.additionalImages || ''} 
                                    onChange={handleInputChange} 
                                    placeholder="https://..."
                                    rows={3}
                                />
                            </div>
                        </div>
                    </DetailSection>
                )}

                {isEditing ? renderEditDetails() : renderDetails()}

                 {/* --- Notes Section (Always Editable) --- */}
                <DetailSection title="Notes">
                    <textarea 
                        name="userNote" 
                        value={editableCard.userNote || ''} 
                        onChange={handleNoteChange} 
                        onBlur={handleNoteBlur}
                        placeholder="Add your notes here..." 
                        className="w-full bg-yellow-500/5 border-l-4 border-yellow-500/40 px-3 py-2 rounded-r-lg text-gray-200 placeholder-gray-500 focus:outline-none focus:bg-yellow-500/10 transition-colors resize-none overflow-y-auto text-sm leading-relaxed min-h-[40px] max-h-[80px]"
                        rows={1}
                        onInput={(e) => {
                             e.currentTarget.style.height = 'auto';
                             e.currentTarget.style.height = e.currentTarget.scrollHeight + 'px';
                        }}
                    />
                </DetailSection>
                
                <DetailSection title={isEditing ? "Metadata" : "Tags & Intent"}>
                    {isEditing ? (
                        <div className="grid grid-cols-2 gap-4">
                            <EditSelect name="cardType" value={editableCard.cardType} onChange={handleInputChange}>
                                {Object.values(CardType).map(type => <option key={type} value={type}>{type}</option>)}
                            </EditSelect>
                            <div className="col-span-2">
                                <EditInput name="tags" value={Array.isArray(editableCard.tags) ? editableCard.tags.join(', ') : editableCard.tags} onChange={handleInputChange} placeholder="tags, comma, separated" />
                            </div>
                        </div>
                    ) : (
                        <div className="flex flex-wrap gap-2 items-center">
                            <span className={`px-3 py-1 rounded-md text-xs font-bold uppercase tracking-wide border border-white/10 bg-gray-800 text-gray-300`}>
                                {editableCard.intent.replace('_', ' ')}
                            </span>
                            {editableCard.tags.map(tag => (
                                <Tag key={tag} text={tag} isStatic />
                            ))}
                        </div>
                    )}
                </DetailSection>
            </div>

            <div className="mt-10 pt-6 border-t border-gray-800 flex justify-between items-center">
              <a href={editableCard.url} target="_blank" rel="noopener noreferrer" className="inline-flex items-center gap-2 text-primary-400 hover:text-primary-300 font-semibold transition-colors group">
                Open Original Link
                <svg className="w-4 h-4 group-hover:translate-x-1 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/><polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/></svg>
              </a>
            </div>
        </div>
      </div>
    </div>
  );
};
