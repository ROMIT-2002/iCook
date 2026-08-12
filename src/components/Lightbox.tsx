import React, { useCallback, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, ChevronLeft, ChevronRight } from 'lucide-react';
import { PLATES, numeralFor, FINAL_NUMERAL } from '../data/gallery';

interface LightboxProps {
  /** Index into PLATES, or null when closed */
  index: number | null;
  onClose: () => void;
  onChange: (index: number) => void;
}

export const Lightbox: React.FC<LightboxProps> = ({ index, onClose, onChange }) => {
  const isOpen = index !== null;
  const plate = isOpen ? PLATES[index] : null;

  const step = useCallback(
    (delta: number) => {
      if (index === null) return;
      // Wrap so the gallery reads as a continuous loop
      onChange((index + delta + PLATES.length) % PLATES.length);
    },
    [index, onChange]
  );

  // Keyboard control: arrows to walk the plates, Escape to leave.
  useEffect(() => {
    if (!isOpen) return;

    const handleKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClose();
      } else if (event.key === 'ArrowRight') {
        step(1);
      } else if (event.key === 'ArrowLeft') {
        step(-1);
      }
    };

    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [isOpen, onClose, step]);

  // Freeze the page behind the viewer.
  useEffect(() => {
    if (!isOpen) return;
    const previous = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = previous;
    };
  }, [isOpen]);

  // Warm the neighbouring frames so stepping through feels instant.
  useEffect(() => {
    if (index === null) return;
    [(index + 1) % PLATES.length, (index - 1 + PLATES.length) % PLATES.length].forEach((i) => {
      const img = new Image();
      img.src = PLATES[i].full;
    });
  }, [index]);

  return (
    <AnimatePresence>
      {isOpen && plate && (
        <motion.div
          role="dialog"
          aria-modal="true"
          aria-label={`Plate ${numeralFor(plate.id)}: ${plate.title}`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.35 }}
          onClick={onClose}
          className="fixed inset-0 z-[100] bg-[#11100E]/97 backdrop-blur-xl flex flex-col"
        >
          {/* Ambient brass wash */}
          <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[900px] bg-[#AA8654]/10 rounded-full blur-[180px] pointer-events-none" />

          {/* Top bar */}
          <div
            className="relative z-10 flex items-center justify-between px-6 sm:px-10 py-5 border-b border-[#AA8654]/20 shrink-0"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="flex items-baseline gap-3">
              <span className="font-serif text-2xl text-[#AA8654] leading-none">
                {numeralFor(plate.id)}
              </span>
              <span className="font-serif text-base text-[#A79C8C] leading-none">
                / {FINAL_NUMERAL}
              </span>
              <span className="text-[10px] font-sans tracking-wide-editorial text-[#A79C8C] uppercase">
                Plate
              </span>
            </div>

            <div className="flex items-center gap-6">
              <button
                type="button"
                onClick={onClose}
                aria-label="Close gallery viewer"
                className="p-2 text-[#E5D8C5] hover:text-[#AA8654] transition-colors focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A]"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* Frame */}
          <div className="relative z-10 flex-1 min-h-0 flex items-center justify-center gap-3 sm:gap-6 px-3 sm:px-8 py-6">
            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(-1);
              }}
              aria-label="Previous plate"
              className="shrink-0 p-2 sm:p-3 rounded-full border border-[#AA8654]/30 bg-[#211A16]/70 text-[#E5D8C5] hover:text-[#11100E] hover:bg-[#AA8654] hover:border-[#AA8654] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A]"
            >
              <ChevronLeft className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>

            <AnimatePresence mode="wait">
              <motion.img
                key={plate.id}
                src={plate.full}
                alt={plate.caption}
                width={plate.width}
                height={plate.height}
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.97 }}
                transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
                onClick={(event) => event.stopPropagation()}
                className="max-h-full max-w-full w-auto h-auto object-contain border border-[#AA8654]/40 shadow-[0_25px_80px_-20px_rgba(0,0,0,0.9)]"
              />
            </AnimatePresence>

            <button
              type="button"
              onClick={(event) => {
                event.stopPropagation();
                step(1);
              }}
              aria-label="Next plate"
              className="shrink-0 p-2 sm:p-3 rounded-full border border-[#AA8654]/30 bg-[#211A16]/70 text-[#E5D8C5] hover:text-[#11100E] hover:bg-[#AA8654] hover:border-[#AA8654] transition-all duration-300 focus:outline-none focus-visible:ring-1 focus-visible:ring-[#C7AA7A]"
            >
              <ChevronRight className="w-5 h-5 sm:w-6 sm:h-6" />
            </button>
          </div>

          {/* Caption plate */}
          <div
            className="relative z-10 shrink-0 border-t border-[#AA8654]/20 px-6 sm:px-10 py-6 text-center"
            onClick={(event) => event.stopPropagation()}
          >
            <motion.div
              key={`${plate.id}-caption`}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="max-w-2xl mx-auto"
            >
              <h3 className="font-serif text-2xl sm:text-3xl text-[#F3EBDD] mb-1.5">
                {plate.title}
              </h3>
              <p className="font-serif italic text-sm sm:text-base text-[#E5D8C5]/75 font-light">
                {plate.caption}
              </p>
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
