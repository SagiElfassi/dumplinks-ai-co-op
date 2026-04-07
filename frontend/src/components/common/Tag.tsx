import React from 'react';

interface TagProps {
  text: string;
  onClick?: () => void;
  isActive?: boolean;
  isStatic?: boolean;
}

export const Tag: React.FC<TagProps> = ({ text, onClick, isActive, isStatic = false }) => {
  const baseClasses = 'px-3 py-1 text-xs font-medium rounded-full transition-colors duration-200 border border-transparent';
  // Static tags (in card modal) -> Dark gray bg, light text
  const staticClasses = 'bg-zinc-100 text-zinc-600 border-zinc-200';
  // Interactive tags (if used for filtering later) -> Primary or Gray
  const interactiveClasses = `cursor-pointer ${isActive ? 'bg-primary text-white border-primary' : 'bg-zinc-100 text-zinc-500 hover:bg-primary/10 hover:text-primary hover:border-primary/30'}`;

  return (
    <span
      className={`${baseClasses} ${isStatic ? staticClasses : interactiveClasses}`}
      onClick={!isStatic ? onClick : undefined}
    >
      #{text}
    </span>
  );
};