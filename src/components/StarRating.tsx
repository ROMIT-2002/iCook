import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';

const STAR_VALUES = [1, 2, 3, 4, 5];

// Serif descriptors shown beside the stars once a score is committed.
export const SCORE_WORDS: Record<number, string> = {
  1: 'Wanting',
  2: 'Passable',
  3: 'Accomplished',
  4: 'Refined',
  5: 'Exceptional'
};

interface StarRatingProps {
  label: string;
  value: number;
  onChange: (value: number) => void;
  disabled?: boolean;
  error?: string;
}

export const StarRating: React.FC<StarRatingProps> = ({
  label,
  value,
  onChange,
  disabled = false,
  error
}) => {
  // Hover/focus preview lights the stars without committing a score.
  const [preview, setPreview] = useState(0);
  const active = preview || value;

  const handleKeyDown = (event: React.KeyboardEvent<HTMLDivElement>) => {
    if (disabled) return;

    switch (event.key) {
      case 'ArrowRight':
      case 'ArrowUp':
        event.preventDefault();
        onChange(Math.min(5, (value || 0) + 1));
        break;
      case 'ArrowLeft':
      case 'ArrowDown':
        event.preventDefault();
        onChange(Math.max(1, (value || 1) - 1));
        break;
      case 'Home':
        event.preventDefault();
        onChange(1);
        break;
      case 'End':
        event.preventDefault();
        onChange(5);
        break;
      default:
        break;
    }
  };

  return (
    <div className="space-y-2">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-baseline">
        <span className="text-xs font-sans tracking-widest text-[#AA8654] uppercase shrink-0">
          {label} *
        </span>

        {/* Menu-style dotted leader, matching the tasting menu typography */}
        <span className="leader-dots hidden sm:block" aria-hidden="true" />

        <div className="flex items-center gap-3 shrink-0">
          <div
            role="radiogroup"
            aria-label={label}
            onKeyDown={handleKeyDown}
            onMouseLeave={() => setPreview(0)}
            className="flex items-center gap-1.5"
          >
            {STAR_VALUES.map((star) => {
              const committed = star <= value;
              const lit = star <= active;

              return (
                <motion.button
                  key={star}
                  type="button"
                  role="radio"
                  aria-checked={value === star}
                  aria-label={`${star} of 5: ${SCORE_WORDS[star]}`}
                  // Roving tab index so the group is a single stop in tab order
                  tabIndex={value === star || (value === 0 && star === 1) ? 0 : -1}
                  disabled={disabled}
                  onClick={() => onChange(star)}
                  onMouseEnter={() => !disabled && setPreview(star)}
                  onFocus={() => !disabled && setPreview(star)}
                  onBlur={() => setPreview(0)}
                  whileHover={disabled ? undefined : { scale: 1.18, y: -2 }}
                  whileTap={disabled ? undefined : { scale: 0.88 }}
                  transition={{ type: 'spring', stiffness: 400, damping: 18 }}
                  className="p-0.5 rounded-sm focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A] disabled:cursor-not-allowed"
                >
                  <Star
                    strokeWidth={1.25}
                    className={`w-6 h-6 md:w-7 md:h-7 transition-all duration-300 ${
                      committed
                        ? 'fill-[#C7AA7A] text-[#C7AA7A] drop-shadow-[0_0_7px_rgba(199,170,122,0.55)]'
                        : lit
                          ? 'fill-[#AA8654]/45 text-[#AA8654]/80'
                          : 'fill-[#AA8654]/10 text-[#AA8654]/30'
                    }`}
                  />
                </motion.button>
              );
            })}
          </div>

          {/* Fixed width so committing a score never shifts the row */}
          <span className="hidden md:block w-24 text-right font-serif italic text-sm text-[#C7AA7A] leading-none whitespace-nowrap">
            {value ? SCORE_WORDS[value] : ''}
          </span>
        </div>
      </div>

      {error && (
        <p className="text-xs text-[#E5D8C5] bg-[#401D20] px-2 py-1 border border-[#AA8654]/40">
          {error}
        </p>
      )}
    </div>
  );
};
