import React from 'react';
import { motion } from 'framer-motion';
import { EVENT_METADATA } from '../data/menu';

export const EventIntro: React.FC = () => {
  return (
    <section id="gathering" className="relative py-28 px-6 sm:px-8 bg-aged-paper border-y border-[#AA8654]/30 overflow-hidden">
      {/* Editorial Watermark "12" */}
      <div className="absolute right-6 top-1/2 -translate-y-1/2 select-none pointer-events-none opacity-[0.04]">
        <span className="font-serif text-[24rem] leading-none text-[#211A16] font-extrabold">
          12
        </span>
      </div>

      <div className="max-w-4xl mx-auto text-center relative z-10">
        {/* Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-3 mb-6"
        >
          <span className="w-6 h-[1px] bg-[#AA8654]" />
          <span className="text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase font-semibold">
            THE GATHERING
          </span>
          <span className="w-6 h-[1px] bg-[#AA8654]" />
        </motion.div>

        {/* Main Headline */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="font-serif text-4xl sm:text-6xl text-[#211A16] font-normal leading-tight mb-8"
        >
          “Eleven cooks.{' '}
          <span className="italic font-serif text-[#401D20] block sm:inline">
            One unforgettable table.”
          </span>
        </motion.h2>

        {/* Narrative Copy (Em dash replaced with colon) */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.35 }}
          className="text-base sm:text-lg font-sans text-[#211A16]/80 leading-relaxed max-w-2xl mx-auto font-light mb-14"
        >
          For one afternoon, recipes from across cultures meet around a single table: a curated collection of comfort food, family traditions, ambitious experiments, and dishes worth stealing the recipe for.
        </motion.p>

        {/* Metadata Line & Stats Grid */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="pt-10 border-t border-[#AA8654]/30 grid grid-cols-2 md:grid-cols-4 gap-6 text-center"
        >
          <div className="p-4 rounded-lg bg-[#211A16]/5 border border-[#AA8654]/20">
            <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase mb-1">Date</div>
            <div className="font-serif text-xl text-[#211A16] font-semibold">AUG 12, 2026</div>
          </div>

          <div className="p-4 rounded-lg bg-[#211A16]/5 border border-[#AA8654]/20">
            <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase mb-1">Contributors</div>
            <div className="font-serif text-xl text-[#211A16] font-semibold">{EVENT_METADATA.contributorCount} Kitchens</div>
          </div>

          <div className="p-4 rounded-lg bg-[#211A16]/5 border border-[#AA8654]/20">
            <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase mb-1">Traditions</div>
            <div className="font-serif text-xl text-[#211A16] font-semibold">{EVENT_METADATA.cuisineCount} Regions</div>
          </div>

          <div className="p-4 rounded-lg bg-[#211A16]/5 border border-[#AA8654]/20">
            <div className="text-xs font-sans tracking-widest text-[#AA8654] uppercase mb-1">Format</div>
            <div className="font-serif text-xl text-[#211A16] font-semibold">One Table</div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};
