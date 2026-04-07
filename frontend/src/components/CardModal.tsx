
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

// ---- Edit Inputs (light theme) ----
const EditInput: React.FC<React.InputHTMLAttributes<HTMLInputElement>> = (props) => (
  <input {...props} className="w-full px-3 py-2 bg-white border border-zinc-300 text-zinc-900 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-zinc-400 transition-all text-sm" />
);
const EditTextArea: React.FC<React.TextareaHTMLAttributes<HTMLTextAreaElement>> = (props) => (
  <textarea {...props} rows={4} className="w-full px-3 py-2 bg-white border border-zinc-300 text-zinc-900 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary placeholder-zinc-400 transition-all text-sm" />
);
const EditSelect: React.FC<React.SelectHTMLAttributes<HTMLSelectElement>> = (props) => (
  <select {...props} className="w-full px-3 py-2 bg-white border border-zinc-300 text-zinc-900 rounded-xl focus:ring-2 focus:ring-primary/30 focus:border-primary transition-all text-sm" />
);

// ---- Section label ----
const SectionLabel: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <p className="font-['Space_Grotesk'] text-[0.55rem] font-bold tracking-widest text-zinc-500 mb-1 block uppercase">{children}</p>
);

// ---- Detail tile (meta box) ----
const MetaTile: React.FC<{ label: string; children: React.ReactNode }> = ({ label, children }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-3.5 rounded-2xl flex flex-col justify-between min-h-[72px]">
    <SectionLabel>{label}</SectionLabel>
    <div>{children}</div>
  </div>
);

// ---- Display components (light theme) ----
const ShoppingDetailsDisplay: React.FC<{ details: ShoppingDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-3">
    {details.price && <p className="text-2xl font-bold text-secondary">{details.price}</p>}
    {details.rating && (
      <div className="flex items-center gap-2">
        <span className="text-yellow-400">★</span>
        <p className="text-zinc-700 font-medium text-sm">{details.rating}
          {details.reviewsCount && <span className="text-zinc-400 font-normal"> ({details.reviewsCount} reviews)</span>}
        </p>
      </div>
    )}
    {details.topPositiveReview && (
      <div><p className="text-[10px] text-green-600 uppercase font-bold mb-1">Top Praise</p>
        <p className="italic text-zinc-500 border-l-2 border-green-400/40 pl-3 text-xs">"{details.topPositiveReview}"</p></div>
    )}
    {details.topNegativeReview && (
      <div><p className="text-[10px] text-red-500 uppercase font-bold mb-1">Top Critique</p>
        <p className="italic text-zinc-500 border-l-2 border-red-400/40 pl-3 text-xs">"{details.topNegativeReview}"</p></div>
    )}
  </div>
);

const ReadLaterDetailsDisplay: React.FC<{ details: ReadLaterDetails }> = ({ details }) => (
  <div className="bg-primary/5 border border-primary/10 p-4 rounded-2xl space-y-3">
    <div className="flex items-center justify-between">
      {details.subject && <span className="px-2.5 py-1 bg-primary/10 text-primary rounded-full text-xs font-bold uppercase tracking-wide border border-primary/20">{details.subject}</span>}
      {details.readTime && <div className="flex items-center gap-1.5 text-primary text-sm"><ClockIcon className="w-4 h-4" />{details.readTime}</div>}
    </div>
    {details.author && <p className="text-xs text-zinc-500">by <span className="font-semibold text-zinc-700">{details.author}</span></p>}
  </div>
);

const RecipeDetailsDisplay: React.FC<{ details: RecipeDetails }> = ({ details }) => {
  const ingredients = details.ingredients || [];
  const instructions = details.instructions || [];
  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-3 p-4 bg-zinc-50 border border-zinc-100 rounded-2xl">
        {(details.totalTime || details.cookTime) && (
          <div className="flex items-center gap-2"><div className="p-1.5 bg-white rounded-lg border border-zinc-200 text-secondary"><ClockIcon className="w-4 h-4" /></div>
            <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Time</p><p className="text-sm font-semibold text-zinc-800">{details.totalTime || details.cookTime}</p></div>
          </div>
        )}
        {details.difficulty && (
          <div className="flex items-center gap-2"><div className="p-1.5 bg-white rounded-lg border border-zinc-200 text-amber-500"><GaugeIcon className="w-4 h-4" /></div>
            <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Difficulty</p><p className="text-sm font-semibold text-zinc-800">{details.difficulty}</p></div>
          </div>
        )}
        {details.calories && (
          <div className="flex items-center gap-2"><div className="p-1.5 bg-white rounded-lg border border-zinc-200 text-red-400"><FlameIcon className="w-4 h-4" /></div>
            <div><p className="text-[10px] text-zinc-400 uppercase font-bold">Calories</p><p className="text-sm font-semibold text-zinc-800">{details.calories}</p></div>
          </div>
        )}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <div>
          <p className="text-secondary font-bold uppercase tracking-wider text-xs mb-3 border-b border-secondary/20 pb-1.5">Ingredients</p>
          {ingredients.length > 0 ? (
            <ul className="space-y-2">{ingredients.map((ing, i) => (
              <li key={i} className="flex items-start gap-2 text-zinc-600 text-xs">
                <span className="w-1.5 h-1.5 rounded-full bg-secondary mt-1.5 flex-shrink-0" />{ing}
              </li>
            ))}</ul>
          ) : <p className="text-zinc-400 italic text-xs">No ingredients found.</p>}
        </div>
        <div className="md:col-span-2">
          <p className="text-secondary font-bold uppercase tracking-wider text-xs mb-3 border-b border-secondary/20 pb-1.5">Instructions</p>
          {instructions.length > 0 ? (
            <ol className="space-y-4">{instructions.map((step, i) => (
              <li key={i} className="flex gap-3">
                <span className="flex-shrink-0 w-7 h-7 rounded-full bg-secondary/10 text-secondary font-bold flex items-center justify-center text-xs border border-secondary/20">{i + 1}</span>
                <p className="text-zinc-600 text-xs leading-relaxed pt-1">{step}</p>
              </li>
            ))}</ol>
          ) : <p className="text-zinc-400 italic text-xs">No instructions available.</p>}
        </div>
      </div>
    </div>
  );
};

const TravelDetailsDisplay: React.FC<{ details: TravelDetails }> = ({ details }) => {
  const mapsUrl = details.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;
  return (
    <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {details.category && <span className="px-2.5 py-1 bg-cyan-50 text-cyan-700 rounded-full text-xs font-bold uppercase border border-cyan-200">{details.category}</span>}
          {details.ticketPrice && <span className="text-sm font-semibold text-secondary">{details.ticketPrice}</span>}
        </div>
        {details.rating && <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-zinc-200"><span className="text-yellow-400 text-xs">★</span><span className="text-zinc-800 font-bold text-sm">{details.rating}</span></div>}
      </div>
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
        <div className="bg-white border border-zinc-200 p-2 rounded-xl group-hover:bg-cyan-500 group-hover:border-cyan-500 transition-colors">
          <MapPinIcon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
        </div>
        <div><p className="text-sm text-zinc-700 group-hover:text-primary transition-colors">{details.address}</p>
          <p className="text-xs text-cyan-500 font-medium mt-0.5">Open in Maps →</p></div>
      </a>
      {details.openingHours?.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="bg-white border border-zinc-200 p-2 rounded-xl"><ClockIcon className="w-4 h-4 text-zinc-400" /></div>
          <div className="text-xs text-zinc-600 space-y-0.5">{details.openingHours.map((h, i) => <div key={i}>{h}</div>)}</div>
        </div>
      )}
    </div>
  );
};

const RestaurantDetailsDisplay: React.FC<{ details: RestaurantDetails }> = ({ details }) => {
  const mapsUrl = details.googleMapsUrl || `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(details.address)}`;
  return (
    <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {details.category && <span className="px-2.5 py-1 bg-orange-50 text-orange-600 rounded-full text-xs font-bold uppercase border border-orange-200">{details.category}</span>}
          {details.priceLevel && <span className="text-sm font-semibold text-secondary">{details.priceLevel}</span>}
        </div>
        {details.rating && <div className="flex items-center gap-1 bg-white px-2.5 py-1 rounded-full border border-zinc-200"><span className="text-yellow-400 text-xs">★</span><span className="text-zinc-800 font-bold text-sm">{details.rating}</span></div>}
      </div>
      {details.cuisine?.length > 0 && (
        <div className="flex items-center gap-2 flex-wrap">
          <UtensilsIcon className="w-3.5 h-3.5 text-zinc-400" />
          {details.cuisine.map(c => <span key={c} className="text-xs text-zinc-600 bg-white px-2 py-0.5 rounded-full border border-zinc-200">{c}</span>)}
        </div>
      )}
      <a href={mapsUrl} target="_blank" rel="noopener noreferrer" className="flex items-start gap-3 group">
        <div className="bg-white border border-zinc-200 p-2 rounded-xl group-hover:bg-orange-500 group-hover:border-orange-500 transition-colors">
          <MapPinIcon className="w-4 h-4 text-zinc-500 group-hover:text-white" />
        </div>
        <div><p className="text-sm text-zinc-700 group-hover:text-primary transition-colors">{details.address}</p>
          <p className="text-xs text-orange-400 font-medium mt-0.5">Open in Maps →</p></div>
      </a>
      {details.openingHours?.length > 0 && (
        <div className="flex items-start gap-3">
          <div className="bg-white border border-zinc-200 p-2 rounded-xl"><ClockIcon className="w-4 h-4 text-zinc-400" /></div>
          <div className="text-xs text-zinc-600 space-y-0.5">{details.openingHours.map((h, i) => <div key={i}>{h}</div>)}</div>
        </div>
      )}
      {details.reservationLink && (
        <a href={details.reservationLink} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center gap-2 w-full py-3 bg-gradient-to-r from-orange-500 to-amber-500 hover:from-orange-400 hover:to-amber-400 text-white font-bold rounded-2xl shadow-sm transition-all text-sm">
          <CalendarIcon className="w-4 h-4" /> Book a Table
        </a>
      )}
    </div>
  );
};

const HealthDetailsDisplay: React.FC<{ details: HealthFitnessDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-3">
    <div className="flex flex-wrap gap-2">
      {details.activityType && <span className="px-3 py-1 bg-teal-50 text-teal-700 rounded-full text-xs font-bold border border-teal-200">{details.activityType}</span>}
      {details.duration && <span className="px-3 py-1 bg-white text-zinc-600 rounded-full text-xs border border-zinc-200 flex items-center gap-1"><ClockIcon className="w-3 h-3" />{details.duration}</span>}
      {details.difficulty && <span className="px-3 py-1 bg-white text-zinc-600 rounded-full text-xs border border-zinc-200">{details.difficulty}</span>}
    </div>
    {details.equipmentNeeded?.length > 0 && (
      <div><p className="text-[10px] text-zinc-400 uppercase font-bold mb-2">Equipment</p>
        <div className="flex flex-wrap gap-2">{details.equipmentNeeded.map(eq => <span key={eq} className="text-xs bg-white px-2 py-1 rounded-full border border-zinc-200 text-zinc-600">{eq}</span>)}</div>
      </div>
    )}
  </div>
);

const EducationDetailsDisplay: React.FC<{ details: EducationDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-3">
    <div className="flex justify-between items-start">
      <div>
        {details.topic && <p className="font-bold text-primary">{details.topic}</p>}
        {details.provider && <p className="text-sm text-zinc-500">by {details.provider}</p>}
      </div>
      {details.level && <span className="px-2 py-0.5 bg-primary/10 text-primary text-xs rounded-full border border-primary/20">{details.level}</span>}
    </div>
    <div className="flex gap-4 text-sm text-zinc-600">
      {details.duration && <span>⏱ {details.duration}</span>}
      {details.certification && <span>📜 Certificate</span>}
    </div>
  </div>
);

const DiyDetailsDisplay: React.FC<{ details: DiyCraftsDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-3">
    <div className="flex gap-3">
      {details.projectType && <span className="font-bold text-amber-600">{details.projectType}</span>}
      {details.estimatedTime && <span className="text-zinc-500 text-sm">• {details.estimatedTime}</span>}
    </div>
    {details.materials?.length > 0 && (
      <div><p className="text-[10px] text-zinc-400 uppercase font-bold mb-2">Materials</p>
        <ul className="list-disc list-inside text-zinc-600 text-xs space-y-1">{details.materials.map((m, i) => <li key={i}>{m}</li>)}</ul>
      </div>
    )}
  </div>
);

const ParentingDetailsDisplay: React.FC<{ details: ParentingDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-2">
    <div className="flex gap-2 items-center">
      {details.activityType && <span className="font-bold text-pink-600">{details.activityType}</span>}
      {details.ageGroup && <span className="px-2 py-0.5 bg-pink-50 text-pink-600 rounded-full text-xs border border-pink-200">{details.ageGroup}</span>}
    </div>
    {details.itemsNeeded?.length > 0 && <p className="text-xs text-zinc-500">Needs: {details.itemsNeeded.join(', ')}</p>}
  </div>
);

const FinanceDetailsDisplay: React.FC<{ details: FinanceDetails }> = ({ details }) => (
  <div className="bg-zinc-50 border border-zinc-100 p-4 rounded-2xl space-y-3">
    <div className="flex justify-between items-center">
      {details.category && <span className="text-secondary font-bold uppercase text-sm">{details.category}</span>}
      {details.savings && <span className="bg-secondary text-white px-2.5 py-1 rounded-full text-xs font-bold">{details.savings}</span>}
    </div>
    {details.promoCode && (
      <div className="bg-white p-3 rounded-xl border border-dashed border-zinc-300 text-center">
        <p className="text-[10px] text-zinc-400 uppercase mb-1">Promo Code</p>
        <p className="text-xl font-mono text-zinc-900 tracking-widest">{details.promoCode}</p>
      </div>
    )}
    {details.expiryDate && <p className="text-xs text-zinc-400 text-right">Expires: {details.expiryDate}</p>}
  </div>
);


export const CardModal: React.FC<CardModalProps> = ({ card, onClose, onUpdate, onDelete, onShowToast }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editableCard, setEditableCard] = useState<CardData>({ ...card });
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const gallery = [editableCard.imageUrl, ...(Array.isArray(editableCard.additionalImages) ? editableCard.additionalImages : [])].filter(Boolean);
  const hasMultipleImages = gallery.length > 1;

  useEffect(() => {
    setEditableCard({ ...card });
    setIsEditing(false);
    setCurrentImageIndex(0);
  }, [card]);

  const IconComponent = CardTypeIconMap[editableCard.cardType] || OtherIcon;

  const handleNextImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev + 1) % gallery.length); };
  const handlePrevImage = (e: React.MouseEvent) => { e.stopPropagation(); setCurrentImageIndex(prev => (prev - 1 + gallery.length) % gallery.length); };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setEditableCard(prev => ({ ...prev, [name]: value }));
  };

  const handleNoteChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setEditableCard(prev => ({ ...prev, userNote: e.target.value }));
  };

  const handleNoteBlur = () => {
    if (!isEditing && editableCard.userNote !== card.userNote) {
      onUpdate({ ...card, userNote: editableCard.userNote });
    }
  };

  const handleDetailsChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    const [detailType, field] = name.split('.');
    const finalValue: any = type === 'checkbox' ? (e.target as HTMLInputElement).checked : value;
    setEditableCard(prev => ({ ...prev, [detailType]: { ...(prev as any)[detailType], [field]: finalValue } }));
  };

  const handleSave = () => {
    const finalCard = {
      ...editableCard,
      tags: Array.isArray(editableCard.tags) ? editableCard.tags : (editableCard.tags as any).split(',').map((t: string) => t.trim()).filter(Boolean),
      additionalImages: Array.isArray(editableCard.additionalImages) ? editableCard.additionalImages : (editableCard.additionalImages as any)?.split('\n').map((url: string) => url.trim()).filter(Boolean) || [],
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
    };
    onUpdate(finalCard);
    setIsEditing(false);
    onShowToast('Changes saved successfully', 'success');
  };

  const handleDelete = () => {
    if (window.confirm('Are you sure you want to delete this memory?')) onDelete(card.id);
  };

  const handleShare = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (navigator.share) {
      navigator.share({ title: card.title, text: card.description, url: card.url }).catch(console.error);
    } else {
      navigator.clipboard.writeText(card.url).then(() => onShowToast('Link copied!', 'success'));
    }
  };

  const handleFavorite = (e: React.MouseEvent) => {
    e.stopPropagation();
    onUpdate({ ...card, isFavorite: !card.isFavorite });
    if (!card.isFavorite) onShowToast('Added to favorites', 'success');
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
  };

  const renderEditDetails = () => {
    switch (editableCard.cardType) {
      case CardType.SHOPPING:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="shoppingDetails.price" value={editableCard.shoppingDetails?.price || ''} onChange={handleDetailsChange} placeholder="Price" />
          <EditInput name="shoppingDetails.rating" type="number" value={editableCard.shoppingDetails?.rating || ''} onChange={handleDetailsChange} placeholder="Rating" />
        </div>;
      case CardType.RECIPE:
        return <div className="space-y-3 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <div className="grid grid-cols-2 gap-3">
            <EditInput name="recipeDetails.prepTime" value={editableCard.recipeDetails?.prepTime || ''} onChange={handleDetailsChange} placeholder="Prep Time" />
            <EditInput name="recipeDetails.cookTime" value={editableCard.recipeDetails?.cookTime || ''} onChange={handleDetailsChange} placeholder="Cook Time" />
          </div>
          <EditTextArea name="recipeDetails.ingredients" value={Array.isArray(editableCard.recipeDetails?.ingredients) ? editableCard.recipeDetails?.ingredients.join('\n') : editableCard.recipeDetails?.ingredients || ''} onChange={handleDetailsChange} placeholder="Ingredients (one per line)" />
        </div>;
      case CardType.READ_LATER:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="readLaterDetails.author" value={editableCard.readLaterDetails?.author || ''} onChange={handleDetailsChange} placeholder="Author" />
          <EditInput name="readLaterDetails.readTime" value={editableCard.readLaterDetails?.readTime || ''} onChange={handleDetailsChange} placeholder="Read Time" />
        </div>;
      case CardType.RESTAURANT:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="restaurantDetails.category" value={editableCard.restaurantDetails?.category || ''} onChange={handleDetailsChange} placeholder="Category" />
          <EditInput name="restaurantDetails.address" value={editableCard.restaurantDetails?.address || ''} onChange={handleDetailsChange} placeholder="Address" />
        </div>;
      case CardType.HEALTH_FITNESS:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="healthFitnessDetails.activityType" value={editableCard.healthFitnessDetails?.activityType || ''} onChange={handleDetailsChange} placeholder="Activity Type" />
          <EditInput name="healthFitnessDetails.duration" value={editableCard.healthFitnessDetails?.duration || ''} onChange={handleDetailsChange} placeholder="Duration" />
          <EditInput name="healthFitnessDetails.difficulty" value={editableCard.healthFitnessDetails?.difficulty || ''} onChange={handleDetailsChange} placeholder="Difficulty" />
          <EditInput name="healthFitnessDetails.equipmentNeeded" value={Array.isArray(editableCard.healthFitnessDetails?.equipmentNeeded) ? editableCard.healthFitnessDetails?.equipmentNeeded.join(', ') : editableCard.healthFitnessDetails?.equipmentNeeded || ''} onChange={handleDetailsChange} placeholder="Equipment (comma separated)" />
        </div>;
      case CardType.EDUCATION:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="educationDetails.topic" value={editableCard.educationDetails?.topic || ''} onChange={handleDetailsChange} placeholder="Topic" />
          <EditInput name="educationDetails.provider" value={editableCard.educationDetails?.provider || ''} onChange={handleDetailsChange} placeholder="Provider" />
          <EditInput name="educationDetails.level" value={editableCard.educationDetails?.level || ''} onChange={handleDetailsChange} placeholder="Level" />
        </div>;
      case CardType.DIY_CRAFTS:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="diyCraftsDetails.projectType" value={editableCard.diyCraftsDetails?.projectType || ''} onChange={handleDetailsChange} placeholder="Project Type" />
          <EditInput name="diyCraftsDetails.estimatedTime" value={editableCard.diyCraftsDetails?.estimatedTime || ''} onChange={handleDetailsChange} placeholder="Est. Time" />
          <EditTextArea name="diyCraftsDetails.materials" value={Array.isArray(editableCard.diyCraftsDetails?.materials) ? editableCard.diyCraftsDetails?.materials.join('\n') : editableCard.diyCraftsDetails?.materials || ''} onChange={handleDetailsChange} placeholder="Materials (one per line)" />
        </div>;
      case CardType.PARENTING:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="parentingDetails.activityType" value={editableCard.parentingDetails?.activityType || ''} onChange={handleDetailsChange} placeholder="Activity Type" />
          <EditInput name="parentingDetails.ageGroup" value={editableCard.parentingDetails?.ageGroup || ''} onChange={handleDetailsChange} placeholder="Age Group" />
        </div>;
      case CardType.FINANCE:
        return <div className="space-y-2 p-4 bg-zinc-50 rounded-2xl border border-zinc-200 border-dashed">
          <EditInput name="financeDetails.category" value={editableCard.financeDetails?.category || ''} onChange={handleDetailsChange} placeholder="Category" />
          <EditInput name="financeDetails.savings" value={editableCard.financeDetails?.savings || ''} onChange={handleDetailsChange} placeholder="Savings / Deal" />
          <EditInput name="financeDetails.promoCode" value={editableCard.financeDetails?.promoCode || ''} onChange={handleDetailsChange} placeholder="Promo Code" />
        </div>;
      default: return null;
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      style={{ backgroundColor: 'rgba(0,0,0,0.12)', backdropFilter: 'blur(4px)' }}
      onClick={onClose}
    >
      <div
        className="bg-white w-full max-w-4xl max-h-[92vh] rounded-[40px] relative flex flex-col overflow-hidden border border-zinc-200/50"
        style={{ boxShadow: '0px 32px 64px -16px rgba(0,0,0,0.15)' }}
        onClick={e => e.stopPropagation()}
      >
        {/* Scrollable body */}
        <div className="flex-1 overflow-y-auto relative p-6 md:p-8" style={{ scrollbarWidth: 'none' }}>

          {/* Absolute controls */}
          {isEditing ? (
            <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
              <button onClick={handleDelete} className="bg-white/80 backdrop-blur border border-zinc-200 rounded-full p-2 text-red-500 hover:bg-red-50 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M3 6h18"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
              </button>
              <button onClick={() => setIsEditing(false)} className="bg-white/80 backdrop-blur border border-zinc-200 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors shadow-sm">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
              <button onClick={handleSave} className="bg-primary text-white rounded-full p-2 shadow-md hover:bg-primary-dark transition-colors">
                <CheckIcon className="w-5 h-5" />
              </button>
            </div>
          ) : (
            <div className="absolute top-6 right-6 z-50 flex items-center gap-2">
              <button onClick={() => setIsEditing(true)} className="bg-white/80 backdrop-blur border border-zinc-200 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors shadow-sm" title="Edit">
                <PencilIcon className="w-4 h-4" />
              </button>
              <button onClick={handleShare} className="bg-white/80 backdrop-blur border border-zinc-200 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors shadow-sm" title="Share">
                <ShareIcon className="w-4 h-4" />
              </button>
              <button onClick={onClose} className="bg-white/80 backdrop-blur border border-zinc-200 rounded-full p-2 text-zinc-500 hover:bg-zinc-100 transition-colors shadow-sm" title="Close">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" /></svg>
              </button>
            </div>
          )}

          {/* Two-column layout */}
          <div className="flex flex-col md:flex-row gap-8">

            {/* Left: Image */}
            <div className="w-full md:w-[300px] shrink-0">
              <div className="relative group aspect-square rounded-[32px] overflow-hidden bg-zinc-100">
                <img
                  src={gallery[currentImageIndex] || editableCard.imageUrl}
                  alt={editableCard.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Favorite button */}
                <div className="absolute top-3 right-3">
                  <button
                    onClick={handleFavorite}
                    className="bg-white/90 backdrop-blur p-2 rounded-full shadow-sm hover:scale-110 transition-transform"
                  >
                    <HeartIcon className="w-5 h-5" filled={card.isFavorite} />
                  </button>
                </div>
                {/* Carousel nav */}
                {hasMultipleImages && (
                  <>
                    <button onClick={handlePrevImage} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                      <ChevronLeftIcon className="w-5 h-5" />
                    </button>
                    <button onClick={handleNextImage} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 bg-black/40 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-black/60">
                      <ChevronRightIcon className="w-5 h-5" />
                    </button>
                    <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
                      {gallery.map((_, idx) => (
                        <div key={idx} className={`w-1.5 h-1.5 rounded-full transition-all ${idx === currentImageIndex ? 'bg-white scale-125' : 'bg-white/50'}`} />
                      ))}
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* Right: Content */}
            <div className="flex-1 py-1 min-w-0">
              {isEditing ? (
                <div className="space-y-3 mb-5">
                  <EditInput name="title" value={editableCard.title} onChange={handleInputChange} placeholder="Title" />
                  <EditInput name="source" value={editableCard.source} onChange={handleInputChange} placeholder="Source" />
                </div>
              ) : (
                <>
                  <h1 className="text-2xl md:text-3xl font-['Space_Grotesk'] font-bold tracking-tight leading-tight max-w-sm mb-3 text-zinc-900">
                    {editableCard.title}
                  </h1>
                  <div className="flex items-center gap-3 mb-5 flex-wrap">
                    {editableCard.source && (
                      <span className="font-['Space_Grotesk'] text-[10px] font-bold tracking-[0.15em] text-accent border border-accent/30 bg-accent/5 px-3 py-1 rounded-full uppercase">
                        {editableCard.source}
                      </span>
                    )}
                    <span className="font-['Space_Grotesk'] text-[10px] font-bold tracking-widest text-zinc-400 uppercase">
                      Added {new Date(editableCard.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                    </span>
                  </div>
                </>
              )}

              <div className="space-y-5">
                {/* Meta tiles */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <MetaTile label="Type">
                    <div className="flex items-center gap-2">
                      <IconComponent className="w-4 h-4 text-primary" />
                      <span className="font-['Space_Grotesk'] text-sm font-bold text-primary uppercase">{editableCard.cardType.replace('_', ' ')}</span>
                    </div>
                  </MetaTile>

                  <MetaTile label="Notes">
                    <div className="relative group">
                      {isEditing ? (
                        <EditTextArea name="userNote" value={editableCard.userNote || ''} onChange={handleNoteChange} placeholder="Your notes..." rows={2} />
                      ) : (
                        <>
                          <p className="text-xs italic text-zinc-600 leading-snug line-clamp-2">
                            {editableCard.userNote ? `"${editableCard.userNote}"` : <span className="text-zinc-400 not-italic">No notes yet</span>}
                          </p>
                          <button
                            onClick={() => setIsEditing(true)}
                            className="absolute -bottom-1 -right-1 opacity-0 group-hover:opacity-100 transition-opacity text-[10px] font-['Space_Grotesk'] font-bold text-primary uppercase tracking-widest"
                          >
                            Edit
                          </button>
                        </>
                      )}
                    </div>
                  </MetaTile>
                </div>

                {/* Description */}
                {isEditing ? (
                  <div>
                    <SectionLabel>Description</SectionLabel>
                    <EditTextArea name="description" value={editableCard.description} onChange={handleInputChange} placeholder="Description" />
                  </div>
                ) : (
                  <p className="text-xs leading-relaxed text-zinc-600 max-w-lg">{editableCard.description}</p>
                )}

                {/* Tags */}
                {isEditing ? (
                  <div>
                    <SectionLabel>Tags (comma separated)</SectionLabel>
                    <EditInput name="tags" value={Array.isArray(editableCard.tags) ? editableCard.tags.join(', ') : editableCard.tags} onChange={handleInputChange} placeholder="tech, design, inspiration" />
                  </div>
                ) : editableCard.tags?.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-2">
                    {editableCard.tags.map(tag => (
                      <span key={tag} className="font-['Space_Grotesk'] text-[10px] font-bold tracking-wider text-primary bg-primary/10 px-2.5 py-1 rounded-full hover:bg-primary/20 transition-colors uppercase cursor-default">
                        #{tag}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Divider */}
          <hr className="border-zinc-100 my-6" />

          {/* Details section */}
          {isEditing ? (
            <div className="space-y-4">
              <SectionLabel>Type-specific details</SectionLabel>
              {renderEditDetails()}
              <div>
                <SectionLabel>Cover Image URL</SectionLabel>
                <EditInput name="imageUrl" value={editableCard.imageUrl} onChange={handleInputChange} placeholder="https://..." />
              </div>
              <div>
                <SectionLabel>Gallery (one URL per line)</SectionLabel>
                <EditTextArea name="additionalImages" value={Array.isArray(editableCard.additionalImages) ? editableCard.additionalImages.join('\n') : editableCard.additionalImages || ''} onChange={handleInputChange} placeholder="https://..." rows={3} />
              </div>
              <div>
                <SectionLabel>Card Type</SectionLabel>
                <EditSelect name="cardType" value={editableCard.cardType} onChange={handleInputChange}>
                  {Object.values(CardType).map(type => <option key={type} value={type}>{type}</option>)}
                </EditSelect>
              </div>
            </div>
          ) : (
            <div className="space-y-5">
              {/* AI Summary / description block */}
              {editableCard.description && (
                <p className="text-sm italic text-zinc-600 leading-relaxed">
                  "{editableCard.description}"
                </p>
              )}
              {renderDetails()}
            </div>
          )}

          {/* Footer */}
          <div className="mt-8 pt-5 border-t border-zinc-100 flex items-center justify-between">
            <a
              href={editableCard.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-primary hover:text-primary-dark font-semibold text-sm transition-colors group"
            >
              Open Original Link
              <svg className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" /><polyline points="15 3 21 3 21 9" /><line x1="10" y1="14" x2="21" y2="3" /></svg>
            </a>
            <span className="font-['Space_Grotesk'] text-[10px] text-zinc-400 uppercase tracking-widest">
              {editableCard.intent?.replace('_', ' ')}
            </span>
          </div>

        </div>
      </div>
    </div>
  );
};
