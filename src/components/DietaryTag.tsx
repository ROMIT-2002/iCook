import React from 'react';

interface DietaryTagProps {
  label: string;
}

export const DietaryTag: React.FC<DietaryTagProps> = ({ label }) => {
  const getBadgeStyle = (tag: string) => {
    const upper = tag.toUpperCase();
    if (upper.includes('VEGETARIAN') || upper.includes('VEGAN') || upper.includes('GLUTEN FREE')) {
      return 'bg-[#AA8654]/15 text-[#AA8654] border-[#AA8654]/40';
    }
    if (upper.includes('NUTS') || upper.includes('GLUTEN')) {
      return 'bg-[#401D20]/40 text-[#E5D8C5] border-[#AA8654]/30';
    }
    return 'bg-[#211A16]/60 text-[#A79C8C] border-[#AA8654]/25';
  };

  return (
    <span
      className={`inline-block text-[10px] font-sans tracking-widest uppercase px-2.5 py-0.5 border rounded-full font-medium transition-colors ${getBadgeStyle(
        label
      )}`}
    >
      {label}
    </span>
  );
};
