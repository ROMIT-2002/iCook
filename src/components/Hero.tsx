import React from 'react';
import { motion } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

export const Hero: React.FC = () => {
  return (
    <section className="relative h-screen min-h-[640px] max-h-[1080px] flex flex-col justify-between overflow-hidden bg-[#11100E] pt-20 pb-6">
      {/* Background Photography with Dark Vignette & Grain */}
      <div className="absolute inset-0 z-0">
        <img
          src="/butter-chicken--600x600.jpg"
          alt="Culinary Feast Background"
          className="w-full h-full object-cover object-center filter brightness-[0.35] contrast-[1.15] blur-[1px] transform transition-transform duration-[10000ms] hover:scale-105"
        />
        {/* Layered Luxury Gradients */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#11100E] via-[#11100E]/70 to-transparent" />
        <div className="absolute inset-0 bg-gradient-to-r from-[#11100E]/90 via-transparent to-[#11100E]/90" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_0%,#11100E_90%)] opacity-80" />
      </div>

      {/* Hero Content Container (Centered flex column) */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center flex flex-col items-center justify-center my-auto">
        {/* Perfectly Proportioned High-Contrast iCook Crest Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.85 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="mb-4 sm:mb-5 w-28 h-28 sm:w-36 sm:h-36 md:w-44 md:h-44 rounded-2xl sm:rounded-3xl bg-gradient-to-b from-[#211A16] to-[#11100E] border-2 border-[#AA8654] shadow-[0_0_40px_rgba(170,134,84,0.4)] backdrop-blur-md p-2 flex items-center justify-center relative overflow-hidden group shrink-0"
        >
          {/* Inner Decorative Hairline Ring */}
          <div className="absolute inset-1.5 rounded-xl sm:rounded-2xl border border-[#AA8654]/40 pointer-events-none z-10" />

          <img
            src="/iCook.png"
            alt="iCook PD&M Potluck 1.0"
            className="w-full h-full object-contain scale-125 filter brightness-[2.6] contrast-[1.3] sepia-[0.4] drop-shadow-[0_0_10px_rgba(170,134,84,0.6)] transition-transform duration-500 group-hover:scale-135"
          />
        </motion.div>

        {/* Top Eyebrow */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="flex items-center gap-3 mb-3"
        >
          <span className="w-6 sm:w-8 h-[1px] bg-[#AA8654]/60" />
          <span className="text-[10px] sm:text-xs font-sans tracking-wide-editorial text-[#AA8654] uppercase font-medium">
            A PRIVATE TABLE
          </span>
          <span className="w-6 sm:w-8 h-[1px] bg-[#AA8654]/60" />
        </motion.div>

        {/* Main Serif Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif text-4xl sm:text-6xl md:text-7xl tracking-tight text-[#F3EBDD] font-normal leading-[1.08] mb-2 sm:mb-3"
        >
          The Potluck <span className="italic font-serif text-[#C7AA7A] font-light">Society</span>
        </motion.h1>

        {/* Italic Accent Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="font-serif italic text-xl sm:text-2xl text-[#E5D8C5]/90 mb-3 sm:mb-4 font-light"
        >
          One table · Eleven kitchens
        </motion.p>

        {/* Supporting Narrative */}
        <motion.p
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="max-w-lg text-xs sm:text-sm font-sans text-[#A79C8C] leading-relaxed font-light mb-5 sm:mb-6"
        >
          An afternoon of recipes, traditions, family secrets, and unreasonable culinary ambition: presented by the team at iCook.
        </motion.p>

        {/* Event Date Seal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.8 }}
          className="mb-5 sm:mb-6 inline-flex items-center gap-3 px-5 py-2 rounded-full border border-[#AA8654]/30 bg-[#211A16]/60 backdrop-blur-md shadow-brass"
        >
          <span className="w-2 h-2 rounded-full bg-[#AA8654] animate-pulse" />
          <span className="text-[11px] sm:text-xs font-sans tracking-aristocrat text-[#F3EBDD]">
            12 AUGUST 2026
          </span>
          <span className="text-[#AA8654]/40">•</span>
          <span className="text-[10px] sm:text-xs font-sans text-[#A79C8C] font-light">PRIVATE DINING</span>
        </motion.div>

        {/* Call To Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.95 }}
          className="flex flex-col sm:flex-row items-center gap-3 sm:gap-4 w-full sm:w-auto"
        >
          <a
            href="#menu"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#AA8654] hover:bg-[#c49d63] text-[#11100E] font-sans text-xs tracking-aristocrat font-semibold transition-all duration-300 shadow-xl hover:shadow-[0_0_25px_rgba(170,134,84,0.4)] flex items-center justify-center gap-2.5 group"
          >
            <span>DISCOVER THE MENU</span>
            <ArrowRight className="w-3.5 h-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </a>

          <a
            href="#reservations"
            className="w-full sm:w-auto px-7 py-3.5 bg-[#401D20]/80 hover:bg-[#58272b] text-[#F3EBDD] border border-[#AA8654]/40 hover:border-[#AA8654] font-sans text-xs tracking-aristocrat font-medium transition-all duration-300 backdrop-blur-sm"
          >
            RESERVE YOUR PLACE
          </a>
        </motion.div>
      </div>

      {/* Guaranteed Viewport Scroll Indicator (Always visible on screen 1) */}
      <motion.a
        href="#gathering"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.1, duration: 0.8 }}
        className="relative z-10 flex flex-col items-center gap-1.5 text-[#A79C8C] hover:text-[#AA8654] transition-colors group cursor-pointer mt-auto shrink-0"
      >
        <span className="text-[9px] sm:text-[10px] font-sans tracking-widest uppercase opacity-70 group-hover:opacity-100">
          EXPLORE EXPERIENCE
        </span>
        <motion.div
          animate={{ y: [0, 4, 0] }}
          transition={{ repeat: Infinity, duration: 2, ease: 'easeInOut' }}
        >
          <ChevronDown className="w-3.5 h-3.5 text-[#AA8654]" />
        </motion.div>
      </motion.a>
    </section>
  );
};
