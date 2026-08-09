import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, Quote, Compass } from 'lucide-react';
import { MENU_ITEMS } from '../data/menu';

export const EditorialFeatures: React.FC = () => {
  // Filter items that have real photos
  const featuredDishes = MENU_ITEMS.filter((item) => item.image);
  const [currentIndex, setCurrentIndex] = useState(0);

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % featuredDishes.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + featuredDishes.length) % featuredDishes.length);
  };

  const activeDish = featuredDishes[currentIndex];

  return (
    <section id="editorial" className="py-28 px-6 sm:px-8 bg-[#211A16] text-[#F3EBDD] relative overflow-hidden border-t border-[#AA8654]/25">
      {/* Background Decorative Accent */}
      <div className="absolute left-0 top-0 w-96 h-96 bg-[#401D20]/30 blur-[120px] pointer-events-none" />
      <div className="absolute right-0 bottom-0 w-96 h-96 bg-[#AA8654]/10 blur-[120px] pointer-events-none" />

      <div className="max-w-6xl mx-auto relative z-10">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-16 gap-6">
          <div>
            <span className="text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase block mb-3">
              EDITORIAL SPOTLIGHT
            </span>
            <h2 className="font-serif text-4xl sm:text-6xl text-[#F3EBDD] font-normal">
              Stories Behind the Dish
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-xs font-sans tracking-widest text-[#A79C8C]">
              0{currentIndex + 1} / 0{featuredDishes.length}
            </span>
            <div className="flex items-center gap-2">
              <button
                onClick={handlePrev}
                aria-label="Previous Spotlight"
                className="w-10 h-10 rounded-full border border-[#AA8654]/40 hover:border-[#AA8654] hover:bg-[#AA8654] hover:text-[#11100E] transition-all flex items-center justify-center text-[#F3EBDD]"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={handleNext}
                aria-label="Next Spotlight"
                className="w-10 h-10 rounded-full border border-[#AA8654]/40 hover:border-[#AA8654] hover:bg-[#AA8654] hover:text-[#11100E] transition-all flex items-center justify-center text-[#F3EBDD]"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Feature Spotlight Carousel Card */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeDish.id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center bg-[#11100E]/80 rounded-2xl border border-[#AA8654]/30 p-6 sm:p-10 shadow-2xl"
          >
            {/* Image Side */}
            <div className="lg:col-span-7 relative h-[320px] sm:h-[440px] rounded-xl overflow-hidden shadow-2xl group">
              <img
                src={activeDish.image!}
                alt={activeDish.dishName}
                className="w-full h-full object-cover object-center filter brightness-95 contrast-[1.08] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#11100E]/80 via-transparent to-transparent" />
              <div className="absolute bottom-4 left-4 right-4 flex items-center justify-between text-xs font-sans text-[#E5D8C5] backdrop-blur-md bg-[#11100E]/60 px-4 py-2 rounded-lg border border-[#AA8654]/20">
                <span className="font-serif italic text-sm">{activeDish.dishName}</span>
                <span className="tracking-widest uppercase text-[#AA8654] text-[10px]">
                  {activeDish.course}
                </span>
              </div>
            </div>

            {/* Story Content Side */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
              <div>
                <Quote className="w-10 h-10 text-[#AA8654]/40 mb-4" />
                <h3 className="font-serif text-3xl sm:text-4xl text-[#F3EBDD] font-normal leading-tight mb-4">
                  {activeDish.dishName}
                </h3>
                <p className="text-sm font-sans text-[#E5D8C5]/90 font-light leading-relaxed mb-6">
                  {activeDish.ingredients}
                </p>
                <div className="inline-block p-4 rounded-lg bg-[#211A16] border border-[#AA8654]/30 w-full">
                  <span className="text-[10px] font-sans tracking-widest text-[#AA8654] uppercase block mb-1">
                    CRAFTED BY
                  </span>
                  <span className="font-serif text-xl text-[#F3EBDD]">
                    {activeDish.contributor}
                  </span>
                </div>
              </div>

              <div className="pt-4 border-t border-[#AA8654]/20 flex items-center justify-between text-xs font-sans text-[#A79C8C]">
                <div className="flex items-center gap-2">
                  <Compass className="w-4 h-4 text-[#AA8654]" />
                  <span>August 12, 2026</span>
                </div>
                <span className="uppercase tracking-widest text-[#AA8654]">
                  iCook Signature
                </span>
              </div>
            </div>
          </motion.div>
        </AnimatePresence>
      </div>
    </section>
  );
};
