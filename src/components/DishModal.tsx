import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, User, Info } from 'lucide-react';
import { MenuItemData } from '../data/menu';
import { DietaryTag } from './DietaryTag';

interface DishModalProps {
  dish: MenuItemData | null;
  onClose: () => void;
}

export const DishModal: React.FC<DishModalProps> = ({ dish, onClose }) => {
  const [selectedVariant, setSelectedVariant] = useState<'primary' | 'secondary'>('primary');

  if (!dish) return null;

  const currentImage = selectedVariant === 'primary' 
    ? (dish.image || null) 
    : (dish.secondaryImage || dish.alternativeImage || dish.image || null);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-[#11100E]/90 backdrop-blur-md"
        />

        {/* Modal Window */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
          className="relative w-full max-w-3xl bg-[#211A16] border border-[#AA8654]/40 shadow-2xl overflow-hidden z-10 text-[#F3EBDD] my-8"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-9 h-9 rounded-full bg-[#11100E]/70 text-[#E5D8C5] hover:text-[#AA8654] border border-[#AA8654]/30 flex items-center justify-center transition-colors"
            aria-label="Close dish preview"
          >
            <X className="w-5 h-5" />
          </button>

          <div className="grid grid-cols-1 md:grid-cols-2">
            {/* Dish Imagery */}
            <div className="relative min-h-[280px] md:min-h-[420px] bg-[#11100E]">
              {currentImage ? (
                <img
                  src={currentImage}
                  alt={dish.dishName}
                  className="w-full h-full object-cover object-center"
                />
              ) : (
                <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-gradient-to-br from-[#211A16] to-[#11100E] text-center border-r border-[#AA8654]/20">
                  <Sparkles className="w-10 h-10 text-[#AA8654]/40 mb-3" />
                  <p className="font-serif text-lg text-[#E5D8C5]">Selection Forthcoming</p>
                  <p className="text-xs font-sans text-[#A79C8C] mt-1">Courtesy of the kitchen</p>
                </div>
              )}

              {/* Status Badge overlay */}
              <div className="absolute top-4 left-4">
                <span className={`text-[10px] font-sans tracking-widest uppercase px-3 py-1 border backdrop-blur-md font-medium ${
                  dish.status === 'TENTATIVE' 
                    ? 'bg-[#401D20]/80 text-[#E5D8C5] border-[#AA8654]/50'
                    : 'bg-[#11100E]/80 text-[#AA8654] border-[#AA8654]/40'
                }`}>
                  {dish.status === 'TENTATIVE' ? 'TENTATIVE COURSE' : 'CONFIRMED COURSE'}
                </span>
              </div>
            </div>

            {/* Dish Information */}
            <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
              <div>
                <div className="text-[11px] font-sans tracking-widest text-[#AA8654] uppercase mb-2">
                  {dish.course} · {dish.contributorNote || `Prepared by ${dish.contributor}`}
                </div>

                <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EBDD] leading-tight mb-4">
                  {dish.dishName}
                </h3>

                {/* Dietary Tags */}
                {dish.dietaryNotes && dish.dietaryNotes.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-6">
                    {dish.dietaryNotes.map((tag) => (
                      <DietaryTag key={tag} label={tag} />
                    ))}
                  </div>
                )}

                {/* Ingredients Section */}
                <div className="space-y-2 mb-6 pt-4 border-t border-[#AA8654]/20">
                  <div className="text-xs font-sans tracking-widest text-[#A79C8C] uppercase">
                    Disclosed Ingredients
                  </div>
                  <p className="text-sm font-sans text-[#E5D8C5]/90 leading-relaxed font-light">
                    {dish.ingredients}
                  </p>
                </div>

                {/* Tentative Dish Variant Selector if present */}
                {(dish.secondaryImage || dish.alternativeDishName) && (
                  <div className="pt-4 border-t border-[#AA8654]/20 space-y-3">
                    <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase flex items-center gap-1.5">
                      <Info className="w-3.5 h-3.5" />
                      <span>Alternative Consideration</span>
                    </div>

                    {dish.alternativeNote && (
                      <p className="text-xs font-sans text-[#A79C8C] italic">
                        {dish.alternativeNote}
                      </p>
                    )}

                    {dish.secondaryImage && (
                      <div className="flex items-center gap-2 pt-2">
                        <button
                          onClick={() => setSelectedVariant('primary')}
                          className={`px-3 py-1 text-xs font-sans rounded border transition-all ${
                            selectedVariant === 'primary'
                              ? 'bg-[#AA8654] text-[#11100E] border-[#AA8654] font-semibold'
                              : 'bg-transparent text-[#A79C8C] border-[#AA8654]/30 hover:text-[#F3EBDD]'
                          }`}
                        >
                          Option A
                        </button>
                        <button
                          onClick={() => setSelectedVariant('secondary')}
                          className={`px-3 py-1 text-xs font-sans rounded border transition-all ${
                            selectedVariant === 'secondary'
                              ? 'bg-[#AA8654] text-[#11100E] border-[#AA8654] font-semibold'
                              : 'bg-transparent text-[#A79C8C] border-[#AA8654]/30 hover:text-[#F3EBDD]'
                          }`}
                        >
                          Option B
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Contributor Footer */}
              <div className="pt-4 border-t border-[#AA8654]/20 flex items-center justify-between text-xs font-sans text-[#A79C8C]">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-[#AA8654]" />
                  <span>Contributor: <strong className="text-[#F3EBDD] font-normal">{dish.contributor}</strong></span>
                </div>
                <span>August 12, 2026</span>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
